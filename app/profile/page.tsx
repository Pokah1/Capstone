"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AuthWrapper from "@/components/AuthWrapper";
import { UserProfile } from "@/types/user";

const supabase = createClient();

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          router.push("/");
          return;
        }

        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single<UserProfile>();

        if (profile) {
          setUser(profile);

          setFullName(
            profile.full_name ||
              (authUser.user_metadata?.full_name as string) ||
              "Anonymous"
          );
          setAvatarUrl(
            profile.avatar_url ||
              (authUser.user_metadata?.avatar_url as string) ||
              ""
          );
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchUser();
  }, [router]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      await supabase
        .from("users")
        .update({
          full_name: fullName.trim() || "Anonymous",
          avatar_url: avatarUrl || null,
        })
        .eq("id", user.id);

      setUser({ ...user, full_name: fullName, avatar_url: avatarUrl || null });
      alert("Profile updated!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file: File) => {
    if (!user) return;
    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });
      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      if (urlData?.publicUrl) {
        setAvatarUrl(urlData.publicUrl);
        await supabase
          .from("users")
          .update({ avatar_url: urlData.publicUrl })
          .eq("id", user.id);
        setUser({ ...user, avatar_url: urlData.publicUrl });
      }
    } catch (err) {
      console.error("Error uploading avatar:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AuthWrapper>
      <div className="max-w-lg mx-auto p-6 sm:p-8 bg-gray-900 rounded-2xl shadow-xl mt-10 text-white font-poppins">
        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 mb-6 text-white font-medium transition"
        >
          ← Back to Dashboard
        </button>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-playfair font-bold mb-6 text-center text-yellow-400">
          My Profile
        </h1>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32">
            <Image
              src={avatarUrl || "/profile-dp.png"}
              alt="avatar"
              width={128}
              height={128}
              className="rounded-full border-4 border-yellow-400 object-cover"
            />
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
            className="mt-4 text-sm text-gray-300 cursor-pointer"
            disabled={uploading}
          />
          {uploading && (
            <p className="text-yellow-400 mt-2 text-sm">Uploading...</p>
          )}
        </div>

        {/* Full Name */}
        <label className="block mb-2 text-sm font-medium">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter full name"
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-6"
        />

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition shadow-md text-lg"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </AuthWrapper>
  );
};

export default ProfilePage;
