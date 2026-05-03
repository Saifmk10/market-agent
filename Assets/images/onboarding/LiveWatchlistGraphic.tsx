import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop, Line } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Live Watchlist Graphic - Shows a real-time price ticker with pulsing dots
 */
const LiveWatchlistGraphic = () => {
    const draw = useRef(new Animated.Value(0)).current;
    const pulse = useRef(new Animated.Value(0.6)).current;
    const dot = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(draw, { toValue: 1, duration: 1200, useNativeDriver: false }).start();
        Animated.sequence([
            Animated.delay(800),
            Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: false }),
        ]).start();
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: false }),
                Animated.timing(pulse, { toValue: 0.6, duration: 1200, useNativeDriver: false }),
            ])
        ).start();
    }, []);

    const dashOffset = draw.interpolate({ inputRange: [0, 1], outputRange: [320, 0] });

    return (
        <View style={styles.container}>
            <Svg width={220} height={140} viewBox="0 0 220 140">
                <Defs>
                    <LinearGradient id="liveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#5F48F5" stopOpacity="0.5" />
                        <Stop offset="100%" stopColor="#a78bfa" stopOpacity="1" />
                    </LinearGradient>
                </Defs>

                {/* Price level lines */}
                <Line x1="20" y1="30" x2="200" y2="30" stroke="#1a1a2e" strokeWidth="0.5" />
                <Line x1="20" y1="60" x2="200" y2="60" stroke="#1a1a2e" strokeWidth="0.5" />
                <Line x1="20" y1="90" x2="200" y2="90" stroke="#1a1a2e" strokeWidth="0.5" />
                <Line x1="20" y1="120" x2="200" y2="120" stroke="#1a1a2e" strokeWidth="0.5" />

                {/* Main price line */}
                <AnimatedPath
                    d="M 20 100 C 40 95, 55 85, 70 75 S 90 50, 110 60 S 130 80, 145 55 S 165 30, 185 35 L 200 30"
                    stroke="url(#liveGrad)"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="320"
                    strokeDashoffset={dashOffset}
                />

                {/* Live pulse dot at end */}
                <AnimatedCircle cx="200" cy="30" r="4" fill="#a78bfa" opacity={dot} />
                <AnimatedCircle cx="200" cy="30" r="8" fill="none" stroke="#a78bfa" strokeWidth="1" opacity={pulse} />

                {/* Price tag */}
                <Rect x="155" y="12" width="50" height="18" rx="4" fill="rgba(95,72,245,0.2)" />
                <AnimatedCircle cx="163" cy="21" r="3" fill="#22c55e" opacity={dot} />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { alignItems: "center", justifyContent: "center", height: 160, width: "100%" },
});

export default LiveWatchlistGraphic;
