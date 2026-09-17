import { useState, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate, Outlet } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import PendingPage from "./pages/PendingPage";
import CompletePage from "./pages/CompletePage";
import Profile from "./components/Profile";
import { USER_API } from "./config/api";

const App = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    // No token → force logout
    if (!token) {
      setCurrentUser(null);
      navigate("/login", { replace: true });
      return;
    }

    // Validate token with backend
    (async () => {
      try {
        const res = await fetch(
          `${USER_API}/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) throw new Error("Token expired");

        const data = await res.json();

        // Token valid → sync user
        setCurrentUser({
          email: data.user.email,
          name: data.user.name,
          avatar: data.user.avatar,
        });
      } catch (error) {
        // Token expired / invalid
        localStorage.clear();
        setCurrentUser(null);
        navigate("/login", { replace: true });
      }
    })();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const handleAuthSubmit = (data) => {
    const user = {
      email: data.email,
      name: data.name || "User",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        data.name || "User",
      )}&background=random`,
    };
    setCurrentUser(user);
    navigate("/", { replace: true });
  };

  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser(null);
    navigate("/login", { replace: true });
  };

  const ProtectedRoute = ({ currentUser, children }) => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  const ProtectedLayout = () => (
    <Layout user={currentUser} onLogout={handleLogout}>
      <Outlet />
    </Layout>
  );

  return (
    <Routes>
      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate to="/" replace />
          ) : (
            <div className="fixed inset-0 bg-basedark bg-opacity-50 flex items-center justify-center">
              <Login
                onSubmit={handleAuthSubmit}
                onSwitchMode={() => navigate("/signup")}
              />
            </div>
          )
        }
      />

      <Route
        path="/signup"
        element={
          <div
            className="fixed inset-0 bg-basedark bg-opacity-50 flex items-center 
            justify-center"
          >
            <SignUp
              onSubmit={handleAuthSubmit}
              onSwitchMode={() => navigate("/login")}
            />
          </div>
        }
      />

      <Route
        element={
          <ProtectedRoute currentUser={currentUser}>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/pending" element={<PendingPage />} />
        <Route path="/complete" element={<CompletePage />} />
        <Route
          path="/profile"
          element={
            <Profile
              user={currentUser}
              setCurrentUser={setCurrentUser}
              onLogout={handleLogout}
            />
          }
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to={currentUser ? "/" : "/login"} />}
      />
    </Routes>
  );
};

export default App;
