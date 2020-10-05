mongoimport \
  -u sample -p password \
  --db bookshelf --collection books \
  --drop \
  --file /sample/books.json --jsonArray
