
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, FileText, Target, Calendar, Plus, X } from 'lucide-react';

const typeConfig = {
  class: {
    icon: BookOpen,
    label: 'Class Item',
    description: 'Academic coursework (assignments, projects, exams)',
    color: 'text-blue-600'
  },
  activity: {
    icon: Users,
    label: 'Activity Item',
    description: 'Extracurricular and personal development work',
    color: 'text-purple-600'
  },
  admin: {
    icon: FileText,
    label: 'Admin Item',
    description: 'Administrative and logistical tasks',
    color: 'text-slate-600'
  }
};

const goalTemplates = [
  'Complete and submit by deadline',
  'Score > 90%',
  'Deep learn concepts',
  'Revise for deep understanding',
  'Practice until proficient',
  'Custom goal'
];

export default function NewItemDialog({ open, onClose, onSubmit, courses = [] }) {
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    goal: '',
    type: '',
    deadline: '',
    is_major_project: false,
    course_name: ''
  });

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setFormData(prev => ({ ...prev, type }));
  };

  const handleGoalTemplate = (template) => {
    if (template === 'Custom goal') {
      setFormData(prev => ({ ...prev, goal: '' }));
    } else {
      setFormData(prev => ({ ...prev, goal: template }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.type) return;
    
    // Class and activity items require goals
    if ((formData.type === 'class' || formData.type === 'activity') && !formData.goal.trim()) {
      return;
    }

    onSubmit(formData);
    
    // Reset form
    setSelectedType(null);
    setFormData({
      title: '',
      goal: '',
      type: '',
      deadline: '',
      is_major_project: false,
      course_name: ''
    });
  };

  const canSubmit = formData.title.trim() && formData.type && 
    (formData.type === 'admin' || formData.goal.trim());

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">Create New Item</DialogTitle>
        </DialogHeader>

        <div className="max-h-[calc(90vh-120px)] overflow-y-auto px-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            {!selectedType && (
              <div className="space-y-4">
                <Label className="text-sm font-medium text-slate-700">What type of item is this?</Label>
                <div className="grid gap-3">
                  {Object.entries(typeConfig).map(([type, config]) => {
                    const Icon = config.icon;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleTypeSelect(type)}
                        className="p-4 rounded-lg border-2 border-slate-200 hover:border-slate-300 text-left transition-all hover:bg-slate-50"
                      >
                        <div className="flex items-start gap-3">
                          <Icon className={`w-5 h-5 mt-0.5 ${config.color}`} />
                          <div>
                            <h4 className="font-semibold text-slate-900">{config.label}</h4>
                            <p className="text-sm text-slate-600">{config.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Form Content */}
            {selectedType && (
              <div className="space-y-6">
                {/* Selected Type Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      {React.createElement(typeConfig[selectedType].icon, { className: "w-3 h-3" })}
                      {typeConfig[selectedType].label}
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedType(null);
                      setFormData(prev => ({ ...prev, type: '' }));
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="What needs to be done?"
                    className="text-lg"
                  />
                </div>

                {/* Course Selection */}
                {formData.type === 'class' && courses.length > 0 && (
                  <div className="space-y-2">
                    <Label>Course (optional)</Label>
                    <Select 
                      value={formData.course_name} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, course_name: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course, index) => (
                          <SelectItem key={index} value={course.name}>
                            {course.name} {course.code && `(${course.code})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Goal Section */}
                {(formData.type === 'class' || formData.type === 'activity') && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-600" />
                      <Label className="font-medium">Goal *</Label>
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
                      placeholder="What do you want to achieve with this item?"
                      className="min-h-20"
                    />
                  </div>
                )}

                {/* Optional Goal for Admin Items */}
                {formData.type === 'admin' && (
                  <div className="space-y-2">
                    <Label>Goal (optional)</Label>
                    <Textarea
                      value={formData.goal}
                      onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                      placeholder="What do you want to achieve? (optional for admin items)"
                      className="min-h-20"
                    />
                  </div>
                )}

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

                {/* Major Project Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="major-project" className="font-medium">Major Project</Label>
                    <p className="text-sm text-slate-600">
                      This is a complex project that can be broken down into sub-items
                    </p>
                  </div>
                  <Switch
                    id="major-project"
                    checked={formData.is_major_project}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_major_project: checked }))}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            {selectedType && (
              <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!canSubmit}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Item
                </Button>
              </div>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
