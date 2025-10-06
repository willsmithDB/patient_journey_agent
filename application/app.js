const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Databricks configuration
const DATABRICKS_HOST = process.env.DATABRICKS_HOST || '';
const DATABRICKS_CLIENT_ID = process.env.DATABRICKS_CLIENT_ID || '';
const DATABRICKS_CLIENT_SECRET = process.env.DATABRICKS_CLIENT_SECRET || '';
const SERVING_ENDPOINT = process.env.SERVING_ENDPOINT || 'serving-endpoint';

// OAuth token cache
let cachedToken = null;
let tokenExpiry = null;

console.log('Config loaded:');
console.log('- DATABRICKS_HOST:', DATABRICKS_HOST);
console.log('- DATABRICKS_CLIENT_ID:', DATABRICKS_CLIENT_ID ? '***SET***' : 'NOT SET');
console.log('- DATABRICKS_CLIENT_SECRET:', DATABRICKS_CLIENT_SECRET ? '***SET***' : 'NOT SET');
console.log('- SERVING_ENDPOINT:', SERVING_ENDPOINT);

async function getServicePrincipalToken() {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  if (!DATABRICKS_CLIENT_ID || !DATABRICKS_CLIENT_SECRET) {
    throw new Error('Service principal credentials not configured');
  }

  const tokenUrl = `https://${DATABRICKS_HOST}/oidc/v1/token`;
  const credentials = Buffer.from(`${DATABRICKS_CLIENT_ID}:${DATABRICKS_CLIENT_SECRET}`).toString('base64');

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=all-apis',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OAuth token request failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

  console.log('Service principal OAuth token obtained');
  return cachedToken;
}

// Middleware to parse JSON
app.use(express.json());

// Serve static files from frontend build
app.use('/admin/static', express.static(path.join(__dirname, 'frontend', 'build', 'static')));

// API endpoint to get configuration (without exposing credentials)
app.get('/api/config', (req, res) => {
  res.json({
    configured: !!(DATABRICKS_HOST && DATABRICKS_CLIENT_ID && DATABRICKS_CLIENT_SECRET),
    endpoint: SERVING_ENDPOINT
  });
});

// API endpoint to proxy chat requests to Databricks
app.post('/api/chat', async (req, res) => {
  if (!DATABRICKS_HOST || !DATABRICKS_CLIENT_ID || !DATABRICKS_CLIENT_SECRET) {
    return res.status(500).json({
      error: 'Databricks configuration missing on server'
    });
  }

  try {
    const { messages } = req.body;
    const userEmail = req.headers['x-forwarded-email'];
    
    const token = await getServicePrincipalToken();
    const url = `https://${DATABRICKS_HOST}/serving-endpoints/${SERVING_ENDPOINT}/invocations`;
    
    console.log(`User: ${userEmail || 'unknown'}`);
    console.log(`Calling endpoint: ${url}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Agent request failed:', response.status, errorData);
      return res.status(response.status).json({
        error: errorData.message || `Agent request failed with status ${response.status}`
      });
    }

    const data = await response.json();
    console.log('Agent response received successfully');
    res.json(data);
  } catch (error) {
    console.error('Error calling Databricks agent:', error);
    res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
});

// API endpoint to get sample queries
app.get('/api/samples', (req, res) => {
  res.json({
    samples: [
      'What medications has patient 4baf3314e4a181c5effcf2751fbe1e21 been prescribed?',
      'What are the diagnosis codes for patient 4baf3314e4a181c5effcf2751fbe1e21?',
      'Show me the medical claims for patient 4baf3314e4a181c5effcf2751fbe1e21 on 2021-12-21',
      'What procedures has patient 4baf3314e4a181c5effcf2751fbe1e21 had performed?',
      'What is the enrollment information for patient 4baf3314e4a181c5effcf2751fbe1e21?',
    ]
  });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const configured = !!(DATABRICKS_HOST && DATABRICKS_CLIENT_ID && DATABRICKS_CLIENT_SECRET);
  
  let tokenStatus = 'not_checked';
  if (configured) {
    try {
      await getServicePrincipalToken();
      tokenStatus = 'valid';
    } catch (error) {
      tokenStatus = 'error';
      console.error('Token error:', error.message);
    }
  }
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoint: SERVING_ENDPOINT,
    configured: configured,
    oauth: tokenStatus
  });
});

// Serve React app for all admin routes
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// Root redirect to admin with cookie
app.get('/', (req, res) => {
  const appUrl = process.env.DATABRICKS_APP_URL || '';
  res.cookie('serving_endpoint', SERVING_ENDPOINT);
  res.redirect(`${appUrl}/admin/`);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Patient Journey Agent server running on port ${PORT}`);
  console.log(`Serving endpoint: ${process.env.SERVING_ENDPOINT || 'not configured'}`);
});

