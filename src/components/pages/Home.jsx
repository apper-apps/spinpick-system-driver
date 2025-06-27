import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { spinResultService } from "@/services/api/spinResultService";
import { entryService } from "@/services/api/entryService";
import { wheelService } from "@/services/api/wheelService";
import SpinControls from "@/components/molecules/SpinControls";
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
  const [currentWheelId, setCurrentWheelId] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    loadEntries();
    loadSpinHistory();
  }, []);

  // Track changes to mark as unsaved
  useEffect(() => {
    if (entries.length > 0 || selectedTheme.id !== themes[0].id || spinDuration !== 3000) {
      setHasUnsavedChanges(true);
    }
  }, [entries, selectedTheme, spinDuration]);

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

  const handleSpin = () => {
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
  const handleLoadWheelConfig = (wheelConfig) => {
    setEntries(wheelConfig.entries || []);
    setSelectedTheme(themes.find(t => t.id === wheelConfig.theme) || themes[0]);
    setSpinDuration(wheelConfig.spinDuration || 3000);
    setCurrentWheelId(wheelConfig.Id);
    setHasUnsavedChanges(false);
    toast.success(`Loaded "${wheelConfig.name}"`);
  };

  const handleSaveCurrentWheel = async (name) => {
    try {
      const wheelConfig = {
        name,
        entries: [...entries],
        theme: selectedTheme.id,
        spinDuration
      };

      if (currentWheelId) {
        await wheelService.update(currentWheelId, wheelConfig);
        toast.success('Wheel configuration updated');
      } else {
        const newWheel = await wheelService.create(wheelConfig);
        setCurrentWheelId(newWheel.Id);
        toast.success('Wheel configuration saved');
      }
      
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error('Failed to save wheel configuration');
    }
  };

const handleNewWheel = () => {
    if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Create a new wheel anyway?')) {
      return;
    }
    
    setEntries([]);
    setSelectedTheme(themes[0]);
    setSpinDuration(3000);
    setCurrentWheelId(null);
    setHasUnsavedChanges(false);
    toast.info('Started new wheel');
  };

if (loading) {
    return (
      <div className="h-screen flex flex-col overflow-hidden bg-surface-200">
        <motion.div 
          className="h-16 bg-white border-b border-surface-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="h-full bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 animate-pulse" />
        </motion.div>
        <div className="flex-1 flex">
          <motion.div 
            className="flex-1 p-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-center h-full">
              <motion.div 
                className="w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full"
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              />
            </div>
          </motion.div>
          <motion.div 
            className="w-96 p-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-surface-200 to-surface-300 rounded-xl h-full animate-pulse" />
          </motion.div>
        </div>
      </div>
    );
  }

if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface-200">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, -10, 10, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            <span className="text-2xl">⚠️</span>
          </motion.div>
          <motion.h2 
            className="text-xl font-semibold text-surface-900 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Something went wrong
          </motion.h2>
          <motion.p 
            className="text-surface-600 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {error}
          </motion.p>
          <motion.button
            onClick={loadEntries}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }
if (isFullscreen) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-8"
        >
          <div className="flex items-center justify-center">
            <SpinWheel
              entries={entries}
              isSpinning={isSpinning}
              onSpinComplete={handleSpinComplete}
              spinDuration={spinDuration}
              selectedTheme={selectedTheme}
            />
          </div>
          
          <div className="flex justify-center">
            <SpinControls
              onSpin={handleSpin}
              isSpinning={isSpinning}
              spinDuration={spinDuration}
              onDurationChange={setSpinDuration}
              entriesCount={entries.length}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
            />
          </div>
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
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Main Wheel Area */}
<motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 flex flex-col p-6 overflow-hidden"
        >
          <motion.div 
            className="flex-1 flex items-center justify-center mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <SpinWheel
              entries={entries}
              isSpinning={isSpinning}
              onSpinComplete={handleSpinComplete}
              spinDuration={spinDuration}
              selectedTheme={selectedTheme}
            />
          </motion.div>
          
          <motion.div 
            className="flex justify-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <SpinControls
              onSpin={handleSpin}
              isSpinning={isSpinning}
              spinDuration={spinDuration}
              onDurationChange={setSpinDuration}
              entriesCount={entries.length}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
            />
          </motion.div>
        </motion.div>

{/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="w-96 p-6 flex-shrink-0"
        >
          <EntryManager
            entries={entries}
            onEntriesChange={setEntries}
            selectedTheme={selectedTheme}
            onSaveWheel={handleSaveCurrentWheel}
            onNewWheel={handleNewWheel}
            hasUnsavedChanges={hasUnsavedChanges}
            currentWheelName={currentWheelId ? `Wheel ${currentWheelId}` : 'New Wheel'}
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