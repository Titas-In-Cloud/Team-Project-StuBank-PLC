import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Axios from "axios";
import ErrorNotice from "../misc/ErrorNotice";

export default function Register() {
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
            sessionStorage.setItem("auth-token", loginRes.data.token);
            sessionStorage.setItem("userData", JSON.stringify(loginRes.data.user));
            history.push("/");
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg);
        }
    };

    return (
        <div className="page">
            <h2>Register</h2>
            {error && (
                <ErrorNotice message={error} clearError={() => setError(undefined)} />
            )}
            <form className="form" onSubmit={submit}>
                <label htmlFor="register-email">Email</label>
                <input
                    id="register-email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="register-first-name">First name</label>
                <input
                    id="register-first-name"
                    type="text"
                    onChange={(e) => setFirstName(e.target.value)}
                />

                <label htmlFor="register-last-name">Last name</label>
                <input
                    id="register-last-name"
                    type="text"
                    onChange={(e) => setLastName(e.target.value)}
                />

                <label htmlFor="register-password">Password</label>
                <input
                    id="register-password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Verify password"
                    onChange={(e) => setPasswordCheck(e.target.value)}
                />

                <label htmlFor="register-personal-id">Personal ID</label>
                <input
                    id="register-personal-id"
                    type="text"
                    onChange={(e) => setPersonalID(e.target.value)}
                />

                <label htmlFor="register-phone-num">Phone Num</label>
                <input
                    id="register-phone-num"
                    type="text"
                    onChange={(e) => setPhoneNum(e.target.value)}
                />

                <input type="submit" value="Register" />
            </form>
        </div>
    );
}