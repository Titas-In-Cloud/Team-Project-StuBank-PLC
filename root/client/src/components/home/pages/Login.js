import React, { useState, useContext } from "react";
import { HomeNavigationBar } from "../../";
import {Link, useHistory} from "react-router-dom";
import UserContext from "../../../context/UserContext";
import ErrorNotice from "../../misc/ErrorNotice";
import Axios from "axios";

import UserLogo from "../../images/user-logo.png";
import LockLogo from "../../images/lock-logo.png";

export default function Login () {
    const [personalID, setPersonalID] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();
    const { setUserData } = useContext(UserContext);
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const loginUser = { personalID, password };
            const loginRes = await Axios.post(
                "http://localhost:5000/users/login",
                loginUser
            );

            let totpToken = prompt("Please enter the google authenticator code: ");
            //Get the totpSecret from the server-side
            let totpSecret = loginRes.data.user.totpSecret.base32;
            const totpData = {
                "secret": totpSecret,
                "token": totpToken
            }

            //Validate the google authenticator token
            await Axios.post('http://localhost:5000/users/totp-validate', totpData)
                .then(res => {
                    // Set the user data to local and session storage if the token is valid
                    if (res.data.valid) {

                        setUserData({
                            token: loginRes.data.token,
                            user: loginRes.data.user,
                        });
                        localStorage.setItem("auth-token", loginRes.data.token);
                        sessionStorage.setItem("userData", JSON.stringify(loginRes.data.user));
                        history.push("/overview");
                    }
                }
                )
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg);
        }
    };

    return (
        <div>
            <HomeNavigationBar/>
            <div className="login-registration">
                <div className="box" >
                    {error && (
                        <ErrorNotice message={error} clearError={() => setError(undefined)} />
                    )}
                    <div className="form" onSubmit={submit}>
                        <h2>Login</h2>
                        <form>
                            <label htmlFor="login-personal-ID"/>
                            <div className="inputBox">
                                <input type="text" placeholder="User ID" id="login-personal-ID"
                                       onChange={(e) => setPersonalID(e.target.value)}
                                />
                                <img src={UserLogo} alt=""/>
                            </div>

                            <label htmlFor="login-password"/>
                            <div className="inputBox">
                                <input type="password" placeholder="Password" id="login-password"
                                       onChange={(e) => setPassword(e.target.value)}
                                />
                                <img src={LockLogo} alt=""/>
                            </div>
                            <div className="inputBox">
                                <input className="button" type="submit" value="Log in" />
                            </div>
                        </form>
                        <p>Don't have an account? Register <Link to="/register">here</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}