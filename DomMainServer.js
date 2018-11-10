const DBMgr = require('./dbMgr');
const express = require('express');
const SocketIo = require('socket.io');
const MemberServer = require('./MemberServerSide');

// -------------------------------------------------------------------------
// Initilisations des variables, structures, constantes...
// -------------------------------------------------------------------------
let vMemberServer;       // Insta,ciation de l'objet "Members" qui gère toutes lesz fonctions liées aux membres
// -------------------------------------------------------------------------
// Verification de l'accessibilité de la base - Je ne le fais qu'au debut du jeu, 
// mais en tout état de cause, normalement, professionnellement, je devrais 
// m'assurer qu'elle est toujours accessible en cours de partie, mais dans le 
// contexte ultra-limité de cet atelier, ce n'est pas nécessaire
// Si elle ne fonctionne pas, je sors du jeu, après avoir envoyé un message à la console
// -------------------------------------------------------------------------
let vDBMgr = new DBMgr();       // Instanciation de la base de données
vDBMgr.checkDBConnect()
    .then(result => {
        vMemberServer = new MemberServer(vDBMgr);     // Instanciation de l'objet decrivant l'ensemble des membres et les méthodes de gestion de ces membres
        vMemberServer.initNbrPublicMsgs();                // Mise en mémoire du Nbre de messages publics stockés en BDD
    });

// -------------------------------------------------------------------------
// Création de l'application ExpressJS
// Création des routes ExppressJS, car je vais utiliser cet outil pour transferer
// au client la page HTML et tout ce qui lui est nécessaire pour s'afficher et gérer
// l'affichage
// -------------------------------------------------------------------------
const app = express();
app.set('view engine', 'pug');
app.use('/static', express.static(__dirname + '/public'));
app.use('/staticNodeModules', express.static(__dirname + '/node_modules'));
app.get('/', function(req, res){
    res.render('index');    
});
// -------------------------------------------------------------------------
// Création du serveur et lancement du listener
// -------------------------------------------------------------------------
const server = app.listen(process.env.PORT || 3000, function() {
    const addressHote = server.address().address;
    const portEcoute = server.address().port
    console.log('Écoute du serveur http://%s:%s',addressHote,portEcoute);
});
// ------------------------------------------------------------
// Fin de la partie HTTP - Début de la partie WebSocket avec "Socket.io"
// ------------------------------------------------------------



// -------------------------------------------------------------------------
// Création de la liaison socket.io sur la base du serveur HTTP déja déclaré précédement
// --------------------------------------------------------------------------
let socketIo = new SocketIo(server);

socketIo.on('connection', function(webSocketConnection){        // Une connexion au serveur vient d être faite
    vMemberServer.initVisiteur(webSocketConnection, socketIo);    
    
    // On a reçu des données de Login --> Vérification dans la BDD que le prétendant-membre (Pseudo + PWD) existe bien
    webSocketConnection.on('visiteurLoginData',function(pVisiteurLoginData){
        vMemberServer.visitorTryToLogin(pVisiteurLoginData, webSocketConnection, socketIo)
        .then((result) => {
        });
    });

    // On a reçu des données de creation de membre --> Vérification dans la BDD que le prétendant-membre (Mail + Pseudo) n'existe pas déjà
    webSocketConnection.on('visiteurSignInData',function(pVisiteurSignInData){
        vMemberServer.checkVisitorSignInISValid(pVisiteurSignInData, webSocketConnection, socketIo)
    });    

    // On a reçu des données de récupération de mot de passe --> Vérification dans la BDD que le mail existe bien
    webSocketConnection.on('LostPWDMgr',function(pLostPWDEmail){
        vMemberServer.checkLostPWDMailIsValid(pLostPWDEmail, webSocketConnection)
    });

    // Un membre se déconnecte
    webSocketConnection.on('disconnect', function() {
console.log('disconnect')        
        vMemberServer.disconnectMember(webSocketConnection, socketIo);
    });
});