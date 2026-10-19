import { db } from "#lib";
import { form, getRequestEvent, query } from "$app/server";
import { EventEmitter, on } from "node:events";

import * as v from "valibot";

const emitter = new EventEmitter();
emitter.setMaxListeners(0);

export const getMotion = query.live(async function* () {
    yield await db.orm.public.Motion.all()
    for await (const _ of on(emitter, "update")) {
        yield await db.orm.public.Motion.all()
    }
});

export const addMotion = form(
    v.object({
        name: v.pipe(v.string(), v.nonEmpty())
    }),
    async ({ name }) => {
        const {cookies} = getRequestEvent()
        const sender = await db.orm.public.User.where({ id: cookies.get("user_id")}).first()
        if (!sender)
            return;
        await db.orm.public.Motion.create({name, creator: sender.username})
        emitter.emit("update")
    },
);