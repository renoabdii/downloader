import { ThemeProvider } from './features/theme/ThemeProvider';
import { Navbar } from './components/Navbar';
import { Hero } from './features/hero/Hero';
import { DownloaderCard } from './features/downloader/DownloaderCard';
import { HistorySection } from './features/history/HistorySection';
import { FeaturesSection } from './features/hero/FeaturesSection';
import { FAQ } from './features/hero/FAQ';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <DownloaderCard />
          <HistorySection />
          <FeaturesSection />
          <FAQ />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
