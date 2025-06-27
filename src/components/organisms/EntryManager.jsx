import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { entryService } from "@/services/api/entryService";
import ApperIcon from "@/components/ApperIcon";
import EntryCard from "@/components/molecules/EntryCard";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const EntryManager = ({ 
  entries = [], 
  onEntriesChange, 
  selectedTheme, 
  onNewWheel, 
  onSaveWheel, 
  currentWheelName 
}) => {
  const [newEntryText, setNewEntryText] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [wheelName, setWheelName] = useState('');
  
  // File input ref for wheel config import
  const fileInputRef = useRef(null);
  // Listen for wheel config loading events
  useEffect(() => {
    const handleLoadWheelConfig = (event) => {
      const wheelConfig = event.detail;
      if (wheelConfig && onEntriesChange) {
        onEntriesChange(wheelConfig.entries || []);
      }
    };

    window.addEventListener('loadWheelConfig', handleLoadWheelConfig);
    return () => window.removeEventListener('loadWheelConfig', handleLoadWheelConfig);
  }, [onEntriesChange]);

  const getNextColor = () => {
    const colors = selectedTheme?.colors || ['#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#06B6D4'];
    return colors[entries.length % colors.length];
  };

  const handleAddEntry = async () => {
    if (!newEntryText.trim()) return;
    
    setLoading(true);
    try {
      const newEntry = await entryService.create({
        text: newEntryText.trim(),
        color: getNextColor(),
        weight: 1
      });
      
      onEntriesChange([...entries, newEntry]);
      setNewEntryText('');
      toast.success('Entry added successfully');
    } catch (error) {
      toast.error('Failed to add entry');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEntry = async (id, updatedData) => {
    try {
      const updatedEntry = await entryService.update(id, updatedData);
      const newEntries = entries.map(entry => 
        entry.Id === id ? updatedEntry : entry
      );
      onEntriesChange(newEntries);
      toast.success('Entry updated');
    } catch (error) {
      toast.error('Failed to update entry');
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      await entryService.delete(id);
      const newEntries = entries.filter(entry => entry.Id !== id);
      onEntriesChange(newEntries);
      toast.success('Entry deleted');
    } catch (error) {
      toast.error('Failed to delete entry');
    }
  };

  const handleClearAll = async () => {
    if (entries.length === 0) return;
    
    if (window.confirm('Are you sure you want to clear all entries?')) {
      try {
        await entryService.deleteAll();
        onEntriesChange([]);
        toast.success('All entries cleared');
      } catch (error) {
        toast.error('Failed to clear entries');
      }
    }
  };

  const handleBulkImport = (text) => {
    const lines = text.split(/[,\n]/).map(line => line.trim()).filter(line => line);
    const colors = selectedTheme?.colors || ['#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#06B6D4'];
    
    const newEntries = lines.map((line, index) => ({
      Id: entries.length + index + 1,
      text: line,
      color: colors[(entries.length + index) % colors.length],
      weight: 1
    }));
    
    onEntriesChange([...entries, ...newEntries]);
    toast.success(`${newEntries.length} entries imported`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddEntry();
    }
  };

return (
    <motion.div
    className="bg-surface-50 rounded-xl p-6 shadow-lg border border-surface-200 h-full flex flex-col glass-effect"
    initial={{
        opacity: 0,
        y: 20
    }}
    animate={{
        opacity: 1,
        y: 0
    }}
    transition={{
        duration: 0.5
    }}>
    <motion.div
        className="flex items-center justify-between mb-6"
        initial={{
            opacity: 0
        }}
        animate={{
            opacity: 1
        }}
        transition={{
            delay: 0.2
        }}>
        <motion.h2
            className="text-xl font-bold text-surface-900"
            animate={{
                color: entries.length > 0 ? "#111827" : "#9CA3AF"
            }}
            transition={{
                duration: 0.3
            }}>Entries ({entries.length})
                    </motion.h2>
        <AnimatePresence>
            {entries.length > 0 && <motion.div
                initial={{
                    opacity: 0,
                    scale: 0.8
                }}
                animate={{
                    opacity: 1,
                    scale: 1
                }}
                exit={{
                    opacity: 0,
                    scale: 0.8
                }}
                transition={{
                    duration: 0.2
                }}>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-red-500 hover:bg-red-50 hover:scale-105 transition-all duration-200">
                    <ApperIcon name="Trash2" size={16} className="mr-2" />Clear All
                                  </Button>
            </motion.div>}
        </AnimatePresence>
        <motion.div
            className="flex gap-2"
            initial={{
                opacity: 0,
                x: 20
            }}
            animate={{
                opacity: 1,
                x: 0
            }}
            transition={{
                delay: 0.3
            }}>
            {onNewWheel && <Button
                variant="ghost"
                size="sm"
                onClick={onNewWheel}
                className="text-surface-600 hover:bg-surface-100 hover:scale-105 transition-all duration-200">
                <ApperIcon name="Plus" size={16} className="mr-2" />New
                            </Button>}
            {onSaveWheel && <motion.div
                animate={hasUnsavedChanges ? {
                    scale: [1, 1.05, 1]
                } : {}}
                transition={{
                    duration: 2,
                    repeat: hasUnsavedChanges ? Infinity : 0
                }}>
                <Button
                    variant={hasUnsavedChanges ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setShowSaveModal(true)}
                    className={`transition-all duration-200 ${hasUnsavedChanges ? "bg-primary text-white shadow-lg hover:shadow-xl animate-glow" : "text-surface-600 hover:bg-surface-100 hover:scale-105"}`}>
                    <ApperIcon name="Save" size={16} className="mr-2" />Save
                                  </Button>
            </motion.div>}
        </motion.div>
    </motion.div>
    <motion.div
        className="space-y-4 mb-6"
        initial={{
            opacity: 0,
            y: 10
        }}
        animate={{
            opacity: 1,
            y: 0
        }}
        transition={{
            delay: 0.4
        }}>
        <div className="flex gap-2">
            <motion.div
                className="flex-1"
                whileFocus={{
                    scale: 1.02
                }}>
<Input
                    placeholder="Enter your name..."
                    value={newEntryText}
                    onChange={e => setNewEntryText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 transition-all duration-200 focus:shadow-lg" />
            </motion.div>
            <motion.div
                whileHover={{
                    scale: 1.05
                }}
                whileTap={{
                    scale: 0.95
                }}>
                <Button
                    onClick={handleAddEntry}
                    disabled={!newEntryText.trim() || loading}
                    loading={loading}
                    className="shadow-lg hover:shadow-xl transition-all duration-200">
                    <ApperIcon name="Plus" size={16} />
                </Button>
            </motion.div>
        </div>
        <BulkImportButton onImport={handleBulkImport} />
    </motion.div>
    <motion.div
        className="flex-1 overflow-y-auto space-y-3"
        initial={{
            opacity: 0
        }}
        animate={{
            opacity: 1
        }}
        transition={{
            delay: 0.5
        }}>
        <AnimatePresence>
            {entries.map((entry, index) => <motion.div
                key={entry.Id}
                initial={{
                    opacity: 0,
                    y: 20,
                    scale: 0.95
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                }}
                exit={{
                    opacity: 0,
                    x: -100,
                    scale: 0.8
                }}
                transition={{
                    delay: index * 0.05,
                    duration: 0.3,
                    ease: "easeOut"
                }}
                whileHover={{
                    y: -2
                }}>
                <EntryCard entry={entry} onUpdate={handleUpdateEntry} onDelete={handleDeleteEntry} />
            </motion.div>)}
        </AnimatePresence>
        {entries.length === 0 && <motion.div
            initial={{
                opacity: 0,
                scale: 0.9
            }}
            animate={{
                opacity: 1,
                scale: 1
            }}
            transition={{
                duration: 0.5
            }}
            className="text-center py-12">
            <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-surface-200 rounded-full flex items-center justify-center"
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}>
                <ApperIcon name="Users" size={24} className="text-surface-400" />
            </motion.div>
            <motion.h3
                className="text-lg font-semibold text-surface-700 mb-2"
                initial={{
                    opacity: 0
                }}
                animate={{
                    opacity: 1
                }}
                transition={{
                    delay: 0.2
                }}>No entries yet
                            </motion.h3>
            <motion.p
                className="text-surface-500 mb-4"
                initial={{
                    opacity: 0
                }}
                animate={{
                    opacity: 1
                }}
                transition={{
                    delay: 0.3
                }}>Add names or options to get started with your wheel
                            </motion.p>
        </motion.div>}
    </motion.div>
</motion.div>
  );
};

const BulkImportButton = ({ onImport }) => {
  const [showModal, setShowModal] = useState(false);
  const [importText, setImportText] = useState('');

  const handleImport = () => {
    if (importText.trim()) {
      onImport(importText);
      setImportText('');
      setShowModal(false);
    }
  };

  return (
    <>
<motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowModal(true)}
          className="w-full hover:shadow-lg transition-all duration-200"
        >
          <ApperIcon name="Upload" size={16} className="mr-2" />
          Bulk Import
        </Button>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4">Bulk Import Entries</h3>
                <p className="text-sm text-surface-600 mb-4">
                  Enter names or options separated by commas or new lines:
                </p>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Alice, Bob, Carol&#10;David&#10;Emma"
                  className="w-full h-32 p-3 border border-surface-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex gap-3 mt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShowModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleImport}
                    disabled={!importText.trim()}
                    className="flex-1"
                  >
                    Import
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
</AnimatePresence>
    </>
  );
};

const SaveModal = ({ showSaveModal, setShowSaveModal, wheelName, setWheelName, onSaveWheel }) => (
  <AnimatePresence>
    {showSaveModal && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowSaveModal(false)}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Save Wheel Configuration</h3>
            <p className="text-sm text-surface-600 mb-4">
              Enter a name for your wheel configuration:
            </p>
            <Input
              placeholder="Enter wheel name..."
              value={wheelName}
              onChange={(e) => setWheelName(e.target.value)}
              className="w-full mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowSaveModal(false);
                  setWheelName('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (wheelName.trim() && onSaveWheel) {
                    onSaveWheel(wheelName.trim());
                    setShowSaveModal(false);
                    setWheelName('');
                  }
                }}
                disabled={!wheelName.trim()}
                className="flex-1"
              >
                Save
              </Button>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const EntryManagerWithModals = (props) => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [wheelName, setWheelName] = useState('');

  return (
    <>
      <EntryManager 
        {...props} 
        showSaveModal={showSaveModal}
        setShowSaveModal={setShowSaveModal}
      />
      <SaveModal
        showSaveModal={showSaveModal}
        setShowSaveModal={setShowSaveModal}
        wheelName={wheelName}
        setWheelName={setWheelName}
        onSaveWheel={props.onSaveWheel}
      />
    </>
  );
};

export default EntryManagerWithModals;