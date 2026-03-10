import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function getRefreshToken() {
  return localStorage.getItem("refresh_token");
}

export function setRefreshToken(token: string | null) {
  if (token) {
    localStorage.setItem("refresh_token", token);
  } else {
    localStorage.removeItem("refresh_token");
  }
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshing: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const rt = getRefreshToken();

  if (!rt) {
    throw new Error("missing refresh token");
  }

  const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
    refresh_token: rt,
  });

  const newAccess = res.data.tokens.access_token as string;
  const newRefresh = res.data.tokens.refresh_token as string;

  setAccessToken(newAccess);
  setRefreshToken(newRefresh);

  return newAccess;
}
export async function getMe() {
  const res = await api.get("/api/me");
  return res.data.user;
}
// api.interceptors.response.use(
//   (res) => res,
//   async (err) => {
//     const status = err?.response?.status;
//     const original = err.config;

//     if (status !== 401 || original?._retry) {
//       throw err;
//     }

//     original._retry = true;

//     try {
//       if (!refreshing) {
//         refreshing = refreshAccessToken();
//       }

//       const token = await refreshing;
//       refreshing = null;

//       original.headers = original.headers ?? {};
//       original.headers.Authorization = `Bearer ${token}`;

//       return api.request(original);
//     } catch (e) {
//       refreshing = null;
//       setAccessToken(null);
//       setRefreshToken(null);
//       throw e;
//     }
//   }
// );
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status;
    const original = err.config;

    if (status !== 401 || original?._retry) {
      throw err;
    }

    original._retry = true;

    try {
      if (!refreshing) {
        refreshing = refreshAccessToken();
      }

      const token = await refreshing;
      refreshing = null;

      original.headers = original.headers ?? {};
      original.headers.Authorization = `Bearer ${token}`;

      return api.request(original);
    } catch (e) {
      refreshing = null;
      setAccessToken(null);
      setRefreshToken(null);
      throw e;
    }
  }
);

export default api;