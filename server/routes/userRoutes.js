const router = require ("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

router.post("/register", async(req, res) => {
    try {
        let {email, password, passwordCheck, personalID, phoneNum} = req.body;
        // validate
        if(!email || !password || !passwordCheck || !personalID || !phoneNum)
            return res.status(400).json({msg: "One or more required fields are blank"});
        // if(password.length < 8)
        //     return res.status(400).json({msg: "Password needs to be at least 8 characters long"});
        if(password !== passwordCheck)
            return res.status(400).json({msg: "Enter password twice to ensure password has been entered correctly"});
        const existingEmail = await User.findOne({email: email});
        if(existingEmail)
            return res.status(400).json({msg: "An account with this email already exists."});
        const existingPID = await User.findOne({personalID: personalID});
        if(existingPID)
            return res.status(400).json({msg: "An account with this personal ID already exists."});
        const existingPhoneNum = await User.findOne({phoneNum: phoneNum});
        if(existingPhoneNum)
            return res.status(400).json({msg: "An account with this phone number already exists."});
        // if (!(phone.match(/\d{2}-\d{4}-\d{7}$/))) {
        //     res.status(400).json({msg: "Telephone is not valid, please enter a valid phone number of the form XX--XXXX-XXXXXXX"});
        // }
        if (!(email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)))
            return res.status(400).json({msg: "Email address is not valid, please enter a valid email, e.g. example@email.com"});
        if (!(password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/)))
            return res.status(400).json({msg: "Password is not valid"});
        if (!(personalID.match(/\d{11}$/)))
            return res.status(400).json({msg: "Please enter exactly 11 digits for the personal ID number"});

        //encrypts data using aes, returns the encrypted data, the iv, and the key all as hexadecimal strings
        function aesEncrypt(data) {
            const crypto = require('crypto');
            const key = crypto.randomBytes(16).toString('hex');
            const iv = crypto.randomBytes(16);
            let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
            let encrypted = cipher.update(data);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            return {encryptedData: encrypted.toString('hex'), iv: iv.toString('hex'), key};
        }
        /*example of how to use aesEncrypt
        let example = aesEncrypt('example');
        let exampleData = example.encryptedData;
        console.log(example.iv);*/

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        console.log(passwordHash);

        const newUser = new User({
            email,
            password: passwordHash,
            personalID,
            phoneNum,
        })
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch(err){
        res.status(500).json({error: err.message} );
    }

});
router.post("/login", async (req, res) => {

    function aesDecrypt(text) {
        const crypto = require('crypto');
        const key = req.body.key;
        const iv = Buffer.from(req.body.iv, 'hex');
        let encryptedText = Buffer.from(text, 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

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
    res.json({
        token,
        user: {
            id: user._id,
            personalID: user.personalID,
        },
    });
    console.log("Token: " + token);
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

router.get("/", auth, async (req, res) => {
   const user = await User.findById(req.user);
   res.json({
       personalID: user.personalID,
       id: user._id,
   });
});


module.exports = router;
