import { fail } from '@sveltejs/kit';

export async function load({ fetch }) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const posts = await response.json();
        return { posts };
    } catch (error) {
        return { error: 'Failed to fetch posts' };
    }
}

export const actions = {
    addPost: async ({ request }) => {
        const formData = await request.formData();
        const title = formData.get('title');
        const body = formData.get('body');

        if (!title || !body) {
            return fail(400, { 
                success: false,
                message: 'Título y cuerpo son requeridos' 
            });
        }

        try {
            const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    body,
                    userId: 1
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            
            const newPost = await res.json();
            return { 
                success: true, 
                newPost
            };
        } catch (error) {
            return fail(500, { 
                success: false,
                message: 'Failed to create post'
            });
        }
    },

    editPost: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id');
        const title = formData.get('title');
        const body = formData.get('body');

        if (!title || !body) {
            return fail(400, { 
                success: false,
                message: 'Título y cuerpo son requeridos' 
            });
        }

        try {
            const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    id,
                    title,
                    body,
                    userId: 1
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            
            const updatedPost = await res.json();
            return { 
                success: true, 
                updatedPost
            };
        } catch (error) {
            return fail(500, { 
                success: false,
                message: 'Failed to update post'
            });
        }
    },

    deletePost: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id');

        try {
            await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
                method: 'DELETE'
            });
            return { 
                success: true, 
                id: Number(id)
            };
        } catch (error) {
            return fail(500, { 
                success: false,
                message: 'Failed to delete post'
            });
        }
    }
};