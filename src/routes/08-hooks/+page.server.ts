import type { PageServerLoad } from './$types';
import { base } from './paths';

export const load: PageServerLoad = async ({ fetch }) => {
	// Este fetch pasa por handleFetch, que añade la cabecera x-origin-request-id
	const res = await fetch(`${base}/api/echo`);
	return { echo: (await res.json()) as { requestId: string; originRequestId: string | null; user: { name: string } | null } };
};
