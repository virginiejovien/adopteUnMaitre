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
// Connection à mongoDB, on vérifie qu'elle est bien lancée et que la la base de données "adopteunmaitre"
// est accessible, sinon, on envoie un message d'erreur à l'administrateur systhème et on termine le programme
//************************************************************************************************************ 
const verifDBConnect = function() {

    mongodb.MongoClient.connect(process.env.MONGOLAB_URI, { useNewUrlParser: true },(err, db) => {
        if (err) {
            console.log('La Base De Données est inaccessible, le site Adopte un Maitre ne peut pas démarrer');
        throw "La Base De Données est inaccessible, le site Adopte un Maitre ne peut pas démarrer, veuillez contacter l\'Administrateur Système";
        } 
        client=db;
        console.log('La Base De Données adopteunmaitre fonctionne');       
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
 let objetPopulation = 
{
     membres : [],                          // On définit un objet vide pour accueillir les membres en nombre indéfini.     nbMembresConnectes : 0,               // Nombre de membres connectés 
     nbVisiteursConnectes : 0,             // Nombre total de connexions en cours sur ce serveur     !!! ATTENTION !!! Il ne's'agit pas encore de membres valides , juste de visiteur
}

// this.objectPopulation = 
// {
//     members             : [],                   // Tableau de toutes les connexions ( Visiteurs dont [Membres + Admin])
//     nbrConnections      : 0,                    // Nbre de connexions actives sans préjuger de leur rôle
//     nbrMembersInSession : 0,                    // ?bre de membres connectés (Membres + Admin)
//     nbrAdminsInSessions : 0,                    // Nombre d'Admins connectés
// }

// this.member =                                   // Structure de stockage proviisoire du membre
// {   
//         email           : '',
//         pseudo          : '',
//         password        : '',
//         role            : 0,                     // Membre, Admin ou SuperAdmin
//         dateCreation    : -1,                    // Timestamp de la création du record
// }


let client = {};                    // instance de la base de données



//************************************************************************************************************
// **********************                                                               **********************
// **********************                                                               **********************    
// **********************                                                               **********************
// **********************                PARTIE FONCTIONS  DU SERVEUR WEB               **********************
// **********************                                                               **********************            
// **********************                                                               **********************
// **********************                                                               **********************    
// ***********************************************************************************************************

//************************************************************************************************************
// **********************                        PARTIE 1 FONCTIONS                     ********************** 
// **********************           ****************  **************                    **********************
// **********************      CONNEXION ET INSCRIPTION AU SITE ADOPTE UN MAITRE        **********************
// **********************      -- consultation : apropos                                **********************            
// **********************      -- connexion :   - contrôle                              **********************
// **********************                       - gestion du mot de passe oublié        **********************
// **********************      -- inscription : - contrôle                              **********************
// **********************                       - envoie mail de confirmation           **********************    
// ***********************************************************************************************************

//************************************************************************************************************
// Vérification que le formulaire de connection du membre est valide
//************************************************************************************************************
let checkFilledConnectionOk = function(pObjetVisiteur, pWebsocketConnection) {
    if ((!pObjetVisiteur.pseudo) && (!pObjetVisiteur.motDePasse)) {
        console.log("pObjetVisiteur connection",pObjetVisiteur);
        let message = {};
        message.message = 'Vous devez renseigner tous les champs du formulaire';
        pWebsocketConnection.emit('message', message);
        return false;
    } else {        
        return true;
    }
};

//************************************************************************************************************
// Vérification de l'existence du pseudo du  membre dans la BDD adopteunmaitre
//************************************************************************************************************
let verifPseudoExist = function(pObjetVisiteur, pWebsocketConnection, pColMembres) {
    console.log("pObjetVisiteur connexion verif pseudo",pObjetVisiteur);
    pColMembres.find({pseudo:pObjetVisiteur.pseudo}).toArray((error, documents) => {                     
        if (error) {
            console.log('Erreur de collection',error);
            throw error;
        } else {                                
            if (documents == false) {
                console.log('documents connection false',documents);
                sendNoExistPseudoMsg(pWebsocketConnection, pObjetVisiteur); // on envoie au client que le pseudo n'existe pas
                return false;                     
            } else { 
                console.log('documents connection',documents);
                verifMotDePasse(pObjetVisiteur, documents, pWebsocketConnection); // verification si c'est le bon mot de pass
                // l'adresse mail et le mot de passe ok dans la base --> Ok, On l accepte
         //           membres.compteur++;     // Nbre de membres actuels connectés et dernier membre connecté  (Water Mark)
        
            };                       
        }
    });
};                          

//************************************************************************************************************
// Le pseudo saisie par le membre n'existe pas dans la collection membres on envoie un message d'alerte
//************************************************************************************************************
let sendPbMpProvisoireMsg = function(pObjetMembreLocalMotDePasse, pWebsocketConnection) {
    let message = {};
    message.message = "Veuillez saisir le mot de passe provisoire que nous vous avons fait parvenir par mail";
    console.log('connection message.message',message.message);
    pWebsocketConnection.emit('messagePbChangeRecupMp', message, pObjetMembreLocalMotDePasse);
};

//************************************************************************************************************
// Le pseudo saisie par le membre n'existe pas dans la collection membres on envoie un message d'alerte
//************************************************************************************************************
let sendNoExistPseudoMsg = function(pWebsocketConnection, pObjetVisiteur) {
    let message = {};
    message.message = "Ce pseudonyme n'existe pas";
    console.log('connection message.message',message.message);
    pWebsocketConnection.emit('messageConnection', message, pObjetVisiteur);
};

//************************************************************************************************************
// Vérification du mot de passe dans la collection membres
//************************************************************************************************************
let verifMotDePasse = function(pObjetVisiteur,pDocuments, pWebsocketConnection) {  
    console.log('pDocuments la collection',pDocuments);  
    let documents = pDocuments;
    console.log('pDocuments.mp verif mot de passe dans la collection',documents[0].mp);             
    if ((pObjetVisiteur.motDePasse) !== (documents[0].mp)) {
        console.log('pas les mêmes mot de passe');
        let message = {};
        message.message = "Votre mot de passe n'est pas correct";
        pWebsocketConnection.emit('messageConnection', message);
        return false;
    } else {                                
        console.log("pObjetVisiteur.motDePasse et pDocuments.mp1Inscription true",pObjetVisiteur.motDePasse);   
        pWebsocketConnection.emit('disableConnectBtn'); // on envoie au client activation bouton deconnexion 
        pWebsocketConnection.emit('profileConnect', pObjetVisiteur); // On envoie au client les données de profil du membre        
        return true;
    }
};

//************************************************************************************************************
// Fonction qui genère de façon aléatoire un mot de passe
// ***********************************************************************************************************
let generePassWord = function generer_password(l) {   
    if (typeof l === 'undefined') {
        var l = 8;
    } 
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

    for (var i = 0; i < l; ++i) {
        if (s == i) {
            /* on insère à la position donnée un caractère spécial aléatoire */
            r += p.charAt(Math.floor(Math.random() * o));
        } else {
            /* on insère un caractère alphanumérique aléatoire */
            r += c.charAt(Math.floor(Math.random() * n));
        }
    }
    return r;
};


//************************************************************************************************************
// Vérification du mot de passe provisoire dans la collection membres
//************************************************************************************************************
let verifPseudoMpOk = function(pObjetMembreLocalMotDePasse, pObjetMembreLocal, pWebsocketConnection, pColMembres) {   
    console.log('pObjetMembreLocal.motDePasse verif mot de passe',pObjetMembreLocalMotDePasse.mpProvisoire); 
    console.log('pObjetMembreLocalMotDePasse verif change mot de passe',pObjetMembreLocalMotDePasse); 
    pColMembres.find({pseudo:pObjetMembreLocalMotDePasse.pseudo}).toArray((error, documents) => {                     
        if (error) {
            console.log('Erreur de find dans collection colMembres',error);
            throw error;
        }                                
        if (documents == false) {
            console.log('documents change mot de passe false',documents);
            sendPbMpProvisoireMsg(pObjetMembreLocalMotDePasse, pWebsocketConnection); // on envoie au client que le pseudo n'existe pas
            return false;                     
        }  
        console.log('documents connection',documents);
        console.log('pDocuments.mpProvisoire verif mot de passe dans la collection',documents[0].mpProvisoire); 

        if ((pObjetMembreLocalMotDePasse.mpProvisoire) !== (documents[0].mpProvisoire)) {
            console.log('pas les mêmes mot de passe provisoire');
            let message = {};
            message.message = "Votre mot de passe n'est pas correct";
            pWebsocketConnection.emit('messagePbChangeRecupMp', message);
            return false;
        } 
            let pseudoSengrid = documents[0].pseudo;  
            let emailSengrid = documents[0].email; 
            let mpNew = pObjetMembreLocalMotDePasse.mp1Recup;   

            // misa à jour de l'objet membre
            pObjetMembreLocal.memberData.pseudo         = pObjetMembreLocalMotDePasse.pseudo;
            pObjetMembreLocal.memberData.email          = emailSengrid;
            pObjetMembreLocal.memberData.mp             = mpNew; 
            pObjetMembreLocal.memberData.mpConfirme     = mpNew;
            pObjetMembreLocal.memberData.mpProvisoire   = mpNew;               
            console.log("pObjetMembreLocalMotDePasse.mpProvisoire et pDocumentsmpProvisoire true",pObjetMembreLocalMotDePasse.mpProvisoire);                            

            pColMembres.updateOne(
                {pseudo:pObjetMembreLocal.memberData.pseudo},
                {$set:
                        {
                         mp             :mpNew,
                         mpConfirme     :mpNew,                         
                         mpProvisoire   :mpNew
                        }
                    },(error, document) => {

                if (error) {
                    console.log('Erreur de upadte dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                    throw error;
                }          
                console.log('update ok');                               
                console.log("mpNew",mpNew);                       
                let messageToSend = {
                    to       : emailSengrid,
                    from     : 'adopteUnMaitre@amt.com',
                    subject  : 'Info changement de mots de passe',
                    html     : '<h1 style="color: black;">Hello '+pseudoSengrid+'</h1><p><h2>Voici vos nouvelles données de connexion pour naviguer sur le site :<b>Adopte un Maître</b> </h2><br />Vos identifiants sont : <p><Strong>Pseudonyme : </strong>'+pseudoSengrid+'<p><strong>Mot de passe : </strong>'+mpNew +
                            '</p><br /><br /><br /><i>Adopte un Maitre Team</i>',
                    }
                sgMail.send(messageToSend);  // envoie du mail de récupérartion de mot de passe
                pWebsocketConnection.emit('mailSendInfoChangeMp',pObjetMembreLocal.memberData); 
            
                pWebsocketConnection.emit('disableConnectBtn'); // on envoie au client activation bouton deconnexion 
                pWebsocketConnection.emit('profileConnect', pObjetMembreLocal.memberData); // On envoie au client les données de profil du membre                         
        });  
    });
};

//************************************************************************************************************
// Vérification que le formulaire d'inscription du futur membre est valide
// ***********************************************************************************************************
let checkFilledInscriptionOk = function(pObjetVisiteur, pWebsocketConnection) {
    if ((!pObjetVisiteur.pseudoInscription) && (!pObjetVisiteur.mailInscription) && (!pObjetVisiteur.mp1Inscription)) {
        console.log("pObjetVisiteur inscription",pObjetVisiteur);
        let message = {};       
        pObjetVisiteur.pseudoInscription = '';
        message.message = 'Vous devez renseigner tous les champs du formulaire';
        pWebsocketConnection.emit('message', message);
        return false;
    } else {  
        console.log("pObjetVisiteur true",pObjetVisiteur);   
        return true;
    }
};

//************************************************************************************************************
// Vérification que le formulaire de changement de mot de passe du membre est valide
// ***********************************************************************************************************
let checkFilledChangeMpOk = function(pObjetMembreLocalMotDePasse, pWebsocketConnection) {
    if ((!pObjetMembreLocalMotDePasse.mpProvisoire) &&  (!pObjetMembreLocalMotDePasse.mp1Recup)) {
        console.log("pObjetMembreLocalMotDePasse", pObjetMembreLocalMotDePasse);
        let message = {};       
        pObjetMembreLocalMotDePasse.pseudoInscription = '';
        message.message = 'Vous devez renseigner tous les champs du formulaire';
        pWebsocketConnection.emit('message', message);
        return false;
    } else {  
        console.log("pObjetMembreLocalMotDePasse true",pObjetMembreLocalMotDePasse);   
        return true;
    }
};

//************************************************************************************************************
// Vérification si administrateur:
//   si pseudo = TEAMxxxxADMIN0 super administrateur statut:2
//   si pseudo = TEAMxxxxADMIN1 admnistrateur statut : 1 
//************************************************************************************************************

//************************************************************************************************************
// Vérification de l'unicité du pseudo du futur membre dans le reseau social
//************************************************************************************************************
let verifPseudoNoExist = function(pObjetVisiteur, pObjetMembreLocal, pWebsocketConnection, pColMembres) {
    console.log("pObjetVisiteur inscription verif pseudo",pObjetVisiteur);
 //   let colMembres = client.db('adopteunmaitre').collection('membres');
    pColMembres.find({pseudo:pObjetVisiteur.pseudoInscription}).toArray(function(error, documents) {                    
        if (error) {                    // Erreur technique
            console.log('Erreur de collection',error);
            return false;
        } else {                                
            if (documents == false) {           // Si non trouvé
                console.log('documents verif si pseudo n existe  pas true',documents);
                verifMailNoExist(pObjetVisiteur, pObjetMembreLocal, pWebsocketConnection, pColMembres); // verif unicite adresse mail dans la bbd membres    
                return true;
            } else { 
                console.log('documents verif si pseudo n existe  pas false',documents);                            // Document trouvé --> Message d'erreur
                let message = {};
                pObjetVisiteur.pseudoInscription = '';
                pObjetVisiteur.mailInscription = '';
                pObjetVisiteur.mp1Inscription = '';
                pObjetVisiteur.mp2Inscription = '';
                message.message = 'Ce pseudo est déjà utilisé';
                console.log('message reçu pb saisie pseudo',message);
                pWebsocketConnection.emit('messageInscription', message);
                return false;
            }
        };
    });
};
  
//************************************************************************************************************
// Vérification de l'unicité de l'adresse mail du futur membre dans la BBD du reseau social
//************************************************************************************************************
let verifMailNoExist = function(pObjetVisiteur, pObjetMembreLocal, pWebsocketConnection, pColMembres) {
    console.log("pObjetVisiteur inscription verif mail",pObjetVisiteur);
   // let colMembres = client.db('adopteunmaitre').collection('membres');
    pColMembres.find({email:pObjetVisiteur.mailInscription}).toArray((error, documents) => {                  
        if (error) {
            console.log('Erreur find collection colMembres',error);
            throw error;
        } else {                                
            if (documents == false) {
                console.log('adresse mail n existe pas true ',documents);
                inscriptionMembre(pObjetVisiteur, pObjetMembreLocal,  pWebsocketConnection, pColMembres);
                return true;
            } else {
                let message = {};
                pObjetVisiteur.mailInscription = '';
                pObjetVisiteur.mp1Inscription = '';
                pObjetVisiteur.mp2Inscription = '';
                message.message = 'Inscription impossible adresse mail déjà utilisée';
                console.log('message reçu pb saisie adresse mail car existe déjà',message);
                pWebsocketConnection.emit('messageInscription', message);
                return false;
            }
        };
    });
};


//************************************************************************************************************
// L'unicité de l'adresse mail et du peudo sont respectés on peut inscrire et insérer le membre 
// dans la collection membre de la base de donnees Adopte un Maitre 
//************************************************************************************************************
let inscriptionMembre = function(pObjetVisiteur,pObjetMembreLocal, pWebsocketConnection, pColMembres) {

    console.log('avant prepareAndInsertNewMembe objetVisiteur.mailInscription', pObjetVisiteur.mailInscription);

    prepareAndInsertNewMember(pObjetVisiteur, pObjetMembreLocal, pColMembres, pWebsocketConnection);    // Ecriture dans la BDD du nouveau membre                            
    pWebsocketConnection.emit('disableConnectBtn'); // on envoie au client activation bouton deconnexion 
    pWebsocketConnection.emit('profileInscription', pObjetMembreLocal.memberData); // On envoie au client ses données de profil 
    pWebsocketConnection.emit('felicitationMembre', pObjetMembreLocal.memberData); 
    return true;
};
    


//************************************************************************************************************
// Préparation des données du nouveau membre
// et insertion dans la base de données
// Envoie d'un mail de confirmation d'inscription au nouveau membre inscrit
//************************************************************************************************************
let prepareAndInsertNewMember = function(pObjetVisiteur,pObjetMembreLocal,pColMembres,pWebsocketConnection) {   
    console.log('pObjetVisiteur insert',pObjetVisiteur); 
        //  verification si membre ou administrateur ou super administrateur
        console.log("pObjetVisiteur.pseudoInscription inscription verif administrateur",pObjetVisiteur.pseudoInscription);
        let finCodeAdmin =  pObjetVisiteur.pseudoInscription.length;
        let debutCodeAdmin = pObjetVisiteur.pseudoInscription.substring(0,13);
        console.log('debutCodeAdmin',debutCodeAdmin);
        let codeAdmin = pObjetVisiteur.pseudoInscription.substring(13,finCodeAdmin); // on recupere ce qui suit apres TEAMxxxxADMIN 
        console.log('codeAdmin',codeAdmin);
     // statut = 0 membre et statut = 1 administrateur statut: 2 super administrateur 
        if (debutCodeAdmin === 'TEAMxxxxADMIN') {    
            if (pObjetVisiteur.pseudoInscription === 'TEAMxxxxADMIN0'){
                pObjetVisiteur.statut =  2; // super administrateur il n'y en a qu'un avec le statut = 2         
        
            } else {               
                pObjetVisiteur.statut =  1;  //  c'est bien un administrateur avec le statut = 1               
            }
          // renvoie un message au visiteur qu'on l'a reconnu en tant qu'administrateur
            let message = {};           
            message.message =   `'Votre inscription d'administrateur du site est prise en compte`;
            pWebsocketConnection.emit('inscriptionAdministrateur', message);    
        } else {   
            console.log('debutCodeAdmin',debutCodeAdmin);
            pObjetVisiteur.statut =  0; // membre statut = 0 ce n'est pas un administrateur             
        };
      
        console.log('pObjetVisiteur.statut',pObjetVisiteur.statut); 
     // préparation et mise à jour de l'objetMembreLocal avant insert 
        pObjetMembreLocal.idMember = pWebsocketConnection.id;
        pObjetMembreLocal.isMember = true;  
        pObjetMembreLocal.memberData.statut = pObjetVisiteur.statut;       
        pObjetMembreLocal.memberData.id = Math.round(Math.random() * 10000) + (new Date()).getTime();
       
        pObjetMembreLocal.memberData.dateCreation =  (new Date()).getTime();   
        pObjetMembreLocal.memberData.pseudo = pObjetVisiteur.pseudoInscription;
        pObjetMembreLocal.memberData.email = pObjetVisiteur.mailInscription;
        pObjetMembreLocal.memberData.mp  = pObjetVisiteur.mp1Inscription;
        pObjetMembreLocal.memberData.mpConfirme = pObjetVisiteur.mp2Inscription;       
        
        pColMembres.insertOne(pObjetMembreLocal.memberData, (error, result) => {
            if (error){
                console.log('Erreur d\'insertion dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                throw error;
            } else {                              
                console.log('apres insert',pObjetMembreLocal.memberData);
                let messageToSend = {
                    to       :  pObjetMembreLocal.memberData.email,
                    from     : 'adopteUnMaitre@amt.com',
                    subject  : 'Votre inscription à Adopte un Maître',
                    html     : '<h1 style="color: black;">Félicitations</h1><p><h2>Vous êtes maintenant membre du réseau social <b>Adopte un Maître</b> </h2><br />Vos identifiants sont : <p><Strong>Pseudonyme : </strong>'+pObjetMembreLocal.memberData.pseudo+'<p><strong>Mot de passe : </strong>'+pObjetMembreLocal.memberData.mp +
    '</p><br /><br /><br /><i>Adopte un Maitre Team</i>',
                }
               sgMail.send(messageToSend);  // envoie du mail d'inscripotion
               
            }
        });
       
};

//************************************************************************************************************
// Obtention du nombre de messages publiés dans  la BDD et transmission de celles-ci à tout le monde
//************************************************************************************************************
let getNbMessages = function(pSocketIo) {
    let colNbMessages = client.db('adopteunmaitre').collection('messages');           
    colNbMessages.count((error, data) => {
        if (error){
            console.log('Erreur de comptage dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
        }
        pSocketIo.emit('nbMessages',  data);     
                    
    });   
}; 
//************************************************************************************************************
// **********************                        PARTIE 2 FONCTIONS                     ********************** 
// **********************           ****************  **************                    **********************
// **********************      PROFILE DU MEMBRE INSCRIT AU SITE ADOPTE UN MAITRE       **********************
// **********************      -- consultation : apropos                                **********************                       
// **********************      -- deconnexion :                                         **********************
// **********************      -- profile inscription : - contrôle                      **********************    
// ***********************************************************************************************************

//************************************************************************************************************
// Vérification que le formulaire du profile d'inscription du membre est valide
//************************************************************************************************************
let checkFilledProfilIOk = function(pObjetMembreLocal, pWebsocketConnection) {
    console.log("pObjetMembreLocal profile inscription",pObjetMembreLocal);
    if ((!pObjetMembreLocal.memberData.genre) || (!pObjetMembreLocal.memberData.profil) || (!pObjetMembreLocal.memberData.pays)) {
        console.log("pObjetMembreLocal.memberData profile inscription",pObjetMembreLocal.memberData);
        let message = {};
        message.message = 'Vous devez renseigner tous les champs du formulaire';
        pWebsocketConnection.emit('messageErrorProfilInscription', message);
        return false;
    } else {        
        return true;
    }
};

//************************************************************************************************************
// Mise à jour des donnees du memebre dans la collection membres de la BDD adopteunmaitre
//************************************************************************************************************
let miseAJourProfilMembre = function(pObjetMembreLocal, pWebsocketConnection, pColMembres) {   
    console.log('pObjetMembreLocal  avant MAJ de la collection membres',pObjetMembreLocal); 
    pColMembres.find({pseudo:pObjetMembreLocal.memberData.pseudo}).toArray((error, documents) => {                     
        if (error) {
            console.log('Erreur de find dans collection colMembres',error);
            throw error;
        }                                
        if (documents == false) {
            console.log('erreur avant mise à jour du membre on ne le retrouve pas on observe le  documents',documents);
        //    sendPage404(pObjetMembreLocal, pWebsocketConnection); // on envoie au membre  qu'on rencontre un pb technique
            return false;                     
        }  
        console.log('documents avant MAJ profile inscription', documents);
        
        
            let pseudoSengrid = documents[0].pseudo;  
            let emailSengrid = documents[0].email;           
        
            pColMembres.updateOne(
                {pseudo:pObjetMembreLocal.pseudo},
                {$set:
                     {   
                        nom         :  pObjetMembreLocal.memberData.nom, 
                        prenom      :  pObjetMembreLocal.memberData.prenom,
                        genre       :  pObjetMembreLocal.memberData.genre,
                        age         :  pObjetMembreLocal.memberData.age,
                        telephone   :  pObjetMembreLocal.memberData.telephone,  
                        adresse     :  pObjetMembreLocal.memberData.adresse,
                        cp          :  pObjetMembreLocal.memberData.cp,
                        ville       :  pObjetMembreLocal.memberData.ville,
                        pays        :  pObjetMembreLocal.memberData.pays,
                        profil      :  pObjetMembreLocal.memberData.profil,
                        preference  :  pObjetMembreLocal.memberData.preference
                    }
                },(error, document) => {

                if (error) {
                    console.log('Erreur de upadte dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                    throw error;
                }          
                console.log('update ok');                               
                                    
                let messageToSend = {
                    to       : emailSengrid,
                    from     : 'adopteUnMaitre@amt.com',
                    subject  : 'Informations de Profile',
                    html     : '<h1 style="color: black;">Hello '+pseudoSengrid+'</h1><p><h2>Votre fiche de renseignements de votre profile a bien été prise en compte sur notre site:<b>Adopte un Maître</b> </h2><br />' +
                          '<br /><i>Adopte un Maitre Team</i>',
                    }
                sgMail.send(messageToSend);  // envoie du mail d'information maj profile
                pWebsocketConnection.emit('mailSendInfoChangeMp',pObjetMembreLocal.memberData);             
               
                pWebsocketConnection.emit('profileConnect', pObjetMembreLocal.memberData); // On envoie au client les données de profil du membre                         
        });  
    });
};

//************************************************************************************************************
// **********************                        PARTIE 3 FONCTIONS                     ********************** 
// **********************           ****************  **************                    **********************
// **********************      DECONNEXION DES MEMBRES CONNECTES ET DES VISITEURS       **********************
// **********************      -- mise à jour des compteurs                             **********************                     
// ***********************************************************************************************************

//************************************************************************************************************
// Cette fonction recherche dans la table des membres, celui qui a la propriété passée en parametre
//************************************************************************************************************
function searchMemberInTableOfMembers(pProperty, pValue) {
        let myIndex = objetPopulation.membres.map((propertyFilter) => {
            return propertyFilter[pProperty];
        })
        .indexOf(pValue);
        this.objectFound = objetPopulation.membres[myIndex];
        return myIndex; 
    };

  


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

socketIo.on('connection', function(websocketConnection) {
    websocketConnection.emit('connexionServeurOK', {msg:'Connexion effectuée'});   
    console.log('websocketConnection.id',websocketConnection.id); 
    console.log('Connexion établie');   
    objetPopulation.nbVisiteursConnectes ++;   
    let objetMembreLocal =  {                         // Structure du membre
            idMember            : websocketConnection.id,
            isMember            : false,
            memberData : {
                id              : -1,                    // Id du membre connecté
                pseudo          : '',
                email           : '',            
                mp              : '',
                mpConfirme             : '',
                mpProvisoire    : '',
                statut          : 0,             // Membre 0, Admin 1 ou SuperAdmin 2                                
                dateCreation    : -1,            // Timestamp de la création du compte
                photoProfile    : 'static/images/default-avatar.png',
                nom             : '',
                prenom          : '',
                age             : '',
                genre           : '',            // femme (F)  ou homme(H)
                telephone       : '',      
                adresse         : '', 
                cp              : '',           // code postal
                ville           : '',           // ville 
                pays            : '',           // pays
                profil          : '',           // est proprietaire ou souhaite adopté ou neutre           
                preference      : '',  // preferences            
                amis            :[]    // liste d'amis   
            }        
        };
   // getNbMessages(socketIo); // affichage du nombre de messages publiés en temps réel
 
        let objetVisiteur = {}; // visiteur non connectés et non enregistrés
        let objetMembreLocalMotDePasse = {};

//************************************************************************************************************  
// envoie à tous les visiteurs qui se connecte le nombre de membre connecté  
//************************************************************************************************************ 
    socketIo.emit('nbMembresConnect',objetPopulation.nbMembresConnectes); 


//************************************************************************************************************
// **********************                        PARTIE 1 WEBSOCKET                     ********************** 
// **********************           ****************  **************                    **********************
// **********************      CONNEXION ET INSCRIPTION AU SITE ADOPTE UN MAITRE        **********************
// **********************      -- consultation : apropos                                **********************            
// **********************      -- connexion :   - contrôle                              **********************
// **********************                       - gestion du mot de passe oublié        **********************
// **********************      -- inscription : - contrôle                              **********************
// **********************                       - envoie mail de confirmation           **********************    
// ***********************************************************************************************************

//************************************************************************************************************  
// Gestion et controle du formulaire de connection  
//************************************************************************************************************                    
    websocketConnection.on('controleConnection', function (data) {  // Reception de la saisie du Login dans le formulaire
        objetVisiteur = data;
        console.log('data reçues : ',data,' --- ',objetVisiteur);
        if (checkFilledConnectionOk(objetVisiteur,websocketConnection)) {  // Si les champs du formulaire du visiteur sont non vide --> Ok
            // Vérification de l'unicité du nom du visiteur dans la partie dans la collection visiteur de la BDD JEU
            let colMembres = client.db('adopteunmaitre').collection('membres');
            verifPseudoExist(objetVisiteur, websocketConnection, colMembres);  // verif que le pseudo existe dans la bbd membres
        }   // Le nom du visiteur est vide gerer dans la fonction checkFilledUserNameIsOk               
    });   

  
// ***********************************************************************************************************
// Envoie d'un mail au membre pour  recuperation de son mot de passe
//************************************************************************************************************                   
    websocketConnection.on('envoieEmailRecupMp', function (email) {       // Reception de la demande de recuperation du mot de passe oublié
        console.log('recoit email pour mot de passe oublié:', email);
        let colMembres = client.db('adopteunmaitre').collection('membres');
        colMembres.find({email:email}).toArray((error, documents) => {       
            if (error){
                console.log('Erreur de lecture dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                throw error;
            }  
            console.log('apres find',email); 
            if (documents == false) {
                console.log('adresse mail n existe pas dans nos bases de donnees ',documents);
                websocketConnection.emit('messageNoRecupMp');
                return false;
            } 
            let pseudoRecup = documents[0].pseudo; 
            console.log("documents[0].pseudo pseudo",documents[0].pseudo);
            let l; 
            let mpRecup =   generePassWord(l);
            console.log('motDePasseProvisoire', mpRecup);  
            colMembres.updateOne(
                {email:email}, 
                {$set: {
                        mp          :mpRecup,
                        mpConfirme  :mpRecup,
                        mpProvisoire:mpRecup
                        }
                },(error, document) => {
                
                if (error) {
                    
                    console.log('Erreur de upadte dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                    throw error;
                }                   
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
            });                       
        }); // Bloc general 1erez fonction fleche  
    });  

// ***********************************************************************************************************   
// Gestion et controle du formulaire de changement de mot de passe
// *********************************************************************************************************** 
    websocketConnection.on('controleChangeMp', function (data) {       // Reception de la saisie du nouveau mot de passe dans le formulaire
        objetMembreLocalMotDePasse = data;
        console.log('data reçues formulaire changement de mot de passe :',data,' --- ',objetMembreLocalMotDePasse);
        if (checkFilledChangeMpOk(objetMembreLocalMotDePasse,websocketConnection)) {  // Si tous les champs du formulaire sont non vide --> Ok
            let colMembres = client.db('adopteunmaitre').collection('membres');    
            verifPseudoMpOk(objetMembreLocalMotDePasse,objetMembreLocal, websocketConnection,colMembres);  // verif si on a le pseudo du membre qui correspond bien avec le mot de passe provisoire
            // verif mot de passe provisoire et mot de passe saisies ok                                            
        }   
    }); 

// ***********************************************************************************************************   
// Gestion et controle du formulaire d'inscription
// *********************************************************************************************************** 
    websocketConnection.on('controleInscription', function (data) {       // Reception de la saisie du Login dans le formulaire
        objetVisiteur = data;
        console.log('data reçues inscription: ',data,' --- ',objetVisiteur);
        console.log('data reçues inscription: ',data,' --- ',objetMembreLocal);
        if (checkFilledInscriptionOk(objetVisiteur, websocketConnection)) {  // Si tous les champs du formulaire sont non vide --> Ok
            // Vérification de l'unicité du futur membre dans la collection membres de la BDD adopteunmaitre
            let colMembres = client.db('adopteunmaitre').collection('membres');    
            verifPseudoNoExist(objetVisiteur, objetMembreLocal, websocketConnection, colMembres);  // verif unicite pseudo dans la bbd membres
             // verif unicite adresse mail dans la bbd membres    
            // Nouveau membre, inexistant dans la base --> Ok, On l accepte                                                       
        }   // Le nom du visiteur est vide gerer dans la fonction checkFilledUserNameIsOk   
    });          

//************************************************************************************************************
// **********************                       PARTIE 2 WEBSOCKET                      ********************** 
// **********************           ****************  ******************                **********************
// **********************      PROFILE INSCRIPTION AU SITE ADOPTE UN MAITRE             **********************
// **********************    -- consultation : apropos                                  **********************            
// **********************    -- deconnexion :                                           **********************
// **********************    -- profile inscription : - contrôle                        **********************
// **********************                                                               **********************    
// ***********************************************************************************************************

//************************************************************************************************************  
// Gestion et controle du formulaire d'inscription Profile 
//************************************************************************************************************ 
    websocketConnection.on('membreConnecteApresInscription', function (data) {  // Reception de l'objetDuMembre apres inscription et fermeture fenetre félicitation
        objetMembreLocal.memberData = data;
        console.log('data reçues apres femeture fenetre félicitation: ',data,' --- ',objetMembreLocal);
    objetPopulation.membres[objetMembreLocal.idMember] = objetMembreLocal; // On ajoute le membre qu'on vient de recuperer pour cette connexion dans un objet global objetPopulation qui les recense
    console.log('000000 ---- objetPopulation:   ', objetPopulation);
    //   objetPopulation.membres.push(objetMembreLocal);
        objetPopulation.nbMembresConnectes ++;  // on  ajoute  un connecté dans le compteur des connectés
        console.log('111111---- objetPopulation.nbMembresConnectes:   ', objetPopulation.nbMembresConnectes);
        socketIo.emit('nbMembresConnect',objetPopulation.nbMembresConnectes); // on envoie à tous les clients le nombre de memmbres connectes en temps réeel même aux visiteurs
                
    });   

//************************************************************************************************************  
// Gestion et controle du formulaire d'inscription Profile 
//************************************************************************************************************  
    websocketConnection.on('controleProfileInscription', function (data) { // Reception de l'objetDuMembre apres inscription et fermeture fenetre félicitation
        objetMembreLocal.memberData = data;
        console.log('data reçues : apres inscription profil objetMembreLocal.memberData --- ',objetMembreLocal.memberData);
    //    objetPopulation.membres[objetMembreLocal.id] = objetMembreLocal; // On ajoute le membre qu'on vient de recuperer pour cette connexion dans un objet global objetPopulation qui les recense

        if (checkFilledProfilIOk(objetMembreLocal, websocketConnection)) {  // Si les champs du formulaire du visiteur sont non vide --> Ok
            let colMembres = client.db('adopteunmaitre').collection('membres');
            miseAJourProfilMembre(objetMembreLocal, websocketConnection, colMembres);  // mise à jour des donnees du membre dans la collection membres de la BDD adopteunmaitre
        }              
    });   


//************************************************************************************************************
// **********************            PARTIE DECONNEXION WEBSOCKET                       ********************** 
// **********************                                                               **********************
// **********************      -- Supression  :  compteur connecté                      **********************           
// ***********************************************************************************************************



// ***********************************************************************************************************  
// Gestion de la deconnection des visiteurs et des membres 
// Deconnexion d'un visiteur et eventuellement d'un membre  :
// ***********************************************************************************************************
    websocketConnection.on('disconnect', function() {
        
        let myIndex = searchMemberInTableOfMembers('idMember',websocketConnection.id);

        if (objetPopulation.membres[myIndex].isMember) {                    // Le visiteur qui se deconnecte était un membre
            objetPopulation.nbMembresConnectes--;                      
          
        }

        objetPopulation.members.splice(myIndex, 1);
        objetPopulation.nbVisiteursConnectes--;
        
        //this.UpdateDisplayPopulation(pSocketIo);

     
    //    if(currentUser >= 0) {     // visiteur courant de cette session-Connexion
           
     //       websocketConnection.broadcast.emit('removevisiteur', currentUser);  // On envoie au front pour suppression du DOM le visiteur qui vient de se déconnecter enverra le message à tous les autres clients sauf la connexion nouvellement créée
      //      getNbMessages(socketIo); // on envoie au front la MAJ du tableau des scores nottament on récupère le temps de jeu du visiteur qui vient de ////partir
           
     //   } */           
    });

});   //  Fin de la partie "Connexion" 