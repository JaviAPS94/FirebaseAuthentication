const ORMConfig = {
   "type": "mysql",
   "host": process.env.DB_HOST,
   "port": process.env.DB_PORT,
   "username": process.env.DB_USERNAME,
   "password": process.env.MYSQL_PASSWORD,
   "database": process.env.MYSQL_DATABASE,
   "synchronize": false,
   "logging": false,
   "entities": [
      process.env.ENTITY_PATH
   ],
   "migrations": [
      process.env.MIGRATION_PATH 
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
};
module.exports = ORMConfig;