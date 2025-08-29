import React, { useState, useEffect, useRef } from 'react';
import { Item } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import ItemCard from './ItemCard';
import NewSubItemDialog from './NewSubItemDialog';

const courseColorMap = {
  blue: '#3b82f6',
  green: '#10b981', 
  purple: '#8b5cf6',
  orange: '#f97316',
  pink: '#ec4899',
  yellow: '#eab308',
  red: '#ef4444',
  cyan: '#06b6d4'
};

export default function ItemView({ item, onBack, onComplete, onRefresh, courses = [] }) {
  const [subItems, setSubItems] = useState([]);
  const [showNewSubItemDialog, setShowNewSubItemDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const notesRef = useRef(null);

  useEffect(() => {
    if (item.is_major_project) {
      loadSubItems();
    } else {
      setIsLoading(false);
    }
  }, [item.id]);

  const loadSubItems = async () => {
    try {
      const items = await Item.filter({ parent_project_id: item.id }, 'order_index');
      setSubItems(items);
    } catch (error) {
      console.error('Error loading sub-items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSubItem = async (itemData) => {
    const newItem = {
      ...itemData,
      parent_project_id: item.id,
      order_index: subItems.length
    };
    
    await Item.create(newItem);
    setShowNewSubItemDialog(false);
    if (item.is_major_project) {
      loadSubItems();
    }
  };

  const handleSubItemClick = (subItem) => {
    onComplete(subItem);
  };

  const handleNotesClick = () => {
    if (notesRef.current) {
      notesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      notesRef.current.focus();
    }
  };

  const getCourseColor = (courseName) => {
    if (!courseName || !courses) return 'blue';
    const course = courses.find(c => c.name === courseName);
    return course?.color || 'blue';
  };

  const accentColor = courseColorMap[getCourseColor(item.course_name)] || courseColorMap.blue;

  return (
    <div className="min-h-screen" style={{ background: '#fdf9e7' }}>
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="btn-back">
            Back
          </button>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: '#8b7355' }}>
          {item.title}
        </h1>
        
        {/* Goal - increased size */}
        {item.goal && (
          <div className="text-center py-4 mb-8">
            <p className="text-3xl leading-relaxed font-['Caveat',cursive] font-normal max-w-3xl mx-auto" style={{ color: '#000000' }}>
              {item.goal}
            </p>
          </div>
        )}

        {/* Item Details - left justified, smaller font */}
        <div className="text-left space-y-2 mb-8">
          {item.course_name && (
            <div className="text-sm font-medium" style={{ color: accentColor }}>
              {item.course_name}
            </div>
          )}
          
          {item.deadline && (
            <div className="text-sm" style={{ color: '#8b7355' }}>
              Due {new Date(item.deadline).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          )}

          <div className="text-sm capitalize" style={{ color: '#8b7355' }}>
            {item.type}
          </div>
        </div>

        {/* Notes Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#8b7355' }}>Notes</h3>
          <Textarea
            ref={notesRef}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onClick={handleNotesClick}
            placeholder="Click here to add your notes..."
            className="min-h-48 w-full rounded-lg border border-slate-300 p-4 text-base resize-none focus:border-slate-400 focus:ring-0"
            style={{ 
              fontFamily: "'Lora', serif",
              background: '#fefcf7'
            }}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Major Project Sub-items */}
        {item.is_major_project && (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold" style={{ color: '#8b7355' }}>Sub-items</h2>
              <Button onClick={() => setShowNewSubItemDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Sub-item
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-slate-100 h-24 rounded-xl"></div>
                ))}
              </div>
            ) : subItems.length > 0 ? (
              <div className="space-y-4">
                {subItems.map((subItem) => (
                  <ItemCard
                    key={subItem.id}
                    item={subItem}
                    onClick={() => handleSubItemClick(subItem)}
                    courseColor={getCourseColor(subItem.course_name)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl mx-auto flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: '#8b7355' }}>Break down this project</h3>
                <p style={{ color: '#8b7355' }} className="mb-6">Create sub-items to track progress on different parts</p>
                <Button onClick={() => setShowNewSubItemDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Sub-item
                </Button>
              </div>
            )}
          </>
        )}

        {/* Mark as Complete Button */}
        <div className="flex justify-center pt-8">
          <Button onClick={() => onComplete(item)} className="btn-continue text-lg px-8 py-3">
            <CheckCircle className="w-5 h-5 mr-2" />
            Mark as Complete
          </Button>
        </div>
      </div>

      {/* New Sub-item Dialog */}
      {showNewSubItemDialog && (
        <NewSubItemDialog
          open={showNewSubItemDialog}
          onClose={() => setShowNewSubItemDialog(false)}
          onSubmit={handleNewSubItem}
          projectTitle={item.title}
        />
      )}
    </div>
  );
}