
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Item } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Plus, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ItemCard from '../components/dashboard/ItemCard';
import NewItemDialog from '../components/dashboard/NewItemDialog';
import CompletionFlow from '../components/dashboard/CompletionFlow';
import ItemView from '../components/dashboard/ItemView';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [showNewItemDialog, setShowNewItemDialog] = useState(false);
  const [completingItem, setCompletingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      
      if (!userData.onboarding_completed) {
        navigate(createPageUrl("Onboarding"));
        return;
      }

      setUser(userData);
      
      const itemsData = await Item.list('-created_date');
      setItems(itemsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = (item) => {
    setViewingItem(item);
  };

  const handleCompletionComplete = async () => {
    setCompletingItem(null);
    await loadData();
  };

  const handleNewItem = async (itemData) => {
    await Item.create(itemData);
    setShowNewItemDialog(false);
    loadData();
  };

  const getCourseColor = (courseName) => {
    if (!courseName || !user?.courses) return 'blue';
    const course = user.courses.find(c => c.name === courseName);
    return course?.color || 'blue';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#fdf9e7' }}>
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 bg-indigo-600 rounded-full"></div>
          <div className="text-slate-600">Loading your goals...</div>
        </div>
      </div>
    );
  }

  const activeItems = items.filter(item => item.status === 'active' && !item.parent_project_id);
  const regularItems = activeItems.filter(item => !item.is_major_project);
  const majorProjects = activeItems.filter(item => item.is_major_project);
  const pendingItems = items.filter(item => item.status === 'pending');

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: '#fdf9e7' }}>
      {/* Main Dashboard */}
      <div 
        className="transition-transform duration-300 ease-in-out w-full"
        style={{
          transform: viewingItem ? 'translateX(-100%)' : 'translateX(0)'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-12">
          {/* Semester Goal Header */}
          <div className="text-center space-y-4 py-12">
            <div className="inline-flex items-center gap-2 text-slate-600 text-sm font-medium">
              <Target className="w-4 h-4" />
              {user?.semester_term?.replace('-', ' ').toUpperCase() || 'Your Semester'}
            </div>
            
            {user?.semester_goal ? (
              <h1 className="text-4xl md:text-5xl text-slate-800 leading-tight max-w-3xl mx-auto font-['Caveat',cursive] font-semibold">
                {user.semester_goal}
              </h1>
            ) : (
              <div 
                className="text-4xl md:text-5xl leading-tight max-w-3xl mx-auto font-['Caveat',cursive] font-semibold cursor-pointer hover:text-slate-600 transition-colors"
                style={{ color: '#9ca3af' }}
                onClick={() => navigate(createPageUrl("Settings"))}
              >
                You haven't entered your semester goal.<br />
                Click to enter
              </div>
            )}
          </div>

          {/* Items Section */}
          {regularItems.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-700">Items</h3>
              <div className="space-y-4">
                {regularItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onClick={() => handleItemClick(item)}
                    courseColor={getCourseColor(item.course_name)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Add Item Button */}
          <div className="flex justify-center">
            <button 
              onClick={() => setShowNewItemDialog(true)}
              className="btn-skip"
            >
              New Item
            </button>
          </div>

          {/* Pending Result Section */}
          {pendingItems.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-700">Pending Result</h3>
              <div className="space-y-4">
                {pendingItems.map((item) => (
                  <div key={item.id} className="bg-slate-100 rounded-xl p-4 opacity-75">
                    <h4 className="font-medium text-slate-700">{item.title}</h4>
                    <p className="text-slate-600 text-sm mt-1 font-['Caveat',cursive]">
                      {item.goal}
                    </p>
                    {item.completion_date && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                        Submitted {new Date(item.completion_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Major Items Section */}
          {majorProjects.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-700">Major Items</h3>
              <div className="space-y-4">
                {majorProjects.map((project) => (
                  <ItemCard
                    key={project.id}
                    item={project}
                    onClick={() => handleItemClick(project)}
                    courseColor={getCourseColor(project.course_name)}
                    isMajorProject
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {activeItems.length === 0 && pendingItems.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-200 rounded-2xl mx-auto flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-700 mb-2">Ready to start working toward your goal?</h3>
              <p className="text-slate-600 mb-6">Create your first item and connect it to your semester goal.</p>
              <button 
                onClick={() => setShowNewItemDialog(true)}
                className="btn-create text-lg px-8 py-3"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Item
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Item View - Slides in from right */}
      {viewingItem && (
        <div 
          className="absolute top-0 left-0 w-full transition-transform duration-300 ease-in-out"
          style={{
            transform: 'translateX(100%)',
            animation: 'slideInFromRight 0.3s ease-in-out forwards'
          }}
        >
          <ItemView 
            item={viewingItem}
            onBack={() => setViewingItem(null)}
            onComplete={setCompletingItem}
            onRefresh={loadData}
            courses={user?.courses || []}
          />
        </div>
      )}

      {/* Dialogs */}
      {showNewItemDialog && (
        <NewItemDialog
          open={showNewItemDialog}
          onClose={() => setShowNewItemDialog(false)}
          onSubmit={handleNewItem}
          courses={user?.courses || []}
        />
      )}

      {completingItem && (
        <CompletionFlow
          item={completingItem}
          onComplete={handleCompletionComplete}
          onCancel={() => setCompletingItem(null)}
        />
      )}

      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
