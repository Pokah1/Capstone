export function getURL() {
  let url: string;
  if (process.env.NEXT_PUBLIC_APP_URL) {
    console.log("🌍 Using NEXT_PUBLIC_APP_URL");
    url = process.env.NEXT_PUBLIC_APP_URL;
  } else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    console.log("🌍 Using NEXT_PUBLIC_VERCEL_URL");
    url = process.env.NEXT_PUBLIC_VERCEL_URL;
  } else {
    console.log("🌍 Using localhost fallback");
    url = "http://localhost:3000/";
  }

  url = url.startsWith("http") ? url : `https://${url}`;
  url = url.endsWith("/") ? url : `${url}/`;

  console.log("✅ Final getURL:", url);
  return url;
}
