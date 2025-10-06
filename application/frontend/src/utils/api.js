/**
 * API utilities for communicating with the backend API
 * The backend proxies requests to Databricks to keep credentials secure
 */

// API base URL - defaults to current origin for Databricks Apps
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

/**
 * Send a message to the agent via backend API
 * @param {Array} messages - Array of message objects with role and content
 * @returns {Promise<Object>} - Response from the agent
 */
export const sendMessageToAgent = async (messages) => {
  const url = `${API_BASE_URL}/api/chat`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          `Agent request failed with status ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling agent:', error);
    throw error;
  }
};

/**
 * Check if the agent endpoint is configured and accessible
 * @returns {Promise<Object>} - Health status
 */
export const checkAgentHealth = async () => {
  try {
    const url = `${API_BASE_URL}/api/health`;
    
    const response = await fetch(url, {
      method: 'GET',
    });

    if (response.ok) {
      const data = await response.json();
      return {
        status: data.configured ? 'healthy' : 'unconfigured',
        message: data.configured 
          ? `Connected to endpoint: ${data.endpoint}` 
          : 'Databricks credentials not configured on server',
        endpoint: data.endpoint,
      };
    } else {
      return {
        status: 'error',
        message: `Unable to reach backend (${response.status})`,
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: error.message || 'Connection error',
    };
  }
};

/**
 * Get sample queries from backend
 * @returns {Promise<Array>} - Array of sample query strings
 */
export const getSampleQueries = async () => {
  try {
    const url = `${API_BASE_URL}/api/samples`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      return data.samples || [];
    }
  } catch (error) {
    console.error('Error fetching samples:', error);
  }
  
  // Fallback samples if API call fails
  return [
    'What medications has patient 4baf3314e4a181c5effcf2751fbe1e21 been prescribed?',
    'What are the diagnosis codes for patient 4baf3314e4a181c5effcf2751fbe1e21?',
    'Show me the medical claims for patient 4baf3314e4a181c5effcf2751fbe1e21 on 2021-12-21',
    'What procedures has patient 4baf3314e4a181c5effcf2751fbe1e21 had performed?',
    'What is the enrollment information for patient 4baf3314e4a181c5effcf2751fbe1e21?',
  ];
};

