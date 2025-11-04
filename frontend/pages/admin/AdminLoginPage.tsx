
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import FormField from '../../components/common/FormField';
import Button from '../../components/common/Button';
import { LOGO_TEXT } from '../../constants';

const AdminLoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('admin'); // Default for easier testing
  const [password, setPassword] = useState('adminpass'); // Default for easier testing
  const { login, isLoading, error: authError } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!identifier || !password) {
      setFormError('Please enter both identifier and password.');
      return;
    }
    try {
      await login({ identifier, password });
    } catch (err: any) {
      setFormError(err.message || 'Admin login failed. Ensure you have admin credentials.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
            <h2 className="text-5xl font-extrabold text-white">{LOGO_TEXT}</h2>
            <p className="mt-2 text-center text-md text-gray-300">
                Administrator Login
            </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {(authError || formError) && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md text-center">{authError || formError}</p>}
              <FormField
                label="Admin Identifier (Username/Email)"
                name="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoComplete="username"
                placeholder="admin"
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
              <div>
                <Button type="submit" className="w-full" variant="primary" isLoading={isLoading} size="lg">
                  Sign In as Admin
                </Button>
              </div>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
              Not an Admin?{' '}
              <Link to="/login" className="font-medium text-black hover:underline">
                Login as User
              </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
