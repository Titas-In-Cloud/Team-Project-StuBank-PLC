import React from "react";
import { HomeNavigationBar } from "../../";

export default function FAQ () {
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