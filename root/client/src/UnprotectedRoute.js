import React from 'react';
import { Route, Redirect } from "react-router-dom";

const UnprotectedRoute = ({ component: Component, auth, ...rest }) => {
    console.log("auth:" + auth)
    auth = !auth;
    return(
        <Route {...rest} render={(props) => (
            auth === true
                ? <Component {...props} />
                : <Redirect to='/overview' />
        )} />
    )
}

export default UnprotectedRoute;