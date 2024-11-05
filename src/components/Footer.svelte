<script lang="ts">
	export let origin: string;
</script>

<div class="mt-8 text-center text-sm text-gray-500">
	<div class="space-x-4">
		<a
			href={`https://api-spec.pages.dev/x?url=${origin}/openapi.json`}
			target="_blank"
			class="text-indigo-600 hover:text-indigo-500"
		>
			API Specification
		</a>
		<span>•</span>
		<a
			href="https://github.com/JacobLinCool/taiko-profile-worker"
			target="_blank"
			class="text-indigo-600 hover:text-indigo-500"
		>
			GitHub Repository
		</a>
	</div>
</div>
