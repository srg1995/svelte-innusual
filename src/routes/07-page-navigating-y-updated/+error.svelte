<script lang="ts">
	import { page } from '$app/state';
</script>

<p class="rounded-lg bg-ink-100 p-3 text-sm text-ink-900">
	Error {page.status}: {page.error?.message}
</p>
