mongoimport \
  -u sample -p password \
  --db bookshelf --collection books \
  --drop \
  --file /sample/books.json --jsonArray
mongoimport \
  -u sample -p password \
  --db bookshelf --collection series \
  --drop \
  --file /sample/series.json --jsonArray
