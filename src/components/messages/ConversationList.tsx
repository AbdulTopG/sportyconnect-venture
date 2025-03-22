
import React, { useState } from 'react';
import { Conversation } from '@/hooks/use-messages';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import NewConversation from './NewConversation';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversation: string | null;
  loading: boolean;
  onSelectConversation: (userId: string) => void;
  onStartNewConversation: (userId: string) => void;
  searchUsers: (query: string) => Promise<any[]>;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversation,
  loading,
  onSelectConversation,
  onStartNewConversation,
  searchUsers
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredConversations = searchQuery
    ? conversations.filter(c => 
        c.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 w-10" />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-grow">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-9"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" variant="outline" title="New message">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Message</DialogTitle>
              </DialogHeader>
              <NewConversation 
                searchUsers={searchUsers} 
                onSelectUser={(userId) => {
                  onStartNewConversation(userId);
                  setIsDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <h2 className="font-semibold text-lg mb-2">Messages</h2>
      </div>
      
      <div className="overflow-y-auto flex-grow">
        {filteredConversations.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            {searchQuery ? 'No conversations found' : 'No conversations yet'}
          </div>
        )}
        
        {filteredConversations.map(conversation => (
          <div 
            key={conversation.user_id}
            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted transition-colors ${
              activeConversation === conversation.user_id ? 'bg-muted' : ''
            }`}
            onClick={() => onSelectConversation(conversation.user_id)}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.avatar_url || undefined} alt={conversation.username || 'User'} />
              <AvatarFallback>
                {conversation.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-grow overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="font-medium truncate">
                  {conversation.username || 'Unknown User'}
                </span>
                {conversation.last_message_time && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(conversation.last_message_time), { addSuffix: true })}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                  {conversation.last_message || 'No messages yet'}
                </p>
                {conversation.unread_count > 0 && (
                  <Badge variant="default" className="ml-2">
                    {conversation.unread_count}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
