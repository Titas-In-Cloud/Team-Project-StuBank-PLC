import React, {useContext} from "react";
import { Link, withRouter } from "react-router-dom";

import LogoutLogo from "../images/logout-logo.png";
import SettingsLogo from "../images/settings-logo.png";
import BankLogo from "../images/bank-logo.png";
import OverviewLogo from "../images/overview-logo.png";
import TransactionsLogo from "../images/transactions-logo.png";
import AccountLogo from "../images/account-logo.png";
import CardLogo from "../images/card-logo.png";
import UserContext from "../../context/UserContext";

function NavigationBar(){
    let user = JSON.parse(sessionStorage.getItem("userData"));

    const {setUserData} = useContext(UserContext);

    // This removes the authentication token from the user data and also the local storage when the user logs out
    const logout = () => {
        setUserData({
            token: undefined,
            user: undefined
        })
        sessionStorage.clear()
        localStorage.clear()
    }

    return (
        <div className="top-bar">
            <div className="sidebar">
                <div className="nav-brand">
                    <Link to="/overview">
                        <img className="main-img" src={BankLogo} alt=""/>
                    </Link>
                </div>
                <ul className="sidebar-list">
                    <li className="row">
                        <Link className="link" to="/overview">
                            <img className="img" src={OverviewLogo} alt=""/>
                            <p>Overview</p>
                        </Link>
                    </li>
                    <li className="row">
                        <Link className="link" to="/transactions">
                            <img className="img" src={TransactionsLogo} alt=""/>
                            <p>Transactions</p>
                        </Link>
                    </li>
                    <li className="row">
                        <Link className="link" to="/account">
                            <img className="img" src={AccountLogo} alt=""/>
                            <p>Account</p>
                        </Link>
                    </li>
                    <li className="row">
                        <Link className="link" to="/cards">
                            <img className="img" src={CardLogo} alt=""/>
                            <p>Cards</p>
                        </Link>
                    </li>
                </ul>
                <div className="text">
                    <h1>{user.firstName.data} {user.lastName.data}</h1>
                    <h2>ID: {user.personalID}</h2>
                </div>
            </div>
            <div className="button">
                <Link to="/login" onClick={logout}>
                    <img className="image-logout" src={LogoutLogo} alt="Logout"/>
                    <p style={{color: "#ff1b1b" }}>Logout</p>
                </Link>
                <Link to="/settings">
                    <img className="image-settings" src={SettingsLogo} alt="Settings"/>
                    <p style={{color: "#8F8D8D" }}>Settings</p>
                </Link>
            </div>
        </div>
    )
}

export default withRouter(NavigationBar);