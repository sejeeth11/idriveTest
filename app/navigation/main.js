import React from "react";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { BaseColor, BaseStyle } from "@config";
import { Icon } from "@components";
import * as Utils from "@utils";
import Walkthrough from "@screens/Walkthrough";
import SignUp from "@screens/SignUp";
import SignIn from "@screens/SignIn";
import ResetPassword from "@screens/ResetPassword";
import ChangePassword from "@screens/ChangePassword";
import MovieList from "@screens/MovieList"
import MovieDetails from "@screens/MovieDetails"


// Transition for navigation by screen name
const handleCustomTransition = ({ scenes }) => {
    const nextScene = scenes[scenes.length - 1].route.routeName;
    switch (nextScene) {
        case "PreviewImage":
            Utils.enableExperimental();
            return Utils.zoomIn();
        default:
            return false;
    }
};

// Main Stack View App
const StackNavigator = createStackNavigator(
    {

        Walkthrough: {
            screen: Walkthrough
        },
        SignUp: {
            screen: SignUp
        },
        SignIn: {
            screen: SignIn
        },
        ResetPassword: {
            screen: ResetPassword
        },
        ChangePassword: {
            screen: ChangePassword
        },
        MovieList:{
            screen:MovieList
        },
        MovieDetails:{
            screen:MovieDetails
        }
        
    },
    {
        headerMode: "none",
        initialRouteName: "Walkthrough"
    }
);

// Define Root Stack support Modal Screen
const RootStack = createStackNavigator(
    {
        StackNavigator: {
            screen: StackNavigator
        }
    },
    {
        mode: "modal",
        headerMode: "none",
        initialRouteName: "StackNavigator",
        transitionConfig: screen => {
            return handleCustomTransition(screen);
        }
    }
);

export default RootStack;
