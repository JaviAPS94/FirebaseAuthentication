const ORMConfig = {
   "type": "mysql",
   "host": "localhost",
   "port": "3307",
   "username": "root",
   "password": "1GW6XT915UNonmhi6PVWxRZzSKcsLH",
   "database": "ecommerce-ms-authentication",
   "synchronize": false,
   "logging": false,
   "entities": [
      "src/entity/**/*.ts"
   ],
   "migrations": [
      "src/migration/**/*.ts" 
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