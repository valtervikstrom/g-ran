<script>
    import { logout } from './login/login.remote';    
    let {data} = $props();
</script>

<main>
    <a href="/motioner">Motioner</a>
    <p>Inloggad som {data.username}</p>
    <form {...logout}>
        <button>Logga ut</button>
    </form>
</main>