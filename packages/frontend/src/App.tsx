import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Login from './pages/Login';
import LandingView from './pages/LandingView';
import JobsTable from './pages/JobsTable';
import Header from './components/Header';
import { RootState } from './store';
import { login } from './store/authSlice';


const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    return isLoggedIn ? children : <Navigate to="/" />;
};

const App: React.FC = () => {
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            dispatch(login(token)); // Restore session if token exists
        }
    }, [token, dispatch]);

    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={!token ? <Login /> : <Navigate to="/specialties" />} />
                <Route
                    path="/specialties"
                    element={
                        <ProtectedRoute>
                            <LandingView />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/table"
                    element={
                        <ProtectedRoute>
                            <JobsTable />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
