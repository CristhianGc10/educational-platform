// 3d/OfficeScene3D.tsx

import * as THREE from 'three';

import { Box, OrbitControls, Plane, Text } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';

interface Employee {
    id: string;
    name: string;
    position: { x: number; y: number; z: number };
    department: string;
    experience: number;
    color: string;
}

interface OfficeScene3DProps {
    employees: Employee[];
    selectedEmployeeIds: string[];
    onEmployeeSelect: (employeeId: string) => void;
    scenario?: string;
}

function OfficeDesk({
    employee,
    isSelected,
    onClick,
}: {
    employee: Employee;
    isSelected: boolean;
    onClick: () => void;
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (meshRef.current && isSelected) {
            meshRef.current.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
        }
    });

    return (
        <group
            position={[
                employee.position.x,
                employee.position.y,
                employee.position.z,
            ]}
        >
            {/* Escritorio */}
            <Box
                ref={meshRef}
                args={[2, 0.1, 1]}
                position={[0, 0.5, 0]}
                onClick={onClick}
            >
                <meshStandardMaterial
                    color={isSelected ? '#3B82F6' : '#8B4513'}
                />
            </Box>

            {/* Silla */}
            <Box args={[0.6, 0.8, 0.6]} position={[0, 0.4, -0.8]}>
                <meshStandardMaterial color="#2D2D2D" />
            </Box>

            {/* Avatar del empleado */}
            <Box args={[0.4, 1.2, 0.4]} position={[0, 1.1, -0.8]}>
                <meshStandardMaterial color={employee.color} />
            </Box>

            {/* Nombre del empleado */}
            <Text
                position={[0, 2, 0]}
                fontSize={0.2}
                color="#1F2937"
                anchorX="center"
                anchorY="middle"
            >
                {employee.name}
            </Text>

            {/* Departamento */}
            <Text
                position={[0, 1.7, 0]}
                fontSize={0.15}
                color="#6B7280"
                anchorX="center"
                anchorY="middle"
            >
                {employee.department}
            </Text>

            {/* Experiencia */}
            <Text
                position={[0, 1.4, 0]}
                fontSize={0.12}
                color="#9CA3AF"
                anchorX="center"
                anchorY="middle"
            >
                {employee.experience} años
            </Text>

            {/* Indicador de selección */}
            {isSelected && (
                <Box args={[2.5, 0.05, 1.5]} position={[0, 0.02, 0]}>
                    <meshBasicMaterial
                        color="#3B82F6"
                        transparent
                        opacity={0.3}
                    />
                </Box>
            )}
        </group>
    );
}

export function OfficeScene3D({
    employees,
    selectedEmployeeIds,
    onEmployeeSelect,
    scenario = 'Optimización de Equipos',
}: OfficeScene3DProps) {
    return (
        <div className="w-full h-[600px] bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg overflow-hidden">
            <Canvas
                camera={{
                    position: [10, 8, 10],
                    fov: 60,
                }}
            >
                {/* Iluminación */}
                <ambientLight intensity={0.6} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={0.8}
                    castShadow
                />
                <pointLight position={[-10, 5, -5]} intensity={0.3} />

                {/* Controles */}
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={5}
                    maxDistance={25}
                    maxPolarAngle={Math.PI / 2.2}
                />

                {/* Suelo de la oficina */}
                <Plane
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, 0, 0]}
                    args={[30, 30]}
                    receiveShadow
                >
                    <meshStandardMaterial
                        color="#F3F4F6"
                        transparent
                        opacity={0.8}
                    />
                </Plane>

                {/* Grid del suelo */}
                <gridHelper
                    args={[30, 30, '#E5E7EB', '#F9FAFB']}
                    position={[0, 0.01, 0]}
                />

                {/* Paredes */}
                <Plane position={[0, 3, -15]} args={[30, 6]}>
                    <meshStandardMaterial color="#E5E7EB" />
                </Plane>

                <Plane
                    position={[-15, 3, 0]}
                    rotation={[0, Math.PI / 2, 0]}
                    args={[30, 6]}
                >
                    <meshStandardMaterial color="#E5E7EB" />
                </Plane>

                {/* Escritorios de empleados */}
                {employees.map((employee) => (
                    <OfficeDesk
                        key={employee.id}
                        employee={employee}
                        isSelected={selectedEmployeeIds.includes(employee.id)}
                        onClick={() => onEmployeeSelect(employee.id)}
                    />
                ))}

                {/* Título del escenario */}
                <Text
                    position={[0, 6, -10]}
                    fontSize={0.8}
                    color="#1F2937"
                    anchorX="center"
                    anchorY="middle"
                >
                    {scenario}
                </Text>

                {/* Leyenda de departamentos */}
                <group position={[12, 4, -8]}>
                    <Text
                        position={[0, 2, 0]}
                        fontSize={0.3}
                        color="#374151"
                        anchorX="center"
                    >
                        Departamentos:
                    </Text>

                    <Text
                        position={[0, 1.5, 0]}
                        fontSize={0.2}
                        color="#3B82F6"
                        anchorX="center"
                    >
                        • Desarrollo
                    </Text>

                    <Text
                        position={[0, 1.2, 0]}
                        fontSize={0.2}
                        color="#10B981"
                        anchorX="center"
                    >
                        • Marketing
                    </Text>

                    <Text
                        position={[0, 0.9, 0]}
                        fontSize={0.2}
                        color="#F59E0B"
                        anchorX="center"
                    >
                        • Ventas
                    </Text>
                </group>
            </Canvas>
        </div>
    );
}

export default OfficeScene3D;
