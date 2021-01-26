import React from "react";
import { MainNavigationBar } from "../../";
import {Link} from "react-router-dom";

export default function Overview () {
    return (
        <div className="top-bar">
            <MainNavigationBar />
            <div className="logout">
            </div>
            <div className="main-background">
            </div>
        </div>
    )
}