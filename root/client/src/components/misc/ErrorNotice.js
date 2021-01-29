import React from "react";
//Displays an error
/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function ErrorNotice(props) {
    //Displays error message from server side
    return (
        <div className="error-notice">
            <span>{props.message}</span>
            <button onClick={props.clearError}>X</button>
        </div>
    );
}