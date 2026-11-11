import './glass.css';
import GlassBackdrop from '@/components/GlassBackdrop';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Method from '@/components/Method';
import Services from '@/components/Services';
import Trainings from '@/components/Trainings';
import About from '@/components/About';
// import CaseStudies from '@/components/CaseStudies';
// import Blog from '@/components/Blog';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="gl">
      <GlassBackdrop />
      <div className="wrap">
        <Navigation />
        <main>
          <Hero />
          <Method />
          <Services />
          <Trainings />
          <About />
          {/* <CaseStudies /> */}
          {/* <Blog /> */}
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
