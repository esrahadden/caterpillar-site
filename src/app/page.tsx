import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
// import CaseStudies from '@/components/CaseStudies';
// import Blog from '@/components/Blog';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-surface-primary">
      <Navigation />
      <Hero />
      <Services />
      <About />
      {/* <CaseStudies /> */}
      {/* <Blog /> */}
      <Contact />
      <Footer />
    </div>
  );
}
