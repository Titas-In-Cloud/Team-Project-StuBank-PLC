import React from 'react';
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, auth, ...rest }) => {
    let user = JSON.parse(sessionStorage.getItem("userData"));
    return(
        <Route {...rest} render={(props) => (
            ((auth === true) && (user.role === "admin"))
                ? <Component {...props} />
                : <Redirect to='/faq' />
        )} />
    )
}

export default ProtectedRoute;