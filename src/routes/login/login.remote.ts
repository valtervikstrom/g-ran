import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import { form, getRequestEvent, query } from "$app/server";
import { redirect, invalid } from "@sveltejs/kit";
import { error } from "node:console";
import * as v from "valibot";
import { db } from "#lib";
import { hashToken } from "#lib/server/session.js";

export const login = form(
    v.object({
        username: v.string(),
        _password: v.string()
    }),
    async ({username, _password}) => {
        const token = randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const {cookies} = getRequestEvent();
        const user = await db.orm.public.User.where({ username }).first();
        if (!user || !verifyPassword(_password, user.passwordHash)){
            return {error: 'Wrong username or password'}}
        else {
            const other_units = await db.orm.public.Session.where({ userid: user.id }).all()
            for (const unit of other_units){
                await db.orm.public.Session.where({ userid: user.id }).delete()
            }
            await db.orm.public.Session.create({tokenHash: hashToken(token), userid: user.id})
            cookies.set("session", token, { path: "/", httpOnly: true})
            redirect(303, "/")
        }
    }
)

export const logout = form(
    async () => {
    const {cookies} = getRequestEvent();
    const token = cookies.get("session");
    if (token != undefined)
        db.orm.public.Session.where({ tokenHash: hashToken(token) }).delete()
    cookies.delete("session", {path: "/"})}
)

function verifyPassword(password: string, stored: string){
    const [salt, hash] = stored.split(':');
    const attempt = scryptSync(password, salt, 64);
    return timingSafeEqual(Buffer.from(hash, 'hex'), attempt)
}

