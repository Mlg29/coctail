import { useState, useEffect } from 'react'
import './App.css'
import Landing from './component/Landing'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './component/SignIn';

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import Dashboard from './component/Dashbaord';

const firebaseConfig = {
  apiKey: "AIzaSyDpO6LH_g9PTz2a9UtfGzANlKdiaoetLzQ",
  authDomain: "cocktail-76d7d.firebaseapp.com",
  projectId: "cocktail-76d7d",
  storageBucket: "cocktail-76d7d.firebasestorage.app",
  messagingSenderId: "363988470377",
  appId: "1:363988470377:web:19001fd7286020e4ceb0f8",
  measurementId: "G-D7R9C205TL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/signin" replace />;
    }

    return children;
  };

  const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (user) {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App