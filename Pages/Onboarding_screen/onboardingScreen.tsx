import React, { useRef, useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    TouchableOpacity,
    StatusBar,
    PanResponder,
    ScrollView,
    TextInput,
    Keyboard,
    Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LiveWatchlistGraphic from "../../Assets/images/onboarding/LiveWatchlistGraphic";
import AIAnalysisGraphic from "../../Assets/images/onboarding/AIAnalysisGraphic";
import WeeklyReportGraphic from "../../Assets/images/onboarding/WeeklyReportGraphic";
import StockDiscoveryGraphic from "../../Assets/images/onboarding/StockDiscoveryGraphic";
import DashboardGraphic from "../../Assets/images/onboarding/DashboardGraphic";
import SecureAuthGraphic from "../../Assets/images/onboarding/SecureAuthGraphic";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 60;
const CARD_MARGIN = 8;
const ONBOARDING_KEY = "@onboarding_completed";

interface OnboardingScreenProps {
    onComplete: () => void;
}

const features = [
    {
        id: 1,
        title: "Live Market Pulse",
        description: "Institutional-grade price feeds refreshing every 3 seconds. Your curated watchlist with real-time tickers, live indicators, and brand logos.",
        outcome: "Stay ahead of every move — zero delay, zero noise.",
        Graphic: LiveWatchlistGraphic,
        accent: "#5F48F5",
    },
    {
        id: 2,
        title: "AI-Driven Intraday Intel",
        description: "Proprietary AI scans OHLC candles in real time — detecting VWAP holds, buyer dominance, momentum shifts, and breakout setups before they happen.",
        outcome: "Hedge-fund-level analysis, delivered straight to your screen.",
        Graphic: AIAnalysisGraphic,
        accent: "#7c3aed",
    },
    {
        id: 3,
        title: "Weekly Intelligence Briefs",
        description: "Volatility compression ratios, volume conviction scores, liquidity absorption rates, and directional sentiment — compiled into a single actionable report.",
        outcome: "One report. Full clarity on the week ahead.",
        Graphic: WeeklyReportGraphic,
        accent: "#a78bfa",
    },
    {
        id: 4,
        title: "Intelligent Discovery",
        description: "Surface top movers, hidden gainers, and high-volume opportunities. Fuzzy search with instant AI-ranked suggestions.",
        outcome: "Discover alpha in seconds — not hours.",
        Graphic: StockDiscoveryGraphic,
        accent: "#5F48F5",
    },
    {
        id: 5,
        title: "Command Center",
        description: "Multi-timeframe charts, date-selectable deep dives, cross-stock comparisons — all in a unified analytics suite built for precision.",
        outcome: "Your entire portfolio thesis — one powerful view.",
        Graphic: DashboardGraphic,
        accent: "#7c3aed",
    },
    {
        id: 6,
        title: "What should we call you?",
        description: "Pick a name that feels like you. This is how you'll appear across the app.",
        outcome: "",
        Graphic: SecureAuthGraphic,
        accent: "#a78bfa",
        isUsernameCard: true,
    },
];

const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [username, setUsername] = useState("");
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scrollRef = useRef<ScrollView>(null);
    const inputShift = useRef(new Animated.Value(0)).current;
    const bgFade = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            delay: 100,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

        const showSub = Keyboard.addListener(showEvent, (e) => {
            Animated.parallel([
                Animated.timing(inputShift, {
                    toValue: -(e.endCoordinates.height),
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(bgFade, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        });
        const hideSub = Keyboard.addListener(hideEvent, () => {
            Animated.parallel([
                Animated.timing(inputShift, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(bgFade, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const handleSkip = () => completeOnboarding();

    const completeOnboarding = async () => {
        try {
            await AsyncStorage.setItem(ONBOARDING_KEY, "true");
        } catch (e) {}
        onComplete();
    };

    const handleScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / (CARD_WIDTH + CARD_MARGIN * 2));
        setCurrentIndex(index);
    };

    const isLastCard = currentIndex === features.length - 1;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
                <View>
                    <Text style={styles.headerTitle}>What we offer</Text>
                    <Text style={styles.headerSubtitle}>Swipe to explore features</Text>
                </View>
                {!isLastCard && (
                    <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                        <Text style={styles.skipText}>Skip  {">"}</Text>
                    </TouchableOpacity>
                )}
            </Animated.View>

            {/* Cards ScrollView */}
            <Animated.View style={[styles.cardsSection, { opacity: fadeAnim }]}>
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    pagingEnabled={false}
                    snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
                    decelerationRate="fast"
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    onMomentumScrollEnd={handleScroll}
                >
                    {features.map((feature, index) => {
                        const Graphic = feature.Graphic;
                        return (
                            <View key={feature.id} style={styles.card}>
                                {/* Graphic area */}
                                <Animated.View style={[
                                    styles.cardGraphicArea,
                                    { borderBottomColor: feature.accent },
                                    (feature as any).isUsernameCard && { opacity: bgFade },
                                ]}>
                                    <Graphic />
                                </Animated.View>

                                {/* Content area */}
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>{feature.title}</Text>
                                    <Text style={styles.cardDescription}>{feature.description}</Text>

                                    {(feature as any).isUsernameCard ? (
                                        <Animated.View style={[styles.usernameInputContainer, { transform: [{ translateY: inputShift }] }]}>
                                            <TextInput
                                                style={styles.usernameInput}
                                                placeholder="Enter your name"
                                                placeholderTextColor="rgba(255,255,255,0.25)"
                                                value={username}
                                                onChangeText={setUsername}
                                                autoCapitalize="words"
                                                autoCorrect={false}
                                            />
                                        </Animated.View>
                                    ) : (
                                        <View style={styles.outcomeBox}>
                                            <View style={[styles.outcomeDot, { backgroundColor: feature.accent }]} />
                                            <Text style={styles.outcomeText}>{feature.outcome}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
            </Animated.View>

            {/* Dots */}
            <View style={styles.dotsContainer}>
                {features.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            index === currentIndex && styles.dotActive,
                        ]}
                    />
                ))}
            </View>

            {/* Bottom button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={isLastCard ? completeOnboarding : () => {
                        const nextIndex = currentIndex + 1;
                        scrollRef.current?.scrollTo({
                            x: nextIndex * (CARD_WIDTH + CARD_MARGIN * 2),
                            animated: true,
                        });
                        setCurrentIndex(nextIndex);
                    }}
                    activeOpacity={0.7}
                >
                    <Text style={styles.continueButtonText}>
                        {isLastCard ? "Get Started" : "Continue"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 55,
        paddingBottom: 12,
    },
    headerTitle: {
        color: "#ffffff",
        fontFamily: "Jura-Bold",
        fontSize: 24,
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        color: "rgba(255,255,255,0.4)",
        fontFamily: "Jura-Bold",
        fontSize: 13,
        marginTop: 4,
    },
    skipButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    skipText: {
        color: "rgba(255,255,255,0.5)",
        fontFamily: "Jura-Bold",
        fontSize: 14,
    },
    cardsSection: {
        flex: 1,
        justifyContent: "center",
    },
    scrollContent: {
        paddingHorizontal: 22,
        alignItems: "center",
    },
    card: {
        width: CARD_WIDTH,
        height: 420,
        marginHorizontal: CARD_MARGIN,
        backgroundColor: "#0d0d14",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(95,72,245,0.12)",
        overflow: "hidden",
    },
    cardGraphicArea: {
        height: 140,
        backgroundColor: "#080810",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(95,72,245,0.1)",
        alignItems: "center",
        justifyContent: "center",
    },
    cardContent: {
        flex: 1,
        padding: 18,
        paddingBottom: 14,
    },
    cardTitle: {
        color: "#ffffff",
        fontFamily: "Jura-Bold",
        fontSize: 22,
        letterSpacing: 0.3,
        marginBottom: 10,
    },
    cardDescription: {
        color: "rgba(255,255,255,0.55)",
        fontFamily: "Jura-Bold",
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 16,
    },
    outcomeBox: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "rgba(95,72,245,0.06)",
        borderRadius: 10,
        padding: 12,
        marginTop: "auto",
    },
    outcomeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginTop: 5,
        marginRight: 10,
    },
    outcomeText: {
        flex: 1,
        color: "rgba(255,255,255,0.7)",
        fontFamily: "Jura-Bold",
        fontSize: 12,
        lineHeight: 18,
    },
    usernameInputContainer: {
        marginTop: "auto",
    },
    usernameInput: {
        borderWidth: 1,
        borderColor: "rgba(95,72,245,0.3)",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: "#ffffff",
        fontFamily: "Jura-Bold",
        fontSize: 16,
        backgroundColor: "rgba(95,72,245,0.06)",
    },
    dotsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "rgba(255,255,255,0.15)",
        marginHorizontal: 4,
    },
    dotActive: {
        width: 18,
        backgroundColor: "#5F48F5",
    },
    buttonContainer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    continueButton: {
        width: "100%",
        paddingVertical: 16,
        borderRadius: 14,
        backgroundColor: "#5F48F5",
        alignItems: "center",
    },
    continueButtonText: {
        color: "#ffffff",
        fontFamily: "Jura-Bold",
        fontSize: 16,
        letterSpacing: 0.5,
    },
});

export { ONBOARDING_KEY };
export default OnboardingScreen;
