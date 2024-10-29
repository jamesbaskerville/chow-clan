// With `output: 'hybrid'` configured:
export const prerender = false;
import type { APIRoute } from "astro";
import { createClient } from "../../lib/supabase";


export const GET: APIRoute = async (context) => {
    const { redirect } = context;
    const supabase = createClient(context);
    const { error } = await supabase.auth.signOut()

    if (error) {
        return new Response(error.message, { status: 500 });
    }

    return redirect("/dashboard");
};