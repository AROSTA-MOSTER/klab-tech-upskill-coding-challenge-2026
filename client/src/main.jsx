import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
    
    {/* <div className="min-h-screen bg-basedark flex items-center justify-center">
      <div className="bg-two text-maintxt p-8 rounded-xl text-xl border-2 border-one">
        Custom colors working 🎨🔥
      </div>
    </div> */}
  </BrowserRouter>,
);
