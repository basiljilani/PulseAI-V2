import axios from 'axios';

// Configuration - Update these in your .env file
const DEEPSEEK_API_URL = import.meta.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
const DEEPSEEK_MODEL = 'deepseek-chat';

// System message template
const SYSTEM_PROMPT = `You are an empowering financial coach and mentor who believes in every person's ability to achieve financial success and wellness. 

When responding:
1. Always start with a warm, professional greeting using <strong>Welcome:</strong> format
2. Structure your responses with clear sections and white space
3. Use bullet points for options and lists
4. Keep paragraphs short and focused (2-3 lines max)
5. Add visual breaks between sections using line spacing

Format your responses like this:

<strong>Welcome:</strong>
[Brief, warm greeting in 1-2 lines]

<strong>Focus Areas:</strong>
• [Option 1]
• [Option 2]
• [Option 3]

<strong>Next Steps:</strong>
[Clear call to action or question to engage]

When reviewing documents or providing analysis:
- Format all headings as <strong>SECTION TITLE:</strong>
- Present information in clear, numbered or bulleted points
- Keep insights crisp and business-focused
- Use professional language without being overly technical
- Maintain consistent spacing between sections
- Format lists with bullet points for better readability
- End with a clear call to action

Remember to:
- Celebrate wins and progress
- Frame challenges positively
- Provide actionable insights
- Keep the tone encouraging but professional`;

interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface ChatResponse {
  success: boolean;
  message?: string;
  error?: {
    message: string;
  };
  usage?: TokenUsage;
}

interface BalanceResponse {
  success: boolean;
  available_tokens?: number;
  error?: {
    message: string;
  };
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const makeRequestWithRetry = async (
  url: string,
  options: any,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
): Promise<any> => {
  try {
    const response = await axios(url, options);
    return response;
  } catch (error: any) {
    if (retries > 0 && error.response?.status === 500) {
      console.log(`Retrying request... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await sleep(delay);
      return makeRequestWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
};

export const sendChatMessage = async (
  message: string,
  fileContent?: { name: string; content: string }
): Promise<ChatResponse> => {
  try {
    const messages: Message[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      }
    ];

    if (fileContent) {
      messages.push({
        role: 'user',
        content: `[File Analysis Request] File Name: ${fileContent.name}\nFile Content:\n${fileContent.content}\n\nPlease analyze this document and provide financial insights.`
      });
    }

    messages.push({
      role: 'user',
      content: message,
    });

    const response = await makeRequestWithRetry(
      `${DEEPSEEK_API_URL}/v1/chat/completions`,
      {
        method: 'POST',
        data: {
          model: DEEPSEEK_MODEL,
          messages,
          temperature: 0.5,
          max_tokens: 2000,
          presence_penalty: 0.1,
          frequency_penalty: 0.1,
        },
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      message: response.data.choices[0].message.content,
      usage: response.data.usage,
    };
  } catch (error: any) {
    console.error('DeepSeek API Error:', error.response?.data || error.message);
    return {
      success: false,
      error: {
        message: error.response?.data?.error?.message || 
               error.response?.statusText || 
               error.message ||
               'Failed to process request',
      },
    };
  }
};

export const getTokenBalance = async (): Promise<BalanceResponse> => {
  try {
    const response = await makeRequestWithRetry(
      `${DEEPSEEK_API_URL}/v1/account/balance`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
        },
      }
    );

    return {
      success: true,
      available_tokens: response.data.available_tokens,
    };
  } catch (error: any) {
    console.error('DeepSeek Balance Error:', error.response?.data || error.message);
    return {
      success: false,
      error: {
        message: error.response?.data?.error?.message || 
               error.response?.statusText || 
               error.message ||
               'Failed to retrieve balance',
      },
    };
  }
};