import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${API_URL}/auth/reset-password`, formData);
      
      toast.success("Password reset successful! You can now log in.");
      
      // Redirect to login after successful reset
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue to-primary py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl text-vivid_blue pb-3 font-bold text-center">
          Reset Password
        </h1>
        <p className="text-sm text-gray-600 text-center mt-1 mb-6">
          Enter the code sent to your email and your new password.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition"
            />
          </div>
          
          <div>
            <input
              type="text"
              name="otp"
              placeholder="6-digit Code"
              value={formData.otp}
              onChange={handleChange}
              required
              maxLength="6"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition text-center text-lg font-mono"
            />
          </div>
          
          <div>
            <input
              type="password"
              name="newPassword"
              placeholder="New Password (min. 6 characters)"
              value={formData.newPassword}
              onChange={handleChange}
              required
              minLength="6"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-vivid_blue transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting...
              </span>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/forgot-password')}
            className="text-primary hover:text-vivid_blue transition text-sm"
          >
            Need a new code? Request again
          </button>
        </div>
      </div>
    </div>
  );
}