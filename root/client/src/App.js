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
    const [isAuthenticated, setIsAuthenticated] = useState(false);

        const checkAuth = async () => {
            const token = sessionStorage.getItem('auth-token');
            const request = Axios.create({
                headers: {
                    "x-auth-token": token
                }
            });
            await request.post('http://localhost:5000/users/tokenIsValid')
                .then( res => {
                if (res.data) {
                setIsAuthenticated(true);
            }
                else{
                    setIsAuthenticated(false);
            }
        })
        }
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
                        <Route exact path="/home" component={() => <Home />} onEnter={checkAuth()} auth={isAuthenticated} />
                        <Route exact path="/FAQ" component={() => <FAQ />} onEnter={checkAuth()} auth={isAuthenticated}/>
                        <Route exact path="/login" component={() => <Login />} onEnter={checkAuth()} auth={isAuthenticated}/>
                        <Route exact path="/register" component={() => <Register />} onEnter={checkAuth()} auth={isAuthenticated}/>
                        <ProtectedRoute exact path='/overview' component={() => <Overview />} onEnter={checkAuth()} auth={isAuthenticated} />
                        <ProtectedRoute exact path="/transactions" component={() => <Transactions />} onEnter={checkAuth()} auth={isAuthenticated}/>
                        <ProtectedRoute exact path="/account" component={() => <Account />} onEnter={checkAuth()} auth={isAuthenticated}/>
                        <ProtectedRoute exact path="/cards" component={() => <Cards />} onEnter={checkAuth()} auth={isAuthenticated}/>
                        <ProtectedRoute exact path="/settings" component={() => <Settings />} onEnter={checkAuth()} auth={isAuthenticated}/>
                        <ProtectedRouteAdmin exact path="/users" component={() => <Users />} onEnter={checkAuth()} auth={isAuthenticated}/>
                        <ProtectedRouteAdmin exact path="/create_admin" component={() => <NewAdmin/>} onEnter={checkAuth()} auth={isAuthenticated}/>
                        <Route path = "*" component={() => "404 NOT FOUND"}/>
                    </Switch>
                </UserContext.Provider>
            </Router>
        </div>
    );
}