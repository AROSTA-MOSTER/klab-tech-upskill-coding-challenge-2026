import { Eye, EyeOff, LogIn, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { BUTTONCLASSES, INPUTWRAPPER } from "../assets/dummy";
import axios from "axios";
import { USER_API } from "../config/api";

const INITIAL_FORM = { email: "", password: "" };

const Login = ({ onSubmit, onSwitchMode }) => {
  const [showPassword, setShowpassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token) {
      (async () => {
        try {
          const { data } = await axios.get(`${USER_API}/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (data.success) {
            onSubmit?.({ token, userId, ...data.user });
            toast.success("Session restored. Redirecting...");
            navigate("/");
          } else {
            localStorage.clear();
          }
        } catch (error) {
          localStorage.clear();
        }
      })();
    }
  }, [navigate, onSubmit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${USER_API}/login`, formData);
      if (!data.token) throw new Error(data.message || "Login Failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      toast.success("Login successful! Redirecting...");
      onSubmit?.({ token: data.token, userId: data.user.id, ...data.user });
      setTimeout(() => navigate("/"), 600);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = () => {
    toast.dismiss();
    onSwitchMode?.();
  };

  const fields = [
    {
      name: "email",
      type: "email",
      placeholder: "Email",
      icon: Mail,
    },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      placeholder: "Password",
      icon: Lock,
      isPassword: true,
    },
  ];

  return (
    <div className="max-w-md bg-one/50 w-full shadow-lg border border-one rounded-3xl p-8">
      <ToastContainer theme="dark" position="top-center" autoClose={3000} hideProgressBar />

      <div className="mb-6 text-center">
        <div
          className="w-16 h-16 bg-linear-to-br from-two to-one shadow-lg rounded-full
         mx-auto flex items-center justify-center mb-3"
        >
          <LogIn className="w-8 h-8 text-maintxt" />
        </div>
        <h2 className="text-3xl font-bold text-maintxt">Welcome Back</h2>
        <p className="text-maintxt/50 text-sm mt-1">
          Sign in to your account to manage your tasks
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
          <div key={name} className={INPUTWRAPPER}>
            <Icon className="text-maintxt w-5 h-5 mr-2" />
            <input
              className="w-full bg-transparent text-maintxt focus:outline-none focus:ring-0 appearance-none text-sm"
              type={type}
              placeholder={placeholder}
              value={formData[name]}
              autoComplete={
                name === "email"
                  ? "email"
                  : name === "password"
                    ? "current-password"
                    : "off"
              }
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

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 appearance-none bg-two/70 border border-one rounded-md
       checked:border-maintxt checked:before:content-['✔'] checked:before:text-maintxt checked:before:flex
       checked:before:items-center checked:before:justify-center checked:before:-translate-y-1.25"
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 block text-sm text-maintxt cursor-pointer"
            >
              Remember Me
            </label>
          </div>
        </div>

        <button type="submit" className={BUTTONCLASSES} disabled={loading}>
          {loading ? (
            "Signing in..."
          ) : (
            <>
              <LogIn className="w-4 h-4 text-maintxt" />
              Sign In
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-maintxt/50 mt-6">
        Don't have an account?{" "}
        <button
          type="button"
          className="text-maintxt/70 cursor-pointer hover:text-maintxt hover:underline font-medium transition-colors"
          onClick={handleSwitchMode}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;
