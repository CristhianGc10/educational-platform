// apps/course-arithmetic/src/modules/finanzas-comercio/semana-06-porcentajes-avanzados/components/PercentageCalculator3D.tsx
'use client'

import React, { useState } from 'react'

import { motion } from 'framer-motion'

interface PercentageCalculator3DProps {
  problem: {
    id: string
    type: 'discount' | 'increase' | 'tax' | 'commission'
    context: string
    originalValue: number
    percentage: number
    question: string
    correctAnswer: number
    hints: string[]
  }
  onAnswer: (answer: number, isCorrect: boolean) => void
  onShowHint: () => void
}

export default function PercentageCalculator3D({ 
  problem, 
  onAnswer, 
  onShowHint 
}: PercentageCalculator3DProps) {
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState<string | undefined>(undefined)
  const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined)

  const handleSubmit = () => {
    const answer = parseFloat(userAnswer)
    const tolerance = 0.01
    const correct = Math.abs(answer - problem.correctAnswer) <= tolerance

    setIsCorrect(correct)
    setFeedback(correct 
      ? '¡Excelente! Respuesta correcta.' 
      : `Incorrecto. La respuesta correcta es $${problem.correctAnswer.toFixed(2)}`
    )

    onAnswer(answer, correct)
  }

  const getOperationColor = (type: string) => {
    switch (type) {
      case 'discount': return 'from-red-400 to-red-600'
      case 'increase': return 'from-green-400 to-green-600'
      case 'tax': return 'from-yellow-400 to-yellow-600'
      case 'commission': return 'from-blue-400 to-blue-600'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'discount': return '💸'
      case 'increase': return '📈'
      case 'tax': return '🏛️'
      case 'commission': return '💰'
      default: return '🔢'
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{getOperationIcon(problem.type)}</div>
          <h3 className="text-xl font-bold text-gray-900">
            Calculadora de {
              problem.type === 'discount' ? 'Descuentos' :
              problem.type === 'increase' ? 'Aumentos' :
              problem.type === 'tax' ? 'Impuestos' : 'Comisiones'
            }
          </h3>
        </div>

        {/* Visualización pseudo-3D */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 items-end justify-center h-48">
            {/* Valor Original */}
            <div className="text-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.min(problem.originalValue / 10, 120)}px` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`w-16 mx-auto bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-lg shadow-lg relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white opacity-20 transform -skew-y-12"></div>
              </motion.div>
              <div className="mt-2 text-sm font-medium text-gray-700">Original</div>
              <div className="text-lg font-bold text-blue-600">${problem.originalValue}</div>
            </div>

            {/* Porcentaje */}
            <div className="text-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.min(problem.percentage * 2, 100)}px` }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className={`w-16 mx-auto bg-gradient-to-t ${getOperationColor(problem.type)} rounded-t-lg shadow-lg relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white opacity-20 transform -skew-y-12"></div>
              </motion.div>
              <div className="mt-2 text-sm font-medium text-gray-700">Porcentaje</div>
              <div className="text-lg font-bold text-gray-800">{problem.percentage}%</div>
            </div>

            {/* Resultado */}
            <div className="text-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ 
                  height: userAnswer ? `${Math.min(parseFloat(userAnswer) / 10, 120)}px` : '40px'
                }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className={`w-16 mx-auto bg-gradient-to-t from-green-400 to-green-600 rounded-t-lg shadow-lg relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white opacity-20 transform -skew-y-12"></div>
              </motion.div>
              <div className="mt-2 text-sm font-medium text-gray-700">Resultado</div>
              <div className="text-lg font-bold text-green-600">
                {userAnswer ? `$${parseFloat(userAnswer).toFixed(2)}` : '$?'}
              </div>
            </div>
          </div>
        </div>

        {/* Contexto del problema */}
        <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Situación:</h4>
          <p className="text-blue-800">{problem.context}</p>
        </div>

        {/* Pregunta */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">{problem.question}</h4>
          
          <div className="flex items-center space-x-3">
            <span className="text-gray-700 font-medium">$</span>
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Tu respuesta"
              step="0.01"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isCorrect}
            />
            <button
              onClick={handleSubmit}
              disabled={!userAnswer || isCorrect}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCorrect ? '¡Correcto!' : 'Verificar'}
            </button>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-3 mb-4">
          <button
            onClick={onShowHint}
            className="flex-1 bg-yellow-100 text-yellow-800 py-2 px-4 rounded-md hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
          >
            💡 Pista
          </button>
          
          <button
            onClick={() => {
              setUserAnswer('')
              setFeedback(undefined)
              setIsCorrect(undefined)
            }}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            🔄 Reiniciar
          </button>
        </div>

        {/* Feedback */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg p-4 ${
              isCorrect 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-2xl">
                {isCorrect ? '🎉' : '🤔'}
              </span>
              <div>
                <h4 className={`font-semibold ${
                  isCorrect ? 'text-green-900' : 'text-red-900'
                }`}>
                  {isCorrect ? '¡Excelente!' : 'Intenta de nuevo'}
                </h4>
                <p className={`${
                  isCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                  {feedback}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Información del problema */}
        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Datos del problema:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Valor original:</span>
              <span className="ml-2 font-medium">${problem.originalValue}</span>
            </div>
            <div>
              <span className="text-gray-600">Porcentaje:</span>
              <span className="ml-2 font-medium">{problem.percentage}%</span>
            </div>
            <div>
              <span className="text-gray-600">Tipo:</span>
              <span className="ml-2 font-medium capitalize">
                {problem.type === 'discount' ? 'Descuento' : 
                 problem.type === 'increase' ? 'Aumento' :
                 problem.type === 'tax' ? 'Impuesto' : 'Comisión'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Respuesta correcta:</span>
              <span className="ml-2 font-medium">${problem.correctAnswer}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}