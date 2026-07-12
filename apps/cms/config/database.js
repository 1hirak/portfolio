module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'postgres'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'portfolio'),
      user: env('DATABASE_USERNAME', 'portfolio'),
      password: env('DATABASE_PASSWORD'),
      ssl: env.bool('DATABASE_SSL', false),
    },
    pool: {
      min: 2,
      max: 10,
    },
    acquireConnectionTimeout: 60000,
  },
});
