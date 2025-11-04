import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';
import { LOGO_TEXT } from '../constants';

const UserLoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState(''); 
  const { login, isLoading, error: authError } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!identifier || !password) {
      setFormError('Please enter both email and password.');
      return;
    }
    try {
      const result = await login({identifier, password});
      if (result?.user?.role == 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/home');
      }
    } catch (err: any) {
      setFormError(err.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-black">{LOGO_TEXT}</h2>
          <p className="mt-2 text-center text-md text-gray-600">
            Sign in to your account
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {(authError || formError) && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md text-center">{authError || formError}</p>}
            <FormField
              label="Email"
              name="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoComplete="username"
              placeholder="yourname@example.com"
            />
            <FormField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between text-sm">
              <div/>
              <a href="#" className="font-medium text-black hover:underline">
                Forgot your password?
              </a>
            </div>

            <div>
              <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
                Sign In
              </Button>
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-black hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;