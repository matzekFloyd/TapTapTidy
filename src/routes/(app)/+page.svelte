<script lang="ts">
	import { goto } from '$app/navigation';
	import { APP_NAME } from '$lib/app';
	import { authState, signOut } from '$lib/auth.svelte';

	let signingOut = $state(false);

	async function handleSignOut(): Promise<void> {
		signingOut = true;
		try {
			await signOut();
			await goto('/login');
		} finally {
			signingOut = false;
		}
	}
</script>

<main>
	<header class="masthead">
		<h1>{APP_NAME}</h1>
		{#if authState.session?.user.email}
			<span class="user">{authState.session.user.email}</span>
		{/if}
		<button
			class="sign-out"
			type="button"
			disabled={signingOut}
			onclick={() => void handleSignOut()}
		>
			{signingOut ? 'Signing out…' : 'Sign out'}
		</button>
	</header>
	<p class="lead">Chore tracking, coming soon.</p>
</main>

<style lang="scss">
	@use '../../styles/mixins' as *;

	main {
		max-width: 40rem;
		margin: 0 auto;
		padding: var(--space-xl) var(--space-md);
	}

	.masthead {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--space-md);
		margin-bottom: var(--space-md);
	}

	h1 {
		font-size: var(--font-size-lg);
		margin: 0;
		color: var(--color-text);
		flex: 1 1 auto;
	}

	.user {
		font-size: var(--font-size-base);
		color: var(--color-text-muted);
	}

	.sign-out {
		@include focus-ring;
		font: inherit;
		font-size: var(--font-size-base);
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
		background: var(--color-surface);
		color: var(--color-text);
		cursor: pointer;

		&:disabled {
			opacity: 0.7;
			cursor: not-allowed;
		}

		&:not(:disabled):hover {
			border-color: var(--color-accent);
			color: var(--color-accent);
		}
	}

	.lead {
		margin: 0;
		color: var(--color-text-muted);
	}
</style>
