import { Hero } from '@/components/ui/layout/hero';
import { HowItWorks } from '@/components/ui/layout/how-it-works';
import { FeatureCards } from '@/components/ui/layout/feature-cards';
import { Footer } from '@/components/ui/layout/footer';

const BACKGROUND_IMAGE = "https://ucarecdn.com/f6029e68-9768-49db-80a9-64e41e70acff/waveblack.png";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <HowItWorks 
        backgroundImage={BACKGROUND_IMAGE}
        backgroundColor="#000000"
      />
      <FeatureCards 
        backgroundImage={BACKGROUND_IMAGE}
        backgroundColor="#000000"
      />
      <Footer />
    </div>
  );
}