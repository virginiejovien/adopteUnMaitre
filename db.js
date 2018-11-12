// ***************************************************************************************************************   
//     MODULE LANCEMENT BASE DE DONNEES RESEAU SOCIAL ADOPTE UN MAITRE                        
//**************************************************************************************************************** 

//var urlDb = 'mongodb://virgo:site2018@ds215633.mlab.com:15633/adopteunmaitre';

const mongoDB = require('mongodb');

module.exports = function DBMgr() {
    this.myDB;                           // Instance de la base de données
    this.colMembres;               // Sélectionne la collection des données des membres
    this.colMessages;                // Sélectionne la collection des données techniques
    
      DBMgr.prototype.checkDBConnect = function(){
          return new Promise((resolve, reject) => {
              mongoDB.MongoClient.connect(process.env.MONGOLAB_URI, { useNewUrlParser: true }, (error,db) => {
                  if (error) {
                      reject(false);
                      console.log('Base de données inaccessible, l\'application "Adopte un Maitre" ne peut pas se lancer');
                      console.log('Description de l\'erreur : ',error);
                      throw 'Base de données inaccessible, l\'application "Adopte un Maitre" ne peut pas se lancer, contacter l\'Administrateur système';
                  } 
                  
                  resolve(true);
                  this.myDB = db;                                                                         // Conservation de l'instance de BDD
                  this.colMembres = this.myDB.db('adopteunmaitre').collection('membres');              // On sélectionne la collection des membres
                  console.log('La BDD "adopteunmaitre" - Collection "membres" est bien lancée et tourne');    // Message de notification BDD OK à destination de l'Admin 
                  this.colMessages = this.myDB.db('adopteunmaitre').collection('messages');          // On sélectionne la collection des données messages
                  console.log('La BDD "adopteunmaitre" - Collection "messages" est bien lancée et tourne');    // Message de notification BDD OK à destination de l'Admin 
              });
          });
      }

} 