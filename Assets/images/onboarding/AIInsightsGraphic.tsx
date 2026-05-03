import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

const AIInsightsGraphic = () => {
    const brainPath = useRef(new Animated.Value(0)).current;
    const bar1 = useRef(new Animated.Value(0)).current;
    const bar2 = useRef(new Animated.Value(0)).current;
    const bar3 = useRef(new Animated.Value(0)).current;
    const bar4 = useRef(new Animated.Value(0)).current;
    const sparkle1 = useRef(new Animated.Value(0)).current;
    const sparkle2 = useRef(new Animated.Value(0)).current;
    const sparkle3 = useRef(new Animated.Value(0)).current;
    const orbit = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(brainPath, { toValue: 1, duration: 1200, useNativeDriver: false }),
            Animated.stagger(120, [
                Animated.timing(bar1, { toValue: 1, duration: 400, useNativeDriver: false }),
                Animated.timing(bar2, { toValue: 1, duration: 400, useNativeDriver: false }),
                Animated.timing(bar3, { toValue: 1, duration: 400, useNativeDriver: false }),
                Animated.timing(bar4, { toValue: 1, duration: 400, useNativeDriver: false }),
            ]),
            Animated.stagger(200, [
                Animated.timing(sparkle1, { toValue: 1, duration: 300, useNativeDriver: false }),
                Animated.timing(sparkle2, { toValue: 1, duration: 300, useNativeDriver: false }),
                Animated.timing(sparkle3, { toValue: 1, duration: 300, useNativeDriver: false }),
            ]),
        ]).start();

        Animated.loop(
            Animated.timing(orbit, { toValue: 1, duration: 6000, useNativeDriver: true })
        ).start();
    }, []);

    const brainDashoffset = brainPath.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
    });

    const orbitRotation = orbit.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.orbitRing, { transform: [{ rotate: orbitRotation }] }]}>
                <View style={styles.orbitDot} />
            </Animated.View>

            <Svg width={260} height={220} viewBox="0 0 260 220">
                <Defs>
                    <LinearGradient id="aiGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor="#a78bfa" stopOpacity="1" />
                        <Stop offset="100%" stopColor="#5F48F5" stopOpacity="1" />
                    </LinearGradient>
                    <LinearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor="#5F48F5" stopOpacity="0.8" />
                        <Stop offset="100%" stopColor="#5F48F5" stopOpacity="0.3" />
                    </LinearGradient>
                </Defs>

                {/* Brain/AI core shape */}
                <AnimatedPath
                    d="M 130 50 C 155 50, 175 65, 175 85 C 175 95, 168 103, 160 108 C 168 115, 172 125, 170 135 C 167 150, 150 160, 130 160 C 110 160, 93 150, 90 135 C 88 125, 92 115, 100 108 C 92 103, 85 95, 85 85 C 85 65, 105 50, 130 50"
                    stroke="url(#aiGrad)"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="300"
                    strokeDashoffset={brainDashoffset}
                />

                {/* Neural connections inside */}
                <AnimatedPath
                    d="M 110 80 L 130 95 L 150 80 M 115 120 L 130 108 L 145 120 M 130 95 L 130 108"
                    stroke="#5F48F5"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="300"
                    strokeDashoffset={brainDashoffset}
                />

                {/* Analysis bars (bottom) */}
                <AnimatedRect x="40" y="185" width="20" height="25" rx="4" fill="url(#barGrad)" opacity={bar1} />
                <AnimatedRect x="70" y="175" width="20" height="35" rx="4" fill="url(#barGrad)" opacity={bar2} />
                <AnimatedRect x="100" y="180" width="20" height="30" rx="4" fill="url(#barGrad)" opacity={bar3} />
                <AnimatedRect x="130" y="170" width="20" height="40" rx="4" fill="url(#barGrad)" opacity={bar4} />

                {/* Sparkle/insight indicators */}
                <AnimatedCircle cx="195" cy="70" r="3" fill="#a78bfa" opacity={sparkle1} />
                <AnimatedCircle cx="210" cy="90" r="2" fill="#7c3aed" opacity={sparkle2} />
                <AnimatedCircle cx="220" cy="60" r="2.5" fill="#5F48F5" opacity={sparkle3} />
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
    orbitRing: {
        position: "absolute",
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 0.5,
        borderColor: "rgba(95, 72, 245, 0.12)",
        alignItems: "flex-end",
        justifyContent: "center",
    },
    orbitDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#5F48F5",
    },
});

export default AIInsightsGraphic;
