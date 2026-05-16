<script lang="ts">
	import { goto } from '$app/navigation';
	import { APP_NAME } from '$lib/app';
	import { authState } from '$lib/auth.svelte';
	import { supabase } from '$lib/supabase';

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
	<title>Sign in · {APP_NAME}</title>
</svelte:head>

<main class="auth-shell">
	<div class="card">
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
			New here? <a href="/signup">Create an account</a>
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

	.card {
		width: 100%;
		max-width: 22rem;
		padding: var(--space-xl);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
	}

	h1 {
		font-size: var(--font-size-lg);
		margin: 0 0 var(--space-xs);
		color: var(--color-text);
	}

	.subtitle {
		margin: 0 0 var(--space-lg);
		color: var(--color-text-muted);
		font-size: var(--font-size-base);
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
		font-size: var(--font-size-base);
		color: var(--color-text);
	}

	input {
		@include focus-ring;
		font: inherit;
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-border);
		background: var(--color-bg);
		color: var(--color-text);
	}

	.feedback {
		margin: 0;
		font-size: var(--font-size-base);
		color: var(--color-text-muted);
	}

	.submit {
		@include focus-ring;
		font: inherit;
		font-size: var(--font-size-base);
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius-md);
		border: none;
		background: var(--color-accent);
		color: #fff;
		cursor: pointer;
		font-weight: 600;

		&:disabled {
			opacity: 0.7;
			cursor: not-allowed;
		}

		&:not(:disabled):hover {
			filter: brightness(1.05);
		}
	}

	.footer-link {
		margin: var(--space-lg) 0 0;
		font-size: var(--font-size-base);
		color: var(--color-text-muted);
		text-align: center;

		a {
			@include focus-ring;
			color: var(--color-accent);
			font-weight: 600;
		}
	}
</style>
