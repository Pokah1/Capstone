export const getURL = (path: string = '') =>{
    let url = 
    process?.env?.NEXT_PUBLIC_SITE_URL && 
    process.env.NEXT_PUBLIC_SITE_URL.trim() !== '' ? process.env.NEXT_PUBLIC_SITE_URL
    :
    process?.env?.NEXT_PUBLIC_VERCEL_URL &&
    process.env.NEXT_PUBLIC_VERCEL_URL.trim() !== ''? process.env.NEXT_PUBLIC_VERCEL_URL
    : //if neither is set, default to localhost for local development
    'http://localhost:3000/';

    //Trim the URL and remove trailing slash if exists
    url = url.replace(/\/+$/, '');
    // Ensure the path include 'http://' when not localhost.
    url =url.includes('http') ? url: `https://${url}`;
    //Ensure teh path starts without a slash to avoid double slash
    path = path.replace(/^\/+/, '');

    return path ? `${url}/${path}` : url;
}