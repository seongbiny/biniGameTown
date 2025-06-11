import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  // 나중에 실제 인증 로직으로 교체
  const isAuthenticated = true; // 임시로 true로 설정

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}
