<script>
    import { addMotion, getMotion } from "./motioner.remote.ts";
</script>

<ul>
    {#each await getMotion() as motion}
        <div class="motionList">
            <a href="/motioner/{motion.id}">{motion.name}</a>
            <p></p>
        </div>
    {/each}
</ul>

<form {...addMotion}>
    <input {...addMotion.fields.name.as('text')}>
    <button>Föreslå</button>
</form>

<style>
    .motionList{
        display: flex;
        flex-direction: row;
    }
</style>