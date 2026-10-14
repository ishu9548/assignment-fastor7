import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { isValidOtp } from "../utils/validators.js";
import "../styles/auth.css";

const RESEND_SECONDS = 30;

export default function OtpPage() {
  const { pendingPhone, sendOtp, confirmOtp } = useAuth();
  const navigate = useNavigate();
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const refs = useRef([]);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  if (!pendingPhone) return <Navigate to="/signup" replace />;

  const focusBox = (i) => refs.current[i]?.focus();

  const handleChange = (i, value) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) return;
    const next = [...digits];
    clean.split("").slice(0, 6 - i).forEach((d, k) => { next[i + k] = d; });
    setDigits(next);
    focusBox(Math.min(i + clean.length, 5));
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...digits];
      if (next[i]) next[i] = "";
      else if (i > 0) { next[i - 1] = ""; focusBox(i - 1); }
      setDigits(next);
    } else if (e.key === "ArrowLeft" && i > 0) focusBox(i - 1);
    else if (e.key === "ArrowRight" && i < 5) focusBox(i + 1);
  };

  const handleResend = async () => {
    setError("");
    try {
      await sendOtp(pendingPhone);
      setDigits(Array(6).fill(""));
      setSeconds(RESEND_SECONDS);
      focusBox(0);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join("");
    if (!isValidOtp(otp)) {
      setError("Enter the 6-digit code");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await confirmOtp(otp);
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const timerLabel = `(00:${String(seconds).padStart(2, "0")})`;

  return (
    <form className="page auth-page" onSubmit={handleSubmit} noValidate>
      <BackButton to="/signup" />
      <h1 className="auth-title" style={{ marginTop: 22 }}>6-digit code</h1>
      <p className="auth-sub">Please enter the code we've sent to<br /><b className="sent-to">+91 {pendingPhone}</b></p>

      <div className="otp-row">
        {digits.map((d, i) => (
          <span key={i} style={{ display: "contents" }}>
            <input
              ref={(el) => (refs.current[i] = el)}
              className="otp-box"
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              autoFocus={i === 0}
              maxLength={6}
              aria-label={`Digit ${i + 1}`}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
            />
            {i === 2 && <span className="otp-dash">-</span>}
          </span>
        ))}
      </div>

      <p className="resend" style={{ marginTop: "20px" }}>
        I didn't receive a code{" "}
        {seconds > 0 ? (
          <span className="resend-timer">{timerLabel}</span>
        ) : (
          <button type="button" className="resend-link" onClick={handleResend}>Resend</button>
        )}
      </p>

      <p className="error-text" role="alert">{error}</p>

      {/* Continue button placed directly below the resend text */}
      <div className="auth-bottom" style={{ position: "relative", marginTop: "16px", padding: 0 }}>
        <button className="btn-primary" type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Verifying..." : "Continue"}
        </button>
      </div>
    </form>
  );
}