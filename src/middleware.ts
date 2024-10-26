import { defineMiddleware } from "astro:middleware";
import { createClient } from "./lib/supabase";

const protectedRoutes = ["/", "/family-tree", "/profile", "/events"];

export const onRequest = defineMiddleware(async (context, next) => {
    console.log('Middleware');
    const { request, url, redirect, locals } = context;

    if (!protectedRoutes.includes(url.pathname)){
        return next();
    }

    const supabase = createClient(context);
    const {
        data: { user },
        error
    } = await supabase.auth.getUser();
    if (error) console.error(error.message);

    (locals as any).user = user ? user : null;

    if (protectedRoutes.includes(url.pathname) && !user) {
        console.log("User not found, redirecting to /login from ", url.pathname);
        return redirect("/login");
    }

    return next();

})
