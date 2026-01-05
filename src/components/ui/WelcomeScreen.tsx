'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap, Brain, Mic } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

/**
 * WelcomeScreen - Premium onboarding experience
 * Shows features and invites user to start
 */
export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const features = [
    {
      icon: Brain,
      title: 'Deep Intelligence',
      description: 'Multi-modal AI that understands context, reasoning, and your goals',
    },
    {
      icon: Mic,
      title: 'Natural Voice',
      description: 'Ultra-realistic text-to-speech with emotion and voice cloning',
    },
    {
      icon: Sparkles,
      title: 'Live Avatar',
      description: 'Photorealistic AI assistant with expressions and gestures',
    },
    {
      icon: Zap,
      title: 'Advanced Analysis',
      description: 'Research, SWOT, strategy, and visual insights on demand',
    },
  ];

  return (
    <div className="flex h-full items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-primary-400 to-accent-500 opacity-30 blur-3xl" />
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-accent-600 shadow-2xl">
              <Sparkles className="h-16 w-16 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4 text-6xl font-bold text-neutral-900"
        >
          Welcome to <span className="gradient-text">UniWeb AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12 text-xl text-neutral-600"
        >
          The world&apos;s most advanced all-in-one AI platform
          <br />
          Chat • Voice • Avatar • Analysis — Unified in one beautiful interface
        </motion.p>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="card-interactive text-left"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold text-neutral-900">{feature.title}</h3>
              <p className="text-sm text-neutral-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={onStart}
            className="btn-primary group relative overflow-hidden px-12 py-4 text-lg"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Experience
              <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
            </span>
            <div className="absolute inset-0 -z-0 bg-gradient-to-r from-accent-600 to-primary-600 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 text-sm text-neutral-500"
        >
          Premium • Secure • Enterprise-Grade
        </motion.p>
      </motion.div>
    </div>
  );
}
