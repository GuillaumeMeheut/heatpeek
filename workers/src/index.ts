import { Env } from './env';
import { corsHeaders } from '../lib/utils';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// Handle CORS preflight requests
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: corsHeaders(),
			});
		}

		const supabaseUrl = env.SUPABASE_URL;
		const supabaseKey = env.SUPABASE_ANON_KEY;

		let trackingId: string | null = null;

		try {
			const url = new URL(request.url);
			trackingId = url.searchParams.get('tracking_id');

			if (!trackingId) {
				return new Response('Missing tracking_id', {
					status: 400,
					headers: corsHeaders(),
				});
			}

			const apiUrl = `${supabaseUrl}/rest/v1/config?tracking_id=eq.${encodeURIComponent(trackingId)}&select=*&limit=1`;

			const response = await fetch(apiUrl, {
				headers: {
					apikey: supabaseKey,
					Authorization: `Bearer ${supabaseKey}`,
				},
			});

			if (!response.ok) {
				const errorText = await response.text();
				return new Response(`Supabase error: ${errorText}`, {
					status: 500,
					headers: corsHeaders(),
				});
			}

			const data = (await response.json()) as Array<Record<string, unknown>>;

			if (!data || data.length === 0) {
				return new Response('No configuration found for this tracking ID', {
					status: 404,
					headers: corsHeaders(),
				});
			}

			return new Response(JSON.stringify(data[0]), {
				status: 200,
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'public, max-age=60',
					...corsHeaders(),
				},
			});
		} catch (err) {
			return new Response(`Unexpected error: ${(err as Error).message}`, {
				status: 500,
				headers: corsHeaders(),
			});
		}
	},
} satisfies ExportedHandler<Env>;
