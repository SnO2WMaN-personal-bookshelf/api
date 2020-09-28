/* global db */

db.createUser({
  user: 'root',
  pwd: 'pass',
  roles: [
    {
      role: 'dbOwner',
      db: 'bookshelf',
    },
  ],
});
db.createCollection('books');
