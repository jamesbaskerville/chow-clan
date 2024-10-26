// With `output: 'hybrid'` configured:
export const prerender = false;
import type { APIRoute } from "astro";
import { createClient } from "../../../lib/supabase";

export const POST: APIRoute = async (context) => {
    const { request } = context;
    const formData = await request.formData();
    const email = formData.get("email")?.toString();

    if (!email) {
        return new Response("Email is required", { status: 400 });
    }

    const supabase = createClient(context);
    const { error } = await supabase.auth.updateUser({ email })

    if (error) {
        return new Response(error.message, { status: 500 });
    }

    return new Response("Updated email", { status: 200 });
};