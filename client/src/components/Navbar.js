import React, {useContext, useState} from 'react';
import '../App.css';
import ReorderIcon from '@material-ui/icons/Reorder';
import UserContext from "../context/UserContext";

export default function Navbar() {
    const {userData, setUserData} = useContext(UserContext);
    // Will set the user data to null when they click the button on the logout page
    const logout = () => {
        setUserData({
            token: undefined,
            user: undefined
        })
        localStorage.setItem("auth-token", "");
    }


    const [showLinks, setShowLinks] = useState(false);
    return (
        // Implements navigation bar
        <nav className="Navbar">
            <div className="links" id={showLinks ? "hidden" : ""}>
                <a href="/">Home</a>
                <a href="/accounts">Accounts</a>
                <a href="/features">Features</a>
                <a href="/about">About Us</a>
                <a href="/faq">FAQ</a>

                {/*If the user is logged in a logout button is displayed else a register and login button is displayed*/}
                {userData.user ? (
                    <a href="/logout">Log out</a>
                ) : (
                    <>
                        <a href="/register">Register</a>
                        <a href="/login">Login</a>
                    </>
                )}
            </div>
            {/*Reverses value of showLinks when dropdown button is clicked*/}
            <button onClick={()=>setShowLinks(!showLinks)}><ReorderIcon/></button>
        </nav>
    );
}