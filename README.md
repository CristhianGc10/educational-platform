 # 📚 Plataforma Educativa Inmersiva

Una plataforma educativa revolucionaria donde los estudiantes **construyen activamente** su conocimiento matemático a través de experiencias interactivas, simulaciones 3D y aplicaciones del mundo real.

## 🎯 Visión del Proyecto

Crear la plataforma líder en educación matemática inmersiva, donde cada concepto se aprende **haciendo**, **experimentando** y **aplicando** de forma práctica, aumentando la retención conceptual del 30% al 85%.

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **3D Graphics**: React-Three-Fiber + Drei
- **Math Engine**: PyScript (SymPy + NumPy) + MathJS
- **State Management**: Zustand + React Query
- **Animations**: Framer Motion
- **Workspace**: Nx Monorepo

### Estructura del Monorepo

```
educational-platform/
├── apps/
│   ├── main-platform/          # Dashboard principal
│   ├── course-arithmetic/       # Curso de Aritmética (MVP)
│   ├── course-algebra/          # Curso de Álgebra (futuro)
│   └── course-geometry/         # Curso de Geometría (futuro)
├── packages/
│   ├── shared-ui/              # Sistema de componentes
│   ├── shared-types/           # Tipos TypeScript
│   ├── shared-utils/           # Utilidades
│   ├── math-engine/            # Motor matemático
│   ├── analytics-engine/       # Analytics
│   └── auth-system/            # Autenticación
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/your-username/educational-platform.git
cd educational-platform

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus configuraciones

# Ejecutar en modo desarrollo
npm run dev
```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Ejecutar todas las apps
npm run dev:main         # Solo main-platform (puerto 3000)
npm run dev:arithmetic   # Solo course-arithmetic (puerto 3001)

# Build y producción
npm run build           # Build todas las apps
npm run start           # Iniciar en producción

# Testing
npm run test            # Ejecutar todos los tests
npm run test:watch      # Tests en modo watch
npm run test:coverage   # Coverage report

# Calidad de código
npm run lint            # Linter
npm run lint:fix        # Arreglar lint automáticamente
npm run type-check      # Verificar tipos TypeScript
npm run format          # Formatear código con Prettier
```

## 📦 Aplicaciones

### Main Platform (Puerto 3000)
Dashboard principal con:
- Sistema de autenticación
- Navegación entre cursos
- Panel de usuario
- Analytics de progreso

### Course Arithmetic (Puerto 3001)
Curso interactivo de Aritmética con:
- 8 módulos especializados
- Simulaciones 3D interactivas
- Sistema de ejercicios adaptativos
- Validación matemática en tiempo real

## 🧩 Packages Compartidos

### @educational-platform/shared-ui
Sistema de componentes reutilizables con:
- Componentes base (Button, Input, Modal, etc.)
- Layouts responsivos
- Sistema de temas
- Storybook para documentación

### @educational-platform/math-engine
Motor matemático avanzado:
- Validación de expresiones matemáticas
- Resolución paso a paso
- Parsing de fórmulas
- Análisis de errores comunes

### @educational-platform/shared-types
Tipos TypeScript compartidos:
- Definiciones de API
- Tipos de cursos y ejercicios
- Modelos de usuario
- Esquemas de validación

## 🎮 Primer Módulo: Semana 6 - Porcentajes Avanzados

El desarrollo comienza con el módulo más atractivo para Gen Z:

### Componentes Principales
- `PercentageCalculator3D`: Calculadora 3D interactiva
- `ContextualProblemSolver`: Resolvedor de problemas contextualizados
- `StepByStepViewer`: Visualizador de pasos de solución
- `ProgressTracker`: Seguimiento de progreso

### Características
- **Interactividad 3D**: Manipulación visual de porcentajes
- **Problemas Contextualizados**: Situaciones financieras reales
- **Validación Inteligente**: IA para hints adaptativos
- **Gamificación Equilibrada**: Enfoque en comprensión vs velocidad

## 🧠 Metodología Pedagógica

### Constructivismo Interactivo
1. **Exploración** (3-5 min): Manipulación libre de elementos
2. **Hipótesis** (2-3 min): Formación de predicciones
3. **Experimentación** (8-12 min): Prueba controlada
4. **Descubrimiento** (3-5 min): Reconocimiento de patrones
5. **Aplicación** (5-8 min): Problemas del mundo real
6. **Reflexión** (2-3 min): Metacognición y conexiones

### Anti-Patrones Evitados
- ❌ Recompensas basadas en velocidad
- ❌ Rankings competitivos directos
- ❌ Mecánicas adictivas
- ❌ Gamificación superficial

## 📊 Métricas de Éxito

### Pedagógicas (Prioridad Máxima)
- **Retención Conceptual**: >= 85% en evaluaciones post-lección
- **Transferencia**: >= 75% aplican a contextos nuevos
- **Engagement Profundo**: >= 60% del tiempo en elementos interactivos

### Técnicas
- **Performance**: Time to Interactive <= 3 segundos
- **3D Rendering**: >= 30 FPS en dispositivos mid-range
- **Uptime**: >= 99.9% disponibilidad

## 🔧 Desarrollo

### Configuración del Entorno

1. **Visual Studio Code** con extensiones recomendadas:
   - TypeScript and JavaScript Language Features
   - Tailwind CSS IntelliSense
   - ESLint
   - Prettier
   - Auto Rename Tag

2. **Variables de Entorno**:
   ```env
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   DATABASE_URL=postgresql://...
   OPENAI_API_KEY=sk-...
   ```

### Workflow de Desarrollo

1. **Crear feature branch**:
   ```bash
   git checkout -b feature/nombre-feature
   ```

2. **Desarrollo con hot reload**:
   ```bash
   npm run dev:arithmetic
   ```

3. **Testing continuo**:
   ```bash
   npm run test:watch
   ```

4. **Commit y push**:
   ```bash
   git add .
   git commit -m "feat: descripción del feature"
   git push origin feature/nombre-feature
   ```

## 📈 Roadmap

### Fase 1: MVP Foundation (8-10 semanas)
- ✅ Configuración inicial del monorepo
- 🔄 Implementación de Semana 6 (Porcentajes Avanzados)
- ⏳ Sistema de autenticación
- ⏳ Dashboard principal
- ⏳ Deploy y testing

### Fase 2: Escalado Modular (12-16 semanas)
- ⏳ Completar curso de Aritmética (8 módulos)
- ⏳ Sistema de hints con IA
- ⏳ Analytics avanzados
- ⏳ Optimización de performance

### Fase 3: Expansión (8-12 semanas)
- ⏳ Curso de Álgebra
- ⏳ Mobile app nativa
- ⏳ Integración con LMS
- ⏳ Multi-idioma

## 🤝 Contribución

### Estándares de Código
- **TypeScript**: Strict mode habilitado
- **ESLint**: Configuración estricta
- **Prettier**: Formateo automático
- **Commits**: Conventional Commits

### Pull Request Process
1. Fork del repositorio
2. Crear feature branch
3. Implementar tests
4. Actualizar documentación
5. Crear Pull Request con descripción detallada

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

- **Documentación**: `/docs`
- **Issues**: GitHub Issues
- **Discusiones**: GitHub Discussions
- **Email**: soporte@educational-platform.com

---

**🎓 Construyendo el futuro de la educación, una interacción a la vez.**