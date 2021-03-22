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
                            required details. If your details are valid then an account will be created for you. Make
                            sure to scan the QR code with Google authenticator as you will not be able to login without
                            it!
                        </p>
                    </div>
                    <div className="message">
                        <h1>How do I login?</h1>
                        <p>
                            Click login and enter your personal ID and password, and if correct then enter the code from
                            your Google authenticator app and you will be logged in.
                        </p>
                    </div>
                    <div className="message">
                        <h1>How do I transfer money?</h1>
                        <p>
                            Navigate to the account page, and click the transfer button. Choose your payee, the amount
                            and the currency then click submit. If you entered valid details then the money will be
                            transferred.
                        </p>
                    </div>
                    <div className="message">
                        <h1>How do I convert currency?</h1>
                        <p>
                            Navigate to the account page, and click the convert button. Choose the currency you would
                            like to convert to and from and the amount. If you have sufficient funds then the money will
                            be converted.
                        </p>
                    </div>
                    <div className="message">
                        <h1>How do I view my statement?</h1>
                        <p>
                            Navigate to the transactions page, and the statement will be presented to you with your most
                            recent transactions first.
                        </p>
                    </div>
                    <div className="message">
                        <h1>How do change my details?</h1>
                        <p>
                            Navigate to the settings page, and click the amend button. Change the details you would
                            like to amend and click submit. Your details will now be updated.
                        </p>
                    </div>
                    <div className="message">
                        <h1>How do I delete my account?</h1>
                        <p>
                            If you are unsatisfied with our service you can delete your account by navigating to the
                            settings page, and click delete account button. If you are sure you want to delete your
                            account then confirm in the popup box. Remember this action cannot be reversed!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}