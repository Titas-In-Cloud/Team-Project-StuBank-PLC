const router = require ("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const speakeasy = require("speakeasy");

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

router.post("/register", async(req, res) => {
    try {
        let {email, password, passwordCheck, personalID, phoneNum, firstName, lastName} = req.body;

        // validate
        if(!email || !password || !passwordCheck || !personalID || !phoneNum || !firstName || !lastName)
            return res.status(400).json({msg: "One or more required fields are blank"});
        if (!(firstName.match(/^[A-Za-z\-]+$/) )||(!(lastName.match(/^[A-Za-z\-]+$/))))
            return res.status(400).json({msg: "Please ensure only letters are used for the first name and last name fields"});
        if(password !== passwordCheck)
            return res.status(400).json({msg: "Enter password twice to ensure password has been entered correctly"});

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
        /*const existingEmail = await User.findOne({email: email});
        if(existingEmail)
            return res.status(400).json({msg: "An account with this email already exists."});*/
        const existingPID = await User.findOne({personalID: personalID});
        if(existingPID)
            return res.status(400).json({msg: "An account with this personal ID already exists."});
        /*const existingPhoneNum = await User.findOne({phoneNum: phoneNum});
        if(existingPhoneNum)
            return res.status(400).json({msg: "An account with this phone number already exists."});*/
        // if (!(phone.match(/\d{2}-\d{4}-\d{7}$/))) {
        //     res.status(400).json({msg: "Telephone is not valid, please enter a valid phone number of the form XX--XXXX-XXXXXXX"});
        // }
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
            accountBalance: aesEncrypt('50'),
            totpSecret: aesEncrypt(JSON.stringify(totpSecret))
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
        for (let transaction of user.transactions) {
            transaction.date = aesDecrypt(new Map([['data', transaction.date.data], ['iv', transaction.date.iv], ['key', transaction.date.key]]))
            transaction.amountIn = aesDecrypt(new Map([['data', transaction.amountIn.data], ['iv', transaction.amountIn.iv], ['key', transaction.amountIn.key]]))
            transaction.amountOut = aesDecrypt(new Map([['data', transaction.amountOut.data], ['iv', transaction.amountOut.iv], ['key', transaction.amountOut.key]]))
            transaction.balance = aesDecrypt(new Map([['data', transaction.balance.data], ['iv', transaction.balance.iv], ['key', transaction.balance.key]]))
            if (transaction.amountIn !== '') {
                transaction.amountIn = '£' + parseFloat(transaction.amountIn).toFixed(2)
            }
            if (transaction.amountOut !== '') {
                transaction.amountOut = '£' + parseFloat(transaction.amountOut).toFixed(2)
            }
            transaction.balance = '£' + transaction.balance
        }
        res.json({
            token,
            user: {
                id: user._id,
                personalID: user.personalID,
                email: {data: aesDecrypt(user.email)},
                phoneNum: {data: aesDecrypt(user.phoneNum)},
                firstName: {data: aesDecrypt(user.firstName)},
                lastName: {data: aesDecrypt(user.lastName)},
                accountBalance: {data: aesDecrypt(user.accountBalance)},
                recipients: user.recipients,
                transactions: user.transactions,
                totpSecret: JSON.parse(aesDecrypt(user.totpSecret))
            },
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
        const {payerID, payeeID, amount} = req.body
        if (payerID === payeeID.value)
            return res.status(400).json({msg: "This is your account. Please choose another"});
        if (!(payeeID.value.match(/^\d{11}$/)))
            return res.status(400).json({msg: "Please enter exactly 11 digits for the personal ID number"});
        if (!(amount.match(/^\d+[.]\d{1,2}$/)) && !(amount.match(/^\d+$/)))
            return res.status(400).json({msg: "Please enter a monetary value"});
        let payee
        payee = await User.findOne({personalID: payeeID.value});
        if (payee) {payee.accountBalance = aesEncrypt((parseFloat(aesDecrypt(payee.accountBalance)) +
            parseFloat(amount)).toFixed(2))}
        else{return res.status(400).json({msg: "The payee doesn't exist"})}
        const date = new Date()
        payee.transactions.push({date: aesEncrypt(String(("0" + date.getDate()).slice(-2) + '-' +
                ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear())), amountIn: aesEncrypt(amount),
            amountOut: aesEncrypt(''), account: payerID, balance: payee.accountBalance})
        let payer
        payer = await User.findOne({personalID: payerID});
        payer.accountBalance = aesEncrypt((parseFloat(aesDecrypt(payer.accountBalance)) -
            parseFloat(amount)).toFixed(2))
        if (payer.accountBalance < 0)
            return res.status(400).json({msg: "Insufficient funds"});
        payer.transactions.push({date: aesEncrypt(String(("0" + date.getDate()).slice(-2) + '-' +
                ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear())), amountIn: aesEncrypt(''),
            amountOut: aesEncrypt(amount), account: payeeID.value, balance: payer.accountBalance})
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
        let userData = await User.findOne({personalID: PID}, {accountBalance: 1, recipients: 1, transactions: 1})
        for(let transaction of userData.transactions){
            transaction.date = aesDecrypt(new Map([['data', transaction.date.data],['iv', transaction.date.iv],['key', transaction.date.key]]))
            transaction.amountIn = aesDecrypt(new Map([['data', transaction.amountIn.data],['iv', transaction.amountIn.iv],['key', transaction.amountIn.key]]))
            transaction.amountOut = aesDecrypt(new Map([['data', transaction.amountOut.data],['iv', transaction.amountOut.iv],['key', transaction.amountOut.key]]))
            transaction.balance = aesDecrypt(new Map([['data', transaction.balance.data],['iv', transaction.balance.iv],['key', transaction.balance.key]]))
            if(transaction.amountIn !== ''){
                transaction.amountIn = '£' + parseFloat(transaction.amountIn).toFixed(2)
            }
            if(transaction.amountOut !== ''){
                transaction.amountOut = '£' + parseFloat(transaction.amountOut).toFixed(2)
            }
            transaction.balance = '£' + transaction.balance
        }
        res.json({accountBalance: aesDecrypt(userData.accountBalance), recipients: userData.recipients, transactions: userData.transactions})
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
})
router.get("/", auth, async (req, res) => {
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


module.exports = router;
