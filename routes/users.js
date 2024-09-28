// var express = require('express');
// var router = express.Router();
const plm = require("passport-local-mongoose")

const mongoose = require('mongoose')
// mongoose.connect("mongodb://127.0.0.1:27017/EventManagement")
//For MongoDB Atlass Database connect
mongoose.connect("mongodb+srv://sap:Sr721121@cluster0.ovsalvk.mongodb.net/")

const userSchema = new mongoose.Schema({
  username: {type:String, unique:true, required:true},
  email: { type: String, unique: true, required: true },
  password: { type: String,},
  fullname:{type:String,required:true},

  events:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"events"
  }]
});

userSchema.plugin(plm);

const user = mongoose.model('user',userSchema);
module.exports = user;
