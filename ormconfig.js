require('dotenv').config();

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrationsTableName: 'migration',
  migrations: ['dist/migration/*.js'],
  synchorize: false,
  cli: {
    migrationsDir: 'src/migration',
  },
};
