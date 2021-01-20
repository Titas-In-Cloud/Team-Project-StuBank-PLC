import React, {useState} from "react";
import qrcode from "qrcode";


export default function Home() {
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
        <div>
            <h2>Home</h2>
            <img src={qrCodeImg}></img>
        </div>
    );
}