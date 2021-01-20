const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const speakeasy = require("speakeasy");

router.post("/register", async (req, res) => {
    try {
        let {email, password, passwordCheck, personalID, phoneNum, firstName, lastName} = req.body;

        //Encrypts data using aes, returns the encrypted data, the iv, and the key all as hexadecimal strings
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

        // Validate the users registration details
        //Checks none of the fields are blank
        if (!email || !password || !passwordCheck || !personalID || !phoneNum || !firstName || !lastName)
            return res.status(400).json({msg: "One or more required fields are blank"});
        //Checks the firstname and last name are only contain valid characters
        if (!(firstName.match(/^[A-Za-z\-]+$/)) || (!(lastName.match(/^[A-Za-z\-]+$/))))
            return res.status(400).json({msg: "Please ensure only letters are used for the first name and last name fields"});
        //Checks the password and password check are the same
        if (password !== passwordCheck)
            return res.status(400).json({msg: "Enter password twice to ensure password has been entered correctly"});
        //Checks the email address is not already associated with an account
        const emails = await User.find({}, {email: 1});
        for (let item of emails) {
            if (aesDecrypt(item.email) === email) {
                return res.status(400).json({msg: "An account with this email already exists."});
            }
        }
        //Checks the phone number is not already associated with an account
        const phoneNums = await User.find({}, {phoneNum: 1});
        for (let item of phoneNums) {
            if (aesDecrypt(item.phoneNum) === phoneNum) {
                return res.status(400).json({msg: "An account with this phone number already exists."});
            }
        }
        const existingPID = await User.findOne({personalID: personalID});
        if (existingPID)
            return res.status(400).json({msg: "An account with this personal ID already exists."});
        if (!(email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)))
            return res.status(400).json({msg: "Email address is not valid, please enter a valid email, e.g. example@email.com"});
        if (!(password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/)))
            return res.status(400).json({msg: "Password is not valid"});
        if (!(personalID.match(/\d{11}$/)))
            return res.status(400).json({msg: "Please enter exactly 11 digits for the personal ID number"});

        //Generate salt and hash password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        let totpSecret = speakeasy.generateSecret({
            name: "StuBank Plc"
        });

        //Create a new user by using the information provided by the user (encrypted)
        const newUser = new User({
            email: aesEncrypt(email),
            password: passwordHash,
            personalID,
            phoneNum: aesEncrypt(phoneNum),
            firstName: aesEncrypt(firstName),
            lastName: aesEncrypt(lastName),
            accountBalance: 0.00,
            totpSecret: aesEncrypt(JSON.stringify(totpSecret))
        })
        //
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (err) {
        res.status(500).json({error: err.message});
    }

});
router.post("/login", async (req, res) => {

    const {personalID, password} = req.body;
    //validate users login details
    //Check none of the fields are blank
    if ((!personalID || !password))
        return res.status(400).json({msg: "One or more required fields are blank"})
    // Finds user by personal ID (personal ID's are unique)
    const user = await User.findOne({personalID: personalID});
    //Tells the user that this personal ID does not exist in the database
    if (!user)
        return res.status(400).json({msg: "This user does not exist"});
    //Checks the username and password match
    const matchTrue = await bcrypt.compare(password, user.password);
    if (!matchTrue)
        return res.status(400).json({msg: "Incorrect password"})
    //Create JSON web token
    const token = jwt.sign({id: user._id}, process.env.JWT_PWD)
    //Decrypts the information stored in the database
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
            totpSecret: JSON.parse(aesDecrypt(user.totpSecret))
        },
    });
});

router.delete("/delete", auth, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser);
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

router.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token)
            return res.json(false);
        const verified = jwt.verify(token, process.env.JWT_PWD);
        if (!verified) return res.json(false);
        const user = await User.findById(verified.id);
        if (!user)
            return res.json(false);
        return res.json(true);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
})

router.post("/transfer", async (req, res) => {
    try {
        const {payerID, payeeID, amount} = req.body
        if (payerID === payeeID)
            return res.status(400).json({msg: "This is your account. Please choose another"});
        if (!(payeeID.match(/^\d{11}$/)))
            return res.status(400).json({msg: "Please enter exactly 11 digits for the personal ID number"});
        if (!(amount.match(/^\d+[.]\d{1,2}$/)) && !(amount.match(/^\d+$/)))
            return res.status(400).json({msg: "Please enter a monetary value"});
        let payee
        payee = await User.findOne({personalID: payeeID});
        if (payee) {
            payee.accountBalance = (parseFloat(payee.accountBalance) + parseFloat(amount)).toFixed(2)
        } else {
            return res.status(400).json({msg: "The payee doesn't exist"})
        }
        let payer
        payer = await User.findOne({personalID: payerID});
        payer.accountBalance = (parseFloat(payer.accountBalance) - parseFloat(amount)).toFixed(2)
        if (payer.accountBalance < 0)
            return res.status(400).json({msg: "Insufficient funds"});
        payee.save()
        payer.save()
        res.json(payer.accountBalance)
    } catch (err) {
        res.status(500).json({error: err.message});
    }
})

router.post("/", auth, async (req, res) => {
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
