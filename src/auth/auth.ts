import api, { getRefreshToken, setAccessToken, setRefreshToken } from "../api/api";

export type User = {
  id: number;
  email: string;
  role: string;
};

export async function login(email: string, password: string): Promise<User> {
  const res = await api.post("/api/auth/login", { email, password });

  const user = res.data.user as User;
  const accessToken = res.data.tokens.access_token as string;
  const refreshToken = res.data.tokens.refresh_token as string;

  setAccessToken(accessToken);
  setRefreshToken(refreshToken);

  return user;
}

export async function register(
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<User> {
  const res = await api.post("/api/auth/register", {
    email,
    password,
    password_confirmation: passwordConfirmation,
  });

  const user = res.data.user as User;
  const accessToken = res.data.tokens.access_token as string;
  const refreshToken = res.data.tokens.refresh_token as string;

  setAccessToken(accessToken);
  setRefreshToken(refreshToken);

  return user;
}

export async function getMe(): Promise<User> {
  const res = await api.get("/api/me");

  if (!res.data?.user) {
    throw new Error("Invalid /api/me response");
  }

  return res.data.user as User;
}

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();

  if (refreshToken) {
    await api.post("/api/auth/logout", {
      refresh_token: refreshToken,
    });
  }

  setAccessToken(null);
  setRefreshToken(null);
}