const router = require ("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const speakeasy = require("speakeasy");
const money = require("money");
const oxr = require("open-exchange-rates")
oxr.set({ app_id: 'ec27af52e4214a3eae3323dd2710dee0' })
oxr.latest(function() {
    //Load exchange rates
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
//decrypts data using aes, returns the decrypted strings
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
    //decrypts transactions
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
            frozenCard: userData.frozenCard,
            role: userData.role
        }
    }
}
router.post("/register", async(req, res) => {
    try {
        let {email, password, passwordCheck, personalID, phoneNum, firstName, lastName, role} = req.body;

        //check all data is present and valid
        if (!email || !password || !passwordCheck || !personalID || !phoneNum || !firstName || !lastName)
            return res.status(400).json({msg: "One or more required fields are blank"});
        if (!(firstName.match(/^[A-Za-z\-]+$/)) || (!(lastName.match(/^[A-Za-z\-]+$/))))
            return res.status(400).json({msg: "Please ensure only letters are used for the first name and last name fields"});
        if (password !== passwordCheck)
            return res.status(400).json({msg: "Passwords do not match"});

        const emails = await User.find({}, {email: 1});
        for (let item of emails) {
            if (aesDecrypt(item.email) === email) {
                return res.status(400).json({msg: "An account with this email already exists."});
            }
        }
        const phonenums = await User.find({}, {phoneNum: 1});
        for (let item of phonenums) {
            if (aesDecrypt(item.phoneNum) === phoneNum) {
                return res.status(400).json({msg: "An account with this phone number already exists."});
            }
        }
        const existingPID = await User.findOne({personalID: personalID});
        if (existingPID)
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
        //hash password with bcrypt
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        //generate 2FA info
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
            frozenCard: false,
            role: role
        })
        const savedUser = await newUser.save();
        //generate jwt token
        const token = jwt.sign({id: savedUser._id}, process.env.JWT_PWD)
        const userData = await getUserData(personalID)
        res.json({
            token,
            user: userData.user
        });

} catch(err){
        res.status(500).json({error: err.message} );
    }

});
router.post("/login", async (req, res) => {
    try {
        const {personalID, password} = req.body;
        //check all data is present
        if ((!personalID || !password))
            return res.status(400).json({msg: "One or more required fields are blank"})
        //get user data from database and check login data is valid
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
        //find and delete user from database
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser);
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
})

router.post("/tokenIsValid", async (req, res) =>{
    try {
        //validate jwt token
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

function transferMoney(payeeBalance, payerBalance, payeeID, payerID, amount, currency){
    let date = new Date()
    //generate date
    date = aesEncrypt(String(("0" + date.getDate()).slice(-2) + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear()))
    //calculate new user balances and check if payer has sufficient funds
    payerBalance = parseFloat(Number(aesDecrypt(payerBalance)) - Number(amount)).toFixed(2)
    if (Number(payerBalance) < 0) {return false}
    else {payerBalance = aesEncrypt(payerBalance)}
    payeeBalance = aesEncrypt((parseFloat(aesDecrypt(payeeBalance)) + parseFloat(amount)).toFixed(2))
    //generate transactions for both users
    const transactionIn = {date, amountIn: aesEncrypt(amount), amountOut: aesEncrypt(''), account: payerID,
        balance: payeeBalance, currency}
    const transactionOut = {date, amountIn: aesEncrypt(''), amountOut: aesEncrypt(amount), account: payeeID.value,
        balance: payerBalance, currency}
    return {payeeBalance, payerBalance, transactionIn, transactionOut}
}

router.post("/transfer", async (req, res) =>{
    try{
        const {payerID, payeeID, amount, currency} = req.body
        //check data is valid
        if (payerID === payeeID.value)
            return res.status(400).json({msg: "This is your account. Please choose another"});
        if (!(payeeID.value.match(/^\d{11}$/)))
            return res.status(400).json({msg: "Please enter exactly 11 digits for the personal ID number"});
        if (!(amount.match(/^\d+[.]\d{1,2}$/)) && !(amount.match(/^\d+$/)))
            return res.status(400).json({msg: "Please enter a monetary value"});
        let payee
        payee = await User.findOne({personalID: payeeID.value});
        if (payee) {
            let payer
            payer = await User.findOne({personalID: payerID});
            let data
            //determine which currency balance to change
            switch (currency) {
                case '£':
                    //calculate new balances and generate transactions
                    data = transferMoney(payee.accountBalanceGBP, payer.accountBalanceGBP, payeeID, payerID.value, amount, currency)
                    if (data === false) {return res.status(400).json({msg: "Insufficient funds"})}
                    else {
                        //update balances
                        payee.accountBalanceGBP = data.payeeBalance
                        payer.accountBalanceGBP = data.payerBalance
                    }
                    break
                case '$':
                    data = transferMoney(payee.accountBalanceUSD, payer.accountBalanceUSD, payeeID, payerID.value, amount, currency)
                    if (data === false) {return res.status(400).json({msg: "Insufficient funds"})}
                    else {
                        payee.accountBalanceUSD = data.payeeBalance
                        payer.accountBalanceUSD = data.payerBalance
                    }
                    break
                case '€':
                    data = transferMoney(payee.accountBalanceEUR, payer.accountBalanceEUR, payeeID, payerID.value, amount, currency)
                    if (data === false) {return res.status(400).json({msg: "Insufficient funds"})}
                    else {
                        payee.accountBalanceEUR = data.payeeBalance
                        payer.accountBalanceEUR = data.payerBalance
                    }
                    break
            }
            //add transactions to arrays
            payer.transactions.push(data.transactionOut)
            payee.transactions.push(data.transactionIn)
            //add new recipient
            if (payeeID.__isNew__ !== undefined)
                payer.recipients.push({label: payeeID.label, value: payeeID.value})
            //save changes
            payee.save()
            payer.save()
            res.json()
        }
        else
            {return res.status(400).json({msg: "The payee doesn't exist"})}
    }
    catch(err) {
        res.status(500).json({ error: err.message });
    }
})

router.post("/updateData", async (req, res) =>{
    try{
        const {PID} = req.body
        //fetch data
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
        //check required data
        if ((!cardNumber || !CVV))
            return res.status(400).json({msg: "One or more required fields are blank"})
        let userData
        //fetch and update user data
        userData = await User.findOne({personalID: PID})
        userData.cardNumber = aesEncrypt(cardNumber)
        userData.CVV = aesEncrypt(CVV)
        userData.frozenCard = frozen
        //save user data
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
        let {email, passwordOld, passwordNew, passwordCheck, phoneNum, firstName, lastName, personalID, accountBalanceGBP, accountBalanceUSD,
            accountBalanceEUR} = req.body;
        let oldUser
        oldUser = await User.findOne({personalID})
        //check all data is present
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
        //check if password is being changed
        if (passwordOld || passwordNew || passwordCheck) {
            //check all passwords data is valid
            const matchTrue = await bcrypt.compare(passwordOld, oldUser.password);
            if(!matchTrue)
                return res.status(400).json({msg: "Incorrect current password"})
            if (passwordNew !== passwordCheck)
                return res.status(400).json({msg: "Enter new password twice to ensure new password has been entered correctly"});
            if (!(passwordNew.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/)))
                return res.status(400).json({msg: "New password is not valid"});
            //hash password
            const salt = await bcrypt.genSalt();
            oldUser.password = await bcrypt.hash(passwordNew, salt);
        }
        //encrypt data
        oldUser.email = aesEncrypt(email)
        oldUser.firstName = aesEncrypt(firstName)
        oldUser.lastName = aesEncrypt(lastName)
        oldUser.phoneNum = aesEncrypt(phoneNum)
        if (accountBalanceGBP) {
            oldUser.accountBalanceGBP = aesEncrypt(parseFloat(accountBalanceGBP).toFixed(2))
        }
        if (accountBalanceUSD) {
            oldUser.accountBalanceUSD = aesEncrypt(parseFloat(accountBalanceUSD).toFixed(2))
        }
        if (accountBalanceEUR) {
            oldUser.accountBalanceEUR = aesEncrypt(parseFloat(accountBalanceEUR).toFixed(2))
        }
        //save data
        await oldUser.save()
        res.json()
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
})

function convertCurrency(balanceTo, balanceFrom, currencyTo, currencyFrom, symbolTo, symbolFrom, amount, personalID){
    //generate dat
    let date = new Date()
    date = aesEncrypt(String(("0" + date.getDate()).slice(-2) + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear()))
    //calculate new balances
    balanceTo = aesEncrypt(parseFloat(Number(aesDecrypt(balanceTo))
        + Number(money.convert(Number(amount), {from: currencyFrom, to: (currencyTo)}))).toFixed(2))
    balanceFrom = aesEncrypt(parseFloat(Number(aesDecrypt(balanceFrom))
        - Number(amount)).toFixed(2))
    //generate transactions
    const transactionOut = {date, amountIn: aesEncrypt(''), amountOut: aesEncrypt(String(amount)), account: personalID,
        balance: balanceFrom, currency: symbolFrom}
    const transactionIn = {date, amountIn: aesEncrypt(String(parseFloat(money.convert(Number(amount), {from: currencyFrom, to: currencyTo})).toFixed(2))),
        amountOut: aesEncrypt(''), account: personalID, balance: balanceTo, currency: symbolTo}
    return{balanceTo, balanceFrom, transactionOut, transactionIn}
}

router.post("/convert", async (req, res) =>{
    try{
        const {personalID, amount, to, from} = req.body
        //check all data is valid
        if (!(amount.match(/^\d+[.]\d{1,2}$/)) && !(amount.match(/^\d+$/)))
            return res.status(400).json({msg: "Please enter a monetary value"});
        if (to === from)
            return res.status(400).json({msg: "Please choose two different currencies"});
        let user
        user = await User.findOne({personalID: personalID});
        let data
        switch (from){
            //determine currency
            case '£':
                //check for sufficient funds
                if (parseFloat(Number(aesDecrypt(user.accountBalanceGBP)) - Number(amount)).toFixed(2) < 0)
                    return res.status(400).json({msg: "Insufficient funds"});
                switch (to) {
                    case '$':
                        //get new balances and generate new transactions
                        data = convertCurrency(user.accountBalanceUSD, user.accountBalanceGBP, "USD", "GBP", to, from, amount, personalID)
                        //update balances
                        user.accountBalanceUSD = data.balanceTo
                        user.accountBalanceGBP = data.balanceFrom
                        break
                    case '€':
                        data = convertCurrency(user.accountBalanceEUR, user.accountBalanceGBP, "EUR", "GBP", to, from, amount, personalID)
                        user.accountBalanceEUR = data.balanceTo
                        user.accountBalanceGBP = data.balanceFrom
                        break
                }
                break
            case '$':
                if (parseFloat(Number(aesDecrypt(user.accountBalanceUSD)) - Number(amount)).toFixed(2) < 0)
                    return res.status(400).json({msg: "Insufficient funds"});
                switch (to) {
                    case '£':
                        data = convertCurrency(user.accountBalanceGBP, user.accountBalanceUSD, "GBP", "USD", to, from, amount, personalID)
                        user.accountBalanceGBP = data.balanceTo
                        user.accountBalanceUSD = data.balanceFrom
                        break
                    case '€':
                        data = convertCurrency(user.accountBalanceEUR, user.accountBalanceUSD, "EUR", "USD", to, from, amount, personalID)
                        user.accountBalanceEUR = data.balanceTo
                        user.accountBalanceUSD = data.balanceFrom
                        break
                }
                break
            case '€':
                if (parseFloat(Number(aesDecrypt(user.accountBalanceEUR)) - Number(amount)).toFixed(2) < 0)
                    return res.status(400).json({msg: "Insufficient funds"});
                switch (to) {
                    case '£':
                        data = convertCurrency(user.accountBalanceGBP, user.accountBalanceEUR, "GBP", "EUR", to, from, amount, personalID,)
                        user.accountBalanceGBP = data.balanceTo
                        user.accountBalanceEUR = data.balanceFrom
                        break
                    case '$':
                        data = convertCurrency(user.accountBalanceUSD, user.accountBalanceEUR, "USD", "EUR", to, from, amount, personalID)
                        user.accountBalanceUSD = data.balanceTo
                        user.accountBalanceEUR = data.balanceFrom
                        break
                }
                break
        }
        //add new transactions to array
        user.transactions.push(data.transactionOut)
        user.transactions.push(data.transactionIn)
        //save changes
        user.save()
        res.json()
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
})

router.post("/getAll", async (req, res) => {
    try{
        //fetch all relevant user data
        let data = await User.find({}, {personalID: 1, firstName: 1, lastName: 1, role: 1, accountBalanceGBP: 1, accountBalanceUSD: 1, accountBalanceEUR: 1});
        for(let user of data){
            //decrypt user data
            user.firstName = {data: aesDecrypt(user.firstName)}
            user.lastName = {data: aesDecrypt(user.lastName)}
            user.accountBalanceGBP = {data: aesDecrypt(user.accountBalanceGBP)}
            user.accountBalanceUSD = {data: aesDecrypt(user.accountBalanceUSD)}
            user.accountBalanceEUR = {data: aesDecrypt(user.accountBalanceEUR)}
        }
        res.json(data)
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
})
module.exports = router;
