import { useEffect } from 'react';
import Hero from '../components/home/Hero';
import FeaturesSection from '../components/home/FeaturesSection';
import HowItWorks from '../components/home/HowItWorks';

function Home() {
  useEffect(() => {
    document.title = 'PrivaGuard — Privacy & Security Tools';
  }, []);

  return (
    <>
      <Hero />
      <FeaturesSection />
      <HowItWorks />
    </>
  );
}

export default Home;
