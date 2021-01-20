import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { Home, Features, AboutUs, FAQ, Login, Register } from "./components";
import { Overview, Transactions, Account, Cards, Settings } from "./components";

export default function App() {
    return (
        <div className="App">
            <Router>
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
            </Router>
        </div>
    );
}