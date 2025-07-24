// components/UserDetails.jsx
import React from "react";
import {
  User,
  Calendar,
  Phone,
  MapPin,
  Globe,
  Home,
  Map,
  Hash,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateUserCredentials } from "../../features/user/userThunks";

function UserDetails({ onClose }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [userDetailForm, setUserDetailForm] = React.useState({
    fullName: "",
    age: "",
    phoneNumber: "",
    address: "",
    country: "",
    city: "",
    district: "",
    postalCode: "",
  });

  React.useEffect(() => {
    if (user) {
      setUserDetailForm({
        fullName: user.fullName || "",
        age: user.age || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        country: user.country || "",
        city: user.city || "",
        district: user.district || "",
        postalCode: user.postalCode || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetailForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    onClose?.();
  };

  const handleApply = async () => {
    try {
      const id = toast.loading("Updating user credentials...");
      await dispatch(updateUserCredentials(userDetailForm)).unwrap();
      toast.success("🎉 User credentials updated successfully!", { id });
      toast.dismiss(id);
    } catch (error) {
      toast.error("Failed to update user credentials");
    }
    onClose?.();
  };

  return (
    <div className="bg-white rounded-xl shadow-xl px-8 py-6 max-w-4xl mx-auto text-blue-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">User Details</h2>
        <button
          onClick={onClose}
          className="text-blue-600 hover:text-red-600 text-2xl font-bold"
          aria-label="Close form"
        >
          &times;
        </button>
      </div>

      {/* Form Grid */}
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="flex items-center gap-3 border border-blue-300 rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <User className="text-blue-500" size={20} />
          <input
            type="text"
            name="fullName"
            value={userDetailForm.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="flex-grow bg-transparent outline-none text-blue-900 placeholder-blue-400"
          />
        </div>

        {/* Age */}
        <div className="flex items-center gap-3 border border-blue-300 rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <Calendar className="text-blue-500" size={20} />
          <input
            type="number"
            name="age"
            min="0"
            value={userDetailForm.age}
            onChange={handleChange}
            placeholder="Age"
            className="flex-grow bg-transparent outline-none text-blue-900 placeholder-blue-400"
          />
        </div>

        {/* Phone Number */}
        <div className="flex items-center gap-3 border border-blue-300 rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <Phone className="text-blue-500" size={20} />
          <input
            type="tel"
            name="phoneNumber"
            value={userDetailForm.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="flex-grow bg-transparent outline-none text-blue-900 placeholder-blue-400"
          />
        </div>

        {/* Address */}
        <div className="flex items-center gap-3 border border-blue-300 rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <MapPin className="text-blue-500" size={20} />
          <input
            type="text"
            name="address"
            value={userDetailForm.address}
            onChange={handleChange}
            placeholder="Address"
            className="flex-grow bg-transparent outline-none text-blue-900 placeholder-blue-400"
          />
        </div>

        {/* Country */}
        <div className="flex items-center gap-3 border border-blue-300 rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <Globe className="text-blue-500" size={20} />
          <input
            type="text"
            name="country"
            value={userDetailForm.country}
            onChange={handleChange}
            placeholder="Country"
            className="flex-grow bg-transparent outline-none text-blue-900 placeholder-blue-400"
          />
        </div>

        {/* City */}
        <div className="flex items-center gap-3 border border-blue-300 rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <Home className="text-blue-500" size={20} />
          <input
            type="text"
            name="city"
            value={userDetailForm.city}
            onChange={handleChange}
            placeholder="City"
            className="flex-grow bg-transparent outline-none text-blue-900 placeholder-blue-400"
          />
        </div>

        {/* District */}
        <div className="flex items-center gap-3 border border-blue-300 rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <Map className="text-blue-500" size={20} />
          <input
            type="text"
            name="district"
            value={userDetailForm.district}
            onChange={handleChange}
            placeholder="District"
            className="flex-grow bg-transparent outline-none text-blue-900 placeholder-blue-400"
          />
        </div>

        {/* Postal Code */}
        <div className="flex items-center gap-3 border border-blue-300 rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <Hash className="text-blue-500" size={20} />
          <input
            type="text"
            name="postalCode"
            value={userDetailForm.postalCode}
            onChange={handleChange}
            placeholder="Postal Code"
            className="flex-grow bg-transparent outline-none text-blue-900 placeholder-blue-400"
          />
        </div>
      </form>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={handleClose}
          type="button"
          className="px-5 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          type="button"
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default UserDetails;
