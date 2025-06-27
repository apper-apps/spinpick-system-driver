import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { spinResultService } from "@/services/api/spinResultService";
import { entryService } from "@/services/api/entryService";
import ApperIcon from "@/components/ApperIcon";
import Header from "@/components/organisms/Header";
import EntryManager from "@/components/organisms/EntryManager";
import SpinWheel from "@/components/organisms/SpinWheel";
import WinnerModal from "@/components/organisms/WinnerModal";

const themes = [
  {
    id: 'vibrant',
    name: 'Vibrant',
    colors: ['#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#06B6D4']
  },
  {
    id: 'pastel',
    name: 'Pastel',
    colors: ['#A78BFA', '#F9A8D4', '#FCD34D', '#6EE7B7', '#93C5FD', '#C4B5FD', '#FCA5A5', '#67E8F9']
  },
  {
    id: 'professional',
    name: 'Professional',
    colors: ['#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#4B5563', '#111827', '#1F2937', '#F3F4F6']
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: ['#0EA5E9', '#0284C7', '#0369A1', '#075985', '#0C4A6E', '#164E63', '#155E75', '#0891B2']
  }
];

const Home = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinDuration, setSpinDuration] = useState(3000);
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [winner, setWinner] = useState(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [spinHistory, setSpinHistory] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileEntriesVisible, setIsMobileEntriesVisible] = useState(true);

useEffect(() => {
    loadEntries();
    loadSpinHistory();
  }, []);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const loadEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await entryService.getAll();
      setEntries(result);
    } catch (err) {
      setError(err.message || 'Failed to load entries');
      toast.error('Failed to load entries');
    } finally {
      setLoading(false);
    }
  };

const loadSpinHistory = async () => {
    try {
      const results = await spinResultService.getAll();
      setSpinHistory(results.slice(-10)); // Keep last 10 results
    } catch (err) {
      console.error('Failed to load spin history:', err);
    }
  };

  const clearSpinHistory = async () => {
    try {
      await spinResultService.deleteAll();
      setSpinHistory([]);
      toast.success('Spin history cleared');
    } catch (err) {
      console.error('Failed to clear spin history:', err);
      toast.error('Failed to clear spin history');
    }
  };

  const handleSpinStart = () => {
    if (entries.length < 2) {
      toast.warning('Add at least 2 entries to spin the wheel');
      return;
    }
    setIsSpinning(true);
  };

  const handleSpinComplete = async (selectedEntry) => {
    setIsSpinning(false);
    setWinner(selectedEntry);
    setShowWinnerModal(true);
    
    try {
      const result = await spinResultService.create({
        winner: selectedEntry,
        wheelId: '1' // Default wheel ID for this session
      });
      setSpinHistory(prev => [...prev.slice(-9), result]); // Keep last 10
    } catch (err) {
      console.error('Failed to save spin result:', err);
    }
  };

  const handleSpinAgain = () => {
    setShowWinnerModal(false);
    setWinner(null);
  };

const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    // Update entry colors to match new theme
    const updatedEntries = entries.map((entry, index) => ({
      ...entry,
      color: theme.colors[index % theme.colors.length]
    }));
    setEntries(updatedEntries);
  };

const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleMobileEntries = () => {
    setIsMobileEntriesVisible(!isMobileEntriesVisible);
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col overflow-hidden bg-surface-200">
        <div className="h-16 bg-white border-b border-surface-200 animate-pulse" />
        <div className="flex-1 flex">
          <div className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="w-80 h-80 bg-surface-300 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="w-96 p-6">
            <div className="bg-surface-300 rounded-xl h-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface-200">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-surface-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadEntries}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

if (isFullscreen) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900 overflow-hidden fixed inset-0 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
className="flex flex-col items-center space-y-8 w-full h-full justify-center"
        >
          <div className="flex items-center justify-center flex-1 bg-[url('https://apper.io/images/apper-text.svg')] bg-center bg-no-repeat bg-contain">
            <SpinWheel
              entries={entries}
              onSpinComplete={handleSpinComplete}
              onSpinStart={handleSpinStart}
              spinDuration={spinDuration}
              selectedTheme={selectedTheme}
            />
          </div>
          
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <ApperIcon name="X" size={24} />
          </button>
        </motion.div>

        <WinnerModal
          winner={winner}
          isOpen={showWinnerModal}
          onClose={() => setShowWinnerModal(false)}
          onSpinAgain={handleSpinAgain}
        />
      </div>
    );
  }

return (
    <div className="h-screen flex flex-col overflow-hidden bg-surface-200">
      <Header
        selectedTheme={selectedTheme}
        onThemeChange={handleThemeChange}
        spinHistory={spinHistory}
        spinDuration={spinDuration}
        onSpinDurationChange={setSpinDuration}
        onClearHistory={clearSpinHistory}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />
      
<div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Main Wheel Area */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
className="flex-1 flex flex-col p-3 md:p-6 overflow-hidden"
        >
          <div className="flex-1 flex items-center justify-center bg-[url('https://apper.io/images/apper-text.svg')] bg-center bg-no-repeat bg-contain">
            <SpinWheel
              entries={entries}
              onSpinComplete={handleSpinComplete}
              onSpinStart={handleSpinStart}
              spinDuration={spinDuration}
              selectedTheme={selectedTheme}
            />
          </div>

          {/* Mobile Entries Toggle Button */}
          <div className="md:hidden flex justify-center pb-2">
            <button
              onClick={toggleMobileEntries}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-surface-200 text-surface-700 hover:bg-surface-50 transition-colors"
            >
              <ApperIcon 
                name={isMobileEntriesVisible ? "ChevronDown" : "ChevronUp"} 
                size={16} 
              />
              <span className="text-sm font-medium">
                {isMobileEntriesVisible ? "Hide" : "Show"} Entries ({entries.length})
              </span>
            </button>
          </div>
        </motion.div>

{/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className={`w-full md:w-96 p-3 md:p-6 flex-shrink-0 transition-all duration-300 ${
            isMobileEntriesVisible ? 'h-auto md:flex-none' : 'h-0 md:h-auto overflow-hidden md:overflow-visible'
          }`}
        >
          <EntryManager
            entries={entries}
            onEntriesChange={setEntries}
            selectedTheme={selectedTheme}
            isMobileVisible={isMobileEntriesVisible}
            onToggleVisible={toggleMobileEntries}
          />
        </motion.div>
      </div>

      <WinnerModal
        winner={winner}
        isOpen={showWinnerModal}
        onClose={() => setShowWinnerModal(false)}
        onSpinAgain={handleSpinAgain}
      />
    </div>
  );
};

export default Home;