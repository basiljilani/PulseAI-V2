import { conversationService } from './conversationService';
import { generateAIResponse } from './deepseek';

export const aiService = {
  async processUserMessage(
    conversationId: string,
    userMessage: string
  ): Promise<void> {
    try {
      // First, add the user's message
      await conversationService.addMessage(
        conversationId,
        userMessage,
        'user'
      );

      // Generate AI response
      const aiResponse = await generateAIResponse(userMessage);

      // Add AI's response to the conversation
      await conversationService.addMessage(
        conversationId,
        aiResponse,
        'ai'
      );
    } catch (error) {
      console.error('Error processing message:', error);
      // Add error message to conversation
      await conversationService.addMessage(
        conversationId,
        'Sorry, I encountered an error while processing your message. Please try again.',
        'ai'
      );
    }
  }
};
