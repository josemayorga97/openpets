import { WorkerEntrypoint } from 'cloudflare:workers';
import { App } from '@/hono/app'
export default class ApiService extends WorkerEntrypoint<Env> {
	constructor(ctx: ExecutionContext, env: Env) {
		super(ctx, env);
	}
	fetch(r: Request) {
		return App.fetch(r, this.env, this.ctx);
	}
}
