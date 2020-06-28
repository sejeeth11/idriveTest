import React, { Component } from "react";
import { FlatList, RefreshControl, View, Animated ,TextInput,TouchableOpacity} from "react-native";
import { BaseStyle, BaseColor,constants } from "@config";
import { Header, SafeAreaView, Icon,FilterSort,Text,Image,StarRating,Button } from "@components";
import styles from "./styles";
import * as Utils from "@utils";
import Network from './../../network/network'
import BookCardPlaceholder from './../../components/placeholder/index';
import Highlighter from 'react-native-highlight-words';
import DateFormatter from './../../dateformatter/index'
// Load sample data

export default class MoveList extends Component {
    constructor(props) {
        super(props);
        const scrollAnim = new Animated.Value(0);
        const offsetAnim = new Animated.Value(0);

        // Temp data define
        this.state = {
            enableSearch:false,
            refreshing: false,
            loading: false,
            scrollAnim,
            offsetAnim,
            clampedScroll: Animated.diffClamp(
                Animated.add(
                    scrollAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                        extrapolateLeft: "clamp"
                    }),
                    offsetAnim
                ),
                0,
                40
            ),
            modeView: "list",
            moviesAssistantStorage:[],
            movies: [],
            isDataFetched:false,
            text:''
                
                
        };
        this.arrayholder = [];

        this.onChangeView = this.onChangeView.bind(this);
        this.onFilter = this.onFilter.bind(this);
        this.onChangeSort = this.onChangeSort.bind(this);
    }

    componentDidMount(){
        Network.executeAxios("now_playing","GET","api_key="+constants.api_key+'&'+"language=en-US"+"page=1",now_playing_movies => {
           this.setState({isDataFetched:true},()=>{
                if(now_playing_movies && now_playing_movies.results && now_playing_movies.results.length>0){
                    this.setState({movies:now_playing_movies.results})
                    this.arrayholder = now_playing_movies.results;
                }else{
                    this.setState({movies:[]})
                }
           })
        })
    }
   
    onChangeSort() {}

    /**
     * @description Open modal when filterring mode is applied
     * @author Passion UI <passionui.com>
     * @date 2019-08-03
     */
    onFilter() {
        const { navigation } = this.props;
        navigation.navigate("Filter");
    }

    /**
     * @description Open modal when view mode is pressed
     * @author Passion UI <passionui.com>
     * @date 2019-08-03
     */
    onChangeView() {
        let { modeView } = this.state;
        Utils.enableExperimental();
        switch (modeView) {
            
            default:
                this.setState({
                    modeView: "list"
                });
                break;
        }
    }

    highLightWord = (word, highlight) => {
        const match = _.words(word, RegExp(highlight)); // "Aku"
        const notMatch = _.replace(word, match, ""); // "rana"
        return (
          <View style={{ flexDirection: "row" }}>
            <Text style={{ backgroundColor: "yellow" }}>{match}</Text>
            <Text>{notMatch}</Text>
          </View>
        );
      };

    /**
     * @description Render container view
     * @author Sejeeth S
     * @date 2019-08-03
     * @returns
     */
    renderContent() {
        const { modeView, movies, refreshing, clampedScroll } = this.state;
        const { navigation } = this.props;
        const navbarTranslate = clampedScroll.interpolate({
            inputRange: [0, 40],
            outputRange: [0, -40],
            extrapolate: "clamp"
        });
        switch (modeView) {
            
            case "list":
                return (
                    <View style={{ flex: 1 }}>
                        <Animated.FlatList
                            contentInset={{ top: 50 }}
                            refreshControl={
                                <RefreshControl
                                    colors={[BaseColor.primaryColor]}
                                    tintColor={BaseColor.primaryColor}
                                    refreshing={refreshing}
                                    onRefresh={() => {}}
                                />
                            }
                            scrollEventThrottle={1}
                            onScroll={Animated.event(
                                [
                                    {
                                        nativeEvent: {
                                            contentOffset: {
                                                y: this.state.scrollAnim
                                            }
                                        }
                                    }
                                ],
                                { useNativeDriver: true }
                            )}
                            data={movies}
                            key={"list"}
                            keyExtractor={(item, index) => item.id}
                            renderItem={({ item, index }) => (
                                <View style={[styles.listContent,{}]}>
                                        <TouchableOpacity onPress={() => {
                                            console.log('Navigation')
                                            navigation.navigate('MovieDetails',{
                                              ItemObject:item
                                            })
                                        }}
                                         activeOpacity={0.9}>
                                            <Image source={{uri:constants.baseImageURL+item.poster_path}} style={styles.listImage} />
                                        </TouchableOpacity>
                                        <View style={styles.listContentRight}>
                                            <Highlighter
                                                    highlightStyle={{fontWeight: 'bold',color:'#000',fontSize:18}}
                                                    searchWords={[this.state.text]}
                                                    textToHighlight={item.original_title}
                                                />
                                            <View style={styles.listContentRow}>
                                                <Text
                                                    caption1
                                                    grayColor
                                                    style={{
                                                        marginLeft: 3
                                                    }}
                                                    numberOfLines={5}
                                                >
                                                    {item.overview}
                                                </Text> 
                                              
                                         </View>
                                         <View style={styles.listContentRow}>
                                                <StarRating
                                                    disabled={true}
                                                    starSize={10}
                                                    maxStars={5}
                                                    rating={item.vote_average/2}
                                                    selectedStar={rating => { }}
                                                    fullStarColor={BaseColor.yellowColor}
                                                />
                                                
                                            </View>
                                            <Text caption1 primaryColor semibold>
                                                {'Release '}{' '}{DateFormatter.formatDateToStandardForm(item.release_date,'YYYY-MM-DD','DD MMM YY')}
                                                </Text>
                                                <Button
                                                    style={{ height: 46,width:'80%',alignSelf:'center',marginTop:10,marginBottom:10}}
                                                    onPress={() =>
                                                        navigation.navigate('MovieDetails',{
                                                            ItemObject:item
                                                          })
                                                    }
                                                >
                                                 Book Now
                                                </Button>
                                        </View>
                                    </View>
                            )}
                        />
                        <Animated.View
                            style={[
                                styles.navbar,
                                {
                                    transform: [{ translateY: navbarTranslate }]
                                }
                            ]}
                        >
                            <FilterSort
                                modeView={modeView}
                                onChangeSort={this.onChangeSort}
                                onChangeView={this.onChangeView}
                                onFilter={this.onFilter}
                            />
                        </Animated.View>
                    </View>
                );
            default:
                return (
                    null
                );
        }
    }
    SearchFilterFunction(text) {
        const newData = this.arrayholder.filter(function(item) {
          const itemData = item.original_title ? item.original_title.toUpperCase() : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        this.setState({
          movies: newData,
          text: text,
        });
      }
      renderPlaceholders = () =>
         [{},{},{},{},{},{},{}].map((e, i) => <BookCardPlaceholder key={i} />);  

    render() {
        const{enableSearch,isDataFetched} = this.state;
        const { navigation } = this.props;
        return (
            <SafeAreaView
                style={BaseStyle.safeAreaView}
                forceInset={{ top: "always" }}>
                {enableSearch == true?( 
                    <View style={{backgroundColor:'#ffffff',flexDirection:'row'}}>
                        <View style={{flex:0.8}}>
                            <TextInput
                            style={styles.textInputStyle}
                            onChangeText={text => this.SearchFilterFunction(text)}
                            value={this.state.text}
                            underlineColorAndroid="transparent"
                            placeholder="Search Here"
                           />
                        </View>
                        <View style={{flex:0.2,justifyContent:'center',alignItems:'center'}}>
                            <TouchableOpacity 
                               onPress={() =>{this.setState({enableSearch:false})}
                                }
                               style={{justifyContent:'center',alignItems:'center'}}>
                              <Text>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                  ):(
                    <Header
                        title="Movies"
                        subTitle="On going shows"
                        renderRight={() => {
                            return (
                                <Icon
                                    name="search"
                                    size={20}
                                    color={BaseColor.primaryColor}
                                />
                            );
                        }}
                        onPressLeft={() => {
                            navigation.goBack();
                        }}
                        onPressRight={() => {
                            this.setState({enableSearch:true})
                        }}
                    >
                    </Header>
                )}
              {isDataFetched ? this.renderContent() : this.renderPlaceholders()}
            </SafeAreaView>
        );
    }
}
