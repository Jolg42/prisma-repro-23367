# prisma-repro-23367

Attempt to reproduce https://github.com/prisma/prisma/issues/23367

See https://developers.cloudflare.com/hyperdrive/get-started/ for more information about Cloudflare Hyperdrive.

```
# Install packages
npm i

# Set the DATABASE_URL in `.env` file

# Create the database schema
npx prisma db push

# Create a new Hyperdrive configuration
npx wrangler hyperdrive create hyperdrive-test23367 --connection-string="postgresql://USER:PASSWORD@something.amazonaws.com:5432/lavender_pheasant"
# Then update wrangler.toml with the Hyperdrive ID

# Deploy the worker
npx wrangler deploy

# Send many requests to the worker
npx autocannon -c10 -d120 https://replace_with_your_worker_url_from_deploy
```
