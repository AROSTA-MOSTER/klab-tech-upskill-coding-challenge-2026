import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  BACK_BUTTON,
  DANGER_BTN,
  FULL_BUTTON,
  INPUTWRAPPER,
  personalFields,
  SECTION_WRAPPER,
} from "../assets/dummy";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Save,
  Shield,
  UserCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API } from "../config/api";

const Profile = ({ setCurrentUser, onLogout }) => {
  const [showPassword, setShowpassword] = useState(false);
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get(`${USER_API}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        if (data.success) {
          setProfile({ name: data.user.name, email: data.user.email });
        } else toast.error(data.message);
      })
      .catch(() => toast.error("UNABLE TO LOAD PROFILE"));
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_URL}api/user/profile`,
        { name: profile.name, email: profile.email },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (data.success) {
        setCurrentUser((prev) => ({
          ...prev,
          name: profile.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profile.name,
          )}&background=random`,
        }));
        toast.success("Profile Updated");
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return toast.error("Passwords do not match.");
    }
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_URL}api/user/password`,
        { currentPassword: passwords.current, newPassword: passwords.new },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (data.success) {
        toast.success("Password Changed.");
        setPasswords({ current: "", new: "", confirm: "" });
      } else toast.error(data.message);
    } catch (error) {
      toast.error(err.response?.data?.message || "Password change failed");
    }
  };

  const securityFields = [
    {
      name: "current",
      placeholder: "Current Password",
      type: showPassword ? "text" : "password",
      isPassword: true,
    },
    {
      name: "new",
      placeholder: "New Password",
      type: showPassword ? "text" : "password",
      isPassword: true,
    },
    {
      name: "confirm",
      placeholder: "Confirm Password",
      type: showPassword ? "text" : "password",
      isPassword: true,
    },
  ];

  return (
    <div className="h-full bg-transparent">
      <ToastContainer theme="dark" position="top-center" autoClose={3000} />
      <div className="w-full p-2 sm:p-0">
        <button onClick={() => navigate("/dashboard")} className={BACK_BUTTON}>
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-4 mb-3 sm:mb-4 bg-one/50 rounded-3xl p-4 border border-one">
          <div
            className="w-16 h-16 rounded-full bg-linear-to-br from-two to-one
             flex items-center justify-center text-maintxt text-2xl font-bold shadow-md"
          >
            {profile.name ? profile.name[0].toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-maintxt">
              Account Settings
            </h1>
            <p className="text-maintxt/50 text-sm">
              Manage your profile & security settings
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
          <section className={SECTION_WRAPPER}>
            <div className="flex items-center gap-2 mb-4">
              <UserCircle2 className="w-5 h-5 text-maintxt" />
              <h2 className="text-xl font-semibold text-maintxt">
                Personal Information
              </h2>
            </div>

            {/* Personal Information */}
            <form onSubmit={saveProfile} className="space-y-3 sm:space-y-4">
              {personalFields.map(({ name, type, placeholder, icon: Icon }) => (
                <div key={name} className={INPUTWRAPPER}>
                  <Icon className="text-maintxt w-5 h-5 mr-2" />

                  <input
                    type={type}
                    placeholder={placeholder}
                    value={profile[name]}
                    onChange={(e) =>
                      setProfile({ ...profile, [name]: e.target.value })
                    }
                    className="w-full focus:outline-none text-sm"
                    required
                  />
                </div>
              ))}
              <button className={FULL_BUTTON}>
                <Save className="w-4 h-4" /> Save changes
              </button>
            </form>
          </section>

          <section className={SECTION_WRAPPER}>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-maintxt" />
              <h2 className="text-xl font-semibold text-maintxt">Security</h2>
            </div>

            <form onSubmit={changePassword} className="space-y-3 sm:space-y-4">
              {securityFields.map(({ name, placeholder, type, isPassword }) => (
                <div key={name} className={INPUTWRAPPER}>
                  <Lock className="text-maintxt w-5 h-5 mr-2" />

                  <input
                    type={type}
                    placeholder={placeholder}
                    value={passwords[name]}
                    onChange={(e) =>
                      setPasswords({ ...passwords, [name]: e.target.value })
                    }
                    className="w-full focus:outline-none text-sm"
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
              <button className={FULL_BUTTON}>
                <Shield className="w-4 h-4" /> Change Password
              </button>

              <div className="mt-5 pt-6 border-t border-one">
                
                <button className={DANGER_BTN} onClick={onLogout}>
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
