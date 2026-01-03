import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import ImageGallery from './components/ImageGallery';
import Features from './components/Features';
import Recipes from './components/Recipes';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import RecipeDetail from './components/RecipeDetail';

function HomePage() {
  return (
    <div className="app">
      <Hero />
      <ImageGallery />
      <Features />
      <Recipes />
      <CallToAction />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
