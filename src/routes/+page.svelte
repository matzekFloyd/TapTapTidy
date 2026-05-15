<script lang="ts">
	import { APP_NAME } from '$lib/app';
</script>

<main>
	<h1>{APP_NAME}</h1>
	<p>Chore tracking, coming soon.</p>
</main>

<style lang="scss">
	@use '../styles/variables' as *;

	main {
		max-width: 40rem;
		margin: 0 auto;
		padding: var(--space-xl) var(--space-md);
	}

	h1 {
		font-size: var(--font-size-lg);
		margin: 0 0 var(--space-md);
		color: var(--color-text);
	}

	p {
		margin: 0;
		color: var(--color-text-muted);
	}
</style>
