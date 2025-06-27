import { motion } from 'framer-motion';
import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const EntryCard = ({ entry, onUpdate, onDelete, canReorder = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(entry.text);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(entry.Id, { text: editText.trim() });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(entry.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ y: -2 }}
      className="bg-surface-50 rounded-lg p-4 shadow-md border border-surface-200 group"
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: entry.color }}
        />
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              autoFocus
              className="text-sm"
            />
          ) : (
            <span 
              className="text-surface-900 font-medium truncate cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              {entry.text}
            </span>
          )}
        </div>

<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {canReorder && (
            <div className="cursor-grab active:cursor-grabbing">
              <ApperIcon name="GripVertical" size={16} className="text-surface-400" />
            </div>
          )}
          
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="p-1 h-8 w-8"
            >
              <ApperIcon name="Edit2" size={14} />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EntryCard;