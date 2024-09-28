const mongoose = require("mongoose")

var eventSchema = new mongoose.Schema({
    eventname:{type:String, default: "event"},
    date:{type:Date},
    location:{type:String,required:true},
    description:{type:String}
})

var eventModel = mongoose.model("events",eventSchema)
module.exports = eventModel