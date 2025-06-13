import { Env } from './env';
import { corsHeaders } from '../lib/utils';

type SupabaseProjectConfigResponse = Array<{
	id: string;
	usageExceeded: boolean;
	page_config: Array<{
		path: string;
		ignored_el: string[] | null;
		privacy_el: string[] | null;
		update_snap: boolean;
	}>;
}>;

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders() });
		}

		const { SUPABASE_URL, SUPABASE_ANON_KEY } = env;

		try {
			const url = new URL(request.url);
			const trackingId = url.searchParams.get('id');
			const path = url.searchParams.get('p');

			if (!trackingId || !path) {
				// Silently ignore bad requests
				return new Response(null, {
					status: 204,
					headers: corsHeaders(),
				});
			}

			const apiUrl =
				`${SUPABASE_URL}/rest/v1/project_config` +
				`?tracking_id=eq.${encodeURIComponent(trackingId)}` +
				`&select=id,usageExceeded,page_config!inner(path,ignored_el,privacy_el,update_snap)` +
				`&page_config.path=eq.${encodeURIComponent(path)}` +
				`&limit=1`;

			const response = await fetch(apiUrl, {
				headers: {
					apikey: SUPABASE_ANON_KEY,
					Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
				},
			});

			if (!response.ok) {
				// You can log response.text() here for debugging (optional)
				return new Response(null, {
					status: 204,
					headers: corsHeaders(),
				});
			}

			const data = (await response.json()) as SupabaseProjectConfigResponse;

			if (!data.length) {
				return new Response(null, {
					status: 204,
					headers: corsHeaders(),
				});
			}

			const config = {
				id: data[0].id,
				usageExceeded: data[0].usageExceeded,
				page_config: data[0].page_config?.[0] ?? null,
			};

			return new Response(JSON.stringify(config), {
				status: 200,
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'public, max-age=60',
					...corsHeaders(),
				},
			});
		} catch (err) {
			// You can optionally log this server-side
			return new Response(null, {
				status: 204,
				headers: corsHeaders(),
			});
		}
	},
} satisfies ExportedHandler<Env>;
