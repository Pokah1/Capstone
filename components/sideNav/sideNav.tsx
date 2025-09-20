"use client";
import React, { SVGProps, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/app/assets/logo.png";
import dashboardIcon from "@/app/assets/dashboard.svg";
import contentIcon from "@/app/assets/content.svg";
import profileIcon from "@/app/assets/profile.svg";
import settingsIcon from "@/app/assets/settings.svg";
import { createClient } from "@/utils/supabase/client";
import profileImage from "@/app/assets/profile-pic.jpg";
import logoutIcon from "@/app/assets/logout.svg";
import AuthWrapper from "../AuthWrapper";

import { UserProfile } from "@/types/user";

const SideNav: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authUser, setAuthUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setAuthUser(null);
          setProfile(null);
          return;
        }

        setAuthUser(user);

        const { data: dbProfile } = await supabase
          .from("users")
          .select("id, full_name, avatar_url")
          .eq("id", user.id)
          .single<UserProfile>();

        if (dbProfile) {
          setProfile(dbProfile);
        }
      } catch (error) {
        console.error("Error fetching user/profile:", error);
      }
    };

    fetchUser();
  }, [supabase]);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else {
      localStorage.clear();
      setAuthUser(null);
      setProfile(null);
      router.push("/");
    }
  };

  interface MenuItems {
    title: string;
    icon: React.FC<SVGProps<SVGSVGElement>>;
    onClick?: () => void;
  }

  const menuItems: MenuItems[] = [
    { title: "Dashboard", icon: dashboardIcon, onClick: () => router.push("/dashboard") },
    { title: "Content", icon: contentIcon, onClick: () => router.push("/content") },
  ];

  const accountItems: MenuItems[] = [
    { title: "My-Post", icon: profileIcon, onClick: () => router.push("/my-posts") },
    { title: "Profile", icon: settingsIcon, onClick: () => router.push("/profile") },
    { title: "Logout", icon: logoutIcon, onClick: signOut },
  ];

  // ✅ Pick final display name and avatar
  const displayName =
    profile?.full_name ||
    (authUser?.user_metadata?.full_name as string) ||
    authUser?.email ||
    "Guest";

  const displayAvatar =
    profile?.avatar_url ||
    (authUser?.user_metadata?.avatar_url as string) ||
    profileImage;

  return (
    <AuthWrapper>
      <main className="container">
        <aside
          className={`
            group fixed top-0 left-0 h-screen 
            flex flex-col border-r border-white/20 
            bg-transparent backdrop-blur-sm 
            overflow-x-hidden transition-all duration-300
            w-[85px] hover:w-[200px]
          `}
        >
          {/* Header */}
          <div className="flex items-center p-4 mb-6">
            <Link href="/" className="flex items-center gap-3">
              <Image src={Logo} alt="logo" className="rounded-full w-10 h-10" />
              <h2 className="hidden group-hover:block text-white text-3xl font-semibold whitespace-nowrap font-playfair">
                Chatter
              </h2>
            </Link>
          </div>

          {/* Menu */}
          <ul className="flex-1 overflow-y-auto px-2">
            <h4 className="text-gray-400 text-sm my-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 font-poppins">
              Main Menu
            </h4>
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  onClick={item.onClick}
                  className="flex items-center gap-3 text-white py-3 px-2 rounded-md hover:bg-white/20 transition font-poppins"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="hidden group-hover:inline">{item.title}</span>
                </a>
              </li>
            ))}

            <h4 className="text-gray-400 text-sm my-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Account
            </h4>
            {accountItems.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  onClick={item.onClick}
                  className="flex items-center gap-3 text-white py-3 px-2 rounded-md hover:bg-white/20 transition"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="hidden group-hover:inline">{item.title}</span>
                </a>
              </li>
            ))}
          </ul>

          {/* User Section */}
          <div className="p-4">
            <div className="flex items-center gap-3 bg-transparent hover:bg-black/40 rounded-md p-2 transition">
              <Image
                src={displayAvatar}
                alt="user-profile"
                width={40}
                height={40}
                className="rounded-full border border-white/30"
              />
              <div className="hidden group-hover:block">
                <span className="text-white text-sm font-medium font-poppins">
                  {displayName}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </AuthWrapper>
  );
};

export default SideNav;
