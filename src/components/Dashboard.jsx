import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { logoutUser } from "../services/auth";

function Dashboard() {
  const { user, logout } = useContext(UserContext);
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      const res = await api.get("/chat/rooms");
      setRooms(res.data);
    } catch (err) {
      console.error(err);
      alert("Odalar yüklenemedi!");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleNewChat = async () => {
    const receiverId = prompt("Kiminle konuşucan ID gir:");
    const firstMsg = prompt("Açılış yazını yaz!:");

    if (receiverId) {
      try {
        const res = await api.post("/chat/send", { receiverId, firstMsg });
        navigate(`/chat/${res.data.roomId}`);
      } catch (error) {
        alert("Sohbet başlatılamadı!");
      }
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    logout();
    navigate("/login");
  };

  const goToRoom = (roomId,guest) => {
    navigate(`/chat/${roomId}` , {state:{guest:guest}});
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Hoşgeldin,{" "}
          <span className="text-blue-600">{user?.username}</span>
        </h2>
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={handleNewChat}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium shadow"
          >
            Yeni sohbet başlat
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium shadow"
          >
            Çıkış yap
          </button>
        </div>

        <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
          Geçmiş sohbetlerin
        </h3>
        {rooms.length > 0 ? (
          <ul className="space-y-2">
            {rooms.map((room) => (
              <li key={room.roomId}>
                <button
                  onClick={() => goToRoom(room.roomId,room.users.find((u)=>u.username !== user.username))}
                  className="w-full text-left px-4 py-2 bg-gray-100 rounded-lg hover:bg-blue-100 transition border border-gray-200 shadow-sm font-medium text-gray-700"
                >
                  <span className="font-semibold text-blue-600">
                    {room.users.map((user)=> (<span key={user.username}> {user.username} </span>))}
                  </span>
                  odası
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
