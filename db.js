// ***************************************************************************************************************   
//     MODULE LANCEMENT BASE DE DONNEES JEU                         
//**************************************************************************************************************** 

//var urlDb = 'mongodb://virgo:site2018@ds215633.mlab.com:15633/adopteunmaitre';

var nameDb = 'jeu';
var config = {
  useNewUrlParser: true
};
const MongoClient = require('mongodb').MongoClient;

exports.connectDB = function(req, res, next, cb) {
  if (this.mongoClient && this.mongoClient.isConnected()) {
    var instance = client.db(this.mongoClient);
    cb(instance);
  } else {
    MongoClient.connect(process.env.MONGOLAB_URI, { useNewUrlParser: true }, function(err, client) {
      this.mongoClient = client;
      if (err) {
        res.status(503);
        next();
        return;
      }
      var instance = client.db(nameDb);
      cb(instance);
    });
  }
};