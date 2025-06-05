import { useContext } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ChatRoom from "./components/ChatRoom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import NotFound from "./components/NotFound";
import { UserContext } from "./context/UserContext";

function App() {
  const { user } = useContext(UserContext);
  const location = useLocation();

  return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-200">
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={user ? <Dashboard /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.4, type: 'spring' }}><Dashboard /></motion.div>} />
        <Route path="/chat/:roomId" element={<motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.4, type: 'spring' }}><ChatRoom /></motion.div>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
    </div>
  );
}

export default App;
