import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { Home, Features, AboutUs, FAQ, Login, Register } from "./components";
import { Overview, Transactions, Account, Cards, Settings } from "./components";
import UserContext from "./context/UserContext";
import Axios from "axios";

export default function App() {
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined,
    });

    useEffect(() => {
        const checkLoggedIn = async () => {
            let token = localStorage.getItem("auth-token");
            if (token === null) {
                localStorage.setItem("auth-token", "");
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
                        <Route exact path="/features" component={() => <Features />}/>
                        <Route exact path="/about_us" component={() => <AboutUs />}/>
                        <Route exact path="/FAQ" component={() => <FAQ />}/>
                        <Route exact path="/login" component={() => <Login />}/>
                        <Route exact path="/register" component={() => <Register />}/>
                        <Route exact path="/overview" component={() => <Overview />}/>
                        <Route exact path="/transactions" component={() => <Transactions />}/>
                        <Route exact path="/account" component={() => <Account />}/>
                        <Route exact path="/cards" component={() => <Cards />}/>
                        <Route exact path="/settings" component={() => <Settings />}/>
                        <Route path = "*" component={() => "404 NOT FOUND"}/>
                    </Switch>
                </UserContext.Provider>
            </Router>
        </div>
    );
}