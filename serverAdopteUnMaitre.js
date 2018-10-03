'use strict';

// ***************************************************************************************************************
//     PROJET N°3 FINAL: RESEAU SOCIAL
//              ADOPTE UN MAITRE
//     Auteur: Virginie Jovien
//     Décembre 2018
//     Déscriptif:   Un reseau social pour mettre en relation des personnes desirant adopter un chat ou un chaton       
//                   et les  proprietaires de chats qui proposent des chats ou des chatons à l'adoption
//     serverAdopteUnMaitre.js :  Server Web du site Adopte un maître                       
//**************************************************************************************************************** 
/***************************************************************************/
const mongodb = require('mongodb');
var dbInterface = require('./db');
const express =  require('express');
var app = express();
const SocketIo = require('socket.io');

// ***********************************************************************************************************
//Connection à mongoDB, on vérifie qu'elle est bien lancée et que la la base de données "adopteunmaitre"
// est accessible, sinon, on envoie un message d'erreur à l'administrateur systhème et on termine le programme
//************************************************************************************************************ 
const verifDBConnect = function() {
    mongodb.MongoClient.connect('mongodb://virgo:site2018@ds215633.mlab.com:15633/adopteunmaitre', function(err, db) {
        if (err) {
            console.log('La Base De Données est inaccessible, le site Adopte un Maitre ne peut pas démarrer');
        throw "La Base De Données est inaccessible, le site Adopte un Maitre ne peut pas démarrer, veuillez contacter l\'Administrateur Système";
        } else {
            client=db;
            console.log('La Base De Données adopteunmaitre fonctionne');
        }
    });
};

// ************************************************************************************************
// Verification de l'accessibilité de la Base De Données :"adopteunmaitre"- 
// Dans un contexte professionnelle je m'assurai que la BDD fonctionne à chaque requete mais
// dans le contexte du projet "réseau social", je ne le fais qu'au debut du lancement du programme 
// et si elle ne fonctionne pas, j'envoie un message dans la console et je quitte le programme
// ************************************************************************************************
verifDBConnect();

//*************************************************************************************************
//  Préparation du fond d'écran, et récupération des messages déjà échangé 
//  Requete des infos du nombre de messages echangés dans la collection "messages" de la BDD adopteunmaitre
//*************************************************************************************************

app.set('view engine', 'pug');
app.use('/static', express.static(__dirname + '/assets'));
app.use('/static', express.static(__dirname + '/bootstrap.3.3.6'));
app.use('/static', express.static(__dirname + '/font-awesome.4.6.1'));
app.get('/', function(req, res, next) {    
    dbInterface.connectDB(req,res,next,function(db) {            
        console.log('mongodb connected');
     //   const collection = db.collection('messages');
     //   collection.find().toArray(function(err, data){
      //  if (err) {
      //      console.log('Erreur de collection');
      //      return;
      //  }
     //   console.log('data',data);  
   //   res.render('index', {nombreMessage: data})  
      res.render('index', {})  
     //   });
    });
});
app.get('/apropos', function(req, res) {
    res.render('apropos', {})  
});
app.get('/', function(req, res) {
    res.render('index', {})  
});

// ***********************************************************************************************
//  Lancement du serveur NodeJS
// ***********************************************************************************************
const server = app.listen(process.env.PORT || 2000, function() {
    const portEcoute = server.address().port
    console.log('Écoute du serveur NodeJs sur le port %s',portEcoute);
});

//************************************************************************************************
// Déclaration des variables globales
//************************************************************************************************
const membres = 
{
    compteur:-1,
    nbMessage:0,
    
    membre:
    { 
        
       
    }
};

let connectes = {         // visiteur en train de se connecter mais non encore validés
    compteur:-1,
    id:[]       
};

let client = {};                    // instance de la base de données




 

//************************************************************************************************
// Vérification de l'unicité du nom d'un membre dans le réseau social
//************************************************************************************************
let sendAlreadyExistentPseudoMsg = function(pWebsocketConnection, pObjetVisiteur) {
    let message = {};
    message.id = connectes.id[connectes.compteur];
    pObjetVisiteur.username = '';
    message.message = 'Ce pseudo existe déjà';
    pWebsocketConnection.emit('message', message);
};

//************************************************************************************************
// Vérification que le pseudo de l'visiteur est renseigné
// ***********************************************************************************************
let checkFilledUserNameIsOk = function(pObjetVisiteur, pWebsocketConnection) {
    if (!pObjetVisiteur.username) {
        let message = {};
        // message.id = connectes.id[connectes.compteur];
        pObjetVisiteur.username = '';
        message.message = 'Vous devez saisir un Pseudo';
        pWebsocketConnection.emit('message', message);
        return false;
    } else {
        return true;
    }
};

//************************************************************************************************
// Préparation des données du nouveau membre
// et insertion dans la base de données
// ************************************************************************************************
let prepareAndInsertNewUser = function(pObjetMembre,pColMembre) {
   
    pColMembre.insert(pObjetMembre);
  
};


//************************************************************************************************
// Obtention du nombre de messages publiés dans  la BDD et transmission de celles-ci à tout le monde
//************************************************************************************************
let getNbMessages = function(pSocketIo) {
    let colNbMessages = client.db('adopteunmaitre').collection('messages');           
    colNbMessages.count(function(err, data){
        if (err) {
          console.log('Erreur de collection');
          return;
        }
        pSocketIo.emit('nbMessages',  data);             
    });   
}; 


/*****************************************************************************************************/
/*************************  Partie Websocket du serveur  *********************************************/
/*****************************************************************************************************/
let socketIo = new SocketIo(server);

socketIo.on('connection', function(websocketConnection) {
    websocketConnection.emit('connexionServeurOK', {msg:'Connexion effectuée'});   
    console.log('Connexion établie');
    let ObjetMembre = {};
    let currentUser = -1;
   // getNbMessages(socketIo); // affichage du nombre de messages publiés en temps réel
                        
    websocketConnection.on('controleConnection', function (data) {       // Reception de la saisie du Login dans le formulaire
        ObjetDuMembre = data;
        
        if (checkFilledUserNameIsOk(ObjetDuMembre,websocketConnection)) {  // Si le nom du visiteur est non vide --> Ok
            // Vérification de l'unicité du nom du visiteur dans la partie dans la collection visiteur de la BDD JEU
            let colvisiteur = client.db('adopteunmaitre').collection('membres');
            colvisiteur.find({username:ObjetDuMembre.username}).toArray(function(error, documents) {                    
                if (error) {
                    console.log('Erreur de collection',error);
                    return false;
                } else {                                
                    if (documents == false) {
                        // Nouveau visiteur, inexistant dans la base --> Ok, On l accepte
                        visiteurs.compteur++;     // Nbre de visiteurs actuels autorisés et dernier visiteur connecté  (Water Mark)
                        currentUser = visiteurs.compteur;         // visiteur courant de cette session-Connexion
                        prepareAndInsertNewUser(ObjetDuMembre, colvisiteur);    // Ecriture dans la BDD du nouveau visiteur
                        socketIo.emit('pret', ObjetDuMembre);
                       
                        websocketConnection.emit('EffaceFormulaire');        
                                            
                    } else {                
                        sendAlreadyExistentPseudoMsg(websocketConnection, ObjetDuMembre)
                    }
                }
            });                          
        }   // Le nom du visiteur est vide gerer dans la fonction checkFilledUserNameIsOk     
        
                        // geré dans la fonction controleNbreMaxiUsersIsOK               
    });          

    websocketConnection.on('controleInscription', function (data) {       // Reception de la saisie du Login dans le formulaire
        ObjetVisiteur = data;
        
        if (checkFilledUserNameIsOk(ObjetVisiteur,websocketConnection)) {  // Si le nom du visiteur est non vide --> Ok
            // Vérification de l'unicité du nom du visiteur dans la partie dans la collection visiteur de la BDD JEU
            let colvisiteur = client.db('adopteunmaitre').collection('membres');
            colvisiteur.find({username:ObjetVisiteur.username}).toArray(function(error, documents) {                    
                if (error) {
                    console.log('Erreur de collection',error);
                    return false;
                } else {                                
                    if (documents == false) {
                        // Nouveau visiteur, inexistant dans la base --> Ok, On l accepte
                        visiteurs.compteur++;     // Nbre de visiteurs actuels autorisés et dernier visiteur connecté  (Water Mark)
                        currentUser = visiteurs.compteur;         // visiteur courant de cette session-Connexion
                        prepareAndInsertNewUser(ObjetVisiteur, colvisiteur);    // Ecriture dans la BDD du nouveau visiteur
                        socketIo.emit('pret', ObjetVisiteur);
                       
                        websocketConnection.emit('EffaceFormulaire');        
                                           
                    } else {                
                        sendAlreadyExistentPseudoMsg(websocketConnection, ObjetVisiteur)
                    }
                }
            });                          
        }   // Le nom du visiteur est vide gerer dans la fonction checkFilledUserNameIsOk     
        
                        // geré dans la fonction controleNbreMaxiUsersIsOK               
    });          



//************************************************************************************    
// Gestion de la deconnection des visiteurs
//***********************************************************************************/
    websocketConnection.on('disconnect', function() {
        if(currentUser >= 0){     // visiteur courant de cette session-Connexion
           
            websocketConnection.broadcast.emit('removevisiteur', currentUser);  // On envoie au front pour suppression du DOM le visiteur qui vient de se déconnecter
            getNbMessages(socketIo); // on envoie au front la MAJ du tableau des scores nottament on récupère le temps de jeu du visiteur qui vient de partir
           
        }            
    });

});   //  Fin de la partie "Connexion" 