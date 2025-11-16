// src/App.js

import React, { useState, useEffect } from 'react';
import { 
    BrowserRouter as Router, 
    Routes, 
    Route, 
    Navigate 
} from 'react-router-dom';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Public Components
import Header from './components/Header';
import MainContent from './components/MainContent';
import FeaturesSection from './components/FeaturesSection';
import TestimonialCta from './components/TestimonialCta';
import SignInCard from './components/SignInCard';
import SignUpCard from './components/SignUpCard';

// Dashboard Components
import Dashboard from './components/Dashboard';
import DashboardOverview from './components/DashboardOverview';
import CreateCapsuleForm from './components/CreateCapsuleForm';
import MyCapsules from './components/MyCapsules';
import ViewCapsule from './components/ViewCapsule';

import Notifications from './components/Notifications';
import NotificationDetails from './components/NotificationDetails';

import Settings from './components/Settings';
import UserProfileModal from './components/UserProfileModal';   // ⭐ NEW

import './App.css';


// Landing Page
const LandingPageContent = () => (
    <>
        <Header />
        <MainContent />
        <FeaturesSection />
        <TestimonialCta />
    </>
);


// Protected Route
const ProtectedRoute = ({ user, children }) => {
    if (!user) return <Navigate to="/sign-in" replace />;
    return children;
};


// Dark Mode Enforcer
const useDarkModeEnforcer = (currentUser) => {
    const isDarkMode = !!currentUser;

    useEffect(() => {
        document.documentElement.setAttribute(
            'data-theme',
            isDarkMode ? 'dark' : 'light'
        );
    }, [isDarkMode]);

    return [isDarkMode, () => {}];
};



// MAIN APP
function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isDarkMode, setDarkMode] = useDarkModeEnforcer(currentUser);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    if (loading) {
        return <div className="loading-screen">Loading authentication...</div>;
    }

    return (
        <Router>
            <div className="app-container">
                <Routes>

                    {/* PUBLIC ROUTES */}
                    <Route 
                        path="/" 
                        element={currentUser ? <Navigate to="/dashboard" /> : <LandingPageContent />} 
                    />
                    <Route 
                        path="/sign-in" 
                        element={currentUser ? <Navigate to="/dashboard" /> : <SignInCard />} 
                    />
                    <Route 
                        path="/sign-up" 
                        element={currentUser ? <Navigate to="/dashboard" /> : <SignUpCard />} 
                    />


                    {/* =========================
                           DASHBOARD ROUTES
                    ========================== */}
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute user={currentUser}>
                                <Dashboard user={currentUser} />
                            </ProtectedRoute>
                        }
                    >

                        {/* Dashboard Home */}
                        <Route index element={<DashboardOverview />} />

                        {/* Capsules */}
                        <Route path="create-capsule" element={<CreateCapsuleForm />} />
                        <Route path="my-capsules" element={<MyCapsules />} />
                        <Route path="capsule/:id" element={<ViewCapsule />} />

                        {/* Notifications */}
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="notifications/:id" element={<NotificationDetails />} />

                        {/* Settings */}
                        <Route 
                            path="settings" 
                            element={<Settings isDarkMode={isDarkMode} setDarkMode={setDarkMode} />} 
                        />

                        {/* ⭐ NEW: PROFILE MODAL ROUTE ⭐ */}
                        <Route 
                            path="profile"
                            element={<UserProfileModal user={currentUser} />}
                        />

                        {/* Any wrong path under /dashboard */}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />

                    </Route>


                    {/* Catch-all from outside dashboard */}
                    <Route 
                        path="*" 
                        element={currentUser ? <Navigate to="/dashboard" /> : <LandingPageContent />} 
                    />

                </Routes>
            </div>
        </Router>
    );
}

export default App;
