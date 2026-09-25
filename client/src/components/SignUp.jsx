import { Mail, Eye, EyeOff, Lock, UserRound, UserRoundPlus } from "lucide-react";
import React, { useState } from "react";
import {
  BUTTONCLASSES,
  Inputwrapper,
} from "../assets/dummy";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { USER_API } from "../config/api";

const INITIAL_FORM = { name: "", email: "", password: "" };

const Signup = ({ onSubmit, onSwitchMode }) => {
  const [showPassword, setShowpassword] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${USER_API}/register`,
        formData,
      );

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        toast.success("Account created successfully! Logging you in...");
        setTimeout(() => {
          onSubmit?.({ token: data.token, userId: data.user.id, ...data.user });
        }, 800);
      } else {
        toast.success("Registration successful! Please log in.");
        setTimeout(() => onSwitchMode?.(), 1000);
      }
      setFormData(INITIAL_FORM);
    } catch (err) {
      const msg = err.response?.data?.message || "An error occurred. Please try again";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const FIELDS = [
    { name: "name", type: "text", placeholder: "Full Name", icon: UserRound },
    { name: "email", type: "email", placeholder: "Email", icon: Mail },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      placeholder: "Password",
      icon: Lock,
      isPassword: true,
    },
  ];

  return (
    <div className="max-w-md w-full bg-[#081226]/85 backdrop-blur-xl shadow-2xl border border-one/60 rounded-3xl p-6 sm:p-8 mx-auto">
      <ToastContainer theme="dark" position="top-center" autoClose={3000} hideProgressBar />

      <div className="mb-6 text-center">
        <div
          className="w-16 h-16 bg-two/80 border border-one/70 p-1 rounded-2xl mx-auto
        flex items-center justify-center mb-3 shadow-lg overflow-hidden"
        >
          <img
            src="/logo.png"
            alt="EVERHOME DREAMS LTD"
            className="w-full h-full object-contain rounded-xl"
          />
        </div>
        <h2 className="text-xl font-extrabold text-blue-200 tracking-wider uppercase font-montserrat mb-1">
          EVERHOME DREAMS LTD
        </h2>
        <h3 className="text-2xl font-bold text-maintxt">Create Account</h3>
        <p className="text-maintxt/60 text-sm mt-1">
          Sign up to get started with your task management
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {FIELDS.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
          <div key={name} className={Inputwrapper}>
            <Icon className="text-maintxt w-5 h-5 mr-2" />
            <input
              className="w-full bg-transparent text-maintxt focus:outline-none focus:ring-0 appearance-none text-sm"
              type={type}
              placeholder={placeholder}
              value={formData[name]}
              onChange={(e) =>
                setFormData({ ...formData, [name]: e.target.value })
              }
              required
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowpassword((prev) => !prev)}
                className="ml-2 text-maintxt/50 hover:text-maintxt transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        ))}

        <button type="submit" className={BUTTONCLASSES} disabled={loading}>
          {loading ? (
            "Creating account..."
          ) : (
            <>
              <UserRoundPlus className="w-4 h-4 text-maintxt" />
              Sign Up
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-maintxt/50 mt-6">
        Already have an account?{" "}
        <button
          type="button"
          className="text-maintxt/70 cursor-pointer hover:text-maintxt hover:underline font-medium transition-colors"
          onClick={onSwitchMode}
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

export default Signup;
