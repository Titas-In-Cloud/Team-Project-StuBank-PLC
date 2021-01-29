import React from "react";
import { HomeNavigationBar } from "../../";

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function FAQ () {
    //logs out user if they navigate to this page whilst logged in
    sessionStorage.clear()
    return (
        <div>
            <HomeNavigationBar />
            <div className="faq-style">
                <div className="container" style={{paddingTop: 50}}>
                    <div className="message">
                        <h1>Title</h1>
                        <p>
                            Description
                        </p>
                    </div>
                    <div className="message">
                        <h1>Title</h1>
                        <p>
                            Description
                        </p>
                    </div>
                    <div className="message">
                        <h1>Title</h1>
                        <p>
                            Description
                        </p>
                    </div>
                    <div className="message">
                        <h1>Title</h1>
                        <p>
                            Description
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}