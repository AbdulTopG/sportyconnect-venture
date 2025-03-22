
import React from 'react';
import { Message } from '@/hooks/use-messages';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface ConversationViewProps {
  messages: Message[];
  activeConversation: Message['sender_profile'] | Message['receiver_profile'];
  loading: {
    messages: boolean;
    send: boolean;
  };
  onSendMessage: (content: string) => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  messages,
  activeConversation,
  loading,
  onSendMessage,
}) => {
  if (!activeConversation) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <p className="text-muted-foreground">Select a conversation or start a new one</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-3 border-b flex items-center gap-3">
        <Avatar>
          <AvatarImage 
            src={activeConversation.avatar_url || undefined} 
            alt={activeConversation.username || 'User'} 
          />
          <AvatarFallback>
            {activeConversation.username?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-medium">{activeConversation.username || 'Unknown User'}</h2>
        </div>
      </div>
      
      <div className="flex-grow overflow-hidden">
        <MessageList messages={messages} loading={loading.messages} />
      </div>
      
      <MessageInput onSendMessage={onSendMessage} loading={loading.send} />
    </div>
  );
};

export default ConversationView;
