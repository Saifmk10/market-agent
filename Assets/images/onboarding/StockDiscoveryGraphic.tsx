import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop, Line } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedPath = Animated.createAnimatedComponent(Path);

/**
 * Stock Discovery Graphic - Search + trending cards floating in
 */
const StockDiscoveryGraphic = () => {
    const searchDraw = useRef(new Animated.Value(0)).current;
    const card1 = useRef(new Animated.Value(0)).current;
    const card2 = useRef(new Animated.Value(0)).current;
    const card3 = useRef(new Animated.Value(0)).current;
    const glow = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(searchDraw, { toValue: 1, duration: 700, useNativeDriver: false }),
            Animated.stagger(180, [
                Animated.timing(card1, { toValue: 1, duration: 400, useNativeDriver: false }),
                Animated.timing(card2, { toValue: 1, duration: 400, useNativeDriver: false }),
                Animated.timing(card3, { toValue: 1, duration: 400, useNativeDriver: false }),
            ]),
        ]).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(glow, { toValue: 0.8, duration: 1500, useNativeDriver: false }),
                Animated.timing(glow, { toValue: 0.4, duration: 1500, useNativeDriver: false }),
            ])
        ).start();
    }, []);

    const searchDash = searchDraw.interpolate({ inputRange: [0, 1], outputRange: [120, 0] });

    return (
        <View style={styles.container}>
            <Svg width={220} height={140} viewBox="0 0 220 140">
                <Defs>
                    <LinearGradient id="discGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#5F48F5" stopOpacity="0.6" />
                        <Stop offset="100%" stopColor="#a78bfa" stopOpacity="1" />
                    </LinearGradient>
                </Defs>

                {/* Search icon */}
                <AnimatedCircle
                    cx="55" cy="55" r="20"
                    stroke="url(#discGrad)" strokeWidth="2.5" fill="none"
                    strokeDasharray="120" strokeDashoffset={searchDash}
                />
                <AnimatedPath
                    d="M 70 70 L 82 82"
                    stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round"
                    strokeDasharray="120" strokeDashoffset={searchDash}
                />

                {/* Cursor blink inside search */}
                <AnimatedRect x="48" y="48" width="2" height="14" fill="#ffffff" opacity={glow} />

                {/* Stock cards floating in */}
                <AnimatedRect x="110" y="25" width="90" height="24" rx="6" fill="rgba(95,72,245,0.12)" stroke="#5F48F5" strokeWidth="0.5" opacity={card1} />
                <AnimatedCircle cx="122" cy="37" r="5" fill="#22c55e" opacity={card1} />
                <AnimatedRect x="132" y="33" width="40" height="3" rx="1.5" fill="#444" opacity={card1} />
                <AnimatedRect x="132" y="39" width="25" height="2" rx="1" fill="#333" opacity={card1} />

                <AnimatedRect x="110" y="58" width="90" height="24" rx="6" fill="rgba(95,72,245,0.12)" stroke="#5F48F5" strokeWidth="0.5" opacity={card2} />
                <AnimatedCircle cx="122" cy="70" r="5" fill="#f59e0b" opacity={card2} />
                <AnimatedRect x="132" y="66" width="45" height="3" rx="1.5" fill="#444" opacity={card2} />
                <AnimatedRect x="132" y="72" width="30" height="2" rx="1" fill="#333" opacity={card2} />

                <AnimatedRect x="110" y="91" width="90" height="24" rx="6" fill="rgba(95,72,245,0.12)" stroke="#5F48F5" strokeWidth="0.5" opacity={card3} />
                <AnimatedCircle cx="122" cy="103" r="5" fill="#ef4444" opacity={card3} />
                <AnimatedRect x="132" y="99" width="38" height="3" rx="1.5" fill="#444" opacity={card3} />
                <AnimatedRect x="132" y="105" width="28" height="2" rx="1" fill="#333" opacity={card3} />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { alignItems: "center", justifyContent: "center", height: 160, width: "100%" },
});

export default StockDiscoveryGraphic;
