
import React from 'react';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import MessagesContainer from '@/components/messages/MessagesContainer';

const Messages: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="text-muted-foreground mt-1">
              Connect with other players and coordinate your matches
            </p>
          </div>
          
          <MessagesContainer />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Messages;
