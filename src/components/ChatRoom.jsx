import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { UserContext } from "../context/UserContext";
import api from "../services/api";

function ChatRoom() {
  const { roomId } = useParams();
  const { user, token } = useContext(UserContext);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!roomId || !user?.id || stompClient.current) {
      // Skip the WebSocket setup if roomId/userId is missing or if already connected
      return;
    }

    const fetchOldMessages = async () => {
      const res = await api.get(`/chat/room/${roomId}`);
      setMessages(res.data);
    };

    fetchOldMessages();

    const socket = new SockJS("/ws-chat");
    const stomp = over(socket);
    stompClient.current = stomp;

    console.log(token);

    stomp.connect(
      {
        Authorization: `Bearer ${token}`,
      },
      () => {
        console.log("WS bağlandı");

        stomp.subscribe(`/topic/rooms/${roomId}`, (msg) => {
          const messageBody = JSON.parse(msg.body);
          console.log("Yeni mesaj: ", messageBody);

          setMessages((prev) => [...prev, messageBody]);
        });
      },
      (error) => {
        console.error("WS hata: ", error);
      }
    );

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect(() => {
          console.log("WS kapandı");
        });
      }
    };
  }, [roomId, user]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (
      stompClient.current &&
      stompClient.current.connected &&
      inputText.trim() !== ""
    ) {
      const chatMessage = {
        senderId: user.id,
        text: inputText,
      };
      stompClient.current.send(
        `/app/chat.send/${roomId}`,
        {},
        JSON.stringify(chatMessage)
      );
      setInputText("");
    }
  };

  return (
    <div className="flex flex-col h-dvh bg-gradient-to-br from-blue-100 to-purple-200">
      <header className="p-4 bg-white shadow-md flex items-center justify-between">
        <h2 className="text-xl font-bold text-blue-700 tracking-wide">
          Oda: {roomId}
        </h2>
        <span className="text-sm text-gray-400 font-mono">ChitChat</span>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
        {messages.length === 0 && (
          <div className="flex flex-1 items-center justify-center text-gray-400 italic select-none">
            Henüz mesaj yok ya da ERİŞİMİN YOK
          </div>
        )}
        {messages.map((msg, idx) => {
          const isOwn = msg.senderId === user.id;
          return (
            <div
              key={idx}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs break-words shadow-md text-base font-medium transition-all \
                  ${isOwn
                    ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white border border-blue-300"
                    : "bg-white text-gray-800 border border-gray-200"}
                `}
                style={{ wordBreak: "break-word" }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t flex items-center space-x-2 shadow-md">
        <input
          type="text"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-800 placeholder-gray-400 shadow-sm"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Mesaj yaz..."
        />
        <button
          onClick={sendMessage}
          className={`px-5 py-2 rounded-lg transition font-semibold shadow-md \
            ${inputText.trim() === ""
              ? "bg-gray-300 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"}`}
          disabled={inputText.trim() === ""}
        >
          Gönder
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
