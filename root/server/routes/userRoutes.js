const router = require ("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const speakeasy = require("speakeasy");
const money = require("money");
const oxr = require("open-exchange-rates")
oxr.set({ app_id: 'ec27af52e4214a3eae3323dd2710dee0' })
oxr.latest(function() {
    // Apply exchange rates and base rate to `fx` library object:
    money.rates = oxr.rates;
    money.base = oxr.base;
});
//encrypts data using aes, returns the encrypted data, the iv, and the key all as hexadecimal strings
function aesEncrypt(data) {
    const crypto = require('crypto');
    const key = crypto.randomBytes(16).toString('hex');
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {data: encrypted.toString('hex'), iv: iv.toString('hex'), key};
}
function aesDecrypt(data) {
    const crypto = require('crypto');
    const key = String(data.get('key'));
    const iv = Buffer.from(String(data.get('iv')), 'hex');
    let encryptedText = Buffer.from(String(data.get('data')), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

async function getUserData(PID){
    let userData = await User.findOne({personalID: PID})
    for(let transaction of userData.transactions){
        transaction.date = aesDecrypt(new Map([['data', transaction.date.data],['iv', transaction.date.iv],['key', transaction.date.key]]))
        transaction.amountIn = aesDecrypt(new Map([['data', transaction.amountIn.data],['iv', transaction.amountIn.iv],['key', transaction.amountIn.key]]))
        transaction.amountOut = aesDecrypt(new Map([['data', transaction.amountOut.data],['iv', transaction.amountOut.iv],['key', transaction.amountOut.key]]))
        transaction.balance = aesDecrypt(new Map([['data', transaction.balance.data],['iv', transaction.balance.iv],['key', transaction.balance.key]]))
        if(transaction.amountIn !== ''){
            transaction.amountIn = transaction.currency + parseFloat(transaction.amountIn).toFixed(2)
        }
        if(transaction.amountOut !== ''){
            transaction.amountOut = transaction.currency + parseFloat(transaction.amountOut).toFixed(2)
        }
        transaction.balance = transaction.currency + transaction.balance
    }
    return {
        user: {
            id: userData._id,
            personalID: userData.personalID,
            email: {data: aesDecrypt(userData.email)},
            phoneNum: {data: aesDecrypt(userData.phoneNum)},
            firstName: {data: aesDecrypt(userData.firstName)},
            lastName: {data: aesDecrypt(userData.lastName)},
            accountBalanceGBP: {data: aesDecrypt(userData.accountBalanceGBP)},
            accountBalanceUSD: {data: aesDecrypt(userData.accountBalanceUSD)},
            accountBalanceEUR: {data: aesDecrypt(userData.accountBalanceEUR)},
            recipients: userData.recipients,
            transactions: userData.transactions,
            totpSecret: JSON.parse(aesDecrypt(userData.totpSecret)),
            cardNumber: {data: aesDecrypt(userData.cardNumber)},
            CVV: {data: aesDecrypt(userData.CVV)},
            frozenCard: userData.frozenCard
        }
    }
}
router.post("/register", async(req, res) => {
    try {
        let {email, password, passwordCheck, personalID, phoneNum, firstName, lastName} = req.body;

        // validate
        if(!email || !password || !passwordCheck || !personalID || !phoneNum || !firstName || !lastName)
            return res.status(400).json({msg: "One or more required fields are blank"});
        if (!(firstName.match(/^[A-Za-z\-]+$/) )||(!(lastName.match(/^[A-Za-z\-]+$/))))
            return res.status(400).json({msg: "Please ensure only letters are used for the first name and last name fields"});
        if(password !== passwordCheck)
            return res.status(400).json({msg: "Passwords do not match"});

        const emails = await User.find({},{email: 1});
        for(let item of emails){
            if (aesDecrypt(item.email) === email){
                return res.status(400).json({msg: "An account with this email already exists."});
            }
        }
        const phonenums = await User.find({},{phoneNum: 1});
        for(let item of phonenums){
            if (aesDecrypt(item.phoneNum) === phoneNum){
                return res.status(400).json({msg: "An account with this phone number already exists."});
            }
        }
        const existingPID = await User.findOne({personalID: personalID});
        if(existingPID)
            return res.status(400).json({msg: "An account with this personal ID already exists."});
        if (!(phoneNum.match(/^(07\d{8,12}|447\d{7,11})$/))) {
            return res.status(400).json({msg: "Telephone is not valid, please enter a valid phone number (e.g 07123123123 or 447123123123)"});
        }
        if (!(email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)))
            return res.status(400).json({msg: "Email address is not valid, please enter a valid email, e.g. example@email.com"});
        if (!(password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/)))
            return res.status(400).json({msg: "Password is not valid"});
        if (!(personalID.match(/\d{11}$/)))
            return res.status(400).json({msg: "Please enter exactly 11 digits for the personal ID number"});

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        let totpSecret = speakeasy.generateSecret({
            name: "StuBank Plc"
        });
        const newUser = new User({
            email: aesEncrypt(email),
            password: passwordHash,
            personalID,
            phoneNum: aesEncrypt(phoneNum),
            firstName: aesEncrypt(firstName),
            lastName: aesEncrypt(lastName),
            accountBalanceGBP: aesEncrypt('50'),
            accountBalanceUSD: aesEncrypt('50'),
            accountBalanceEUR: aesEncrypt('50'),
            totpSecret: aesEncrypt(JSON.stringify(totpSecret)),
            cardNumber: aesEncrypt(''),
            CVV: aesEncrypt(''),
            frozenCard: false
        })
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch(err){
        res.status(500).json({error: err.message} );
    }

});
router.post("/login", async (req, res) => {
    try {
        const {personalID, password} = req.body;
        //validate
        if ((!personalID || !password))
            return res.status(400).json({msg: "One or more required fields are blank"})

        const user = await User.findOne({personalID: personalID});
        if (!user)
            return res.status(400).json({msg: "This user does not exist"});
        const matchTrue = await bcrypt.compare(password, user.password);
        if (!matchTrue)
            return res.status(400).json({msg: "Incorrect password"})
        const token = jwt.sign({id: user._id}, process.env.JWT_PWD)

        const userData = await getUserData(personalID)
        res.json({
            token,
            user: userData.user
        });
    }
    catch(err){
        res.status(500).json({error: err.message} );
    }
});

router.delete("/delete", auth, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser);
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
})

router.post("/tokenIsValid", async (req, res) =>{
    try {
        const token = req.header("x-auth-token");
        if (!token)
            return res.json(false);
        const verified = jwt.verify(token, process.env.JWT_PWD);
        if (!verified) return res.json(false);
        const user = await User.findById(verified.id);
        if(!user)
            return res.json(false);
        return res.json(true);
    }
    catch(err) {
        res.status(500).json({ error: err.message });
    }
})

router.post("/transfer", async (req, res) =>{
    try{
        const {payerID, payeeID, amount, currency} = req.body
        if (payerID === payeeID.value)
            return res.status(400).json({msg: "This is your account. Please choose another"});
        if (!(payeeID.value.match(/^\d{11}$/)))
            return res.status(400).json({msg: "Please enter exactly 11 digits for the personal ID number"});
        if (!(amount.match(/^\d+[.]\d{1,2}$/)) && !(amount.match(/^\d+$/)))
            return res.status(400).json({msg: "Please enter a monetary value"});
        let payee
        payee = await User.findOne({personalID: payeeID.value});
        let payer
        payer = await User.findOne({personalID: payerID});
        const date = new Date()
        if (payee)
            switch (currency) {
                case '£':
                    {payee.accountBalanceGBP = aesEncrypt((parseFloat(aesDecrypt(payee.accountBalanceGBP)) +
                    parseFloat(amount)).toFixed(2))}
                    payee.transactions.push({date: aesEncrypt(String(("0" + date.getDate()).slice(-2) + '-' +
                            ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear())), amountIn: aesEncrypt(amount),
                        amountOut: aesEncrypt(''), account: payerID, balance: payee.accountBalanceGBP, currency})
                    payer.accountBalanceGBP = aesEncrypt((parseFloat(aesDecrypt(payer.accountBalanceGBP)) -
                        parseFloat(amount)).toFixed(2))
                    if (payer.accountBalanceGBP < 0)
                        return res.status(400).json({msg: "Insufficient funds"});
                    payer.transactions.push({date: aesEncrypt(String(("0" + date.getDate()).slice(-2) + '-' +
                            ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear())), amountIn: aesEncrypt(''),
                        amountOut: aesEncrypt(amount), account: payeeID.value, balance: payer.accountBalanceGBP, currency})
                    if (payeeID.__isNew__ !== undefined)
                    break
                case '$':
                    {payee.accountBalanceUSD = aesEncrypt((parseFloat(aesDecrypt(payee.accountBalanceUSD)) +
                    parseFloat(amount)).toFixed(2))}
                    payee.transactions.push({date: aesEncrypt(String(("0" + date.getDate()).slice(-2) + '-' +
                            ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear())), amountIn: aesEncrypt(amount),
                        amountOut: aesEncrypt(''), account: payerID, balance: payee.accountBalanceUSD, currency})
                    payer.accountBalanceUSD = aesEncrypt((parseFloat(aesDecrypt(payer.accountBalanceUSD)) -
                        parseFloat(amount)).toFixed(2))
                    if (payer.accountBalanceUSD < 0)
                        return res.status(400).json({msg: "Insufficient funds"});
                    payer.transactions.push({date: aesEncrypt(String(("0" + date.getDate()).slice(-2) + '-' +
                            ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear())), amountIn: aesEncrypt(''),
                        amountOut: aesEncrypt(amount), account: payeeID.value, balance: payer.accountBalanceUSD, currency})
                    if (payeeID.__isNew__ !== undefined)
                    break
                case '€':
                    {payee.accountBalanceEUR = aesEncrypt((parseFloat(aesDecrypt(payee.accountBalanceEUR)) +
                    parseFloat(amount)).toFixed(2))}
                    payee.transactions.push({date: aesEncrypt(String(("0" + date.getDate()).slice(-2) + '-' +
                            ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear())), amountIn: aesEncrypt(amount),
                        amountOut: aesEncrypt(''), account: payerID, balance: payee.accountBalanceEUR, currency})
                    payer.accountBalanceEUR = aesEncrypt((parseFloat(aesDecrypt(payer.accountBalanceEUR)) -
                        parseFloat(amount)).toFixed(2))
                    if (payer.accountBalanceEUR < 0)
                        return res.status(400).json({msg: "Insufficient funds"});
                    payer.transactions.push({date: aesEncrypt(String(("0" + date.getDate()).slice(-2) + '-' +
                            ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear())), amountIn: aesEncrypt(''),
                        amountOut: aesEncrypt(amount), account: payeeID.value, balance: payer.accountBalanceEUR, currency})
                    break
            }
        else
            {return res.status(400).json({msg: "The payee doesn't exist"})}
        if (payeeID.__isNew__ !== undefined)
            payer.recipients.push({label: payeeID.label, value: payeeID.value})
        payee.save()
        payer.save()
        res.json()
    }
    catch(err) {
        res.status(500).json({ error: err.message });
    }
})

router.post("/updateData", async (req, res) =>{
    try{
        const {PID} = req.body
        const newData = await getUserData(PID)
        res.json(newData.user)
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
})

router.post("/newVirtualCard", async (req, res) =>{
    try{
        const {cardNumber, CVV, frozen, PID} = req.body
        if ((!cardNumber || !CVV))
            return res.status(400).json({msg: "One or more required fields are blank"})
        let userData
        userData = await User.findOne({personalID: PID})
        userData.cardNumber = aesEncrypt(cardNumber)
        userData.CVV = aesEncrypt(CVV)
        userData.frozenCard = frozen
        userData.save()
        res.json()
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
})

router.post("/", auth, async (req, res) => {
    const personalID = req.body;
    const user = await User.findById(req.user);
    res.json({
        personalID: user.personalID,
        id: user._id,
    });
});

router.post("/totp-validate", (request, response, next) => {
    // Check user 2FA code is valid and correct
    let verified = speakeasy.totp.verify({
        secret: request.body.secret,
        encoding: 'base32',
        token: request.body.token
    })
    // if 2FA code is correct return this to the client side
    if (verified) {
        response.send({"valid": verified});
    }
    //If 2FA is not valid then set an error message
    else {
        return response.status(400).json({msg: "2FA Failed: incorrect google authenticator code"});
    }
});

router.post("/amendDetails", async (req, res) =>{
    try{
        let {email, passwordOld, passwordNew, passwordCheck, phoneNum, firstName, lastName, personalID} = req.body;
        let oldUser
        oldUser = await User.findOne({personalID})
        // validate
        if(!email || !phoneNum || !firstName || !lastName)
            return res.status(400).json({msg: "One or more required fields are blank"});
        if (!(firstName.match(/^[A-Za-z\-]+$/) )||(!(lastName.match(/^[A-Za-z\-]+$/))))
            return res.status(400).json({msg: "Please ensure only letters are used for the first name and last name fields"});
        if (!(email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)))
            return res.status(400).json({msg: "Email address is not valid, please enter a valid email, e.g. example@email.com"});

        const emails = await User.find({},{email: 1});
        for(let item of emails){
            if (aesDecrypt(item.email) === email && email !== aesDecrypt(oldUser.email)){
                return res.status(400).json({msg: "An account with this email already exists."});
            }
        }

        const phonenums = await User.find({},{phoneNum: 1});
        for(let item of phonenums) {
            if (aesDecrypt(item.phoneNum) === phoneNum && phoneNum !== aesDecrypt(oldUser.phoneNum)) {
                return res.status(400).json({msg: "An account with this phone number already exists."});
            }
        }

        if (passwordOld || passwordNew || passwordCheck) {
            const matchTrue = await bcrypt.compare(passwordOld, oldUser.password);
            if(!matchTrue)
                return res.status(400).json({msg: "Incorrect current password"})
            if (passwordNew !== passwordCheck)
                return res.status(400).json({msg: "Enter new password twice to ensure new password has been entered correctly"});
            if (!(passwordNew.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/)))
                return res.status(400).json({msg: "New password is not valid"});

            const salt = await bcrypt.genSalt();
            oldUser.password = await bcrypt.hash(passwordNew, salt);
        }

        oldUser.email = aesEncrypt(email)
        oldUser.firstName = aesEncrypt(firstName)
        oldUser.lastName = aesEncrypt(lastName)
        oldUser.phoneNum = aesEncrypt(phoneNum)
        await oldUser.save()
        res.json()
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
})

router.post("/convert", async (req, res) =>{
    try{
        const {personalID, amount, to, from} = req.body
        if (!(amount.match(/^\d+[.]\d{1,2}$/)) && !(amount.match(/^\d+$/)))
            return res.status(400).json({msg: "Please enter a monetary value"});
        if (to === from)
            return res.status(400).json({msg: "Please choose two different currencies"});
        let user
        user = await User.findOne({personalID: personalID});
        const date = new Date()
        switch (from){
            case '£':
                switch (to) {
                    case '$':
                        user.accountBalanceUSD = aesEncrypt(parseFloat(Number(aesDecrypt(user.accountBalanceUSD))
                            + Number(money.convert(Number(amount), {from: "GBP", to: "USD"}))).toFixed(2))
                        user.accountBalanceGBP = aesEncrypt(parseFloat(Number(aesDecrypt(user.accountBalanceGBP))
                            - Number(amount)).toFixed(2))
                        user.transactions.push({date: aesEncrypt(String(("0" + date.getDate()).slice(-2) + '-' +
                                ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear())), amountIn: aesEncrypt(''),
                            amountOut: aesEncrypt(String(amount)), account: personalID, balance: user.accountBalanceGBP, currency: from})
                        user.transactions.push({date: aesEncrypt(String(("0" + date.getDate()).slice(-2) + '-' +
                                ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear())),
                            amountIn: aesEncrypt(String(parseFloat(money.convert(Number(amount), {from: "GBP", to: "USD"})).toFixed(2))),
                            amountOut: aesEncrypt(''), account: personalID, balance: user.accountBalanceUSD, currency: to})
                        break
                    case '€':
                        user.accountBalanceEUR = aesEncrypt(parseFloat(Number(aesDecrypt(user.accountBalanceEUR))
                            + Number(money.convert(Number(amount), {from: "GBP", to: "EUR"}))).toFixed(2))
                        user.accountBalanceGBP = aesEncrypt(parseFloat(Number(aesDecrypt(user.accountBalanceGBP))
                            - Number(amount)).toFixed(2))
                        user.transactions.push({date: aesEncrypt(String(("0" + date.getDate()).slice(-2) + '-' +
                                ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear())), amountIn: aesEncrypt(''),
                            amountOut: aesEncrypt(String(amount)), account: personalID, balance: user.accountBalanceGBP, currency: from})
                        user.transactions.push({date: aesEncrypt(String(("0" + date.getDate()).slice(-2) + '-' +
                                ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear())),
                            amountIn: aesEncrypt(String(parseFloat(money.convert(Number(amount), {from: "GBP", to: "EUR"})).toFixed(2))),
                            amountOut: aesEncrypt(''), account: personalID, balance: user.accountBalanceEUR, currency: to})
                        break
                }
                break
            case '$':
                switch (to) {
                    case '£':
                        user.accountBalanceGBP = aesEncrypt(parseFloat(Number(aesDecrypt(user.accountBalanceGBP))
                            + Number(money.convert(Number(amount), {from: "USD", to: "GBP"}))).toFixed(2))
                        user.accountBalanceUSD = aesEncrypt(parseFloat(Number(aesDecrypt(user.accountBalanceUSD))
                            - Number(amount)).toFixed(2))
                        user.transactions.push({date: aesEncrypt(String(("0" + date.getDate()).slice(-2) + '-' +
                                ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear())), amountIn: aesEncrypt(''),
                            amountOut: aesEncrypt(String(amount)), account: personalID, balance: user.accountBalanceUSD, currency: from})
                        user.transactions.push({date: aesEncrypt(String(("0" + date.getDate()).slice(-2) + '-' +
                                ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear())),
                            amountIn: aesEncrypt(String(parseFloat(money.convert(Number(amount), {from: "USD", to: "GBP"})).toFixed(2))),
                            amountOut: aesEncrypt(''), account: personalID, balance: user.accountBalanceGBP, currency: to})
                        break
                    case '€':
                        user.accountBalanceEUR = aesEncrypt(parseFloat(Number(aesDecrypt(user.accountBalanceEUR))
                            + Number(money.convert(Number(amount), {from: "USD", to: "EUR"}))).toFixed(2))
                        user.accountBalanceUSD = aesEncrypt(parseFloat(Number(aesDecrypt(user.accountBalanceUSD))
                            - Number(amount)).toFixed(2))
                        user.transactions.push({date: aesEncrypt(String(("0" + date.getDate()).slice(-2) + '-' +
                                ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear())), amountIn: aesEncrypt(''),
                            amountOut: aesEncrypt(String(amount)), account: personalID, balance: user.accountBalanceEUR, currency: from})
                        user.transactions.push({date: aesEncrypt(String(("0" + date.getDate()).slice(-2) + '-' +
                                ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear())),
                            amountIn: aesEncrypt(String(parseFloat(money.convert(Number(amount), {from: "USD", to: "EUR"})).toFixed(2))),
                            amountOut: aesEncrypt(''), account: personalID, balance: user.accountBalanceEUR, currency: to})
                        break
                }
                break
            case '€':
                switch (to) {
                    case '£':
                        user.accountBalanceGBP = aesEncrypt(parseFloat(Number(aesDecrypt(user.accountBalanceGBP))
                            + Number(money.convert(Number(amount), {from: "EUR", to: "GBP"}))).toFixed(2))
                        user.accountBalanceEUR = aesEncrypt(parseFloat(Number(aesDecrypt(user.accountBalanceEUR))
                            - Number(amount)).toFixed(2))
                        user.transactions.push({date: aesEncrypt(String(("0" + date.getDate()).slice(-2) + '-' +
                                ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear())), amountIn: aesEncrypt(''),
                            amountOut: aesEncrypt(String(amount)), account: personalID, balance: user.accountBalanceEUR, currency: from})
                        user.transactions.push({date: aesEncrypt(String(("0" + date.getDate()).slice(-2) + '-' +
                                ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear())),
                            amountIn: aesEncrypt(String(parseFloat(money.convert(Number(amount), {from: "EUR", to: "GBP"})).toFixed(2))),
                            amountOut: aesEncrypt(''), account: personalID, balance: user.accountBalanceGBP, currency: to})
                        break
                    case '$':
                        user.accountBalanceUSD = aesEncrypt(parseFloat(Number(aesDecrypt(user.accountBalanceUSD))
                            + Number(money.convert(Number(amount), {from: "EUR", to: "USD"}))).toFixed(2))
                        user.accountBalanceEUR = aesEncrypt(parseFloat(Number(aesDecrypt(user.accountBalanceEUR))
                            - Number(amount)).toFixed(2))
                        user.transactions.push({date: aesEncrypt(String(("0" + date.getDate()).slice(-2) + '-' +
                                ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear())), amountIn: aesEncrypt(''),
                            amountOut: aesEncrypt(String(amount)), account: personalID, balance: user.accountBalanceEUR, currency: from})
                        user.transactions.push({date: aesEncrypt(String(("0" + date.getDate()).slice(-2) + '-' +
                                ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear())),
                            amountIn: aesEncrypt(String(parseFloat(money.convert(Number(amount), {from: "EUR", to: "USD"})).toFixed(2))),
                            amountOut: aesEncrypt(''), account: personalID, balance: user.accountBalanceUSD, currency: to})
                        break
                }
                break
        }
        user.save()
        res.json()
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;