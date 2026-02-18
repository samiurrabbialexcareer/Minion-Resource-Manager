import { Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';

import Search from './pages/Search';
import BottomNav from './components/BottomNav';
import AddResourceModal from './components/AddResourceModal';

export default function App() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="bg-slate-950 min-h-screen text-white font-sans selection:bg-electric-blue-500/30 overflow-x-hidden">
      {/* 
         AnimatePresence mode="wait" allows page transitions if we wrap Routes in it. 
         For now, keeping standard routing. 
      */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home onAdd={() => setIsAddOpen(true)} />} />

        <Route path="/search" element={<Search />} />
      </Routes>

      <BottomNav onOpenAdd={() => setIsAddOpen(true)} />

      <AddResourceModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
}
