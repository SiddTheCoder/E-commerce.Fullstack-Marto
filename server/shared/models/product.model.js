import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    images: [String],
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
    },
    tags: [String],
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    ratingData: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        ratingValue: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        review: {
          type: String,
          default: "",
        },
        ratedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isDropshipped: {
      type: Boolean,
      default: false,
    },
    supplierType: {
      type: String,
      enum: ["api", "manual", "self"], // self = from your own store
      default: "self",
    },
    externalId: {
      type: String,
      default: null, // Used to map products from external dropshipping APIs
    },
    dropshipInfo: {
      supplierName: String,
      apiSource: String, // Example: "Seel", "CJ", etc.
      productUrl: String,
      warehouseLocation: String,
      costPrice: Number,
      shippingTime: String, // e.g., "5-10 days"
    },

    ratings: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    features: {
      type: [String], // Array of strings
      //  "features": ["Bluetooth 5.0", "Noise Cancellation", "20-Hour Battery", "Water Resistant"]
      default: [], // Optional: start with empty array
    },
    warranty: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
