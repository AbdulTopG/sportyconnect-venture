
import React, { useRef, useEffect } from 'react';
import { Message } from '@/hooks/use-messages';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, loading }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div>
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-16 w-64 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <p className="text-muted-foreground">No messages yet. Send a message to start the conversation.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 overflow-y-auto">
      {messages.map((message, index) => {
        const isCurrentUser = message.sender_id === user?.id;
        const profile = isCurrentUser ? message.sender_profile : message.receiver_profile;
        
        return (
          <div 
            key={message.id} 
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 max-w-[80%]`}>
              {!isCurrentUser && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.username || 'User'} />
                  <AvatarFallback>
                    {profile?.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {!isCurrentUser && (
                    <span className="text-sm font-medium">
                      {profile?.username || 'Unknown User'}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </span>
                </div>
                
                <div 
                  className={`p-3 rounded-lg ${
                    isCurrentUser 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
