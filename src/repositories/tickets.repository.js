import { TicketModel } from "../models/ticket.model.js";

export default class TicketRepository {
    async create(ticketData) {
        return await TicketModel.create(ticketData);
    }
}