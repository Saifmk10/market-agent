import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";
import Svg, { Circle, Line, Defs, RadialGradient, Stop } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedLine = Animated.createAnimatedComponent(Line);

const CommunityGraphic = () => {
    const node1 = useRef(new Animated.Value(0)).current;
    const node2 = useRef(new Animated.Value(0)).current;
    const node3 = useRef(new Animated.Value(0)).current;
    const node4 = useRef(new Animated.Value(0)).current;
    const node5 = useRef(new Animated.Value(0)).current;
    const lines = useRef(new Animated.Value(0)).current;
    const pulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(node1, { toValue: 1, duration: 400, useNativeDriver: false }),
            Animated.parallel([
                Animated.timing(node2, { toValue: 1, duration: 350, useNativeDriver: false }),
                Animated.timing(node3, { toValue: 1, duration: 350, useNativeDriver: false }),
            ]),
            Animated.parallel([
                Animated.timing(node4, { toValue: 1, duration: 350, useNativeDriver: false }),
                Animated.timing(node5, { toValue: 1, duration: 350, useNativeDriver: false }),
            ]),
            Animated.timing(lines, { toValue: 1, duration: 600, useNativeDriver: false }),
        ]).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1.15, duration: 2000, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 1, duration: 2000, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulse }] }]} />
            <Svg width={260} height={220} viewBox="0 0 260 220">
                <Defs>
                    <RadialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                        <Stop offset="0%" stopColor="#5F48F5" stopOpacity="0.6" />
                        <Stop offset="100%" stopColor="#5F48F5" stopOpacity="0" />
                    </RadialGradient>
                </Defs>

                {/* Connection lines */}
                <AnimatedLine x1="130" y1="110" x2="70" y2="60" stroke="#5F48F5" strokeWidth="1" opacity={lines} />
                <AnimatedLine x1="130" y1="110" x2="190" y2="55" stroke="#5F48F5" strokeWidth="1" opacity={lines} />
                <AnimatedLine x1="130" y1="110" x2="60" y2="165" stroke="#7c3aed" strokeWidth="1" opacity={lines} />
                <AnimatedLine x1="130" y1="110" x2="200" y2="170" stroke="#7c3aed" strokeWidth="1" opacity={lines} />
                <AnimatedLine x1="70" y1="60" x2="190" y2="55" stroke="#1a1a2e" strokeWidth="0.5" opacity={lines} />
                <AnimatedLine x1="60" y1="165" x2="200" y2="170" stroke="#1a1a2e" strokeWidth="0.5" opacity={lines} />

                {/* Center node (main user) */}
                <Circle cx="130" cy="110" r="30" fill="url(#nodeGlow)" />
                <AnimatedCircle cx="130" cy="110" r="18" fill="#5F48F5" opacity={node1} />
                <AnimatedCircle cx="130" cy="110" r="8" fill="#ffffff" opacity={node1} />

                {/* Surrounding nodes */}
                <AnimatedCircle cx="70" cy="60" r="12" fill="#7c3aed" opacity={node2} />
                <AnimatedCircle cx="70" cy="60" r="5" fill="#ffffff" opacity={node2} />

                <AnimatedCircle cx="190" cy="55" r="12" fill="#7c3aed" opacity={node3} />
                <AnimatedCircle cx="190" cy="55" r="5" fill="#ffffff" opacity={node3} />

                <AnimatedCircle cx="60" cy="165" r="10" fill="#a78bfa" opacity={node4} />
                <AnimatedCircle cx="60" cy="165" r="4" fill="#ffffff" opacity={node4} />

                <AnimatedCircle cx="200" cy="170" r="10" fill="#a78bfa" opacity={node5} />
                <AnimatedCircle cx="200" cy="170" r="4" fill="#ffffff" opacity={node5} />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        height: 240,
        width: 300,
    },
    pulseRing: {
        position: "absolute",
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 1,
        borderColor: "rgba(95, 72, 245, 0.15)",
    },
});

export default CommunityGraphic;
