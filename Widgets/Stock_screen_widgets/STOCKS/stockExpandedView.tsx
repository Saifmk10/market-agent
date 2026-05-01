import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Pressable, Animated, Easing, Image } from 'react-native';
import colors from "D:\\PROJECTS\\The-Chat-App\\Assets\\colors.js";
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, doc, setDoc } from "@react-native-firebase/firestore";
import { useEffect, useRef, useState } from 'react';
import { LOGO_DEV_PUBLIC_KEY } from '@env';


// --- Add Stock To DB (same logic as popupToSelectStock) ---
const addStockToDb = async (pressed: any) => {
    const fireBaseUser = getAuth();
    const db = getFirestore()
    const loggedinUser = fireBaseUser.currentUser?.uid;
    const stockName = pressed.ticker
    console.log(pressed.ticker)
    console.log(pressed.name)
    console.log(pressed.price)

    if (loggedinUser) {
        try {
            await setDoc(
                doc(db, "Users", loggedinUser!, "Agents", "Finance", "Stock_Added", pressed.ticker),
                {
                    stockName: pressed.name,
                    StockTicker: pressed.ticker,
                    stockPrice: pressed.price,
                    addedDate: new Date().toLocaleString()
                }
            );
        } catch (error) {
            console.warn(error)
        }
    }
}


// --- 3 Bouncing Dots ---
const BouncingDots = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const bounce = (dot: Animated.Value, delay: number) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, { toValue: -10, duration: 300, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
                    Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true, easing: Easing.in(Easing.quad) }),
                    Animated.delay(600 - delay),
                ])
            ).start();

        bounce(dot1, 0);
        bounce(dot2, 150);
        bounce(dot3, 300);
    }, []);

    return (
        <View style={dotsStyle.wrapper}>
            {[dot1, dot2, dot3].map((dot, i) => (
                <Animated.View
                    key={i}
                    style={[dotsStyle.dot, { transform: [{ translateY: dot }] }]}
                />
            ))}
        </View>
    );
};

const dotsStyle = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 60,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.primary,
    },
});


// --- Stock Expanded View ---
const StockExpandedView = ({ visible, onClose, stockSymbol, onStockAdded }: { visible: boolean, onClose: () => void, stockSymbol: string, onStockAdded?: () => void }) => {

    const [stockData, setStockData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [addedStockName, setAddedStockName] = useState<string | null>(null);

    // --- Fetch stock details from search API ---
    const fetchStockDetails = async (symbol: string) => {
        console.log("FETCHING STOCK DETAILS FOR:", symbol)
        setIsLoading(true)
        try {
            const URL = `https://stock-api.saifmk.online/search/${encodeURIComponent(symbol)}`
            const request = await fetch(URL)
            const data = await request.json()
            console.log("STOCK DETAILS RECEIVED:", data)
            setStockData(data)
        } catch (error) {
            console.log("Error fetching stock details:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (visible && stockSymbol) {
            fetchStockDetails(stockSymbol)
        }
    }, [visible, stockSymbol])

    // --- Add Stock Handler (same logic as popupToSelectStock) ---
    const handleAddStock = async () => {
        if (!stockData) return;
        const stockToAdd = {
            ticker: stockData.resolvedTicker,
            name: stockData.stockName,
            price: stockData.stockPrice,
        };
        await addStockToDb(stockToAdd);
        setAddedStockName(stockData.stockName);
        setTimeout(() => {
            setAddedStockName(null);
            onStockAdded?.();
            onClose();
        }, 1800);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
            <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}>
                <Pressable onPress={onClose} style={expandedStyle.dismissArea} />
                <View style={expandedStyle.parentContainer}>

                        {/* Close button at top */}
                        <TouchableOpacity style={expandedStyle.closeButton} onPress={onClose}>
                            <Text style={expandedStyle.closeButtonText}>✕</Text>
                        </TouchableOpacity>

                        {isLoading ? (
                            <BouncingDots />
                        ) : stockData ? (
                            <ScrollView style={expandedStyle.scrollView} contentContainerStyle={expandedStyle.scrollContent} showsVerticalScrollIndicator={false} nestedScrollEnabled={true} overScrollMode="never" removeClippedSubviews={true}>

                                {/* Stock Header - Logo, Name, Ticker */}
                                <View style={expandedStyle.stockHeader}>
                                    <Image
                                        source={{ uri: `https://img.logo.dev/name/${stockData.stockName}?token=${LOGO_DEV_PUBLIC_KEY}` }}
                                        style={expandedStyle.stockLogo}
                                    />
                                    <View style={expandedStyle.stockHeaderInfo}>
                                        <Text style={expandedStyle.stockName}>{stockData.stockName}</Text>
                                        <Text style={expandedStyle.stockTicker}>{stockData.resolvedTicker}</Text>
                                    </View>
                                </View>

                                {/* Current Price */}
                                <View style={expandedStyle.priceSection}>
                                    <Text style={expandedStyle.currentPrice}>₹{stockData.stockPrice}</Text>
                                    {stockData.price && (
                                        <Text style={[expandedStyle.priceChange, { color: stockData.price.currentPrice >= stockData.price.previousClose ? "green" : "red" }]}>
                                            {stockData.price.currentPrice >= stockData.price.previousClose ? "▲" : "▼"} {Math.abs(stockData.price.currentPrice - stockData.price.previousClose).toFixed(2)} ({((Math.abs(stockData.price.currentPrice - stockData.price.previousClose) / stockData.price.previousClose) * 100).toFixed(2)}%)
                                        </Text>
                                    )}
                                </View>

                                {/* Company Info */}
                                {stockData.company && (
                                    <View style={expandedStyle.detailsCard}>
                                        <Text style={expandedStyle.sectionTitle}>Company Info</Text>
                                        <View style={expandedStyle.detailRow}>
                                            <Text style={expandedStyle.detailLabel}>Sector</Text>
                                            <Text style={expandedStyle.detailValue}>{stockData.company.sector}</Text>
                                        </View>
                                        <View style={expandedStyle.detailRow}>
                                            <Text style={expandedStyle.detailLabel}>Industry</Text>
                                            <Text style={expandedStyle.detailValue}>{stockData.company.industry}</Text>
                                        </View>
                                        <View style={expandedStyle.detailRow}>
                                            <Text style={expandedStyle.detailLabel}>Employees</Text>
                                            <Text style={expandedStyle.detailValue}>{stockData.company.fullTimeEmployees?.toLocaleString()}</Text>
                                        </View>
                                    </View>
                                )}

                                {/* Price Details */}
                                {stockData.price && (
                                    <View style={expandedStyle.detailsCard}>
                                        <Text style={expandedStyle.sectionTitle}>Price Details</Text>
                                        <View style={expandedStyle.detailRow}>
                                            <Text style={expandedStyle.detailLabel}>Open</Text>
                                            <Text style={expandedStyle.detailValue}>₹{stockData.price.open}</Text>
                                        </View>
                                        <View style={expandedStyle.detailRow}>
                                            <Text style={expandedStyle.detailLabel}>Day High</Text>
                                            <Text style={expandedStyle.detailValue}>₹{stockData.price.dayHigh}</Text>
                                        </View>
                                        <View style={expandedStyle.detailRow}>
                                            <Text style={expandedStyle.detailLabel}>Day Low</Text>
                                            <Text style={expandedStyle.detailValue}>₹{stockData.price.dayLow}</Text>
                                        </View>
                                        <View style={expandedStyle.detailRow}>
                                            <Text style={expandedStyle.detailLabel}>Previous Close</Text>
                                            <Text style={expandedStyle.detailValue}>₹{stockData.price.previousClose}</Text>
                                        </View>
                                        <View style={expandedStyle.detailRow}>
                                            <Text style={expandedStyle.detailLabel}>Exchange</Text>
                                            <Text style={expandedStyle.detailValue}>{stockData.price.exchange}</Text>
                                        </View>
                                    </View>
                                )}

                                {/* Market Stats */}
                                {stockData.marketStats && (
                                    <View style={expandedStyle.detailsCard}>
                                        <Text style={expandedStyle.sectionTitle}>Market Stats</Text>
                                        <View style={expandedStyle.detailRow}>
                                            <Text style={expandedStyle.detailLabel}>Market Cap</Text>
                                            <Text style={expandedStyle.detailValue}>₹{(stockData.marketStats.marketCap / 10000000).toFixed(2)} Cr</Text>
                                        </View>
                                        <View style={expandedStyle.detailRow}>
                                            <Text style={expandedStyle.detailLabel}>52W High</Text>
                                            <Text style={expandedStyle.detailValue}>₹{stockData.marketStats.fiftyTwoWeekHigh}</Text>
                                        </View>
                                        <View style={expandedStyle.detailRow}>
                                            <Text style={expandedStyle.detailLabel}>52W Low</Text>
                                            <Text style={expandedStyle.detailValue}>₹{stockData.marketStats.fiftyTwoWeekLow}</Text>
                                        </View>
                                        <View style={expandedStyle.detailRow}>
                                            <Text style={expandedStyle.detailLabel}>50 Day Avg</Text>
                                            <Text style={expandedStyle.detailValue}>₹{stockData.marketStats.fiftyDayAverage?.toFixed(2)}</Text>
                                        </View>
                                        <View style={expandedStyle.detailRow}>
                                            <Text style={expandedStyle.detailLabel}>200 Day Avg</Text>
                                            <Text style={expandedStyle.detailValue}>₹{stockData.marketStats.twoHundredDayAverage?.toFixed(2)}</Text>
                                        </View>
                                    </View>
                                )}

                                {/* Volume */}
                                {stockData.volume && (
                                    <View style={expandedStyle.detailsCard}>
                                        <Text style={expandedStyle.sectionTitle}>Volume</Text>
                                        <View style={expandedStyle.detailRow}>
                                            <Text style={expandedStyle.detailLabel}>Volume</Text>
                                            <Text style={expandedStyle.detailValue}>{stockData.volume.volume?.toLocaleString()}</Text>
                                        </View>
                                        <View style={expandedStyle.detailRow}>
                                            <Text style={expandedStyle.detailLabel}>Avg Volume</Text>
                                            <Text style={expandedStyle.detailValue}>{stockData.volume.averageVolume?.toLocaleString()}</Text>
                                        </View>
                                    </View>
                                )}

                                {/* Valuation */}
                                {stockData.valuation && (
                                    <View style={expandedStyle.detailsCard}>
                                        <Text style={expandedStyle.sectionTitle}>Valuation</Text>
                                        <View style={expandedStyle.detailRow}>
                                            <Text style={expandedStyle.detailLabel}>P/E (Trailing)</Text>
                                            <Text style={expandedStyle.detailValue}>{stockData.valuation.trailingPE?.toFixed(2)}</Text>
                                        </View>
                                        <View style={expandedStyle.detailRow}>
                                            <Text style={expandedStyle.detailLabel}>P/E (Forward)</Text>
                                            <Text style={expandedStyle.detailValue}>{stockData.valuation.forwardPE?.toFixed(2)}</Text>
                                        </View>
                                        <View style={expandedStyle.detailRow}>
                                            <Text style={expandedStyle.detailLabel}>Price/Book</Text>
                                            <Text style={expandedStyle.detailValue}>{stockData.valuation.priceToBook?.toFixed(2)}</Text>
                                        </View>
                                        <View style={expandedStyle.detailRow}>
                                            <Text style={expandedStyle.detailLabel}>EPS (Trailing)</Text>
                                            <Text style={expandedStyle.detailValue}>₹{stockData.valuation.epsTrailing}</Text>
                                        </View>
                                    </View>
                                )}

                                {/* Analyst Rating */}
                                {stockData.analystRating && (
                                    <View style={expandedStyle.detailsCard}>
                                        <Text style={expandedStyle.sectionTitle}>Analyst Rating</Text>
                                        <View style={expandedStyle.detailRow}>
                                            <Text style={expandedStyle.detailLabel}>Target Mean</Text>
                                            <Text style={expandedStyle.detailValue}>₹{stockData.analystRating.targetMeanPrice}</Text>
                                        </View>
                                        <View style={expandedStyle.detailRow}>
                                            <Text style={expandedStyle.detailLabel}>Target High</Text>
                                            <Text style={expandedStyle.detailValue}>₹{stockData.analystRating.targetHighPrice}</Text>
                                        </View>
                                        <View style={expandedStyle.detailRow}>
                                            <Text style={expandedStyle.detailLabel}>Target Low</Text>
                                            <Text style={expandedStyle.detailValue}>₹{stockData.analystRating.targetLowPrice}</Text>
                                        </View>
                                        <View style={expandedStyle.detailRow}>
                                            <Text style={expandedStyle.detailLabel}>Analysts</Text>
                                            <Text style={expandedStyle.detailValue}>{stockData.analystRating.numberOfAnalystOpinions}</Text>
                                        </View>
                                    </View>
                                )}

                                {/* Bottom spacing for Add button */}
                                <View style={{ height: 80 }} />
                            </ScrollView>
                        ) : (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#ffffff', fontFamily: 'Jura-Bold' }}>Failed to load stock details</Text>
                            </View>
                        )}

                        {/* Add Stock Button at bottom */}
                        {stockData && !isLoading && (
                            <View style={expandedStyle.addButtonContainer}>
                                <TouchableOpacity style={expandedStyle.addStockButton} onPress={handleAddStock}>
                                    <Text style={expandedStyle.addStockButtonText}>Add Stock</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                    </View>

                {/* Stock added confirmation toast */}
                {addedStockName ? (
                    <View style={expandedStyle.toastContainer} pointerEvents="none">
                        <Text style={expandedStyle.toastText}>
                            <Text style={expandedStyle.toastStockName}>{addedStockName}</Text>
                            {" has been added to your analysis list"}
                        </Text>
                    </View>
                ) : null}
            </View>
        </Modal>
    );
};


const expandedStyle = StyleSheet.create({
    dismissArea: {
        height: '15%',
    },
    mainParent: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    parentContainer: {
        height: '85%',
        width: '100%',
        backgroundColor: colors.secondary,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderWidth: 2,
        borderColor: "#ffff",
        overflow: 'hidden',
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 20,
        zIndex: 10,
        backgroundColor: '#000000',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontFamily: 'Jura-Bold',
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        padding: 20,
        paddingTop: 50,
    },
    stockHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    stockLogo: {
        width: 50,
        height: 50,
        borderRadius: 15,
        marginRight: 15,
    },
    stockHeaderInfo: {
        flex: 1,
    },
    stockName: {
        color: '#000000',
        fontFamily: 'Jura-Bold',
        fontSize: 18,
    },
    stockTicker: {
        color: '#555555',
        fontFamily: 'Jura-Bold',
        fontSize: 14,
        marginTop: 3,
    },
    priceSection: {
        marginBottom: 20,
        paddingHorizontal: 5,
    },
    currentPrice: {
        color: '#000000',
        fontFamily: 'Jura-Bold',
        fontSize: 32,
    },
    priceChange: {
        fontFamily: 'Jura-Bold',
        fontSize: 15,
        marginTop: 5,
    },
    detailsCard: {
        backgroundColor: '#000000',
        borderRadius: 20,
        padding: 15,
        marginBottom: 15,
    },
    sectionTitle: {
        color: colors.gradient_secondary,
        fontFamily: 'Jura-Bold',
        fontSize: 16,
        marginBottom: 10,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: 0.5,
        borderBottomColor: '#333333',
    },
    detailLabel: {
        color: '#aaaaaa',
        fontFamily: 'Jura-Bold',
        fontSize: 13,
    },
    detailValue: {
        color: '#ffffff',
        fontFamily: 'Jura-Bold',
        fontSize: 13,
    },
    addButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15,
        backgroundColor: colors.secondary,
        borderTopWidth: 1,
        borderTopColor: '#cccccc',
        alignItems: 'center',
    },
    addStockButton: {
        backgroundColor: '#000000',
        paddingVertical: 14,
        paddingHorizontal: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: colors.gradient_secondary,
    },
    addStockButtonText: {
        color: '#ffffff',
        fontFamily: 'Jura-Bold',
        fontSize: 16,
    },
    toastContainer: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        backgroundColor: '#378b2e',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    toastText: {
        color: '#ffffff',
        fontFamily: 'Jura-Bold',
        fontSize: 14,
        textAlign: 'center',
    },
    toastStockName: {
        color: '#ffffff',
        fontFamily: 'Jura-Bold',
        fontSize: 14,
        textTransform: 'capitalize',
    },
});

export default StockExpandedView;
