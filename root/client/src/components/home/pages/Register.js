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
    const [email, setEmail] = useState(undefined);
    const [firstName, setFirstName] = useState(undefined);
    const [lastName, setLastName] = useState(undefined);
    const [password, setPassword] = useState(undefined);
    const [passwordCheck, setPasswordCheck] = useState(undefined);
    const [personalID, setPersonalID] = useState(undefined);
    const [phoneNum, setPhoneNum] = useState(undefined);
    const [error, setError] = useState();
    const { setUserData } = useContext(UserContext);
    const role = "user";
    const history = useHistory();
    sessionStorage.clear()
    const submit = async (e) => {
        e.preventDefault();
        try {
            const newUser = { email, firstName, lastName, password, passwordCheck, personalID, phoneNum, role };
            await Axios.post("http://localhost:5000/users/register", newUser);
            const loginRes = await Axios.post("http://localhost:5000/users/login", {
                personalID,
                password,
            });
            setUserData({
                token: loginRes.data.token,
                user: loginRes.data.user,
            });
            sessionStorage.setItem("auth-token", loginRes.data.token);
            sessionStorage.setItem("userData", JSON.stringify(loginRes.data.user));
            history.push("/overview");
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg);
        }
    };

    return (
        <div>
            <HomeNavigationBar/>
            <div className="login-registration">
                <div className="box" style={{height: "650px"}}>
                    <div className="form">
                        <h2>Register</h2>
                        <div style={{fontSize: 14, color: "#FF5454", paddingLeft: 10, paddingBottom: 10}}>
                            {error && (
                                <ErrorNotice message={error} clearError={() => setError(undefined)} />
                            )}
                        </div>
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
                                <input type="text" placeholder="Telephone Number" id="register-phone-num"
                                       onChange={(e) => setPhoneNum(e.target.value)}
                                />
                                <img src={TelephoneLogo} alt=""/>
                            </div>

                            <label htmlFor="register-email"/>
                            <div className="inputBox">
                                <input type="text" placeholder="Email Address" id="register-email"
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