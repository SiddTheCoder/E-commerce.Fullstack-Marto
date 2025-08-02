import { Product } from "../../shared/models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Store } from "../../shared/models/store.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../../shared/models/user.model.js";

export const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    discount,
    category,
    stock,
    features,
    isFeatured,
    storeId,
    subCategory,
  } = req.body;

  if (
    [
      title,
      description,
      price,
      discount,
      category,
      stock,
      features,
      isFeatured,
      subCategory
    ].some((field) => field === "")
  ) {
    throw new ApiError(400, "Basic Fields are required");
  }

  if (!storeId) {
    throw new ApiError(400, "StoreId is required");
  }

  const store = await Store.findById(storeId);
  if (!store) {
    throw new ApiError(500, "Store not found with such storeId");
  }

  // handling file
  const pictures = req.files;
  console.log(pictures);
  const imagesUrls = [];

  if (pictures) {
    const pictureArray = Array.isArray(pictures) ? pictures : [pictures];

    for (const picture of pictureArray) {
      const res = await uploadOnCloudinary(picture.path);
      if (res) {
        imagesUrls.push(res.url);
      }
    }
  }

  const newProduct = await Product.create({
    seller: req.user._id,
    store: storeId,
    title,
    description,
    price,
    discount,
    category,
    subCategory,
    stock,
    isFeatured,
    features: Array.isArray(features) ? features : features.split(","),
    images: imagesUrls,
  });

  if (!newProduct) {
    throw new ApiError(500, "Failed to create new product");
  }

  store.products?.push(newProduct?._id);
  await store.save();

  return res
    .status(200)
    .json(new ApiResponse(200, newProduct, "Product Created Successfully"));
});

export const updateProductCredentials = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    discount,
    category,
    stock,
    isFeatured,
    features,
  } = req.body;

  const { productId } = req.query;
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const picturesExist = req.files?.images?.length > 0;

  const hasUpdateFields =
    "title" in req.body ||
    "description" in req.body ||
    "price" in req.body ||
    "discount" in req.body ||
    "category" in req.body ||
    "stock" in req.body ||
    "isFeatured" in req.body ||
    "features" in req.body ||
    picturesExist;

  if (!hasUpdateFields) {
    throw new ApiError(400, "At least one field is required");
  }

  const picturesLocalPath = req.files?.images;
  const imagesUrls = [];

  if (picturesLocalPath) {
    const pictureArray = Array.isArray(picturesLocalPath)
      ? picturesLocalPath
      : [picturesLocalPath];

    for (const picture of pictureArray) {
      const res = await uploadOnCloudinary(picture);
      if (res) {
        imagesUrls.push(res.url);
      }
    }
  }

  const updatePayload = {
    ...("title" in req.body && { title }),
    ...("description" in req.body && { description }),
    ...("price" in req.body && { price }),
    ...("discount" in req.body && { discount }),
    ...("category" in req.body && { category }),
    ...("stock" in req.body && { stock }),
    ...("isFeatured" in req.body && { isFeatured }),
    ...("features" in req.body && { features }),
    ...(picturesExist && { images: imagesUrls }),
  };

  const product = await Product.findByIdAndUpdate(productId, updatePayload, {
    new: true,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, product, "Product Credentials Updated Successfully")
    );
});

export const rateTheProduct = asyncHandler(async (req, res) => {
  const { productId } = req.query;
  const { ratingValue, review } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
    throw new ApiError(400, "Rating value must be between 1 and 5");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "No product found with the provided ID");
  }

  // Check if user already rated
  const existingRatingIndex = product.ratingData.findIndex(
    (entry) => entry.user.toString() === req.user._id.toString()
  );

  if (existingRatingIndex !== -1) {
    // Update existing rating
    product.ratingData[existingRatingIndex].ratingValue = ratingValue;
    product.ratingData[existingRatingIndex].review = review || "";
    product.ratingData[existingRatingIndex].ratedAt = new Date();
  } else {
    // Add new rating
    product.ratingData.push({
      user: req.user._id,
      ratingValue,
      review: review || "",
      ratedAt: new Date(),
    });
  }

  // Recalculate average rating and count
  const totalRatings = product.ratingData.length;
  const averageRating =
    product.ratingData.reduce((sum, r) => sum + r.ratingValue, 0) /
    totalRatings;

  product.ratings.count = totalRatings;
  product.ratings.average = parseFloat(averageRating.toFixed(1));

  await product.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, product, "Product rating submitted successfully")
    );
});

// fetching the products in diff way -->

export const getProductsByStore = asyncHandler(async (req, res) => {
  const { storeId } = req.query;

  if (!storeId) {
    throw new ApiError(400, "Store ID is required");
  }

  const products = await Product.find({ store: storeId });

  if (products.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No products found in this store"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

export const toggleProductToWishList = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product ID required");
  }

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const alreadyExists = user.wishListProducts?.includes(productId);

  if (alreadyExists) {
    // Remove product from wishlist
    user.wishListProducts = user.wishListProducts.filter(
      (id) => id.toString() !== productId.toString()
    );
  } else {
    // Add product to wishlist
    user.wishListProducts.push(productId);
  }

  await user.save();

  // ✅ Fetch full product object (for frontend to update UI)
  const toggledProduct = await Product.findById(productId);
  if (!toggledProduct) {
    throw new ApiError(404, "Product not found");
  }

  return res.status(200).json({
    success: true,
    message: alreadyExists
      ? "Product removed from wishlist"
      : "Product added to wishlist",
    userWishListIds: user.wishListProducts,
    toggledProduct,
  });
});

export const getWishListedProducts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  const products = await user.populate("wishListProducts");
  if (products.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No wish list product"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        products.wishListProducts,
        "Wish List products fetched successfully"
      )
    );
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  if (products.length === 0) {
    res.status(200).json(new ApiResponse(200, [], "No product in the DB"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

export const getFilteredProducts = asyncHandler(async (req, res) => {
  const {
    searchQuery,
    category,
    price,
    rating,
    brand,
    sortBy,
    page = 1,
    itemsPerPage = 10,
  } = req.query;

  const filter = {};
  if (searchQuery) {
    filter.title = { $regex: searchQuery, $options: "i" }; // Case-insensitive search
  }
  if (category) {
    filter.category = category;
  }
  if (price) {
    const [minPrice, maxPrice] = price.split("-").map(Number);
    filter.price = { $gte: minPrice, $lte: maxPrice };
  }
  if (rating) {
    filter["ratings.average"] = { $gte: Number(rating) };
  }
  if (brand) {
    filter.brand = brand;
  }

  // 🔃 Sort logic
  let sortOptions = {};
  if (sortBy === "price") sortOptions = { price: 1 }; // ascending
  else if (sortBy === "rating") sortOptions = { rating: -1 }; // highest first
  else if (sortBy === "newest") sortOptions = { createdAt: -1 };

  // pagination
  const skip = (page - 1) * itemsPerPage;
  const totalProducts = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const products = await Product.find(filter)
    .sort(sortOptions)
    .skip((page - 1) * itemsPerPage)
    .limit(Number(itemsPerPage));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        totalPages,
        currentPage: Number(page),
        totalProducts,
      },
      "Products fetched successfully"
    )
  );
});

export const getProductsByCategory = asyncHandler(async (req, res) => {});

export const getProductsByBrand = asyncHandler(async (req, res) => {});

export const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.query;

  const product = await Product.findById(productId).populate("store");
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});
