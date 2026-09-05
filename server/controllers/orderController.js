import asyncHandler from "express-async-handler";

import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import Brand from "../models/brandModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";



export const getAllOrdersAdmin = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
    const status = req.query.status;
    const paymentStatus = req.query.paymentStatus;


    const filter = {};
    if (status && status !== "all") {
        filter.status = status;
    }
    if (paymentStatus && paymentStatus !== "all") {
        if (paymentStatus === "paid") {
            filter.status = { $in: ["paid", "completed"] };
        } else if (paymentStatus === "pending") {
            filter.status = "pending";
        } else if (paymentStatus === 'failed') {
            filter.status = "cancelled";
        }
    }

    const skip = (page - 1) * perPage;

    const orders = await Order.find(filter)
        .populate("userId", "name email")
        .populate("items.productId", "name price image")
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(perPage);

    const total = await Order.countDocuments(filter);
    const totalPages = Math.ceil(total / perPage);

    const transformedOrders = orders.map((order) => ({
        // FIX: was `orders._id` (the whole array) — now uses the loop variable `order`
        _id: order._id,
        orderId: `ORD-${order._id.toString().slice(-6).toUpperCase()}`,

        user: {
            _id: order.userId._id,
            name: order.userId.name,
            email: order.userId.email,
        },
        items: order.items.map((item) => ({
            product: {
                _id: item.productId._id,
                name: item.productId.name,
                price: item.productId.price,
                image: item.productId.image,

            },

            quantity: item.quantity,
            price: item.price,
        })),
        totalAmount: order.total,
        status: order.status,
        paymentStatus:
            order.status === "paid" || order.status === "completed"
                ? "paid"
                : order.status === "cancelled"
                    ? "failed"
                    : "pending",
        shippingAddress: order.shippingAddress || {
            street: "N/A",
            city: "N/A",
            state: "N/A",
            postalCode: "N/A",
            country: "N/A",
        },

        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    }));

    res.json({
        orders: transformedOrders,
        total,
        totalPages,
        currentPage: page
    })


});

// GET /api/orders - logged-in user's own orders
export const getOrders = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

    const filter = { userId: req.user._id };

    const skip = (page - 1) * perPage;

    const orders = await Order.find(filter)
        .populate("items.productId", "name price image")
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(perPage);

    const total = await Order.countDocuments(filter);
    const totalPages = Math.ceil(total / perPage);

    const transformedOrders = orders.map((order) => ({
        _id: order._id,
        orderId: `ORD-${order._id.toString().slice(-6).toUpperCase()}`,
        items: order.items.map((item) => ({
            product: {
                _id: item.productId._id,
                name: item.productId.name,
                price: item.productId.price,
                image: item.productId.image,
            },
            quantity: item.quantity,
            price: item.price,
        })),
        totalAmount: order.total,
        status: order.status,
        paymentStatus:
            order.status === "paid" || order.status === "completed"
                ? "paid"
                : order.status === "cancelled"
                    ? "failed"
                    : "pending",
        shippingAddress: order.shippingAddress || {
            street: "N/A",
            city: "N/A",
            state: "N/A",
            postalCode: "N/A",
            country: "N/A",
        },
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    }));

    res.json({
        orders: transformedOrders,
        total,
        totalPages,
        currentPage: page,
    });
});

// GET /api/orders/:id - single order, owner or admin only
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate("userId", "name email")
        .populate("items.productId", "name price image");

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = order.userId._id.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
        res.status(403);
        throw new Error("Not authorized to view this order");
    }

    const transformedOrder = {
        _id: order._id,
        orderId: `ORD-${order._id.toString().slice(-6).toUpperCase()}`,
        user: {
            _id: order.userId._id,
            name: order.userId.name,
            email: order.userId.email,
        },
        items: order.items.map((item) => ({
            product: {
                _id: item.productId._id,
                name: item.productId.name,
                price: item.productId.price,
                image: item.productId.image,
            },
            quantity: item.quantity,
            price: item.price,
        })),
        totalAmount: order.total,
        status: order.status,
        paymentStatus:
            order.status === "paid" || order.status === "completed"
                ? "paid"
                : order.status === "cancelled"
                    ? "failed"
                    : "pending",
        shippingAddress: order.shippingAddress || {
            street: "N/A",
            city: "N/A",
            state: "N/A",
            postalCode: "N/A",
            country: "N/A",
        },
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    };

    res.json({
        success: true,
        order: transformedOrder,
    });
});

export const createOrderFromCart = asyncHandler(async (req, res) => {
    const { items, shippingAddress } = req.body;


    if (!items || !Array.isArray(items) || items.length === 0) {
        res.status(400);
        throw new Error("Cart items are required");
    }


    if (
        !shippingAddress ||
        !shippingAddress.street ||
        !shippingAddress.city ||
        !shippingAddress.country ||
        !shippingAddress.postalCode

    ) {
        res.status(400);
        throw new Error(
            "Shipping address is required with all fields (street , city , country , postalCode)"
        );
    }

    const validItems = items.map((item) => {
        // FIX: `!item.price` incorrectly rejects a legitimate 0-price item.
        // Check for null/undefined instead so free items aren't blocked.
        if (!item._id || !item.name || item.price == null || !item.quantity) {
            res.status(400);
            throw new Error("Invalid item structure");
        }

        return {
            productId: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
        };

    });


    const total = validItems.reduce((acc, item) => {
        return acc + item.price * item.quantity;
    }, 0);

    const order = await Order.create({
        userId: req.user._id,
        // FIX: was `item: validItems` — every other function (getAllOrdersAdmin,
        // populate("items.productId"), etc.) reads/writes the field as `items`.
        // Saving to `item` meant orders were created with no items in them.
        items: validItems,
        total,
        status: "pending",
        shippingAddress,

    });

    res.status(201).json({
        success: true,
        order,
        message: "Order created successfully"

    });
});


export const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error("Order not found ");
    }

    if (
        req.user.role !== "admin"
    ) {
        res.status(403);
        throw new Error("Not authorized to delete this order");
    }

    // FIX: the function previously ended here — it never actually deleted
    // the order and never sent a response, so the request would hang until
    // the client timed out.
    await order.deleteOne();

    res.json({
        success: true,
        message: "Order deleted successfully",
    });
})

export const updateOrderStatus = asyncHandler(async (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "Request body is missing",
        });
    }

    const { status, paymentIntentId, stripeSessionId } = req.body;

    const validStatuses = ["pending", "paid", "completed", "cancelled"];

    if (!status || !validStatuses.includes(status)) {
        res.status(400);

        throw new Error(
            "Invalid status . Must be one of: pending , paid , completed, cancelled"
        );
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    // FIX: isAdmin / isOwner / isPending were referenced below but never
    // declared anywhere — this threw a ReferenceError on every call.
    const isAdmin = req.user.role === "admin";
    const isOwner = order.userId.toString() === req.user._id.toString();
    const isPending = order.status === "pending";

    if (!isAdmin && (!isOwner || !isPending)) {
        res.status(403);
        throw new Error(
            isPending
                ? "Not authorized to update this order"
                : "Order status can only be updated by admin after payment"
        )
    }


    const updateData = {
        status,
        updatedAt: new Date(),
    };

    if (status === "paid") {
        if (paymentIntentId) {
            updateData.paymentIntentId = paymentIntentId;
        }
        if (stripeSessionId) {
            updateData.stripeSessionId = stripeSessionId;

        }

        updateData.paidAt = new Date();

    }

    const updateOrder = await Order.findByIdAndUpdate(

        req.params.id,

        updateData,
        {
            new: true,
            runValidators: false, //disable validation 

        }


    );

    res.json({
        success: true,
        order: updateOrder,
        message: `Order status updated to ${status}`,

    });


});