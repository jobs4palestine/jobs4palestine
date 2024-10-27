import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { clearSpecialty } from '../store/specialtySlice';

const Header: React.FC = () => {
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const selectedSpecialty = useSelector((state: RootState) => state.specialty.selectedSpecialty);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearSpecialty());
    };

    const handleBack = () => {
        dispatch(clearSpecialty());
        navigate('/specialties');
    };

    if (location.pathname === '' || location.pathname === '/login') {
        return null;
    }

    return (
        <nav className="header">
            <div className="header-left">
                {location.pathname === '/table' && (
                    <Button onClick={handleBack} type="link">
                        Back
                    </Button>
                )}
            </div>
            <div className="header-title">
                {location.pathname === '/table' ? selectedSpecialty : 'Specialties'}
            </div>
            <div className="header-right">
                {isLoggedIn ?  (<Button onClick={handleLogout} type="link">
                    Logout
                </Button>) : null
                }
            </div>
        </nav>
    );
};

export default Header;
