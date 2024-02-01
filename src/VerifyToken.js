import api from "./service/service";

export async function verifyToken() {
  try {
    const token = localStorage.getItem("token");
    const res = await api.get("oauth2/verificaToken", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("verifyToken", res.data, res.status);
    if (res.status === 200) {
      return res.data;
    } else {
      return res.data;
    }
  } catch (error) {
    localStorage.removeItem("token");
    return false;
  }
}
