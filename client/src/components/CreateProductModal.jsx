import React, { useEffect, useState } from "react";
import {
  Package,
  ClipboardList,
  Camera,
  CircleCheck,
  CircleDashed,
  Trash2,
} from "lucide-react";

import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../features/product/productThunks";
import { productSubcategories } from "../constants";

function CreateProductModal({ onClose }) {
  const dispatch = useDispatch();
  const { currentStore } = useSelector((state) => state.store);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discount: "",
    stock: "",
    category: "",
    subcategory: "",
    isFeatured: false,
    features: "",
    images: [],
    imagesPreview: [],
    storeId: currentStore._id,
  });

  const [completedSteps, setCompletedSteps] = useState({
    basic: false,
    details: false,
    media: false,
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  // Form field progress tracker
  useEffect(() => {
    setCompletedSteps({
      basic: formData.title.trim() && formData.description.trim(),
      details: ["price", "discount", "stock", "category", "features"].every(
        (k) => formData[k].toString().trim()
      ),
      media: formData.images.length > 0,
    });
  }, [formData]);

  // Auto image slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === formData.imagesPreview.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [formData.imagesPreview.length]);

  const handleInputChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      const MAX_IMAGES = 5;
      const filesArray = Array.from(files);
      if (filesArray.length > MAX_IMAGES) {
        alert(`You can only upload up to ${MAX_IMAGES} images.`);
        return;
      }
      const previews = filesArray.map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        images: filesArray,
        imagesPreview: previews,
      }));
      setCurrentSlide(0);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    const newPreview = [...formData.imagesPreview];
    newImages.splice(index, 1);
    newPreview.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      images: newImages,
      imagesPreview: newPreview,
    }));
    setCurrentSlide(0);
  };

  const steps = [
    { icon: <Package size={20} />, label: "Basic Info", key: "basic" },
    { icon: <ClipboardList size={20} />, label: "Details", key: "details" },
    { icon: <Camera size={20} />, label: "Media", key: "media" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();

    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("discount", formData.discount);
    form.append("category", formData.category);
    form.append("subCategory", formData.subcategory);
    form.append("stock", formData.stock);
    form.append("isFeatured", formData.isFeatured);
    form.append("features", formData.features);
    form.append("storeId", formData.storeId);

    formData.images.forEach((image, index) => {
      form.append("images", image); // Note: name should match `req.files.images`
    });

    console.log("Form Data", form);

    try {
      const loadingToast = toast.loading("Creating product...");
      await dispatch(createProduct(form)).unwrap();
      toast.success("🎉 Product created!", { id: loadingToast });
      onClose();
    } catch (err) {
      toast.error("Failed to create product");
    }
  };

  const showSkeleton = Object.values(formData).every(
    (val) =>
      val === "" || (Array.isArray(val) && val.length === 0) || val === false
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md text-gray-800">
      <div className="bg-white rounded-xl shadow-lg w-[90vw] h-[95vh] overflow-hidden relative p-4">
        {/* Exit Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
        >
          ✕
        </button>

        {/* Header Tracker */}
        <div className="flex justify-center gap-20 mt-4 mb-4">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${
                  completedSteps[step.key]
                    ? "bg-blue-100 border-blue-600 text-blue-800 shadow-md"
                    : "border-gray-300 text-gray-400 bg-white"
                }`}
              >
                {step.icon}
              </div>
              <span className="text-xs mt-1">{step.label}</span>
              {completedSteps[step.key] && (
                <CircleCheck size={14} className="text-green-500 mt-1" />
              )}
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex gap-6 h-[calc(95vh-120px)] overflow-hidden px-2">
          {/* Left Form Side */}
          <form className="w-2/3 h-full overflow-y-auto pr-2 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Product Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
                />
              </div>
            </div>

            {/* Category and SUb - cCategries */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value,
                    subcategory: "", // reset subcategory when category changes
                  }));
                }}
                className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
              >
                <option value="">Select Category</option>
                {productSubcategories.map((cat, idx) => (
                  <option key={idx} value={cat.category}>
                    {cat.category}
                  </option>
                ))}
              </select>
            </div>

            {formData.category && (
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Subcategory
                </label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
                >
                  <option value="">Select Subcategory</option>
                  {productSubcategories
                    .find((cat) => cat.category === formData.category)
                    ?.sub.map((sub, idx) => (
                      <option key={idx} value={sub}>
                        {sub}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div>
              <label className="flex gap-2 items-center text-sm font-semibold">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                />
                Mark as Featured
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Features (comma-separated)
              </label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Upload Product Images
              </label>
              <input
                type="file"
                name="images"
                multiple
                onChange={handleInputChange}
                accept="image/*"
                title="You can select up to 5 images"
                className="w-full px-3 py-2 rounded-md border focus:outline-blue-500"
              />
              {formData.imagesPreview.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {formData.imagesPreview.map((src, index) => (
                    <div
                      key={index}
                      className="relative border rounded-md overflow-hidden group"
                    >
                      <img
                        src={src}
                        alt={`preview-${index}`}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleSubmit}
                className={`px-5 py-2 text-[14px] rounded-md transition-all duration-75 ease-in w-23 flex gap-1 items-center 
                  ${
                    Object.values(completedSteps).every(Boolean)
                      ? "bg-blue-500/30 hover:text-white hover:bg-blue-500 cursor-pointer hover:gap-3"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                disabled={!Object.values(completedSteps).every(Boolean)}
              >
                Create <CircleDashed size={16} />
              </button>
            </div>
          </form>

          {/* Right Product Preview */}
          <div className="w-1/3 sticky top-4 h-fit">
            <div className="border rounded-lg shadow-md p-4 space-y-4">
              {showSkeleton ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-48 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ) : (
                <>
                  {formData.imagesPreview.length > 0 && (
                    <div className="relative">
                      <img
                        key={formData.imagesPreview[currentSlide]}
                        src={formData.imagesPreview[currentSlide]}
                        className="w-full h-48 object-cover rounded"
                      />
                      {formData.imagesPreview.length > 1 && (
                        <div className="absolute bottom-2 right-2 flex gap-2">
                          {formData.imagesPreview.map((_, i) => (
                            <button
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i === currentSlide
                                  ? "bg-blue-600"
                                  : "bg-gray-600"
                              }`}
                              onClick={() => setCurrentSlide(i)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <h2 className="text-xl font-semibold">{formData.title}</h2>
                  <p className="text-sm text-gray-600 truncate">
                    {formData.description}
                  </p>
                  <p className="text-lg text-blue-600 font-bold">
                    Rs {formData.price}
                    {formData.discount && (
                      <span className="text-sm line-through text-gray-400 ml-2">
                        {formData.discount}%
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    Stock: {formData.stock}
                  </p>
                  <p className="text-xs text-gray-500">
                    Category: {formData.category} , {formData.subcategory}
                  </p>
                  {formData.isFeatured && (
                    <span className="text-xs text-green-600 font-semibold">
                      🌟 Featured Product
                    </span>
                  )}
                  <p className="text-xs text-gray-500 mt-1 ml-1">
                    {formData.features.length > 0 && (
                      <span className="text-xs text-gray-500">
                        Features :{" "}
                        <span className="font-normal text-green-700">
                          {formData.features.split(",").join(", ")}
                        </span>
                      </span>
                    )}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProductModal;
