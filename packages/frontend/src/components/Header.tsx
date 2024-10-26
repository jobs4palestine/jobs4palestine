import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/authSlice';
import { useLocation, Link } from 'react-router-dom';
import { Button } from 'antd';

const Header: React.FC = () => {
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const location = useLocation();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    if (!isLoggedIn) return null;

    return (
        <nav className="header">
            {location.pathname === '/table' && <Link to="/specialties">Back</Link>}
            <span>{location.pathname === '/specialties' ? 'Specialties' : 'Table View'}</span>
            <Button onClick={handleLogout}>Logout</Button>
        </nav>
    );
};

export default Header;
