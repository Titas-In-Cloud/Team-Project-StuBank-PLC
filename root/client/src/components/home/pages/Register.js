import React, { useState, useContext } from "react";
import { HomeNavigationBar } from "../../";
import UserContext from "../../../context/UserContext";
import {Link, useHistory} from "react-router-dom";
import ErrorNotice from "../../misc/ErrorNotice";
import Axios from "axios";

import UserLogo from "../../images/user-logo.png";
import LockLogo from "../../images/lock-logo.png";
import TelephoneLogo from "../../images/telephone-logo.png";
import EmailLogo from "../../images/email-logo.png";

export default function Register () {
    const [email, setEmail] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [password, setPassword] = useState();
    const [passwordCheck, setPasswordCheck] = useState();
    const [personalID, setPersonalID] = useState();
    const [phoneNum, setPhoneNum] = useState();
    const [error, setError] = useState();
    const { setUserData } = useContext(UserContext);
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();

        try {
            const newUser = { email, firstName, lastName, password, passwordCheck, personalID, phoneNum };
            await Axios.post("http://localhost:5000/users/register", newUser);
            const loginRes = await Axios.post("http://localhost:5000/users/login", {
                personalID,
                password,
            });
            setUserData({
                token: loginRes.data.token,
                user: loginRes.data.user,
            });
            localStorage.setItem("auth-token", loginRes.data.token);
            sessionStorage.setItem("userData", JSON.stringify(loginRes.data.user));
            history.push("/");
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg);
        }
    };

    return (
        <div>
            <HomeNavigationBar/>
            <div className="login-registration">
                <div className="box" style={{height: "650px"}}>
                    {error && (
                        <ErrorNotice message={error} clearError={() => setError(undefined)} />
                    )}
                    <div className="form">
                        <h2>Register</h2>
                        <form onSubmit={submit}>
                            <label htmlFor="register-first-name"/>
                            <div className="inputBox">
                                <input type="text" placeholder="First Name(s)" id="register-first-name"
                                       onChange={(e) => setFirstName(e.target.value)}
                                />
                                <img src={UserLogo} alt=""/>
                            </div>

                            <label htmlFor="register-last-name"/>
                            <div className="inputBox">
                                <input type="text" placeholder="Last Name" id="register-last-name"
                                       onChange={(e) => setLastName(e.target.value)}
                                />
                                <img src={UserLogo} alt=""/>
                            </div>

                            <label htmlFor="register-phone-num"/>
                            <div className="inputBox">
                                <input type="tel" placeholder="Telephone Number" id="register-phone-num"
                                       onChange={(e) => setPhoneNum(e.target.value)}
                                />
                                <img src={TelephoneLogo} alt=""/>
                            </div>

                            <label htmlFor="register-email"/>
                            <div className="inputBox">
                                <input type="email" placeholder="Email Address" id="register-email"
                                       onChange={(e) => setEmail(e.target.value)}
                                />
                                <img src={EmailLogo} alt=""/>
                            </div>

                            <label htmlFor="register-personal-id"/>
                            <div className="inputBox">
                                <input type="text" placeholder="User ID" id="register-password"
                                       onChange={(e) => setPersonalID(e.target.value)}
                                />
                                <img src={UserLogo} alt=""/>
                            </div>

                            <label htmlFor="register-password"/>
                            <div className="inputBox">
                                <input type="password" placeholder="Password" id="register-password"
                                       onChange={(e) => setPassword(e.target.value)}
                                />
                                <img src={LockLogo} alt=""/>
                            </div>
                            <div className="inputBox">
                                <input type="password" placeholder="Repeat Password"
                                       onChange={(e) => setPasswordCheck(e.target.value)}
                                />
                                <img src={LockLogo} alt=""/>
                            </div>

                            <div className="inputBox">
                                <input className="button" type="submit" value="Register"/>
                            </div>
                        </form>
                        <p>Already have an account? Login <Link to="/login">here</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}