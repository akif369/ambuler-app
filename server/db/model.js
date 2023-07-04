
const mongoose = require('mongoose');


const userSchme = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },number:{
        type: Number,
        require: true
    },password:{
        type: String,
        require: true
    },isEmergency:{
        type: Boolean,
        require: true
    },lat:{
        type: Number,
        require: true
    },
    lng:{
        type: Number,
        require: true
    }
})

const driveScheme = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },number:{
        type: Number,
        require: true
    },password:{
        type: String,
        require: true
    },isEmergency:{
        type: Boolean,
        require: true
    },lat:{
        type: Number,
        require: true
    },
    lng:{
        type: Number,
        require: true
    },
    isActive:{
        require:true,
        type:Boolean
    },
    customer:{
        type: String,
        require: true
    }
})
 
  
const userModel = new mongoose.model("user", userSchme)
const driverModel = new mongoose.model("driver", driveScheme)

module.exports = {userModel,driverModel}
