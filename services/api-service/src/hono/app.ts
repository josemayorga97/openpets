import { Hono } from 'hono';
import { cors } from 'hono/cors';

export const App = new Hono<{ Bindings: Env }>();

App.use("*", cors());

App.get('/:id', async (c) => {
    const id = c.req.param('id');

    return c.json({id})
})
