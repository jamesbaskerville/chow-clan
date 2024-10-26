// With `output: 'hybrid'` configured:
export const prerender = false;
import type { APIRoute } from "astro";
// TODO
export const GET: APIRoute = async ({ cookies, redirect }) => {
    cookies.delete("sb-access-token", { path: "/" });
    cookies.delete("sb-refresh-token", { path: "/" });
    return redirect("/login");
};