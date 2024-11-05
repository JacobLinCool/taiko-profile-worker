<script lang="ts">
	import { page } from '$app/stores';
	import type { Position } from '$api/avatar/[id]/GET';

	// Get values from URL params
	const params = $page.url.searchParams;
	const playerId = params.get('playerId') || '953144833346';
	const rankPosition = (params.get('rankPosition') || 'TopCenter') as Position;
	const isCircle = params.get('isCircle') === 'true';
	const size = parseInt(params.get('size') || '290');
</script>

<svelte:head>
	<title>Taiko Avatar Generator</title>
	<meta name="description" content="Generate custom avatars for Taiko players" />

	<!-- OpenGraph tags -->
	<meta property="og:title" content="Taiko Avatar Generator" />
	<meta property="og:description" content="Generate custom avatars for Taiko players" />
	<meta
		property="og:image"
		content={`${$page.url.origin}/avatar/${playerId}?rank=${rankPosition}&circle=${isCircle ? '1' : ''}&size=${size}`}
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.href} />

	<!-- Twitter Card tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Taiko Avatar Generator" />
	<meta name="twitter:description" content="Generate custom avatars for Taiko players" />
	<meta
		name="twitter:image"
		content={`${$page.url.origin}/avatar/${playerId}?rank=${rankPosition}&circle=${isCircle ? '1' : ''}&size=${size}`}
	/>
</svelte:head>
