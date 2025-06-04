import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import ChatRoom from "./components/ChatRoom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import NotFound from "./components/NotFound";
import { UserContext } from "./context/UserContext";

function App() {
  const { user } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/" element={user ? <Dashboard/> : <Login/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/chat/:roomId" element={<ChatRoom />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
