// components/ui/PhaseTransition.tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight,
    Building,
    CheckCircle,
    Cog,
    Lightbulb,
    Sparkles,
    Trophy,
    Users,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface PhaseTransitionProps {
    fromPhase: number;
    toPhase: number;
    onComplete: () => void;
    achievements?: string[];
    score?: number;
    className?: string;
}

const phaseConfig = {
    1: {
        title: 'Descubrimiento de Patrones',
        description:
            'Has explorado las familias y descubierto patrones matemáticos únicos',
        icon: Users,
        color: 'from-blue-500 to-cyan-500',
        celebration: '¡Excelente exploración!',
    },
    2: {
        title: 'Construcción de Algoritmos',
        description:
            'Ahora construirás algoritmos para automatizar el descubrimiento',
        icon: Cog,
        color: 'from-green-500 to-emerald-500',
        celebration: '¡Momento de programar!',
    },
    3: {
        title: 'Aplicación Empresarial',
        description:
            'Aplicarás tus conceptos a escenarios empresariales reales',
        icon: Building,
        color: 'from-purple-500 to-violet-500',
        celebration: '¡Al mundo real!',
    },
    4: {
        title: 'Innovación y Creatividad',
        description:
            'Desarrollarás soluciones innovadoras y presentarás ideas originales',
        icon: Lightbulb,
        color: 'from-orange-500 to-red-500',
        celebration: '¡Hora de innovar!',
    },
};

const PhaseTransition: React.FC<PhaseTransitionProps> = ({
    fromPhase,
    toPhase,
    onComplete,
    achievements = [],
    score,
    className = '',
}) => {
    const [stage, setStage] = useState<'completion' | 'transition' | 'preview'>(
        'completion'
    );

    const fromConfig = phaseConfig[fromPhase as keyof typeof phaseConfig];
    const toConfig = phaseConfig[toPhase as keyof typeof phaseConfig];

    const FromIcon = fromConfig?.icon || CheckCircle;
    const ToIcon = toConfig?.icon || Lightbulb;

    useEffect(() => {
        const timer1 = setTimeout(() => setStage('transition'), 2000);
        const timer2 = setTimeout(() => setStage('preview'), 4000);
        const timer3 = setTimeout(() => onComplete(), 6000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [onComplete]);

    const containerVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    };

    const sparkleVariants = {
        initial: { scale: 0, rotate: 0 },
        animate: {
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
            transition: {
                duration: 2,
                repeat: Infinity,
                repeatDelay: 0.5,
            },
        },
    };

    return (
        <motion.div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${className}`}
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <div className="max-w-2xl mx-4">
                <AnimatePresence mode="wait">
                    {/* Phase Completion Stage */}
                    {stage === 'completion' && fromConfig && (
                        <motion.div
                            key="completion"
                            className="bg-white rounded-2xl p-8 text-center shadow-2xl"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Success Icon */}
                            <motion.div
                                className={`inline-flex p-6 rounded-full bg-gradient-to-r ${fromConfig.color} mb-6`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    delay: 0.2,
                                    type: 'spring',
                                    stiffness: 200,
                                }}
                            >
                                <CheckCircle className="h-12 w-12 text-white" />
                            </motion.div>

                            {/* Celebration Message */}
                            <motion.h2
                                className="text-3xl font-bold text-gray-900 mb-2"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                {fromConfig.celebration}
                            </motion.h2>

                            <motion.p
                                className="text-lg text-gray-600 mb-6"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                Has completado exitosamente la fase de{' '}
                                {fromConfig.title}
                            </motion.p>

                            {/* Score Display */}
                            {score !== undefined && (
                                <motion.div
                                    className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    <Trophy className="h-5 w-5" />
                                    <span className="font-semibold">
                                        Puntuación: {score}%
                                    </span>
                                </motion.div>
                            )}

                            {/* Achievements */}
                            {achievements.length > 0 && (
                                <motion.div
                                    className="flex justify-center space-x-2 mb-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.0 }}
                                >
                                    {achievements
                                        .slice(0, 3)
                                        .map((achievement, index) => (
                                            <motion.div
                                                key={achievement}
                                                className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{
                                                    delay: 1.0 + index * 0.1,
                                                }}
                                            >
                                                🏆 {achievement}
                                            </motion.div>
                                        ))}
                                </motion.div>
                            )}

                            {/* Sparkles */}
                            <div className="absolute top-4 left-4">
                                <motion.div
                                    variants={sparkleVariants}
                                    initial="initial"
                                    animate="animate"
                                >
                                    <Sparkles className="h-6 w-6 text-yellow-400" />
                                </motion.div>
                            </div>
                            <div className="absolute top-4 right-4">
                                <motion.div
                                    variants={sparkleVariants}
                                    initial="initial"
                                    animate="animate"
                                    style={{ animationDelay: '0.5s' }}
                                >
                                    <Sparkles className="h-6 w-6 text-purple-400" />
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {/* Transition Stage */}
                    {stage === 'transition' && (
                        <motion.div
                            key="transition"
                            className="bg-white rounded-2xl p-8 text-center shadow-2xl"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center justify-center space-x-8 mb-6">
                                {/* From Phase */}
                                {fromConfig && (
                                    <motion.div
                                        className="text-center"
                                        initial={{ x: -50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <div
                                            className={`inline-flex p-4 rounded-full bg-gradient-to-r ${fromConfig.color} mb-2`}
                                        >
                                            <FromIcon className="h-8 w-8 text-white" />
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Fase {fromPhase}
                                        </p>
                                    </motion.div>
                                )}

                                {/* Arrow */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        delay: 0.3,
                                        type: 'spring',
                                        stiffness: 200,
                                    }}
                                >
                                    <ArrowRight className="h-8 w-8 text-gray-400" />
                                </motion.div>

                                {/* To Phase */}
                                {toConfig && (
                                    <motion.div
                                        className="text-center"
                                        initial={{ x: 50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.2,
                                        }}
                                    >
                                        <div
                                            className={`inline-flex p-4 rounded-full bg-gradient-to-r ${toConfig.color} mb-2`}
                                        >
                                            <ToIcon className="h-8 w-8 text-white" />
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Fase {toPhase}
                                        </p>
                                    </motion.div>
                                )}
                            </div>

                            <motion.h3
                                className="text-2xl font-bold text-gray-900 mb-4"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                Avanzando a la siguiente fase...
                            </motion.h3>

                            {/* Loading Animation */}
                            <motion.div
                                className="w-full bg-gray-200 rounded-full h-2 mb-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                <motion.div
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 1.5, delay: 0.8 }}
                                />
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Next Phase Preview */}
                    {stage === 'preview' && toConfig && (
                        <motion.div
                            key="preview"
                            className="bg-white rounded-2xl p-8 text-center shadow-2xl"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Next Phase Icon */}
                            <motion.div
                                className={`inline-flex p-6 rounded-full bg-gradient-to-r ${toConfig.color} mb-6`}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                            >
                                <ToIcon className="h-12 w-12 text-white" />
                            </motion.div>

                            {/* Phase Title */}
                            <motion.h2
                                className="text-3xl font-bold text-gray-900 mb-2"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                Fase {toPhase}: {toConfig.title}
                            </motion.h2>

                            {/* Phase Description */}
                            <motion.p
                                className="text-lg text-gray-600 mb-6"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                {toConfig.description}
                            </motion.p>

                            {/* Ready Button */}
                            <motion.div
                                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    delay: 0.6,
                                    type: 'spring',
                                    stiffness: 200,
                                }}
                            >
                                <span>¡Estás listo!</span>
                                <Sparkles className="h-5 w-5" />
                            </motion.div>

                            {/* Animated Background Elements */}
                            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                                {[...Array(8)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                                        style={{
                                            left: `${20 + i * 10}%`,
                                            top: `${20 + (i % 3) * 20}%`,
                                        }}
                                        animate={{
                                            y: [0, -20, 0],
                                            opacity: [0.3, 1, 0.3],
                                            scale: [0.8, 1.2, 0.8],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: i * 0.2,
                                        }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default PhaseTransition;
