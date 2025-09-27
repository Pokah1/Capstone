"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Logo from "@/app/assets/logo.png";
import profileImage from "@/app/assets/profiles/profile-pic.jpg";
import { createClient } from "@/utils/supabase/client";
import {
  LayoutDashboard,
  FileText,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { UserProfile } from "@/types/user";
import ToastWrapper from "../ToastWrapper";

interface SideNavProps {
  isCompact?: boolean;
}

const SideNav: React.FC<SideNavProps> = ({ isCompact = false }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authUser, setAuthUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);


  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setAuthUser(user);

      const { data: dbProfile } = await supabase
        .from("users")
        .select("id, full_name, avatar_url")
        .eq("id", user.id)
        .single<UserProfile>();

      if (dbProfile) setProfile(dbProfile);
    };
    fetchUser();
  }, [supabase]);

  const signOut = async () => {
    const confirmed = window.confirm("Log out?");
    if (!confirmed) return;


    const { error } = await supabase.auth.signOut();
    if (!error) {
      localStorage.clear();
      setAuthUser(null);
      setProfile(null);
      setToast({message: "Signed out successfully!", type: "success"})
      router.push("/");
    } else {
      setToast({message: "Failed to sign out.", type: "error"})
    }
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      onClick: () => router.push("/dashboard"),
    },
    {
      title: "Content",
      icon: FileText,
      onClick: () => router.push("/content"),
    },
  ];

  const accountItems = [
    { title: "My-Post", icon: User, onClick: () => router.push("/my-posts") },
    {
      title: "Profile",
      icon: Settings,
      onClick: () => router.push("/profile"),
    },
    { title: "Logout", icon: LogOut, onClick: signOut },
  ];


  const displayName =
  profile?.full_name && profile.full_name !== "Anonymous"
    ? profile.full_name
    : authUser?.email || "Guest";

    
  const displayAvatar = profile?.avatar_url || profileImage;

  const handleClick = (onClick?: () => void) => {
    if (onClick) onClick();
    setIsOpen(false);
  };

  if (!mounted) return null; // prevent flash before mount

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-900 text-white lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full overflow-y-auto
          bg-gradient-to-b from-gray-800/60 via-gray-900/50 to-black/70
          backdrop-blur-xl border-r border-white/10 text-white z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative flex flex-col`}
      >
        {/* Logo */}
        <div className="flex items-center p-4 mb-6 mt-6">
          <Image src={Logo} alt="logo" className="rounded-full w-10 h-10" />
          {!isCompact && (
            <span className="text-white text-3xl font-semibold whitespace-nowrap font-playfair">
              Chatter
            </span>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 flex flex-col">
          <ul className="space-y-4">
            {menuItems.map((item, idx) => (
              <li key={idx}>
                <button
                  onClick={() => handleClick(item.onClick)}
                  className={`flex items-center w-full p-3 rounded hover:bg-white/20 transition-colors ${
                    isCompact
                      ? "justify-center"
                      : "gap-4 font-poppins text-base"
                  }`}
                  title={isCompact ? item.title : undefined}
                >
                  <item.icon className="w-6 h-6" />
                  {!isCompact && item.title}
                </button>
              </li>
            ))}
            {accountItems.map((item, idx) => (
              <li key={idx}>
                <button
                  onClick={() => handleClick(item.onClick)}
                  className={`flex items-center w-full p-3 rounded hover:bg-white/20 mt-6 transition-colors ${
                    isCompact
                      ? "justify-center"
                      : "gap-4 font-poppins text-base"
                  }`}
                  title={isCompact ? item.title : undefined}
                >
                  <item.icon className="w-6 h-6" />
                  {!isCompact && item.title}
                </button>
              </li>
            ))}
          </ul>

          {/* Profile at bottom */}
          <div className="mt-auto p-6 flex items-center gap-4 border-t border-gray-700">
            <Image
              src={displayAvatar}
              alt="avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            {!isCompact && (
              <div className="flex flex-col font-poppins text-base">
                <span className="font-medium">{displayName}</span>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Toast*/}
      {toast && <ToastWrapper message={toast.message} type={toast.type}/>}
    </>
  );
};

export default SideNav;
