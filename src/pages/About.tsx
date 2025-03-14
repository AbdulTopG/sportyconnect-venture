
import React from 'react';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow py-8">
        <div className="sportyfi-container max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">About SportyFi</h1>
          
          <div className="sportyfi-card mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              SportyFi is dedicated to bringing sports enthusiasts together through a seamless and engaging platform. 
              We believe that sports have the power to connect people, build communities, and promote healthy lifestyles.
            </p>
            <p className="text-gray-700">
              Our mission is to make it easier for athletes of all skill levels to find matches, join tournaments, 
              and connect with like-minded sports lovers in their local communities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="sportyfi-card text-center p-6">
              <div className="bg-sportyfi-orange text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">
                Connect with other athletes and sports enthusiasts in your area who share your passion.
              </p>
            </div>
            
            <div className="sportyfi-card text-center p-6">
              <div className="bg-sportyfi-orange text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 3l-6 6m0 0V4m0 5h5M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Compete</h3>
              <p className="text-gray-600">
                Join matches and tournaments tailored to your skill level and preferred sports.
              </p>
            </div>
            
            <div className="sportyfi-card text-center p-6">
              <div className="bg-sportyfi-orange text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Improve</h3>
              <p className="text-gray-600">
                Track your progress, build your stats, and level up your game with every match.
              </p>
            </div>
          </div>
          
          <div className="sportyfi-card mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4">
              SportyFi was founded in 2023 by a group of sports enthusiasts who were frustrated with the challenges of finding reliable pickup games and organizing matches in their city.
            </p>
            <p className="text-gray-700 mb-4">
              What started as a simple idea to connect local players has grown into a comprehensive platform that helps athletes find matches, join leagues, track their progress, and build a community around their favorite sports.
            </p>
            <p className="text-gray-700">
              Today, SportyFi serves thousands of athletes across multiple cities, with plans to expand nationwide and introduce new features that will continue to enhance the sporting experience for our users.
            </p>
          </div>
          
          <div className="sportyfi-card">
            <h2 className="text-2xl font-semibold mb-4">Core Values</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-1">Community First</h3>
                <p className="text-gray-700">
                  We believe in the power of sports to build stronger communities and bring people together.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-1">Inclusivity</h3>
                <p className="text-gray-700">
                  SportyFi is for everyone, regardless of skill level, background, or experience.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-1">Fair Play</h3>
                <p className="text-gray-700">
                  We promote sportsmanship, respect, and fair competition in all aspects of our platform.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-1">Innovation</h3>
                <p className="text-gray-700">
                  We're constantly evolving and improving our platform to provide the best possible experience for our users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
