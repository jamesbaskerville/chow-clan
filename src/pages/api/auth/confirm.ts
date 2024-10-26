export const prerender = false;
// All registering will be done by server admin
import type { APIRoute } from "astro";
import { createClient } from "../../../lib/supabase";
import type { EmailOtpType } from "@supabase/supabase-js";

export const GET: APIRoute = async (context) => {
    console.log('Confirm auth');
    const {  url, redirect } = context;
    const token_hash = url.searchParams.get('token_hash') ?? '';
    const type = url.searchParams.get('type') as EmailOtpType ?? null;

    const supabase = createClient(context);
    const { data: { session }, error } = await supabase.auth.verifyOtp({ token_hash, type })

    if (error) {
        console.log(error);
    }


    return redirect("/dashboard");
};
