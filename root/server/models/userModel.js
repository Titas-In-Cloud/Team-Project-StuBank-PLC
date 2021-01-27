const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {type: Map, of: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 8},
    personalID: {type: String, required: true, unique: true},
    phoneNum: {type: Map, of: String, required: true, unique: true},
    firstName: {type: Map, of: String, required: true},
    lastName: {type: Map, of: String, required: true},
    accountBalanceGBP: {type: Map, of: String, required: true},
    accountBalanceUSD: {type: Map, of: String, required: true},
    accountBalanceEUR: {type: Map, of: String, required: true},
    recipients: {type: [Map], of: String, required: true},
    transactions: {type: [Object], required: true},
    totpSecret: {type: Map, of: String, required: true},
    cardNumber: {type: Map, of: String, required: true},
    CVV: {type: Map, of: String, required: true},
    frozenCard: {type: Boolean, required: true}
});

module.exports = User = mongoose.model("user", userSchema);