import { motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import api from "../services/api";
import { logoutUser } from "../services/auth";

function Dashboard() {
  const { user, logout } = useContext(UserContext);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newChatId, setNewChatId] = useState("");
  const [newChatMsg, setNewChatMsg] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await api.get("/chat/rooms");
      setRooms(res.data);
      console.log("Oda listesi: ", res.data);
    } catch (err) {
      console.error(err);
      alert("Odalar yüklenemedi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleNewChat = () => {
    setShowModal(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSendNewChat = async (e) => {
    e.preventDefault();
    if (!newChatId) return;
    setSending(true);
    try {
      const res = await api.post("/chat/send", {
        receiverId: newChatId,
        firstMsg: newChatMsg,
      });
      setShowModal(false);
      setNewChatId("");
      setNewChatMsg("");
      navigate(`/chat/${res.data.roomId}`);
    } catch (error) {
      alert("Sohbet başlatılamadı!");
    } finally {
      setSending(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser().then(() => navigate("/login"));
    logout();
  };

  const goToRoom = (roomId, guest) => {
    navigate(`/chat/${roomId}`, { state: { guest: guest } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-xs flex flex-col gap-4"
            >
              <h4 className="text-lg font-bold text-gray-800 mb-2 text-center">
                Yeni Sohbet Başlat
              </h4>
              <form
                onSubmit={handleSendNewChat}
                className="flex flex-col gap-3"
              >
                <input
                  ref={inputRef}
                  type="text"
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Alıcı ID"
                  value={newChatId}
                  onChange={(e) => setNewChatId(e.target.value)}
                  required
                  disabled={sending}
                />
                <input
                  type="text"
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Açılış mesajı"
                  value={newChatMsg}
                  onChange={(e) => setNewChatMsg(e.target.value)}
                  disabled={sending}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-600 transition disabled:opacity-60"
                    disabled={sending || !newChatId}
                  >
                    {sending ? "Gönderiliyor..." : "Gönder"}
                  </button>
                  <button
                    type="button"
                    className="flex-1 bg-gray-200 text-gray-700 rounded-lg px-4 py-2 font-semibold hover:bg-gray-300 transition"
                    onClick={() => {
                      setShowModal(false);
                      setNewChatId("");
                      setNewChatMsg("");
                    }}
                    disabled={sending}
                  >
                    İptal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Hoşgeldin,{" "}
          <span className="text-blue-600">{user?.username}</span>
        </h2>
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={handleNewChat}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium shadow"
            disabled={loading}
          >
            Yeni sohbet başlat
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium shadow"
            disabled={loading}
          >
            Çıkış yap
          </button>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
          Geçmiş sohbetlerin
        </h3>
        {loading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center justify-center my-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full mb-2"
              style={{
                borderTopColor: "transparent",
                borderRightColor: "#3b82f6",
              }}
            />
            <span className="text-blue-500 font-semibold">Yükleniyor...</span>
          </motion.div>
        ) : rooms.length > 0 ? (
          <ul className="space-y-2">
            {rooms.map((room) => (
              <li key={room.roomId}>
                <button
                  onClick={() =>
                    goToRoom(
                      room.roomId,
                      room.users.find((u) => u.username !== user?.username)
                    )
                  }
                  className="w-full text-left px-4 py-2 bg-gray-100 rounded-lg hover:bg-blue-100 transition border border-gray-200 shadow-sm font-medium text-gray-700"
                  disabled={loading}
                >
                  <span className="font-semibold text-blue-600">
                    {
                      room.users.find((u) => u.username !== user?.username)?.username
                    }
                  </span>
                  : {room.lastMessage.text}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">Hiç sohbet yok.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
