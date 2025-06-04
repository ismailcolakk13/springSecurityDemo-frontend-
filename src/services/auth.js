import api from "./api";

export async function loginUser(username, password) {
  const response = await api.post("/auth/authenticate", { username, password });
  return response.data;
}

export async function registerUser(username, password, age, role) {
  const response = await api.post("/auth/register", {
    username,
    password,
    age,
    role,
  });
  return response.data;
}

export async function logoutUser() {
  await api.post("/auth/logout");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
