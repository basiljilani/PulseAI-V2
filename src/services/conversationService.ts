import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export interface Message {
  id: string;
  conversation_id: string;
  text: string;
  sender: 'user' | 'ai';
  created_at: string;
  file_urls?: string[];
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export const conversationService = {
  async createConversation(user: User, title: string): Promise<Conversation | null> {
    const { data, error } = await supabase
      .from('conversations')
      .insert([
        {
          user_id: user.id,
          title,
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return null;
    }

    return data;
  },

  async getConversations(user: User): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }

    return data || [];
  },

  async addMessage(
    conversationId: string,
    text: string,
    sender: 'user' | 'ai',
    files?: File[]
  ): Promise<Message | null> {
    try {
      let fileUrls: string[] = [];

      if (files && files.length > 0) {
        for (const file of files) {
          const fileName = `${conversationId}/${Date.now()}-${file.name}`;
          const { data, error: uploadError } = await supabase.storage
            .from('chat-files')
            .upload(fileName, file);

          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            continue;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('chat-files')
            .getPublicUrl(fileName);

          fileUrls.push(publicUrl);
        }
      }

      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            text,
            sender,
            file_urls: fileUrls.length > 0 ? fileUrls : null,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding message:', error);
        return null;
      }

      // Update conversation's updated_at timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return data;
    } catch (error) {
      console.error('Error in addMessage:', error);
      return null;
    }
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return data || [];
  },

  async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      // Delete files from storage
      const { data: messages } = await supabase
        .from('messages')
        .select('file_urls')
        .eq('conversation_id', conversationId);

      if (messages) {
        for (const message of messages) {
          if (message.file_urls) {
            for (const url of message.file_urls) {
              const path = url.split('/').pop();
              if (path) {
                await supabase.storage
                  .from('chat-files')
                  .remove([`${conversationId}/${path}`]);
              }
            }
          }
        }
      }

      // Delete all messages
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', conversationId);

      if (messagesError) {
        console.error('Error deleting messages:', messagesError);
        return false;
      }

      // Delete the conversation
      const { error: conversationError } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (conversationError) {
        console.error('Error deleting conversation:', conversationError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteConversation:', error);
      return false;
    }
  },

  async updateConversationTitle(conversationId: string, title: string): Promise<boolean> {
    const { error } = await supabase
      .from('conversations')
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    if (error) {
      console.error('Error updating conversation title:', error);
      return false;
    }

    return true;
  },
};
