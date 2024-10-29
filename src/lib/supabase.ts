import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import type { APIContext, AstroGlobal } from 'astro'
import type { Database } from '../database.types'

import { createClient as createClientClient } from "@supabase/supabase-js";

export const supabase = createClientClient<Database>(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY,
);

export function createClient(context: APIContext | AstroGlobal) {
    return createServerClient(
        import.meta.env.SUPABASE_URL,
        import.meta.env.SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return parseCookieHeader(context.request.headers.get('Cookie') ?? '')
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        context.cookies.set(name, value, options))
                },
            }
        }
    )
}

export async function getUser(context: APIContext | AstroGlobal) {
    const supabase = createClient(context);
    const {
        data: { user },
        error
    } = await supabase.auth.getUser();

    if (error) console.error(error.message);

    return user;
}