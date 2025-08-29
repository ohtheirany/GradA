
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Target } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    semester_goal: '',
    semester_term: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showGoalAnimation, setShowGoalAnimation] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setFormData({
        semester_goal: userData.semester_goal || '',
        semester_term: userData.semester_term || ''
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Check if semester goal changed
      const goalChanged = formData.semester_goal !== user.semester_goal;
      let goalChangesCount = user.goal_changes_count || 0;

      if (goalChanged) {
        if (goalChangesCount >= 3) {
          setMessage('You have reached the maximum of 3 goal changes per semester.');
          setIsSaving(false);
          return;
        }
        goalChangesCount += 1;
      }

      await User.updateMyUserData({
        ...formData,
        goal_changes_count: goalChangesCount
      });

      // Show goal animation instead of message
      setShowGoalAnimation(true);
      
      // Auto redirect to dashboard after animation
      setTimeout(() => {
        navigate(createPageUrl("Dashboard"));
      }, 7000); // Changed from 3000 to 7000

    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 bg-indigo-600 rounded-full"></div>
          <div className="text-slate-600">Loading settings...</div>
        </div>
      </div>
    );
  }

  // Goal Animation Screen
  if (showGoalAnimation) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fdf9e7' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center space-y-8 max-w-4xl mx-auto px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-6"
          >
            <p className="text-2xl md:text-3xl font-medium" style={{ color: '#8b7355' }}>
              For {formData.semester_term?.replace('-', ' ') || 'this semester'}
            </p>
            
            <p className="text-2xl md:text-3xl font-medium" style={{ color: '#8b7355' }}>
              my goal is to
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              <p className="text-3xl md:text-5xl leading-tight font-['Caveat',cursive] font-medium" style={{ color: '#000000' }}>
                {formData.semester_goal}
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5.5, duration: 0.5 }}
            className="text-slate-500 text-sm"
          >
            Returning to dashboard
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const wordCount = formData.semester_goal.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = formData.semester_goal.length;
  const isOverLimit = wordCount > 15 || charCount > 100;

  return (
    <div className="min-h-screen" style={{ background: '#fdf9e7' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(createPageUrl("Dashboard"))} className="btn-back">
            Back
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="min-h-[500px] flex flex-col items-center justify-center space-y-8"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center space-y-6"
          >
            <h1 className="text-3xl font-bold" style={{ color: '#8b7355' }}>Set Semester Goal</h1>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-center space-y-6 max-w-2xl mx-auto w-full relative z-10"
          >
            <div className="space-y-4 text-xl" style={{ color: '#8b7355' }}>
              <div className="text-xl font-bold text-center" style={{ color: '#8b7355' }}>
                my goal is to
              </div>
              <div className="min-h-[100px] text-xl font-bold text-center px-4 relative mb-6">
                {/* Subtle background box */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-lg border-0 pointer-events-none"
                  style={{ background: '#faf6ed' }}
                ></div>
                <textarea
                  value={formData.semester_goal}
                  onChange={(e) => setFormData(prev => ({ ...prev, semester_goal: e.target.value }))}
                  placeholder=""
                  className={`w-full resize-none border-0 outline-0 bg-transparent text-center font-['Caveat',cursive] relative z-10 ${isOverLimit ? 'text-red-600' : ''}`}
                  style={{ 
                    fontSize: '1.5rem', 
                    lineHeight: '1.6',
                    color: isOverLimit ? '#dc2626' : '#000000',
                    height: '100px',
                    paddingTop: '32px',
                    paddingBottom: '32px',
                    overflow: 'hidden'
                  }}
                  rows="2"
                />
              </div>

              {/* Character and word count */}
              <div className="text-xs space-y-1" style={{ color: '#8b7355' }}>
                <div className={wordCount > 15 ? 'text-red-600' : ''}>
                  {wordCount}/15 words
                </div>
                <div className={charCount > 100 ? 'text-red-600' : ''}>
                  {charCount}/100 characters
                </div>
              </div>
            </div>

            {message && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-slate-700">{message}</AlertDescription>
              </Alert>
            )}
          </motion.div>

          {/* Save Button */}
          <div className="w-full flex justify-center">
            <button
              onClick={handleSave}
              disabled={isSaving || isOverLimit || !formData.semester_goal.trim()}
              className="btn-semester-goal disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Set semester goal'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
