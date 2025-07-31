import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Store token in localStorage or context
      localStorage.setItem('token', token);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [navigate, searchParams]);

  return <div>Completing authentication...</div>;
}