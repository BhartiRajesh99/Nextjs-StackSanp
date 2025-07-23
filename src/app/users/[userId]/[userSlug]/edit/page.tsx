"use client";
import Input from "@/app/components/Input";
import React from "react";
import { account } from "@/models/client/config";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthStore, UserPrefs } from "@/store/Auth";

const EditPage = () => {
  const {setUser, refreshUser} = useAuthStore()
  const router = useRouter()
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [disabled, setDisabled] = React.useState(true);

  const handleClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // No input provided
    if (!email && !name && !newPassword) {
      toast.error("Please enter details to update.");
      return;
    }

    // Email or password update requires old password
    if ((email || newPassword) && !oldPassword) {
      toast.error("Old password is required for sensitive changes.");
      return;
    }

    try {
      // Sequentially update only the provided fields
      if (email) {
        await account.updateEmail(email, oldPassword);
      }
      if (newPassword) {
        await account.updatePassword(newPassword, oldPassword);
      }
      if (name) {
        await account.updateName(name);
      }

      // Fetch and set the latest user info
      const updatedUser = await account.get<UserPrefs>();
      setUser(updatedUser);
      toast.success("Profile updated successfully!");

      // Clear input fields
      setEmail("");
      setName("");
      setNewPassword("");
      setOldPassword("");

      // Optionally navigate back
      router.back();
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.error(error?.message || "Something went wrong.");
    }
  };

  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (email || newPassword || name || oldPassword) 
      setDisabled(false);
    else 
      setDisabled(true);
  }, [email, newPassword, name, oldPassword]);

  return (
    <div className="container flex items-center justify-center mx-auto space-y-4 px-4">
      <div className="w-full px-20 flex justify-center items-center rounded-lg">
        <form onSubmit={handleClick} className="flex w-full flex-col gap-8">
          <Input
            type="text"
            labelData="Name"
            value={name}
            onChange={setName}
            disabled={isLoading}
          />
          <Input
            type="email"
            labelData="Email"
            value={email}
            onChange={setEmail}
            disabled={isLoading}
          />
          <Input
            type="password"
            labelData="Old Password"
            value={oldPassword}
            onChange={setOldPassword}
            disabled={isLoading}
          />
          <Input
            type="password"
            labelData="New Password"
            value={newPassword}
            onChange={setNewPassword}
            disabled={isLoading}
          />
          <div className="flex items-center justify-center">
            <input
              className={`px-8 py-2 rounded-lg ${
                disabled
                  ? "bg-amber-500 cursor-not-allowed opacity-60"
                  : "bg-amber-500 hover:bg-amber-700 cursor-pointer active:scale-98"
              } text-white font-bold `}
              type="submit"
              disabled={disabled}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPage;
