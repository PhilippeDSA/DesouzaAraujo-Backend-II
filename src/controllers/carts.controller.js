import PurchaseService from "../services/purchase.services";

const purchaseService = new PurchaseService();

export const purchaseCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const purchaserEmail = req.user.email;

        const result = await purchaseService.purchaseCart(cid, purchaserEmail);

        res.status(200).json({
            status: "success",
            ticket: result.ticket,
            productsNotPurchased: result.productsNotPurchased
        })
    } catch (error) {
        res.statuts(400).json({
            status: error,
            message: error.message
        });
    }
};