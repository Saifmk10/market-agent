import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop, Line } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedLine = Animated.createAnimatedComponent(Line);

/**
 * Username Graphic - Person avatar with name tag
 */
const SecureAuthGraphic = () => {
    const avatar = useRef(new Animated.Value(0)).current;
    const tag = useRef(new Animated.Value(0)).current;
    const cursor = useRef(new Animated.Value(0)).current;
    const particles = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(avatar, { toValue: 1, duration: 800, useNativeDriver: false }),
            Animated.timing(tag, { toValue: 1, duration: 600, useNativeDriver: false }),
            Animated.timing(particles, { toValue: 1, duration: 400, useNativeDriver: false }),
        ]).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(cursor, { toValue: 1, duration: 600, useNativeDriver: false }),
                Animated.timing(cursor, { toValue: 0, duration: 600, useNativeDriver: false }),
            ])
        ).start();
    }, []);

    const avatarScale = avatar.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });
    const tagSlide = tag.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });

    return (
        <View style={styles.container}>
            <Svg width={220} height={140} viewBox="0 0 220 140">
                <Defs>
                    <LinearGradient id="avatarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor="#a78bfa" stopOpacity="1" />
                        <Stop offset="100%" stopColor="#5F48F5" stopOpacity="0.9" />
                    </LinearGradient>
                    <LinearGradient id="tagGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#5F48F5" stopOpacity="0.15" />
                        <Stop offset="100%" stopColor="#a78bfa" stopOpacity="0.1" />
                    </LinearGradient>
                </Defs>

                {/* Avatar head */}
                <AnimatedCircle cx="110" cy="42" r="18" fill="url(#avatarGrad)" opacity={avatar} />

                {/* Avatar body/shoulders */}
                <AnimatedPath
                    d="M 82 90 C 82 74, 95 65, 110 65 C 125 65, 138 74, 138 90"
                    fill="url(#avatarGrad)"
                    opacity={avatar}
                />

                {/* Name tag background */}
                <AnimatedRect
                    x="65"
                    y="100"
                    width="90"
                    height="28"
                    rx="14"
                    fill="url(#tagGrad)"
                    stroke="#5F48F5"
                    strokeWidth="1.5"
                    opacity={tag}
                />

                {/* Text placeholder lines on tag */}
                <AnimatedLine
                    x1="80"
                    y1="114"
                    x2="120"
                    y2="114"
                    stroke="#a78bfa"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity={tag}
                />

                {/* Blinking cursor */}
                <AnimatedRect
                    x="123"
                    y="108"
                    width="2"
                    height="12"
                    rx="1"
                    fill="#5F48F5"
                    opacity={cursor}
                />

                {/* Decorative sparkles */}
                <AnimatedCircle cx="55" cy="35" r="2" fill="#5F48F5" opacity={particles} />
                <AnimatedCircle cx="165" cy="40" r="1.5" fill="#a78bfa" opacity={particles} />
                <AnimatedCircle cx="160" cy="100" r="2" fill="#7c3aed" opacity={particles} />
                <AnimatedCircle cx="58" cy="95" r="1.5" fill="#5F48F5" opacity={particles} />
                <AnimatedPath
                    d="M 50 60 L 52 56 L 54 60 L 50 58 L 54 58 Z"
                    fill="#a78bfa"
                    opacity={particles}
                />
                <AnimatedPath
                    d="M 168 72 L 170 68 L 172 72 L 168 70 L 172 70 Z"
                    fill="#7c3aed"
                    opacity={particles}
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { alignItems: "center", justifyContent: "center", height: 160, width: "100%" },
});

export default SecureAuthGraphic;
