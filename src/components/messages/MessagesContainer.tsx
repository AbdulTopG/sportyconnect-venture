
import React, { useState, useEffect } from 'react';
import { useMessages, Message } from '@/hooks/use-messages';
import ConversationList from './ConversationList';
import ConversationView from './ConversationView';
import { useAuth } from '@/context/AuthContext';
import { Inbox } from 'lucide-react';

const MessagesContainer: React.FC = () => {
  const { user } = useAuth();
  const { 
    conversations,
    messages,
    activeConversation,
    loading,
    error,
    fetchMessages,
    sendMessage,
    searchUsers
  } = useMessages();
  
  const [activeProfile, setActiveProfile] = useState<Message['sender_profile'] | Message['receiver_profile']>(null);

  // Set active profile when conversation changes
  useEffect(() => {
    if (activeConversation && conversations.length > 0) {
      const conversation = conversations.find(c => c.user_id === activeConversation);
      if (conversation) {
        setActiveProfile({
          username: conversation.username,
          avatar_url: conversation.avatar_url
        });
      }
    }
  }, [activeConversation, conversations]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[500px] p-8 text-center">
        <div>
          <Inbox className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Sign in to view your messages</h3>
          <p className="text-muted-foreground">You need to be logged in to send and receive messages.</p>
        </div>
      </div>
    );
  }

  const handleSelectConversation = (userId: string) => {
    fetchMessages(userId);
  };

  const handleStartNewConversation = (userId: string) => {
    fetchMessages(userId);
  };

  const handleSendMessage = (content: string) => {
    if (activeConversation) {
      sendMessage(activeConversation, content);
    }
  };

  return (
    <div className="border rounded-lg h-[700px] overflow-hidden grid grid-cols-1 md:grid-cols-3 shadow-sm bg-card">
      <div className="border-r md:col-span-1 overflow-hidden">
        <ConversationList 
          conversations={conversations}
          activeConversation={activeConversation}
          loading={loading.conversations}
          onSelectConversation={handleSelectConversation}
          onStartNewConversation={handleStartNewConversation}
          searchUsers={searchUsers}
        />
      </div>
      
      <div className="md:col-span-2 overflow-hidden">
        <ConversationView 
          messages={messages}
          activeConversation={activeProfile}
          loading={{
            messages: loading.messages,
            send: loading.send
          }}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default MessagesContainer;
