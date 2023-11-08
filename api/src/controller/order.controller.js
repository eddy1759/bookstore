const Order = require('../models/order.model');
const User = require('../models/user.model');
const Tx = require('../models/transaction.model');
const httpStatus = require('http-status');

const createOrder = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ 
                status: false,
                message: 'User not found' 
            });
        }
        if (!req.body) {
            return res.status(httpStatus.BAD_REQUEST).json({ 
                status: false,
                message: 'Required fields missing' 
            });
        }
        // const { redirect_url, payment_method } = req.body;
        // if ( !redirect_url ||!payment_method ) {
        //     return res.status(httpStatus.BAD_REQUEST).json({ 
        //         status: false,
        //         message: 'Required fields missing' 
        //     });
        // }
        const tx_ref = `Eddy-tx-${Date.now()}`;
        const dto = {
            redirect_url: req.body.redirect_url,
            payment_method: req.body.payment_method,
            tx_ref: tx_ref,
            price: req.body.price,
            bookId: req.body.bookId,
        }
        const order = await Order.create(...dto, user._id);
        const tx_response 
        return res.status(httpStatus.CREATED).json({ status: true, 
            data: {
            order: order
        } });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

const getAllOrders = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ 
                status: false,
                message: 'User not found' 
            });
        }
        const orders = await Order.find({userId: user._id});
        return res.status(httpStatus.OK).json({ status: true, 
            data: {
            orders: orders
        } });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

const getOrderById = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ 
                status: false,
                message: 'User not found' 
            });
        }
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(httpStatus.NOT_FOUND).json({ 
                status: false,
                message: 'Order not found' 
            });
        }
        return res.status(httpStatus.OK).json({ status: true, 
            data: {
            order: order
        } });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

const confirmOrder = async (req, res) => {
    try {
        const { tx_ref, status } = req.body;
        const userId = req.user._id;

        if (!userId) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                status: false,
                message: 'Unauthorized'
            });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: false,
                message: 'User not found'
            });
        }
        if (!status) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: false,
                message: 'Transaction is required'
            });
        }
        if (status === "success" || status === "completed") {
            const requiredTx = await Tx.findOne({ tx_ref });
            if (!requiredTx) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: false,
                    message: 'Transaction not found'
                });
            }
            const orderToBeConfirmed = await Order.findOne({orderId: requiredTx.orderId})

            if (!orderToBeConfirmed) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: false,
                    message: 'Order not found'
                });
            }
            orderToBeConfirmed.orderStatus = "completed";
            await orderToBeConfirmed.save();
            return res.status(httpStatus.OK).json({
                status: true,
                message: 'Order confirmed successfully',
                data: {
                    order: orderToBeConfirmed
                }
            });

        } else {
            const requiredTx = await Tx.findOne({ tx_ref });
            if (!requiredTx) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: false,
                    message: 'Transaction not found'
                });
            }
            const orderToBeConfirmed = await Order.findOne({orderId: requiredTx.orderId})

            if (!orderToBeConfirmed) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: false,
                    message: 'Order not found'
                });
            }
            orderToBeConfirmed.orderStatus = "cancelled";
            await orderToBeConfirmed.save();
            return res.status(httpStatus.BAD_REQUEST).json({
                status: true,
                message: 'Order failed'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }     
}