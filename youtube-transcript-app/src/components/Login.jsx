import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to signin page since we now have separate routes
        navigate('/signin', { replace: true });
    }, [navigate]);

    return null;
}
