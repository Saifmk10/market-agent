import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedPath = Animated.createAnimatedComponent(Path);

/**
 * Secure Auth Graphic - Shield with lock icon
 */
const SecureAuthGraphic = () => {
    const shield = useRef(new Animated.Value(0)).current;
    const lock = useRef(new Animated.Value(0)).current;
    const particles = useRef(new Animated.Value(0)).current;
    const glow = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(shield, { toValue: 1, duration: 900, useNativeDriver: false }),
            Animated.timing(lock, { toValue: 1, duration: 500, useNativeDriver: false }),
            Animated.timing(particles, { toValue: 1, duration: 500, useNativeDriver: false }),
        ]).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(glow, { toValue: 0.7, duration: 2000, useNativeDriver: false }),
                Animated.timing(glow, { toValue: 0.3, duration: 2000, useNativeDriver: false }),
            ])
        ).start();
    }, []);

    const shieldDash = shield.interpolate({ inputRange: [0, 1], outputRange: [300, 0] });

    return (
        <View style={styles.container}>
            <Svg width={220} height={140} viewBox="0 0 220 140">
                <Defs>
                    <LinearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor="#a78bfa" stopOpacity="1" />
                        <Stop offset="100%" stopColor="#5F48F5" stopOpacity="0.8" />
                    </LinearGradient>
                </Defs>

                {/* Shield shape */}
                <AnimatedPath
                    d="M 110 20 L 145 32 C 148 33, 150 36, 150 39 L 150 72 C 150 90, 135 105, 110 115 C 85 105, 70 90, 70 72 L 70 39 C 70 36, 72 33, 75 32 Z"
                    stroke="url(#shieldGrad)"
                    strokeWidth="2"
                    fill="rgba(95,72,245,0.06)"
                    strokeLinecap="round"
                    strokeDasharray="300"
                    strokeDashoffset={shieldDash}
                />

                {/* Inner shield glow */}
                <AnimatedPath
                    d="M 110 30 L 138 40 L 138 70 C 138 84, 126 95, 110 102 C 94 95, 82 84, 82 70 L 82 40 Z"
                    fill="rgba(95,72,245,0.08)"
                    opacity={glow}
                />

                {/* Lock body */}
                <AnimatedRect x="100" y="62" width="20" height="18" rx="3" fill="#5F48F5" opacity={lock} />
                {/* Lock shackle */}
                <AnimatedPath
                    d="M 105 62 L 105 55 C 105 49, 110 45, 115 45 C 120 45, 115 49, 115 55 L 115 62"
                    stroke="#a78bfa"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    opacity={lock}
                />
                {/* Lock keyhole */}
                <AnimatedCircle cx="110" cy="70" r="2.5" fill="#ffffff" opacity={lock} />

                {/* Floating particles */}
                <AnimatedCircle cx="55" cy="50" r="2" fill="#5F48F5" opacity={particles} />
                <AnimatedCircle cx="165" cy="45" r="1.5" fill="#a78bfa" opacity={particles} />
                <AnimatedCircle cx="160" cy="95" r="2" fill="#7c3aed" opacity={particles} />
                <AnimatedCircle cx="60" cy="90" r="1.5" fill="#5F48F5" opacity={particles} />
                <AnimatedCircle cx="50" cy="70" r="1" fill="#a78bfa" opacity={particles} />
                <AnimatedCircle cx="170" cy="70" r="1" fill="#7c3aed" opacity={particles} />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { alignItems: "center", justifyContent: "center", height: 160, width: "100%" },
});

export default SecureAuthGraphic;
