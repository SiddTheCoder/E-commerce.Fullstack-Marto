import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { generateJWTToken } from "../config/jwt.js";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    avatar: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    address: {
      type: String,
    },
    shippingAddress: {
      type: String,
    },
    city: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    country: {
      type: String,
    },
    district: {
      type : String,
    },
    likedStores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
    socialHandles: [],

    role: {
      type: String,
      enum: ["consumer", "seller", "admin"],
      default: "consumer",
    },
    wishListProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    //if seller then
    stores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
      },
    ],
    // tokens
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
    sellerId: {
      type: String,
      default: null,
    },
    isDashboardVisited: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

//bcrypt password just before saving the userSchema
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//creating new method to compare password using bcrypt
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// generate access token
userSchema.methods.generateAccessToken = function () {
  return generateJWTToken(
    {
      _id: this._id,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    process.env.ACCESS_TOKEN_EXPIRY
  );
};

//generate refresh Token
userSchema.methods.generateRefreshToken = function () {
  return generateJWTToken(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    process.env.REFRESH_TOKEN_EXPIRY
  );
};

//generate SellerId
userSchema.methods.generateSellerId = function () {
  if (!this.isSeller && !this.sellerId) {
    const uniqueId = uuidv4();
    this.sellerId = `anbari-${uniqueId}`;
    this.isSeller = true;
    return this.sellerId;
  }
  return this.sellerId;
};

export const User = mongoose.model("User", userSchema);
