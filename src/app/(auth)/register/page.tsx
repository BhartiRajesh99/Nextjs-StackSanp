"use client";
import { useAuthStore } from "@/store/Auth";
import React, { useState } from "react";
import Link from "next/link";
import Input from "@/app/components/Input";

export default function RegisterPage() {
  const { createAccount, login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }
    
    setIsLoading(true);
    setError("");
    const response = await createAccount(
      name.toString(),
      email.toString(),
      password.toString()
    );
    if (response.error) {
      console.log(response)
      const message = response.error!.message.split(':')[1]
      setError(message);
    } else {
      const loginResponse = await login(email.toString(), password.toString());
      if (loginResponse.error) {
        setError(loginResponse.error!.message);
      }
    }
    setIsLoading(false);
  };

  return (
    <main className="mt-36 flex items-center justify-center ">
      <section className="w-full max-w-md p-8 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl flex flex-col gap-6 mx-2">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Create your account
        </h1>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
          aria-label="Register form"
        >
          <Input
            disabled={isLoading}
            value={name}
            onChange={setName}
            labelData="Name"
            type="text"
          />
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
            className="w-full cursor-pointer py-2 mt-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed"
            aria-busy={isLoading}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <div className="flex justify-center items-center mt-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Already have an account?
          </span>
          <Link
            href="/login"
            className="font-bold text-amber-600 hover:underline focus:underline focus:outline-none transition text-sm"
          >
            Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
