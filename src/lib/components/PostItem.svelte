<script>
    import { enhance } from '$app/forms';
    
    export let post;
    export let onEdit;
    export let handleSuccess;

    // Función local para manejar la edición
    function handleEdit() {
        onEdit(post);
    }
</script>

<div class="post-item">
    <div class="post-content">
        <h3>ID {post.id}: {post.title}</h3>
        <p>{post.body}</p>
    </div>

    <div class="post-actions">
        <button on:click={handleEdit} class="btn secondary">
            Editar
        </button>
        
        <form method="POST" action="?/deletePost" use:enhance={handleSuccess}>
            <input type="hidden" name="id" value={post.id} />
            <button type="submit" class="btn danger">
                Eliminar
            </button>
        </form>
    </div>
</div>

<style>
    .post-item {
        border: 1px solid #ddd;
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 4px;
    }
    
    .post-content h3 {
        margin-top: 0;
        margin-bottom: 0.5rem;
    }
    
    .post-content p {
        margin: 0;
        color: #666;
    }
    
    .post-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.75rem;
    }
    
    .btn {
        padding: 0.5rem 0.75rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85rem;
    }
    
    .secondary { 
        background: #6c757d; 
        color: white; 
    }
    
    .danger { 
        background: #dc3545; 
        color: white; 
    }
</style>