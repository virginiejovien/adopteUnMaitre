'use strict';

// ***************************************************************************************************************
// ***************************************************************************************************************
//     PROJET N°3 FINAL: RESEAU SOCIAL
//              ADOPTE UN MAITRE
//     Auteur: Virginie Jovien
//     Décembre 2018
//     Déscriptif:   Un reseau social pour mettre en relation des personnes desirant adopter un chat ou un chaton       
//                   et les  proprietaires de chats qui proposent des chats ou des chatons à l'adoption
//     serverAdopteUnMaitre.js :  Server Web du site Adopte un maître                       
//**************************************************************************************************************** 
/****************************************************************************************************************/

const DBMgr = require('./db');
const express =  require('express');
var app = express();
const SocketIo = require('socket.io');
const MemberServer = require('./MemberMgr');

let vMemberServer;  // Instaciation de l'objet "Members" qui gère toutes lesz fonctions liées aux membres dans l'Objet membres

// *************************************************************************************************************
// Connection à mongoDB, on vérifie qu'elle est bien lancée et que la la base de données "adopteUnMaitre"
// est accessible, sinon, on envoie un message d'erreur à l'administrateur systhème et on termine le programme
//************************************************************************************************************** 
let vDBMgr = new DBMgr();                            // Instanciation de la base de données
vDBMgr.checkDBConnect()
    .then(result => {
        vMemberServer = new MemberServer(vDBMgr);    // Instanciation de l'objet decrivant l'ensemble des membres et les méthodes de gestion de ces membres
        vMemberServer.initNbrPublicMsgs();           // Mise en mémoire du Nbre de messages publics stockés en BDD
    });



// ************************************************************************************************************
// Verification de l'accessibilité de la Base De Données :"adopteunmaitre"- 
// Dans un contexte professionnelle je m'assurai que la BDD fonctionne à chaque requete mais
// dans le contexte du projet "réseau social", je ne le fais qu'au debut du lancement du programme 
// et si elle ne fonctionne pas, j'envoie un message dans la console et je quitte le programme
// ************************************************************************************************************

//*************************************************************************************************************
//  Préparation du fond d'écran, et récupération des messages déjà échangé 
//  Requete des infos du nombre de messages echangés dans la collection "messages" de la BDD adopteunmaitre
//*************************************************************************************************************

app.set('view engine', 'pug');
app.use('/static', express.static(__dirname + '/assets'));
app.use('/static', express.static(__dirname + '/bootstrap.3.3.6'));
app.use('/static', express.static(__dirname + '/font-awesome.4.6.1'));
app.get('/', function(req, res, next) {    
   // dbInterface.connectDB(req,res,next,function(db) {            
   //     console.log('mongodb connected');
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
   // });
});

app.get('/', function(req, res) {
    res.render('index', {})  
});

app.get('/index.html', function(req, res) {
    res.render('index', {})  
});


// ***********************************************************************************************************
//  Lancement du serveur NodeJS
// ***********************************************************************************************************
const server = app.listen(process.env.PORT || 2000, function() {
    const portEcoute = server.address().port
    console.log('Écoute du serveur NodeJs sur le port %s',portEcoute);
});

//************************************************************************************************************
// Déclaration des variables globales
//************************************************************************************************************

// let client = {};                    // instance de la base de données


//************************************************************************************************************
// **********************                                                               **********************
// **********************                                                               **********************    
// **********************                                                               **********************
// **********************                PARTIE WEBSOCKET DU SERVEUR WEB                **********************
// **********************                                                               **********************            
// **********************                                                               **********************
// **********************                                                               **********************    
// ***********************************************************************************************************

let socketIo = new SocketIo(server);
socketIo.on('connection', function(webSocketConnection) {        // Une connexion au serveur vient d être faite
    
          

    vMemberServer.initVisiteur(webSocketConnection, socketIo);  //  initialisation 
    vMemberServer.connexionVisiteur(webSocketConnection, socketIo); 

//************************************************************************************************************  
// Gestion et controle du formulaire de connection  
//************************************************************************************************************    

// Reception des donnees de connexion : Vérification dans la BDD que le membre qui se connecte (Pseudo et mot de passe) existe

    webSocketConnection.on('controleConnection',function(pVisiteurLoginData){
        vMemberServer.visitorTryToLogin(pVisiteurLoginData, webSocketConnection, socketIo)
        .then((result) => {
        });
    });  

// Reception de la demande de recuperation du mot de passe oublié : Vérification dans la BDD que l'adresse mail existe
    webSocketConnection.on('envoieEmailRecupMp', function (email) {
        console.log('recoit email pour mot de passe oublié:', email);
        vMemberServer.checkMpLostSendMail(email, webSocketConnection, socketIo)
    });         
    
// Reception de la demande de changement de mot de passe : 
    webSocketConnection.on('controleChangeMp', function (data) {       // Reception de la saisie du nouveau mot de passe dans le formulaire
        vMemberServer.changePassWord(data, webSocketConnection, socketIo);
    }); 
        

// ***********************************************************************************************************   
// Gestion et controle du formulaire d'inscription
// *********************************************************************************************************** 

// Reception des données de creation de membre : Vérification dans la BDD que le futur membre (Pseudo et Mail) n'existe pas 
    webSocketConnection.on('controleInscription',function(pVisiteurSignInData){
        vMemberServer.checkVisitorSignInISValid(pVisiteurSignInData, webSocketConnection, socketIo)
    }); 
 
//************************************************************************************************************  
// Gestion et controle du formulaire d'inscription Profile 
//************************************************************************************************************ 
   
//************************************************************************************************************  
// Gestion et controle du formulaire d'inscription Profile 
//************************************************************************************************************

// Reception du formulaire du profile d'inscription  
    webSocketConnection.on('controleProfileInscription', function (dataProfilInscription) {  
        vMemberServer.miseAjourProfilMembre(dataProfilInscription, webSocketConnection, socketIo);
    });   
  
    
    
// ***********************************************************************************************************  
// Gestion de la deconnection des visiteurs et des membres 
// Deconnexion d'un visiteur et eventuellement d'un membre  :
// ***********************************************************************************************************
   // Un membre se déconnecte
    webSocketConnection.on('disconnect', function() {
    console.log('disconnect')        
            vMemberServer.disconnectMember(webSocketConnection, socketIo);
    });

});   //  Fin de la partie "Connexion" 