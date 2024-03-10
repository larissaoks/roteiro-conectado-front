import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9091/",
});

const cepApi = axios.create({
  baseURL: "https://viacep.com.br/ws/",
});

export { api, cepApi };
