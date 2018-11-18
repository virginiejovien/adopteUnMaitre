
// ***************************************************************************************************************
// ***************************************************************************************************************
//     PROJET N°3 FINAL: RESEAU SOCIAL                                                                ************
//              ADOPTE UN MAITRE                                                                      ************
//     Auteur: Virginie Jovien                                                                        ************
//     Décembre 2018                                                                                  ************
//     Déscriptif:      Un reseau social pour mettre en relation des personnes desirant adopter       ************
//                      un chat ou un chaton et les  proprietaires de chats qui proposent des chats   ************   
//                      ou des chatons à l'adoption                                                   ************
//                                                                                                    ************
//     memberMgr.js :  module qui est un Objet représentant les visiteurs et membres                  ************
//                                                                                                    ************       
//     Objet : MemberServer                                                                           ************                                      //                                                                                                    ************                                      //     Cet objet sert à gérer :                                                                       ************
//       - Le filtrage des candidats qui aspirent à jouer                                             ************
//      - La structure principale des données d'échange avec les clients                              ************
//                                                                                                    ************
//   Nécessite :                                                                                      ************
//       Le module "dbMgr"                                                                            ************
//       Une variable pour son instanciation                                                          ************                   
//**************************************************************************************************************** 
/****************************************************************************************************************/

// using SendGrid's v3 Node.js Library
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const cstSuperAdmin = 2;  // Statut définissant le Super-Admin - Il n'y a qu'un seul SuperAdmin  pseudo = TEAMxxxxADMIN0  statut:2
const cstAdmin = 1;       // Statut définissant les Admin standards (Qui peuvent accéder à la console d'administration (avec le SuperAdmin))
                          // pseudo qui commence par  TEAMxxxxADMIN suivi d'un nombre ces admnistrateurs ont le code  statut = 1 
const cstMembre = 0;      // Membre standard qui ne peut qu'utiliser la partie publique de l'application statut = 0
const constMailFrom = 'adopteUnMaitre@amt.com';    // Adresse "From" du mail
const constFirstCharString = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'    // Caractères autorisés pour le 1er caractère du PWD
const constNextCharString = constFirstCharString+'&#$*_-'                                        // Caractères autorisés pour les 11 autres caractères du PWD


//************************************************************************************************
// Déclaration des variables globales
//************************************************************************************************
module.exports = function MemberServer(pDBMgr) {    // Fonction constructeur exportée
    this.DBMgr = pDBMgr;                            // variable pour instanciation la base de donnees
    this.objectFound;                               // Objet d'accueil utilisé lors de la recherche d'un objet dans la table des membres
    this.newPassword;                               // Variable de stockage provisoire du nouveau mot de passe créé
    this.nbMessagesPublic;                             // Nbre de messages publics

    this.objetPopulation = 
    {
        membres             : [],                   // Tableau de toutes les connexions ( Visiteurs dont [Membres + Admin])
        nbrConnections      : 0,                    // Nbre de connexions actives sans préjuger de leur rôle
        nbrMembersInSession : 0,                    // Nbre de membres connectés (Membres + Admin)
        nbrAdminsInSessions : 0,                    // Nombre d'Admins connectés
        nbMessagesPublic : 0,                       // Nombre d'Admins connectés
    }

    this.membre =                                   // Structure de stockage provisoire du membre
    {   
            pseudo          : '',
            email           : '',           
            mp              : '',
            mpConfirme          : '',
            statut          :  0,                 // Membre 0, Admin 1 ou SuperAdmin 2 
            dateCreation    : -1,                 // date de creation 
            mpProvisoire    : '',
            statut          : 0,             // Membre 0, Admin 1 ou SuperAdmin 2                                
            dateCreation    : -1,            // Timestamp de la création du compte
            photoProfile    : 'default-avatar.png',
            photoCover      : 'default-cover.jpg',
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
            preference      : '',           // preferences adopte un maitre(AM) adopte un chat (AC) ne sais pas (NSP)            
            amis            :[]             // liste d'amis
    }
   


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
// Fonction retournant un entier aléatoire entre une valeur 
// inférieure (pas nécessairement zéro), et une valeur supérieure
//************************************************************************************************************
    MemberServer.prototype.random = function(pValInf, pValSup){
        return Math.round(((pValSup - pValInf) * Math.random()) + pValInf);
    }

//************************************************************************************************************
// Cette fonction recherche dans la table des membres, celui qui a la propriété passée en parametre
//************************************************************************************************************  
    MemberServer.prototype.searchMemberInTableOfMembers = (pProperty, pValue) => {
        let myIndex = this.objetPopulation.membres.map((propertyFilter) => {
            return propertyFilter[pProperty];
        })
        .indexOf(pValue);
        this.objectFound = this.objetPopulation.membres[myIndex];
        return myIndex; 
    }

//************************************************************************************************************
// Fonction qui genère de façon aléatoire un mot de passe
// ***********************************************************************************************************
    MemberServer.prototype.generePassWord = function generer_password(l) {   
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
// Cette fonction  verifie que la connexion est établie
//************************************************************************************************************  
    MemberServer.prototype.connexionVisiteur = function(pWebSocketConnection, pSocketIo) {
        pWebSocketConnection.emit('connexionServeurOK', {msg:'Connexion effectuée'});   
        console.log('pWebSocketConnection.id',pWebSocketConnection.id); 
        console.log('Connexion établie');   
    }

//************************************************************************************************************
// Initialisation d'un visiteur :
// 1) Stockage de son socket
// 2) Mise a zero de tous les champs
// 3) Ajout du visiteur dans le tableau global des personnes connectées
//************************************************************************************************************
    MemberServer.prototype.initVisiteur = function(pWebSocketConnection, pSocketIo) {
        let objetMembreLocal =  {                         // Structure du membre
            idMember            : pWebSocketConnection.id,
            isMember            : false,           
      //      id                : -1,                Id du membre connecté
            pseudo              : '',
            email               : '',            
            mp                  : '',
            mpConfirme          : '',
            mpProvisoire        : '',
            statut              : 0,             // Membre 0, Admin 1 ou SuperAdmin 2                                
            dateCreation        : -1,            // Timestamp de la création du compte
            photoProfile        : 'default-avatar.png',
            photoCover          : 'default-cover.jpg',
            nom                 : '',
            prenom              : '',
            age                 : '',
            genre               : '',            // femme (F)  ou homme(H)
            telephone           : '',      
            adresse             : '', 
            cp                  : '',           // code postal
            ville               : '',           // ville 
            pays                : '',           // pays
            profil              : '',           // est proprietaire ou souhaite adopté ou neutre           
            preference          : '',  // preferences            
            amis                :[]    // liste d'amis  
            }        
     

        this.objetPopulation.membres.push(objetMembreLocal);
        this.objetPopulation.nbrConnections++;             // Nombre de visiteurs incluant les [membres + Admins]
        this.UpdateDisplayPopulation(pSocketIo);
  //      this.getNbMessages(pSocketIo);

        console.log('--------------------------------------------------------------------------------------------------------------------')
        console.log('initVisiteur - 000 - : this.objetPopulation.membres.length : ',this.objetPopulation.membres.length,
                    '--- Nbre de visiteurs : ', this.objetPopulation.nbrConnections,
                    '--- Nbre de membres : ',this.objetPopulation.nbrMembersInSession,
                    '--- Nbre d\'Admin : ',this.objetPopulation.nbrAdminsInSessions,
                    '--- Nbre de messages : ', this.objetPopulation.nbMessagesPublic,
                    '--- pWebSocketConnection.id : ',pWebSocketConnection.id);
        console.log('--------------------------------------------------------------------------------------------------------------------')
    }; 

//************************************************************************************************************  
// prépare et envoie à tous les visiteurs qui se connecte l'objet population avec les nombres:
//      - de membres connecté  
//      - d'administrateurs connectés
//      - de visiteurs
//      - de messages publics   
//************************************************************************************************************ 
    MemberServer.prototype.UpdateDisplayPopulation = function(pSocketIo){
        population = {
            nbrVisitors    : this.objetPopulation.nbrConnections,
            nbrMembers     : this.objetPopulation.nbrMembersInSession,
            nbrAdmins      : this.objetPopulation.nbrAdminsInSessions,
            nbMessagesPublic  : this.nbMessagesPublic,
        }
        pSocketIo.emit('nbMembresConnect', population); // Affichage sur tous les clients de la MAJ du nombre de membres connectés
    }

//************************************************************************************************************  
// prépare et envoie à tous les visiteurs qui se connecte le nombre de messages publics echangés:       
//************************************************************************************************************ 
MemberServer.prototype.UpdatNbMessagesPublic = function(pSocketIo){
    population = {
        nbrVisitors    : this.objetPopulation.nbrConnections,
        nbrMembers     : this.objetPopulation.nbrMembersInSession,
        nbrAdmins      : this.objetPopulation.nbrAdminsInSessions,
        nbMessagesPublic  : this.nbMessagesPublic,
    }
    pSocketIo.emit('nbMembresConnect', population); // Affichage sur tous les clients de la MAJ du nombre de membres connectés
}
//************************************************************************************************************
// Vérification que le formulaire de connection du membre est valide:
// Vérification de l'existence du pseudo et du Mot de passe du  membre dans la BDD adopteunmaitre
// - Si le mot de passe et le pseudo n'existe pas : on envoie au client "messageNoConnection"
// - Sinon on a bien un membre:  on demande au client activation bouton deconnexion et affichage profil
//************************************************************************************************************
    MemberServer.prototype.visitorTryToLoginPromise = (pVisiteurLoginData, pWebSocketConnection, pSocketIo) => {
        return new Promise((resolve, reject) => {
            this.DBMgr.colMembres.find(
                { 
                    "pseudo": pVisiteurLoginData.pseudo, 
                    "mp"    : pVisiteurLoginData.motDePasse, 
                })
                .limit(1)
                .toArray((error, documents) => {
                    if (error) {
                        reject(error);
                        console.log('Erreur find dans la collection \'membres\' dans la BDD : ',error);   // Erreur technique: "Message et Plantage"
                        throw error;
                    }

                    if (!documents.length){        // Le mot de passe ou/et le pseudo n'ont pas été trouvés dans la BDD : la connexion est refusée
                        pWebSocketConnection.emit('messageNoConnection');   
                        return resolve('Login Erroné');
                    } 

                    this.membre = documents[0];              // Récupération des données du membre dans l'objet membre de stockage provisoire

                    // Recherche du pseudo du membre dans le tableau des membres car je refuse qu'un membre se connecte plusieurs fois sur des sessions différentes
                    let myIndex = this.searchMemberInTableOfMembers('pseudo', this.membre.pseudo)
                    if (myIndex !== -1){                // Si membre trouvé dans la table des membres connectés, on le rejette, sinon, on le connecte
                        resolve('Membre dejà loggé');
                        return pWebSocketConnection.emit('membreDejaConnecte', this.membre);                        
                    }

                    myIndex = this.searchMemberInTableOfMembers('idMember', pWebSocketConnection.id);  // Recherche du visiteur dans le tableau des membres
                    this.objetPopulation.membres[myIndex].email        = this.membre.email;
                    this.objetPopulation.membres[myIndex].pseudo       = this.membre.pseudo;
                    this.objetPopulation.membres[myIndex].mp           = this.membre.mp;
                    this.objetPopulation.membres[myIndex].oldMp        = this.membre.oldMp;
                    this.objetPopulation.membres[myIndex].statut       = this.membre.statut;        // Membre= 0, Admin= 1 ou SuperAdmin= 2
                    this.objetPopulation.membres[myIndex].dateCreation = this.membre.dateCreation;  // Timestamp à la création du membre ds la BDD

                    this.addMemberToActiveMembers(myIndex, pSocketIo);           // Le visiteur est bien un membre, on l'ajoute à la liste des membres
                    console.log("pSocketIo",pSocketIo);   
                    pWebSocketConnection.emit('disableConnectBtn'); // on envoie au client activation bouton deconnexion 
                    pWebSocketConnection.emit('profileConnect', this.membre); // On envoie au client les données de profil du membre  
                  if (this.membre.statut != '0')  {
                    console.log("this.membre.statut",this.membre.statut);
                    pWebSocketConnection.emit('disableAdministrateurBtn'); // on envoie au client activation bouton administrateur car le membre est un administrateur
                  }

                    resolve('Membre loggé');
                });
        });
    };
    
//************************************************************************************************************
// Point d'appel pour la fonction de connection en mode 'async / await'
//************************************************************************************************************
    MemberServer.prototype.visitorTryToLogin = async (pVisiteurLoginData, pWebSocketConnection, pSocketIo) => {
        var result = await (this.visitorTryToLoginPromise(pVisiteurLoginData, pWebSocketConnection, pSocketIo));
        return result;
    };

//************************************************************************************************************
// Ajoute le membre nouvellement créé ou Loggé avec succès à la liste des membres connectés
//************************************************************************************************************
    MemberServer.prototype.addMemberToActiveMembers = function(pIndex, pSocketIo){
        this.objetPopulation.membres[pIndex].isMember  = true;
        this.objetPopulation.nbrMembersInSession++;  // On ajoute +1 au nbre de membres connectés le membre qu'on vient de lire pour cette connexion dans un objet qui les recense
     //   this.objetPopulation.nbrConnections--; // et par conséquent on retire -1 au nombre de visiteurs en ligne 
        if (this.objetPopulation.membres[pIndex].statut > cstMembre){    // si statut > 0 c'est forcément un Admin ou un SuperAdmin 
            this.objetPopulation.nbrAdminsInSessions++;  // On ajoute +1 aux nbre de membres connectés le membre qu'on vient de lire pour cette connexion dans un objet qui les recense
        }   
        this.UpdateDisplayPopulation(pSocketIo);
    }


//************************************************************************************************************
// Vérification que le formulaire d'inscription du futur membre est valide:
// 1 : Vérification de l'unicité du pseudo du futur membre dans la BBD du reseau social
// 2 : Vérification de l'unicité de l'adresse mail du futur membre dans la BBD du reseau social
// Si  pseudo et email uniques on va créer un nouveau membre da la BDD adopteun maitre collection membres
// Sinon on envoie un message d'erreur 
// ***********************************************************************************************************
    MemberServer.prototype.checkVisitorSignInISValid = function(pVisiteurSignInData, pWebSocketConnection, pSocketIo){
        this.DBMgr.colMembres.find(              // Vérification de l'unicité du pseudo
        { 
            "pseudo": pVisiteurSignInData.pseudoInscription, 
        })
        .limit(1)
        .toArray((error, documents) => {
            if (error){
                console.log('Erreur find dans la collection \'membres\' : ',error);   // Erreur technique: "Message et Plantage"
                throw error;
            } 

            // Si le pseudo a été trouvé --> KO pour la création de nouveau membre
            if (documents.length){  
                let message = {}; 
                message.message = 'Inscription impossible ce pseudo est déjà utilisé';  
                console.log('message reçu pb saisie pseudo car existe déjà',message);                       
                return pWebSocketConnection.emit('messageNoInscription', message); 
            }

            // Le pseudo n a pas été trouvé, on vérifie maintenant la non-existence de l'adresse mail
            this.DBMgr.colMembres.find(                  
            {                               
               "email": pVisiteurSignInData.mailInscription, 
            })
            .limit(1)
            .toArray((error, documents) => {
                if (error){
                    console.log('Erreur find dans la collection \'membres\' : ',error);   // Erreur technique: "Message et Plantage"
                    throw error;                                                          
                } 

                if (documents.length) { 
                    let message = {}; 
                    message.message = 'Inscription impossible cette adresse mail est déjà utilisée';                      
                    return pWebSocketConnection.emit('messageNoInscription', message);       // Si adresse mail trouvée --> KO pour la création de nouveau membre
                } 

                // L'unicité de l'adresse mail et du peudo sont respectés on peut inscrire et insérer le membre 
                // dans la collection membre de la base de donnees Adopte un Maitre 
                this.addMembreInBDD(pVisiteurSignInData, pWebSocketConnection, pSocketIo);         
            });
        });
    }

//************************************************************************************************************
// Préparation des données du nouveau membre
// Vérification si administrateur:
//   si pseudo = TEAMxxxxADMIN0             : super administrateur statut:2
//   si pseudo commence par TEAMxxxxADMIN   :admnistrateur statut : 1 
//   sinon                                  : il s'agit d'un membre statut : 0 
// et insertion dans la base de données
// Envoie d'un mail de confirmation d'inscription au nouveau membre inscrit
//************************************************************************************************************
    MemberServer.prototype.addMembreInBDD = function(pObjetVisiteur, pWebSocketConnection, pSocketIo) {
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
            pWebSocketConnection.emit('inscriptionAdministrateur', message);    
        } else {   
            console.log('debutCodeAdmin',debutCodeAdmin);
            pObjetVisiteur.statut =  0; // membre statut = 0 ce n'est pas un administrateur             
        };
      
        console.log('pObjetVisiteur.statut',pObjetVisiteur.statut); 
     // préparation et mise à jour de l'objetMembreLocal avant insert 
        let objetMembreLocal = {
            pseudo          : pObjetVisiteur.pseudoInscription,
            email           : pObjetVisiteur.mailInscription,                                    
            mp              : pObjetVisiteur.mp1Inscription,
            mpConfirme      : pObjetVisiteur.mp2Inscription,          
            mpProvisoire    : '',  
            statut          : pObjetVisiteur.statut,        // Membre 0, Admin 1 ou SuperAdmin 2                
            dateCreation    : new Date(),       // Timestamp de la création du membre                    
            photoProfile    : 'default-avatar.png',
            photoCover      : 'default-cover.jpg',
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
              
        
        this.DBMgr.colMembres.insertOne(objetMembreLocal, (error, result) => {
            if (error){
                console.log('Erreur d\'insertion dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                throw error;
            }  
            // L'insert du nouveau membre a reussi
            this.membre = objetMembreLocal;
            console.log("ajout d'/ un membre dans la BDD - 1 membre inséré : ", this.membre);  
            
console.log('addMembreInBDD - 000 - pWebSocketConnection.id : ',pWebSocketConnection.id)
            let myIndex = this.searchMemberInTableOfMembers('idMember', pWebSocketConnection.id);  // On ajoute le membre nouvellement créé dans la table des memnbres actifs
console.log('addMembreInBDD - 001 - myIndex : ',myIndex,'--- pWebSocketConnection.id : ',pWebSocketConnection.id)


            this.addMemberToActiveMembers(myIndex, pSocketIo)
                let messageToSend = {
                    to       :  objetMembreLocal.email,
                    from     :  constMailFrom,
                    subject  : 'Votre inscription à Adopte un Maître',
                    html     : '<h1 style="color: black;">Félicitations</h1><p><h2>Vous êtes maintenant membre du réseau social <b>Adopte un Maître</b> </h2><br />Vos identifiants sont : <p><Strong>Pseudonyme : </strong>'+objetMembreLocal.pseudo+'<p><strong>Mot de passe : </strong>'+objetMembreLocal.mp +
    '</p><br /><br /><br /><i>Adopte un Maitre Team</i>',
                }
            sgMail.send(messageToSend);  // envoie du mail d'inscripotion             
        
            pWebSocketConnection.emit('disableConnectBtn');                 // on envoie au client activation bouton deconnexion 
            if (this.membre.statut != '0')  {
                console.log("this.membre.statut",this.membre.statut);
                pWebSocketConnection.emit('disableAdministrateurBtn'); // on envoie au client activation bouton administrateur car le membre est un administrateur
            }
            pWebSocketConnection.emit('profileInscription', this.membre); // On envoie au client ses données de profil 
            pWebSocketConnection.emit('felicitationMembre',this.membre);  // on envoie une demande de félicitation
                
        });
    }

//************************************************************************************************************
// Vérification que l'adresse mail pour la récupération du mot de passe oublié existe :
// - Si l' adresse mail n'existe pas on ennvoie "messageNoRecupMp"
// - Par contre, s'il existe, on génère un un mot de passe provisoire et on le transmet par mail 
//************************************************************************************************************
    MemberServer.prototype.checkMpLostSendMail = function(email, pWebSocketConnection, pSocketIo) {
        console.log('recoit email pour mot de passe oublié:', email);
        
        this.DBMgr.colMembres.find(
                {            
                    email:email
                }
            ).toArray((error, documents) => {       
            if (error){
                console.log('Erreur de lecture dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                throw error;
            }  
            console.log('apres find',email); 
            if (!documents.length) {  
                console.log('adresse mail n existe pas dans nos bases de donnees ',documents);
                return pWebSocketConnection.emit('messageNoRecupMpMail');               
            } 
             // La mail est valide, récupération des infos nécessaires et suffisantes pour renvoyer le nouveau MDP
             this.membre.email = documents[0].email;          // Récupération des infos nécessaires et suffisantes pour renvoyer le nouveau MDP
             this.membre.pseudo = documents[0].pseudo;                                        
             this.membre.mp = documents[0].mp;   
            let pseudoRecup = documents[0].pseudo;           
            console.log("documents[0].pseudo pseudo",documents[0].pseudo);
            let l; 
            let mpRecup = this.generePassWord(l);
            console.log('motDePasseProvisoire generé', mpRecup);  
            this.DBMgr.colMembres.updateOne(
                { email: email }, 
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
                                     
                let messageToSend = {
                    to       : email,
                    from     : constMailFrom,
                    subject  : 'Bon retour sur adopte un Maître',
                    html     : '<h1 style="color: black;">Bonjour '+pseudoRecup+'</h1><p><h2>Voici vos données de connexion pour naviguer sur le site :<b>Adopte un Maître</b> </h2><br />Vos identifiants sont : <p><Strong>Pseudonyme : </strong>'+pseudoRecup+'<p><strong>Mot de passe : </strong>'+mpRecup +
                               '</p><br /><br /><br /><i>Adopte un Maitre Team</i>',
                }
                sgMail.send(messageToSend);  // envoie un mail de récupérartion de mot de passe
                pWebSocketConnection.emit('mailSendForRecupMp',pseudoRecup); 
            });                       
        }); 
    }


//************************************************************************************************************
// Vérification du mot de passe provisoire dans la collection membres
// - Si le mot de passe provisoire n'est pas bon on envoie un message pour signaler le probleme
// - Par contre, si tout est ok:    - on met à jour le nouveau mot de passe 
//                                  - on transmet les nouveaux parametres du compte par mail 
//************************************************************************************************************
    MemberServer.prototype.changePassWord = function(pObjetMembreLocalMotDePasse, pWebSocketConnection, pSocketIo) { 
        console.log('pObjetMembreLocalMotDePasse.mpProvisoire verif change mot de passe',pObjetMembreLocalMotDePasse.mpProvisoire); 
        this.DBMgr.colMembres.find(
            {
                pseudo:pObjetMembreLocalMotDePasse.pseudo

            }).toArray((error, documents) => {                     
            if (error) {
                console.log('Erreur de find dans collection colMembres',error);
                throw error;
            }                                
            if (!documents.length) {  
                console.log('documents change mot de passe false',documents); 
                let message = {};              
                message.message = "Veuillez saisir le mot de passe provisoire que nous vous avons fait parvenir par mail";
                console.log('connection message.message',message.message);
                return pWebSocketConnection.emit('messagePbChangeRecupMp', message, pObjetMembreLocalMotDePasse);                                   
            }  
            console.log('documents connection',documents);
            console.log('pDocuments.mpProvisoire verif mot de passe dans la collection',documents[0].mpProvisoire); 

            if ((pObjetMembreLocalMotDePasse.mpProvisoire) !== (documents[0].mpProvisoire)) {
                console.log('pas les mêmes mot de passe provisoire');
                let message = {};
                message.message = "Votre mot de passe n'est pas correct";
                return pWebSocketConnection.emit('messagePbChangeRecupMp', message);               
            } 
                let pseudoSengrid = documents[0].pseudo;  
                let emailSengrid = documents[0].email; 
                let mpNew = pObjetMembreLocalMotDePasse.mp1Recup;   

                // misa à jour de l'objet membre
                this.membre.pseudo         = pObjetMembreLocalMotDePasse.pseudo;
                this.membre.email          = emailSengrid;
                this.membre.mp             = mpNew;                   
                this.membre.mpConfirme     = mpNew;
                this.membre.mpProvisoire   = mpNew;               
                console.log("pObjetMembreLocalMotDePasse.mpProvisoire et pDocumentsmpProvisoire true",pObjetMembreLocalMotDePasse.mpProvisoire);       
                this.DBMgr.colMembres.updateOne(
                    {pseudo:    this.membre.pseudo},
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
                        from     : constMailFrom,
                        subject  : 'Info changement de mots de passe',
                        html     : '<h1 style="color: black;">Hello '+pseudoSengrid+'</h1><p><h2>Voici vos nouvelles données de connexion pour naviguer sur le site :<b>Adopte un Maître</b> </h2><br />Vos identifiants sont : <p><Strong>Pseudonyme : </strong>'+pseudoSengrid+'<p><strong>Mot de passe : </strong>'+mpNew +
                                '</p><br /><br /><br /><i>Adopte un Maitre Team</i>',
                        }
                    sgMail.send(messageToSend);  // envoie du mail de prise en compte du nouveau mot de passe
                    pWebSocketConnection.emit('mailSendInfoChangeMp',this.membre);               
                
                    pWebSocketConnection.emit('sendFormulaireConnexion', this.membre); // On envoie au client les données de profil du membre                         
            });  
        });
    };

    
//************************************************************************************************************
// Vérification de l'ancien mot de passe saisie dans la collection membres
// - Si le mot de passe saisie n'est pas bon:  -on envoie un message pour signaler le probleme
// - Par contre, si tout est ok:    - on met à jour le nouveau mot de passe 
//                                  - on transmet les nouveaux parametres du compte par mail 
//************************************************************************************************************
MemberServer.prototype.parametrePassWord = function(pObjetMembreLocalMotDePasse, pWebSocketConnection, pSocketIo) { 
    console.log('pObjetMembreLocalMotDePasse.ancienMp verif change mot de passe',pObjetMembreLocalMotDePasse.ancienMp); 
    this.DBMgr.colMembres.find(
        {
            pseudo:pObjetMembreLocalMotDePasse.pseudo

        }).toArray((error, documents) => {                     
        if (error) {
            console.log('Erreur de find dans collection colMembres',error);
            throw error;
        }                                
        if (!documents.length) {  
            console.log('documents change mot de passe false',documents); 
            let message = {};              
            message.message = "Veuillez saisir votre mot de passe actuel pour en créer un nouveau";
            console.log('connection message.message',message.message);
            return pWebSocketConnection.emit('messagePbParametreChangeMp', message, pObjetMembreLocalMotDePasse);                                   
        }  
        console.log('documents connection',documents);
        console.log('pDocuments.mp verif mot de passe dans la collection',documents[0].mp); 

        if ((pObjetMembreLocalMotDePasse.ancienMp) !== (documents[0].mp)) {  ///est ce que les deux anciens mots de passe sont différents
            console.log('Pb parametre mot de passe car pas les mêmes mots de passe');
            let message = {};
            message.message = "Veuillez saisir votre mot de passe actuel pour en créer un nouveau";
            return pWebSocketConnection.emit('messagePbParametreChangeMp', message);               
        } 
            let pseudoSengrid   = documents[0].pseudo;  
            let emailSengrid    = documents[0].email; 
            let mpNew           = pObjetMembreLocalMotDePasse.mp;   // nouveau mot de passe 

            // misa à jour de l'objet membre
            this.membre.pseudo         = pObjetMembreLocalMotDePasse.pseudo;
            this.membre.email          = emailSengrid;
            this.membre.mp             = mpNew;                   
            this.membre.mpConfirme     = mpNew;
            this.membre.mpProvisoire   = mpNew;               
            console.log("pObjetMembreLocalMotDePasse.mpProvisoire et pDocumentsmpProvisoire true",pObjetMembreLocalMotDePasse.mp);       
            this.DBMgr.colMembres.updateOne(        // misa à jour du nouveau mots de passe
                {pseudo:    this.membre.pseudo},
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
                    from     : constMailFrom,
                    subject  : 'Info changement de mots de passe',
                    html     : '<h1 style="color: black;">Hello '+pseudoSengrid+'</h1><p><h2>Voici vos nouvelles données de connexion pour naviguer sur le site :<b>Adopte un Maître</b> </h2><br />Vos identifiants sont : <p><Strong>Pseudonyme : </strong>'+pseudoSengrid+'<p><strong>Mot de passe : </strong>'+mpNew +
                            '</p><br /><br /><br /><i>Adopte un Maitre Team</i>',
                    }
                sgMail.send(messageToSend);  // envoie du mail de prise en compte du nouveau mot de passe
                pWebSocketConnection.emit('mailSendInfoParametreMp',this.membre);               
                                 
        });  
    });
};

//************************************************************************************************************  
// Gestion et controle du formulaire d'inscription Profil
// - verification des champs saisies 
// - Mise à jour des donnees du memebre dans la collection membres de la BDD adopteunmaitre
//************************************************************************************************************ 
    MemberServer.prototype.miseAjourProfilMembre = function(pObjetMembreLocal, pWebSocketConnection, pSocketIo) {   
        console.log('pObjetMembreLocal  avant MAJ de la collection membres',pObjetMembreLocal); 
        if (!pObjetMembreLocal.profil) {
            console.log("pObjetMembreLocal profil inscription champs vide",pObjetMembreLocal);
            let message = {};
            message.message = 'Vous devez renseigner votre profil, les autres champs ne sont pas obligatoires';
            return pWebSocketConnection.emit('messageErrorProfilInscription', message);
            
        } 
            this.DBMgr.colMembres.find({pseudo:pObjetMembreLocal.pseudo}).toArray((error, documents) => {                     
                if (error) {
                    console.log('Erreur de find dans collection colMembres',error);
                    throw error;
                }                                
                if (!documents.length) { 
                    console.log('erreur avant mise à jour du membre on ne le retrouve pas on observe le  documents',documents);
                //    sendPage404(pObjetMembreLocal, pWebSocketConnection); // on envoie au membre  qu'on rencontre un pb technique
                    return false;                     
                }  
                    console.log('documents avant MAJ profil inscription', documents);
                
                
                    let pseudoSengrid = documents[0].pseudo;  
                    let emailSengrid = documents[0].email; 
                    
                    // misa à jour de l'objet membre
                    this.membre.photoProfile        =  pObjetMembreLocal.photoProfile; 
                    this.membre.photoCover          =  pObjetMembreLocal.photoCover;
                    this.membre.nom                 =  pObjetMembreLocal.nom; 
                    this.membre.prenom              =  pObjetMembreLocal.prenom;
                    this.membre.genre               =  pObjetMembreLocal.genre;
                    this.membre.age                 =  pObjetMembreLocal.age;
                    this.membre.telephone           =  pObjetMembreLocal.telephone; 
                    this.membre.adresse             =  pObjetMembreLocal.adresse;
                    this.membre.cp                  =  pObjetMembreLocal.cp;
                    this.membre.ville               =  pObjetMembreLocal.ville;
                    this.membre.pays                =  pObjetMembreLocal.pays;
                    this.membre.profil              =  pObjetMembreLocal.profil;
                    this.membre.preference          =  pObjetMembreLocal.preference;         
                
                    this.DBMgr.colMembres.updateOne(
                        {pseudo: pObjetMembreLocal.pseudo},
                        {$set:
                            {   
                                photoProfile    :  pObjetMembreLocal.photoProfile,
                                photoCover      :  pObjetMembreLocal.photoCover,
                                nom             :  pObjetMembreLocal.nom, 
                                prenom          :  pObjetMembreLocal.prenom,
                                genre           :  pObjetMembreLocal.genre,
                                age             :  pObjetMembreLocal.age,
                                telephone       :  pObjetMembreLocal.telephone,  
                                adresse         :  pObjetMembreLocal.adresse,
                                cp              :  pObjetMembreLocal.cp,
                                ville           :  pObjetMembreLocal.ville,
                                pays            :  pObjetMembreLocal.pays,
                                profil          :  pObjetMembreLocal.profil,
                                preference      :  pObjetMembreLocal.preference
                            }
                        },(error, document) => {
        
                        if (error) {
                            console.log('Erreur de upadte dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                            throw error;
                        }          
                        console.log('update ok');                               
                                            
                        let messageToSend = {
                            to       : emailSengrid,
                            from     : constMailFrom,
                            subject  : 'Informations de Profil',
                            html     : '<h1 style="color: black;">Hello '+pseudoSengrid+'</h1><p><h2>Votre fiche de renseignements de votre profil a bien été prise en compte sur notre site:<b>Adopte un Maître</b> </h2><br />' +
                                '<br /><i>Adopte un Maitre Team</i>',
                            }
                        sgMail.send(messageToSend);  // envoie du mail d'information maj profil
                        pWebSocketConnection.emit('mailSendInfoChangeProfil',this.membre);             
                    
                        pWebSocketConnection.emit('profileConnect', this.membre); // On envoie au client les données de profil du membre                         
                });  
            });
    };  

//************************************************************************************************************  
// Gestion et controle du formulaire de renseignements d'un membre modifié par un administrateur
// - verification des champs saisies 
// - Mise à jour des donnees du membre dans la collection membres de la BDD adopteunmaitre
//************************************************************************************************************ 
    MemberServer.prototype.miseAjourProfilMembreParAdmin= function(pObjetDunMembre, pWebSocketConnection, pSocketIo) {   
        console.log('pObjetDunMembre  avant MAJ de la collection membres',pObjetDunMembre); 
        if (!pObjetDunMembre.profil) {
            console.log("pObjetDunMembre profil inscription champs vide",pObjetDunMembre);
            let message = {};
            message.message = 'Vous devez renseigner votre profil, les autres champs ne sont pas obligatoires';
            return pWebSocketConnection.emit('messageErrorProfilInscription', message);
            
        } 
            this.DBMgr.colMembres.find({pseudo:pObjetDunMembre.pseudo}).toArray((error, documents) => {                     
                if (error) {
                    console.log('Erreur de find dans collection colMembres',error);
                    throw error;
                }                                
                if (!documents.length) { 
                    console.log('erreur avant mise à jour du membre on ne le retrouve pas on observe le  documents',documents);
                //    sendPage404(pObjetDunMembre, pWebSocketConnection); // on envoie au membre  qu'on rencontre un pb technique
                    return false;                     
                }  
                    console.log('documents avant MAJ profil inscription', documents);
                 
                    
                    // misa à jour de l'objet membre
                    this.membre.photoProfile   =  pObjetDunMembre.photoProfile;
                    this.membre.photoCover     =  pObjetDunMembre.photoCover;
                    this.membre.nom            =  pObjetDunMembre.nom; 
                    this.membre.prenom         =  pObjetDunMembre.prenom;
                    this.membre.genre          =  pObjetDunMembre.genre;
                    this.membre.age            =  pObjetDunMembre.age;
                    this.membre.telephone      =  pObjetDunMembre.telephone; 
                    this.membre.adresse        =  pObjetDunMembre.adresse;
                    this.membre.cp             =  pObjetDunMembre.cp;
                    this.membre.ville          =  pObjetDunMembre.ville;
                    this.membre.pays           =  pObjetDunMembre.pays;
                    this.membre.profil         =  pObjetDunMembre.profil;
                    this.membre.preference     =  pObjetDunMembre.preference;         
                
                    this.DBMgr.colMembres.updateOne(
                        {pseudo: pObjetDunMembre.pseudo},
                        {$set:
                            {   
                                photoProfile:  pObjetDunMembre.photoProfile,
                                photoCover  :  pObjetDunMembre.photoCover,
                                nom         :  pObjetDunMembre.nom, 
                                prenom      :  pObjetDunMembre.prenom,
                                genre       :  pObjetDunMembre.genre,
                                age         :  pObjetDunMembre.age,
                                telephone   :  pObjetDunMembre.telephone,  
                                adresse     :  pObjetDunMembre.adresse,
                                cp          :  pObjetDunMembre.cp,
                                ville       :  pObjetDunMembre.ville,
                                pays        :  pObjetDunMembre.pays,
                                profil      :  pObjetDunMembre.profil,
                                preference  :  pObjetDunMembre.preference
                            }
                        },(error, document) => {
        
                        if (error) {
                            console.log('Erreur de upadte dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                            throw error;
                        }          
                        console.log('update ok');                               
                                            
                        this.DBMgr.colMembres.find().toArray((error, documents) => {         // on récupere la liste de tous les membres car il y a eu des modifs
                            if (error) {
                                console.log('Erreur de find liste de tous les membres dans collection colMembres',error);
                                throw error;
                            }                                
                            if (!documents.length) { 
                                console.log('erreur la collection est vide',documents);
                            //    sendPage404(pObjetMembreLocal, pWebSocketConnection); // on envoie au membre  qu'on rencontre un pb technique
                                return false;                     
                            }  
                                console.log('documents apres suppression du membre', documents);
                                
                                pWebSocketConnection.emit('modifMembreParAdminOk',documents)  // On envoie au client que le membre a bien été modifié dans la BDD et la liste des membres mise à jour                      
                            });  
                     
                });  
            });
    };     
//************************************************************************************************************  
// Gestion de la liste de tous les membres pour les Administrateurs
// - récupération des données des membres dans la collection membres dans la BDD
// - envoie de la liste
//************************************************************************************************************ 
    MemberServer.prototype.sendListDesMembres = function(pDataAdmin, pWebSocketConnection, pSocketIo) {   
        console.log('pDataAdmin  avant MAJ de la collection membres',pDataAdmin); 
        if (pDataAdmin.statut == '0') {
            console.log("Ce n'est pas un administrateur --- pDataAdmin.statut:",pDataAdmin.statut);
            let message = {};
            message.message = "Vous n'êtes pas autorisés, seuls les administrateurs peuvent consulter les profils de tous les membres";
            return pWebSocketConnection.emit('messageNoAutorise', message.message);
            
        } 
            this.DBMgr.colMembres.find().toArray((error, documents) => {                     
                if (error) {
                    console.log('Erreur de find liste de tous les membres dans collection colMembres',error);
                    throw error;
                }                                
                if (!documents.length) { 
                    console.log('erreur la collection est vide',documents);
                //    sendPage404(pDataAdmin, pWebSocketConnection); // on envoie au membre  qu'on rencontre un pb technique
                    return false;                     
                }  
                    console.log('documents avant MAJ profil inscription', documents);
                
                
                    
                    pWebSocketConnection.emit('SendlisteDesMembres', documents); // On envoie au client qui est un administrateur la liste de données de tous les membres                         
                });  
    };

//************************************************************************************************************  
// Gestion de l'affichage des infos d'un membre demandé par un administrateur
// - récupération des donnees du membre dans la collection membres 
// - envoie des données au client
//************************************************************************************************************ 
MemberServer.prototype.sendInfoMurDunMembre = function(pPseudoDunMembre, pWebSocketConnection, pSocketIo) {   
    console.log('pPseudoDunMembre  avant Find dans la collection membres partie ADMIN',pPseudoDunMembre); 
  
    this.DBMgr.colMembres.find({pseudo:pPseudoDunMembre}).toArray((error, documents) => {                     
        if (error) {
            console.log('Erreur de find dans collection colMembres',error);
            throw error;
        }                                
        if (!documents.length) { 
            console.log('erreur avant traitement du membre on ne le retrouve pas on observe le  documents',documents);
        //    sendPage404(pObjetMembreLocal, pWebSocketConnection); // on envoie au membre  qu'on rencontre un pb technique
            return false;                     
        }  
            console.log("documents avant envoie des infos d'un memmbre partie ADMIN", documents);
            let infoMembre = documents[0];              // Récupération des données du membre dans l'objet infoMembre de stockage provisoire
        pWebSocketConnection.emit('infoDunMembre',infoMembre);   // On envoie au client les données de profil du membre      
    });       
};  

//************************************************************************************************************  
// Gestion de l'affichage des infos d'un membre demandé par un administrateur
// - récupération des donnees du membre dans la collection membres 
// - envoie des données au client
//************************************************************************************************************ 
MemberServer.prototype.supprimerUnMembre = function(pDataDunMembre, pWebSocketConnection, pSocketIo) {   
    console.log('pDataDunMembre  avant Find dans la collection membres partie ADMIN',pDataDunMembre); 
  
    this.DBMgr.colMembres.find({pseudo:pDataDunMembre.pseudo}).toArray((error, documents) => {                     
        if (error) {
            console.log('Erreur de find dans collection colMembres',error);
            throw error;
        }                                
        if (!documents.length) { 
            console.log('erreur avant traitement du membre on ne le retrouve pas on observe le  documents',documents);
        //    sendPage404(pObjetMembreLocal, pWebSocketConnection); // on envoie au membre  qu'on rencontre un pb technique
            return false;                     
        }  
        this.DBMgr.colMembres.remove ( { pseudo : pDataDunMembre.pseudo },(error, document) => {
            if (error) {
                console.log('Erreur de remove dans collection colMembres',error);
                throw error;
            }      
            console.log("suppression du membre ok");
            this.DBMgr.colMembres.find().toArray((error, documents) => {                     
                if (error) {
                    console.log('Erreur de find liste de tous les membres dans collection colMembres',error);
                    throw error;
                }                                
                if (!documents.length) { 
                    console.log('erreur la collection est vide',documents);
                //    sendPage404(pObjetMembreLocal, pWebSocketConnection); // on envoie au membre  qu'on rencontre un pb technique
                    return false;                     
                }  
                    console.log('documents apres suppression du membre', documents);
                    
                    pWebSocketConnection.emit('membreSupprimeOk',documents);  // On envoie au client que le membre a bien été supprimé dans la BDD et la liste des membres mise à jour                      
                });  
            
        });
        
    });       
};  

//************************************************************************************************************
// Obtention du nombre de messages publiés dans  la BDD et transmission de celles-ci à tout le monde
//************************************************************************************************************
 //   MemberServer.prototype.getNbMessages = function(pSocketIo) {
//        let colNbMessages = client.db('adopteunmaitre').collection('messages');           
//        colNbMessages.count((error, data) => {
///            if (error){
//                console.log('Erreur de comptage dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
//            }
//            pSocketIo.emit('nbMessages', data);     
//                        
//        });   
//    }; 


// ***********************************************************************************************************  
// Gestion de la deconnexion des visiteurs et des membres 
// Deconnexion d'un visiteur et eventuellement d'un membre  :
// ***********************************************************************************************************
    MemberServer.prototype.disconnectMember = function(pWebSocketConnection, pSocketIo){
        let myIndex = this.searchMemberInTableOfMembers('idMember' ,pWebSocketConnection.id);

        if (this.objetPopulation.membres[myIndex].isMember){                    // Le visiteur qui se deconnecte était un membre
            this.objetPopulation.nbrMembersInSession--;                         // Nombre de visiteurs incluant les [membres + Admins]
            
            if (this.objetPopulation.membres[myIndex].role < cstMembre){    // Il s'agit obligatoiremennt d'un Admin ou Super-Admin
            this.objetPopulation.nbrAdminsInSessions--;  // Si le memnbre est un Admin, on retire 1 aux nombre d'Admin connectés
            }
        }

        this.objetPopulation.membres.splice(myIndex, 1);
        this.objetPopulation.nbrConnections--;
        this.UpdateDisplayPopulation(pSocketIo);
    };

//***********************************************************************************************************  
// Obtention du nombre de messages publiés dans la BDD et transmission de celles-ci à tout le monde
// - si ne ramène rien on initialise à 0
// - sinon on  met à jour le nombre de messages publics publies
// ***********************************************************************************************************
    MemberServer.prototype.getNbMessages = function(pSocketIo){
        this.DBMgr.colMessages.find()
        .limit(1)
        .toArray((error, documents) => {
            if (error) {
                console.log('Erreur de lecture dans la collection \'messages\' : ',error);   // Si erreur technique... Message et Plantage
                throw error;
            }

            if (documents.length) {
                this.nbMessagesPublic = documents[0].nbMessagesPublic;                    
            } else {
                this.nbMessagesPublic = 0;
            }
            console.log('this.nbMessagesPublic',this.nbMessagesPublic);
    
            this.objetPopulation.nbrConnections = 0;
            this.objetPopulation.nbrMembersInSession = 0;
            this.objetPopulation.nbrAdminsInSessions = 0;
        });
    }
// ------------------------------------------- Fin du module -------------------------------------------------------------------------

}