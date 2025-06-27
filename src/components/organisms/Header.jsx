import { motion } from "framer-motion";
import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import ThemeSelector from "@/components/molecules/ThemeSelector";
import Text from "@/components/atoms/Text";
import Button from "@/components/atoms/Button";

const Header = ({ selectedTheme, onThemeChange, spinHistory = [], onClearHistory }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-surface-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center"
            >
              <ApperIcon name="Target" size={24} className="text-white" />
</motion.div>
            <div>
              <Text variant="display" size="xl" weight="bold">
Appick
              </Text>
              <Text variant="caption" size="sm">
                Apper Giveaway Name Picker
              </Text>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(true)}
              className="relative"
            >
              <ApperIcon name="History" size={16} className="mr-2" />
              History
              {spinHistory.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {spinHistory.length}
                </span>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
            >
              <ApperIcon name="Settings" size={16} className="mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          selectedTheme={selectedTheme}
          onThemeChange={onThemeChange}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* History Modal */}
{/* History Modal */}
      {showHistory && (
        <HistoryModal
          spinHistory={spinHistory}
onClose={() => setShowHistory(false)}
          onClearHistory={onClearHistory}
        />
      )}
    </>
  );
};

const SettingsModal = ({ selectedTheme, onThemeChange, onClose, spinDuration, onSpinDurationChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <Text variant="heading" size="lg" weight="semibold">
            Settings
          </Text>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ApperIcon name="X" size={20} />
          </Button>
</div>

        <div className="space-y-6">
          <ThemeSelector
            selectedTheme={selectedTheme}
            onThemeChange={onThemeChange}
          />

          <div className="space-y-3">
            <Text variant="body" weight="medium">
              Spin Duration
            </Text>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-surface-700">
                Duration: {(spinDuration / 1000).toFixed(1)}s
              </label>
              <input
                type="range"
                min="2000"
                max="8000"
                step="500"
                value={spinDuration}
                onChange={(e) => onSpinDurationChange(parseInt(e.target.value))}
                className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-surface-500">
                <span>2s</span>
                <span>8s</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-surface-200">
          <Button variant="primary" onClick={onClose} className="w-full">
            Done
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const HistoryModal = ({ spinHistory, onClose, onClearHistory }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <Text variant="heading" size="lg" weight="semibold">
            Spin History
          </Text>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-3">
          {spinHistory.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Clock" size={32} className="text-surface-300 mx-auto mb-2" />
              <Text variant="body" size="sm" className="text-surface-500">
                No spins yet
              </Text>
            </div>
          ) : (
            spinHistory.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 bg-surface-50 rounded-lg"
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: result.winner.color }}
                />
                <div className="flex-1">
                  <Text variant="body" weight="medium">
                    {result.winner.text}
                  </Text>
                  <Text variant="caption" size="xs">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </Text>
                </div>
              </motion.div>
            ))
          )}
        </div>

<div className="mt-6 pt-4 border-t border-surface-200 space-y-3">
          {spinHistory.length > 0 && (
            <Button 
              variant="ghost" 
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all spin history?')) {
                  onClearHistory();
                  onClose();
                }
              }}
              className="w-full text-red-500 hover:bg-red-50"
            >
              <ApperIcon name="Trash2" size={16} className="mr-2" />
              Clear History
            </Button>
          )}
          <Button variant="primary" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Header;