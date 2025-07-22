import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // or 'Seller' if you have separate schema
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing'
    },
    isDelivered: {
      type: Boolean,
      default: false
    },
    deliveredAt: Date,
    orderPlacedAt: {
      type: Date,
      default: Date.now
    },
    seenBySeller: {
      type: Boolean,
      default: false // to track whether seller has seen the order or not
    }
  }
],
    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      postalCode: String,
      district: String,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Esewa", "Khalti", "Card"],
      default: "COD",
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    totalAmount: Number,
  },
  { timestamps: true }
);


export const Order = mongoose.model('Order',orderSchema)
