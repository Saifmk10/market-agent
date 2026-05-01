import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Pressable, Animated, Easing, Image } from 'react-native';
import colors from "D:\\PROJECTS\\The-Chat-App\\Assets\\colors.js";
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, doc, setDoc } from "@react-native-firebase/firestore";
import { useEffect, useRef, useState } from 'react';
import { LOGO_DEV_PUBLIC_KEY } from '@env';
import StockExpandedView from './stockExpandedView';

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
        flex: 1,
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


const Popupmessage = ({ message, buttonText1, buttonText2, visible, onClose, onStockAdded }: { message: any, buttonText1: any, buttonText2: any, visible: any, onClose: any, onStockAdded?: () => void }) => {

    const [searched, setSearched] = useState("");
    const [searchedStockName, setSearchedStockName] = useState("");
    const [searchedStockPrice, setSearchedStockPrice] = useState<number | null>(null);
    const [isSearched, setIsSearched] = useState(Boolean)
    const [isSearching, setIsSearching] = useState(false)
    const [dataAsArray, setDataAsArray] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState("most");
    const [offset, setOffset] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [addedStockName, setAddedStockName] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [expandedStockSymbol, setExpandedStockSymbol] = useState<string | null>(null);
    const [showExpandedView, setShowExpandedView] = useState(false);

    const handleAddStock = async (stock: any, displayName: string) => {
        await addStockToDb(stock);
        setAddedStockName(displayName);
        setTimeout(() => {
            setAddedStockName(null);
            onStockAdded?.();
            onClose();
        }, 1800);
    };

    const fetchSuggestions = async (query: string) => {
        if (query.trim().length < 2) {
            setSuggestions([]);
            return;
        }
        setIsFetchingSuggestions(true);
        try {
            const URL = `https://stock-api.saifmk.online/search/${encodeURIComponent(query)}`;
            const request = await fetch(URL);
            const data = await request.json();
            const results = data.fuzzyMatches?.map((match: any) => ({
                symbol: match.symbol,
                name: match.name,
                score: match.score,
            })) || [];
            // Include the resolved top result with price at the top
            if (data.resolvedTicker && data.stockName && data.stockPrice) {
                const topResult = {
                    symbol: data.resolvedTicker,
                    name: data.stockName,
                    price: data.stockPrice,
                    isResolved: true,
                };
                const filtered = results.filter((r: any) => r.symbol !== data.resolvedTicker);
                setSuggestions([topResult, ...filtered]);
            } else {
                setSuggestions(results);
            }
        } catch (error) {
            console.log("Suggestion fetch error:", error);
        } finally {
            setIsFetchingSuggestions(false);
        }
    };

    const handleSearchInput = (text: string) => {
        setSearched(text);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (text.trim().length < 2) {
            setSuggestions([]);
            setIsSearched(false);
            return;
        }
        setIsSearched(true);
        debounceRef.current = setTimeout(() => {
            fetchSuggestions(text);
        }, 400);
    };

    // --- Open expanded view instead of directly adding stock ---
    const handleSuggestionPress = (suggestion: any) => {
        setExpandedStockSymbol(suggestion.symbol);
        setShowExpandedView(true);
    };

    const searchedStock = async (searched: string) => {
        console.log("USER SEARCHED FOR :", searched)
        setIsSearching(true)
        setSuggestions([]);
        setSearchedStockName("")
        setSearchedStockPrice(null)
        try {
            const URL = `https://stock-api.saifmk.online/search/${encodeURIComponent(searched)}`
            const request = await fetch(URL)
            const data = await request.json()
            setSearchedStockName(data.stockName)
            setSearchedStockPrice(data.stockPrice)
            console.log("API DATA:", data.stockName, data.stockPrice);
        } catch (error) {
            console.log(error)
        } finally {
            setIsSearching(false)
        }
    }

    const mainStockApiFetching = async (currentOffset: number = 0) => {
        const URL_MOSTACTIVE = `https://stock-api.saifmk.online/mostActive?limit=20&offset=${currentOffset}`
        const URL_GAINER = `https://stock-api.saifmk.online/gainer?limit=20&offset=${currentOffset}`
        const URL_LOOSER = `https://stock-api.saifmk.online/looser?limit=20&offset=${currentOffset}`
        let URL = ""

        if (activeTab === "most") URL = URL_MOSTACTIVE
        else if (activeTab === "gainer") URL = URL_GAINER
        else URL = URL_LOOSER

        try {
            const response = await fetch(URL);
            const jsonResponse = await response.json();
            console.log(`PRINTING THE API RESPONSE JSON FROM addStockOptionButton.tsx :`, jsonResponse);
            return jsonResponse;
        } catch (error) {
            console.log(`ERROR in mainStockApiFetching(): ${error}`);
            return error
        }
    }

    const fetchData = async (showLoader: boolean = false, append: boolean = false, currentOffset: number = 0) => {
        if (showLoader) setDataAsArray([]);
        if (append) setIsLoadingMore(true);
        try {
            const data = await mainStockApiFetching(currentOffset);
            console.log("API RESPONSE RECEIVED IN fetchData():", data);
            const trending = data?.trending_stocks;
            if (Array.isArray(trending)) {
                if (append) {
                    setDataAsArray(prev => [...prev, ...trending]);
                } else {
                    setDataAsArray(trending);
                }
                console.log("STOCK LIST (Array):", trending);
            } else {
                console.warn("PROVIDED RESPONSE IS NOT AN ARRAY:", data);
            }
        } catch (error) {
            console.error("Error fetching:", error);
        } finally {
            if (append) setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        if (visible) {
            setOffset(0);
            fetchData(true, false, 0)
        }
    }, [visible, activeTab])

    return (
        <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
            <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}>
                <View style={modalStyle.mainParent}>
                    <Pressable onPress={(e) => e.stopPropagation()} style={modalStyle.parentContainer}>

                    <View style={modalStyle.innerContent}>
                        {/* Search input */}
                        <View>
                            <TextInput
                                placeholder="Search for Stock"
                                placeholderTextColor="#ffffff"
                                style={modalStyle.stockInputSearch}
                                value={searched}
                                onChangeText={handleSearchInput}
                                returnKeyType="search"
                                onSubmitEditing={() => { searchedStock(searched); setIsSearched(true); }}
                            />
                        </View>

                        {isSearched ? (
                            isSearching ? (
                                <BouncingDots />
                            ) : suggestions.length > 0 ? (
                                <ScrollView style={modalStyle.suggestionsScrollView} contentContainerStyle={modalStyle.suggestionsContainer}>
                                    {isFetchingSuggestions && <BouncingDots />}
                                    {suggestions.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={modalStyle.suggestionItem}
                                            onPress={() => handleSuggestionPress(item)}
                                        >
                                            <Image
                                                source={{ uri: `https://img.logo.dev/name/${item.name}?token=${LOGO_DEV_PUBLIC_KEY}` }}
                                                style={modalStyle.suggestionLogo}
                                            />
                                            <View style={modalStyle.suggestionInfo}>
                                                <Text style={modalStyle.suggestionName} numberOfLines={1}>{item.name}</Text>
                                                <Text style={modalStyle.suggestionSymbol}>{item.symbol}</Text>
                                            </View>
                                            {item.price && (
                                                <Text style={modalStyle.suggestionPrice}>₹{item.price}</Text>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            ) : searchedStockName ? (
                            <View style={modalStyle.searchedStockDesign}>
                                <TouchableOpacity style={modalStyle.stockNameAndPrice} onPress={() => { setExpandedStockSymbol(searchedStockName); setShowExpandedView(true); }}>
                                    <Text style={modalStyle.stockName}>{searchedStockName}: </Text>
                                    <Text style={modalStyle.stockPrice}>₹{searchedStockPrice}</Text>
                                </TouchableOpacity>
                            </View>
                            ) : null
                        ) : (
                            <View style={{ width: '100%', alignItems: 'center' }}>
                                {/* Tab buttons */}
                                <View style={modalStyle.stockTypeNavigationParent}>
                                    {["most", "gainer", "looser"].map((tab) => (
                                        <Pressable
                                            key={tab}
                                            onPress={() => setActiveTab(tab)}
                                            style={({ pressed }) => [
                                                modalStyle.stockTypeNavigationButtons,
                                                activeTab === tab && modalStyle.stockTypeNavigationButtonsClicked,
                                                pressed && { opacity: 0.7 },
                                            ]}
                                        >
                                            <Text style={{ fontFamily: "Jura-Bold", fontSize: 14, color: activeTab === tab ? "#fff" : "#000000" }}>
                                                {tab === "most" ? "Most Active" : tab === "gainer" ? "Gainers" : "Losers"}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>

                                {/* Bouncing dots while loading, stock list once ready */}
                                {dataAsArray.length === 0 ? (
                                    <BouncingDots />
                                ) : (
                                    <ScrollView style={modalStyle.scrollView} contentContainerStyle={modalStyle.stockListContainer}>
                                        {dataAsArray.map((stock, index) => (
                                            <View key={index}>
                                                <TouchableOpacity style={modalStyle.stockNameAndPrice} onPress={() => { setExpandedStockSymbol(stock.name); setShowExpandedView(true); }}>
                                                    <View>  
                                                        <Image source={{ uri: `https://img.logo.dev/name/${stock.name}?token=${LOGO_DEV_PUBLIC_KEY}` }} style={{ width: 30, height: 30 , borderRadius:10 }}/>
                                                        <Text style={modalStyle.stockName}>{stock.name}: </Text>
                                                    </View>
                                                    
                                                    <View style={modalStyle.stockPriceParent}>
                                                        <Text style={modalStyle.stockPrice}>₹{stock.price}</Text>
                                                        <Text style={[modalStyle.currentStockPrice, { color: Number(String(stock.current).replace(/[^\d.-]/g, "")) > 0 ? "green" : "red" }]}>
                                                            {stock.current}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                        <View style={{ width: '100%', alignItems: 'center', paddingVertical: 10 }}>
                                            {isLoadingMore ? (
                                                <BouncingDots />
                                            ) : (
                                                <TouchableOpacity
                                                    style={modalStyle.moreButton}
                                                    onPress={() => {
                                                        const newOffset = offset + 20;
                                                        setOffset(newOffset);
                                                        fetchData(false, true, newOffset);
                                                    }}
                                                >
                                                    <Text style={modalStyle.moreButtonText}>More</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </ScrollView>
                                )}
                            </View>
                        )}
                    </View>

                        {/* Close button */}
                        {/* <View style={modalStyle.buttonsPlacement}> */}
                            {/* <TouchableOpacity style={modalStyle.buttonDesign} onPress={onClose}> */}
                               {/* <Text style={modalStyle.buttonText}>More</Text> */}
                            {/* </TouchableOpacity> */}
                        {/* </View>  */}
                    </Pressable>
                </View>
            </Pressable>

            {/* Stock added confirmation toast */}
            {addedStockName ? (
                <View style={modalStyle.toastContainer} pointerEvents="none">
                    <Text style={modalStyle.toastText}>
                        <Text style={modalStyle.toastStockName}>{addedStockName}</Text>
                        {" has been added to your analysis list"}
                    </Text>
                </View>
            ) : null}

            {/* Stock Expanded View Modal */}
            <StockExpandedView
                visible={showExpandedView}
                onClose={() => setShowExpandedView(false)}
                stockSymbol={expandedStockSymbol || ''}
                onStockAdded={() => {
                    setShowExpandedView(false);
                    onStockAdded?.();
                    onClose();
                }}
            />
        </Modal>
    );
};


const modalStyle = StyleSheet.create({
    fontcolor: {
        color: colors.primary,
        fontFamily: "Jura-Bold",
        fontSize: 25,
        marginLeft: 10,
        marginRight: 10,
    },
    mainParent: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    parentContainer: {
        height: 660,
        width: 350,
        backgroundColor: colors.secondary,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: "#ffff",
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    innerContent: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        overflow: 'hidden',
    },
    scrollView: {
        width: '100%',
        maxHeight: 500,
    },
    moreButton: {
        backgroundColor: '#000000',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.primary,
        marginVertical: 8,
    },
    moreButtonText: {
        color: '#ffffff',
        fontFamily: 'Jura-Bold',
        fontSize: 14,
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
    buttonDesign: {
        backgroundColor: colors.gradient_secondary,
        height: 35,
        width: 90,
        borderRadius: 15,
        margin: 15,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.primary,
    },
    stockInputSearch: {
        margin: 20,
        backgroundColor: "#000000",
        width: 250,
        borderRadius: 20,
        color: "#ffff",
        alignItems: "center",
        paddingHorizontal: 15,
    },
    searchedStockDesign: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    suggestionsScrollView: {
        width: '100%',
        maxHeight: 480,
    },
    suggestionsContainer: {
        paddingHorizontal: 15,
        paddingBottom: 10,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000000',
        borderRadius: 15,
        padding: 12,
        marginVertical: 4,
    },
    suggestionLogo: {
        width: 36,
        height: 36,
        borderRadius: 10,
        marginRight: 12,
    },
    suggestionInfo: {
        flex: 1,
    },
    suggestionName: {
        color: '#ffffff',
        fontFamily: 'Jura-Bold',
        fontSize: 14,
    },
    suggestionSymbol: {
        color: '#aaaaaa',
        fontFamily: 'Jura-Bold',
        fontSize: 12,
        marginTop: 2,
    },
    suggestionPrice: {
        color: colors.primary,
        fontFamily: 'Jura-Bold',
        fontSize: 15,
        marginLeft: 8,
    },
    stockTypeNavigationParent: {
        justifyContent: "center",
        flexDirection: "row",
        gap: 20,
        margin: 10,
        padding: 10,
        borderRadius: 15,
    },
    stockTypeNavigationButtons: {
        borderBlockColor: "#000000",
        borderRadius: 15,
        borderWidth: 2,
        padding: 5,
    },
    stockTypeNavigationButtonsClicked: {
        borderBlockColor: "#000000",
        backgroundColor: "#000000",
        borderRadius: 15,
        borderWidth: 2,
        padding: 5,
    },
    stockListContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
    },
    stockNameAndPrice: {
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: 10,
        margin: 4,
        borderRadius: 20,
        width: 160,
        height: 160,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    stockName: {
        color: "#ffffff",
        padding: 0,
        marginTop: 5,
        fontSize: 13,
    },
    stockPriceParent: {
        display: "flex",
        flexDirection: "column",
    },
    stockPrice: {
        color: "#ffffff",
        padding: 2,
        fontSize: 15,
    },
    currentStockPrice: {
        fontWeight: '600',
        padding: 2,
        fontSize: 13,
    },
    buttonsPlacement: {
        display: "flex",
        flexDirection: "row",
    },
    buttonText: {
        color: colors.secondary,
        fontFamily: "Jura-Bold",
        fontSize: 15,
    },
});

export default Popupmessage;