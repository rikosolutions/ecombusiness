// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import BusinessSearchApp from "./BusinessSearchApp";
import { useState, useEffect } from "react";
import api from "./api";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status when app loads
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user has valid token or cookie
      const response = await api.get("/auth/status");
      
      if (response.data.authenticated) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Clear any invalid token
        localStorage.removeItem("access_token");
      }
    } catch (error) {
      console.log("Not authenticated:", error);
      setIsAuthenticated(false);
      localStorage.removeItem("access_token");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Default route goes to login */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login 
                setIsAuthenticated={setIsAuthenticated} 
                checkAuthStatus={checkAuthStatus}
              />
            )
          }
        />

        {/* Dashboard route */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <BusinessSearchApp setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
// // App.jsx
// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./Login";          // your login component
// import BusinessSearchApp from "./BusinessSearchApp"; // your BI dashboard
// import { useState } from "react";

// function App() {
//   // Simple auth state (later replace with token validation)
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   return (
//     <Router>
//       <Routes>
//         {/* Default route goes to login */}
//         <Route
//           path="/"
//           element={
//             isAuthenticated ? (
//               <Navigate to="/dashboard" replace />
//             ) : (
//               <Login setIsAuthenticated={setIsAuthenticated} />
//             )
//           }
//         />
        
//         {/* Dashboard route */}
//         <Route
//           path="/dashboard"
//           element={
//             isAuthenticated ? (
//               <BusinessSearchApp />
//             ) : (
//               <Navigate to="/" replace />
//             )
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
