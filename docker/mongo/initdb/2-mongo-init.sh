mongoimport \
  -u root -p pass \
  --db bookshelf --collection books \
  --drop \
  --file /sample/books.json --jsonArray
