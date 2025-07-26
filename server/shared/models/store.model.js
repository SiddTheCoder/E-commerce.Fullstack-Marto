import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    storeName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    logo: {
      type: String,
    },
    banner: {
      type: String,
    },
    category: {
      type: String,
      enum: [
        // 📚 Books & Education
        "Books",
        "Stationery & Office Supplies",
        "Educational Toys",
        "School & College Essentials",

        // 📱 Electronics & Appliances
        "Mobiles & Tablets",
        "Laptops & Accessories",
        "TVs & Home Entertainment",
        "Cameras & Photography",
        "Audio Devices",
        "Smartwatches & Wearables",
        "Home Appliances",
        "Kitchen Appliances",
        "Chargers & Cables",
        "Computer Components",

        // 🛍️ Fashion & Lifestyle
        "Men's Clothing",
        "Women's Clothing",
        "Kids & Baby Wear",
        "Footwear",
        "Watches & Accessories",
        "Jewelry",
        "Eyewear",
        "Bags, Wallets & Luggage",

        // 🏠 Home & Living
        "Furniture",
        "Home Decor",
        "Lighting",
        "Kitchen & Dining",
        "Bedding & Bath",
        "Cleaning & Laundry",
        "Tools & Home Improvement",

        // 🧂 Grocery & Essentials
        "Food Staples",
        "Snacks & Instant Food",
        "Beverages",
        "Personal Care",
        "Baby Care",
        "Health & Hygiene",
        "Pet Food & Supplies",
        "Household Supplies",

        // 🎮 Hobbies, Games & Entertainment
        "Musical Instruments",
        "Board Games & Puzzles",
        "Toys",
        "Video Games & Consoles",
        "Fitness Equipment",
        "Books & Magazines",
        "Craft & DIY Supplies",

        // 🚗 Automotive
        "Car Accessories",
        "Motorbike Accessories",
        "Lubricants & Oils",
        "Car Care & Cleaning",
        "Spare Parts & Tools",

        // 🏢 Office, Stationery & Industrial
        "Office Electronics",
        "Office Furniture",
        "Business Equipment",
        "Safety & Security",
        "Construction Tools",
        "Printers & Ink",

        // 🌄 Travel & Outdoors
        "Camping & Hiking Gear",
        "Travel Accessories",
        "Outdoor Clothing",
        "Luggage & Backpacks",

        // 🧵 Handmade, Local & Cultural
        "Nepali Handicrafts",
        "Pashmina & Woolen Products",
        "Religious & Spiritual Items",
        "Folk Instruments",
        "Organic & Local Goods",

        // 🏷️ Our Brands (Custom Category)
        "SiddyWear (Our Brand)",
        "SiddyKitchen (Our Brand)",
        "SiddyGadget (Our Brand)",
        "SiddyCare (Our Brand)",

        // 💡 Others
        "Gift Items",
        "Seasonal Specials",
        "Flash Deals",
      ],
      required: true,
    },
    contactEmail: {
      type: String,
      trim: true,
    },
    contactNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
    socialLinks: {
      instagram: String,
      facebook: String,
      website: String,
    },
    storeId: {
      type: String,
    },
    lastStoreNameUpdate: {
      type: Date,
      default: null,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    shippingTimeScore: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
);

export const Store = mongoose.model('Store',storeSchema)  
  