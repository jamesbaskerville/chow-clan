import { defineMiddleware } from "astro:middleware";
import { createClient } from "./lib/supabase";

const allowedAdminRoutes = ["/admin/login", "/admin/check-email", "/admin/logout"]

export const onRequest = defineMiddleware(async (context, next) => {
    console.log('Middleware');

    const { url, redirect, locals } = context;

    if (!url.pathname.startsWith('/admin')){
        return next();
    }

    const supabase = createClient(context);
    const {
        data: { user },
        error
    } = await supabase.auth.getUser();
    if (error) console.error(error.message);

    (locals as any).user = user ? user : null;

    if (!allowedAdminRoutes.includes(url.pathname) && !user) {
        console.log("User not found, redirecting to /admin/login from ", url.pathname);
        return redirect("/admin/login");
    }

    return next();
})
