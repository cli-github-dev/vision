import { Pool } from 'pg';

// https://stackoverflow.com/questions/68322578/recent-updated-version-of-types-node-is-creating-an-error-the-previous-versi
let pgClient: any = undefined;

if (!pgClient) {
  pgClient = new Pool({
    user: 'steampipe',
    host:
      process.env.NODE_ENV === 'production' ? process.env.SP_HOST : 'localhost',
    database: 'steampipe',
    password:
      process.env.NODE_ENV === 'production'
        ? process.env.SP_PASSWORD
        : 'fb50_4f86_ba12',
    port: 9193,
  });
}

export default pgClient;
