import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase-config';
import { HOME } from '../lib/routes';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterPage } from './RegisterPage';

export const LandingPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if(auth.currentUser?.email) navigate(HOME);
    }, [])
    return (
        <div>
            <LoginForm />
        </div>
    );
};