import React, { useState, useEffect } from 'react';
import { Item } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ItemCard from './ItemCard';
import NewSubItemDialog from './NewSubItemDialog';

export default function MajorProjectView({ project, onBack, onItemComplete, onRefresh }) {
  const [subItems, setSubItems] = useState([]);
  const [showNewSubItemDialog, setShowNewSubItemDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubItems();
  }, [project.id]);

  const loadSubItems = async () => {
    try {
      const items = await Item.filter({ parent_project_id: project.id }, 'order_index');
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
      parent_project_id: project.id,
      order_index: subItems.length
    };
    
    await Item.create(newItem);
    setShowNewSubItemDialog(false);
    loadSubItems();
  };

  const handleSubItemClick = (subItem) => {
    onItemComplete(subItem);
  };

  return (
    <div className="min-h-screen" style={{ background: '#fdf9e7' }}>
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-slate-900">{project.title}</h1>
            
            {/* Project Goal */}
            {project.goal && (
              <Card className="bg-indigo-50 border-indigo-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-indigo-700 mb-1">Project Goal:</p>
                      <p className="text-lg text-indigo-800 leading-relaxed font-['Caveat',cursive] font-medium">
                        {project.goal}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Add Sub-item Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-900">Sub-items</h2>
          <Button onClick={() => setShowNewSubItemDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Sub-item
          </Button>
        </div>

        {/* Sub-items List */}
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
                courseColor="blue"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl mx-auto flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Break down this project</h3>
            <p className="text-slate-600 mb-6">Create sub-items to track progress on different parts</p>
            <Button onClick={() => setShowNewSubItemDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Sub-item
            </Button>
          </div>
        )}
      </div>

      {/* New Sub-item Dialog */}
      {showNewSubItemDialog && (
        <NewSubItemDialog
          open={showNewSubItemDialog}
          onClose={() => setShowNewSubItemDialog(false)}
          onSubmit={handleNewSubItem}
          projectTitle={project.title}
        />
      )}
    </div>
  );
}