<script lang="ts">
	import { Position } from '$api/avatar/[id]/GET';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Footer from '../components/Footer.svelte';
	import Header from '../components/Header.svelte';

	let playerId = $state('953144833346');
	let rankPosition = $state(Position.TopCenter);
	let isCircle = $state(false);
	let size = $state(290);
	let previewUrl: string | null = $state(null);

	// Get the current origin and initialize values from URL
	$effect(() => {
		if (typeof window !== 'undefined') {
			origin = window.location.origin;

			// Get values from URL params
			const params = $page.url.searchParams;
			if (params.has('playerId')) playerId = params.get('playerId')!;
			if (params.has('rankPosition')) rankPosition = params.get('rankPosition') as Position;
			if (params.has('isCircle')) isCircle = params.get('isCircle') === 'true';
			if (params.has('size')) size = parseInt(params.get('size')!);
		}
	});

	// Update URL when parameters change
	$effect(() => {
		const params = new URLSearchParams();
		params.set('playerId', playerId);
		params.set('rankPosition', rankPosition);
		params.set('isCircle', isCircle.toString());
		params.set('size', size.toString());

		// Update URL without refreshing the page
		goto(`?${params.toString()}`, { replaceState: true, keepFocus: true });
	});

	function debounce<T extends (...args: unknown[]) => unknown>(
		fn: T,
		delay: number
	): (...args: Parameters<T>) => void {
		let timeoutId: ReturnType<typeof setTimeout>;
		return (...args: Parameters<T>) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => fn(...args), delay);
		};
	}

	const updatePreviewUrl = debounce(() => {
		previewUrl = playerId
			? `/avatar/${playerId}?rank=${rankPosition}&circle=${isCircle ? '1' : ''}&size=${size}`
			: null;
	}, 300);

	$effect(() => {
		playerId;
		rankPosition;
		isCircle;
		size;
		updatePreviewUrl();
	});

	const positions = Object.values(Position);
</script>

<Header />

<div class="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-4xl">
		<div class="rounded-lg bg-white p-6 shadow-sm">
			<h1 class="mb-6 text-2xl font-bold text-gray-900">Taiko Avatar Generator</h1>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
				<!-- Controls -->
				<div class="space-y-6">
					<div>
						<label for="playerId" class="block text-sm font-medium text-gray-700">
							Player ID
						</label>
						<input
							type="text"
							id="playerId"
							bind:value={playerId}
							pattern="[0-9]*"
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							placeholder="Enter player ID"
						/>
					</div>

					<div>
						<label for="position" class="block text-sm font-medium text-gray-700">
							Rank Position
						</label>
						<select
							id="position"
							bind:value={rankPosition}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						>
							{#each positions as position}
								<option value={position}>{position}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="size" class="block text-sm font-medium text-gray-700">
							Size ({size}px)
						</label>
						<input
							type="range"
							id="size"
							bind:value={size}
							min="16"
							max="512"
							step="2"
							class="mt-1 block w-full"
						/>
					</div>

					<div class="flex items-center">
						<input
							type="checkbox"
							id="circle"
							bind:checked={isCircle}
							class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						/>
						<label for="circle" class="ml-2 block text-sm text-gray-700">
							Circular Avatar
						</label>
					</div>
				</div>

				<!-- Preview -->
				<div class="flex flex-col items-center justify-center">
					{#if previewUrl}
						<a href={previewUrl} target="_blank" rel="noopener noreferrer">
							<img
								src={previewUrl}
								alt="Avatar preview"
								class="rounded-lg border-2 bg-gray-300 shadow-sm transition-opacity hover:opacity-90"
								style="width: {size}px; height: {size}px;"
							/>
						</a>
					{:else}
						<div
							class="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
							style="width: {size}px; height: {size}px;"
						>
							<p class="text-sm text-gray-500">Enter a player ID to preview</p>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<Footer origin={$page.url.origin} />
	</div>
</div>
