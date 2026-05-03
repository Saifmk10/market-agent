import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop, Line } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Dashboard Graphic - Multi-chart command center
 */
const DashboardGraphic = () => {
    const frame = useRef(new Animated.Value(0)).current;
    const chart1 = useRef(new Animated.Value(0)).current;
    const chart2 = useRef(new Animated.Value(0)).current;
    const indicator = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(frame, { toValue: 1, duration: 600, useNativeDriver: false }),
            Animated.parallel([
                Animated.timing(chart1, { toValue: 1, duration: 800, useNativeDriver: false }),
                Animated.timing(chart2, { toValue: 1, duration: 800, useNativeDriver: false }),
            ]),
            Animated.timing(indicator, { toValue: 1, duration: 400, useNativeDriver: false }),
        ]).start();
    }, []);

    const chartDash = chart1.interpolate({ inputRange: [0, 1], outputRange: [200, 0] });

    return (
        <View style={styles.container}>
            <Svg width={220} height={140} viewBox="0 0 220 140">
                <Defs>
                    <LinearGradient id="dashGrad1" x1="0%" y1="100%" x2="0%" y2="0%">
                        <Stop offset="0%" stopColor="#5F48F5" stopOpacity="0.2" />
                        <Stop offset="100%" stopColor="#5F48F5" stopOpacity="0.8" />
                    </LinearGradient>
                    <LinearGradient id="dashGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#22c55e" stopOpacity="0.6" />
                        <Stop offset="100%" stopColor="#22c55e" stopOpacity="1" />
                    </LinearGradient>
                </Defs>

                {/* Dashboard frame */}
                <AnimatedRect x="15" y="15" width="190" height="110" rx="12" stroke="#222" strokeWidth="1" fill="rgba(20,20,30,0.5)" opacity={frame} />

                {/* Header tabs */}
                <AnimatedRect x="25" y="22" width="35" height="10" rx="3" fill="#5F48F5" opacity={frame} />
                <AnimatedRect x="65" y="22" width="30" height="10" rx="3" fill="#222" opacity={frame} />
                <AnimatedRect x="100" y="22" width="25" height="10" rx="3" fill="#222" opacity={frame} />

                {/* Area chart (left panel) */}
                <AnimatedPath
                    d="M 25 100 L 25 80 C 35 75, 45 65, 55 70 S 70 85, 80 60 S 95 50, 110 55 L 110 100 Z"
                    fill="url(#dashGrad1)"
                    opacity={chart1}
                />
                <AnimatedPath
                    d="M 25 80 C 35 75, 45 65, 55 70 S 70 85, 80 60 S 95 50, 110 55"
                    stroke="#5F48F5"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="200"
                    strokeDashoffset={chartDash}
                />

                {/* Bar chart (right panel) */}
                <AnimatedRect x="125" y="85" width="10" height="20" rx="2" fill="url(#dashGrad1)" opacity={chart2} />
                <AnimatedRect x="140" y="70" width="10" height="35" rx="2" fill="url(#dashGrad1)" opacity={chart2} />
                <AnimatedRect x="155" y="60" width="10" height="45" rx="2" fill="url(#dashGrad1)" opacity={chart2} />
                <AnimatedRect x="170" y="50" width="10" height="55" rx="2" fill="url(#dashGrad1)" opacity={chart2} />
                <AnimatedRect x="185" y="65" width="10" height="40" rx="2" fill="url(#dashGrad1)" opacity={chart2} />

                {/* Status indicators */}
                <AnimatedCircle cx="130" cy="42" r="4" fill="#22c55e" opacity={indicator} />
                <AnimatedRect x="138" y="39" width="30" height="3" rx="1.5" fill="#333" opacity={indicator} />
                <AnimatedCircle cx="180" cy="42" r="4" fill="#f59e0b" opacity={indicator} />
                <AnimatedRect x="188" y="39" width="15" height="3" rx="1.5" fill="#333" opacity={indicator} />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { alignItems: "center", justifyContent: "center", height: 160, width: "100%" },
});

export default DashboardGraphic;
