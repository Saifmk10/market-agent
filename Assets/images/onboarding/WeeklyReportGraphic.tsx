import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";
import Svg, { Path, Rect, Circle, Defs, LinearGradient, Stop, Line } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Weekly Report Graphic - Calendar with trend indicators
 */
const WeeklyReportGraphic = () => {
    const calDraw = useRef(new Animated.Value(0)).current;
    const trend = useRef(new Animated.Value(0)).current;
    const badge = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(calDraw, { toValue: 1, duration: 800, useNativeDriver: false }),
            Animated.timing(trend, { toValue: 1, duration: 600, useNativeDriver: false }),
            Animated.timing(badge, { toValue: 1, duration: 400, useNativeDriver: false }),
        ]).start();
    }, []);

    const calDash = calDraw.interpolate({ inputRange: [0, 1], outputRange: [400, 0] });
    const trendDash = trend.interpolate({ inputRange: [0, 1], outputRange: [200, 0] });

    return (
        <View style={styles.container}>
            <Svg width={220} height={140} viewBox="0 0 220 140">
                <Defs>
                    <LinearGradient id="weekGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#5F48F5" stopOpacity="0.8" />
                        <Stop offset="100%" stopColor="#a78bfa" stopOpacity="1" />
                    </LinearGradient>
                </Defs>

                {/* Calendar frame */}
                <AnimatedRect
                    x="25" y="25" width="100" height="95" rx="10"
                    stroke="#5F48F5" strokeWidth="1.5" fill="rgba(95,72,245,0.05)"
                    strokeDasharray="400" strokeDashoffset={calDash}
                />
                {/* Calendar header bar */}
                <AnimatedRect
                    x="25" y="25" width="100" height="22" rx="10"
                    fill="rgba(95,72,245,0.15)" opacity={calDraw}
                />

                {/* Calendar dots (days) */}
                <AnimatedCircle cx="45" cy="65" r="3" fill="#333" opacity={calDraw} />
                <AnimatedCircle cx="65" cy="65" r="3" fill="#333" opacity={calDraw} />
                <AnimatedCircle cx="85" cy="65" r="3" fill="#5F48F5" opacity={calDraw} />
                <AnimatedCircle cx="105" cy="65" r="3" fill="#333" opacity={calDraw} />

                <AnimatedCircle cx="45" cy="85" r="3" fill="#333" opacity={calDraw} />
                <AnimatedCircle cx="65" cy="85" r="3" fill="#5F48F5" opacity={calDraw} />
                <AnimatedCircle cx="85" cy="85" r="3" fill="#333" opacity={calDraw} />
                <AnimatedCircle cx="105" cy="85" r="3" fill="#333" opacity={calDraw} />

                <AnimatedCircle cx="45" cy="105" r="3" fill="#333" opacity={calDraw} />
                <AnimatedCircle cx="65" cy="105" r="3" fill="#333" opacity={calDraw} />
                <AnimatedCircle cx="85" cy="105" r="3" fill="#5F48F5" opacity={calDraw} />
                <AnimatedCircle cx="105" cy="105" r="3" fill="#333" opacity={calDraw} />

                {/* Trend arrow (right side) */}
                <AnimatedPath
                    d="M 145 110 C 155 100, 160 90, 165 80 S 175 55, 195 40"
                    stroke="url(#weekGrad)"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="200"
                    strokeDashoffset={trendDash}
                />
                {/* Arrow head */}
                <AnimatedPath
                    d="M 189 42 L 197 38 L 193 47"
                    stroke="#a78bfa"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    opacity={badge}
                />

                {/* Badge */}
                <AnimatedRect x="150" y="25" width="45" height="18" rx="9" fill="rgba(34,197,94,0.2)" opacity={badge} />
                <AnimatedCircle cx="160" cy="34" r="3" fill="#22c55e" opacity={badge} />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { alignItems: "center", justifyContent: "center", height: 160, width: "100%" },
});

export default WeeklyReportGraphic;
