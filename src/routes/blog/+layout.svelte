<script lang="ts">
	import { navigating } from '$app/stores';
	import Header from './Header.svelte';
	import Loader from './Loader.svelte';
	// import PageTransition from './Transition.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

{#if $navigating}
	<Loader />
{/if}

<!-- <PageTransition key={data.url} duration={600}> -->
<div class="layout">
	<p>URL: {data.url}</p>
	<Header />
	<slot />
</div>

<!-- </PageTransition> -->
<style>
	.layout {
		padding: 0 2rem;
	}
</style>
