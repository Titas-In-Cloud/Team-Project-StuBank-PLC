import React, {useContext} from "react";
import { Link, withRouter, useHistory } from "react-router-dom";

import LogoutLogo from "../images/logout-logo.png";
import BankLogo from "../images/bank-logo.png";
import UsersLogo from "../images/multiple-users-logo.png";
import AdminLogo from "../images/admin-logo.png";
import UserContext from "../../context/UserContext";

function NavigationBar(){
    let userDetails = JSON.parse(sessionStorage.getItem("userData"));

    const history = useHistory();
    const {setUserData} = useContext(UserContext);

    // This removes the authentication token from the user data and also the local storage when the user logs out
    const logout = () => {
        setUserData({
            token: undefined,
            user: undefined
        })
        sessionStorage.clear()
        localStorage.clear()
        history.push('/login')
    }

    return (
        <div className="top-bar">
            <div className="sidebar">
                <div className="nav-brand">
                    <Link to="/users">
                        <img className="main-img" src={BankLogo} alt=""/>
                    </Link>
                </div>
                <ul className="sidebar-list">
                    <li className="row">
                        <Link className="link" to="/users">
                            <img className="img" src={UsersLogo} alt=""/>
                            <p>Users</p>
                        </Link>
                    </li>
                    <li className="row">
                        <Link className="link" to="/create_admin">
                            <img className="img" src={AdminLogo} alt=""/>
                            <p>New Admin</p>
                        </Link>
                    </li>
                </ul>
                <div className="text">
                    <h2 className="admin">Admin ID: {userDetails.personalID}</h2>
                </div>
            </div>
            <div className="button">
                <btn style={{cursor: "pointer"}} onClick={() =>{ if (window.confirm('Do you want to logout?')) logout() }}>
                    <img className="image-logout" src={LogoutLogo} alt="Logout"/>
                    <p style={{color: "#ff1b1b" }}>Logout</p>
                </btn>
            </div>
        </div>
    )
}

export default withRouter(NavigationBar);