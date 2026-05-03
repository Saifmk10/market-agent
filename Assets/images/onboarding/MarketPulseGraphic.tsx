import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const MarketPulseGraphic = () => {
    const lineProgress = useRef(new Animated.Value(0)).current;
    const dot1Opacity = useRef(new Animated.Value(0)).current;
    const dot2Opacity = useRef(new Animated.Value(0)).current;
    const dot3Opacity = useRef(new Animated.Value(0)).current;
    const dot4Opacity = useRef(new Animated.Value(0)).current;
    const glowScale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(lineProgress, {
                toValue: 1,
                duration: 1400,
                useNativeDriver: false,
            }),
            Animated.stagger(150, [
                Animated.timing(dot1Opacity, { toValue: 1, duration: 300, useNativeDriver: false }),
                Animated.timing(dot2Opacity, { toValue: 1, duration: 300, useNativeDriver: false }),
                Animated.timing(dot3Opacity, { toValue: 1, duration: 300, useNativeDriver: false }),
                Animated.timing(dot4Opacity, { toValue: 1, duration: 300, useNativeDriver: false }),
            ]),
        ]).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(glowScale, { toValue: 1.2, duration: 1500, useNativeDriver: true }),
                Animated.timing(glowScale, { toValue: 0.8, duration: 1500, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const strokeDashoffset = lineProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [400, 0],
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.glowOrb, { transform: [{ scale: glowScale }] }]} />
            <Svg width={280} height={200} viewBox="0 0 280 200">
                <Defs>
                    <LinearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#5F48F5" stopOpacity="0.4" />
                        <Stop offset="50%" stopColor="#5F48F5" stopOpacity="1" />
                        <Stop offset="100%" stopColor="#a78bfa" stopOpacity="1" />
                    </LinearGradient>
                </Defs>

                {/* Grid lines */}
                <Path d="M 30 40 H 260" stroke="#1a1a2e" strokeWidth="0.5" />
                <Path d="M 30 80 H 260" stroke="#1a1a2e" strokeWidth="0.5" />
                <Path d="M 30 120 H 260" stroke="#1a1a2e" strokeWidth="0.5" />
                <Path d="M 30 160 H 260" stroke="#1a1a2e" strokeWidth="0.5" />

                {/* Main chart line */}
                <AnimatedPath
                    d="M 30 150 C 60 140, 80 130, 100 110 S 130 60, 150 80 S 180 120, 200 70 S 240 30, 260 40"
                    stroke="url(#chartGrad)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="400"
                    strokeDashoffset={strokeDashoffset}
                />

                {/* Data points */}
                <AnimatedCircle cx="100" cy="110" r="5" fill="#5F48F5" opacity={dot1Opacity} />
                <AnimatedCircle cx="150" cy="80" r="5" fill="#5F48F5" opacity={dot2Opacity} />
                <AnimatedCircle cx="200" cy="70" r="5" fill="#7c3aed" opacity={dot3Opacity} />
                <AnimatedCircle cx="260" cy="40" r="6" fill="#a78bfa" opacity={dot4Opacity} />

                {/* Highlight ring on final point */}
                <AnimatedCircle cx="260" cy="40" r="10" fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity={dot4Opacity} />
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
    glowOrb: {
        position: "absolute",
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "rgba(95, 72, 245, 0.08)",
        top: 40,
        right: 20,
    },
});

export default MarketPulseGraphic;
