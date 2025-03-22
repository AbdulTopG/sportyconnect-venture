
import { Profile } from "@/integrations/supabase/client";

// Extend the Supabase types for TypeScript support
declare module '@supabase/supabase-js' {
  interface Database {
    public: {
      Tables: {
        messages: {
          Row: {
            id: string;
            sender_id: string;
            receiver_id: string;
            content: string;
            created_at: string;
            read: boolean;
          };
          Insert: {
            id?: string;
            sender_id: string;
            receiver_id: string;
            content: string;
            created_at?: string;
            read?: boolean;
          };
          Update: {
            id?: string;
            sender_id?: string;
            receiver_id?: string;
            content?: string;
            created_at?: string;
            read?: boolean;
          };
        };
      };
    };
  }
}

// Message type for our application
export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender_profile?: {
    username: string | null;
    avatar_url: string | null;
  } | null;
  receiver_profile?: {
    username: string | null;
    avatar_url: string | null;
  } | null;
};

// Conversation type for displaying in the UI
export type Conversation = {
  user_id: string;
  username: string | null;
  avatar_url: string | null;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
};
