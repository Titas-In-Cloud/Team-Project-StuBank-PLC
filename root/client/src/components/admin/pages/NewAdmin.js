import React, {useState} from "react";
import { AdminNavigationBar } from "../../";
import UserContext from "../../../context/UserContext";
import Axios from "axios";
import ErrorNotice from "../../misc/ErrorNotice";
import {useHistory} from "react-router-dom";

export default function NewAdmin () {
    const [email, setEmail] = useState(undefined);
    const [firstName, setFirstName] = useState(undefined);
    const [lastName, setLastName] = useState(undefined);
    const [password, setPassword] = useState(undefined);
    const [passwordCheck, setPasswordCheck] = useState(undefined);
    const [personalID, setPersonalID] = useState(undefined);
    const [phoneNum, setPhoneNum] = useState(undefined);
    const role = "admin";
    const [error, setError] = useState();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const newUser = { email, firstName, lastName, password, passwordCheck, personalID, phoneNum, role };
            await Axios.post("http://localhost:5000/users/register", newUser)
            alert("Admin account with personal id " + personalID + " successfully created")

        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg);
        }
    };

    return (
        <div className="top-bar">
            <AdminNavigationBar />
            <div className="main-background">
                <div className="small-bank-box">
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
                        </div>

                        <label htmlFor="register-last-name"/>
                        <div className="inputBox">
                            <input type="text" placeholder="Last Name" id="register-last-name"
                                   onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        <label htmlFor="register-phone-num"/>
                        <div className="inputBox">
                            <input type="tel" placeholder="Telephone Number" id="register-phone-num"
                                   onChange={(e) => setPhoneNum(e.target.value)}
                            />
                        </div>

                        <label htmlFor="register-email"/>
                        <div className="inputBox">
                            <input type="email" placeholder="Email Address" id="register-email"
                                   onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <label htmlFor="register-personal-id"/>
                        <div className="inputBox">
                            <input type="text" placeholder="User ID" id="register-password"
                                   onChange={(e) => setPersonalID(e.target.value)}
                            />
                        </div>

                        <label htmlFor="register-password"/>
                        <div className="inputBox">
                            <input type="password" placeholder="Password" id="register-password"
                                   onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="inputBox">
                            <input type="password" placeholder="Repeat Password"
                                   onChange={(e) => setPasswordCheck(e.target.value)}
                            />
                        </div>

                        <div className="inputBox">
                            <input className="button" type="submit" value="Register"/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}