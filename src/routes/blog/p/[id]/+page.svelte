<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Blog } from '@prisma/client';
	import Button from '../../Button.svelte';

	let published = false;
	let deleted = false;

	export let data: { post: Blog & { author?: { name: string } } };

	const { post } = data;
	const deletePost = async () => {
		deleted = true;
		await (
			await fetch(`/api/blog/post/${post.id}`, {
				method: 'DELETE'
			})
		).json();
		goto('/blog');
	};
	const publishPost = async () => {
		published = true;
		await (
			await fetch(`/api/blog/publish/${post.id}`, {
				method: 'PUT'
			})
		).json();
		goto('/blog');
	};
</script>

<div class="page">
	<main>
		<h2>{post.title}</h2>
		<p>{post.author?.name ? `By ${post.author.name}` : 'Unknown author'}</p>
		<div>
			{@html post.content}
		</div>
		<div class="mt-4 flex gap-2">
			{#if !post.published}
				<Button
					disabled={published}
					textBefore="Publish"
					textAfter="Publishing..."
					clicked={published}
					type="submit"
					on:click={publishPost}
				/>
			{/if}
			<Button
				disabled={deleted}
				textBefore="Delete"
				textAfter="Deleting..."
				clicked={deleted}
				type="submit"
				on:click={deletePost}
			/>
		</div>
	</main>
</div>

<style>
	.page {
		background: white;
		padding: 2rem;
	}
</style>
