<script>
    import { enhance } from '$app/forms';
    import { invalidate } from '$app/navigation';
    import PostItem from '$lib/components/PostItem.svelte';

    export let data;
    
    // Contador de cargas
    let loadCount = 0;
    let localPosts = [];
    let errorMsg = '';
    
    // Estados para edición
    let editId = null;
    let editTitle = '';
    let editBody = '';

    // Actualizar posts cuando cambian los datos
    $: {
        loadCount++;
        
        // Solo actualizamos los posts locales con los datos del servidor en la primera carga
        if (loadCount === 1) {
            localPosts = [...data.posts || []];
        }
        // En cargas posteriores (por invalidate) mantenemos los cambios locales
    }

    function startEdit(post) {
        editId = post.id;
        editTitle = post.title;
        editBody = post.body;
        errorMsg = '';
    }

    function cancelEdit() {
        editId = null;
        errorMsg = '';
    }

    // Función para manejar éxito en las operaciones
    async function handleSuccess(result) {
        if (result.type === 'success') {
            const data = result.data;
            
            if (data?.success) {
                if (data.newPost) {
                    // Agregar el nuevo post localmente
                    localPosts = [data.newPost, ...localPosts];
                    await invalidate('load:posts');
                } else if (data.updatedPost) {
                    // Actualizar el post localmente
                    localPosts = localPosts.map(p => 
                        p.id === data.updatedPost.id ? data.updatedPost : p
                    );
                    cancelEdit();
                    await invalidate('load:posts');
                } else if (data.id) {
                    // Eliminar el post localmente
                    localPosts = localPosts.filter(p => p.id !== data.id);
                    await invalidate('load:posts');
                }
            } else {
                errorMsg = data?.message || 'Operación fallida';
            }
        }
    }
</script>

<div class="main-container">
    <h1>Gestor de Posts JsonPlaceHolder</h1>

    {#if errorMsg}
        <p class="error">{errorMsg}</p>
    {/if}

    <!-- Formulario de creación/edición -->
    <h2>
        {#if editId === null}
            Crear nueva publicación
        {:else}
            Editar publicación ID {editId}
        {/if}
    </h2>
    
    <form 
        method="POST" 
        action={editId === null ? "?/addPost" : "?/editPost"}
        use:enhance={({ result }) => result && handleSuccess(result)}
    >
        {#if editId !== null}
            <input type="hidden" name="id" value={editId} />
        {/if}
        
        <div class="field">
            <label for="title">Título:</label>
            <input
                id="title"
                name="title"
                placeholder="Título del post"
                bind:value={editTitle}
                required
                class="input-field"
            />
        </div>

        <div class="field">
            <label for="body">Cuerpo:</label>
            <textarea
                id="body"
                name="body"
                placeholder="Contenido del post"
                bind:value={editBody}
                required
                class="input-field textarea"
            ></textarea>
        </div>

        <div class="form-actions">
            <button type="submit" class="btn primary">
                {editId === null ? "Crear" : "Guardar Cambios"}
            </button>
            
            {#if editId !== null}
                <button 
                    type="button" 
                    class="btn secondary" 
                    on:click={cancelEdit}
                >
                    Cancelar
                </button>
            {/if}
        </div>
    </form>

    <!-- Lista de Posts -->
    <div class="posts-list">
        <h2>Publicaciones ({localPosts.length})</h2>
        
        {#each localPosts as post (post.id)}
            <PostItem 
                {post} 
                onEdit={startEdit} 
                handleSuccess={({ result }) => result && handleSuccess(result)}
            />
        {:else}
            <p>No hay publicaciones disponibles</p>
        {/each}
    </div>
</div>
<style>
  .main-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    font-family: Arial, sans-serif;
  }

  .field {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
  }
  
  .input-field {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.15s;
  }
  
  .input-field:focus {
    outline: none;
    border-color: #86b7fe;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  }
  
  .textarea {
    min-height: 120px;
    resize: vertical;
  }
  
  .form-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  
  .btn {
    padding: 0.65rem 1.25rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  
  .btn:active {
    transform: translateY(0);
  }
  
  .primary { 
    background: #0d6efd; 
    color: white; 
  }
  .primary:hover { background: #0b5ed7; }
  
  .secondary { 
    background: #6c757d; 
    color: white; 
  }
  .secondary:hover { background: #5c636a; }
  
  .error {
    color: #dc3545;
    padding: 1rem;
    background: #f8d7da;
    border: 1px solid #f5c2c7;
    border-radius: 6px;
    margin-bottom: 1.5rem;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateX(100px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(100px); }
  }
  
   .main-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
    }
    
    .error {
        background: #f2dede;
        color: #a94442;
        padding: 15px;
        border-radius: 4px;
        margin-bottom: 20px;
        border: 1px solid #ebccd1;
        font-weight: bold;
    }

	.main-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
    }
    
    .error {
        color: #dc3545;
        padding: 1rem;
        background: #f8d7da;
        border-radius: 4px;
        margin-bottom: 1.5rem;
    }
    
    .field {
        margin-bottom: 1rem;
    }
    
    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
    }
    
    .input-field {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    
    .textarea {
        min-height: 100px;
    }
    
    .form-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    
    .btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
    }
    
    .primary { background: #007bff; color: white; }
    .secondary { background: #6c757d; color: white; }

</style>