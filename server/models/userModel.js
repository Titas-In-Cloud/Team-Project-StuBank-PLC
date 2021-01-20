const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {type: Map, of: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 8},
    personalID: {type: String, required: true, unique: true},
    phoneNum: {type: Map, of: String, required: true, unique: true},
    firstName: {type: Map, of: String, required: true},
    lastName: {type: Map, of: String, required: true},
    accountBalance: {type: Number, required: true},
    recipients: {type: [Object], required: true},
    transactions: {type: [Object], required: true}
});

module.exports = User = mongoose.model("user", userSchema);