import type { LayoutServerLoad } from './$types';
import { getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { db } from '#lib';
import { hashToken } from '#lib/server/session.js';

export const load = (async ({cookies, url}) => {
    const token = cookies.get("session")
    if (token != undefined){
        const session = await db.orm.public.Session.where({ tokenHash: hashToken(token) }).first()

        if (session != undefined){
            let user  = await db.orm.public.User.where({ id: session.userid }).first()
            if (user == null && url.pathname != "/login" && url.pathname != "/register" && url.pathname != "/motioner")
                redirect(303, "/login")
            else if (user != null)
                return {username: user?.username};
        }

        if (session == undefined){
            if (url.pathname != "/login" && url.pathname != "/register")
                redirect(303, "/login")}
    }
    else{
        if (url.pathname != "/login" && url.pathname != "/register")
                redirect(303, "/login")
    }
    return {};
}) satisfies LayoutServerLoad;