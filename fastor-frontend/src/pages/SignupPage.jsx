import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { isValidIndianMobile } from "../utils/validators.js";
import "../styles/auth.css";

export default function SignupPage() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { sendOtp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValidIndianMobile(phone)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await sendOtp(phone);
      navigate("/verify");
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="page auth-page" onSubmit={handleSubmit} noValidate>
        <div className="auth-header">
          <BackButton />
        </div>
        
        <div className="auth-content">
          <h1 className="auth-title">Sign Up to Fastor</h1>
          <p className="auth-sub">
            Enter your mobile number to receive a verification code (OTP).
          </p>

          <div className="phone-input-wrapper">
            <label className="phone-field">
              <span className="phone-code">+91</span>
              <span className="phone-divider" />
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                autoFocus
                maxLength={10}
                placeholder="Enter mobile number"
                aria-label="Mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
            </label>
          </div>

          {error && <p className="error-text" role="alert">{error}</p>}
        </div>

        <div className="auth-bottom">
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Get OTP"}
          </button>
          <p className="terms">
            By continuing, you agree to our <b>Terms &amp; Conditions</b> and <b>Privacy Policy</b>
          </p>
        </div>
      </form>
    </div>
  );
}