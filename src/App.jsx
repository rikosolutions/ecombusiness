// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";          // your login component
import BusinessSearchApp from "./BusinessSearchApp"; // your BI dashboard
import { useState } from "react";

function App() {
  // Simple auth state (later replace with token validation)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        
        {/* Dashboard route */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <BusinessSearchApp />
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
