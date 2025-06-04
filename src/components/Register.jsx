import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(username,password,age,role);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Kayıt başarısız!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Aramıza Katıl!</h2>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Kullanıcı adı"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Şifre"
      />
      <input
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Yaş"
      />
      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Rol"
      />
      <button type="submit">Kaydol</button>
    </form>
  );
}

export default Register;
