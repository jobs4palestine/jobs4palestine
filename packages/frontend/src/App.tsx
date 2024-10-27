import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Login from './pages/Login';
import LandingView from './pages/LandingView';
import JobsTable from './pages/JobsTable';
import Header from './components/Header';
import { login } from './store/authSlice';
import './App.css';

const App: React.FC = () => {
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    useEffect(() => {
        if (token && (userType === 'user' || userType === 'admin') ) {
            dispatch(login({token: token, userType: userType})); // Restore session if token exists
        }
    }, [token, dispatch]);

    return (
        <Router>
            <Header />
            <Routes>
                {/* Optional login page, accessible only if not already logged in */}
                <Route path="/" element={<Navigate to="/specialties" />}/>
                <Route path="/login" element={!token ? <Login /> : <Navigate to="/specialties" />} />
                {/* Unprotected routes */}
                <Route path="/specialties" element={<LandingView />} />
                <Route path="/table" element={<JobsTable />} />
            </Routes>
        </Router>
    );
};

export default App;
