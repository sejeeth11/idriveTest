import React, { Component } from "react";
import {
    View,
    ScrollView,
    FlatList,
    Animated,
    TouchableOpacity,RefreshControl
} from "react-native";
import { BaseStyle, BaseColor,constants } from "@config";
import {
    Header,
    SafeAreaView,
    Icon,
    Text,
    StarRating,
    Button,
   Image,RateDetail,CommentItem
} from "@components";
import * as Utils from "@utils";
import { InteractionManager } from "react-native";
import styles from "./styles";
import Network from './../../network/network'
import DateFormatter from './../../dateformatter/index'

// Load sample data

export default class MovieDetails extends Component {
    constructor(props) {
        super(props);

        // Temp data define
        this.state = {
            heightHeader: Utils.heightHeader(),
            itemState:'',
            movie_details:'',
            reviews:'',
            credits:'',
            similar:''
        };
        this._deltaY = new Animated.Value(0);
    }

    componentDidMount() {
       
        const{navigation} = this.props;
        const item = navigation.getParam('ItemObject')
        this.setState({itemState:item},()=>{
        },()=>{})
           Network.executeAxios(item.id+'?',"GETSLASH","api_key="+constants.api_key+'&'+"language=en-US",movie_details => {
                this.setState({movie_details:movie_details})
                Network.executeAxios(item.id+'/reviews'+'?',"GETSLASH","api_key="+constants.api_key+'&'+"language=en-US",movie_details_reveiw => {
                    this.setState({reviews:movie_details_reveiw.results})
                    console.log('Review =>'+JSON.stringify(movie_details_reveiw.results))
                    Network.executeAxios(item.id+'/credits'+'?',"GETSLASH","api_key="+constants.api_key+'&'+"language=en-US",movie_details_credits => {
                        this.setState({movie_details:movie_details_credits})
                        Network.executeAxios(item.id+'/similar'+'?',"GETSLASH","api_key="+constants.api_key+'&'+"language=en-US",movie_details_similar => {
                            this.setState({similar:movie_details_similar.results})
                        })
                   
                    })
                })
            })
    }

    render() {
        const { navigation } = this.props;
        const {
            itemState,
            heightHeader,movie_details,similar,reviews
        } = this.state;
        const heightImageBanner = Utils.scaleWithPixel(250, 1);
        const marginTopBanner = heightImageBanner - heightHeader - 40;

        return (
            <View style={{ flex: 1 }}>
                <Animated.Image
                    useNativeDriver={true}
                    source={{uri:constants.baseImageURL+itemState.poster_path}}
                    style={[
                        styles.imgBanner,
                        {
                            height: this._deltaY.interpolate({
                                inputRange: [
                                    0,
                                    Utils.scaleWithPixel(200),
                                    Utils.scaleWithPixel(200)
                                ],
                                outputRange: [
                                    heightImageBanner,
                                    heightHeader,
                                    heightHeader
                                ]
                            })
                        }
                    ]}
                />
                <SafeAreaView
                    style={BaseStyle.safeAreaView}
                    forceInset={{ top: "always" }}
                >
                    {/* Header */}
                    <Header
                        title=""
                        renderLeft={() => {
                            return (
                                <Icon
                                    name="arrow-left"
                                    size={20}
                                    color={BaseColor.whiteColor}
                                />
                            );
                        }}
                        renderRight={() => {
                            return (
                                <Icon
                                    name="images"
                                    size={20}
                                    color={BaseColor.whiteColor}
                                />
                            );
                        }}
                        onPressLeft={() => {
                            navigation.goBack();
                        }}
                        onPressRight={() => {
                            navigation.navigate("PreviewImage");
                        }}
                    />
                    <ScrollView
                        onScroll={Animated.event([
                            {
                                nativeEvent: {
                                    contentOffset: { y: this._deltaY }
                                }
                            }
                        ])}
                        onContentSizeChange={() =>
                            this.setState({
                                heightHeader: Utils.heightHeader()
                            })
                        }
                        scrollEventThrottle={8}
                    >
                        {/* Main Container */}
                        <View style={{ paddingHorizontal: 20 }}>
                            {/* Information */}
                            <View
                                style={[
                                    styles.contentBoxTop,
                                    { marginTop: marginTopBanner }
                                ]}
                            >
                                <Text
                                    title2
                                    semibold
                                    style={{ marginBottom: 7 }}
                                >
                                    {itemState.original_title}
                                </Text>
                                <StarRating
                                    disabled={true}
                                    starSize={14}
                                    maxStars={5}
                                    rating={itemState.vote_average/2}
                                    selectedStar={rating => {}}
                                    fullStarColor={BaseColor.yellowColor}
                                />
                                 <Text
                                    title2
                                    semibold
                                    style={{ marginBottom: 7 }}
                                >
                                    {movie_details.status}
                                </Text>
                           </View>
                            {/* Description */}
                            <View style={styles.blockView}>
                                <Text headline semibold>
                                    Overview
                                </Text>
                                <Text body2 style={{ marginTop: 5 }}>
                                    {itemState.overview}
                                </Text>
                            </View>
                            <FlatList
                                style={{ padding: 20 }}
                                refreshControl={
                                    <RefreshControl
                                        colors={[BaseColor.primaryColor]}
                                        tintColor={BaseColor.primaryColor}
                                        refreshing={this.state.refreshing}
                                        onRefresh={() => { }}
                                    />
                                }
                                data={reviews}
                                keyExtractor={(item, index) => item.id}
                                ListHeaderComponent={() => (
                                    <RateDetail
                                        point={3}
                                        maxPoint={10}
                                        totalRating={100}
                                        //data={rateDetail.data}
                                    />
                                )}
                                renderItem={({ item }) => (
                                    <CommentItem
                                        style={{ marginTop: 10 }}
                                        image={{uri:'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'}}
                                        name={item.author}
                                        rate={3}
                                        date={'10 june 2020'}
                                        title={item.title}
                                        comment={item.content}
                                    />
                                )}
                            />
                            <Text
                                headline
                                semibold
                                style={{
                                    marginHorizontal: 0,
                                    marginTop: 20,
                                    marginBottom: 10
                                }}
                            >
                        Similar Movies
                    </Text>
                    <FlatList
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={similar}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                    style={[styles.contain, {}]}
                                    //onPress={onPress}
                                    activeOpacity={0.9}
                                >
                                    <Text
                                        headline
                                        primaryColor
                                        semibold
                                        style={{ marginBottom: 10 }}
                                    >
                                        {item.original_title}
                                    </Text>
                                    <Image source = {{uri:constants.baseImageURL+item.backdrop_path}} style={{ width: 215, height: 100 }} />
                                    <Text
                                        title3
                                        semibold
                                        style={{
                                            marginTop: 8,
                                            fontSize:10
                                        }}
                                        //numberOfLines={1}
                                    >
                                        {item.overview}
                                    </Text>
                                    <Text
                                        body2
                                        style={{
                                            marginTop: 8
                                        }}
                                        numberOfLines={5}
                                    >
                                        {'Release date'}{' '}{'Release '}{' '}{DateFormatter.formatDateToStandardForm(item.release_date,'YYYY-MM-DD','DD MMM YY')}
                                    </Text>
                                </TouchableOpacity>
                        )}
                    />
                            </View>
                    </ScrollView>
                    {/* Pricing & Booking Process */}
                    <View style={styles.contentButtonBottom}>
                        <View>
                            <Text caption1 semibold>
                                
                            </Text>
                            <Text title3 primaryColor semibold>
                                
                            </Text>
                            <Text caption1 semibold style={{ marginTop: 5 }}>
                               
                            </Text>
                        </View>
                        <Button
                            style={{ height: 46 }}
                            onPress={() =>
                                navigation.navigate("PreviewBooking")
                            }
                        >
                            Book Now
                        </Button>
                    </View>
                </SafeAreaView>
            </View>
        );
    }
}
