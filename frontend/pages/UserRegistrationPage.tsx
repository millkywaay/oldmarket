
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';
import { LOGO_TEXT } from '../constants';

const UserRegistrationPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading, error: authError } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    if (!username || !email || !password) {
      setFormError('Please fill in all fields.');
      return;
    }
    try {
      await register({ username, email, password });
    } catch (err: any) {
      setFormError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-center text-5xl font-extrabold text-black">{LOGO_TEXT}</h2>
          <p className="mt-2 text-center text-md text-gray-600">
            Create your customer account
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {(authError || formError) && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md text-center">{authError || formError}</p>}
              <FormField
                label="Username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Choose a username"
              />
              <FormField
                label="Email address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="yourname@example.com"
              />
              <FormField
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Create a password (min. 8 characters)"
              />
              <FormField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Confirm your password"
              />
              <div>
                <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
                  Register
                </Button>
              </div>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-black hover:underline">
                Sign in here
              </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default UserRegistrationPage;
