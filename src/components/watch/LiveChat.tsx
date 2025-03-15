import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { SendHorizontal, MessageSquare, BarChart3, ThumbsUp, ThumbsDown, Heart, Flame, Zap } from 'lucide-react';

interface ChatMessage {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    role: 'user' | 'moderator' | 'admin';
  };
  message: string;
  timestamp: Date;
  isPinned?: boolean;
}

interface LiveChatProps {
  onSendMessage: (message: string) => void;
}

const dummyChatMessages: ChatMessage[] = [
  {
    id: '1',
    user: {
      id: 'user1',
      name: 'Rohit Sharma',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'admin',
    },
    message: "Welcome everyone to today's live match! 🏏",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    isPinned: true,
  },
  {
    id: '2',
    user: {
      id: 'user2',
      name: 'Ananya Patel',
      avatar: 'https://i.pravatar.cc/150?img=2',
      role: 'user',
    },
    message: "I can't believe that shot! Amazing!",
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
  },
  {
    id: '3',
    user: {
      id: 'user3',
      name: 'Vikram Singh',
      avatar: 'https://i.pravatar.cc/150?img=3',
      role: 'user',
    },
    message: "The bowling has been on point today",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: '4',
    user: {
      id: 'user4',
      name: 'Priya Desai',
      avatar: 'https://i.pravatar.cc/150?img=4',
      role: 'moderator',
    },
    message: "Please keep the chat respectful everyone!",
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
  },
  {
    id: '5',
    user: {
      id: 'user5',
      name: 'Arjun Kumar',
      avatar: 'https://i.pravatar.cc/150?img=5',
      role: 'user',
    },
    message: "Who do you think will win? I'm betting on Mumbai",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: '6',
    user: {
      id: 'user6',
      name: 'Neha Sharma',
      avatar: 'https://i.pravatar.cc/150?img=6',
      role: 'user',
    },
    message: "Delhi has a strong lineup today!",
    timestamp: new Date(Date.now() - 1 * 60 * 1000),
  },
];

const pollData = {
  question: 'Who will win this match?',
  options: [
    { id: '1', text: 'Mumbai Tigers', votes: 245 },
    { id: '2', text: 'Delhi Capitals', votes: 187 },
    { id: '3', text: 'Draw', votes: 32 },
  ],
  totalVotes: 464,
  userVoted: false,
};

const LiveChat: React.FC<LiveChatProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(dummyChatMessages);
  const [poll, setPoll] = useState(pollData);
  const [connectedUsers, setConnectedUsers] = useState(723);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        user: {
          id: `user-${Math.floor(Math.random() * 1000)}`,
          name: `Fan ${Math.floor(Math.random() * 100)}`,
          avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
          role: 'user',
        },
        message: [
          "Great play!",
          "What a shot! 🔥",
          "The defense is strong today",
          "Come on team! 💪",
          "Referee made a mistake there",
          "Let's go!",
          "This is so exciting",
          "Wow, amazing skills",
        ][Math.floor(Math.random() * 8)],
        timestamp: new Date(),
      };
      
      setChatMessages(prev => [...prev, newMessage]);
      
      setConnectedUsers(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      user: {
        id: user?.id || 'guest',
        name: user?.email?.split('@')[0] || 'Guest User',
        avatar: `https://i.pravatar.cc/150?img=8`,
        role: 'user',
      },
      message: message.trim(),
      timestamp: new Date(),
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    onSendMessage(message);
    setMessage('');
  };
  
  const handleVote = (optionId: string) => {
    if (!user || poll.userVoted) return;
    
    setPoll(prev => {
      const updatedOptions = prev.options.map(option => 
        option.id === optionId 
          ? { ...option, votes: option.votes + 1 } 
          : option
      );
      
      return {
        ...prev,
        options: updatedOptions,
        totalVotes: prev.totalVotes + 1,
        userVoted: true,
      };
    });
  };
  
  const getRoleBadge = (role: 'user' | 'moderator' | 'admin') => {
    switch (role) {
      case 'admin':
        return <Badge className="ml-1 bg-red-500">Admin</Badge>;
      case 'moderator':
        return <Badge className="ml-1 bg-blue-500">Mod</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Live Interaction
          </div>
          <Badge variant="outline" className="font-normal">
            {connectedUsers} online
          </Badge>
        </CardTitle>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
            <TabsTrigger value="polls" className="flex-1">Polls</TabsTrigger>
            <TabsTrigger value="reactions" className="flex-1">Reactions</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-hidden pt-2 px-3">
        <TabsContent value="chat" className="h-full flex flex-col m-0">
          <div className="overflow-y-auto flex-grow mb-2">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`mb-3 ${msg.isPinned ? 'bg-amber-50 p-2 rounded-md border-l-2 border-amber-500' : ''}`}>
                {msg.isPinned && (
                  <div className="text-xs text-amber-600 mb-1">📌 Pinned Message</div>
                )}
                <div className="flex items-start">
                  <img src={msg.user.avatar} alt={msg.user.name} className="w-8 h-8 rounded-full mr-2" />
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span className="font-semibold text-sm">{msg.user.name}</span>
                      {getRoleBadge(msg.user.role)}
                    </div>
                    <p className="text-sm break-words">{msg.message}</p>
                    <span className="text-xs text-gray-500">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </TabsContent>
        
        <TabsContent value="polls" className="h-full m-0">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-3">{poll.question}</h3>
            <div className="space-y-3">
              {poll.options.map(option => {
                const percentage = Math.round((option.votes / poll.totalVotes) * 100) || 0;
                return (
                  <div key={option.id} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span>{option.text}</span>
                      <span>{percentage}% ({option.votes})</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${option.id === '1' ? 'bg-blue-500' : option.id === '2' ? 'bg-red-500' : 'bg-yellow-500'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-1 text-xs h-7"
                      disabled={poll.userVoted || !user}
                      onClick={() => handleVote(option.id)}
                    >
                      {poll.userVoted && option.id === '1' ? 'Voted ✓' : 'Vote'}
                    </Button>
                  </div>
                );
              })}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Total votes: {poll.totalVotes}
            </div>
          </div>
          
          {!user && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Login to participate in polls</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="reactions" className="h-full m-0">
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <ThumbsUp className="h-6 w-6 mb-1 text-blue-500" />
              <span className="text-xs">324</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <Flame className="h-6 w-6 mb-1 text-orange-500" />
              <span className="text-xs">278</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <Heart className="h-6 w-6 mb-1 text-red-500" />
              <span className="text-xs">186</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <Zap className="h-6 w-6 mb-1 text-yellow-500" />
              <span className="text-xs">124</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <ThumbsDown className="h-6 w-6 mb-1 text-gray-500" />
              <span className="text-xs">52</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <BarChart3 className="h-6 w-6 mb-1 text-purple-500" />
              <span className="text-xs">Statistics</span>
            </Button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Top Fan Reactions</h3>
            <p className="text-sm">Reactions update in real-time during key moments of the match. React to exciting plays and see what other fans think!</p>
          </div>
        </TabsContent>
      </CardContent>
      
      <CardFooter className="pt-2">
        {activeTab === 'chat' && (
          <form onSubmit={handleSendMessage} className="w-full flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={user ? "Send a message..." : "Login to chat"}
              disabled={!user}
              className="flex-grow"
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!user || !message.trim()}
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </form>
        )}
      </CardFooter>
    </Card>
  );
};

export default LiveChat;
