const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    // publickey:{
    //     type: String,
    //     required: true
    // },
    // privatekey:{
    //     type: String,
    //     required: true
    // },
    password: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    friendsId: {
        type: Array,
        default: []
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

