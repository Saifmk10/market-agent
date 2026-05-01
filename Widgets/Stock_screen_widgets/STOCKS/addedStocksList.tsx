import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Modal, Image } from "react-native";
import DeleteLogo from "../../../Assets/images/agents/stockAgent/deleteLogo";
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, doc, addDoc, setDoc, getDocs, deleteDoc } from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { LOGO_DEV_PUBLIC_KEY } from '@env';

import Popupmessage from "./addedStockDetailsPopUp";
import { assets } from "../../../react-native.config";

const AddedStocksList = ({ refreshKey }: { refreshKey?: number }) => {

    const fireBaseUser = getAuth();
    const db = getFirestore()
    const loggedinUser = fireBaseUser.currentUser?.uid;

    const [stocks, setStocks] = useState<{ stockName: string; stockPrice: string; StockTicker: string; addedDate: string; }[]>([]) // this is used to render the stock details in this widget itself , the bellow ones render it in th pop up
    const [emptyStock, setEmptyStock] = useState(Boolean)
    const [isLoading, setIsLoading] = useState(true)

    const [visbilityStat, setVisbilityStat] = useState(false); //  setting the visisbility value for the pop up that shows stock details
    const [stockNamePopUp, setStockName] = useState<string>(); // used to give the addedStockPopUp.tsx the access to the data so that it can render the stock details
    const [stockPricePopUp, setStockPrice] = useState<string>(); //  used to give the addedStockPopUp.tsx the access to the data so that it can render the stock details
    const [stockAddedDatePopUp, setStockAddedDate] = useState<string>(); //  used to give the addedStockPopUp.tsx the access to the data so that it can render the stock details

    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [stockToDelete, setStockToDelete] = useState<string | null>(null);
    const [stockNameToDelete, setStockNameToDelete] = useState<string | null>(null);
    const [deletedToast, setDeletedToast] = useState(false);
    const [deleteInfoVisible, setDeleteInfoVisible] = useState(false);


    // function to fetch the added stocks from the database and also set the empty stock state to show the message when there is no stock in the list
    const fetchingAddedStock = async () => {
        setIsLoading(true)
        // checking if the user has been logged in so the user will access only his account details
        if (loggedinUser) {
            try {
                const refCollectionn = collection(db, "Users", loggedinUser!, "Agents", "Finance", "Stock_Added")
                const snapshot = await getDocs(refCollectionn)

                const fetchedData = snapshot.docs.map((doc: any) => doc.data()) // fetching the data , the this data is added to the bellow state for rendering
                setStocks(fetchedData)

                if (fetchedData.length === 0) {
                    setEmptyStock(false)
                    console.log("THIS IS EMPTY" , emptyStock)
                }
                else {
                    setEmptyStock(true)
                    console.log("FETCHED DATA OF STOCKS FROM addedStockList.tsx", fetchedData , emptyStock)
                }

            }
            catch (error) {
                console.log("FETCHED DATA OF STOCKS FROM addedStockList.tsx error", error)
            }
            finally {
                setIsLoading(false)
            }
        } else {
            setIsLoading(false)
        }
    }


    // function to delete the stock from the added stock list when the user clicks on the delete button in the pop up
    const deleteAddedStock = async (DelItem: string) => {
        if (loggedinUser) {
            try {

                // this will perform the the deletion and also the error handling 
                try {
                    await deleteDoc(doc(db, "Users", loggedinUser!, "Agents", "Finance", "Stock_Added", DelItem))
                    console.log(`USER HAS REMOVED ${DelItem} FROM STOCK ANALYSIS`)
                }
                catch (error) {
                    console.log("ERROR IN DELETION STOCK ERROR :", error)
                }

            }
            catch (error) {
                console.log("FETCHED DATA OF STOCKS FROM addedStockList.tsx error", error)
            }
        }
    }

    const test = (name: string, price: string) => {
        console.log("CLICKED AND RETURNED FROM addedStockList.tsx:", name)
        console.log("CLICKED AND RETURNED FROM addedStockList.tsx:", price)
    }



    // all the stock details will be rendered as soon as the user clicks in the stocks section
    useEffect(() => {
        fetchingAddedStock()
    }, [refreshKey])

    // used to refresh the stock list when user deletes a stock from the list
    const refreshOnDel = async () => {
        await fetchingAddedStock()
    }

    const confirmAndDelete = async () => {
        if (!stockToDelete) return;
        setConfirmDeleteVisible(false);
        await deleteAddedStock(stockToDelete);
        await refreshOnDel();
        setStockToDelete(null);
        setDeletedToast(true);
        setTimeout(() => setDeletedToast(false), 2000);
    };






    return (

        <View style={{ position: 'relative' }}>

            {/* header row */}
            <View style={style.headingStyle}>
                <Text style={style.text}>Stocks Added For Analysis</Text>
                {/* <Text style={style.text}>Price</Text>
                <Text style={style.text}>Date</Text> */}
            </View>

            {/* scrollable list with proper layout */}
            <ScrollView
            >
                <View>
                    
                    {/* loading */}
                    {isLoading && (
                        <View style={style.loaderParent}>
                            <ActivityIndicator size="large" color="#5F48F5" />
                            <Text style={style.loaderText}>Loading your added stocks...</Text>
                        </View>
                    )}


                    {/* if user has not added any stocks */}
                    {!isLoading && !emptyStock ?

                        (
                            <View style={style.emptyStockMessage}>
                                <Text style={style.emptyStockMessageText}>No stocks have been added for analysis. Please add stocks to begin receiving regular market updates.</Text>
                                <Text style={style.emptyStockMessageTextLearnMore}>Learn More</Text>
                            </View>
                        ) : 
                        
                    // rendering the added stocks with the details in a proper layout and also with the delete button for each stock
                        (   
                            !isLoading && stocks.map((items, index) => (
                                <TouchableOpacity key={index} style={style.mainContainerParent} onPress={() => { setVisbilityStat(true); setStockName(items.stockName); setStockPrice(items.stockPrice); setStockAddedDate(items.addedDate); test(items.stockName, items.stockPrice); console.log("CLICKED FROM addedStocksList.tsx:", items) }}>
                                    <View style={style.stockDetailsParentStyle}>
                                        <Image
                                            source={{ uri: `https://img.logo.dev/name/${items.stockName}?token=${LOGO_DEV_PUBLIC_KEY}` }}
                                            style={style.stockLogo}
                                        />
                                        <View style={style.stockInfoColumn}>
                                            <Text style={style.stockName} numberOfLines={1}>{items.stockName}</Text>
                                            <Text style={style.stockTicker}>{items.StockTicker}</Text>
                                        </View>
                                        <View style={style.stockPriceColumn}>
                                            <Text style={style.stockPrice}>{"₹"}{items.stockPrice}</Text>
                                            <Text style={style.stockAddDate}>{items.addedDate.split(",")[0]}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={style.deleteButtonStyle} onPress={() => { setStockToDelete(items.StockTicker); setStockNameToDelete(items.stockName); setDeleteInfoVisible(false); setConfirmDeleteVisible(true); }}>
                                        <DeleteLogo />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            ))
                        )

                    }

                </View>
            </ScrollView>

            {/* stock details when clicked from added list */}
            <Modal visible={visbilityStat}  animationType="fade" transparent statusBarTranslucent>
                <View style={style.confirmOverlay}>
                    <View style={style.confirmBox}>
                        <Text style={style.confirmTitle}>{stockNamePopUp}</Text>
                        <Text style={style.confirmMessage}>
                            The Stock{" "} 
                            <Text style={style.confirmStockName}>{stockNamePopUp}</Text>
                            {" "}was added on <Text style={style.confirmStockName}>{stockAddedDatePopUp?.split(",")[0]}</Text> to your analysis list.
                            At a price of <Text style={style.confirmStockName}>{"₹"}{stockPricePopUp}</Text>. 
                            {"\n"} Refer to the Updates section for regular updates on this stock's performance and insights.
                        </Text>
                        <View style={style.confirmButtons}>
                            <TouchableOpacity style={style.cancelButton} onPress={() => { setVisbilityStat(false); }}>
                                <Text style={style.cancelButtonText}>OK</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={style.continueButton} onPress={confirmAndDelete}>
                                <Text style={style.continueButtonText}>Continue</Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </View>
            </Modal>


            {/* Delete confirmation modal */}
            <Modal visible={confirmDeleteVisible} animationType="fade" transparent statusBarTranslucent>
                <View style={style.confirmOverlay}>
                    <View style={style.confirmBox}>

                        {/* i button — top right corner */}
                        <TouchableOpacity style={style.infoButton} onPress={() => setDeleteInfoVisible(v => !v)}>
                            <Text style={style.infoButtonText}>i</Text>
                        </TouchableOpacity>

                        <Text style={style.confirmTitle}>Delete Stock</Text>

                        {/* Warning content shown when i is pressed */}
                        {deleteInfoVisible && (
                            <View style={style.infoWarningBox}>
                                <Text style={style.infoWarningText}>
                                    Deleting this stock will remove it permanently from your analysis list. All scheduled updates and insights for this stock will also stop. This action cannot be undone.
                                </Text>
                            </View>
                        )}

                        <Text style={style.confirmMessage}>
                            Are you sure you want to delete{" "}
                            <Text style={style.confirmStockName}>{stockNameToDelete}</Text>
                            {" "}from your analysis list?
                        </Text>
                        <View style={style.confirmButtons}>
                            <TouchableOpacity style={style.cancelButton} onPress={() => { setConfirmDeleteVisible(false); setStockToDelete(null); setDeleteInfoVisible(false); }}>
                                <Text style={style.cancelButtonText}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={style.continueButton} onPress={confirmAndDelete}>
                                <Text style={style.continueButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Deleted toast */}
            {deletedToast ? (
                <View style={style.toastContainer} pointerEvents="none">
                    <Text style={style.toastText}>Stock has been deleted</Text>
                </View>
            ) : null}


        </View>
    );


}


const style = StyleSheet.create({
    text: {
        color: "#ffff",
        fontFamily: "Jura-Bold",
        fontSize: 15
    },
    headingStyle: {
        display: "flex",
        flexDirection: "row",
        // gap: 50 ,
        // paddingRight: 40, 
        // marginLeft : 10
        alignItems: "center",
        justifyContent: "center"
    },

    // style section for the stock price name and date container
    mainContainerParent: {
        marginTop: 12,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    stockDetailsParentStyle: {
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        flexDirection: "row",
        flex: 1,
        padding: 14,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.15)",
        alignItems: "center",
    },

    stockLogo: {
        width: 40,
        height: 40,
        borderRadius: 12,
        marginRight: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },

    stockInfoColumn: {
        flex: 1,
        justifyContent: 'center',
    },

    stockPriceColumn: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },

    emptyStockMessage:{
        backgroundColor : "#D9D9D9",
        marginTop : 20,
        padding : 20,
        borderRadius : 20,
        
    },
    emptyStockMessageText:{
        color : "#000000",
        
    },
    emptyStockMessageTextLearnMore :{
        marginTop : 5,
        color : "#000000",
        textDecorationLine : "underline"
    },

    loaderParent: {
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },

    loaderText: {
        color: "#D9D9D9",
        fontFamily: "Jura-Bold",
        fontSize: 13,
    },

    stockName: {
        fontFamily: "Jura-Bold",
        fontSize: 14,
        color: "#ffffff",
    },

    stockTicker: {
        fontFamily: "Jura-Bold",
        fontSize: 11,
        color: "#aaaaaa",
        marginTop: 3,
    },

    stockPrice: {
        fontFamily: "Jura-Bold",
        fontSize: 15,
        color: "#ffffff",
    },

    stockAddDate: {
        fontFamily: "Jura-Bold",
        fontSize: 11,
        color: "#aaaaaa",
        marginTop: 3,
    },

    deleteButtonStyle: {
        backgroundColor: "#f40b0bff",
        padding: 8,
        marginLeft: 8,
        borderRadius: 12,
    },

    confirmOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    confirmBox: {
        width: 300,
        backgroundColor: '#1a1a2e',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#5F48F5',
        padding: 24,
        alignItems: 'center',
    },
    confirmTitle: {
        color: '#ffffff',
        fontFamily: 'Jura-Bold',
        fontSize: 18,
        marginBottom: 12,
    },
    confirmMessage: {
        color: '#D9D9D9',
        fontFamily: 'Jura-Bold',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    confirmStockName: {
        color: '#f54848',
        fontFamily: 'Jura-Bold',
    },
    confirmButtons: {
        flexDirection: 'row',
        gap: 16,
    },
    cancelButton: {
        backgroundColor: '#D9D9D9',
        paddingVertical: 10,
        paddingHorizontal: 28,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#5F48F5',
    },
    cancelButtonText: {
        color: '#000000',
        fontFamily: 'Jura-Bold',
        fontSize: 14,
    },
    continueButton: {
        backgroundColor: '#f40b0bff',
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#5F48F5',
    },
    continueButtonText: {
        color: '#ffffff',
        fontFamily: 'Jura-Bold',
        fontSize: 14,
    },
    toastContainer: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: '#1a1a2e',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#f40b0bff',
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    toastText: {
        color: '#ffffff',
        fontFamily: 'Jura-Bold',
        fontSize: 14,
    },
    infoButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#5F48F5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ffffff',
        zIndex: 10,
    },
    infoButtonText: {
        color: '#ffffff',
        fontFamily: 'Jura-Bold',
        fontSize: 13,
        lineHeight: 16,
    },
    infoWarningBox: {
        backgroundColor: '#2a1a1a',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f54848',
        padding: 12,
        marginBottom: 12,
        width: '100%',
    },
    infoWarningText: {
        color: '#f5a0a0',
        fontFamily: 'Jura-Bold',
        fontSize: 12,
        lineHeight: 20,
        textAlign: 'center',
    },

})


export default AddedStocksList;