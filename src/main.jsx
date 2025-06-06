import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import "./style.css";

createRoot(document.getElementById("root")).render(
  
    <HashRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </HashRouter>

);

