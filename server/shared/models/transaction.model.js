import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      unique: true,
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Esewa", "Khalti", "Card", "COD"],
      default: "COD",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },
    gatewayResponse: {
      type: Object, // Store raw response from gateway (optional)
    },
    paidAt: Date,
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
