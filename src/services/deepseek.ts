import axios from 'axios';

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = import.meta.env.VITE_DEEPSEEK_BASE_URL;

const SYSTEM_PROMPT = `You are Pulse AI V2, a next-generation financial consulting AI engineered to rival top-tier Wall Street advisors. Your mission is to deliver premium, personalized financial strategies with precision, professionalism, and an unwavering focus on empowering users.

Core Guidelines:
- Use an empowering tone with phrases like "You're on the right track," "Let's elevate your plan"
- Simplify technical terms only when necessary, assuming high competence
- Blend honesty with motivation in critiques
- Create actionable insights and roadmaps
- Use stress-testing and scenario planning
- Integrate market awareness and tax efficiency
- Celebrate user progress and wins
- Maintain complete confidentiality

Remember to:
1. Analyze data comprehensively
2. Provide clear, actionable steps
3. Consider tax implications
4. Manage risk appropriately
5. Encourage and empower users
6. Stay focused on long-term goals

Every response should merge the rigor of a CFA® charterholder with the encouragement of a trusted mentor.`;

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: DEEPSEEK_BASE_URL,
  timeout: 60000, // 60 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to handle authentication
api.interceptors.request.use(
  (config) => {
    if (DEEPSEEK_API_KEY) {
      config.headers.Authorization = `Bearer ${DEEPSEEK_API_KEY}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error
      throw new Error(
        'Unable to connect to the AI service. Please check your internet connection and try again.'
      );
    }

    // Handle specific HTTP status codes
    switch (error.response.status) {
      case 401:
        throw new Error('Authentication failed. Please check your API key.');
      case 403:
        throw new Error('Access denied. Please verify your API permissions.');
      case 429:
        throw new Error('Too many requests. Please wait a moment and try again.');
      case 500:
        throw new Error('AI service is experiencing issues. Please try again later.');
      case 503:
        throw new Error('AI service is temporarily unavailable. Please try again later.');
      default:
        throw new Error(
          error.response.data?.error?.message || 
          'An unexpected error occurred. Please try again.'
        );
    }
  }
);

// Retry mechanism for failed requests
const withRetry = async (fn: () => Promise<any>, retries = 2, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0 || (error instanceof Error && error.message.includes('Authentication failed'))) {
      throw error;
    }
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
};

export const generateAIResponse = async (message: string): Promise<string> => {
  try {
    // Validate API configuration
    if (!DEEPSEEK_API_KEY || !DEEPSEEK_BASE_URL) {
      throw new Error('DeepSeek API configuration is missing. Please check your environment variables.');
    }

    // Make the API request with retry mechanism
    const response = await withRetry(() => 
      api.post('/v1/chat/completions', {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    );

    // Validate response format
    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from AI service');
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    // Log error for debugging (in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('DeepSeek API Error:', error);
    }

    // Re-throw the error with a user-friendly message
    throw error instanceof Error ? error : new Error('An unexpected error occurred');
  }
};