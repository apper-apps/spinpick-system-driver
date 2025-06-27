import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { wheelService } from "@/services/api/wheelService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const WheelSidebar = ({ isOpen, onClose }) => {
  const [wheels, setWheels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [wheelToDelete, setWheelToDelete] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadWheels();
    }
  }, [isOpen]);

  const loadWheels = async () => {
    setLoading(true);
    try {
      const wheelData = await wheelService.getAll();
      setWheels(wheelData);
    } catch (error) {
      toast.error('Failed to load saved wheels');
    } finally {
      setLoading(false);
    }
  };

const handleLoadWheel = async (wheelId) => {
    try {
      const wheel = await wheelService.getById(wheelId);
      // Emit custom event to notify Home component
      window.dispatchEvent(new window.CustomEvent('loadWheelConfig', { detail: wheel }));
      onClose();
    } catch (error) {
      toast.error('Failed to load wheel configuration');
    }
  };

  const handleDeleteWheel = async (wheelId) => {
    try {
      await wheelService.delete(wheelId);
      setWheels(wheels.filter(w => w.Id !== wheelId));
      setShowDeleteModal(false);
      setWheelToDelete(null);
      toast.success('Wheel deleted successfully');
    } catch (error) {
      toast.error('Failed to delete wheel');
    }
  };

  const confirmDelete = (wheel) => {
    setWheelToDelete(wheel);
    setShowDeleteModal(true);
  };

  const filteredWheels = wheels.filter(wheel =>
    wheel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateThumbnail = async (wheel) => {
    try {
      return await wheelService.generateThumbnail(wheel);
    } catch (error) {
      return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-surface-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-surface-900">Saved Wheels</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-surface-100 rounded-lg transition-colors"
        >
          <ApperIcon name="X" size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-surface-200">
        <Input
          placeholder="Search wheels..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Wheels List */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-surface-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredWheels.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-surface-200 rounded-full flex items-center justify-center">
              <ApperIcon name="Disc3" size={24} className="text-surface-400" />
            </div>
            <h3 className="text-lg font-semibold text-surface-700 mb-2">
              {searchTerm ? 'No wheels found' : 'No saved wheels'}
            </h3>
            <p className="text-surface-500">
              {searchTerm ? 'Try a different search term' : 'Create and save your first wheel configuration'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredWheels.map((wheel) => (
                <WheelThumbnail
                  key={wheel.Id}
                  wheel={wheel}
                  onLoad={() => handleLoadWheel(wheel.Id)}
                  onDelete={() => confirmDelete(wheel)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowDeleteModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4 text-surface-900">Delete Wheel</h3>
                <p className="text-surface-600 mb-6">
                  Are you sure you want to delete "{wheelToDelete?.name}"? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleDeleteWheel(wheelToDelete.Id)}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const WheelThumbnail = ({ wheel, onLoad, onDelete }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateThumbnail();
  }, [wheel]);

  const generateThumbnail = async () => {
    setLoading(true);
    try {
      const thumbnailUrl = await wheelService.generateThumbnail(wheel);
      setThumbnail(thumbnailUrl);
    } catch (error) {
      console.error('Failed to generate thumbnail:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-surface-50 rounded-lg p-3 border border-surface-200 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex gap-3">
        {/* Thumbnail */}
        <div className="w-16 h-16 flex-shrink-0 bg-surface-200 rounded-lg overflow-hidden">
          {loading ? (
            <div className="w-full h-full bg-surface-300 animate-pulse" />
          ) : thumbnail ? (
            <img
              src={thumbnail}
              alt={wheel.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ApperIcon name="Disc3" size={20} className="text-surface-400" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0" onClick={onLoad}>
          <h4 className="font-medium text-surface-900 truncate group-hover:text-primary transition-colors">
            {wheel.name}
          </h4>
          <p className="text-sm text-surface-600">
            {wheel.entries?.length || 0} entries
          </p>
          <p className="text-xs text-surface-500">
            {formatDate(wheel.createdAt)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLoad();
            }}
            className="p-1 hover:bg-surface-200 rounded text-surface-600 hover:text-primary transition-colors"
            title="Load wheel"
          >
            <ApperIcon name="Download" size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 hover:bg-red-100 rounded text-surface-600 hover:text-red-600 transition-colors"
            title="Delete wheel"
          >
            <ApperIcon name="Trash2" size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default WheelSidebar;