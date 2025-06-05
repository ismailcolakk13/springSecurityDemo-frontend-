import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";
import { motion } from "framer-motion";

function Login() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(username, password);
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Giriş başarısız!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-sm flex flex-col gap-4">
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.4, type: "spring" }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">
            Hoşgeldiniz
          </h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Kullanıcı adı"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-800 placeholder-gray-400 shadow-sm"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Şifre"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-800 placeholder-gray-400 shadow-sm"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition font-semibold shadow-md mt-2"
          >
            Giriş Yap
          </button>
        </motion.form>
        <span className="text-sm text-gray-600 text-center">
          Hesabın yok mu?{" "}
        </span>
        <button
          onClick={() => navigate("/register")}
          className="ml-2 px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition font-medium shadow"
        >
          Kayıt Ol
        </button>
      </div>
    </div>
  );
}

export default Login;
