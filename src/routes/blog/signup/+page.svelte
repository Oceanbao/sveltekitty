<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '../Button.svelte';

	let name = '';
	let email = '';
	let submitted = false;

	const signup = async (e: SubmitEvent) => {
		e.preventDefault();
		submitted = true;
		await (
			await fetch('/api/blog/user', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name,
					email
				})
			})
		).json();
		goto('/blog');
	};
</script>

<div class="page">
	<form on:submit={signup}>
		<h1>Signup user</h1>
		<input placeholder="Name" type="text" bind:value={name} />
		<input placeholder="Email address" type="text" bind:value={email} />
		<Button
			clicked={submitted}
			disabled={!name || !email || submitted}
			type="submit"
			textBefore="Signup"
			textAfter="Loading..."
		/>
		<a class="back" href="/blog"> or Cancel </a>
	</form>
</div>

<style scoped>
	.page {
		background: white;
		padding: 3rem;
		display: flex;
		justify-content: center;
	}
	input[type='text'] {
		width: 100%;
		padding: 0.5rem;
		margin: 0.5rem 0;
		border-radius: 0.25rem;
		border: 0.125rem solid rgba(0, 0, 0, 0.2);
	}
	.back {
		margin-left: 1rem;
	}
</style>
