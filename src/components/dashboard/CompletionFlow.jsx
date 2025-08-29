
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, ArrowRight, Target } from 'lucide-react';
import { Item } from '@/api/entities';

export default function CompletionFlow({ item, onComplete, onCancel }) {
  const [step, setStep] = useState('initial');
  const [selectedOutcome, setSelectedOutcome] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [reflectionText, setReflectionText] = useState('');
  const [whatWentWrong, setWhatWentWrong] = useState('');
  const [whatWouldDoDifferently, setWhatWouldDoDifferently] = useState('');
  const [longReflection, setLongReflection] = useState('');

  const handleInitialSelection = (outcome) => {
    setSelectedOutcome(outcome);
    if (outcome === 'pending_result') {
      handlePendingResult();
    } else if (outcome === 'goal_achieved') {
      setStep('experience');
    } else {
      setStep('reflection_failure');
    }
  };

  const handlePendingResult = async () => {
    try {
      await Item.update(item.id, {
        status: 'pending',
        completion_outcome: 'pending_result',
        completion_date: new Date().toISOString()
      });
      onComplete();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleExperienceSelection = (experience) => {
    setSelectedExperience(experience);
    setStep('reflection_success');
  };

  const handleSuccessComplete = async () => {
    try {
      await Item.update(item.id, {
        status: 'completed',
        completion_outcome: 'goal_achieved',
        experience_rating: selectedExperience,
        reflection_text: reflectionText,
        completion_date: new Date().toISOString()
      });
      onComplete();
    } catch (error) {
      console.error('Error completing item:', error);
    }
  };

  const handleFailureComplete = async () => {
    try {
      await Item.update(item.id, {
        status: 'completed',
        completion_outcome: 'not_achieved',
        what_went_wrong: whatWentWrong,
        what_would_do_differently: whatWouldDoDifferently,
        long_reflection: longReflection,
        completion_date: new Date().toISOString()
      });
      onComplete();
    } catch (error) {
      console.error('Error completing item:', error);
    }
  };

  const canContinue = () => {
    if (step === 'reflection_success') {
      return reflectionText.trim().length > 0;
    }
    if (step === 'reflection_failure') {
      return whatWentWrong.trim().length > 0 && whatWouldDoDifferently.trim().length > 0;
    }
    return true;
  };

  const renderInitialStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Task Completed!</h3>
          <p className="text-slate-600">How did it go with your goal?</p>
        </div>
      </div>

      {/* Goal Reminder */}
      <Card className="bg-slate-50 border-0">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-slate-600 mb-1">Your goal was:</p>
              <p className="text-slate-900 font-medium">{item.goal}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Outcome Options */}
      <div className="grid gap-3">
        <button
          onClick={() => handleInitialSelection('goal_achieved')}
          className="p-4 rounded-lg border-2 border-green-200 bg-green-50 hover:bg-green-100 text-left transition-all group"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-800">Goal Achieved</h4>
              <p className="text-sm text-green-700">I accomplished what I set out to do</p>
            </div>
            <ArrowRight className="w-4 h-4 text-green-600 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => handleInitialSelection('not_achieved')}
          className="p-4 rounded-lg border-2 border-orange-200 bg-orange-50 hover:bg-orange-100 text-left transition-all group"
        >
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-orange-600" />
            <div>
              <h4 className="font-semibold text-orange-800">Not Achieved</h4>
              <p className="text-sm text-orange-700">I didn't meet my goal, but I completed the work</p>
            </div>
            <ArrowRight className="w-4 h-4 text-orange-600 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => handleInitialSelection('pending_result')}
          className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 text-left transition-all group"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-800">Pending Result</h4>
              <p className="text-sm text-blue-700">I've done the work, but waiting for grades/feedback</p>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-600 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  );

  const renderExperienceStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-slate-900">How did it go?</h3>
        <p className="text-slate-600">Tell us about your experience achieving this goal</p>
      </div>

      <RadioGroup value={selectedExperience} onValueChange={handleExperienceSelection}>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
            <RadioGroupItem value="better_than_expected" id="better" />
            <Label htmlFor="better" className="cursor-pointer flex-1">
              <span className="font-medium text-slate-900">Better than expected</span>
              <p className="text-sm text-slate-600">Exceeded my expectations</p>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
            <RadioGroupItem value="as_expected" id="expected" />
            <Label htmlFor="expected" className="cursor-pointer flex-1">
              <span className="font-medium text-slate-900">As expected</span>
              <p className="text-sm text-slate-600">Went according to plan</p>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
            <RadioGroupItem value="not_as_planned" id="not-planned" />
            <Label htmlFor="not-planned" className="cursor-pointer flex-1">
              <span className="font-medium text-slate-900">Not as planned</span>
              <p className="text-sm text-slate-600">Achieved the goal but it was more difficult</p>
            </Label>
          </div>
        </div>
      </RadioGroup>

      {selectedExperience && (
        <div className="flex justify-end">
          <Button onClick={() => setStep('reflection_success')}>
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );

  const renderSuccessReflection = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-slate-900">Reflection</h3>
        <p className="text-slate-600">What factors led to this outcome?</p>
      </div>

      <div className="space-y-4">
        <Textarea
          placeholder="Reflect on what contributed to your success..."
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          className="min-h-24"
        />
        <p className="text-xs text-slate-500">
          {reflectionText.length} characters • Minimum 10 characters
        </p>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSuccessComplete} disabled={!canContinue()}>
          Complete
        </Button>
      </div>
    </div>
  );

  const renderFailureReflection = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-slate-900">Learning from Experience</h3>
        <p className="text-slate-600">Failure is part of the growth process</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>What went wrong?</Label>
          <Textarea
            placeholder="Write down what you think went wrong..."
            value={whatWentWrong}
            onChange={(e) => setWhatWentWrong(e.target.value)}
            className="min-h-20"
          />
        </div>

        <div className="space-y-2">
          <Label>What would you do differently next time?</Label>
          <Textarea
            placeholder="What would you change for next time..."
            value={whatWouldDoDifferently}
            onChange={(e) => setWhatWouldDoDifferently(e.target.value)}
            className="min-h-20"
          />
        </div>

        <div className="space-y-2">
          <Label>Long reflection (optional)</Label>
          <Textarea
            placeholder="Any additional thoughts or insights..."
            value={longReflection}
            onChange={(e) => setLongReflection(e.target.value)}
            className="min-h-24"
          />
          <p className="text-xs text-slate-500">This won't appear in your summary</p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleFailureComplete} disabled={!canContinue()}>
          Complete
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {item.title}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
          {step === 'initial' && renderInitialStep()}
          {step === 'experience' && renderExperienceStep()}
          {step === 'reflection_success' && renderSuccessReflection()}
          {step === 'reflection_failure' && renderFailureReflection()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
