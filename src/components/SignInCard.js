// components/SignInCard.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import { 
    auth, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    googleProvider, 
    githubProvider 
} from '../firebase'; // Import Firebase auth functions and providers

import styles from './SignInCard.module.css';

const SignInCard = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    // --- 1. Email/Password Sign In ---
    const handleSignIn = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // On success, App.js's auth listener detects login and redirects to dashboard (/)
            navigate('/'); 
        } catch (err) {
            // Display Firebase error message to the user
            setError(err.message);
        }
    };
    
    // --- 2. Social Sign In (Google/GitHub) ---
    const handleSocialAuth = async (provider) => {
        setError(null);
        try {
            await signInWithPopup(auth, provider);
            // On success, App.js's auth listener detects login and redirects to dashboard (/)
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.signInWrapper}>
            <div className={styles.card}>
                <div className={styles.iconContainer}>
                    <span className={styles.appIcon}>&#x23F1;</span>
                </div>
                
                <h2 className={styles.welcomeHeading}>Welcome Back</h2>
                <p className={styles.subtext}>
                    Access your digital time capsules and preserved memories
                </p>
                
                {/* 🌟 ERROR DISPLAY 🌟 */}
                {error && <p className={styles.errorText}>{error}</p>}

                <form onSubmit={handleSignIn} className={styles.form}>
                    {/* Email Field - Added state binding */}
                    <label className={styles.label}>Email Address</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className={styles.inputField}
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {/* Password Field - Added state binding */}
                    <label className={styles.label}>Password</label>
                    <div className={styles.passwordInputContainer}>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className={styles.inputField}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span className={styles.togglePassword}>&#x1F441;</span> 
                    </div>

                    {/* Sign In Button */}
                    <button type="submit" className={styles.signInButton}>
                        Sign In
                    </button>
                </form>

                {/* Forgot Password - Changed to Link */}
                <Link to="/forgot-password" className={styles.forgotPassword}>
                    Forgot your password?
                </Link>

                <div className={styles.divider}>Or continue with</div>

                {/* Social Sign-In Buttons - Added onClick handlers */}
                <div className={styles.socialAuthContainer}>
                    <button className={styles.socialButton} onClick={() => handleSocialAuth(googleProvider)}>
                        <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" /> Google
                    </button>
                    <button className={styles.socialButton} onClick={() => handleSocialAuth(githubProvider)}>
                        <img src="https://img.icons8.com/color/16/000000/github.png" alt="GitHub" /> GitHub
                    </button>
                </div>

                {/* Sign Up Link - Changed to Link */}
                <p className={styles.signUpPrompt}>
                    Don't have an account? <Link to="/sign-up" className={styles.signUpLink}>Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default SignInCard;