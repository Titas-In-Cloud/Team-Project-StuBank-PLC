import React, {useState} from "react";
import { MainNavigationBar } from "../../";
import qrcode from "qrcode";

export default function Overview () {
    const [qrCodeImg, setQrCodeImg] = useState();
    let user = JSON.parse(sessionStorage.getItem("userData"));
    //Converts totpSecret into a string to display the qr code so it can be scanned with google auth (if user logged in)
    if (!qrCodeImg && user) {
        let totpSecret = user.totpSecret;
        qrcode.toDataURL(totpSecret.otpauth_url, function (err, data) {
            setQrCodeImg(data);
        })
    }

    return (
        <div className="main-background">
            <MainNavigationBar />
            <section className="main-background">
                <div className="centered-text-default">
                <h5>Please scan this qr code with the google authenticator app (you wont be able to log in without it)</h5>
                <img src = {qrCodeImg}/>
                </div>
            </section>
        </div>
    )
}