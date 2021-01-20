import React from "react";
import { HomeNavigationBar, HomeFooter } from "../../";
import {Link} from "react-router-dom";
import UserLogo from "../../images/user-logo.png";
import LockLogo from "../../images/lock-logo.png";

export default function Login () {
    return (
        <div>
            <HomeNavigationBar/>
            <div className="login-registration">
                <div className="box" >
                    <div className="form">
                        <h2>Login</h2>
                        <form>
                            <div className="inputBox">
                                <input type="text" placeholder="User ID"/>
                                <img src={UserLogo} alt=""/>
                            </div>
                            <div className="inputBox">
                                <input type="password" placeholder="Password"/>
                                <img src={LockLogo} alt=""/>
                            </div>
                            <div className="inputBox">
                                <Link to="/overview" className="button">Login</Link>
                            </div>
                        </form>
                        <p>Don't have an account? Register <Link to="/register">here</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}