const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 8},
    personalID: {type: String, required: true, unique: true},
    phoneNum: {type: String, required: true, unique: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
});

module.exports = User = mongoose.model("user", userSchema);