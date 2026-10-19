<script>
    import { addVoteFor, addVoteAgainst, getVote, getVotesFor, getVotesAgainst } from "./votes.remote.js";
    let { params } = $props();
</script>

<form {...addVoteFor}>
    <input {...addVoteFor.fields.id.as('hidden', params.id)}>
    <button>FÖR</button>
</form>

<form {...addVoteAgainst}>
    <input {...addVoteAgainst.fields.id.as('hidden', params.id)}>
    <button>EMOT</button>
</form>

<p>Röster för: {await getVotesFor(params.id)}</p>
<p>Röster mot: {await getVotesAgainst(params.id)}</p>

<ul>
    {#each await getVote(params.id) as votes}
        <li>{votes.voter}  ---  {votes.position}</li>
    {/each}
</ul>