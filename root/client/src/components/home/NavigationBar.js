import React from "react";
import { Link, withRouter } from "react-router-dom";
import BankLogo from "../images/bank-logo.png";

function NavigationBar() {
    return (
        <header>
            <div className="container">
                <nav className="home-nav">
                    <div className="nav-brand">
                        <Link to="/">
                            <img className="home-img" src={BankLogo} alt=""/>
                        </Link>
                    </div>

                    <ul className="nav-list">
                        <li className="nav-item">
                            <Link className="nav-link" to="/home">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/FAQ">FAQ</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Login</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default withRouter(NavigationBar);