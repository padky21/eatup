import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, useWindowDimensions, Platform } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Accent, Surface } from '@/constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface CalorieProgressRingProps {
    /** Current calories (e.g. 2150) */
    current?: number;
    /** Max/goal calories (e.g. 3000) */
    max?: number;
    /** Diameter override; defaults to 45% of screen width */
    size?: number;
    /** Ring thickness; defaults to size * 0.09 */
    strokeWidth?: number;
    /** Progress arc color */
    color?: string;
    /** Background track color */
    trackColor?: string;
    /** Circle inner fill color */
    backgroundColor?: string;
    /** Unit label under the number */
    label?: string;
}

/**
 * CalorieProgressRing
 * A responsive circular progress ring showing current vs. max calories.
 */
export default function CalorieProgressRing({
    current = 0,
    max = 3000,
    size,
    strokeWidth,
    color = Accent.green,
    trackColor = '#3A3A3A',
    backgroundColor = Surface.card,
    label = 'kcal',
}: CalorieProgressRingProps) {
    const { width } = useWindowDimensions();

    // Responsive sizing: use provided size, otherwise scale to screen width
    const diameter = size ?? Math.min(width * 0.45, 220);
    const stroke = strokeWidth ?? diameter * 0.09;
    const radius = (diameter - stroke) / 2;
    const circumference = 2 * Math.PI * radius;

    const clampedProgress = Math.max(0, Math.min(current / max, 1));

    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: clampedProgress,
            duration: 900,
            // Native driver can't animate SVG stroke props, and isn't supported
            // on web anyway — always fall back to JS-driven animation.
            useNativeDriver: false,
        }).start();
    }, [clampedProgress]);

    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0],
    });

    return (
        <View
            style={[
                styles.container,
                { width: diameter, height: diameter, borderRadius: diameter / 2, backgroundColor },
            ]}
        >
            <Svg
                width={diameter}
                height={diameter}
                style={[
                    StyleSheet.absoluteFill,
                    // Rotate the whole SVG (instead of using Circle's rotation/origin
                    // props) so progress starts from the top, 12 o'clock position.
                    // This uses a standard RN style transform, which is safe on web too.
                    { transform: [{ rotate: '-90deg' }] },
                ]}
            >
                {/* Background track */}
                <Circle
                    cx={diameter / 2}
                    cy={diameter / 2}
                    r={radius}
                    stroke={trackColor}
                    strokeWidth={stroke}
                    fill="none"
                />
                {/* Progress arc */}
                <AnimatedCircle
                    cx={diameter / 2}
                    cy={diameter / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={stroke}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                />
            </Svg>

            <View style={styles.textWrapper}>
                <Text
                    style={[styles.currentText, { fontSize: diameter * 0.19 }]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                >
                    {current.toLocaleString()}
                </Text>
                <Text style={[styles.maxText, { fontSize: diameter * 0.09 }]}>
                    / {max.toLocaleString()} {label}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    textWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    currentText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    maxText: {
        color: '#9A9A9A',
        fontWeight: '400',
        marginTop: 2,
    },
});