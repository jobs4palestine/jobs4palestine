import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/authSlice';
import { useLocation, Link } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';
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
            <div className="header-left">
                {location.pathname === '/table' && <Link to="/specialties">Back</Link>}
            </div>
            <div className="header-title">
                {location.pathname === '/specialties' ? 'Specialties' : 'Jobs Table'}
            </div>
            <div className="header-right">
                <Button onClick={handleLogout} type="link" icon={<LogoutOutlined />}>
                    Logout
                </Button>
            </div>
        </nav>
    );
};

export default Header;
