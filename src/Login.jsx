// Login.jsx
import React, { useState } from "react";
import api from "./api";

const Login = ({ setIsAuthenticated, checkAuthStatus }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post(
        "/login",
        new URLSearchParams({
          username,
          password,
        }),
        { 
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          withCredentials: true  // Important: ensure cookies are sent
        }
      );

      console.log("Login successful:", response.data);

      // Store the access token
      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
      }

      // Update authentication state
      setIsAuthenticated(true);
      
      // Optionally refresh auth status
      if (checkAuthStatus) {
        await checkAuthStatus();
      }

    } catch (err) {
      console.error("Login error:", err);
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        setError(err.response.data?.detail || "Login failed. Please check your credentials.");
      } else if (err.request) {
        // Request was made but no response received
        setError("Unable to connect to server. Please check your connection.");
      } else {
        // Something else happened
        setError("An unexpected error occurred. Please try again.");
      }
      
      // Clear any stored tokens on failed login
      localStorage.removeItem("access_token");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Login to Continue
        </h2>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username input */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              disabled={isLoading}
            />
          </div>

          {/* Password input */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={isLoading}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;

// //Login.jsx
// import React, { useState } from "react";
// import api from "./api"; // our axios instance

// const Login = ({ setIsAuthenticated }) => {
//   const [username, setUsername] = useState("");   // ✅ added
//   const [password, setPassword] = useState("");   // ✅ added
//   const [error, setError] = useState("");         // ✅ added

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const response = await api.post(
//         "/login",
//         new URLSearchParams({
//           username,
//           password,
//         }),
//         { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
//       );

//       localStorage.setItem("access_token", response.data.access_token);
//       setIsAuthenticated(true);
//     } catch (err) {
//       setError(err.response?.data?.detail || "Login failed. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
//       <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md">
//         <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
//           Login to Continue
//         </h2>

//         {error && (
//           <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Username input */}
//           <div>
//             <label className="block text-gray-600 font-medium mb-2">
//               Username
//             </label>
//             <input
//               type="text"
//               className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="Enter username"
//               required
//             />
//           </div>

//           {/* Password input */}
//           <div>
//             <label className="block text-gray-600 font-medium mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter password"
//               required
//             />
//           </div>

//           {/* Submit button */}
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
