import axios from "axios";

const URL_BACK_END = process.env.REACT_APP_URL_BACK_END;
const URL_API_CEP = process.env.REACT_APP_URL_VIA_CEP_API;

const api = axios.create({
  baseURL: URL_BACK_END,
});

const cepApi = axios.create({
  baseURL: URL_API_CEP,
});

export { api, cepApi };
