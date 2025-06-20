// components/3d/FamilyScene3D.tsx
'use client';

import * as THREE from 'three';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    Environment,
    Html,
    OrbitControls,
    PerspectiveCamera,
    Text,
} from '@react-three/drei';
import { Family, FamilyMember, Scene3DProps } from '../../types/relationships';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import { motion } from 'framer-motion-3d';

// Individual member component
const FamilyMember3D: React.FC<{
    member: FamilyMember;
    position: [number, number, number];
    isSelected: boolean;
    onSelect: (memberId: string) => void;
    showInfo: boolean;
}> = ({ member, position, isSelected, onSelect, showInfo }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            // Gentle floating animation
            meshRef.current.position.y =
                position[1] +
                Math.sin(state.clock.elapsedTime + member.age) * 0.1;

            // Rotation for selected members
            if (isSelected) {
                meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
            }
        }
    });

    const memberColor = useMemo(() => {
        if (isSelected) return '#3B82F6'; // Blue for selected
        return member.gender === 'male' ? '#10B981' : '#EC4899'; // Green for male, pink for female
    }, [isSelected, member.gender]);

    const scale = isSelected ? 1.3 : hovered ? 1.1 : 1.0;

    return (
        <group position={position}>
            {/* Main sphere */}
            <mesh
                ref={meshRef}
                onClick={() => onSelect(member.id)}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                scale={scale}
            >
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial
                    color={memberColor}
                    emissive={isSelected ? '#1E40AF' : '#000000'}
                    emissiveIntensity={isSelected ? 0.2 : 0}
                    roughness={0.3}
                    metalness={0.1}
                />
            </mesh>

            {/* Selection ring */}
            {isSelected && (
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.7, 0.8, 32]} />
                    <meshBasicMaterial
                        color="#3B82F6"
                        transparent
                        opacity={0.6}
                    />
                </mesh>
            )}

            {/* Age indicator */}
            <Text
                position={[0, 0, 0.6]}
                fontSize={0.3}
                color="white"
                anchorX="center"
                anchorY="middle"
                font="/fonts/Inter-Bold.woff"
            >
                {member.age}
            </Text>

            {/* Name label */}
            <Text
                position={[0, -1, 0]}
                fontSize={0.2}
                color="#374151"
                anchorX="center"
                anchorY="middle"
                font="/fonts/Inter-Medium.woff"
            >
                {member.name}
            </Text>

            {/* Info panel */}
            {(hovered || showInfo) && (
                <Html position={[1, 1, 0]} center>
                    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-sm max-w-xs">
                        <div className="font-semibold text-gray-900">
                            {member.name}
                        </div>
                        <div className="text-gray-600">
                            Edad: {member.age} años
                        </div>
                        <div className="text-gray-600">
                            Género: {member.gender}
                        </div>
                        <div className="text-gray-600">
                            Generación: {member.generation}
                        </div>
                        <div className="text-gray-600">
                            Relaciones: {member.relationships.length}
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
};

// Relationship connection component
const RelationshipLine3D: React.FC<{
    from: [number, number, number];
    to: [number, number, number];
    type: string;
    strength: number;
}> = ({ from, to, type, strength }) => {
    const lineRef = useRef<THREE.BufferGeometry>(null);

    const points = useMemo(() => {
        return [new THREE.Vector3(...from), new THREE.Vector3(...to)];
    }, [from, to]);

    const color = useMemo(() => {
        const colors = {
            spouse: '#EF4444', // Red
            parent: '#F59E0B', // Amber
            child: '#F59E0B', // Amber
            sibling: '#8B5CF6', // Purple
            grandparent: '#06B6D4', // Cyan
            grandchild: '#06B6D4', // Cyan
        };
        return colors[type as keyof typeof colors] || '#6B7280';
    }, [type]);

    useFrame((state) => {
        if (lineRef.current) {
            // Animate line opacity
            const material = lineRef.current.userData.material;
            if (material) {
                material.opacity =
                    0.3 + 0.2 * Math.sin(state.clock.elapsedTime * 2);
            }
        }
    });

    return (
        <line>
            <bufferGeometry ref={lineRef}>
                <bufferAttribute
                    attach="attributes-position"
                    count={points.length}
                    array={
                        new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))
                    }
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial
                color={color}
                linewidth={strength * 3}
                transparent
                opacity={0.6}
            />
        </line>
    );
};

// Generation platform component
const GenerationPlatform: React.FC<{
    generation: number;
    memberCount: number;
    yPosition: number;
}> = ({ generation, memberCount, yPosition }) => {
    const platformRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (platformRef.current) {
            platformRef.current.rotation.y =
                Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
        }
    });

    const platformSize = Math.max(3, memberCount * 1.5);

    return (
        <group position={[0, yPosition - 0.5, 0]}>
            <mesh ref={platformRef} receiveShadow>
                <cylinderGeometry
                    args={[platformSize, platformSize, 0.1, 32]}
                />
                <meshStandardMaterial
                    color="#F3F4F6"
                    transparent
                    opacity={0.3}
                    roughness={0.8}
                />
            </mesh>

            {/* Generation label */}
            <Text
                position={[0, 0.1, platformSize - 0.5]}
                fontSize={0.3}
                color="#6B7280"
                anchorX="center"
                anchorY="middle"
            >
                Generación {generation}
            </Text>
        </group>
    );
};

// Camera controller
const CameraController: React.FC<{
    selectedMembers: string[];
    members: FamilyMember[];
    positions: Map<string, [number, number, number]>;
}> = ({ selectedMembers, members, positions }) => {
    const { camera } = useThree();

    React.useEffect(() => {
        if (selectedMembers.length > 0) {
            // Focus on selected members
            const selectedPositions = selectedMembers
                .map((id) => positions.get(id))
                .filter(Boolean) as [number, number, number][];

            if (selectedPositions.length > 0) {
                const center = selectedPositions
                    .reduce(
                        (acc, pos) => [
                            acc[0] + pos[0],
                            acc[1] + pos[1],
                            acc[2] + pos[2],
                        ],
                        [0, 0, 0]
                    )
                    .map((coord) => coord / selectedPositions.length) as [
                    number,
                    number,
                    number,
                ];

                camera.lookAt(new THREE.Vector3(...center));
            }
        }
    }, [selectedMembers, positions, camera]);

    return null;
};

// Main scene component
const Scene3D: React.FC<{
    family: Family;
    selectedMembers: string[];
    onMemberSelect: (memberId: string) => void;
    showRelationships: boolean;
}> = ({ family, selectedMembers, onMemberSelect, showRelationships }) => {
    const [showInfo, setShowInfo] = useState(false);

    // Calculate 3D positions for family members
    const { memberPositions, generationData } = useMemo(() => {
        const positions = new Map<string, [number, number, number]>();
        const genData = new Map<number, FamilyMember[]>();

        // Group by generation
        family.members.forEach((member) => {
            if (!genData.has(member.generation)) {
                genData.set(member.generation, []);
            }
            genData.get(member.generation)!.push(member);
        });

        const generations = Array.from(genData.keys()).sort();
        const generationSpacing = 4;

        generations.forEach((generation, genIndex) => {
            const members = genData.get(generation)!;
            const yPos =
                (generations.length - 1 - genIndex) * generationSpacing;

            // Arrange members in a circle for each generation
            const radius = Math.max(2, members.length * 0.8);
            const angleStep = (2 * Math.PI) / members.length;

            members.forEach((member, memberIndex) => {
                const angle = memberIndex * angleStep;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;

                positions.set(member.id, [x, yPos, z]);
            });
        });

        return {
            memberPositions: positions,
            generationData: genData,
        };
    }, [family]);

    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight
                position={[10, 10, 5]}
                intensity={0.8}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
            <pointLight position={[-10, -10, -5]} intensity={0.3} />

            {/* Environment */}
            <Environment preset="city" background={false} />

            {/* Generation platforms */}
            {Array.from(generationData.entries()).map(
                ([generation, members]) => {
                    const position = memberPositions.get(members[0].id);
                    if (!position) return null;

                    return (
                        <GenerationPlatform
                            key={generation}
                            generation={generation}
                            memberCount={members.length}
                            yPosition={position[1]}
                        />
                    );
                }
            )}

            {/* Family members */}
            {family.members.map((member) => {
                const position = memberPositions.get(member.id);
                if (!position) return null;

                return (
                    <FamilyMember3D
                        key={member.id}
                        member={member}
                        position={position}
                        isSelected={selectedMembers.includes(member.id)}
                        onSelect={onMemberSelect}
                        showInfo={showInfo}
                    />
                );
            })}

            {/* Relationship lines */}
            {showRelationships &&
                family.relationships.map((relationship) => {
                    const fromPos = memberPositions.get(relationship.from);
                    const toPos = memberPositions.get(relationship.to);

                    if (!fromPos || !toPos) return null;

                    return (
                        <RelationshipLine3D
                            key={relationship.id}
                            from={fromPos}
                            to={toPos}
                            type={relationship.type}
                            strength={relationship.strength}
                        />
                    );
                })}

            {/* Camera controller */}
            <CameraController
                selectedMembers={selectedMembers}
                members={family.members}
                positions={memberPositions}
            />

            {/* Controls */}
            <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={25}
                autoRotate={selectedMembers.length === 0}
                autoRotateSpeed={0.5}
            />

            {/* UI Controls */}
            <Html position={[-8, 6, 0]} center>
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                        Controles 3D
                    </h4>
                    <div className="space-y-2 text-xs text-gray-600">
                        <div>• Arrastra para rotar</div>
                        <div>• Rueda para zoom</div>
                        <div>• Click derecho para panear</div>
                        <div>• Click en miembros para seleccionar</div>
                    </div>
                    <button
                        onClick={() => setShowInfo(!showInfo)}
                        className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                    >
                        {showInfo ? 'Ocultar Info' : 'Mostrar Info'}
                    </button>
                </div>
            </Html>

            {/* Family info */}
            <Html position={[8, 6, 0]} center>
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">
                        {family.name}
                    </h4>
                    <div className="space-y-1 text-gray-600">
                        <div>Miembros: {family.members.length}</div>
                        <div>Generaciones: {generationData.size}</div>
                        <div>Relaciones: {family.relationships.length}</div>
                        {selectedMembers.length > 0 && (
                            <div className="pt-1 border-t text-blue-600">
                                Seleccionados: {selectedMembers.length}
                            </div>
                        )}
                    </div>
                </div>
            </Html>
        </>
    );
};

// Main component
const FamilyScene3D: React.FC<Scene3DProps> = ({
    family,
    selectedMembers,
    onMemberSelect,
    cameraPosition = [0, 5, 10],
    showRelationships,
    animateTransitions,
}) => {
    const handleMemberSelect = useCallback(
        (memberId: string) => {
            onMemberSelect(memberId);
        },
        [onMemberSelect]
    );

    if (!family) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p>Cargando escena 3D...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-gradient-to-b from-blue-50 to-indigo-100">
            <Canvas
                shadows
                dpr={[1, 2]}
                gl={{ antialias: true }}
                camera={{
                    position: cameraPosition,
                    fov: 60,
                    near: 0.1,
                    far: 1000,
                }}
            >
                <Scene3D
                    family={family}
                    selectedMembers={selectedMembers}
                    onMemberSelect={handleMemberSelect}
                    showRelationships={showRelationships}
                />
            </Canvas>
        </div>
    );
};

export default FamilyScene3D;
