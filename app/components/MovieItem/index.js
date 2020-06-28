import React, { Component } from "react";
import { View, TouchableOpacity, FlatList,Image } from "react-native";
import {  Text, Icon, StarRating, Tag } from "@components";
import { BaseColor } from "@config";
import PropTypes from "prop-types";
import styles from "./styles";

export default class MovieItem extends Component {
    constructor(props) {
        super(props);
    }

    
    /**
     * Display movie item as list
     */
    renderList() {
        const {
            style,
            image,
            name,
            location,
            price,
            available,
            rate,
            rateCount,
            onPress
        } = this.props;
        return (
            <View style={[styles.listContent, style]}>
                <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
                    <Image source={image} style={styles.listImage} />
                </TouchableOpacity>
                <View style={styles.listContentRight}>
                    <Text headline semibold numberOfLines={1}>
                        {name}
                    </Text>
                    <View style={styles.listContentRow}>
                        <Text
                            caption1
                            grayColor
                            style={{
                                marginLeft: 3
                            }}
                            numberOfLines={1}
                        >
                            {location}
                        </Text>
                    </View>
                    <View style={styles.listContentRow}>
                        <StarRating
                            disabled={true}
                            starSize={10}
                            maxStars={5}
                            rating={rate}
                            selectedStar={rating => { }}
                            fullStarColor={BaseColor.yellowColor}
                        />
                        <Text caption1 primaryColor semibold>
                            {rateCount}
                        </Text>
                    </View>
                    <Text
                        title3
                        primaryColor
                        semibold
                        style={{ marginTop: 5, marginBottom: 5 }}
                    >
                        {price}
                    </Text>
                    <Text footnote accentColor style={{ marginTop: 3 }}>
                        {available}
                    </Text>
                </View>
            </View>
        );
    }

     



    render() {
        let { block, grid } = this.props;
        if (grid) return this.renderGrid();
        else if (block) return this.renderBlock();
        else return this.renderList();
    }
}

MovieItem.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    image: PropTypes.node.isRequired,
    list: PropTypes.bool,
    block: PropTypes.bool,
    grid: PropTypes.bool,
    name: PropTypes.string,
    location: PropTypes.string,
    price: PropTypes.string,
    available: PropTypes.string,
    rate: PropTypes.number,
    rateCount: PropTypes.string,
    rateStatus: PropTypes.string,
    numReviews: PropTypes.number,
    services: PropTypes.array,
    onPress: PropTypes.func,
    onPressTag: PropTypes.func
};

MovieItem.defaultProps = {
    style: {},
    image: "",
    list: true,
    block: false,
    grid: false,
    name: "",
    location: "",
    price: "",
    available: "",
    rate: 0,
    rateCount: "",
    rateStatus: "",
    numReviews: 0,
    services: [],
    onPress: () => { },
    onPressTag: () => { }
};
