import React from "react";
import "./config/ReactotronConfig";
import Routes from "../routes";
import { StatusBar } from "react-native";

export default function App() {
    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
            <Routes />
        </>
    );
}
