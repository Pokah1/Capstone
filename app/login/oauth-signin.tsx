'use client'

import { Provider } from "@supabase/supabase-js";
import { oAuthSignIn } from "./actions";

type OAuthProvider = {
  name: Provider;
  displayName: string;
  icon?: JSX.Element;
};

type OAuthButtonProps = {
  className?: string;
};

export function OAuthButton({ className }: OAuthButtonProps) {
  const oAuthProviders: OAuthProvider[] = [
    {
      name: "github",
      displayName: "GitHub",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.475 2 2 6.475 2 12C2 16.425 4.8625 20.1625 8.8375 21.4875C9.3375 21.575 9.525 21.275 9.525 21.0125C9.525 20.775 9.5125 19.9875 9.5125 19.15C7 19.6125 6.35 18.5375 6.15 17.975C6.0375 17.6875 5.55 16.8 5.125 16.5625C4.775 16.375 4.275 15.9125 5.1125 15.9C5.9 15.8875 6.4625 16.625 6.65 16.925C7.55 18.4375 8.9875 18.0125 9.5625 17.75C9.65 17.1 9.9125 16.6625 10.2 16.4125C7.975 16.1625 5.65 15.3 5.65 11.475C5.65 10.3875 6.0375 9.4875 6.675 8.7875C6.575 8.5375 6.225 7.5125 6.775 6.1375C6.775 6.1375 7.6125 5.875 9.525 7.1625C10.325 6.9375 11.175 6.825 12.025 6.825C12.875 6.825 13.725 6.9375 14.525 7.1625C16.4375 5.8625 17.275 6.1375 17.275 6.1375C17.825 7.5125 17.475 8.5375 17.375 8.7875C18.0125 9.4875 18.4 10.375 18.4 11.475C18.4 15.3125 16.0625 16.1625 13.8375 16.4125C14.2 16.725 14.5125 17.325 14.5125 18.2625C14.5125 19.6 14.5 20.675 14.5 21.0125C14.5 21.275 14.6875 21.5875 15.1875 21.4875C17.1727 20.8173 18.8977 19.5415 20.1198 17.8395C21.3419 16.1376 21.9995 14.0953 22 12C22 6.475 17.525 2 12 2Z"
          />
        </svg>
      ),
    },
    {
      name: "google",
      displayName: "Google",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 48 48">
          <path
            fill="#EA4335"
            d="M24 9.5c3.94 0 7.15 1.64 9.34 3.51l6.91-6.91C36.07 2.3 30.45 0 24 0 14.63 0 6.57 5.55 2.69 13.64l8.07 6.27C12.77 14.04 17.95 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.1 24.5c0-1.57-.14-3.07-.4-4.5H24v9h12.7c-.55 2.82-2.17 5.2-4.61 6.82l7.05 5.48C43.7 37.43 46.1 31.4 46.1 24.5z"
          />
          <path
            fill="#FBBC05"
            d="M10.76 28.36a14.44 14.44 0 0 1-.76-4.36c0-1.52.27-2.99.76-4.36l-8.07-6.27A23.89 23.89 0 0 0 0 24c0 3.84.92 7.46 2.69 10.64l8.07-6.28z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.45 0 11.87-2.13 15.83-5.8l-7.05-5.48C30.85 38.19 27.65 39.5 24 39.5c-6.05 0-11.23-4.54-13.24-10.41l-8.07 6.28C6.57 42.45 14.63 48 24 48z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className={`flex gap-4 ${className || ""}`}>
      {oAuthProviders.map((provider) => (
        <button
          key={provider.name}
          className="flex items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-2 bg-white text-black hover:bg-blue-900 hover:text-white transition-colors"
          onClick={async () => {
            await oAuthSignIn(provider.name);
          }}
        >
          {provider.icon}
          <span className="font-medium">Login with {provider.displayName}</span>
        </button>
      ))}
    </div>
  );
}
