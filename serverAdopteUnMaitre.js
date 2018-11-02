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
// using SendGrid's v3 Node.js Library
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ***********************************************************************************************************
//Connection à mongoDB, on vérifie qu'elle est bien lancée et que la la base de données "adopteunmaitre"
// est accessible, sinon, on envoie un message d'erreur à l'administrateur systhème et on termine le programme
//************************************************************************************************************ 
const verifDBConnect = function() {

    mongodb.MongoClient.connect(process.env.MONGOLAB_URI, { useNewUrlParser: true }, function(err, db) {
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

app.get('/', function(req, res) {
    res.render('index', {})  
});

app.get('/index.html', function(req, res) {
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


//**************************************************************************************************************
// Vérification que le formulaire de connection du membre est valide
// *************************************************************************************************************
let checkFilledConnectionOk = function(pObjetMembre, pWebsocketConnection) {
    if ((!pObjetMembre.pseudo) && (!pObjetMembre.motDePasse)) {
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
// Vérification de l'existence du pseudo du  membre dans la BDD adopteunmaitre
//************************************************************************************************
let verifPseudoExist = function(pObjetMembre, pWebsocketConnection, pColMembres) {
    console.log("pObjetMembre connexion verif pseudo",pObjetMembre);
    pColMembres.find({pseudoInscription:pObjetMembre.pseudo}).toArray(function(error, documents) {                     
        if (error) {
            console.log('Erreur de collection',error);
            return false;
        } else {                                
            if (documents == false) {
                console.log('documents connection false',documents);
                sendNoExistPseudoMsg(pWebsocketConnection, pObjetMembre); // on envoie au client que le pseudo n'existe pas
                return false;                     
            } else { 
                console.log('documents connection',documents);
                verifMotDePasse(pObjetMembre, documents, pWebsocketConnection); // verification si c'est le bon mot de pass
                // l'adresse mail et le mot de passe ok dans la base --> Ok, On l accepte
         //           membres.compteur++;     // Nbre de membres actuels connectés et dernier membre connecté  (Water Mark)
         //           console.log('membres.compteur',membres.compteur);
         //           currentUser = membres.compteur;         // membre courant de cette session-Connexion
          //          console.log('currentUser',currentUser);
                    
            };                       
        }
    });
};                          


//************************************************************************************************
// Le pseudo saisie par le membre n'existe pas dans la collection membres on envoie un message d'alerte
//************************************************************************************************
let sendPbMpProvisoireMsg = function(pObjetMembre, pWebsocketConnection ) {
    let message = {};
    message.message = "Veuillez saisir le mot de passe provisoire que nous vous avons fait parvenir par mail";
    console.log('connection message.message',message.message);
    pWebsocketConnection.emit('messagePbChangeRecupMp', message, pObjetMembre);
};

//************************************************************************************************
// Le pseudo saisie par le membre n'existe pas dans la collection membres on envoie un message d'alerte
//************************************************************************************************
let sendNoExistPseudoMsg = function(pWebsocketConnection, pObjetMembre) {
    let message = {};
    message.message = "Ce pseudonyme n'existe pas";
    console.log('connection message.message',message.message);
    pWebsocketConnection.emit('messageConnection', message, pObjetMembre);
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
        pWebsocketConnection.emit('messageConnection', message);
        return false;
    } else {                                
        console.log("pObjetMembre.motDePasse et pDocuments.mp1Inscription true",pObjetMembre.motDePasse);   
        pWebsocketConnection.emit('disableConnectBtn'); // on envoie au client activation bouton deconnexion 
        pWebsocketConnection.emit('profileConnect', pObjetMembre); // On envoie au client les données de profil du membre        
        return true;
    }
};


//************************************************************************************************
// Vérification du mot de passe provisoire dans la collection membres
// ************************************************************************************************
let verifPseudoMpOk = function(pObjetMembre, pWebsocketConnection, pColMembres) {   
    console.log('pObjetMembre.motDePasse verif mot de passe',pObjetMembre.mpProvisoire); 
    console.log('pObjetMembren verif change mot de passe',pObjetMembre); 
    pColMembres.find({pseudoInscription:pObjetMembre.pseudo}).toArray(function(error, documents) {                     
        if (error) {
            console.log('Erreur de collection',error);
            return false;
        } else {                                
            if (documents == false) {
                console.log('documents change mot de passe false',documents);
                sendPbMpProvisoireMsg(pObjetMembre, pWebsocketConnection); // on envoie au client que le pseudo n'existe pas
                return false;                     
            } else { 
                console.log('documents connection',documents);
                console.log('pDocuments.mpProvisoire verif mot de passe dans la collection',documents[0].mpProvisoire);             
                if ((pObjetMembre.mpProvisoire) !== (documents[0].mpProvisoire)) {
                    console.log('pas les mêmes mot de passe provisoire');
                    let message = {};
                    message.message = "Votre mot de passe n'est pas correct";
                    pWebsocketConnection.emit('messagePbChangeRecupMp', message);
                    return false;
                } else {  
                    let pseudoNew = documents[0].pseudoInscription;  
                    let email = documents[0].mailInscription; 
                    let mpNew = pObjetMembre.mp1Recup;                            
                    console.log("pObjetMembre.mpProvisoire et pDocumentsmpProvisoire true",pObjetMembre.mpProvisoire);
                    pColMembres.updateMany({pseudoInscription:pObjetMembre.pseudo}, {$set: {mp1Inscription:mpNew,mp2Inscription:mpNew,mpProvisoire:mpNew}}); 
                    if (error){
                        console.log('Erreur de upadte dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                        throw error;
                    } else {         
                        console.log('update ok');                               
                        console.log("mpNew",mpNew);                       
                        let messageToSend = {
                        to       : email,
                        from     : 'adopteUnMaitre@amt.com',
                        subject  : 'Info changement de mots de passe',
                        html     : '<h1 style="color: black;">Hello '+pseudoNew+'</h1><p><h2>Voici vos nouvelles données de connexion pour naviguer sur le site :<b>Adopte un Maître</b> </h2><br />Vos identifiants sont : <p><Strong>Pseudonyme : </strong>'+pseudoNew+'<p><strong>Mot de passe : </strong>'+mpNew +
            '</p><br /><br /><br /><i>Adopte un Maitre Team</i>',
                         }
                        sgMail.send(messageToSend);  // envoie du mail de récupérartion de mot de passe
                        pWebsocketConnection.emit('mailSendInfoChangeMp',pObjetMembre); 
                    }  
                    pWebsocketConnection.emit('disableConnectBtn'); // on envoie au client activation bouton deconnexion 
                    pWebsocketConnection.emit('profileConnect', pObjetMembre); // On envoie au client les données de profil du membre        
                    return true;
                }
            };
        };
    }.bind(this)); 
  
};


//**************************************************************************************************************
// Vérification que le formulaire d'inscription du futur membre est valide
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

//**************************************************************************************************************
// Vérification que le formulaire d'inscription du futur membre est valide
// *************************************************************************************************************
let checkFilledChangeMpOk = function(pObjetMembre, pWebsocketConnection) {
    if ((!pObjetMembre.mpProvisoire) &&  (!pObjetMembre.mp1Recup)) {
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
// Vérification si administrateur:
//   si pseudo = TEAMxxxxADMIN0 super administrateur statut:2
//   si pseudo = TEAMxxxxADMIN1 admnistrateur statut : 1 
//************************************************************************************************

//************************************************************************************************
// Vérification de l'unicité du pseudo du futur membre dans le reseau social
//************************************************************************************************
let verifPseudoNoExist = function(pObjetMembre, pWebsocketConnection, pColMembres) {
    console.log("pObjetMembre inscription verif pseudo",pObjetMembre);
 //   let colMembres = client.db('adopteunmaitre').collection('membres');
    pColMembres.find({pseudoInscription:pObjetMembre.pseudoInscription}).toArray(function(error, documents) {                    
        if (error) {                    // Erreur technique
            console.log('Erreur de collection',error);
            return false;
        } else {                                
            if (documents == false) {           // Si non trouvé
                console.log('documents verif si pseudo n existe  pas true',documents);
                verifMailNoExist(pObjetMembre,pWebsocketConnection, pColMembres); // verif unicite adresse mail dans la bbd membres    
                return true;
            } else { 
                console.log('documents verif si pseudo n existe  pas false',documents);                            // Document trouvé --> Message d'erreur
                let message = {};
                pObjetMembre.pseudoInscription = '';
                pObjetMembre.mailInscription = '';
                pObjetMembre.mp1Inscription = '';
                pObjetMembre.mp2Inscription = '';
                message.message = 'Ce pseudo est déjà utilisé';
                console.log('message reçu pb saisie pseudo',message);
                pWebsocketConnection.emit('messageInscription', message);
                return false;
            }
        };
    });
};
  
//************************************************************************************************
// Vérification de l'unicité de l'adresse mail du futur membre dans la BBD du reseau social
//************************************************************************************************
let verifMailNoExist = function(pObjetMembre, pWebsocketConnection, pColMembres) {
    console.log("pObjetMembre inscription verif mail",pObjetMembre);
   // let colMembres = client.db('adopteunmaitre').collection('membres');
    pColMembres.find({mailInscription:pObjetMembre.mailInscription}).toArray(function(error, documents) {                  
        if (error) {
            console.log('Erreur de collection',error);
            return false;
        } else {                                
            if (documents == false) {
                console.log('adresse mail n existe pas true ',documents);
                inscriptionMembre(pObjetMembre, pWebsocketConnection, pColMembres);
                return true;
            } else {
                let message = {};
                pObjetMembre.mailInscription = '';
                pObjetMembre.mp1Inscription = '';
                pObjetMembre.mp2Inscription = '';
                message.message = 'Inscription impossible adresse mail déjà utilisée';
                console.log('message reçu pb saisie adresse mail car existe déjà',message);
                pWebsocketConnection.emit('messageInscription', message);
                return false;
            }
        };
    });
};

  

//************************************************************************************************
// L'unicité de l'adresse mail et du peudo sont respectés on peut inscrire et insérer le membre 
// dans la collectio membre de la base de donnees Adopte un Maitre 
//************************************************************************************************
let inscriptionMembre = function(pObjetMembre, pWebsocketConnection, pColMembres) {
 //   membres.compteur++;     // Nbre de membres actuels connectés et dernier membre connecté  
 //   currentUser = membres.compteur;         // membre courant de cette session-Connexion
    console.log('avant prepareAndInsertNewMembe objetMembre.mailInscription', pObjetMembre.mailInscription);
    prepareAndInsertNewMember(pObjetMembre, pColMembres, pWebsocketConnection);    // Ecriture dans la BDD du nouveau membre
            //  sendMailNewMember(); // envoie d'un mail de bienvenue au nouveau membre                        
    pWebsocketConnection.emit('disableConnectBtn'); // on envoie au client activation bouton deconnexion 
    pWebsocketConnection.emit('profileInscription', pObjetMembre); // On envoie au client ses données de profil 
    pWebsocketConnection.emit('felicitationMembre',pObjetMembre); 
    return true;
};
    


//************************************************************************************************
// Préparation des données du nouveau membre
// et insertion dans la base de données
// Envoie d'un mail de confirmation d'inscription au nouveau membre inscrit
// ************************************************************************************************
let prepareAndInsertNewMember = function(pObjetMembre,pColMembres,pWebsocketConnection) {   
    console.log('pObjetMembre insert',pObjetMembre); 
        //  verification si membre ou administrateur ou super administrateur
        console.log("pObjetMembre.pseudoInscription inscription verif administrateur",pObjetMembre.pseudoInscription);
        let finCodeAdmin =  pObjetMembre.pseudoInscription.length;
        let debutCodeAdmin = pObjetMembre.pseudoInscription.substring(0,13);
        console.log('debutCodeAdmin',debutCodeAdmin);
        let codeAdmin = pObjetMembre.pseudoInscription.substring(13,finCodeAdmin); // on recupere ce qui suit apres TEAMxxxxADMIN 
        console.log('codeAdmin',codeAdmin);
     // statut = 0 membre et statut = 1 administrateur statut: 2 super administrateur 
        if (debutCodeAdmin === 'TEAMxxxxADMIN') {    
            if (pObjetMembre.pseudoInscription === 'TEAMxxxxADMIN0'){
                pObjetMembre.statut =  2; // super administrateur il n'y en a qu'un avec le statut = 2         
        
            } else {               
                pObjetMembre.statut =  1;  //  c'est bien un administrateur avec le statut = 1               
            }
          // renvoie un message au visiteur qu'on l'a reconnu en tant qu'administrateur
            let message = {};           
            message.message =   `'Votre inscription d'administrateur du site est prise en compte`;
            pWebsocketConnection.emit('inscriptionAdministrateur', message);    
        } else {   
            console.log('debutCodeAdmin',debutCodeAdmin);
            pObjetMembre.statut =  0; // membre statut = 0 ce n'est pas un administrateur             
        };
      
        console.log('pObjetMembre.statut',pObjetMembre.statut); 
        pObjetMembre.photo =  'static/images/default-avatar.png';
        pObjetMembre.presentation = '';   
        pObjetMembre.ville = ''; 
        pObjetMembre.amis=[];
        pObjetMembre.profil= ''; // est proprietaire ou souhaite adopté ou neutre
        pColMembres.insertOne(pObjetMembre, function(error, result){
            if (error){
                console.log('Erreur d\'insertion dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                throw error;
            } else {                              
                console.log('apres insert',pObjetMembre);
                let messageToSend = {
                    to       : pObjetMembre.mailInscription,
                    from     : 'adopteUnMaitre@amt.com',
                    subject  : 'Votre inscription à Adopte un Maître',
                    html     : '<h1 style="color: black;">Félicitations</h1><p><h2>Vous êtes maintenant membre du réseau social <b>Adopte un Maître</b> </h2><br />Vos identifiants sont : <p><Strong>Pseudonyme : </strong>'+pObjetMembre.pseudoInscription+'<p><strong>Mot de passe : </strong>'+pObjetMembre.mp1Inscription +
    '</p><br /><br /><br /><i>Adopte un Maitre Team</i>',
                }
               sgMail.send(messageToSend);  // envoie du mail d'inscripotion
               
            }
        }.bind(this));

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
  
//************************************************************************************    
// Gestion et controle du formulaire de connection  
//***********************************************************************************/                      
    websocketConnection.on('controleConnection', function (data) {       // Reception de la saisie du Login dans le formulaire
        objetMembre = data;
        console.log('data reçues : ',data,' --- ',objetMembre);
        if (checkFilledConnectionOk(objetMembre,websocketConnection)) {  // Si les champs du formulaire du visiteur sont non vide --> Ok
            // Vérification de l'unicité du nom du visiteur dans la partie dans la collection visiteur de la BDD JEU
            let colMembres = client.db('adopteunmaitre').collection('membres');
            verifPseudoExist(objetMembre,websocketConnection,colMembres);  // verif que le pseudo existe dans la bbd membres
        }   // Le nom du visiteur est vide gerer dans la fonction checkFilledUserNameIsOk               
    });   

 //************************************************************************************************
// Fonction qui genère de façon aléatoire un mot de passe
// ************************************************************************************************
let generePassWord = function generer_password(l) {   
        if (typeof l==='undefined'){var l=8;}
        /* c : chaîne de caractères alphanumérique */
        var c='abcdefghijknopqrstuvwxyzACDEFGHJKLMNPQRSTUVWXYZ12345679',
        n=c.length,
        /* p : chaîne de caractères spéciaux */
        p='012345679',
        o=p.length,
        r='',
        n=c.length,
        /* s : determine la position du caractère spécial dans le mdp */
        s=Math.floor(Math.random() * (p.length-1));
    
        for(var i=0; i<l; ++i){
            if(s == i){
                /* on insère à la position donnée un caractère spécial aléatoire */
                r += p.charAt(Math.floor(Math.random() * o));
            }else{
                /* on insère un caractère alphanumérique aléatoire */
                r += c.charAt(Math.floor(Math.random() * n));
            }
        }
        return r;
    };

//************************************************************************************************
// Envoie d'un mail au membre pour  recuperation de son mot de passe
// ************************************************************************************************                     
websocketConnection.on('envoieEmailRecupMp', function (email) {       // Reception de la demande de recuperation du mot de passe oublié
    console.log('recoit email pour mot de passe oublié:', email);
    let colMembres = client.db('adopteunmaitre').collection('membres');
    colMembres.find({mailInscription:email}).toArray(function(error, documents) {       
        if (error){
            console.log('Erreur de lecture dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
            throw error;
        } else {  
            console.log('apres find',email); 
            if (documents == false) {
                console.log('adresse mail n existe pas dans nos bases de donnees ',documents);
                websocketConnection.emit('messageNoRecupMp');
                return false;
            } else {  
                let pseudoRecup = documents[0].pseudoInscription; 
                console.log("documents[0].pseudoInscription pseudo",documents[0].pseudoInscription);
                let l;
                generePassWord(l);
                console.log('motDePasseProvisoire', generePassWord(l));  
                let mpRecup =   generePassWord(l);                     
                colMembres.updateMany({mailInscription:email}, {$set: {mp1Inscription:mpRecup,mp2Inscription:mpRecup,mpProvisoire:mpRecup}}); 
                if (error){
                    console.log('Erreur de upadte dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                    throw error;
                } else {         
                    console.log('update ok');                               
                    console.log("mpRecup",mpRecup);                       
                    let messageToSend = {
                    to       : email,
                    from     : 'adopteUnMaitre@amt.com',
                    subject  : 'Bon retour sur adopte un Maître',
                    html     : '<h1 style="color: black;">Bonjour '+pseudoRecup+'</h1><p><h2>Voici vos données de connexion pour naviguer sur le site :<b>Adopte un Maître</b> </h2><br />Vos identifiants sont : <p><Strong>Pseudonyme : </strong>'+pseudoRecup+'<p><strong>Mot de passe : </strong>'+mpRecup +
        '</p><br /><br /><br /><i>Adopte un Maitre Team</i>',
                     }
                    sgMail.send(messageToSend);  // envoie du mail de récupérartion de mot de passe
                    websocketConnection.emit('mailSendForRecupMp',pseudoRecup); 
                }
            }
        }
    }.bind(this)); 
  
}.bind(this));  


//************************************************************************************    
// Gestion et controle du formulaire de changement de mot de passe
//***********************************************************************************/  
websocketConnection.on('controleChangeMp', function (data) {       // Reception de la saisie du nouveau mot de passe dans le formulaire
    objetMembre = data;
    console.log('data reçues formulaire changement de mot de passe :',data,' --- ',objetMembre);
    if (checkFilledChangeMpOk(objetMembre,websocketConnection)) {  // Si tous les champs du formulaire sont non vide --> Ok
        let colMembres = client.db('adopteunmaitre').collection('membres');    
        verifPseudoMpOk(objetMembre,websocketConnection,colMembres);  // verif si on a le pseudo du membre qui correspond bien avec le mot de passe provisoire
        // verif mot de passe provisoire et mot de passe saisies ok                                            
    }   
}); 
//************************************************************************************    
// Gestion et controle du formulaire d'inscription
//***********************************************************************************/  
    websocketConnection.on('controleInscription', function (data) {       // Reception de la saisie du Login dans le formulaire
        objetMembre = data;
        console.log('data reçues : ',data,' --- ',objetMembre);
        if (checkFilledInscriptionOk(objetMembre,websocketConnection)) {  // Si tous les champs du formulaire sont non vide --> Ok
            // Vérification de l'unicité du futur membre dans la collection membres de la BDD adopteunmaitre
            console.log('true avant find');
            let colMembres = client.db('adopteunmaitre').collection('membres');    
            verifPseudoNoExist(objetMembre,websocketConnection,colMembres);  // verif unicite pseudo dans la bbd membres
            // verif unicite adresse mail dans la bbd membres    
            // Nouveau membre, inexistant dans la base --> Ok, On l accepte                                                       
        }   // Le nom du visiteur est vide gerer dans la fonction checkFilledUserNameIsOk   
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