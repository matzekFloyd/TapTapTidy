<script lang="ts">
	import { goto } from '$app/navigation';
	import { APP_NAME } from '#lib/app.js';
	import { authState, signOut } from '#lib/auth.svelte.js';

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
	<p class="lead">Chores will show up here.</p>
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
		align-items: center;
		gap: var(--space-md);
		margin-bottom: var(--space-md);
	}

	h1 {
		margin: 0;
		font-size: var(--font-size-tile);
		font-weight: var(--font-weight-tile);
		line-height: 1.2;
		flex: 1 1 auto;
	}

	.user {
		font-size: var(--font-size-body);
		line-height: var(--line-height-body);
	}

	.sign-out {
		@include focus-ring;
		font: inherit;
		font-size: var(--font-size-tile);
		font-weight: var(--font-weight-tile);
		min-height: 2.75rem;
		padding: var(--space-sm) var(--space-md);
		border: 1px solid var(--color-ink);
		background: var(--color-tile);
		color: var(--color-ink);
		cursor: pointer;

		&:disabled {
			opacity: 0.7;
			cursor: not-allowed;
		}

		&:not(:disabled):hover {
			background: var(--color-wall);
		}
	}

	.lead {
		margin: 0;
		max-width: 65ch;
		font-size: var(--font-size-body);
		line-height: var(--line-height-body);
	}
</style>
