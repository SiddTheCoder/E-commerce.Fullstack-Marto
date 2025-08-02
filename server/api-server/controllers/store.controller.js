import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Store } from "../../shared/models/store.model.js";
import { v4 as uuidv4 } from "uuid";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../../shared/models/user.model.js";
import dayjs from "dayjs";
import sendMail from "../utils/sendMail.js";
import { Product } from "../../shared/models/product.model.js";

export const createStore = asyncHandler(async (req, res) => {
  const {
    storeName,
    description,
    category,
    contactEmail,
    contactNumber,
    address,
    socialLinks,
  } = req.body;

  if (
    [storeName, category, contactEmail, contactNumber, address].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "Basic Fields are required");
  }

  const existingStore = await Store.findOne({ storeName });
  if (existingStore) {
    throw new ApiError(409, "Store name already taken");
  }

  //handling file (logo,banner)
  const logoLocalPath = req.files?.logo?.length ? req.files.logo[0].path : null;
  const bannerLocalPath = req.files?.banner?.length
    ? req.files.banner[0].path
    : null;

  let logoUrl;
  let bannerUrl;

  if (logoLocalPath) {
    const response = await uploadOnCloudinary(logoLocalPath);
    if (response) {
      logoUrl = response.url;
    }
  }

  if (bannerLocalPath) {
    const response = await uploadOnCloudinary(bannerLocalPath);
    if (response) {
      bannerUrl = response.url;
    }
  }

  // store ID
  const storeId = uuidv4();

  const store = await Store.create({
    owner: req.user?._id,
    storeName,
    description:
      description?.trim() || `Find all your needs here at ${storeName}`,
    logo: logoUrl || null,
    banner: bannerUrl || null,
    category,
    contactEmail,
    contactNumber,
    address,
    socialLinks: socialLinks || null,
    storeId,
  });

  await User.findByIdAndUpdate(req.user._id, {
    $push: { stores: store._id },
  });

  await sendMail({
    to: req.user?.email,
    subject: "🎉 Congratulations! Your Store is Live on Anbari!",
    html: `
      <div style="max-width:600px;margin:auto;font-family:'Segoe UI',sans-serif;background:#fff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#7C3AED,#3B82F6);padding:20px;text-align:center;color:white;">
          <h1 style="margin:0;">Welcome to the Anbari Seller Family!</h1>
        </div>
  
        <!-- Illustration -->
        <div style="text-align:center;padding:20px 0;">
          <img src="https://cdn-icons-png.flaticon.com/512/747/747376.png" alt="Welcome Seller" width="150" style="opacity:0.9;" />
        </div>
  
        <!-- Body content -->
        <div style="padding:30px;text-align:center;">
          <p style="font-size:16px;color:#4B5563;">Hi <strong>${
            req.user?.fullName
          }</strong>,</p>
          <p style="font-size:15px;color:#6B7280;">Congratulations on successfully creating your store <strong>${storeName}</strong> on <strong>Anbari</strong>! 🎉</p>
          <p style="font-size:15px;color:#6B7280;">You’ve taken your first step towards reaching thousands of customers and building your brand with us.</p>
  
          ${
            store.description
              ? `<p style="font-size:14px;color:#6B7280;"><em>"${store.description}"</em></p>`
              : ""
          }
  
          <p style="margin: 20px 0; font-size:16px; color:#10B981;"><strong>Your Store ID:</strong> ${
            store.storeId
          }</p>
  
          <a href="https://anbari.com/seller/dashboard" style="display:inline-block;margin-top:20px;background:#3B82F6;color:white;padding:12px 25px;text-decoration:none;border-radius:6px;font-weight:bold;">Visit Your Dashboard</a>
  
          <p style="font-size:13px;color:#9CA3AF;margin-top:30px;">From tracking orders to adding products and promotions, your dashboard has all the tools you need to thrive.</p>
        </div>
  
        <!-- Motivation & support -->
        <div style="padding:0 30px 30px;text-align:center;">
          <p style="font-size:14px;color:#6B7280;">Need help getting started? We’re here to support you every step of the way.</p>
          <p style="font-size:14px;color:#6B7280;">Keep creating. Keep growing. Keep inspiring.</p>
        </div>
  
        <!-- Footer with social links -->
        <div style="background:#F9FAFB;padding:20px;text-align:center;font-size:14px;color:#6B7280;">
          <p style="margin-bottom:10px;">Follow us for updates & tips:</p>
          <a href="https://facebook.com/siddthecoder" style="margin: 0 8px;" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="24" />
          </a>
          <a href="https://instagram.com/siddhant_.ydv" style="margin: 0 8px;" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram" width="24" />
          </a>
          <a href="https://github.com/siddthecoder" style="margin: 0 8px;" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" alt="GitHub" width="24" />
          </a>
          <a href="https://linkedin.com/in/siddthecoder" style="margin: 0 8px;" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn" width="24" />
          </a>
          <p style="margin-top:15px;font-size:12px;color:#9CA3AF;">&copy; ${new Date().getFullYear()} Anbari. All rights reserved.</p>
        </div>
      </div>
    `,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, store, "Store Created Successfully"));
});

export const checkStoreName = asyncHandler(async (req, res) => {
  const { storeName } = req.body;
  if (!storeName) {
    throw new ApiError(400, "Store Name is required");
  }
  const doStoreExist = await Store.findOne({ storeName: storeName });

  if (doStoreExist) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          isNameAvailable: false,
          checkedFor: storeName,
        },
        "Store name is not available."
      )
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isNameAvailable: true, checkedFor: storeName },
        "Store name is available."
      )
    );
});

export const updateStoreCredentials = asyncHandler(async (req, res) => {
  const {
    storeName,
    description,
    contactEmail,
    contactNumber,
    address,
    socialLinks,
  } = req.body;
  const { storeId } = req.query;

  const logoFileExists = req.files?.logo?.length > 0;
  const bannerFileExists = req.files?.banner?.length > 0;

  if (
    !(
      description ||
      contactEmail ||
      contactNumber ||
      address ||
      socialLinks ||
      storeName ||
      logoFileExists ||
      bannerFileExists
    )
  ) {
    throw new ApiError(
      400,
      "Atleast one field is required to update credentials"
    );
  }

  if (!storeId) {
    throw new ApiError(400, "Store ID is required");
  }

  const store = await Store.findById(storeId);

  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  // Prevent storeName update if within 7 days
  if (storeName && store.storeName !== storeName) {
    const lastUpdated = store.lastStoreNameUpdate;
    const now = dayjs();

    if (lastUpdated && now.diff(dayjs(lastUpdated), "day") < 7) {
      throw new ApiError(
        403,
        `Store name can only be changed once every 14 days. Try again after ${dayjs(
          lastUpdated
        )
          .add(7, "day")
          .format("DD MMM YYYY")}`
      );
    }
  }

  // handling file if available
  const logoLocalPath = req.files?.logo?.length ? req.files.logo[0].path : null;
  const bannerLocalPath = req.files?.banner?.length
    ? req.files.banner[0].path
    : null;

  let logo, banner;

  if (logoLocalPath) {
    const res = await uploadOnCloudinary(logoLocalPath);
    if (res) {
      logo = res.url;
    }
  }
  if (bannerLocalPath) {
    const res = await uploadOnCloudinary(bannerLocalPath);
    if (res) {
      banner = res.url;
    }
  }

  // Prepare update object (    ...(condition && { key: value })  if conditon true then the object get added otherwise not  )
  const updatePayload = {
    ...(storeName && { storeName, lastStoreNameUpdate: new Date() }),
    ...(description && { description }),
    ...(contactEmail && { contactEmail }),
    ...(contactNumber && { contactNumber }),
    ...(address && { address }),
    ...(socialLinks && { socialLinks }),
    ...(logo && { logo }),
    ...(banner && { banner }),
  };

  const updatedStore = await Store.findByIdAndUpdate(storeId, updatePayload, {
    new: true,
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedStore,
        "Store credentials updated successfully"
      )
    );
});

export const toggleTheStoreLike = asyncHandler(async (req, res) => {
  const { storeId } = req.query;
  if (!storeId) {
    throw new ApiError(400, "Store ID is required");
  }

  const store = await Store.findById(storeId);
  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  const userId = req.user._id;
  const existingLikeIndex = store.likes.indexOf(userId);

  if (existingLikeIndex !== -1) {
    // User already liked -> unlike
    store.likes.splice(existingLikeIndex, 1);
  } else {
    // Not liked yet -> like
    store.likes.push(userId);
  }

  await store.save();

  return res
    .status(200)
    .json(new ApiResponse(200, store, "Store like toggled successfully"));
});

export const getAllStore = asyncHandler(async (req, res) => {
  // Find stores of user, sorted by createdAt descending (newest first)
  const stores = await Store.find({ owner: req.user._id }).sort({
    createdAt: -1,
  });

  // Populate products and sort products by createdAt descending for each store
  const storesWithProducts = await Promise.all(
    stores.map(async (store) => {
      // populate products
      await store.populate({
        path: "products",
        options: { sort: { createdAt: -1 } }, // newest products first
      });
      return store;
    })
  );

  if (!storesWithProducts.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No store created yet"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, storesWithProducts, "Stores fetched successfully")
    );
});

export const getStoreById = asyncHandler(async (req, res) => {
  // Find stores of user, sorted by createdAt descending (newest first)
  const { storeId } = req.query;
  const store = await Store.findOne({ _id: storeId })
    .populate("products")
    .sort({
      createdAt: -1,
    });

  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, store, "Stores fetched successfully"));
});

export const likeStore = asyncHandler(async (req, res) => {
  const { storeId } = req.query;
  if (!storeId) {
    throw new ApiError(400, "Store ID is required");
  }

  const store = await Store.findById(storeId).populate("products");
  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  const userId = req.user._id;

  const existingLikeIndex = store.likes.indexOf(userId);

  if (existingLikeIndex !== -1) {
    // User already liked -> unlike
    store.likes.splice(existingLikeIndex, 1);
    req.user.likedStores.pull(storeId);
  } else {
    // Not liked yet -> like
    store.likes.push(userId);
    req.user.likedStores.push(storeId);
  }

  await req.user.save();
  await store.save();

  return res
    .status(200)
    .json(new ApiResponse(200, store, "Store like toggled successfully"));
});
