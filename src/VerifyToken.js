import api from "./service/service";

export async function verifyToken() {
  try {
    const token = localStorage.getItem("token");
    const res = await api.get("autenticacao/verifyToken", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 200) {
      return {
        valid_token: res.data.validToken,
        user: res.data.user,
      };
    } else {
      return { valid_token: false, user: "" };
    }
  } catch (error) {
    localStorage.removeItem("token");
    return { valid_token: false, user: "" };
  }
}
