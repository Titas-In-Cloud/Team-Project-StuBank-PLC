import "./App.css";
import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Home from './components/pages/Home';
import Accounts from './components/pages/Accounts';
import Features from './components/pages/Features';
import About from './components/pages/About';
import FAQ from './components/pages/FAQ';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import NavBar from './components/Navbar';


function App() {
    return (
        <>
        {/*    Set up routes and import navigation bar at the top of the page*/}
        <NavBar/>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/accounts" component={Accounts}/>
                    <Route path="/features" component={Features}/>
                    <Route path="/about" component={About}/>
                    <Route path="/faq" component={FAQ}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/register" component={Register}/>
                </Switch>
            </BrowserRouter>
        </>
    );
}


export default App;
