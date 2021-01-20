import React from "react";
import { Link, withRouter } from "react-router-dom";
import BankLogo from "../images/bank-logo.png";
import OverviewLogo from "../images/overview-logo.png";
import TransactionsLogo from "../images/transactions-logo.png";
import AccountLogo from "../images/account-logo.png";
import CardLogo from "../images/card-logo.png";

function NavigationBar(props){
    return (
        <div className="sidebar">
            <div className="nav-brand">
                <Link to="/overview">
                    <img className="main-img" src={BankLogo} alt="/overview"/>
                </Link>
            </div>

            <ul className="sidebar-list">
                <li className="row">
                    <img className="img" src={OverviewLogo} alt="/overview"/>
                    <Link className="link" to="/overview">Overview</Link>
                </li>
                <li className="row">
                    <img className="img" src={TransactionsLogo} alt="/transactions"/>
                    <Link className="link" to="/transactions">Transactions</Link>
                </li>
                <li className="row">
                    <img className="img" src={AccountLogo} alt="/account"/>
                    <Link className="link" to="/account">Account</Link>
                </li>
                <li className="row">
                    <img className="img" src={CardLogo} alt="/cards"/>
                    <Link className="link" to="/cards">Cards</Link>
                </li>
            </ul>
            <div className="text">
                <h1>James Richardson</h1>
                <h2>ID: 12345678910</h2>
            </div>
        </div>
    )
}

export default withRouter(NavigationBar);