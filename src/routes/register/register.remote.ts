import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import { form, getRequestEvent, query } from "$app/server";
import { redirect, invalid } from "@sveltejs/kit";
import { error } from "node:console";
import * as v from "valibot";
import { db } from "#lib";

export const signup = form(
    v.object({
        username: v.string(),
        _password: v.string()
    }),
    async ({username, _password}, issue) => {
        const taken = await db.orm.public.User.first({username})
        if (taken){
            return {error: 'Användarnamn används redan'}}
        if (_password.length < 8)
            return {error: 'Lösenord måste vara minst 8 tecken'}
        const user = await db.orm.public.User.create({
            username,
            passwordHash: hashPassword(_password)
        })
        redirect(303, "/login")
        
    }
)

function hashPassword(_password: string){
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(_password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}