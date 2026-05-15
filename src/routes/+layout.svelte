<script lang="ts">
	import '../styles/global.scss';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>TapTapTidy</title>
</svelte:head>

{@render children()}
