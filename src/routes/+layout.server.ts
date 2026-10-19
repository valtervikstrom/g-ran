import type { LayoutServerLoad } from './$types';
import { getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { db } from '#lib';

export const load = (async ({cookies, url}) => {
    const logged_in_user = cookies.get("user_id")
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