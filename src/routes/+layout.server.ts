import type { LayoutServerLoad } from './$types';
import { getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { db } from '#lib';
import { readToken } from '#lib/server/jwt.js';

export const load = (async ({cookies, url}) => {
    const token_cookie = cookies.get("session")
    const logged_in_user = await readToken(token_cookie)
    if (logged_in_user != undefined){
        let user  = await db.orm.public.User.where({ id: logged_in_user }).first()
        if (user == null && url.pathname != "/login" && url.pathname != "/register" && url.pathname != "/motioner")
            redirect(303, "/login")
        else if (user != null)
            return {username: user?.username};
    }

    if (logged_in_user == undefined){
        if (url.pathname != "/login" && url.pathname != "/register")
            redirect(303, "/login")}
    
    return {};
}) satisfies LayoutServerLoad;