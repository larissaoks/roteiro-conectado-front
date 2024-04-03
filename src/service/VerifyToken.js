import { api } from "./service";
import { getToken } from "../util/getTokenFromLocalStorage";

export async function verifyToken() {
  try {
    const token = getToken();
    const res = await api.get("oauth2/verificaToken", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    localStorage.removeItem("token");
    return false;
  }
}
