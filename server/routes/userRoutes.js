const router = require ("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

router.post("/register", async(req, res) => {
    try {
        let {email, password, passwordCheck, personalID, phoneNum, firstName, lastName} = req.body;

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

        const newUser = new User({
            email: aesEncrypt(email),
            password: passwordHash,
            personalID,
            phoneNum: aesEncrypt(phoneNum),
            firstName: aesEncrypt(firstName),
            lastName: aesEncrypt(lastName),
            accountBalance: 0.00,
            recipients: [],
            transactions: []
        })
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch(err){
        res.status(500).json({error: err.message} );
    }

});
router.post("/login", async (req, res) => {

    const {personalID, password} = req.body;
    //validate
    if((!personalID || !password))
        return res.status(400).json({msg: "One or more required fields are blank"})

    const user = await User.findOne({personalID: personalID});
    if(!user)
        return res.status(400).json({msg: "This user does not exist"});
    const matchTrue = await bcrypt.compare(password, user.password);
    if(!matchTrue)
        return res.status(400).json({msg: "Incorrect password"})
    const token = jwt.sign({id: user._id}, process.env.JWT_PWD)

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

    res.json({
        token,
        user: {
            id: user._id,
            personalID: user.personalID,
            email: {data: aesDecrypt(user.email)},
            phoneNum: {data: aesDecrypt(user.phoneNum)},
            firstName: {data: aesDecrypt(user.firstName)},
            lastName: {data: aesDecrypt(user.lastName)},
            accountBalance: user.accountBalance,
            recipients: user.recipients,
            transactions: user.transactions
        },
    });
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
        if (payee) {payee.accountBalance = (parseFloat(payee.accountBalance) + parseFloat(amount)).toFixed(2)}
        else{return res.status(400).json({msg: "The payee doesn't exist"})}
        const date = new Date()
        payee.transactions.push({date: ("0" + date.getDate()).slice(-2) + '-' + ("0" + (date.getMonth() + 1)).slice(-2)
            + '-' + date.getFullYear(), amountIn: amount, amountOut: '', account: payerID, balance: payee.accountBalance})
        let payer
        payer = await User.findOne({personalID: payerID});
        payer.accountBalance = (parseFloat(payer.accountBalance) - parseFloat(amount)).toFixed(2)
        if (payer.accountBalance < 0)
            return res.status(400).json({msg: "Insufficient funds"});
        payer.transactions.push({date: ("0" + date.getDate()).slice(-2) + '-' + ("0" + (date.getMonth() + 1)).slice(-2)
            + '-' + date.getFullYear(), amountIn: '', amountOut: amount, account: payeeID.value, balance: payer.accountBalance})
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
            if(transaction.amountIn !== ''){
                transaction.amountIn = '£' + parseFloat(transaction.amountIn).toFixed(2)
            }
            if(transaction.amountOut !== ''){
                transaction.amountOut = '£' + parseFloat(transaction.amountOut).toFixed(2)
            }
            transaction.balance = '£' + transaction.balance
        }
        res.json(userData)
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


module.exports = router;
