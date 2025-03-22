
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Message, Conversation } from '@/types/messages';

export { type Message, type Conversation };

export const useMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState({
    messages: false,
    conversations: false,
    send: false
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Fetch conversations for the current user
  const fetchConversations = async () => {
    if (!user) return;
    
    setLoading(prev => ({ ...prev, conversations: true }));
    setError(null);
    
    try {
      // Get all messages where the current user is either sender or receiver
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          id, content, created_at, read,
          sender_id, sender_profile:profiles!sender_id(username, avatar_url),
          receiver_id, receiver_profile:profiles!receiver_id(username, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      
      if (messagesError) throw messagesError;
      
      // Process messages to get unique conversations
      const conversationsMap = new Map<string, Conversation>();
      
      messagesData?.forEach(message => {
        const isUserSender = message.sender_id === user.id;
        const otherUserId = isUserSender ? message.receiver_id : message.sender_id;
        const otherUserProfile = isUserSender ? message.receiver_profile : message.sender_profile;
        
        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, {
            user_id: otherUserId,
            username: otherUserProfile?.username,
            avatar_url: otherUserProfile?.avatar_url,
            last_message: message.content,
            last_message_time: message.created_at,
            unread_count: (!isUserSender && !message.read) ? 1 : 0
          });
        } else if (!isUserSender && !message.read) {
          // Increment unread count for messages where user is receiver and message is unread
          const conv = conversationsMap.get(otherUserId)!;
          conv.unread_count += 1;
          conversationsMap.set(otherUserId, conv);
        }
      });
      
      setConversations(Array.from(conversationsMap.values()));
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(prev => ({ ...prev, conversations: false }));
    }
  };
  
  // Fetch messages for a specific conversation
  const fetchMessages = async (otherUserId: string) => {
    if (!user) return;
    
    setLoading(prev => ({ ...prev, messages: true }));
    setError(null);
    setActiveConversation(otherUserId);
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id, content, created_at, read, sender_id, receiver_id,
          sender_profile:profiles!sender_id(username, avatar_url),
          receiver_profile:profiles!receiver_id(username, avatar_url)
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setMessages(data || []);
      
      // Mark messages as read
      const unreadMessages = data?.filter(m => 
        m.receiver_id === user.id && !m.read
      ).map(m => m.id) || [];
      
      if (unreadMessages.length > 0) {
        await supabase
          .from('messages')
          .update({ read: true })
          .in('id', unreadMessages);
          
        // Also update conversations unread counts
        fetchConversations();
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(prev => ({ ...prev, messages: false }));
    }
  };
  
  // Send a new message
  const sendMessage = async (receiverId: string, content: string) => {
    if (!user || !content.trim()) return;
    
    setLoading(prev => ({ ...prev, send: true }));
    
    try {
      const newMessage = {
        sender_id: user.id,
        receiver_id: receiverId,
        content: content.trim(),
        read: false
      };
      
      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .select();
      
      if (error) throw error;
      
      // Refresh messages and conversations
      fetchMessages(receiverId);
      fetchConversations();
      
      return data;
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
      return null;
    } finally {
      setLoading(prev => ({ ...prev, send: false }));
    }
  };
  
  // Search for users to start a new conversation
  const searchUsers = async (query: string) => {
    if (!user || !query.trim()) return [];
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .or(`username.ilike.%${query}%`)
        .neq('id', user.id)
        .limit(10);
      
      if (error) throw error;
      
      return data || [];
    } catch (err) {
      console.error('Error searching users:', err);
      toast.error('Failed to search users');
      return [];
    }
  };
  
  // Set up realtime subscription to messages
  useEffect(() => {
    if (!user || isSubscribed) return;
    
    // Subscribe to changes in the messages table
    const channel = supabase
      .channel('messages-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages',
        filter: `sender_id=eq.${user.id}:receiver_id=eq.${user.id}` 
      }, (payload) => {
        console.log('Message change received:', payload);
        
        if (payload.eventType === 'INSERT') {
          // If a new message comes in for the active conversation, refresh messages
          const message = payload.new as Message;
          if (
            (message.sender_id === user.id && message.receiver_id === activeConversation) ||
            (message.receiver_id === user.id && message.sender_id === activeConversation)
          ) {
            fetchMessages(activeConversation);
          }
          
          // Always refresh conversations list to show latest message
          fetchConversations();
          
          // If user receives a new message, show a notification
          if (message.receiver_id === user.id) {
            toast.info('You have a new message');
          }
        }
      })
      .subscribe();
    
    setIsSubscribed(true);
    
    // Clean up subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeConversation, isSubscribed]);
  
  // Initial fetch of conversations
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);
  
  return {
    conversations,
    messages,
    activeConversation,
    loading,
    error,
    fetchMessages,
    fetchConversations,
    sendMessage,
    searchUsers
  };
};
