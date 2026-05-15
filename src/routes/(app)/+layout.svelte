<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { authState } from '$lib/auth.svelte';

	let { children } = $props();

	$effect(() => {
		if (!browser || authState.initializing) return;
		if (!authState.session) {
			void goto('/login');
		}
	});
</script>

{#if authState.initializing}
	<p class="auth-status">Signing you in…</p>
{:else if authState.session}
	{@render children()}
{/if}

<style lang="scss">
	.auth-status {
		margin: var(--space-xl) var(--space-md);
		text-align: center;
		color: var(--color-text-muted);
		font-size: var(--font-size-base);
	}
</style>
