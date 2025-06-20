// ============================================================================
// CONECTOR DE RELACIONES 3D - CORREGIDO
// ============================================================================

import * as THREE from 'three';

import {
    FamilyMember,
    Relationship,
    RelationshipType,
} from '../types/relationships';
import React, { useMemo, useRef } from 'react';

import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

/**
 * Props para el conector de relaciones 3D
 */
export interface RelationshipConnector3DProps {
    relationship: Relationship;
    fromMember: FamilyMember;
    toMember: FamilyMember;
    isActive: boolean;
    animationProgress?: number;
}

/**
 * Configuración de colores por tipo de relación
 */
const RELATIONSHIP_COLORS: Record<RelationshipType, string> = {
    [RelationshipType.PARENT]: '#E91E63',
    [RelationshipType.CHILD]: '#E91E63',
    [RelationshipType.SIBLING]: '#4CAF50',
    [RelationshipType.SPOUSE]: '#FF5722',
    [RelationshipType.GRANDPARENT]: '#9C27B0',
    [RelationshipType.GRANDCHILD]: '#9C27B0',
    [RelationshipType.UNCLE_AUNT]: '#FF9800',
    [RelationshipType.NEPHEW_NIECE]: '#FF9800',
    [RelationshipType.COUSIN]: '#2196F3',
    [RelationshipType.FRIEND]: '#607D8B',
    [RelationshipType.COLLEAGUE]: '#795548',
    [RelationshipType.OTHER]: '#9E9E9E',
};

/**
 * Componente de conector de relaciones 3D
 */
const RelationshipConnector3D: React.FC<RelationshipConnector3DProps> = ({
    relationship,
    fromMember,
    toMember,
    isActive,
    animationProgress = 1.0,
}) => {
    const lineRef = useRef<THREE.Line>(null);
    const arrowRef = useRef<THREE.Mesh>(null);
    const labelRef = useRef<THREE.Group>(null);

    // Calcular posiciones y direcciones
    const { start, end, midpoint, direction, distance } = useMemo(() => {
        const startPos = new THREE.Vector3(...fromMember.position);
        const endPos = new THREE.Vector3(...toMember.position);
        const mid = new THREE.Vector3()
            .addVectors(startPos, endPos)
            .multiplyScalar(0.5);
        const dir = new THREE.Vector3()
            .subVectors(endPos, startPos)
            .normalize();
        const dist = startPos.distanceTo(endPos);

        return {
            start: startPos,
            end: endPos,
            midpoint: mid,
            direction: dir,
            distance: dist,
        };
    }, [fromMember.position, toMember.position]);

    // Crear geometría de línea
    const lineGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array([
            start.x,
            start.y,
            start.z,
            end.x,
            end.y,
            end.z,
        ]);
        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3)
        );
        return geometry;
    }, [start, end]);

    // Material de línea con animación
    const lineMaterial = useMemo(() => {
        const color = RELATIONSHIP_COLORS[relationship.type] || '#9E9E9E';
        return new THREE.LineBasicMaterial({
            color: color,
            opacity: isActive ? 0.8 : 0.4,
            transparent: true,
            linewidth: relationship.strength * 3 + 1,
        });
    }, [relationship.type, relationship.strength, isActive]);

    // Animación de la línea
    useFrame((state) => {
        if (lineRef.current && isActive) {
            const time = state.clock.getElapsedTime();

            // Efecto de flujo en la línea
            const material = lineRef.current
                .material as THREE.LineBasicMaterial;
            material.opacity = 0.4 + Math.sin(time * 3) * 0.2;
        }

        // Animación de la flecha direccional
        if (arrowRef.current && relationship.isDirectional) {
            const time = state.clock.getElapsedTime();
            arrowRef.current.position.copy(midpoint);
            arrowRef.current.position.y += Math.sin(time * 2) * 0.1;

            // Rotar la flecha para que apunte en la dirección correcta
            arrowRef.current.lookAt(end);
        }

        // Animación de la etiqueta
        if (labelRef.current && isActive) {
            const time = state.clock.getElapsedTime();
            labelRef.current.position.copy(midpoint);
            labelRef.current.position.y += 1 + Math.sin(time * 2) * 0.1;
        }
    });

    // Configuración de la flecha direccional
    const arrowGeometry = useMemo(() => {
        return new THREE.ConeGeometry(0.05, 0.2, 8);
    }, []);

    const arrowMaterial = useMemo(() => {
        const color = RELATIONSHIP_COLORS[relationship.type] || '#9E9E9E';
        return new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: isActive ? 0.8 : 0.5,
        });
    }, [relationship.type, isActive]);

    // Solo renderizar si la distancia es significativa
    if (distance < 0.1) {
        return null;
    }

    return (
        <group>
            {/* Línea principal de la relación */}
            <line
                ref={lineRef}
                geometry={lineGeometry}
                material={lineMaterial}
            />

            {/* Flecha direccional para relaciones dirigidas */}
            {relationship.isDirectional && (
                <mesh
                    ref={arrowRef}
                    geometry={arrowGeometry}
                    material={arrowMaterial}
                    position={[midpoint.x, midpoint.y, midpoint.z]}
                />
            )}

            {/* Etiqueta con tipo de relación (solo si está activa) */}
            {isActive && (
                <group
                    ref={labelRef}
                    position={[midpoint.x, midpoint.y + 1, midpoint.z]}
                >
                    <Text
                        fontSize={0.15}
                        color={RELATIONSHIP_COLORS[relationship.type]}
                        anchorX="center"
                        anchorY="middle"
                    >
                        {relationship.type.replace('_', ' ')}
                    </Text>

                    {/* Fondo semitransparente para la etiqueta */}
                    <mesh position={[0, 0, -0.01]}>
                        <planeGeometry args={[0.8, 0.3]} />
                        <meshBasicMaterial
                            color="#000000"
                            transparent
                            opacity={0.6}
                        />
                    </mesh>
                </group>
            )}

            {/* Indicador de fuerza de relación */}
            {isActive && (
                <mesh position={[midpoint.x, midpoint.y + 0.5, midpoint.z]}>
                    <sphereGeometry
                        args={[relationship.strength * 0.1, 8, 6]}
                    />
                    <meshBasicMaterial
                        color={RELATIONSHIP_COLORS[relationship.type]}
                        transparent
                        opacity={0.7}
                    />
                </mesh>
            )}

            {/* Efecto de partículas para relaciones muy fuertes */}
            {isActive && relationship.strength > 8 && (
                <points position={[midpoint.x, midpoint.y, midpoint.z]}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={10}
                            array={
                                new Float32Array(
                                    Array.from(
                                        { length: 30 },
                                        () => (Math.random() - 0.5) * 0.5
                                    )
                                )
                            }
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <pointsMaterial
                        size={0.02}
                        color={RELATIONSHIP_COLORS[relationship.type]}
                        transparent
                        opacity={0.8}
                        sizeAttenuation={true}
                    />
                </points>
            )}

            {/* Línea punteada para relaciones débiles */}
            {relationship.strength < 5 && (
                <line>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={10}
                            array={
                                new Float32Array(
                                    Array.from({ length: 30 }, (_, i) => {
                                        const t = (i % 3) / 2; // Crear patrón de puntos
                                        const pos =
                                            new THREE.Vector3().lerpVectors(
                                                start,
                                                end,
                                                (t / 10) *
                                                    (Math.floor(i / 3) + 1)
                                            );
                                        return pos.toArray();
                                    }).flat()
                                )
                            }
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <pointsMaterial
                        size={0.03}
                        color={RELATIONSHIP_COLORS[relationship.type]}
                        transparent
                        opacity={isActive ? 0.6 : 0.3}
                    />
                </line>
            )}
        </group>
    );
};

export default RelationshipConnector3D;
