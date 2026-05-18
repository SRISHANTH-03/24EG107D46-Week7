import {
  errorClass,
  formCard,
  formGroup,
  formTitle,
  inputClass,
  labelClass,
  submitBtn,
  mutedText,
  linkClass,
  container,
  sectionSpacing,
  formRow,
} from "../styles/common";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const onUserRegister = async (userObj) => {
    const formData = new FormData();
    formData.append("role", userObj.role);
    formData.append("firstName", userObj.firstName);
    formData.append("lastName", userObj.lastName);
    formData.append("email", userObj.email);
    formData.append("password", userObj.password);

    if (userObj.profileImage?.[0]) {
      formData.append("profileImage", userObj.profileImage[0]);
    }

    try {
      setLoading(true);
      setApiError(null);

      const res = await api.post("/user-api/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/login");
    } catch (err) {
      setApiError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className={`${container} ${sectionSpacing} animate-fade-in`}>
      <div className={`${formCard} max-w-2xl mx-auto`}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#0066cc] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className={formTitle}>Join MyBlog</h1>
          <p className={mutedText}>Create your account and start sharing your stories</p>
        </div>

        <form onSubmit={handleSubmit(onUserRegister)} className="space-y-6">
          {/* Role Selection */}
          <div className={formGroup}>
            <label className={labelClass}>I want to join as</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { value: "USER", label: "Reader", icon: "👤", desc: "Discover amazing stories" },
                { value: "AUTHOR", label: "Author", icon: "✍️", desc: "Share your writing" },
                { value: "ADMIN", label: "Admin", icon: "⚙️", desc: "Manage the platform" },
              ].map((role) => (
                <label
                  key={role.value}
                  className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all hover:border-[#0066cc] ${
                    errors.role ? "border-red-300" : "border-[#d2d2d7]"
                  }`}
                >
                  <input
                    type="radio"
                    value={role.value}
                    className="sr-only"
                    {...register("role", { required: "Please select a role" })}
                  />
                  <div className="text-center">
                    <div className="text-2xl mb-2">{role.icon}</div>
                    <div className="font-semibold text-[#1d1d1f]">{role.label}</div>
                    <div className="text-xs text-[#6e6e73] mt-1">{role.desc}</div>
                  </div>
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent peer-checked:border-[#0066cc] peer-checked:bg-[#0066cc]/5 pointer-events-none"></div>
                </label>
              ))}
            </div>
            {errors.role && <p className={errorClass}>{errors.role.message}</p>}
          </div>

          {/* Name Fields */}
          <div className={formRow}>
            <div className={formGroup}>
              <label className={labelClass}>First Name</label>
              <input
                type="text"
                className={inputClass}
                placeholder="Enter your first name"
                {...register("firstName", {
                  required: "First name is required",
                  minLength: { value: 2, message: "First name must be at least 2 characters" },
                })}
              />
              {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
            </div>

            <div className={formGroup}>
              <label className={labelClass}>Last Name</label>
              <input
                type="text"
                className={inputClass}
                placeholder="Enter your last name"
                {...register("lastName", {
                  required: "Last name is required",
                  minLength: { value: 2, message: "Last name must be at least 2 characters" },
                })}
              />
              {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              className={inputClass}
              placeholder="Enter your email address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              className={inputClass}
              placeholder="Create a strong password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                },
              })}
            />
            {errors.password && <p className={errorClass}>{errors.password.message}</p>}
          </div>

          {/* Profile Image */}
          <div className={formGroup}>
            <label className={labelClass}>Profile Picture (Optional)</label>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0066cc] file:text-white hover:file:bg-[#004499] file:cursor-pointer"
                {...register("profileImage")}
                onChange={handleImageChange}
              />
              {preview && (
                <div className="flex items-center gap-4">
                  <img
                    src={preview}
                    alt="Profile preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#0066cc]"
                  />
                  <p className="text-sm text-[#6e6e73]">Profile picture preview</p>
                </div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-red-700 text-sm font-medium">{apiError}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" disabled={loading} className={`${submitBtn} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="spinner w-4 h-4"></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className={mutedText}>
            Already have an account?{" "}
            <NavLink to="/login" className={linkClass}>
              Sign in here
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;