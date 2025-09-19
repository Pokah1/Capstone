"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AuthWrapper from "@/components/AuthWrapper";
import { UserProfile } from "@/types/ser";

const supabase = createClient();


const SettingsPage = () => {
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

          // ✅ full name priority
          const name =
  profile.full_name ||
  (authUser.user_metadata?.full_name as string) ||
  "Anonymous";


          // ✅ avatar priority
          const avatar =
            profile.avatar_url ||
            (authUser.user_metadata?.avatar_url as string) ||
            "";

          setFullName(name);
          setAvatarUrl(avatar);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchUser();
  }, [router]);

  const handleSave = async () => {
    if (!user) return;

    const nameToSave = fullName.trim() || "Anonymous";

    setSaving(true);
    try {
      await supabase
        .from("users")
        .update({
          full_name: nameToSave,
          avatar_url: avatarUrl || null,
        })
        .eq("id", user.id);

      setUser({ ...user, full_name: nameToSave, avatar_url: avatarUrl || null });
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

        // ✅ update users table immediately with new avatar
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
      <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-xl shadow-md mt-10 text-white">
        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 mb-4 text-yellow-400 hover:text-yellow-500"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-2xl font-semibold mb-4">My Profile</h1>

        <div className="flex flex-col items-center mb-6">
          <Image
            src={avatarUrl || "/profile-dp.png"}
            alt="avatar"
            width={100}
            height={100}
            className="rounded-full border-2 border-yellow-400"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
            className="mt-4 text-sm text-gray-300"
            disabled={uploading}
          />
          {uploading && <p className="text-yellow-400 mt-2">Uploading...</p>}
        </div>

        <label className="block mb-2 text-sm font-medium">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter full name"
          className="w-full p-2 rounded-md bg-gray-800 text-white mb-4"
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-500 transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </AuthWrapper>
  );
};

export default SettingsPage;
