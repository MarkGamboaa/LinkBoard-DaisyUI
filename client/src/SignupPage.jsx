import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, validatePassword, updateUserProfile } from "./firebase";
import LinkBoardLogo from "./assets/linkboardlogo.svg";

export default function SignupPage({ onBack, onLogin }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate password
    const validation = validatePassword(password);
    if (!validation.valid) {
      setError(validation.message);
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save both first and last name in displayName
      await updateProfile(userCredential.user, { displayName: `${firstName} ${lastName}`.trim() });
      
      // Save profile data to MongoDB
      const profileResult = await updateUserProfile(firstName.trim(), lastName.trim());
      if (!profileResult.success) {
        console.error('Failed to save profile to MongoDB:', profileResult.message);
      }
      
      setSuccess("Account created! Redirecting to login...");
      setFirstName(""); setLastName(""); setEmail(""); setPassword("");
      setTimeout(() => {
        if (onLogin) onLogin();
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffff] to-[#6ba3ec] flex items-center justify-center px-2 sm:px-4">
      <div className="absolute top-4 left-2 sm:top-8 sm:left-8 z-10">
        <button className="btn btn-ghost btn-sm sm:btn-md" onClick={onBack}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
          <span className="hidden sm:inline">Back</span>
        </button>
      </div>
      <div className="flex flex-col lg:flex-row items-center lg:items-stretch w-full max-w-5xl mx-auto min-h-[70vh]">
        {/* Left Section (h1 and p) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-end pr-0 text-center lg:text-right mb-8 lg:mb-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
                            Join <span className="text-primary font-logo">LinkBoard</span> and<br />start organizing smarter
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-md">
            Sign up in seconds. Save links, create boards, and take control of your digital space all in one place.
          </p>
        </div>
        {/* Right Section (Signup Card) */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 w-full max-w-md flex flex-col justify-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <img src={LinkBoardLogo} alt="LinkBoard Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">Create an account</h2>
              <button className="underline text-sm" onClick={onLogin}>log in instead</button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input type="text" placeholder="First name" className="input input-bordered w-full input-enhanced enhanced-focus" value={firstName} onChange={e => setFirstName(e.target.value)} />
              <input type="text" placeholder="Last name" className="input input-bordered w-full input-enhanced enhanced-focus" value={lastName} onChange={e => setLastName(e.target.value)} />
              <input type="email" placeholder="Email" className="input input-bordered w-full input-enhanced enhanced-focus" value={email} onChange={e => setEmail(e.target.value)} />
              <div>
                <input type="password" placeholder="Password" className="input input-bordered w-full input-enhanced enhanced-focus" value={password} onChange={e => setPassword(e.target.value)} />
                <div className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters with 1 uppercase letter and 1 special character
                </div>
              </div>
              <button type="submit" className={`btn btn-primary w-full text-base sm:text-lg mt-2 button-press ${loading ? 'enhanced-button-loading' : ''}`} disabled={loading}>
                {loading ? (
                  <>
                    <span className="enhanced-button-spinner w-4 h-4"></span>
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
