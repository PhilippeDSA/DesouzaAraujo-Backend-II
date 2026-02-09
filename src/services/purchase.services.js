import CartRepository from "../repositories/carts.repository.js";
import ProductRepository from "../repositories/products.repository.js";
import TicketRepository from "../repositories/tickets.repository.js";
import { v4 as uuidv4 } from "uuid";

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
const ticketRepository = new TicketRepository();

export default class PurchaseService {
    async purchaseCart(cartId, purchaserEmail) {
        const cart = await cartRepository.getById(cartId);
        if (!cart) throw new Error("Cart not found");

        let totalAmount = 0;
        const productsNotPurchased = [];

        for (const item of cart.products) {
            const product = await productRepository.getById(item.product._id);

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await productRepository.update(product._id, product);

                totalAmount += product.price * item.quantity;
            } else {
                productsNotPurchased.push(item);
            }
        }
        if (totalAmount === 0) {
            throw new Error("No Products could be purchased");
        }
        const ticket = await ticketRepository.create({
            code: uuidv4(),
            amount: totalAmount,
            purchaser: purchaserEmail
        });
        cart.products = productsNotPurchased;
        await cartRepository.update(cartId, cart);

        return {
            ticket,
            productsNotPurchased
        };
    }
}