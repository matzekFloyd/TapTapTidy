<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { APP_NAME } from '$lib/app';
	import { authState } from '$lib/auth.svelte';
	import { supabase } from '$lib/supabase';

	let email = $state('');
	let password = $state('');
	let errorMessage = $state<string | null>(null);
	let infoMessage = $state<string | null>(null);
	let submitting = $state(false);

	$effect(() => {
		if (!authState.initializing && authState.session) {
			void goto('/');
		}
	});

	async function handleSubmit(ev: SubmitEvent): Promise<void> {
		ev.preventDefault();
		errorMessage = null;
		infoMessage = null;
		submitting = true;

		const emailRedirectTo =
			browser && typeof window !== 'undefined'
				? `${window.location.origin}/`
				: undefined;

		const { data, error } = await supabase.auth.signUp({
			email: email.trim(),
			password,
			options: emailRedirectTo ? { emailRedirectTo } : undefined
		});

		submitting = false;

		if (error) {
			errorMessage = error.message;
			return;
		}

		if (data.session) {
			await goto('/');
			return;
		}

		infoMessage =
			'Check your email to confirm your account before signing in.';
	}
</script>

<svelte:head>
	<title>Sign up · {APP_NAME}</title>
</svelte:head>

<main class="auth-shell">
	<div class="card">
		<h1>Create account</h1>
		<p class="subtitle">Join {APP_NAME} with email and password.</p>

		<form onsubmit={(e) => void handleSubmit(e)}>
			<div class="field">
				<label for="signup-email">Email</label>
				<input
					id="signup-email"
					name="email"
					type="email"
					autocomplete="email"
					required
					bind:value={email}
				/>
			</div>
			<div class="field">
				<label for="signup-password">Password</label>
				<input
					id="signup-password"
					name="password"
					type="password"
					autocomplete="new-password"
					required
					minlength="6"
					bind:value={password}
				/>
			</div>

			{#if errorMessage}
				<p class="feedback" role="alert">{errorMessage}</p>
			{/if}
			{#if infoMessage}
				<p class="feedback info" role="status">{infoMessage}</p>
			{/if}

			<button class="submit" type="submit" disabled={submitting || authState.initializing}>
				{submitting ? 'Creating account…' : 'Sign up'}
			</button>
		</form>

		<p class="footer-link">
			Already have an account? <a href="/login">Sign in</a>
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

		&.info {
			color: var(--color-text);
		}
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
