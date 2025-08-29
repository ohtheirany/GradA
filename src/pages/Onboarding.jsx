
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, ArrowLeft, Target, Sparkles, BookOpen, Calendar, Heart, Star, CheckCircle } from 'lucide-react'; // Added CheckCircle
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';

const goalExamples = [
  "Build a strong portfolio so that I can land my dream internship",
  "Graduate summa cum laude because I want to get into medical school",
  "Develop leadership skills so that I can start my own nonprofit",
  "Maintain 3.5+ GPA because I need to keep my scholarship"
];

const pages = [
  { id: 'welcome', title: 'Welcome to Grada' },
  { id: 'how-it-works', title: 'How it works' },
  { id: 'goal-setting', title: 'Set your semester goal' },
  { id: 'goal-input', title: 'Your semester goal' },
  { id: 'semester-setup', title: 'Set up your semester' },
  { id: 'name-input', title: 'Your name' },
  { id: 'greeting', title: 'Welcome!' },
  { id: 'tutorial', title: "You're ready to start!" }
];

const courseColors = [
  { value: 'blue', bg: 'bg-blue-500' },
  { value: 'green', bg: 'bg-green-500' },
  { value: 'purple', bg: 'bg-purple-500' },
  { value: 'orange', bg: 'bg-orange-500' },
  { value: 'pink', bg: 'bg-pink-500' },
  { value: 'yellow', bg: 'bg-yellow-500' },
  { value: 'red', bg: 'bg-red-500' },
  { value: 'cyan', bg: 'bg-cyan-500' }
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [userData, setUserData] = useState({
    semester_goal: '',
    semester_term: 'fall-2025',
    courses: [],
    full_name: ''
  });
  const [newCourse, setNewCourse] = useState({
    name: '',
    code: '',
    professor: '',
    color: 'blue',
    class_times: [],
    personal_notes: ''
  });
  const [showAddClassTime, setShowAddClassTime] = useState(false);
  const [newClassTime, setNewClassTime] = useState({
    day: '',
    start_time: '',
    end_time: ''
  });

  // Carousel effect for goal examples
  useEffect(() => {
    if (pages[currentPage]?.id === 'goal-setting') {
      const interval = setInterval(() => {
        setCurrentExampleIndex((prev) => (prev + 1) % goalExamples.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleComplete = async () => {
    try {
      await User.updateMyUserData({
        ...userData,
        onboarding_completed: true
      });
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const addCourse = () => {
    if (newCourse.name.trim()) {
      setUserData(prev => ({
        ...prev,
        courses: [...prev.courses, newCourse]
      }));
      setNewCourse({ name: '', code: '', professor: '', color: 'blue', class_times: [], personal_notes: '' });
    }
  };

  const removeCourse = (index) => {
    setUserData(prev => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index)
    }));
  };

  const addClassTime = () => {
    if (newClassTime.day && newClassTime.start_time && newClassTime.end_time) {
      setNewCourse(prev => ({
        ...prev,
        class_times: [...prev.class_times, newClassTime]
      }));
      setNewClassTime({ day: '', start_time: '', end_time: '' });
      setShowAddClassTime(false);
    }
  };

  const removeClassTime = (index) => {
    setNewCourse(prev => ({
      ...prev,
      class_times: prev.class_times.filter((_, i) => i !== index)
    }));
  };

  const renderWelcomePage = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="w-20 h-20 mx-auto">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6555950c7_grada_icon_illustrator_fix.png"
            alt="Grada Logo"
            className="w-20 h-20 rounded-2xl shadow-lg"
          />
        </div>
        <h1 className="text-4xl font-bold" style={{ color: '#8b7355' }}>Welcome to Grada</h1>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <p className="text-xl leading-relaxed" style={{ color: '#8b7355' }}>
          Grada is an assignment tracker for your college semesters, but does things in a different way.
        </p>

        <div className="bg-yellow-50 rounded-xl p-6 space-y-4">
          <p style={{ color: '#8b7355' }}>
            We use to-do lists to keep track of the things we need to do, but they have a tendency to become:
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-3" style={{ color: '#8b7355' }}>
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>Endless lists of tasks without purpose</span>
            </div>
            <div className="flex items-center gap-3" style={{ color: '#8b7355' }}>
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>Busy work that disconnects us from our actual goals</span>
            </div>
            <div className="flex items-center gap-3" style={{ color: '#8b7355' }}>
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>Overwhelming without showing us why any of it matters</span>
            </div>
          </div>
        </div>

        <p style={{ color: '#8b7355' }}>
          <strong>Grada has a different approach.</strong> On a conventional list, an item is a thing you have "to do". But on Grada, when you create an item, you have to fill out a goal for the item. That goal is entirely dependent on you and what you've set as your overarching goal for the semester.
        </p>
      </div>
    </div>
  );

  const renderHowItWorksPage = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold" style={{ color: '#8b7355' }}>How it works</h1>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <p style={{ color: '#8b7355' }}>
          For example, if you've thought hard about your goal for the semester and set it in Grada as
        </p>

        <div className="text-center my-6">
          <p className="text-3xl font-bold font-['Caveat',cursive]" style={{ color: '#000000' }}>
            "To maintain greater than 3.90 CGPA to graduate Summa Cum Laude"
          </p>
        </div>

        <p style={{ color: '#8b7355' }}>
          then you might set the goal for your final year psychology major class project to be
        </p>

        <div className="text-center my-6">
          <p className="text-3xl font-bold font-['Caveat',cursive]" style={{ color: '#000000' }}>
            "Get greater than 90% to maintain A Average"
          </p>
        </div>

        <p style={{ color: '#8b7355' }}>
          On your dashboard, items won't just display their titles and due dates like in conventional to-do lists. Instead, items are displayed prominently with the goal you've typed out for them in handwritten text. Our hope is that seeing everything as "goals" makes the "why" of completing these tasks much clearer and actionable.
        </p>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
          <div className="text-center">
            <div className="mb-4">
              <p className="text-sm mb-2" style={{ color: '#8b7355' }}>Dashboard mockup with the example above - semester goal at top, assignment with handwritten goal text below</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGoalSettingPage = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold" style={{ color: '#8b7355' }}>Set your semester goal</h1>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <p style={{ color: '#8b7355' }}>
          Now that you know how it works, you can begin setting up Grada by writing out your goal for this semester.
        </p>

        <p style={{ color: '#8b7355' }}>
          Take a moment to think about what you really want to accomplish this semester. Your goal is something specific to what you want to achieve and not others.
        </p>

        {/* Carousel Examples */}
        <div className="bg-slate-50 rounded-xl p-6 min-h-[80px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentExampleIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-xl font-['Caveat',cursive] font-medium" style={{ color: '#000000' }}>
                "{goalExamples[currentExampleIndex]}"
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <p style={{ color: '#8b7355' }}>
          If you don't have a goal yet or are still thinking about it, you can skip for now and write it once it's come to you.
        </p>

        <div className="text-center space-y-4">
          <button
            onClick={handleNext}
            className="btn-continue"
          >
            Write Goal
          </button>
          <div>
            <button
              onClick={() => setCurrentPage(pages.findIndex(p => p.id === 'semester-setup'))}
              className="btn-skip"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGoalInputPage = () => {
    const wordCount = userData.semester_goal.trim().split(/\s+/).filter(word => word.length > 0).length;
    const charCount = userData.semester_goal.length;
    const isOverLimit = wordCount > 15 || charCount > 100;

    return (
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
          <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: '#8b7355' }}>Your Semester Goal</h1>
          <p className="max-w-md mx-auto" style={{ color: '#8b7355' }}>
            Now that you know how it works, you can begin setting up Grada by writing out your goal for this semester.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center space-y-6 max-w-2xl mx-auto w-full relative z-10"
        >
          <div className="space-y-4 text-xl" style={{ color: '#8b7355' }}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="font-bold">For</span>
                <Select
                  value={userData.semester_term}
                  onValueChange={(value) => setUserData(prev => ({ ...prev, semester_term: value }))}
                >
                  <SelectTrigger className="w-auto text-xl font-bold border-0 bg-transparent focus:ring-0 p-0 h-auto" style={{ color: '#8b7355' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fall-2025">Fall 2025</SelectItem>
                    <SelectItem value="spring-2026">Spring 2026</SelectItem>
                    <SelectItem value="summer-2025">Summer 2025</SelectItem>
                    <SelectItem value="winter-2025">Winter 2025</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="text-xl font-bold text-center" style={{ color: '#8b7355' }}>
              my goal is to
            </div>
            <div className="min-h-[100px] text-xl font-bold text-center px-4 relative mb-6">
              <div
                className={`font-['Caveat',cursive] leading-relaxed min-h-[2rem] ${isOverLimit ? 'text-red-600' : ''}`}
                style={{ fontSize: '1.5rem', lineHeight: '1.6', color: isOverLimit ? '#dc2626' : '#000000' }}
              >
                {userData.semester_goal || <span className="animate-pulse">|</span>}
              </div>
              <textarea
                value={userData.semester_goal}
                onChange={(e) => setUserData(prev => ({ ...prev, semester_goal: e.target.value }))}
                placeholder=""
                className="absolute inset-0 w-full h-full opacity-0 resize-none border-0 outline-0 bg-transparent text-center font-['Caveat',cursive]"
                style={{ fontSize: '1.5rem', lineHeight: '1.6' }}
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

          <div className="bg-gradient-to-r from-orange-50/30 to-amber-50/30 border border-orange-200/50 rounded-xl p-3 opacity-40">
            <p className="text-xs italic" style={{ color: '#8b7355' }}>
              You can only change this goal 3 times during the semester
            </p>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const renderSemesterSetupPage = () => {
    const daysOfWeek = [
      { value: 'monday', label: 'Monday' },
      { value: 'tuesday', label: 'Tuesday' },
      { value: 'wednesday', label: 'Wednesday' },
      { value: 'thursday', label: 'Thursday' },
      { value: 'friday', label: 'Friday' },
      { value: 'saturday', label: 'Saturday' },
      { value: 'sunday', label: 'Sunday' }
    ];

    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold" style={{ color: '#8b7355' }}>Set up your semester</h1>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <p style={{ color: '#8b7355' }}>Add your courses to organize your assignments better</p>
          </div>

          {/* Course Creation Section */}
          <div className="bg-white/80 rounded-xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#8b7355' }}>Create Course</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium" style={{ color: '#8b7355' }}>Course name *</Label>
                  <Input
                    placeholder="e.g., Calculus II"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse(prev => ({...prev, name: e.target.value}))}
                    className="placeholder:text-gray-300 placeholder:text-xs border-slate-200 focus:border-slate-300 focus:ring-0"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium" style={{ color: '#8b7355' }}>Course code</Label>
                  <Input
                    placeholder="e.g., MATH 152"
                    value={newCourse.code}
                    onChange={(e) => setNewCourse(prev => ({...prev, code: e.target.value}))}
                    className="placeholder:text-gray-300 placeholder:text-xs border-slate-200 focus:border-slate-300 focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium" style={{ color: '#8b7355' }}>Professor</Label>
                <Input
                  placeholder="Professor name"
                  value={newCourse.professor}
                  onChange={(e) => setNewCourse(prev => ({...prev, professor: e.target.value}))}
                  className="placeholder:text-gray-300 placeholder:text-xs border-slate-200 focus:border-slate-300 focus:ring-0"
                />
              </div>

              {/* Personal Notes Field */}
              <div>
                <Label className="text-sm font-medium" style={{ color: '#8b7355' }}>Personal notes (optional)</Label>
                <Textarea
                  placeholder="Any notes about this course..."
                  value={newCourse.personal_notes}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      setNewCourse(prev => ({...prev, personal_notes: e.target.value}));
                    }
                  }}
                  className="placeholder:text-gray-300 placeholder:text-xs border-slate-200 focus:border-slate-300 focus:ring-0 min-h-20"
                />
                <p className="text-xs text-gray-500 mt-1">{newCourse.personal_notes.length}/200 characters</p>
              </div>

              {/* Class Times Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium" style={{ color: '#8b7355' }}>Class times</Label>
                  {!showAddClassTime && (
                    <button
                      type="button"
                      onClick={() => setShowAddClassTime(true)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      + Add class time
                    </button>
                  )}
                </div>

                {/* Show existing class times for the newCourse being built */}
                {newCourse.class_times.length > 0 && (
                  <div className="space-y-2">
                    {newCourse.class_times.map((classTime, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded border text-sm">
                        <span style={{ color: '#8b7355' }}>
                          {daysOfWeek.find(d => d.value === classTime.day)?.label} {classTime.start_time} - {classTime.end_time}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeClassTime(index)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Class Time Form */}
                {showAddClassTime && (
                  <div className="p-4 bg-slate-50 rounded-lg border space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs font-medium" style={{ color: '#8b7355' }}>Day</Label>
                        <Select
                          value={newClassTime.day}
                          onValueChange={(value) => setNewClassTime(prev => ({...prev, day: value}))}
                        >
                          <SelectTrigger className="text-sm border-slate-200 focus:border-slate-300 focus:ring-0">
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                          <SelectContent>
                            {daysOfWeek.map((day) => (
                              <SelectItem key={day.value} value={day.value}>
                                {day.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs font-medium" style={{ color: '#8b7355' }}>Start time</Label>
                        <input
                          type="time"
                          value={newClassTime.start_time}
                          onChange={(e) => setNewClassTime(prev => ({...prev, start_time: e.target.value}))}
                          className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 focus:border-slate-300 focus:outline-none focus:ring-0"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium" style={{ color: '#8b7355' }}>End time</Label>
                        <input
                          type="time"
                          value={newClassTime.end_time}
                          onChange={(e) => setNewClassTime(prev => ({...prev, end_time: e.target.value}))}
                          className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 focus:border-slate-300 focus:outline-none focus:ring-0"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddClassTime(false);
                          setNewClassTime({ day: '', start_time: '', end_time: '' });
                        }}
                        className="px-3 py-1 text-sm text-slate-600 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={addClassTime}
                        disabled={!newClassTime.day || !newClassTime.start_time || !newClassTime.end_time}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block" style={{ color: '#8b7355' }}>Course color</Label>
                <div className="flex flex-wrap gap-3">
                  {courseColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setNewCourse(prev => ({...prev, color: color.value}))}
                      className={`w-6 h-6 rounded-lg border-2 transition-all ${color.bg} ${
                        newCourse.color === color.value 
                          ? 'border-slate-700 shadow-sm scale-110' 
                          : 'border-slate-300 hover:border-slate-400'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button 
                onClick={addCourse} 
                disabled={!newCourse.name.trim()}
                className="btn-continue w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Add Course
              </button>
            </div>
          </div>

          {/* Added Courses List */}
          {userData.courses.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium" style={{ color: '#8b7355' }}>Your courses:</h4>
              {userData.courses.map((course, index) => (
                <div key={index} className="relative bg-white rounded-lg border border-slate-200 overflow-hidden">
                  {/* Color accent bar */}
                  <div 
                    className={`absolute left-0 top-0 bottom-0 w-1 ${courseColors.find(c => c.value === course.color)?.bg || 'bg-blue-500'}`}
                  ></div>
                  
                  <div className="flex items-center justify-between p-4 pl-6">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium" style={{ color: '#8b7355' }}>
                          {course.name}
                        </span>
                        {course.code && (
                          <span className="text-xs font-light text-gray-400">({course.code})</span>
                        )}
                      </div>
                      {course.professor && (
                        <p className="text-sm" style={{ color: '#8b7355' }}>Prof. {course.professor}</p>
                      )}
                      {course.personal_notes && (
                        <p className="text-sm text-gray-600 mt-1">{course.personal_notes}</p>
                      )}
                      {/* Display multiple class times */}
                      {course.class_times && course.class_times.length > 0 && (
                        <div className="text-sm mt-1" style={{ color: '#8b7355' }}>
                          {course.class_times.map((classTime, timeIndex) => (
                            <div key={timeIndex}>
                              {daysOfWeek.find(d => d.value === classTime.day)?.label} {classTime.start_time} - {classTime.end_time}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeCourse(index)}
                      className="w-8 h-8 text-amber-800 hover:text-amber-900 flex items-center justify-center transition-colors text-lg"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="btn-skip"
            >
              Skip
            </button>
            <button 
              onClick={() => setCurrentPage(currentPage + 1)} 
              className="btn-continue"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderNameInputPage = () => {
    return (
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
          <h1 className="text-3xl font-bold" style={{ color: '#8b7355' }}>Finally, what's your name?</h1>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center space-y-6 max-w-2xl mx-auto w-full relative z-10"
        >
          <div className="min-h-[100px] text-xl font-bold text-center px-4 relative mb-6">
            <div
              className="font-['Caveat',cursive] leading-relaxed min-h-[2rem]"
              style={{ fontSize: '2rem', lineHeight: '1.6', color: '#000000' }}
            >
              {userData.full_name || <span className="animate-pulse">|</span>}
            </div>
            <textarea
              value={userData.full_name}
              onChange={(e) => setUserData(prev => ({ ...prev, full_name: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && userData.full_name.trim()) {
                  e.preventDefault();
                  handleNext();
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 resize-none border-0 outline-0 bg-transparent text-center font-['Caveat',cursive]"
              style={{ fontSize: '2rem', lineHeight: '1.6', pointerEvents: 'all' }}
              placeholder=""
            />
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const renderGreetingPage = () => {
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="min-h-[500px] flex flex-col items-center justify-center space-y-8"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl font-bold" style={{ color: '#8b7355' }}>
            Hello, {userData.full_name}, welcome to Grada
          </h1>
        </motion.div>
      </motion.div>
    );
  };

  const renderTutorialPage = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold" style={{ color: '#8b7355' }}>You're ready to start!</h1>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <p className="text-lg" style={{ color: '#8b7355' }}>Here's how Grada works:</p>

        <div className="space-y-6">
          <div className="text-left">
            <h3 className="font-semibold mb-2" style={{ color: '#8b7355' }}>1. Goals are required, deadlines are optional</h3>
            <p className="text-sm mb-4" style={{ color: '#8b7355' }}>
              Class items (assignments, lectures, etc.) and extracurricular items must have goals. Specifying deadlines/due dates for these items are optional.
            </p>
            <p className="text-sm mb-4" style={{ color: '#8b7355' }}>
              In other words, you can create an item with a goal and without typing the due date, but you cannot create an item with a due date but no goal.
            </p>
            <p className="text-sm mb-4" style={{ color: '#8b7355' }}>
              To create an item, you'll fill out a goal:
            </p>
            
            {/* Goal Template Examples */}
            <div className="space-y-3 mt-4 max-w-full">
              <div className="bg-blue-25 border border-blue-100 rounded-lg p-3" style={{ backgroundColor: '#f8faff' }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-blue-700 font-medium text-sm">Custom:</span>
                  <div className="flex-1 min-w-32 border-b border-blue-200 border-dashed h-6 bg-white/70 rounded px-2 py-1 flex items-center">
                    <span className="text-blue-500 text-xs">Write your own goal...</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-25 border border-green-100 rounded-lg p-3" style={{ backgroundColor: '#f7fdf7' }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-green-700 font-medium text-sm">Deep learn:</span>
                  <div className="flex-1 min-w-24 border-b border-green-200 border-dashed h-6 bg-white/70 rounded px-2 py-1 flex items-center">
                    <span className="text-green-500 text-xs">topic/concept</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-25 border border-purple-100 rounded-lg p-3" style={{ backgroundColor: '#fdfaff' }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-purple-700 font-medium text-sm">Score greater than:</span>
                  <div className="w-12 border-b border-purple-200 border-dashed h-6 bg-white/70 rounded px-1 py-1 flex items-center">
                    <span className="text-purple-500 text-xs">%</span>
                  </div>
                  <span className="text-purple-700 font-medium text-sm">for:</span>
                  <div className="flex-1 min-w-20 border-b border-purple-200 border-dashed h-6 bg-white/70 rounded px-2 py-1 flex items-center">
                    <span className="text-purple-500 text-xs">assignment</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-25 border border-orange-100 rounded-lg p-3" style={{ backgroundColor: '#fffcf7' }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-orange-700 font-medium text-sm">Read and understand:</span>
                  <div className="flex-1 min-w-20 border-b border-orange-200 border-dashed h-6 bg-white/70 rounded px-2 py-1 flex items-center mr-2">
                    <span className="text-orange-500 text-xs">material</span>
                  </div>
                  <span className="text-orange-700 font-medium text-sm">deeply</span>
                </div>
              </div>
              
              <div className="bg-pink-25 border border-pink-100 rounded-lg p-3" style={{ backgroundColor: '#fffafd' }}>
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-pink-700 font-medium text-sm">Practice:</span>
                  <div className="flex-1 min-w-16 border-b border-pink-200 border-dashed h-6 bg-white/70 rounded px-2 py-1 flex items-center mr-1">
                    <span className="text-pink-500 text-xs">skill</span>
                  </div>
                  <span className="text-pink-700 font-medium text-sm">until:</span>
                  <div className="flex-1 min-w-20 border-b border-pink-200 border-dashed h-6 bg-white/70 rounded px-2 py-1 flex items-center">
                    <span className="text-pink-500 text-xs">proficient</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-left">
            <h3 className="font-semibold mb-2" style={{ color: '#8b7355' }}>2. Your semester goal stays visible</h3>
            <p className="text-sm" style={{ color: '#8b7355' }}>
              It'll appear at the top of your homepage to keep you focused on the big picture.
            </p>
          </div>

          <div className="text-left">
            <h3 className="font-semibold mb-2" style={{ color: '#8b7355' }}>3. Break down major projects</h3>
            <p className="text-sm mb-4" style={{ color: '#8b7355' }}>
              For big assignments like semester projects, research papers, or any other project which will be worked on over an extended time, you can create sub-items.
            </p>
            <p className="text-sm mb-4" style={{ color: '#8b7355' }}>
              Sub-items behave exactly as class items and extracurricular items.
            </p>
            <p className="text-sm" style={{ color: '#8b7355' }}>
              You can select which sub-item to display on your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch (pages[currentPage].id) {
      case 'welcome':
        return renderWelcomePage();
      case 'how-it-works':
        return renderHowItWorksPage();
      case 'goal-setting':
        return renderGoalSettingPage();
      case 'goal-input':
        return renderGoalInputPage();
      case 'semester-setup':
        return renderSemesterSetupPage();
      case 'name-input':
        return renderNameInputPage();
      case 'greeting':
        return renderGreetingPage();
      case 'tutorial':
        return renderTutorialPage();
      default:
        return null;
    }
  };

  const canProceed = () => {
    if (pages[currentPage].id === 'goal-input') {
      const wordCount = userData.semester_goal.trim().split(/\s+/).filter(word => word.length > 0).length;
      const charCount = userData.semester_goal.length;
      return userData.semester_goal.trim().length > 0 && wordCount <= 15 && charCount <= 100;
    }
    if (pages[currentPage].id === 'name-input') {
      return userData.full_name.trim().length > 0;
    }
    return true;
  };

  return (
    <div className="onboarding-page-wrapper">
      <style>{`
        .btn-base {
          padding-left: 1rem; /* px-4 */
          padding-right: 1rem; /* px-4 */
          padding-top: 0.5rem; /* py-2 */
          padding-bottom: 0.5rem; /* py-2 */
          border-radius: 0.5rem;
          font-weight: 500;
          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
          transition-duration: 200ms;
          outline: none;
          box-shadow: 0 0 0 0 transparent;
        }
        .btn-continue {
          @apply btn-base bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500;
        }
        .btn-create {
          @apply btn-base bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500;
        }
        .btn-semester-goal {
          @apply btn-base bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500 text-lg px-8 py-3;
        }
        .btn-skip {
          @apply btn-base text-orange-600 hover:text-orange-800 underline text-sm;
        }
      `}</style>
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#FF5503' }}>
        <div className="w-full max-w-4xl">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {pages.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index <= currentPage ? 'bg-white' : 'bg-orange-300'
                }`}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 backdrop-blur-sm shadow-xl border border-orange-200 rounded-lg">
            <div className="p-8">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderCurrentPage()}
              </motion.div>

              {/* Navigation */}
              <div className="flex justify-center items-center mt-12 pt-6 border-t border-orange-200 gap-4">
                {(currentPage < pages.length - 1 && pages[currentPage].id !== 'goal-input' && pages[currentPage].id !== 'semester-setup' && pages[currentPage].id !== 'name-input' && pages[currentPage].id !== 'greeting') && (
                  <div>
                    <button onClick={handleNext} className="btn-continue">
                      Continue
                    </button>
                  </div>
                )}

                {pages[currentPage].id === 'goal-input' && (
                  <div className="w-full flex justify-center">
                    <button
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className="btn-semester-goal disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirm semester goal
                    </button>
                  </div>
                )}

                {pages[currentPage].id === 'name-input' && (
                  <div className="w-full flex justify-center">
                    <button
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className="btn-semester-goal disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {pages[currentPage].id === 'greeting' && (
                  <div className="w-full flex justify-center">
                    <button
                      onClick={handleNext}
                      className="btn-continue"
                    >
                      Let's get started
                    </button>
                  </div>
                )}

                {currentPage === pages.length - 1 && (
                  <div className="w-full flex justify-center">
                    <button onClick={handleComplete} className="btn-semester-goal">
                      Start Using Grada
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
