// With `output: 'hybrid'` configured:
export const prerender = false;
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

const getURL = () => {
    let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
        process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
        'http://localhost:4321/'
    // Make sure to include `https://` when not localhost.
    url = url.startsWith('http') ? url : `https://${url}`
    // Make sure to include a trailing `/`.
    url = url.endsWith('/') ? url : `${url}/`
    return url
}

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    // const password = formData.get("password")?.toString();

    if (!email) {
        return new Response("Email is required", { status: 400 });
    }

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            shouldCreateUser: false,
            emailRedirectTo: getURL(),
        },
    });


    if (error) {
        return new Response(error.message, { status: 500 });
    }

    // const { access_token, refresh_token } = data.session;
    // cookies.set("sb-access-token", access_token, {
    //     path: "/",
    // });
    // cookies.set("sb-refresh-token", refresh_token, {
    //     path: "/",
    // });
    return redirect("/profile");
};