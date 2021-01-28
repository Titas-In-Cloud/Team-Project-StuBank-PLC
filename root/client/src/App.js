import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { Home, FAQ, Login, Register } from "./components";
import { Overview, Transactions, Account, Cards, Settings } from "./components";
import { Users, NewAdmin } from "./components";
import UserContext from "./context/UserContext";
import Axios from "axios";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedRouteAdmin from "./ProtectedRouteAdmin";

export default function App() {
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined,
    });

    useEffect(() => {
        const checkLoggedIn = async () => {
            let token = sessionStorage.getItem("auth-token");
            if (token === null) {
                sessionStorage.setItem("auth-token", "");
                token = "";
            }
            const tokenRes = await Axios.post("http://localhost:5000/users/tokenIsValid",
                null,
                { headers: {"x-auth-token": token} }
            );
            if (tokenRes.data) {
                const userRes = await Axios.get("http://localhost:5000/users/", {
                    headers: { "x-auth-token": token },
                });
                setUserData({
                    token,
                    user: userRes.data,
                });
            }
        };
        checkLoggedIn();
    }, []);

    return (
        <div className="App">
            <Router>
                <UserContext.Provider value={{userData, setUserData}}>
                    <Switch>
                        <Route exact path="/" component={() => <Home />}/>
                        <Route exact path="/home" component={() => <Home />}/>
                        <Route exact path="/FAQ" component={() => <FAQ />}/>
                        <Route exact path="/login" component={() => <Login />}/>
                        <Route exact path="/register" component={() => <Register />}/>
                        <Route exact path='/overview' component={() => <Overview />}/>
                        <Route exact path="/transactions" component={() => <Transactions />}/>
                        <Route exact path="/account" component={() => <Account />}/>
                        <Route exact path="/cards" component={() => <Cards />}/>
                        <Route exact path="/settings" component={() => <Settings />}/>
                        <Route exact path="/users" component={() => <Users />}/>
                        <Route exact path="/create_admin" component={() => <NewAdmin/>}/>
                        <Route path = "*" component={() => "404 NOT FOUND"}/>
                    </Switch>
                </UserContext.Provider>
            </Router>
        </div>
    );
}