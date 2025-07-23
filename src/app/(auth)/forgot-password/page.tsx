"use client";
import Input from "@/app/components/Input";
import { account } from "@/models/client/config";
import React from "react";
import toast from "react-hot-toast";

function ForgotPasswordPage() {

  const [isLoading, setIsLoading] = React.useState(true);
  const [email, setEmail] = React.useState("");

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const user = await account.createRecovery(
        email,
        "http://localhost:3000/create-new-password"
      );
      console.log(user);
      toast.success("Email Sent. Check Email");
      setEmail("")
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message);
    }
  };
  React.useEffect(() => {
    setIsLoading(false);
  }, []);
  return (
    <main className="pt-20 h-screen flex items-center justify-center">
      <section className="w-full max-w-md p-8 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl flex flex-col gap-6 mx-2">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Email For Create New Password
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
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${email ? "cursor-pointer" : "cursor-not-allowed opacity-50" } py-2 mt-2 bg-amber-600 hover:bg-amber-700 focus:bg-amber-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed`}
            aria-busy={isLoading}
          >
            {isLoading ? "Sending Email..." : "Send Email"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default ForgotPasswordPage;
