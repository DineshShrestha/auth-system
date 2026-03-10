import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#f4f6fb",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "36px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "28px"
          }}
        >
          <h1 style={{ margin: 0 }}>Dashboard</h1>

          <button
            onClick={handleLogout}
            style={{
              padding: "10px 16px",
              background: "#111827",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>

        <div
          style={{
            padding: "20px",
            borderRadius: "10px",
            background: "#f9fafb",
            border: "1px solid #e5e7eb"
          }}
        >
          <p style={{ marginBottom: "10px", fontWeight: 600 }}>
            User information
          </p>

          <p>Email: {user?.email}</p>
          <p>Role: {user?.role}</p>
          <p>User ID: {user?.id}</p>
        </div>
      </div>
    </div>
  );
}