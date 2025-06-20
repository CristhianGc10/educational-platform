// components/tools/RelationshipNetworkVisualizer.tsx
'use client';

import {
    DiscoveredPattern,
    Family,
    FamilyMember,
    FamilyRelationship,
    NetworkPosition,
    NetworkVisualizationProps,
} from '../../types/relationships';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { motion } from 'framer-motion';

const RelationshipNetworkVisualizer: React.FC<NetworkVisualizationProps> = ({
    family,
    selectedMembers,
    onMemberSelect,
    onRelationshipHover,
    discoveredPatterns,
    showPatterns,
    view3D = false,
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const [positions, setPositions] = useState<Map<string, NetworkPosition>>(
        new Map()
    );
    const [hoveredMember, setHoveredMember] = useState<string | null>(null);
    const [hoveredRelationship, setHoveredRelationship] = useState<
        string | null
    >(null);

    // Update dimensions on resize
    useEffect(() => {
        const updateDimensions = () => {
            if (svgRef.current) {
                const rect = svgRef.current.getBoundingClientRect();
                setDimensions({ width: rect.width, height: rect.height });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Calculate node positions using force-directed layout
    useEffect(() => {
        if (!family) return;

        const newPositions = new Map<string, NetworkPosition>();
        const { width, height } = dimensions;
        const centerX = width / 2;
        const centerY = height / 2;

        // Group members by generation
        const generationGroups = new Map<number, FamilyMember[]>();
        family.members.forEach((member) => {
            if (!generationGroups.has(member.generation)) {
                generationGroups.set(member.generation, []);
            }
            generationGroups.get(member.generation)!.push(member);
        });

        const generations = Array.from(generationGroups.keys()).sort();
        const generationHeight = height / (generations.length + 1);

        generations.forEach((generation, genIndex) => {
            const members = generationGroups.get(generation)!;
            const memberWidth = width / (members.length + 1);

            members.forEach((member, memberIndex) => {
                const x = memberWidth * (memberIndex + 1);
                const y = generationHeight * (genIndex + 1);

                newPositions.set(member.id, { x, y });
            });
        });

        // Apply force simulation for better positioning
        const simulatedPositions = simulateForces(
            newPositions,
            family.relationships,
            family.members
        );
        setPositions(simulatedPositions);
    }, [family, dimensions]);

    const simulateForces = (
        initialPositions: Map<string, NetworkPosition>,
        relationships: FamilyRelationship[],
        members: FamilyMember[]
    ): Map<string, NetworkPosition> => {
        const positions = new Map(initialPositions);
        const iterations = 50;
        const repulsionStrength = 1000;
        const attractionStrength = 0.1;
        const dampening = 0.9;

        for (let i = 0; i < iterations; i++) {
            const forces = new Map<string, { x: number; y: number }>();

            // Initialize forces
            members.forEach((member) => {
                forces.set(member.id, { x: 0, y: 0 });
            });

            // Repulsion between all nodes
            members.forEach((memberA) => {
                members.forEach((memberB) => {
                    if (memberA.id === memberB.id) return;

                    const posA = positions.get(memberA.id)!;
                    const posB = positions.get(memberB.id)!;
                    const dx = posA.x - posB.x;
                    const dy = posA.y - posB.y;
                    const distance = Math.sqrt(dx * dx + dy * dy) || 1;

                    const force = repulsionStrength / (distance * distance);
                    const forceX = (dx / distance) * force;
                    const forceY = (dy / distance) * force;

                    const currentForce = forces.get(memberA.id)!;
                    forces.set(memberA.id, {
                        x: currentForce.x + forceX,
                        y: currentForce.y + forceY,
                    });
                });
            });

            // Attraction between connected nodes
            relationships.forEach((rel) => {
                const posA = positions.get(rel.from);
                const posB = positions.get(rel.to);

                if (!posA || !posB) return;

                const dx = posB.x - posA.x;
                const dy = posB.y - posA.y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 1;

                const force = distance * attractionStrength * rel.strength;
                const forceX = (dx / distance) * force;
                const forceY = (dy / distance) * force;

                const forceA = forces.get(rel.from)!;
                const forceB = forces.get(rel.to)!;

                forces.set(rel.from, {
                    x: forceA.x + forceX,
                    y: forceA.y + forceY,
                });

                forces.set(rel.to, {
                    x: forceB.x - forceX,
                    y: forceB.y - forceY,
                });
            });

            // Apply forces
            forces.forEach((force, memberId) => {
                const currentPos = positions.get(memberId)!;
                const newX = Math.max(
                    50,
                    Math.min(
                        dimensions.width - 50,
                        currentPos.x + force.x * dampening
                    )
                );
                const newY = Math.max(
                    50,
                    Math.min(
                        dimensions.height - 50,
                        currentPos.y + force.y * dampening
                    )
                );

                positions.set(memberId, { x: newX, y: newY });
            });
        }

        return positions;
    };

    const getMemberColor = useCallback(
        (member: FamilyMember) => {
            if (selectedMembers.includes(member.id)) {
                return '#3B82F6'; // Blue for selected
            }

            switch (member.gender) {
                case 'male':
                    return '#10B981'; // Green for male
                case 'female':
                    return '#EC4899'; // Pink for female
                default:
                    return '#6B7280'; // Gray for other
            }
        },
        [selectedMembers]
    );

    const getRelationshipColor = useCallback(
        (relationship: FamilyRelationship) => {
            const colors = {
                spouse: '#EF4444', // Red
                parent: '#F59E0B', // Amber
                child: '#F59E0B', // Amber
                sibling: '#8B5CF6', // Purple
                grandparent: '#06B6D4', // Cyan
                grandchild: '#06B6D4', // Cyan
            };

            return colors[relationship.type] || '#6B7280';
        },
        []
    );

    const handleMemberClick = useCallback(
        (memberId: string) => {
            onMemberSelect(memberId);
        },
        [onMemberSelect]
    );

    const handleMemberMouseEnter = useCallback((memberId: string) => {
        setHoveredMember(memberId);
    }, []);

    const handleMemberMouseLeave = useCallback(() => {
        setHoveredMember(null);
    }, []);

    const handleRelationshipMouseEnter = useCallback(
        (relationshipId: string) => {
            setHoveredRelationship(relationshipId);
            onRelationshipHover(relationshipId);
        },
        [onRelationshipHover]
    );

    const handleRelationshipMouseLeave = useCallback(() => {
        setHoveredRelationship(null);
    }, []);

    const isPatternHighlighted = useCallback(
        (member: FamilyMember) => {
            if (!showPatterns) return false;

            return discoveredPatterns.some((pattern) => {
                // Check if member is part of any discovered pattern
                return pattern.examples.some(
                    (example) =>
                        example
                            .toLowerCase()
                            .includes(member.name.toLowerCase()) ||
                        example.toLowerCase().includes(member.age.toString())
                );
            });
        },
        [showPatterns, discoveredPatterns]
    );

    if (!family) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                No hay familia seleccionada
            </div>
        );
    }

    return (
        <div className="w-full h-full relative overflow-hidden bg-gray-50">
            <svg
                ref={svgRef}
                className="w-full h-full"
                viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            >
                {/* Definitions for patterns and gradients */}
                <defs>
                    <pattern
                        id="patternHighlight"
                        patternUnits="userSpaceOnUse"
                        width="4"
                        height="4"
                    >
                        <rect width="4" height="4" fill="#FEF3C7" />
                        <circle
                            cx="2"
                            cy="2"
                            r="1"
                            fill="#F59E0B"
                            opacity="0.5"
                        />
                    </pattern>

                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Relationship Lines */}
                <g className="relationships">
                    {family.relationships.map((relationship) => {
                        const fromPos = positions.get(relationship.from);
                        const toPos = positions.get(relationship.to);

                        if (!fromPos || !toPos) return null;

                        const isHovered =
                            hoveredRelationship === relationship.id;
                        const isConnectedToSelected =
                            selectedMembers.includes(relationship.from) ||
                            selectedMembers.includes(relationship.to);

                        return (
                            <motion.line
                                key={relationship.id}
                                x1={fromPos.x}
                                y1={fromPos.y}
                                x2={toPos.x}
                                y2={toPos.y}
                                stroke={getRelationshipColor(relationship)}
                                strokeWidth={
                                    isHovered
                                        ? 4
                                        : isConnectedToSelected
                                          ? 3
                                          : 2
                                }
                                strokeOpacity={
                                    isHovered
                                        ? 1
                                        : isConnectedToSelected
                                          ? 0.8
                                          : 0.4
                                }
                                strokeDasharray={
                                    relationship.verified ? 'none' : '5,5'
                                }
                                onMouseEnter={() =>
                                    handleRelationshipMouseEnter(
                                        relationship.id
                                    )
                                }
                                onMouseLeave={handleRelationshipMouseLeave}
                                className="cursor-pointer transition-all duration-200"
                                filter={isHovered ? 'url(#glow)' : undefined}
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            />
                        );
                    })}
                </g>

                {/* Member Nodes */}
                <g className="members">
                    {family.members.map((member) => {
                        const position = positions.get(member.id);
                        if (!position) return null;

                        const isSelected = selectedMembers.includes(member.id);
                        const isHovered = hoveredMember === member.id;
                        const isHighlighted = isPatternHighlighted(member);
                        const nodeRadius = isSelected
                            ? 25
                            : isHovered
                              ? 22
                              : 20;

                        return (
                            <g key={member.id}>
                                {/* Pattern highlight background */}
                                {isHighlighted && (
                                    <circle
                                        cx={position.x}
                                        cy={position.y}
                                        r={nodeRadius + 8}
                                        fill="url(#patternHighlight)"
                                        opacity="0.7"
                                    />
                                )}

                                {/* Selection ring */}
                                {isSelected && (
                                    <motion.circle
                                        cx={position.x}
                                        cy={position.y}
                                        r={nodeRadius + 5}
                                        fill="none"
                                        stroke="#3B82F6"
                                        strokeWidth="3"
                                        strokeDasharray="8,4"
                                        initial={{ rotate: 0 }}
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: 'linear',
                                        }}
                                    />
                                )}

                                {/* Main node */}
                                <motion.circle
                                    cx={position.x}
                                    cy={position.y}
                                    r={nodeRadius}
                                    fill={getMemberColor(member)}
                                    stroke={isHovered ? '#1F2937' : '#FFFFFF'}
                                    strokeWidth={isHovered ? 3 : 2}
                                    className="cursor-pointer"
                                    onClick={() => handleMemberClick(member.id)}
                                    onMouseEnter={() =>
                                        handleMemberMouseEnter(member.id)
                                    }
                                    onMouseLeave={handleMemberMouseLeave}
                                    filter={
                                        isHovered || isSelected
                                            ? 'url(#glow)'
                                            : undefined
                                    }
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                />

                                {/* Member name */}
                                <text
                                    x={position.x}
                                    y={position.y - nodeRadius - 8}
                                    textAnchor="middle"
                                    className="fill-gray-700 text-sm font-medium pointer-events-none"
                                    style={{
                                        fontSize: isSelected ? '14px' : '12px',
                                    }}
                                >
                                    {member.name}
                                </text>

                                {/* Member age */}
                                <text
                                    x={position.x}
                                    y={position.y + 4}
                                    textAnchor="middle"
                                    className="fill-white text-xs font-semibold pointer-events-none"
                                >
                                    {member.age}
                                </text>

                                {/* Generation indicator */}
                                <text
                                    x={position.x}
                                    y={position.y + nodeRadius + 16}
                                    textAnchor="middle"
                                    className="fill-gray-500 text-xs pointer-events-none"
                                >
                                    Gen {member.generation}
                                </text>
                            </g>
                        );
                    })}
                </g>

                {/* Pattern annotations */}
                {showPatterns &&
                    discoveredPatterns.map((pattern, index) => (
                        <g key={pattern.id}>
                            <rect
                                x={10}
                                y={10 + index * 60}
                                width={200}
                                height={50}
                                fill="rgba(255, 255, 255, 0.9)"
                                stroke="#E5E7EB"
                                strokeWidth="1"
                                rx="8"
                            />
                            <text
                                x={20}
                                y={30 + index * 60}
                                className="fill-gray-900 text-sm font-semibold"
                            >
                                {pattern.type.replace(/_/g, ' ')}
                            </text>
                            <text
                                x={20}
                                y={50 + index * 60}
                                className="fill-gray-600 text-xs"
                            >
                                Confianza:{' '}
                                {Math.round(pattern.confidence * 100)}%
                            </text>
                        </g>
                    ))}
            </svg>

            {/* Tooltip */}
            {hoveredMember && (
                <motion.div
                    className="absolute pointer-events-none bg-gray-900 text-white p-3 rounded-lg shadow-lg text-sm z-10"
                    style={{
                        left: (positions.get(hoveredMember)?.x || 0) + 30,
                        top: (positions.get(hoveredMember)?.y || 0) - 10,
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                >
                    {(() => {
                        const member = family.members.find(
                            (m) => m.id === hoveredMember
                        );
                        if (!member) return null;

                        return (
                            <div>
                                <div className="font-semibold">
                                    {member.name}
                                </div>
                                <div className="text-gray-300">
                                    Edad: {member.age} años
                                </div>
                                <div className="text-gray-300">
                                    Género: {member.gender}
                                </div>
                                <div className="text-gray-300">
                                    Generación: {member.generation}
                                </div>
                                <div className="text-gray-300">
                                    Relaciones: {member.relationships.length}
                                </div>
                            </div>
                        );
                    })()}
                </motion.div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                    Leyenda
                </h4>
                <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">Hombres</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                        <span className="text-gray-700">Mujeres</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-1 bg-red-500"></div>
                        <span className="text-gray-700">Matrimonio</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-1 bg-amber-500"></div>
                        <span className="text-gray-700">Padre/Hijo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-1 bg-purple-500"></div>
                        <span className="text-gray-700">Hermanos</span>
                    </div>
                    {selectedMembers.length > 0 && (
                        <div className="flex items-center space-x-2 pt-2 border-t">
                            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-blue-300"></div>
                            <span className="text-gray-700">Seleccionado</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Family Info */}
            <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">
                    {family.name}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                    <div>Miembros: {family.members.length}</div>
                    <div>Relaciones: {family.relationships.length}</div>
                    <div>Complejidad: {family.complexity}</div>
                    {selectedMembers.length > 0 && (
                        <div className="pt-2 border-t text-blue-600">
                            Seleccionados: {selectedMembers.length}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RelationshipNetworkVisualizer;
