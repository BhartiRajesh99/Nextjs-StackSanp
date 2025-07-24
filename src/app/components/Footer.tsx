"use client";
import React from "react";
import { Boxes } from "../../components/ui/background-boxes";

export function Footer() {
  const [year, setYear] = React.useState<number | null>(null);

  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const items = [
    {
      title: "Home",
    },
    {
      title: "About",
    },
    {
      title: "Privacy Policy",
    },
    {
      title: "Terms of Service",
    },
    {
      title: "Questions",
    },
  ];
  return (
    <div className="h-60 border-t-1 border-t-white relative w-full overflow-hidden bg-transparent flex flex-col gap-3 items-center justify-center ">
      <div className="absolute inset-0 w-full h-full bg-slate-900 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      <div className="flex gap-8 items-center justify-center">
        {items.map((elem) => (
          <p key={Math.random()} className="text-center mt-2 text-neutral-300 relative">
            {elem.title}
          </p>
        ))}
      </div>
      <div className="mt-4 relative text-center text-neutral-300">
        &copy; {year ? year : ""} SnapShot
      </div>
    </div>
  );
}
