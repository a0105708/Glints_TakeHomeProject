module.exports = {
   "_id": "_design/books",
   "views": {
       "by_id": {
           "map": "function (doc) {\n\t\t  emit(doc._id, doc);\n\t\t}"
       },
       "by_title": {
           "map": "function (doc) {\n\t\t  emit(doc.title, doc);\n\t\t}"
       },
       "by_author": {
           "map": "function (doc) {\n\t\t  emit(doc.author, doc);\n\t\t}"
       },
       "by_skill": {
           "map": "function (doc) {\n\t\t  emit(doc.skill, doc);\n\t\t}"
       },
       "by_price": {
           "map": "function (doc) {\n\t\t  emit(doc.price, doc);\n\t\t}"
       },
       "by_ratings": {
           "map": "function (doc) {\n\t\t  emit(doc.ratings, doc);\n\t\t}"
       }
   }

};