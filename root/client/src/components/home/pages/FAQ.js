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
                        <h1>How do I register?</h1>
                        <p>
                            Click get started on the home page or go through the login page, and enter all of the
                            required details. If your details are valid then the account will be created for you. Make
                            sure to scan the QR code with Google authenticator as you will not be able to login without
                            it.
                        </p>
                    </div>
                    <div className="message">
                        <h1>How do I login?</h1>
                        <p>
                            Click login, enter your personal ID and password, if the details are correct popup window 
                            will appear. In the input box insert the code from Google Authenticator app and you will 
                            be logged in.
                        </p>
                    </div>
                    <div className="message">
                        <h1>How do I transfer money?</h1>
                        <p>
                            Navigate to the account page, and click the transfer button. Choose your payee, the amount
                            and the currency then click submit. If you enter valid details then the money will be
                            transferred.
                        </p>
                    </div>
                    <div className="message">
                        <h1>How do I convert currency?</h1>
                        <p>
                            Navigate to the account page, and click the convert button. Choose the currency you would
                            like to convert to and from, as well as the amount. If you have sufficient funds then the 
                            money will be converted.
                        </p>
                    </div>
                    <div className="message">
                        <h1>How do I view my statement?</h1>
                        <p>
                            Navigate to the transactions page and the statement of the most recent transactions will be 
                            presented to you.
                        </p>
                    </div>
                    <div className="message">
                        <h1>How do I change my account details?</h1>
                        <p>
                            Navigate to the settings page, and click the amend button. Change account details you would
                            like to amend and click submit. Your details will now be updated.
                        </p>
                    </div>
                    <div className="message">
                        <h1>How do I delete my account?</h1>
                        <p>
                            If you are unsatisfied with our service you can delete your account by navigating to the
                            settings page, and clicking delete button. If you are sure you want to delete your
                            account then confirm in the popup box. Remember this action cannot be reversed!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
