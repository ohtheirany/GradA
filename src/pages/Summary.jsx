
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Item } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Target, CheckCircle, XCircle, TrendingUp, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

const fontClasses = {
  'caveat': 'font-["Caveat",cursive]'
};

export default function SummaryPage() {
  const [user, setUser] = useState(null);
  const [completedItems, setCompletedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      
      const items = await Item.filter({ status: 'completed' }, '-completion_date');
      setCompletedItems(items);
    } catch (error) {
      console.error('Error loading summary data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 bg-indigo-600 rounded-full"></div>
          <div className="text-slate-600">Loading your progress...</div>
        </div>
      </div>
    );
  }

  const achievedGoals = completedItems.filter(item => item.completion_outcome === 'goal_achieved');
  const failedGoals = completedItems.filter(item => item.completion_outcome === 'not_achieved');
  
  const experienceStats = achievedGoals.reduce((acc, item) => {
    if (item.experience_rating) {
      acc[item.experience_rating] = (acc[item.experience_rating] || 0) + 1;
    }
    return acc;
  }, {});

  const renderSummaryEntry = (item) => {
    const isAchieved = item.completion_outcome === 'goal_achieved';
    const completionDate = new Date(item.completion_date);
    
    return (
      <Card key={item.id} className="bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              isAchieved ? 'bg-green-100' : 'bg-orange-100'
            }`}>
              {isAchieved ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-orange-600" />
              )}
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                    <Calendar className="w-3 h-3" />
                    {format(completionDate, 'MMM d, yyyy')}
                    {item.experience_rating && (
                      <>
                        <span>•</span>
                        <span className="capitalize">{item.experience_rating.replace('_', ' ')}</span>
                      </>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className={
                  isAchieved ? 'text-green-700 border-green-300' : 'text-orange-700 border-orange-300'
                }>
                  {isAchieved ? 'Achieved' : 'Not Achieved'}
                </Badge>
              </div>

              {/* Goal */}
              <div className="bg-slate-50 rounded-lg p-3">
                <p className={`text-xs text-slate-500 mb-1`}>Goal:</p>
                <p className={`text-slate-800 font-medium ${fontClasses.caveat}`}>
                  {item.goal}
                </p>
              </div>

              {/* Reflection */}
              <div className="text-sm text-slate-700 leading-relaxed">
                {isAchieved ? (
                  <p><strong>Reflection:</strong> {item.reflection_text}</p>
                ) : (
                  <div className="space-y-2">
                    <p><strong>What went wrong:</strong> {item.what_went_wrong}</p>
                    <p><strong>What to do differently:</strong> {item.what_would_do_differently}</p>
                    {item.long_reflection && (
                      <p className="text-xs text-slate-500">+ Made a long reflection</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: '#fdf9e7' }}>
      {/* Header */}
      <div className="bg-orange-400/90 backdrop-blur-sm border-b border-orange-300/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-white">Progress Summary</h1>
            <p className="text-orange-100">Your journey toward achieving your semester goal</p>
            
            {user?.semester_goal && (
              <div className="bg-orange-300/30 border border-orange-300/50 rounded-xl max-w-2xl mx-auto">
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-sm text-orange-100 mb-1">Your semester goal:</p>
                      <p className="text-lg text-white leading-relaxed font-['Caveat',cursive] font-medium">
                        {user.semester_goal}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Goals Achieved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{achievedGoals.length}</div>
              <p className="text-sm text-slate-600 mt-1">
                {completedItems.length > 0 && 
                  `${Math.round((achievedGoals.length / completedItems.length) * 100)}% success rate`
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Total Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{completedItems.length}</div>
              <p className="text-sm text-slate-600 mt-1">Items finished</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                Experience Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {experienceStats.better_than_expected || 0}
              </div>
              <p className="text-sm text-slate-600 mt-1">Better than expected</p>
            </CardContent>
          </Card>
        </div>

        {/* Chronological Progress */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold" style={{ color: '#8b7355' }}>Your Journey</h2>
            <p className="text-sm" style={{ color: '#8b7355' }}>
              Showing {completedItems.length} completed items
            </p>
          </div>

          {completedItems.length > 0 ? (
            <div className="space-y-4">
              {completedItems.map(renderSummaryEntry)}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl mx-auto flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: '#8b7355' }}>No completed items yet</h3>
              <p style={{ color: '#8b7355' }}>
                Your progress will appear here as you complete items and reflect on your goals.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
