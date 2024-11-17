
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    eventId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"events"
    },
    eventname:{type: String},
    attendeename:{type: String},
    username:{type: String},
    email: { type: String, required:true},
    // ticketType: {
    //     type: String,
    //     required: true
    // },
    price: {
        type: Number,
    },
    organizers:{
        type:String,
        default:"Authority"
    }
    
});

const Ticket = mongoose.model('ticket', ticketSchema);
module.exports = Ticket;
