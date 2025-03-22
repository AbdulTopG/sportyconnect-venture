
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search } from 'lucide-react';

interface User {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

interface NewConversationProps {
  searchUsers: (query: string) => Promise<any[]>;
  onSelectUser: (userId: string) => void;
}

const NewConversation: React.FC<NewConversationProps> = ({ 
  searchUsers, 
  onSelectUser 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setLoading(true);
        try {
          const results = await searchUsers(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error("Error searching users:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, searchUsers]);

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          autoFocus
        />
      </div>

      <div className="divide-y">
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">Searching...</div>
        ) : searchResults.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            {searchQuery.length >= 2 
              ? 'No users found' 
              : 'Type at least 2 characters to search'}
          </div>
        ) : (
          searchResults.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted transition-colors"
              onClick={() => onSelectUser(user.id)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src={user.avatar_url || undefined} 
                  alt={user.username || 'User'} 
                />
                <AvatarFallback>
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.username || 'Unknown User'}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewConversation;
