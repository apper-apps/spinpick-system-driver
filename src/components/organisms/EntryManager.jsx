import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { entryService } from "@/services/api/entryService";
import ApperIcon from "@/components/ApperIcon";
import EntryCard from "@/components/molecules/EntryCard";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const EntryManager = ({ entries, onEntriesChange, selectedTheme, isMobileVisible = true, onToggleVisible }) => {
  const [newEntryText, setNewEntryText] = useState('');
  const [loading, setLoading] = useState(false);

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
      console.error('Error adding entry:', error);
      toast.error(error.message || 'Failed to add entry');
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

const handleBulkImport = async (text) => {
    const lines = text.split(/[,\n]/).map(line => line.trim()).filter(line => line);
    const colors = selectedTheme?.colors || ['#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#06B6D4'];
    
    try {
      const newEntries = [];
      for (let i = 0; i < lines.length; i++) {
        const entry = await entryService.create({
          text: lines[i],
          color: colors[(entries.length + i) % colors.length],
          weight: 1
        });
        newEntries.push(entry);
      }
      
      onEntriesChange([...entries, ...newEntries]);
      toast.success(`${newEntries.length} entries imported`);
    } catch (error) {
      console.error('Error importing entries:', error);
      toast.error(error.message || 'Failed to import entries');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddEntry();
    }
  };

return (
    <div className="bg-surface-50 dark:bg-dark-100 rounded-xl p-3 md:p-6 shadow-lg border border-surface-200 dark:border-dark-200 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
<div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-surface-900 dark:text-dark-900">
            Entries ({entries.length})
          </h2>
          {/* Mobile collapse button */}
          {onToggleVisible && (
            <button
              onClick={onToggleVisible}
              className="md:hidden p-1 hover:bg-surface-200 dark:hover:bg-dark-200 rounded-md transition-colors"
            >
              <ApperIcon 
                name={isMobileVisible ? "ChevronUp" : "ChevronDown"} 
                size={16} 
                className="text-surface-600 dark:text-dark-600"
              />
            </button>
          )}
        </div>
{entries.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
          >
            <ApperIcon name="Trash2" size={16} className="mr-2" />
            <span className="hidden sm:inline">Clear All</span>
          </Button>
        )}
      </div>
<div className={`transition-all duration-300 ${isMobileVisible ? 'block' : 'hidden md:block'}`}>
        <div className="space-y-4 mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Enter name or option..."
              value={newEntryText}
              onChange={(e) => setNewEntryText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button
              onClick={handleAddEntry}
              disabled={!newEntryText.trim() || loading}
              loading={loading}
            >
              <ApperIcon name="Plus" size={16} />
            </Button>
          </div>

          <BulkImportButton onImport={handleBulkImport} />
</div>

        <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
          <AnimatePresence>
            {entries.map((entry, index) => (
              <motion.div
                key={entry.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
              >
                <EntryCard
                  entry={entry}
                  onUpdate={handleUpdateEntry}
                  onDelete={handleDeleteEntry}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {entries.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
<div className="w-16 h-16 mx-auto mb-4 bg-surface-200 dark:bg-dark-200 rounded-full flex items-center justify-center">
                <ApperIcon name="Users" size={24} className="text-surface-400 dark:text-dark-400" />
              </div>
              <h3 className="text-lg font-semibold text-surface-700 dark:text-dark-700 mb-2">
                No entries yet
              </h3>
              <p className="text-surface-500 dark:text-dark-500 mb-4">
                Add names or options to get started with your wheel
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
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
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowModal(true)}
        className="w-full"
      >
        <ApperIcon name="Upload" size={16} className="mr-2" />
        Bulk Import
      </Button>

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
              className="fixed inset-0 z-50 mobile-modal md:flex md:items-center md:justify-center md:p-4"
            >
              <div className="mobile-modal-content md:contents">
                <div className="bg-white dark:bg-dark-100 rounded-lg shadow-xl max-w-md w-full p-6 modal-scroll">
                  <h3 className="text-lg font-semibold mb-4 text-surface-900 dark:text-dark-900">
                    Bulk Import Entries
                  </h3>
                  <p className="text-sm text-surface-600 dark:text-dark-600 mb-4">
                    Enter names or options separated by commas or new lines:
                  </p>
                  <textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="Alice, Bob, Carol&#10;David&#10;Emma"
                    className="w-full h-32 p-3 border border-surface-300 dark:border-dark-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark-100 text-surface-900 dark:text-dark-900"
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default EntryManager;