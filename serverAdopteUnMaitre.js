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
const SocketIOFileUpload = require('socketio-file-upload');
const app = express();
const path = require('path');
const SocketIo = require('socket.io');
const MemberServer = require('./memberMgr');



let vMemberServer;  // Instanciation de l'objet "Members" qui gère toutes les fonctions liées aux membres dans l'Objet membres

// *************************************************************************************************************
// Connection à mongoDB, on vérifie qu'elle est bien lancée et que la la base de données "adopteUnMaitre"
// est accessible, sinon, on envoie un message d'erreur à l'administrateur systhème et on termine le programme
//************************************************************************************************************** 
let vDBMgr = new DBMgr();                            // Instanciation de la base de données
vDBMgr.checkDBConnect()
    .then(result => {
        vMemberServer = new MemberServer(vDBMgr);    // Instanciation de l'objet decrivant l'ensemble des membres et les méthodes de gestion de ces membres
        vMemberServer.getNbMessages();           // Mise en mémoire du Nbre de messages publics stockés en BDD
    



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
    app.use(SocketIOFileUpload.router);


    app.get('/', function(req, res, next) {   
        res.render('index') 
    });

    app.get('/', function(req, res) {
        res.render('index', {})  
    });

    app.get('/index.html', function(req, res) {
        res.render('index', {})  
    });

    const uploader = new SocketIOFileUpload();
    uploader.dir = path.join(__dirname, '/assets/images/membres');

// ***********************************************************************************************************
//  Lancement du serveur NodeJS
// ***********************************************************************************************************
    const server = app.listen(process.env.PORT || 2000, function() {
        const portEcoute = server.address().port
        console.log('Écoute du serveur NodeJs sur le port %s',portEcoute);
    });

    

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
        console.log('Connection');        

        // Création de la liaison socket.io sur la base du serveur HTTP déja déclaré précédement
    
        uploader.listen(webSocketConnection);  

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
                    
    // Reception de la demande dans les parametres de changement de mot de passe : 
        webSocketConnection.on('controleParametreMp', function (data) {       // Reception de la saisie du nouveau mot de passe dans le formulaire
            vMemberServer.parametrePassWord(data, webSocketConnection, socketIo);
        }); 

// ***********************************************************************************************************   
// Gestion et controle du formulaire d'inscription
// *********************************************************************************************************** 

    // Reception des données de creation de membre : Vérification dans la BDD que le futur membre (Pseudo et Mail) n'existe pas 
        webSocketConnection.on('controleInscription',function(pVisiteurSignInData){
            vMemberServer.checkVisitorSignInISValid(pVisiteurSignInData, webSocketConnection, socketIo)
        }); 

//************************************************************************************************************  
// Gestion du mur de profile
//************************************************************************************************************ 
    // Reception de la demande de recuperer les donnees du membre dans la collection membres de BDD
    // Envoie par la suite le formulaire d'inscription profile

    // Reception de la demande d'aller sur le mur de profil d'un ami
        webSocketConnection.on('afficheMurAmi', function (dataAmi) {  
            vMemberServer.demandeMurAmi(dataAmi, webSocketConnection, socketIo);
        }); 

    // Reception demande d'afficher les infos d'un ami
        webSocketConnection.on('demandeAffiInfosAmi', function (pseudoDunMembre) { 
            console.log("serveur recoit demande information d'un ami"); 
            vMemberServer.sendInfoMurAmi(pseudoDunMembre, webSocketConnection, socketIo);
        }); 
    // Reception accepte l'invitation
        webSocketConnection.on('accepteInvitation', function (dataDunMembre) { 
            console.log("serveur recoit accepte invitation"); 
            vMemberServer.invitationAccepte(dataDunMembre, webSocketConnection, socketIo);
        }); 
        
//************************************************************************************************************  
// Gestion de la fiche de renseignement du profil du membre
//************************************************************************************************************ 
    // Reception du formulaire du profile d'inscription  
        webSocketConnection.on('controleProfileInscription', function (dataProfilInscription) {  
            vMemberServer.miseAjourProfilMembre(dataProfilInscription, webSocketConnection, socketIo);
        });   

//************************************************************************************************************  
// Gestion de la recherche d'amis
//************************************************************************************************************ 

        // Reception demande d'afficher la liste de tous des membres  
        webSocketConnection.on('demandeListeDeTousLesMembres', function () { 
            console.log('serveur recoit demande liste de tous les membres pour la recherche amis'); 
            vMemberServer.sendListeDeTousLesMembres(webSocketConnection, socketIo);
        });  

        // Reception du formulaire de recherche d'amis
        webSocketConnection.on('controleFormRechercheAmis', function (dataRecherche) {  
            vMemberServer.rechercheMembres(dataRecherche, webSocketConnection, socketIo);
        });   

        // Reception de la demande de rajouter ce membre dans la liste d'amis
        webSocketConnection.on('demandeRajoutAmi', function (dataAmi, dataMembre) {  
            vMemberServer.demandeRajoutListeAmi(dataAmi,dataMembre,webSocketConnection, socketIo);
        });   


//************************************************************************************************************  
// Gestion du Dasboard Administrateur
// Reception de la demande de recuperer les donnees de tous les membres dans la collection membres de BDD
// Envoie par la suite la liste des membres
//************************************************************************************************************ 

    // Reception demande d'afficher la liste des membres  
        webSocketConnection.on('demandeListeMembres', function (dataAdmin) { 
            console.log('serveur recoit demande liste membres'); 
            vMemberServer.sendListDesMembres(dataAdmin, webSocketConnection, socketIo);
        });   

    // Reception demande d'afficher le mur d'un membre 
        webSocketConnection.on('demandeAffiMurDunMembre', function (pseudoDunMembre) { 
            console.log("serveur recoit demande information d'un membre"); 
            vMemberServer.sendInfoMurDunMembre(pseudoDunMembre, webSocketConnection, socketIo);
        });  
    

    // Reception du formulaire de la fiche modifié d'un membre par un administrateur
        webSocketConnection.on('controleFicheModifDunMembre', function (dataFiche) {  
            vMemberServer.miseAjourProfilMembreParAdmin(dataFiche, webSocketConnection, socketIo);
        });   
    // Reception demande de supprimer un membre
        webSocketConnection.on('demandeSupprimeUnMembre', function (dataDunMembre) { 
            console.log("serveur recoit demande supprimer un membre"); 
            vMemberServer.supprimerUnMembre(dataDunMembre, webSocketConnection, socketIo);
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

});  // fin de la partie "connexion BDD"