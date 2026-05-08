// UserSelectedStockDisplay is a widget that displays the stocks added by the user to their watchlist. this is shown in the main screen. It fetches the stock metadata (name and ticker) from Firestore, then retrieves the current price for each stock from an external API. The component updates the stock prices every 3 seconds to provide real-time information. It also handles caching of stock metadata and prices using AsyncStorage to improve performance and provide offline access. The UI includes a heading, an info button with a modal popup explaining the widget, and horizontally scrollable cards for each stock showing its logo, name, ticker, price, and a live indicator.

import React, { useEffect, useState } from 'react';
import { StyleSheet, View , Text, ScrollView, TouchableOpacity, Modal} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';

import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, doc, addDoc, setDoc, getDocs, deleteDoc } from "@react-native-firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOGO_DEV_PUBLIC_KEY } from '@env';
import  { AreaChart, BarChart, LineChart, PieChart , RadarChart , ChartShowcase ,GaugeChart , HorizontalBarChart}  from '../../../Assets/graphs';
import StockExpandedView from '../../Stock_screen_widgets/STOCKS/stockExpandedView';

const stockApiEndpoint = "https://stock-api.saifmk.online/stock/{stockname}"
const STOCKS_CACHE_KEY = 'stocks_metadata_cache';
const STOCKS_PRICES_CACHE_KEY = 'stocks_prices_cache';

    

const UserSelectedStockDisplay = () => {

    const [stockDetails, setStockDetails] = useState<{ stockName: string; stockPrice: string; StockTicker: string; }[]>([])
    const [stocks, setStocks] = useState<{ stockName: string; stockPrice: string; StockTicker: string; addedDate: string; }[]>([])
    const [emptyStock, setEmptyStock] = useState(Boolean)
    const [isLoading, setIsLoading] = useState(true)

    const [visbilityStat, setVisbilityStat] = useState(false);
    const [stockNamePopUp, setStockName] = useState<string>();
    const [stockPricePopUp, setStockPrice] = useState<string>();
    const [stockAddedDatePopUp, setStockAddedDate] = useState<string>();

    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [stockToDelete, setStockToDelete] = useState<string | null>(null);
    const [stockNameToDelete, setStockNameToDelete] = useState<string | null>(null);
    const [deletedToast, setDeletedToast] = useState(false);
    const [deleteInfoVisible, setDeleteInfoVisible] = useState(false);
    const [infoVisible, setInfoVisible] = useState(false);
    const [expandedVisible, setExpandedVisible] = useState(false);
    const [selectedStockTicker, setSelectedStockTicker] = useState<string>('');


    const fireBaseUser = getAuth();
    const db = getFirestore()
    const loggedinUser = fireBaseUser.currentUser?.uid;


    const data = [
    { name: 'Monday', value: 400 },
    { name: 'Tuesday', value: 300 },
    ];



    const loadMetadata = async (): Promise<{ stockName: string; StockTicker: string }[]> => {
        try {
            if (!loggedinUser) return [];
            const refCollectionn = collection(db, "Users", loggedinUser, "Agents", "Finance", "Stock_Added");
            const snapshot = await getDocs(refCollectionn);
            const fetchedData = snapshot.docs.map((doc: any) => doc.data());
            setStocks(fetchedData);
            if (fetchedData.length === 0) {
                setEmptyStock(true);
                await AsyncStorage.removeItem(STOCKS_CACHE_KEY);
                return [];
            }
            setEmptyStock(false);
            const metadata = fetchedData.map((s: any) => ({ stockName: s.stockName, StockTicker: s.StockTicker }));
            await AsyncStorage.setItem(STOCKS_CACHE_KEY, JSON.stringify(metadata));
            console.log("STOCKS METADATA FETCHED AND CACHED", metadata);
            return metadata;
        } catch (error) {
            console.log("ERROR LOADING METADATA", error);
            // Fall back to cache on network error
            const cached = await AsyncStorage.getItem(STOCKS_CACHE_KEY);
            return cached ? JSON.parse(cached) : [];
        }
    };

    const fetchPrices = async (metadata: { stockName: string; StockTicker: string }[]) => {
        try {
            const updated = await Promise.all(
                metadata.map(async (stock) => {
                    const res = await fetch(`https://stock-api.saifmk.online/search/${stock.StockTicker+".NS"}`);
                    const data = await res.json();
                    console.log(`PRICE FETCHED FOR ${stock.StockTicker}:`, data.stockPrice);
                    return { stockName: stock.stockName, StockTicker: stock.StockTicker, stockPrice: data.stockPrice };
                })
            );
            setStockDetails(updated);
            await AsyncStorage.setItem(STOCKS_PRICES_CACHE_KEY, JSON.stringify(updated));
        } catch (error) {
            console.log("ERROR FETCHING PRICES", error);
        }
    };

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        let isMounted = true;

        const init = async () => {
            // Load cached prices immediately so UI renders without delay
            const cachedPrices = await AsyncStorage.getItem(STOCKS_PRICES_CACHE_KEY);
            if (isMounted) {
                if (cachedPrices) {
                    setStockDetails(JSON.parse(cachedPrices));
                }
                setIsLoading(false);
            }

            // Fetch fresh metadata and start price polling in background
            const metadata = await loadMetadata();
            if (isMounted && metadata.length > 0) {
                await fetchPrices(metadata);
                // Set interval only if component is still mounted
                interval = setInterval(() => {
                    if (isMounted) {
                        fetchPrices(metadata);
                    }
                }, 3000);
            }
        };

        init();

        // Cleanup function: runs when component unmounts
        return () => {
            isMounted = false; // Stop any pending async operations
            if (interval) {
                clearInterval(interval); // Clear the interval
            }
        };
    }, []);
        
    return (

        <SafeAreaView >

            {/* heading for widget */}
            <View style={styles.headingRow}>
                <Text style={styles.headingStyle}>YOUR STOCKS</Text>
                <TouchableOpacity onPress={() => setInfoVisible(true)} style={styles.infoButton}>
                    <Text style={styles.infoButtonText}>i</Text>
                </TouchableOpacity>
            </View>


            {/* learn more popup */}
            <Modal transparent animationType="fade" visible={infoVisible} onRequestClose={() => setInfoVisible(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setInfoVisible(false)}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>YOUR STOCKS</Text>
                        <Text style={styles.modalBody}>Displays stocks you have added to your watchlist. This view provides realtime stock updates. Addition or deletion of a stock from the list may take a few seconds to reflect.</Text>
                        <TouchableOpacity onPress={() => setInfoVisible(false)}>
                            <Text style={styles.modalClose}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>


            {/* cards for the stock details user has addded */}
            <ScrollView style={styles.youStockContainerParent} horizontal={true} showsHorizontalScrollIndicator={false}>
                {isLoading ? (
                    <Text style={styles.loadingText}>Loading...</Text>
                ) : emptyStock ? (
                    <Text style={styles.emptyText}>No stocks added yet</Text>
                ) : (
                    stockDetails.map((stock, index) => (
                        <TouchableOpacity style={styles.container} key={index} activeOpacity={0.7} onPress={() => { setSelectedStockTicker(stock.StockTicker + '.NS'); setExpandedVisible(true); }}>
                            {/* Logo + Ticker */}
                            <View style={styles.cardTopRow}>
                                <Image
                                    source={{ uri: `https://img.logo.dev/ticker/${stock.StockTicker + ".NS"}?token=${LOGO_DEV_PUBLIC_KEY}` }}
                                    style={styles.cardLogo}
                                />
                                <View style={styles.tickerBadge}>
                                    <Text style={styles.tickerBadgeText}>{stock.StockTicker}</Text>
                                </View>
                            </View>

                            {/* Stock Name */}
                            <Text style={styles.cardStockName} numberOfLines={1}>
                                {stock.stockName}
                            </Text>

                            {/* Price */}
                            <Text style={styles.cardPrice}>₹{stock.stockPrice}</Text>

                            {/* Live indicator */}
                            <View style={styles.cardLiveRow}>
                                <View style={styles.liveDot} />
                                <Text style={styles.liveText}>LIVE</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>


            <ScrollView>
                {/* <GaugeChart value={100} maxValue={100} title="Gauge Chart" subtitle="Performance metric" colorScheme="forest" /> */}
                {/* <HorizontalBarChart data={data} title="Bar Chart - Horizontal" colorScheme="ocean" /> */}
                {/* <AreaChart/> */}
            </ScrollView>

            {/* Stock Expanded View Popup */}
            <StockExpandedView
                visible={expandedVisible}
                onClose={() => setExpandedVisible(false)}
                stockSymbol={selectedStockTicker}
            />

            
            
        </SafeAreaView>

      
    )
}



const styles = StyleSheet.create({

    headingStyle: {
        fontSize: 18,
        fontFamily: "Jura-Bold",
        color: "#D9D9D9",
        margin:10,
    },

    headingRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    infoButton: {
        width: 15,
        height: 15,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: "#50468e",
        alignItems: "center",
        justifyContent: "center",
        // marginLeft: 5,
    },

    infoButtonText: {
        color: "#50468e",
        fontSize: 11,
        fontFamily: "Jura-Bold",
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalBox: {
        backgroundColor: "#0f0f0f",
        borderWidth: 1,
        borderColor: "#50468e",
        borderRadius: 12,
        padding: 20,
        width: "80%",
    },

    modalTitle: {
        color: "#D9D9D9",
        fontFamily: "Jura-Bold",
        fontSize: 16,
        marginBottom: 10,
    },

    modalBody: {
        color: "#aaaaaa",
        fontFamily: "Jura-Bold",
        fontSize: 13,
        lineHeight: 20,
        marginBottom: 16,
    },

    modalClose: {
        color: "#50468e",
        fontFamily: "Jura-Bold",
        fontSize: 14,
        textAlign: "right",
    },

    youStockContainerParent: {
        display: "flex",
        flexDirection: "row",
    
    },
    container: {
        backgroundColor: "#111",
        width: 165,
        margin: 8,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#1e1e1e",
        padding: 14,
        justifyContent: "space-between",
    },

    cardTopRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    cardLogo: {
        width: 38,
        height: 38,
        borderRadius: 12,
    },

    tickerBadge: {
        backgroundColor: "#1a1a2e",
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },

    tickerBadgeText: {
        color: "#5F48F5",
        fontFamily: "Jura-Bold",
        fontSize: 10,
        letterSpacing: 1,
    },

    cardStockName: {
        color: "#D9D9D9",
        fontFamily: "Jura-Bold",
        fontSize: 14,
        marginBottom: 6,
    },

    cardPrice: {
        color: "#D9D9D9",
        fontFamily: "Jura-Bold",
        fontSize: 22,
        marginBottom: 10,
    },

    cardLiveRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },

    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#43fb00",
    },

    liveText: {
        color: "#43fb00",
        fontFamily: "Jura-Bold",
        fontSize: 9,
        letterSpacing: 1.5,
        opacity: 0.8,
    },
    
    loadingText: {
        color: "#D9D9D9",
        fontFamily: "Jura-Bold",
        fontSize: 16,
        margin: 10,
    },
    
    emptyText: {
        color: "#D9D9D9",
        fontFamily: "Jura-Bold",
        fontSize: 16,
        margin: 10,
    }
    
})


export default UserSelectedStockDisplay; 