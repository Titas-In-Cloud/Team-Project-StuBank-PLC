import React, {useEffect, useState} from "react";
import {MainNavigationBar} from "../../";
import ErrorNotice from "../../misc/ErrorNotice";
import Axios from "axios";
import CardTemplate from "../../images/bank-card-template.png";

export default function Cards () {
    let user = JSON.parse(sessionStorage.getItem("userData"))
    const [cardNumber, setCardNumber] = useState(user.cardNumber.data)
    const [CVV, setCVV] = useState(user.CVV.data)
    const [frozen, setFrozen] = useState(user.frozenCard)
    const [errorCards, setErrorCards] = useState();

    async function updateData() {
        try {
            const newData = await Axios.post("http://localhost:5000/users/updateData", {PID: user.personalID})
            user = newData.data
            setCardNumber(user.cardNumber.data)
            setCVV(user.CVV.data)
            setFrozen(user.frozenCard)
            sessionStorage.setItem("userData", JSON.stringify(user))
        } catch (err) {
            err.response.data.msg && setErrorCards(err.response.data.msg)
        }
    }

    useEffect(() => {
        updateData();
    }, []);

    async function submitCards(e) {
        e.preventDefault();
        try {
            const data = {cardNumber, CVV, frozen, PID: user.personalID}
            await Axios.post("http://localhost:5000/users/newVirtualCard", data)
            await updateData()
        } catch (err) {
            err.response.data.msg && setErrorCards(err.response.data.msg)
        }
    }

    function randomNum(){
        return String(Math.floor(Math.random() * 10))
    }

    function generateNumbers(){
        setCardNumber(randomNum() + randomNum() + randomNum() + randomNum() + ' ' + randomNum() + randomNum() +
            randomNum() + randomNum() + ' ' + randomNum() + randomNum() + randomNum() + randomNum() + ' ' + randomNum()
            + randomNum() + randomNum() + randomNum())
        setCVV(randomNum() + randomNum() + randomNum())
    }

    return (
        <div className="top-bar">
            <MainNavigationBar />
            <div className="main-background">
                <div className="small-bank-box">
                    <h1>Virtual Cards</h1>
                    <div>
                        <div style={{paddingBottom: 20, paddingTop: 20, paddingLeft: 30}}>
                            <button className="button-account" style={{width: 220, fontSize: 16, height: 40}}
                                 onClick={() => {generateNumbers()}}>Generate New Card</button>
                        </div>
                        <form className="form-account" onSubmit = {submitCards}>
                            {errorCards && (<ErrorNotice message={errorCards} clearError={() => setErrorCards(undefined)}/>)}
                            <label>Card Number: </label>
                            <div style={{paddingBottom: 10, paddingTop: 3}}>
                                <input
                                    type="text"
                                    name="Card Number"
                                    readOnly={true}
                                    value ={cardNumber}
                                />
                            </div>

                            <label>CVV: </label>
                            <div style={{paddingBottom: 10, paddingTop: 3}}>
                                <input
                                    type="text"
                                    name="CVV"
                                    value = {CVV}
                                    readOnly={true}
                                />
                            </div>

                            <div style={{paddingTop: 5, paddingLeft: 10}}>
                                <input className="button-account" style={{width: 110, fontSize: 12}}
                                       type="submit" value="Save"/>
                            </div>
                        </form>
                    </div>
                    <div>
                        <img src={CardTemplate} style={{width: 560}} alt=""/>
                        <p style={{color: "white", fontSize: 40, position: "relative", bottom: 180, left: 60}}>
                            {user.cardNumber.data}</p>
                        <p style={{color: "#fafafa", fontSize: 20, position: "relative", bottom: 179, left: 75}}>
                            {user.CVV.data}</p>
                        <p style={{color: "white", fontSize: 40, position: "absolute", bottom: 78, left: 65}}>
                            {user.firstName.data} {user.lastName.data}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}