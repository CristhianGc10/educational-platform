// 🧪 apps/main-platform/src/app/test-components/page.tsx
"use client";

import {
  Button,
  Input,
  LoadingSpinner,
  useToggle
} from '@educational-platform/shared-ui';
import React, { useState } from 'react';

export default function TestComponentsPage() {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [isLoading, toggle] = useToggle(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value.length < 3) {
      setInputError('Debe tener al menos 3 caracteres');
    } else {
      setInputError('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🎨 Test de Componentes del Sistema de Diseño
        </h1>

        {/* Botones */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Botones</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">🎯</Button>
          </div>

          <div className="flex gap-4 mt-4">
            <Button disabled>Disabled</Button>
            <Button 
              onClick={toggle}
              className="flex items-center gap-2"
            >
              {isLoading && <LoadingSpinner size="sm" color="white" />}
              {isLoading ? 'Loading...' : 'Toggle Loading'}
            </Button>
          </div>
        </section>

        {/* Inputs */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Inputs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <Input
              label="Nombre"
              placeholder="Ingresa tu nombre"
              helperText="Esto es texto de ayuda"
            />
            
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              value={inputValue}
              onChange={handleInputChange}
              error={inputError}
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="Tu contraseña"
            />
            
            <Input
              label="Número"
              type="number"
              placeholder="123"
              min="0"
              max="100"
            />
          </div>
        </section>

        {/* LoadingSpinners */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Loading Spinners</h2>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <LoadingSpinner size="sm" color="primary" />
              <p className="mt-2 text-sm">Small</p>
            </div>
            <div className="text-center">
              <LoadingSpinner size="md" color="secondary" />
              <p className="mt-2 text-sm">Medium</p>
            </div>
            <div className="text-center">
              <LoadingSpinner size="lg" color="primary" />
              <p className="mt-2 text-sm">Large</p>
            </div>
            <div className="text-center bg-gray-800 p-4 rounded">
              <LoadingSpinner size="md" color="white" />
              <p className="mt-2 text-sm text-white">White</p>
            </div>
          </div>
        </section>

        {/* Estados de Loading */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Estados Interactivos</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="mb-4">Loading state: {isLoading ? 'ON' : 'OFF'}</p>
            <p className="mb-4">Input value: "{inputValue}"</p>
            <p className="mb-4">Input error: {inputError || 'None'}</p>
            
            <div className="flex gap-4">
              <Button onClick={toggle}>
                Toggle Loading State
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setInputValue('')}
              >
                Clear Input
              </Button>
            </div>
          </div>
        </section>

        {/* Información del Sistema */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Información del Sistema</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600">
              <strong>Componentes disponibles:</strong> Button, Input, LoadingSpinner
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Hooks disponibles:</strong> useToggle
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Utilidades:</strong> cn (className merger)
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}