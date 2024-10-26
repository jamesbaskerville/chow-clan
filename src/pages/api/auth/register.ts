export const prerender = false;
// All registering will be done by server admin
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, redirect }) => {
    return redirect("/login");
};
