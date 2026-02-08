import mongoose from "mongoose";


const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
    },
    purchase_date_time: {
        type: Date,
        default: Date.now,

    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true,
    },
})

export const ticketModel = mongoose.model("Ticket", ticketSchema);