import { db } from "#lib";
import { hashToken } from "#lib/server/session.ts";
import { form, getRequestEvent, query } from "$app/server";
import { EventEmitter, on } from "node:events";

import * as v from "valibot";

const emitter = new EventEmitter();
emitter.setMaxListeners(0);

export const getVote = query.live(v.string(), async function* (id) {
    yield await db.orm.public.Votes.where({ motionId: id }).all()
    for await (const _ of on(emitter, id)) {
        yield await db.orm.public.Votes.where({ motionId: id }).all()
    }
});

export const getVotesFor = query.live(v.string(), async function* (id) {
    var tallyFor = 0;
    for await (const vote of db.orm.public.Votes.where({ motionId: id}).all()){
        if (vote.position == "FÖR"){
            tallyFor = tallyFor + 1
            console.log(tallyFor)
        }
    };
    yield tallyFor;
    for await (const _ of on(emitter, id)) {
        var tallyFor = 0;
        for await (const vote of db.orm.public.Votes.where({ motionId: id}).all()){
            if (vote.position == "FÖR"){
                tallyFor = tallyFor + 1
                console.log(tallyFor)
            }
        };
        yield tallyFor;
    }
})

export const getVotesAgainst = query.live(v.string(), async function* (id) {
    var tallyAgainst = 0;
    for await (const vote of db.orm.public.Votes.where({ motionId: id}).all()){
        if (vote.position == "EMOT"){
            tallyAgainst += 1
        }
    };
    yield tallyAgainst;
    for await (const _ of on(emitter, id)) {
        var tallyAgainst = 0;
        for await (const vote of db.orm.public.Votes.where({ motionId: id}).all()){
            if (vote.position == "EMOT"){
                tallyAgainst += 1
            }
        };
        yield tallyAgainst;
    }
})

export const addVoteFor = form(
    v.object({
        id: v.string(),
    }),
    async ({id}) => {
        const {cookies} = getRequestEvent()
        const cookie_receiver = cookies.get("session")
        const token_checker = await db.orm.public.Session.where({ tokenHash: hashToken(cookie_receiver)}).first()
        const sender = await db.orm.public.User.where({ id: token_checker?.userid}).first()
        if (!sender)
            return;
        const lastVote = await db.orm.public.Votes.where({ voter: sender.username, motionId: id }).all()
        console.log(lastVote)
        if (lastVote.length != 0)
            return
        await db.orm.public.Votes.create({position: "FÖR", motionId: id, voter: sender.username})
        emitter.emit(id)
    }
)

export const addVoteAgainst = form(
    v.object({
        id: v.string(),
    }),
    async ({id}) => {
        const {cookies} = getRequestEvent()
        const cookie_receiver = cookies.get("session")
        const token_checker = await db.orm.public.Session.where({ tokenHash: hashToken(cookie_receiver)}).first()
        const sender = await db.orm.public.User.where({ id: token_checker?.userid}).first()
        if (!sender)
            return;
        const lastVote = await db.orm.public.Votes.where({ voter: sender.username, motionId: id }).all()
        if (lastVote.length != 0)
            return
        await db.orm.public.Votes.create({position: "EMOT", motionId: id, voter: sender.username})
        emitter.emit(id)
    }
)