# CouchDB Design Documents

### Installation

If you're updating the database for the first time:

```
npm install -g couchdb-update-views
```

### How to use update database (please read)

1. Make all updates to the database in a directory of the same name (Do not update `couchdb:5984/_utils` directly) in a doc.js files. Wrap them in module.exports, like this:
```javascript
module.exports = {

   "_id": "_design/database_name",
   "views": {
       "by_id": {
           "map": "function (doc) {\n\t\t  emit(doc._id, doc);\n\t\t}"
       },
   }

};
```

2. Run the corresponding update command as follows
```
couchdb-update-views --config ./local.json --docsDir ./<<database_name>>
```
