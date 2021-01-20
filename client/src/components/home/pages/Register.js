import React from "react";
import { HomeNavigationBar, HomeFooter } from "../../";
import {Link} from "react-router-dom";
import UserLogo from "../../images/user-logo.png";
import LockLogo from "../../images/lock-logo.png";
import TelephoneLogo from "../../images/telephone-logo.png";
import EmailLogo from "../../images/email-logo.png";

export default function Register () {
    return (
        <div>
            <HomeNavigationBar/>
            <div className="login-registration">
                <div className="box" style={{height: "650px"}}>
                    <div className="form">
                        <h2>Register</h2>
                        <form>
                            <div className="inputBox">
                                <input type="text" placeholder="First Name(s)"/>
                                <img src={UserLogo} alt=""/>
                            </div>
                            <div className="inputBox">
                                <input type="text" placeholder="Last Name"/>
                                <img src={UserLogo} alt=""/>
                            </div>
                            <div className="inputBox">
                                <input type="tel" placeholder="Telephone Number"/>
                                <img src={TelephoneLogo} alt=""/>
                            </div>
                            <div className="inputBox">
                                <input type="email" placeholder="Email Address"/>
                                <img src={EmailLogo} alt=""/>
                            </div>
                            <div className="inputBox">
                                <input type="text" placeholder="Username"/>
                                <img src={UserLogo} alt=""/>
                            </div>
                            <div className="inputBox">
                                <input type="text" placeholder="User ID"/>
                                <img src={UserLogo} alt=""/>
                            </div>
                            <div className="inputBox">
                                <input type="password" placeholder="Password"/>
                                <img src={LockLogo} alt=""/>
                            </div>
                            <div className="inputBox">
                                <input type="password" placeholder="Repeat Password"/>
                                <img src={LockLogo} alt=""/>
                            </div>
                            <div className="inputBox">
                                <Link to="/login" className="button">Register</Link>
                            </div>
                        </form>
                        <p>Already have an account? Login <Link to="/login">here</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}