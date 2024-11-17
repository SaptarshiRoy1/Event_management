const mongoose = require("mongoose")

var eventSchema = new mongoose.Schema({
    eventname:{type:String, default: "event"},
    date:{type:Date},
    location:{type:String,required:true},
    description:{type:String},

    ticketPrices:{type:Number},
    ticketId:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"ticket"
    }],
    Availability:{type:Number,default:10},
    refundPolicy:{type:String,drfault:"Non-Refundable"},
    
    createdBy:{
      type:String,
      default:"Authority"
    },

})

var eventModel = mongoose.model("events",eventSchema)
module.exports = eventModel