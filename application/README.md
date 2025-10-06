# Patient Journey Agent - Databricks Application

A Databricks Lakehouse application providing a chat interface for the Patient Journey Agent. Built with **React.js** (frontend) and **Node.js/Express** (backend), this application enables healthcare professionals to interact with the AI agent through a modern, intuitive web interface.

## 🏗️ Project Structure

```
application/
├── app.js              # Express server (Node.js backend)
├── app.yml             # Databricks App configuration
├── package.json        # Node.js dependencies and scripts
├── README.md           # This file
└── frontend/           # React application
    ├── src/            # React source code
    │   ├── App.js
    │   ├── components/
    │   ├── views/
    │   ├── theme/
    │   └── utils/
    ├── public/         # Static assets
    ├── package.json    # Frontend dependencies
    └── build/          # Production build (generated)
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm 9+ package manager
- Databricks workspace with the Patient Journey Agent deployed

### Local Development

1. **Install dependencies:**
   ```bash
   # Install root dependencies (Express server)
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

2. **Build the frontend:**
   ```bash
   npm run build
   ```

3. **Run the application:**
   ```bash
   npm start
   # Server runs at http://localhost:8000
   ```

4. **Development mode (with hot reload):**
   ```bash
   # Terminal 1: Start frontend dev server
   cd frontend
   npm start
   # Frontend at http://localhost:3000
   
   # Terminal 2: Start backend server
   npm run dev
   # Backend at http://localhost:8000
   ```

## 🚢 Deployment to Databricks Apps

### Build and Deploy

1. **Build the application:**
   ```bash
   npm run build
   ```
   This will:
   - Install frontend dependencies
   - Build the React app to `frontend/build/`
   - Remove source maps for production

2. **Deploy to Databricks:**
   - Navigate to your Databricks workspace
   - Go to **Apps** section
   - Click **Create App**
   - Upload the entire `application/` folder
   - Configure environment variables (see below)
   - Click **Deploy**

### Environment Variables

**IMPORTANT:** Databricks Apps automatically handles user authentication. The logged-in user's access token is available via the `X-Forwarded-Access-Token` HTTP header.

Configure these in `app.yml`:

```yaml
env:
  - name: SERVING_ENDPOINT
    value: your-agent-endpoint-name  # e.g., "patient_journey_agent"
  - name: PORT
    value: "8000"
```

**Key Environment Variables:**

*You configure:*
- `SERVING_ENDPOINT` - The name of your Databricks serving endpoint - **Configure this in app.yml**
- `PORT` - Server port (default: 8000) - **Configure this in app.yml**

*Automatically provided by Databricks Apps:*
- `DATABRICKS_HOST` - Your workspace hostname - **Do NOT add to app.yml**
- `DATABRICKS_APP_URL` - Your app's public URL
- `DATABRICKS_WORKSPACE_ID` - Workspace identifier

**Automatically provided HTTP Headers (per request):**
- `X-Forwarded-Access-Token` - Authenticated user's access token
- `X-Forwarded-Email` - User's email address
- Other user context headers

**Authentication Method:**
The app uses **user token pass-through**:
1. User logs into Databricks and opens the app
2. Databricks Apps injects `X-Forwarded-Access-Token` header with user's token
3. Backend reads the token from the header
4. Backend uses the user's token to call the serving endpoint
5. All actions performed with user's permissions

### Verify Deployment

After deployment, check:
- Health endpoint: `https://your-app-url.databricksapps.com/health`
- Main app: `https://your-app-url.databricksapps.com/admin/`

## 📋 Available Scripts

### Root Level (Node.js/Express)

- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build the frontend React app
- `npm test` - Run frontend tests

### Frontend Level

```bash
cd frontend
npm start      # Start React dev server (port 3000)
npm run build  # Build for production
npm test       # Run tests
```

## 🔧 Configuration

### app.yml (Databricks Configuration)

```yaml
command:
  - "node"
  - "app.js"

env:
  - name: SERVING_ENDPOINT
    value: serving-endpoint
  - name: PORT
    value: "8000"
```

### app.js (Express Server)

The Express server:
- Serves the React build from `/admin/*`
- Provides a health check at `/health`
- Sets cookies for the serving endpoint
- Redirects root `/` to `/admin/`

### Frontend Configuration

Located in `frontend/package.json`:
- **homepage**: `/admin` - Base path for the React app
- **build**: Builds to `frontend/build/` directory

## 🔒 Architecture & Security

This application uses a **secure proxy architecture with user authentication**:

1. **Frontend (React)**: Runs in the user's browser
   - Makes API calls to the backend (not directly to Databricks)
   - No credentials are exposed to the client

2. **Backend (Node.js/Express)**: Runs on the server
   - Receives user's access token from `X-Forwarded-Access-Token` header
   - Databricks Apps automatically injects this header with authenticated user's token
   - Proxies requests to serving endpoint using the user's token
   - All actions are performed on behalf of the authenticated user

3. **Databricks Serving Endpoint**: The AI agent
   - Receives requests with user's access token
   - Enforces user-level permissions
   - User must have "Can Query" permission on the endpoint

**Authentication Flow:**
```
1. User logs into Databricks Apps → Receives access token
2. User opens app → Databricks injects X-Forwarded-Access-Token header
3. Browser → /api/chat → Express Server (with user token) → Serving Endpoint → Response
```

**Key Benefits:**
- ✅ **User-level permissions**: Actions use the logged-in user's permissions
- ✅ **No OAuth needed**: Databricks Apps handles authentication automatically
- ✅ **Simple**: Just forward the token from headers
- ✅ **Secure**: Tokens never exposed to client-side code

## 🎯 Features

- **Modern Chat Interface**: Clean, responsive design with real-time messaging
- **Secure API Proxy**: Credentials never exposed to the browser
- **Sample Queries**: Quick-start templates for common healthcare questions
- **Real-time Status**: Connection status indicator for Databricks endpoint
- **Conversation History**: Maintains context throughout the chat session
- **Error Handling**: Graceful error messages and fallbacks
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices

## 📡 API Endpoints

### Backend API Endpoints

#### Health Check
```
GET /api/health
```
Returns server health status and configuration.
```json
{
  "status": "healthy",
  "timestamp": "2025-10-06T12:00:00.000Z",
  "endpoint": "patient_journey_agent",
  "configured": true
}
```

#### Configuration Check
```
GET /api/config
```
Returns configuration status without exposing credentials.

#### Chat with Agent
```
POST /api/chat
```
Send messages to the Databricks agent (proxied through backend).
```json
{
  "messages": [
    {
      "role": "user",
      "content": "What is the healthcare journey for patient [PATIENT_ID]?"
    }
  ]
}
```

#### Get Sample Queries
```
GET /api/samples
```
Returns array of sample healthcare queries.

### Frontend Routes

#### React Application
```
GET /admin/*
```
Serves the React single-page application.

#### Root Redirect
```
GET /
```
Redirects to `/admin/` with serving endpoint cookie.

## 🐛 Troubleshooting

### Build Issues

If the build fails:
```bash
# Clean and rebuild
cd frontend
rm -rf node_modules build
npm install
npm run build
cd ..
```

### Server Won't Start

1. Check Node.js version: `node --version` (should be 18+)
2. Verify dependencies: `npm install`
3. Check port availability: `lsof -i :8000`

### Databricks Deployment Issues

1. **"Error loading app spec from app.yml"**
   - Verify `app.yml` exists (not `app.yaml`)
   - Check YAML syntax is valid
   - Ensure `command` section is present

2. **"Module not found" errors**
   - Run `npm install` before deploying
   - Ensure `node_modules/` is included in deployment

3. **Frontend not loading**
   - Verify `frontend/build/` directory exists
   - Check that build completed successfully
   - Review `app.js` static file paths

## 🔒 Security Notes

- Never commit credentials or tokens
- Use Databricks secrets for production deployments
- Implement proper authentication for production use
- Use HTTPS in production environments
- Set appropriate CORS policies

## 📚 Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React.js, Chakra UI
- **Deployment**: Databricks Apps
- **Build Tools**: Create React App, npm

## ⚠️ Disclaimer

This application is for demonstration and research purposes. It should not be used for actual clinical decision-making without proper validation and approval from healthcare professionals and regulatory bodies.

## 🤝 Support

For questions or issues:
1. Check the troubleshooting section above
2. Review Databricks Apps logs
3. Verify all environment variables are set correctly
4. Contact your Databricks support team

