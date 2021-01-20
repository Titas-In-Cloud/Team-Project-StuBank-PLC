import React from "react";
import { MainNavigationBar } from "../../";
import {Link} from "react-router-dom";
import LogoutLogo from "../../images/logout-logo.png";

export default function Overview () {
    return (
        <div className="top-bar">
            <MainNavigationBar />
            <div className="logout">
            </div>
            <div className="main-background">
                <h1>Overview</h1>
            </div>
        </div>
    )
}