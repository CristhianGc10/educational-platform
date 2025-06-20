// ============================================================================
// COMPONENTE DE PERSONAJE 3D - CORREGIDO
// ============================================================================

import * as THREE from 'three';

import React, { useMemo, useRef, useState } from 'react';

import { FamilyMember } from '../types/relationships';
import { Text } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';

interface InteractiveEvent extends ThreeEvent<MouseEvent> {
    stopPropagation: () => void;
}

/**
 * Props para el componente Character3D
 */
export interface Character3DProps {
    member: FamilyMember;
    isSelected: boolean;
    isHighlighted: boolean;
    scale?: number;
    onClick?: (member: FamilyMember) => void;
    onHover?: (member: FamilyMember | null) => void;
}

/**
 * Componente de personaje 3D
 */
const Character3D: React.FC<Character3DProps> = ({
    member,
    isSelected,
    isHighlighted,
    scale = 1.0,
    onClick,
    onHover,
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    // Colores dinámicos basados en estado
    const colors = useMemo(() => {
        let baseColor = member.color || '#4FC3F7';

        if (isSelected) {
            baseColor = '#FF6B6B';
        } else if (isHighlighted || hovered) {
            baseColor = '#4CAF50';
        }

        return {
            body: baseColor,
            outline: isSelected ? '#FF1744' : '#333333',
            text: '#FFFFFF',
        };
    }, [member.color, isSelected, isHighlighted, hovered]);

    // Tamaño basado en edad (representativo)
    const characterSize = useMemo(() => {
        const baseSize = 0.3;
        const ageScale = Math.max(0.5, Math.min(1.2, member.age / 50));
        return baseSize * ageScale * scale;
    }, [member.age, scale]);

    // Animación de latido para personajes seleccionados
    useFrame((state) => {
        if (meshRef.current && isSelected) {
            const time = state.clock.getElapsedTime();
            const pulseScale = 1 + Math.sin(time * 4) * 0.1;
            meshRef.current.scale.setScalar(pulseScale);
        } else if (meshRef.current) {
            meshRef.current.scale.setScalar(1);
        }

        // Rotación suave cuando está resaltado
        if (groupRef.current && (isHighlighted || hovered)) {
            const time = state.clock.getElapsedTime();
            groupRef.current.rotation.y = Math.sin(time * 2) * 0.1;
        } else if (groupRef.current) {
            groupRef.current.rotation.y = 0;
        }
    });

    // Manejar clics
    const handleClick = (event: InteractiveEvent) => {
        event.stopPropagation();
    };

    // Manejar hover
    const handlePointerOver = (event: InteractiveEvent) => {
        event.stopPropagation();
    };
    
    const handlePointerOut = (event: InteractiveEvent) => {
        event.stopPropagation();
    };

    return (
        <group ref={groupRef} position={member.position}>
            {/* Cuerpo principal del personaje */}
            <mesh
                ref={meshRef}
                onClick={handleClick}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                castShadow
                receiveShadow
            >
                {/* Geometría cilíndrica para representar una persona */}
                <cylinderGeometry
                    args={[
                        characterSize,
                        characterSize * 0.8,
                        characterSize * 2,
                        8,
                    ]}
                />
                <meshPhongMaterial
                    color={colors.body}
                    transparent
                    opacity={isSelected ? 0.9 : 0.8}
                />
            </mesh>

            {/* Cabeza */}
            <mesh
                position={[0, characterSize * 1.3, 0]}
                castShadow
                onClick={handleClick}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
            >
                <sphereGeometry args={[characterSize * 0.4, 8, 6]} />
                <meshPhongMaterial
                    color={colors.body}
                    transparent
                    opacity={isSelected ? 0.9 : 0.8}
                />
            </mesh>

            {/* Contorno para personajes seleccionados */}
            {isSelected && (
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry
                        args={[
                            characterSize * 1.1,
                            characterSize * 0.9,
                            characterSize * 2.1,
                            8,
                        ]}
                    />
                    <meshBasicMaterial
                        color={colors.outline}
                        transparent
                        opacity={0.3}
                        wireframe
                    />
                </mesh>
            )}

            {/* Etiqueta con nombre */}
            <Text
                position={[0, characterSize * 2.2, 0]}
                fontSize={characterSize * 0.8}
                color={colors.text}
                anchorX="center"
                anchorY="middle"
                onClick={handleClick}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
            >
                {member.name}
            </Text>

            {/* Etiqueta con edad */}
            <Text
                position={[0, characterSize * 1.8, 0]}
                fontSize={characterSize * 0.6}
                color={colors.text}
                anchorX="center"
                anchorY="middle"
                onClick={handleClick}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
            >
                {member.age} años
            </Text>

            {/* Indicador de género */}
            <mesh position={[characterSize * 0.6, characterSize * 1.5, 0]}>
                <sphereGeometry args={[characterSize * 0.15, 6, 4]} />
                <meshBasicMaterial
                    color={member.gender === 'M' ? '#2196F3' : '#E91E63'}
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Sombra proyectada */}
            <mesh
                position={[0, -characterSize * 1.1, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                receiveShadow
            >
                <circleGeometry args={[characterSize * 0.8, 16]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.2} />
            </mesh>

            {/* Efecto de partículas para personajes destacados */}
            {(isHighlighted || hovered) && (
                <points>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={20}
                            array={
                                new Float32Array(
                                    Array.from(
                                        { length: 60 },
                                        () =>
                                            (Math.random() - 0.5) *
                                            characterSize *
                                            3
                                    )
                                )
                            }
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <pointsMaterial
                        size={0.02}
                        color={colors.body}
                        transparent
                        opacity={0.6}
                        sizeAttenuation={true}
                    />
                </points>
            )}
        </group>
    );
};

export default Character3D;
