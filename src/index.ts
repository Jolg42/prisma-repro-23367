import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool, Client } from 'pg';

export interface Env {
	// If you set another name in wrangler.toml as the value for 'binding',
	// replace "HYPERDRIVE" with the variable name you defined.
	HYPERDRIVE: Hyperdrive;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		/*
		* Code to try with pg alone

		console.log(JSON.stringify(env));
		// Create a database client that connects to your database via Hyperdrive
		// Hyperdrive generates a unique connection string you can pass to
		// supported drivers, including node-postgres, Postgres.js, and the many
		// ORMs and query builders that use these drivers.
		const client = new Client({
			host: env.HYPERDRIVE.host,
			user: env.HYPERDRIVE.user,
			password: env.HYPERDRIVE.password,
			port: env.HYPERDRIVE.port,
			database: env.HYPERDRIVE.database,
		});

		try {
			// Connect to your database
			await client.connect();

			// Test query
			const result = await client.query({ text: 'SELECT * FROM pg_tables' });

			// Return result rows as JSON
			return Response.json({ result: result });
		} catch (e: any) {
			console.log(e);
			return Response.json({ error: e.message }, { status: 500 });
		}
		*/

		// Code to try with Prisma adapter
		const pool = new Pool({ connectionString: env.HYPERDRIVE.connectionString });

		const adapter = new PrismaPg(pool);
		const prisma = new PrismaClient({ adapter });

		// Log adapter config for debugging
		// console.debug({ adapter });

		// Create some users
		await prisma.user.create({
			data: {
				name: `${Math.random()}`,
				email: `${Math.random()}`,
			},
		});
		await prisma.user.create({
			data: {
				name: `${Math.random()}`,
				email: `${Math.random()}`,
			},
		});
		await prisma.user.create({
			data: {
				name: `${Math.random()}`,
				email: `${Math.random()}`,
			},
		});

		// Run some queries
		const promises = [
			prisma.user.findMany(), //
			prisma.user.findFirst(),
			prisma.user.findFirst({
				where: {
					id: {
						contains: 'gbn',
					},
				},
			}),
			prisma.user.findFirst({
				where: {
					name: {
						contains: `${Math.random()}`,
					},
				},
			}),
			prisma.user.findMany(),
			prisma.user.findMany({
				where: {
					id: {
						contains: 'gbn',
					},
				},
				take: 100,
			}),
		];

		const data = await Promise.all(promises);

		return new Response(JSON.stringify(data));
	},
} satisfies ExportedHandler<Env>;
