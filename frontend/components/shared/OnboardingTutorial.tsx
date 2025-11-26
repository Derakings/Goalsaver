'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Users, Bell, Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api';

interface OnboardingTutorialProps {
  onComplete: () => void;
}

interface TutorialStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    icon: <Plus className="w-12 h-12 text-blue-500" />,
    title: 'Create a Savings Group',
    description: 'Start by creating a savings group for a goal you want to achieve. Set your target amount and invite friends or family to join you.',
    action: 'Click "Create Group" to get started',
  },
  {
    icon: <Users className="w-12 h-12 text-green-500" />,
    title: 'Join Existing Groups',
    description: 'Browse public groups or join with an invitation code. Save together with others who share similar goals.',
    action: 'Check out available groups in the Groups tab',
  },
  {
    icon: <TrendingUp className="w-12 h-12 text-purple-500" />,
    title: 'Make Contributions',
    description: 'Contribute regularly to your savings groups. Track your progress and watch your savings grow towards your goal.',
    action: 'View your groups to make contributions',
  },
  {
    icon: <Bell className="w-12 h-12 text-orange-500" />,
    title: 'Stay Updated',
    description: "Get notifications about group activities, contributions, and when you're close to reaching your goals.",
    action: 'Check the bell icon for notifications',
  },
];

export function OnboardingTutorial({ onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      await authApi.completeTutorial();
    } catch (error) {
      console.error('Failed to mark tutorial as completed:', error);
    }
    onComplete();
  };

  const handleSkip = async () => {
    try {
      await authApi.completeTutorial();
    } catch (error) {
      console.error('Failed to mark tutorial as completed:', error);
    }
    onComplete();
  };

  const step = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative border-2 border-blue-500/20"
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Close tutorial"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Progress dots */}
        <div className="flex justify-center mb-6 space-x-2">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'w-8 bg-blue-500'
                  : index < currentStep
                  ? 'w-2 bg-blue-300'
                  : 'w-2 bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="text-center"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center">
                {step.icon}
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {step.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">
              {step.description}
            </p>

            {/* Action hint */}
            {step.action && (
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-6">
                💡 {step.action}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Skip Tutorial
          </button>

          <Button
            variant="primary"
            onClick={handleNext}
            className="flex items-center space-x-2"
          >
            <span>{currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Step counter */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Step {currentStep + 1} of {tutorialSteps.length}
        </p>
      </motion.div>
    </div>
  );
}
