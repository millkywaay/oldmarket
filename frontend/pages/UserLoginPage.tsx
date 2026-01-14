import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import FormField from "../components/common/FormField";
import Button from "../components/common/Button";
import { swalService } from "../services/swalService";

const UserLoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error: authError } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      swalService.error("Error", "Please enter both email and password.");
      return;
    }
    try {
      const result = await login({ identifier, password });
      swalService.toast("Login berhasil!", "success");
      if (result?.user?.role == "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
    } catch (err: any) {
      swalService.error("Error", err.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-xl shadow-lg border">
          <div className="text-center">
            <img
              src="/images/logo.svg"
              alt="oldmarket"
              className="mx-auto h-24 w-auto"
            />
            <p className="mt-2 mb-5 text-center text-3xl text-black font-bold">
              Login
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {(authError || formError) && (
              <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md text-center">
                {authError || formError}
              </p>
            )}
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
            <div>
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                size="lg"
              >
                Login
              </Button>
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-black hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;
