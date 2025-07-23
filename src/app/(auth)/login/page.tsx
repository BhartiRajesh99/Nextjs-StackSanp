"use client";
import { useAuthStore } from "@/store/Auth";
import React from "react";
import Link from "next/link";
import Input from "@/app/components/Input";

function LoginPage() {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }
    setIsLoading(true);
    setError("");
    const loginResponse = await login(email.toString(), password.toString());
    if (loginResponse.error) {
      setError(loginResponse.error!.message);
      console.log('error',error);
      
    }
    setIsLoading(false);
  };

  return (
    <main className="mt-36 flex items-center justify-center">
      <section className="w-full max-w-md p-8 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl flex flex-col gap-6 mx-2">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Sign in to your account
        </h1>
        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit}
          aria-label="Login form"
        >
          <Input
            disabled={isLoading}
            value={email}
            onChange={setEmail}
            labelData="Email"
            type="email"
          />
          <Input
            disabled={isLoading}
            value={password}
            onChange={setPassword}
            labelData="Password"
            type="password"
          />
          {error && (
            <div className="text-red-600 text-sm text-center" role="alert">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer py-2 mt-2 bg-amber-600 hover:bg-amber-700 focus:bg-amber-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed"
            aria-busy={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="flex justify-between items-center mt-2">
          <Link
            href={`/forgot-password`}
            className="text-sm font-bold text-amber-600 hover:underline focus:underline focus:outline-none transition"
            tabIndex={0}
          >
            Forgot password?
          </Link>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Don't have an account?
            </span>
            <Link
              href="/register"
              className="font-bold text-amber-600 hover:underline focus:underline focus:outline-none transition text-sm"
            >
              Register
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
