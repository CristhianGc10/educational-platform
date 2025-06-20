// components/ui/AchievementCelebration.tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
    Compass,
    Eye,
    Lightbulb,
    Sparkles,
    Star,
    Target,
    Trophy,
    X,
    Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { ACHIEVEMENT_DEFINITIONS } from '../../config/lab-config';

interface AchievementCelebrationProps {
    achievementId: string;
    onClose: () => void;
    autoClose?: boolean;
    autoCloseDelay?: number;
    className?: string;
}

const achievementIcons = {
    'pattern-seeker': Eye,
    'hypothesis-master': Target,
    explorer: Compass,
    'speed-demon': Zap,
    innovator: Lightbulb,
};

const rarityConfig = {
    common: {
        color: 'from-gray-400 to-gray-600',
        textColor: 'text-gray-700',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-300',
        sparkleColor: 'text-gray-400',
    },
    uncommon: {
        color: 'from-green-400 to-green-600',
        textColor: 'text-green-700',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-300',
        sparkleColor: 'text-green-400',
    },
    rare: {
        color: 'from-blue-400 to-blue-600',
        textColor: 'text-blue-700',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300',
        sparkleColor: 'text-blue-400',
    },
    legendary: {
        color: 'from-purple-400 via-pink-500 to-orange-500',
        textColor: 'text-purple-700',
        bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
        borderColor: 'border-purple-300',
        sparkleColor: 'text-purple-400',
    },
};

const AchievementCelebration: React.FC<AchievementCelebrationProps> = ({
    achievementId,
    onClose,
    autoClose = true,
    autoCloseDelay = 4000,
    className = '',
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [stage, setStage] = useState<'entrance' | 'display' | 'exit'>(
        'entrance'
    );

    const achievement = ACHIEVEMENT_DEFINITIONS.find(
        (a) => a.id === achievementId
    );

    if (!achievement) {
        onClose();
        return null;
    }

    const Icon =
        achievementIcons[achievementId as keyof typeof achievementIcons] ||
        Trophy;
    const rarity = rarityConfig[achievement.rarity];

    useEffect(() => {
        // Stage progression
        const timer1 = setTimeout(() => setStage('display'), 500);

        if (autoClose) {
            const timer2 = setTimeout(() => {
                setStage('exit');
                setTimeout(() => {
                    setIsVisible(false);
                    onClose();
                }, 500);
            }, autoCloseDelay);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        }

        return () => clearTimeout(timer1);
    }, [autoClose, autoCloseDelay, onClose]);

    const handleClose = () => {
        setStage('exit');
        setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 300);
    };

    if (!isVisible) return null;

    const containerVariants = {
        entrance: {
            scale: 0.5,
            opacity: 0,
            y: 50,
            rotate: -10,
        },
        display: {
            scale: 1,
            opacity: 1,
            y: 0,
            rotate: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 20,
            },
        },
        exit: {
            scale: 0.8,
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.3,
            },
        },
    };

    const sparkleVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 0.5,
            },
        },
    };

    const pulseVariants = {
        pulse: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4 ${className}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className={`relative max-w-md w-full ${rarity.bgColor} ${rarity.borderColor} border-2 rounded-2xl p-6 shadow-2xl overflow-hidden`}
                        variants={containerVariants}
                        initial="entrance"
                        animate="display"
                        exit="exit"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors z-10"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Achievement Header */}
                        <motion.div
                            className="text-center mb-6"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <motion.div
                                className="inline-block mb-4"
                                variants={pulseVariants}
                                animate="pulse"
                            >
                                <div
                                    className={`p-4 rounded-full bg-gradient-to-r ${rarity.color} shadow-lg`}
                                >
                                    <Icon className="h-8 w-8 text-white" />
                                </div>
                            </motion.div>

                            <motion.h2
                                className="text-2xl font-bold text-gray-900 mb-2"
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    delay: 0.3,
                                    type: 'spring',
                                    stiffness: 200,
                                }}
                            >
                                ¡Logro Desbloqueado!
                            </motion.h2>

                            <motion.div
                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${rarity.textColor} ${rarity.bgColor} border ${rarity.borderColor}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                {achievement.rarity.charAt(0).toUpperCase() +
                                    achievement.rarity.slice(1)}
                            </motion.div>
                        </motion.div>

                        {/* Achievement Details */}
                        <motion.div
                            className="text-center mb-6"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {achievement.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {achievement.description}
                            </p>
                        </motion.div>

                        {/* Points Display */}
                        <motion.div
                            className="flex items-center justify-center space-x-2 mb-6"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                delay: 0.6,
                                type: 'spring',
                                stiffness: 200,
                            }}
                        >
                            <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
                                <Star className="h-4 w-4" />
                                <span className="font-semibold">
                                    +{achievement.points} puntos
                                </span>
                            </div>
                        </motion.div>

                        {/* Celebration Message */}
                        <motion.div
                            className="text-center"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <p className="text-gray-700 font-medium">
                                {achievement.rarity === 'legendary'
                                    ? '¡Increíble hazaña!'
                                    : achievement.rarity === 'rare'
                                      ? '¡Excelente trabajo!'
                                      : achievement.rarity === 'uncommon'
                                        ? '¡Bien hecho!'
                                        : '¡Sigue así!'}
                            </p>
                        </motion.div>

                        {/* Animated Sparkles */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute"
                                    style={{
                                        left: `${10 + i * 7}%`,
                                        top: `${10 + (i % 4) * 20}%`,
                                    }}
                                    variants={sparkleVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Sparkles
                                        className={`h-4 w-4 ${rarity.sparkleColor}`}
                                    />
                                </motion.div>
                            ))}
                        </div>

                        {/* Rarity Specific Effects */}
                        {achievement.rarity === 'legendary' && (
                            <>
                                {/* Rainbow Border Animation */}
                                <motion.div
                                    className="absolute inset-0 rounded-2xl border-2 border-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400"
                                    animate={{
                                        background: [
                                            'linear-gradient(45deg, #f87171, #fbbf24, #34d399, #60a5fa, #a78bfa)',
                                            'linear-gradient(45deg, #a78bfa, #f87171, #fbbf24, #34d399, #60a5fa)',
                                            'linear-gradient(45deg, #60a5fa, #a78bfa, #f87171, #fbbf24, #34d399)',
                                        ],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: 'linear',
                                    }}
                                />

                                {/* Floating Particles */}
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={`particle-${i}`}
                                        className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                                        style={{
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 100}%`,
                                        }}
                                        animate={{
                                            y: [0, -100, 0],
                                            opacity: [0, 1, 0],
                                            scale: [0, 1, 0],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            delay: i * 0.1,
                                            ease: 'easeInOut',
                                        }}
                                    />
                                ))}
                            </>
                        )}

                        {achievement.rarity === 'rare' && (
                            /* Blue Glow Effect */
                            <motion.div
                                className="absolute inset-0 rounded-2xl bg-blue-400 opacity-20"
                                animate={{
                                    opacity: [0.1, 0.3, 0.1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            />
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AchievementCelebration;
