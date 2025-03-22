
import React from 'react';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import CreateMatchForm from '@/components/match/CreateMatchForm';

const CreateMatch: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow py-8">
        <CreateMatchForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateMatch;
