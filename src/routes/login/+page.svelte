<script>
    import {login} from "./login.remote"
</script>

<h1>Inloggning</h1>
<form {...login}>
    {#if login.result?.error}
        <p>{login.result.error}</p>
    {/if}
    <input {...login.fields.username.as('text')}>
    <input {...login.fields._password.as('text')}>
    
    <button>Logga in</button>
</form>
<p>Har du inget konto?</p>
<a href="/register">Registrera dig</a>