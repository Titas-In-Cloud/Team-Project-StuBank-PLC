import React, {useState} from 'react';
import '../App.css';
import ReorderIcon from '@material-ui/icons/Reorder';

export default function Navbar() {
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
                <a href="/login">Login</a>
                <a href="/register">Register</a>
            </div>
            {/*Reverses value of showLinks when dropdown button is clicked*/}
            <button onClick={()=>setShowLinks(!showLinks)}><ReorderIcon/></button>
        </nav>
    );
}