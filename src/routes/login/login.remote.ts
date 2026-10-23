import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import { form, getRequestEvent, query } from "$app/server";
import { redirect, invalid } from "@sveltejs/kit";
import { error } from "node:console";
import * as v from "valibot";
import { db } from "#lib";
import { createToken } from "#lib/server/jwt.js";

export const login = form(
    v.object({
        username: v.string(),
        _password: v.string()
    }),
    async ({username, _password}) => {
        const {cookies} = getRequestEvent();
        const user = await db.orm.public.User.where({ username }).first();
        if (!user || !verifyPassword(_password, user.passwordHash)){
            return {error: 'Wrong username or password'}}
        else {
            const token = await createToken(user.id)
            cookies.set("session", token, { path: "/", httpOnly: true})
            redirect(303, "/")
        }
    }
)

export const logout = form(
    async () => {
    const {cookies} = getRequestEvent();
    cookies.delete("session", {path: "/"})}
)

function verifyPassword(password: string, stored: string){
    const [salt, hash] = stored.split(':');
    const attempt = scryptSync(password, salt, 64);
    return timingSafeEqual(Buffer.from(hash, 'hex'), attempt)
}

