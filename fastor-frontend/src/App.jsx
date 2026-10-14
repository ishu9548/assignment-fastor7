import { Navigate, Route, Routes } from "react-router-dom";
import PhoneFrame from "./components/PhoneFrame.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import OtpPage from "./pages/OtpPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ItemDetailPage from "./pages/ItemDetailPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <PhoneFrame>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/signup"} replace />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/home" replace /> : <SignupPage />} />
        <Route path="/verify" element={isAuthenticated ? <Navigate to="/home" replace /> : <OtpPage />} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/item/:id" element={<ProtectedRoute><ItemDetailPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PhoneFrame>
  );
}
