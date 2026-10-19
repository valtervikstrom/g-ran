<script>
    import {signup} from "./register.remote"
</script>

<h1>Registrera</h1>
<form {...signup}>
    {#if signup.result?.error}
        <p>{signup.result.error}</p>
    {/if}
    <input {...signup.fields.username.as('text')}>
    <input {...signup.fields._password.as('text')}>
    <button>Registrera</button>
</form>
<p>Har du redan ett konto?</p>
<a href="/login">Logga in</a>