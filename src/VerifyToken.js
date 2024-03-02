import api from "./service/service";

export async function verifyToken() {
  try {
    const token = localStorage.getItem("token");
    const res = await api.get("oauth2/verificaToken", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    localStorage.removeItem("token");
    return false;
  }
}
