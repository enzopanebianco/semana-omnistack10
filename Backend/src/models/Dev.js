const Mongoose = require('mongoose') 
const PointShcema = require('./utils/PointSchema')
const DevSchema = new Mongoose.Schema({
    name:String,
    github_username:String,
    bio:String,
    avatar_url:String,
    techs:[
        String
    ],
    location:{
        type:PointShcema,
        index:'2dsphere'
    }
})
module.exports = Mongoose.model('Dev',DevSchema)