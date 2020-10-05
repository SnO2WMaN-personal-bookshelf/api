/* global db */

db.createUser({
  user: 'sample',
  pwd: 'password',
  roles: [{role: 'readWrite', db: 'bookshelf'}],
});
db.createCollection('books');
