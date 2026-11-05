<script lang="ts">
	import { goto } from '$app/navigation';
	import { APP_NAME } from '#lib/app.js';
	import { authState } from '#lib/auth.svelte.js';
	import { supabase } from '#lib/supabase.js';

	let email = $state('');
	let password = $state('');
	let errorMessage = $state<string | null>(null);
	let submitting = $state(false);

	$effect(() => {
		if (authState.sessionEndedMessage) {
			errorMessage = authState.sessionEndedMessage;
			authState.sessionEndedMessage = null;
		}
	});

	$effect(() => {
		if (!authState.initializing && authState.session) {
			void goto('/');
		}
	});

	async function handleSubmit(ev: SubmitEvent): Promise<void> {
		ev.preventDefault();
		errorMessage = null;
		submitting = true;

		const { error } = await supabase.auth.signInWithPassword({
			email: email.trim(),
			password
		});

		submitting = false;

		if (error) {
			errorMessage = error.message;
			return;
		}

		await goto('/');
	}
</script>

<svelte:head>
	<title>Sign in, {APP_NAME}</title>
</svelte:head>

<main class="auth-shell">
	<div class="panel">
		<h1>Sign in</h1>
		<p class="subtitle">Use your {APP_NAME} email and password.</p>

		<form onsubmit={(e) => void handleSubmit(e)}>
			<div class="field">
				<label for="login-email">Email</label>
				<input
					id="login-email"
					name="email"
					type="email"
					autocomplete="email"
					required
					bind:value={email}
				/>
			</div>
			<div class="field">
				<label for="login-password">Password</label>
				<input
					id="login-password"
					name="password"
					type="password"
					autocomplete="current-password"
					required
					bind:value={password}
				/>
			</div>

			{#if errorMessage}
				<p class="feedback" role="alert">{errorMessage}</p>
			{/if}

			<button class="submit" type="submit" disabled={submitting || authState.initializing}>
				{submitting ? 'Signing in…' : 'Sign in'}
			</button>
		</form>

		<p class="footer-link">
			New here? <a href="/signup">Sign up</a>
		</p>
	</div>
</main>

<style lang="scss">
	@use '../../styles/mixins' as *;

	.auth-shell {
		min-height: 100dvh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-xl) var(--space-md);
	}

	.panel {
		width: 100%;
		max-width: 22rem;
		padding: var(--space-xl);
		background: var(--color-tile);
		border: 1px solid var(--color-ink);
	}

	h1 {
		margin: 0 0 var(--space-xs);
		font-size: var(--font-size-tile);
		font-weight: var(--font-weight-tile);
		line-height: 1.2;
	}

	.subtitle {
		margin: 0 0 var(--space-lg);
		font-size: var(--font-size-body);
		line-height: var(--line-height-body);
	}

	form {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	label {
		font-size: var(--font-size-body);
		font-weight: var(--font-weight-body);
	}

	input {
		@include focus-ring;
		font: inherit;
		font-size: var(--font-size-body);
		min-height: 2.75rem;
		padding: var(--space-sm) var(--space-md);
		border: 1px solid var(--color-ink);
		background: var(--color-wall);
		color: var(--color-ink);
	}

	.feedback {
		margin: 0;
		font-size: var(--font-size-body);
		line-height: var(--line-height-body);
	}

	.submit {
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

	.footer-link {
		margin: var(--space-lg) 0 0;
		font-size: var(--font-size-body);
		line-height: var(--line-height-body);
		text-align: center;

		a {
			@include focus-ring;
			font-weight: var(--font-weight-tile);
			text-underline-offset: 0.15em;
		}
	}
</style>
