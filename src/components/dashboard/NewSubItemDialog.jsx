import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Target, Calendar, Plus } from 'lucide-react';

const goalTemplates = [
  'Complete and submit by deadline',
  'Score > 90%', 
  'Deep learn concepts',
  'Revise for deep understanding',
  'Research thoroughly',
  'Draft and refine',
  'Custom goal'
];

export default function NewSubItemDialog({ open, onClose, onSubmit, projectTitle }) {
  const [formData, setFormData] = useState({
    title: '',
    goal: '',
    type: 'class', // Sub-items inherit project characteristics
    deadline: ''
  });

  const handleGoalTemplate = (template) => {
    if (template === 'Custom goal') {
      setFormData(prev => ({ ...prev, goal: '' }));
    } else {
      setFormData(prev => ({ ...prev, goal: template }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.goal.trim()) return;

    onSubmit(formData);
    
    // Reset form
    setFormData({
      title: '',
      goal: '',
      type: 'class',
      deadline: ''
    });
  };

  const canSubmit = formData.title.trim() && formData.goal.trim();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Sub-item to {projectTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Sub-item Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What part of the project is this?"
              className="text-lg"
            />
          </div>

          {/* Goal Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              <Label className="font-medium">Goal for this sub-item *</Label>
            </div>
            
            {/* Goal Templates */}
            <div className="space-y-2">
              <Label className="text-sm text-slate-600">Quick templates:</Label>
              <div className="flex flex-wrap gap-2">
                {goalTemplates.map((template) => (
                  <button
                    key={template}
                    type="button"
                    onClick={() => handleGoalTemplate(template)}
                    className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              value={formData.goal}
              onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
              placeholder="What do you want to achieve with this sub-item?"
              className="min-h-20"
            />
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-600" />
              <Label>Deadline (optional)</Label>
            </div>
            <Input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              <Plus className="w-4 h-4 mr-2" />
              Add Sub-item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}