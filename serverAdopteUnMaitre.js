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
const config = {
    useNewUrlParser: true
  };

// ***********************************************************************************************************
//Connection à mongoDB, on vérifie qu'elle est bien lancée et que la la base de données "adopteunmaitre"
// est accessible, sinon, on envoie un message d'erreur à l'administrateur systhème et on termine le programme
//************************************************************************************************************ 
const verifDBConnect = function() {
    mongodb.MongoClient.connect('mongodb://virgo:site2018@ds215633.mlab.com:15633/adopteunmaitre', config, function(err, db) {
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
app.get('/profile_membre', function(req, res) {
    res.render('profile_membre', {})  
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
// L'adresse mail du membre n'existe pas dans la collection membres on envoie un message d'alerte
//************************************************************************************************
let sendNoExistMailMsg = function(pWebsocketConnection, pobjetMembre) {
    let message = {};
    message.message = "Cette adresse mail n'existe pas";
    console.log('connection message.message',message.message);
    pWebsocketConnection.emit('messageConnection', message);
};

 

//************************************************************************************************
// Vérification de l'unicité de l'adresse mail d'un membre dans le réseau social
//************************************************************************************************
let sendExistentMailMsg = function(pWebsocketConnection, pobjetMembre) {
    let message = {};
    message.message = 'Cette adresse mail existe déjà';
    pWebsocketConnection.emit('messageInscription', message);
};

//**************************************************************************************************************
// Vérification que le formulaire de connection du membre est valide
// *************************************************************************************************************
let checkFilledConnectionOk = function(pObjetMembre, pWebsocketConnection) {
    if ((!pObjetMembre.mail) && (!pObjetMembre.motDePasse)) {
        console.log("pObjetMembre connection",pObjetMembre);
        let message = {};
        message.message = 'Vous devez renseigner tous les champs du formulaire';
        pWebsocketConnection.emit('message', message);
        return false;
    } else {        
        return true;
    }
};

//************************************************************************************************
// Vérification du mot de passe dans la collection membres
// ************************************************************************************************
    let verifMotDePasse = function(pObjetMembre,pDocuments, pWebsocketConnection) {   
        console.log('pObjetMembre.motDePasse verif mot de passe',pObjetMembre.motDePasse);  
        console.log('pDocuments la collection',pDocuments);  
       let documents = pDocuments;
        console.log('pDocuments.mp1Inscription verif mot de passe dans la collection',documents[0].mp1Inscription);             
        if ((pObjetMembre.motDePasse) !== (documents[0].mp1Inscription)) {
            console.log('pas les mêmes mot de passe');
            let message = {};

            message.message = "Votre mot de passe n'est pas correct";
            pWebsocketConnection.emit('messageMotDePasse', message);
            return false;
        } else {                                
            console.log("pObjetMembre.motDePasse et pDocuments.mp1Inscription true",pObjetMembre.motDePasse);   
            return true;
        }
    };

//**************************************************************************************************************
// Vérification que le formulaire du futur membre est valide
// *************************************************************************************************************
let checkFilledInscriptionOk = function(pObjetMembre, pWebsocketConnection) {
    if ((!pObjetMembre.pseudoInscription) && (!pObjetMembre.mailInscription) && (!pObjetMembre.mp1Inscription)) {
        console.log("pObjetMembre inscription",pObjetMembre);
        let message = {};
        // message.id = connectes.id[connectes.compteur];
        pObjetMembre.pseudoInscription = '';
        message.message = 'Vous devez renseigner tous les champs du formulaire';
        pWebsocketConnection.emit('message', message);
        return false;
    } else {  
        console.log("pObjetMembre true",pObjetMembre);   
        return true;
    }
};

//************************************************************************************************
// Préparation des données du nouveau membre
// et insertion dans la base de données
// ************************************************************************************************
let prepareAndInsertNewMember = function(pObjetMembre,pColMembre) {   
    console.log('pObjetMembre insert',pObjetMembre);  
        pObjetMembre.statut =  0;  // statut = 0 membre et statut = 1 administrateur
        console.log('pObjetMembre.statut',pObjetMembre.statut); 
        pObjetMembre.photo =  'static/images/default-avatar.png';
        pObjetMembre.presentation = '';   
        pObjetMembre.ville = ''; 
        pObjetMembre.amis=[];
        pObjetMembre.profil= ''; // est proprietaire ou souhaite adopté ou neutre
        pColMembre.insertOne(pObjetMembre);
        console.log('apres insert',pObjetMembre);
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
    console.log('websocketConnection.id',websocketConnection.id); 
    console.log('Connexion établie');
    let objetMembre = {};
    let currentUser = -1;
   // getNbMessages(socketIo); // affichage du nombre de messages publiés en temps réel
                        
    websocketConnection.on('controleConnection', function (data) {       // Reception de la saisie du Login dans le formulaire
        objetMembre = data;
        console.log('data reçues : ',data,' --- ',objetMembre);
        if (checkFilledConnectionOk(objetMembre,websocketConnection)) {  // Si le nom du visiteur est non vide --> Ok
            // Vérification de l'unicité du nom du visiteur dans la partie dans la collection visiteur de la BDD JEU
            let colMembres = client.db('adopteunmaitre').collection('membres');
            colMembres.find({mailInscription:objetMembre.mail}).toArray(function(error, documents) {                    
                if (error) {
                    console.log('Erreur de collection',error);
                    return false;
                } else {                                
                    if (documents == false) {
                        console.log('documents connection false',documents);
                        sendNoExistMailMsg(websocketConnection, objetMembre); // on envoie au client que l'adresse' mail n'existe pas
                                            
                    } else { 
                        console.log('documents connection',documents);
                        if(verifMotDePasse(objetMembre, documents, websocketConnection)) { // verification si c'est le bon mot de pass
                        // l'adresse mail et le mot de passe ok dans la base --> Ok, On l accepte
                        membres.compteur++;     // Nbre de membres actuels connectés et dernier membre connecté  (Water Mark)
                        console.log('membres.compteur',membres.compteur);
                        currentUser = membres.compteur;         // membre courant de cette session-Connexion
                        console.log('currentUser',currentUser);
                        websocketConnection.emit('profile', documents); // On envoie au client les données de profildu membre                                 
                        }; 
                      
                    }
                }
            });                          
        }   // Le nom du visiteur est vide gerer dans la fonction checkFilledUserNameIsOk     
                  
    });          

    websocketConnection.on('controleInscription', function (data) {       // Reception de la saisie du Login dans le formulaire
        objetMembre = data;
        console.log('data reçues : ',data,' --- ',objetMembre);
        if (checkFilledInscriptionOk(objetMembre,websocketConnection)) {  // Si tous les champs du formulaire sont non vide --> Ok
            // Vérification de l'unicité du futur membre dans la collection membres de la BDD adopteunmaitre
            console.log('true avant find');
            let colMembres = client.db('adopteunmaitre').collection('membres');
            console.log('apres client db');
            colMembres.find({mailInscription:objetMembre.mailInscription}).toArray(function(error, documents) {                    
                if (error) {
                    console.log('Erreur de collection',error);
                    return false;
                } else {                                
                    if (documents == false) {
                        console.log('documents verif si mail existe ',documents);
                        // Nouveau membre, inexistant dans la base --> Ok, On l accepte
                        membres.compteur++;     // Nbre de membres actuels connectés et dernier membre connecté  
                        currentUser = membres.compteur;         // membre courant de cette session-Connexion
                        console.log('avant prepareAndInsertNewMembe objetMembre.mailInscription', objetMembre.mailInscription);
                        prepareAndInsertNewMember(objetMembre, colMembres);    // Ecriture dans la BDD du nouveau membre
                      //  sendMailNewMember(); // envoie d'un mail de bienvenue au nouveau membre                       
                        websocketConnection.emit('profile', objetMembre); // On envoie au client ses données de profil                 
                    } else {                
                        sendExistentMailMsg(websocketConnection, objetMembre)
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