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
      className="bg-surface-50 dark:bg-dark-100 rounded-lg p-4 shadow-md border border-surface-200 dark:border-dark-200 group"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: entry.color }}
        />
<div className="flex-1 min-w-0 overflow-hidden">
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
            <div className="overflow-x-auto scrollbar-hide">
              <span 
                className="text-surface-900 dark:text-dark-900 font-medium cursor-pointer block whitespace-nowrap"
                onClick={() => setIsEditing(true)}
                title={entry.text}
              >
                {entry.text}
              </span>
            </div>
          )}
        </div>

<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {canReorder && (
            <div className="cursor-grab active:cursor-grabbing">
              <ApperIcon name="GripVertical" size={16} className="text-surface-400" />
            </div>
          )}
          
          {!isEditing && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="p-1 h-8 w-8"
              >
                <ApperIcon name="Edit2" size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this entry?')) {
                    onDelete(entry.Id);
                  }
                }}
                className="p-1 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EntryCard;