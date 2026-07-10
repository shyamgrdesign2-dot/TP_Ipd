import axios from "axios";
import {
  AGENT_API_BASE,
  AGENT_DEV_LOGIN,
  AGENT_TOKEN_KEY,
} from "../constants";

var IS_DEMO = process.env.REACT_APP_DEMO === "true";

export const agentApi = axios.create({
  baseURL: IS_DEMO ? "" : AGENT_API_BASE,
  headers: { "Content-Type": "application/json" },
});

agentApi.interceptors.request.use((config) => {
  if (IS_DEMO) {
    var url = config.url || "";
    config.adapter = function () {
      return Promise.resolve({
        data: { status: true, data: [] },
        status: 200,
        statusText: "OK",
        headers: {},
        config: config,
      });
    };
    return config;
  }
  const token = localStorage.getItem(AGENT_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let authPromise = null;

export function ensureAgentAuth() {
  if (IS_DEMO) return Promise.resolve(true);
  if (localStorage.getItem(AGENT_TOKEN_KEY)) return Promise.resolve(true);
  if (authPromise) return authPromise;
  authPromise = axios
    .post(`${AGENT_API_BASE}/auth-service/api/auth/login`, AGENT_DEV_LOGIN, {
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      const token = res?.data?.token;
      if (token) localStorage.setItem(AGENT_TOKEN_KEY, token);
      return Boolean(token);
    })
    .catch((err) => {
      console.warn("[DoctorAgent] dev auth failed", err?.message);
      return false;
    })
    .finally(() => {
      authPromise = null;
    });
  return authPromise;
}

// Admission GraphQL (substring-dispatch mock). Returns res.data.data.
export async function agentGraphql(operationName, query, variables = {}) {
  await ensureAgentAuth();
  const res = await agentApi.post("/admission-service/graphql", {
    operationName,
    query,
    variables,
  });
  return res?.data?.data ?? null;
}

// Nursing REST (mounted at /admission-service/api/*). `path` starts with a slash.
export async function agentNursingGet(path, params) {
  await ensureAgentAuth();
  const res = await agentApi.get(`/admission-service/api${path}`, { params });
  return res?.data ?? null;
}
