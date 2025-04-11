import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreakingNewsTicker from '@/components/BreakingNewsTicker';
import HeroSection from '@/components/HeroSection';
import LatestNewsSection from '@/components/LatestNewsSection';
import CategorySection from '@/components/CategorySection';
import OpinionSection from '@/components/OpinionSection';

const HomePage: React.FC = () => {
  return (
    <div className="bg-neutral-100 font-body text-neutral-800">
      <Header />
      <BreakingNewsTicker />
      <HeroSection />
      <LatestNewsSection />
      
      <section className="py-6">
        <div className="container mx-auto px-4">
          <CategorySection 
            category="business" 
            displayName="Business" 
          />
          
          <CategorySection 
            category="technology" 
            displayName="Technology" 
          />
        </div>
      </section>
      
      <OpinionSection />
      <Footer />
    </div>
  );
};

export default HomePage;
