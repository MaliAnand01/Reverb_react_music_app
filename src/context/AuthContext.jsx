/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('reverb_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    // Loading is effectively synchronous with lazy init, so it's always false after mount
    const loading = false;
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    const login = (email, password) => {
        // In a real app we would ping an API. 
        // Here we simulate checking against a specific "stored" user for demo purposes, 
        // OR we just allow login if it matches the current generic session we want to create.
        
        // For this local-only version, let's treat "signup" as creating the session.
        // And "login" checks if the credentials match what's in local storage (if any).
        
        // const stored = localStorage.getItem('reverb_users_db'); // "Database" of users?
        // Let's keep it simple: Single user session for now as requested "user can login/signup".
        
        // We'll simulate a DB using an object in localStorage
        const db = JSON.parse(localStorage.getItem('reverb_users_db') || '{}');
        
        if (db[email] && db[email].password === password) {
            const sessionUser = { ...db[email] };
            delete sessionUser.password; // Don't keep password in session state
            setUser(sessionUser);
            localStorage.setItem('reverb_user', JSON.stringify(sessionUser));
            return { success: true };
        }
        
        return { success: false, message: "Invalid credentials" };
    };

    const signup = (data) => {
        // data: { name, email, password }
        const db = JSON.parse(localStorage.getItem('reverb_users_db') || '{}');
        
        if (db[data.email]) {
            return { success: false, message: "User already exists" };
        }

        // Save to "DB"
        db[data.email] = {
            name: data.name,
            email: data.email,
            password: data.password,
            avatar: null // Default null
        };
        localStorage.setItem('reverb_users_db', JSON.stringify(db));

        // Auto login
        const sessionUser = { ...db[data.email] };
        delete sessionUser.password;
        setUser(sessionUser);
        localStorage.setItem('reverb_user', JSON.stringify(sessionUser));
        
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('reverb_user');
    };

    const updateProfile = (updates) => {
        // updates: { name, avatar, password? }
        if (!user) return;

        const db = JSON.parse(localStorage.getItem('reverb_users_db') || '{}');
        const currentUserData = db[user.email];

        if (currentUserData) {
            const updatedUserData = { ...currentUserData, ...updates };
            // If password is in updates, it gets saved to DB
            
            db[user.email] = updatedUserData;
            localStorage.setItem('reverb_users_db', JSON.stringify(db));

            // Update session
            const sessionUser = { ...updatedUserData };
            delete sessionUser.password;
            setUser(sessionUser);
            localStorage.setItem('reverb_user', JSON.stringify(sessionUser));
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            login, 
            signup, 
            logout, 
            updateProfile,
            isAuthModalOpen,
            openAuthModal,
            closeAuthModal
        }}>
            {children}
        </AuthContext.Provider>
    );
};
