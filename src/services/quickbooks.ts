import axios from 'axios';

const QUICKBOOKS_CLIENT_ID = import.meta.env.VITE_QUICKBOOKS_CLIENT_ID;
const QUICKBOOKS_REDIRECT_URI = import.meta.env.VITE_QUICKBOOKS_REDIRECT_URI;

// Generate a random state value for OAuth security
const generateState = () => {
  return Math.random().toString(36).substring(2, 15);
};

export const getAuthorizationUrl = () => {
  const state = generateState();
  // Store state in sessionStorage for verification
  sessionStorage.setItem('qb_state', state);
  
  const scopes = [
    'com.intuit.quickbooks.accounting',
    'openid',
    'profile',
    'email',
    'phone',
    'address'
  ].join(' ');

  const params = new URLSearchParams({
    client_id: QUICKBOOKS_CLIENT_ID,
    response_type: 'code',
    scope: scopes,
    redirect_uri: QUICKBOOKS_REDIRECT_URI,
    state: state
  });

  return `https://appcenter.intuit.com/connect/oauth2?${params.toString()}`;
};

export const handleCallback = async (url: string) => {
  const urlParams = new URLSearchParams(new URL(url).search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const storedState = sessionStorage.getItem('qb_state');

  if (!code) {
    throw new Error('No authorization code received');
  }

  if (state !== storedState) {
    throw new Error('State mismatch - possible CSRF attack');
  }

  // Remove stored state
  sessionStorage.removeItem('qb_state');

  // Note: Token exchange should be done on your backend server
  // This is just a placeholder for the frontend flow
  return {
    code,
    state
  };
};

export const getCompanyInfo = async (accessToken: string) => {
  try {
    // Note: This should also be done through your backend
    // This is just a placeholder for the frontend flow
    const response = await axios.get(
      'https://sandbox-quickbooks.api.intuit.com/v3/company/{realmId}/companyinfo/{realmId}',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching company info:', error);
    throw new Error('Failed to fetch QuickBooks company info');
  }
};