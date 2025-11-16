// components/SignUpCard.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import { 
    auth, 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    googleProvider, 
    githubProvider 
} from '../firebase'; // Import Firebase auth functions and providers
import styles from './SignUpCard.module.css';

const SignUpCard = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // --- 1. Email/Password Sign Up ---
    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            // Firebase stores the credential; we don't explicitly save the full name here 
            // but Firebase allows updating the user profile later.
            await createUserWithEmailAndPassword(auth, email, password);
            
            // On success, App.js's auth listener detects login and redirects to dashboard (/)
            navigate('/');
        } catch (err) {
            // Display Firebase error message to the user
            setError(err.message);
        }
    };

    // --- 2. Social Sign Up (Google/GitHub) ---
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
        <div className={styles.signUpWrapper}>
            <div className={styles.card}>
                <div className={styles.iconContainer}>
                    <span className={styles.appIcon}>&#x23F1;</span>
                </div>
                
                <h2 className={styles.joinHeading}>Join EVORIS</h2>
                <p className={styles.subtext}>
                    Start your journey of preserving precious moments today
                </p>

                {/* 🌟 ERROR DISPLAY 🌟 */}
                {error && <p className={styles.errorText}>{error}</p>}

                <form onSubmit={handleSignUp} className={styles.form}>
                    {/* Full Name Field - Added state binding */}
                    <label className={styles.label}>Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        className={styles.inputField}
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />

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

                    {/* Confirm Password Field - Added state binding */}
                    <label className={styles.label}>Confirm Password</label>
                    <div className={styles.passwordInputContainer}>
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            className={styles.inputField}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <span className={styles.togglePassword}>&#x1F441;</span> 
                    </div>

                    {/* Create Account Button */}
                    <button type="submit" className={styles.createAccountButton}>
                        Create Account
                    </button>
                </form>

                <div className={styles.divider}>Or continue with</div>

                {/* Social Sign-Up Buttons - Added onClick handlers */}
                <div className={styles.socialAuthContainer}>
                    <button className={styles.socialButton} onClick={() => handleSocialAuth(googleProvider)}>
                        <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" /> Google
                    </button>
                    <button className={styles.socialButton} onClick={() => handleSocialAuth(githubProvider)}>
                        <img src="https://img.icons8.com/color/16/000000/github.png" alt="GitHub" /> GitHub
                    </button>
                </div>

                {/* Already have an account? Sign In Link - Changed to Link component */}
                <p className={styles.signInPrompt}>
                    Already have an account? <Link to="/sign-in" className={styles.signInLink}>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpCard;