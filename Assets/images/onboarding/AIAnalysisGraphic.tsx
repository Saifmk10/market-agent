import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Line, Ellipse } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedLine = Animated.createAnimatedComponent(Line);

/**
 * AI Analysis Graphic - Abstract AI eye scanning price data
 */
const AIAnalysisGraphic = () => {
    const eyeDraw = useRef(new Animated.Value(0)).current;
    const irisPulse = useRef(new Animated.Value(0)).current;
    const scanLine = useRef(new Animated.Value(0)).current;
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;
    const dot4 = useRef(new Animated.Value(0)).current;
    const dot5 = useRef(new Animated.Value(0)).current;
    const glow = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(eyeDraw, { toValue: 1, duration: 800, useNativeDriver: false }),
            Animated.timing(irisPulse, { toValue: 1, duration: 500, useNativeDriver: false }),
            Animated.timing(scanLine, { toValue: 1, duration: 600, useNativeDriver: false }),
            Animated.stagger(80, [
                Animated.timing(dot1, { toValue: 1, duration: 200, useNativeDriver: false }),
                Animated.timing(dot2, { toValue: 1, duration: 200, useNativeDriver: false }),
                Animated.timing(dot3, { toValue: 1, duration: 200, useNativeDriver: false }),
                Animated.timing(dot4, { toValue: 1, duration: 200, useNativeDriver: false }),
                Animated.timing(dot5, { toValue: 1, duration: 200, useNativeDriver: false }),
            ]),
            Animated.timing(glow, { toValue: 1, duration: 400, useNativeDriver: false }),
        ]).start();

        // Continuous iris pulse
        Animated.loop(
            Animated.sequence([
                Animated.timing(irisPulse, { toValue: 0.7, duration: 1200, useNativeDriver: false }),
                Animated.timing(irisPulse, { toValue: 1, duration: 1200, useNativeDriver: false }),
            ])
        ).start();
    }, []);

    const eyePathDash = eyeDraw.interpolate({ inputRange: [0, 1], outputRange: [300, 0] });
    const scanX = scanLine.interpolate({ inputRange: [0, 1], outputRange: [40, 180] });

    return (
        <View style={styles.container}>
            <Svg width={220} height={140} viewBox="0 0 220 140">
                <Defs>
                    <LinearGradient id="eyeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#7c3aed" stopOpacity="1" />
                        <Stop offset="100%" stopColor="#5F48F5" stopOpacity="1" />
                    </LinearGradient>
                    <LinearGradient id="irisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#a78bfa" stopOpacity="1" />
                        <Stop offset="100%" stopColor="#5F48F5" stopOpacity="0.8" />
                    </LinearGradient>
                    <LinearGradient id="scanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor="#7c3aed" stopOpacity="0" />
                        <Stop offset="50%" stopColor="#7c3aed" stopOpacity="0.6" />
                        <Stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                    </LinearGradient>
                </Defs>

                {/* Eye outer shape - top arc */}
                <AnimatedPath
                    d="M 40 70 Q 110 20 180 70"
                    stroke="url(#eyeGrad)"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="300"
                    strokeDashoffset={eyePathDash}
                />

                {/* Eye outer shape - bottom arc */}
                <AnimatedPath
                    d="M 40 70 Q 110 120 180 70"
                    stroke="url(#eyeGrad)"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="300"
                    strokeDashoffset={eyePathDash}
                />

                {/* Iris outer ring */}
                <AnimatedEllipse
                    cx="110"
                    cy="70"
                    rx="22"
                    ry="22"
                    fill="none"
                    stroke="#a78bfa"
                    strokeWidth="1.5"
                    opacity={irisPulse}
                />

                {/* Iris inner */}
                <AnimatedCircle
                    cx="110"
                    cy="70"
                    r="12"
                    fill="url(#irisGrad)"
                    opacity={irisPulse}
                />

                {/* Pupil */}
                <AnimatedCircle
                    cx="110"
                    cy="70"
                    r="5"
                    fill="#000000"
                    opacity={irisPulse}
                />

                {/* Iris highlight */}
                <AnimatedCircle
                    cx="106"
                    cy="66"
                    r="2.5"
                    fill="rgba(255,255,255,0.5)"
                    opacity={irisPulse}
                />

                {/* Scan line (vertical sweep) */}
                <AnimatedLine
                    x1={scanX}
                    y1="35"
                    x2={scanX}
                    y2="105"
                    stroke="url(#scanGrad)"
                    strokeWidth="1.5"
                    opacity={glow}
                />

                {/* Data points being scanned (price dots) */}
                <AnimatedCircle cx="55" cy="55" r="3" fill="#5F48F5" opacity={dot1} />
                <AnimatedCircle cx="80" cy="80" r="3" fill="#7c3aed" opacity={dot2} />
                <AnimatedCircle cx="140" cy="50" r="3" fill="#a78bfa" opacity={dot3} />
                <AnimatedCircle cx="160" cy="75" r="3" fill="#7c3aed" opacity={dot4} />
                <AnimatedCircle cx="175" cy="58" r="3" fill="#5F48F5" opacity={dot5} />

                {/* Connecting data lines */}
                <AnimatedPath
                    d="M 55 55 L 80 80 L 110 60 L 140 50 L 160 75 L 175 58"
                    stroke="#5F48F5"
                    strokeWidth="1"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="2,5"
                    opacity={glow}
                />

                {/* Corner brackets - top left */}
                <AnimatedPath
                    d="M 45 40 L 45 35 L 55 35"
                    stroke="rgba(167,139,250,0.5)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    opacity={glow}
                />
                {/* Corner brackets - top right */}
                <AnimatedPath
                    d="M 175 35 L 180 35 L 180 40"
                    stroke="rgba(167,139,250,0.5)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    opacity={glow}
                />
                {/* Corner brackets - bottom left */}
                <AnimatedPath
                    d="M 45 100 L 45 105 L 55 105"
                    stroke="rgba(167,139,250,0.5)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    opacity={glow}
                />
                {/* Corner brackets - bottom right */}
                <AnimatedPath
                    d="M 175 105 L 180 105 L 180 100"
                    stroke="rgba(167,139,250,0.5)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    opacity={glow}
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { alignItems: "center", justifyContent: "center", height: 160, width: "100%" },
});

export default AIAnalysisGraphic;
