"use client";

import { avatars } from "@/models/client/config";
import convertDateToRelativeTime from "@/utils/relativeTime";
import React from "react";
import EditButton from "./EditButton";
import Navbar from "./Navbar";
import { IconClockFilled, IconUserFilled } from "@tabler/icons-react";
import { useAuthStore } from "@/store/Auth";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const user: any = useAuthStore((state) => state.user);

  return (
    <div className=" space-y-4 px-4 pb-20 pt-32">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="w-40 shrink-0">
          <picture className="block w-full">
            <img
              src={avatars.getInitials(user ? user?.name : "unknown", 200, 200)}
              alt={user ? user?.name : "unknown"}
              className="h-full w-full rounded-xl object-cover"
            />
          </picture>
        </div>
        <div className="w-full">
          <div className="flex items-start justify-between">
            <div className="block space-y-0.5">
              <h1 className="text-3xl font-bold">
                {user ? user?.name : "unknown"}
              </h1>
              <p className="text-lg text-gray-500">
                {user ? user?.email : "unknown"}
              </p>
              <p className="flex items-center gap-1 text-sm font-bold text-gray-500">
                <IconUserFilled className="w-4 shrink-0" /> Dropped{" "}
                {user
                  ? convertDateToRelativeTime(new Date(user?.$createdAt))
                  : "unkown"}
                ,
              </p>
              <p className="flex items-center gap-1 text-sm text-gray-500">
                <IconClockFilled className="w-4 shrink-0" /> Last activity&nbsp;
                {user
                  ? convertDateToRelativeTime(new Date(user?.$updatedAt))
                  : "unknown"}
              </p>
            </div>
            <div className="shrink-0">
              <EditButton />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Navbar />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
