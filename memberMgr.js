
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
//     Objet : MemberServer                                                                           ************                                                                                                                                       ************                                      //     Cet objet sert à gérer :                                                                       ************
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

const cstSuperAdmin = 2;    // Statut définissant le Super-Admin - Il n'y a qu'un seul SuperAdmin  pseudo = TEAMxxxxADMIN0  statut:2
const cstAdmin = 1;         // Statut définissant les Admin standards (Qui peuvent accéder à la console d'administration (avec le SuperAdmin))
                            // pseudo qui commence par  TEAMxxxxADMIN suivi d'un nombre ces admnistrateurs ont le code  statut = 1 
const cstMembre = 0;        // Membre standard qui ne peut qu'utiliser la partie publique de l'application statut = 0
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
            amis            :[],            // liste d'amis
            alerte          :[]             // tableau des messages d'alerte                              
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
            preference          : '',           // preferences            
            amis                :[],            // liste d'amis                             
            alerte              :[]             // tableau des messages d'alerte                         
        }


        this.objetPopulation.membres.push(objetMembreLocal);
        console.log('this.objetPopulation',this.objetPopulation);
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
                    console.log('this.objetPopulation apres rajout this.membre',this.objetPopulation);
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
            preference      : '',           // preferences            
            amis            :[],            // liste d'amis
            alerte          :[]             // tableau des messages d'alerte    
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

            this.DBMgr.colMembres.createIndex( { pseudo:"text", nom: "text", prenom: "text"}); //creation d'un index pour permettre la recherche de texte dans les champs nom prenom et pseudo

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
            pWebSocketConnection.emit('profileInscription', objetMembreLocal); // On envoie au client ses données de profil 
            pWebSocketConnection.emit('felicitationMembre',objetMembreLocal);  // on envoie une demande de félicitation
                
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
                
                let objetMembreLocal = {
                    pseudo          : documents[0].pseudo,
                    email           : documents[0].email,                                    
                    mp              : mpNew,
                    mpConfirme      : mpNew,          
                    mpProvisoire    : mpNew, 
                    statut          : documents[0].statut,        // Membre 0, Admin 1 ou SuperAdmin 2                
                    dateCreation    : documents[0].dateCreation,       // Timestamp de la création du membre                    
                    photoProfile    : documents[0].photoProfile,
                    photoCover      : documents[0].photoCover,
                    nom             : documents[0].nom,
                    prenom          : documents[0].prenom,
                    age             : documents[0].age,
                    genre           : documents[0].genre,            // femme (F)  ou homme(H)
                    telephone       : documents[0].telephone,      
                    adresse         : documents[0].adresse, 
                    cp              : documents[0].cp,           // code postal
                    ville           : documents[0].ville,           // ville 
                    pays            : documents[0].pays,           // pays
                    profil          : documents[0].profil,           // est proprietaire ou souhaite adopté ou neutre           
                    preference      : documents[0].preference,           // preferences            
                    amis            : documents[0].amis,            // liste d'amis
                    alerte          : documents[0].alerte            // tableau des messages d'alerte    
                }
                console.log("pObjetMembreLocalMotDePasse.mpProvisoire et pDocumentsmpProvisoire true",pObjetMembreLocalMotDePasse.mpProvisoire);       
                this.DBMgr.colMembres.updateOne(
                    {pseudo:    pObjetMembreLocalMotDePasse.pseudo},
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
                    pWebSocketConnection.emit('mailSendInfoChangeMp',objetMembreLocal);               
                
                    pWebSocketConnection.emit('sendFormulaireConnexion',objetMembreLocal); // On envoie au client les données de profil du membre                         
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
            
            let objetMembreLocal = {
                pseudo          : documents[0].pseudo,
                email           : documents[0].email,                                    
                mp              : mpNew,
                mpConfirme      : mpNew,          
                mpProvisoire    : mpNew, 
                statut          : documents[0].statut,        // Membre 0, Admin 1 ou SuperAdmin 2                
                dateCreation    : documents[0].dateCreation,       // Timestamp de la création du membre                    
                photoProfile    : documents[0].photoProfile,
                photoCover      : documents[0].photoCover,
                nom             : documents[0].nom,
                prenom          : documents[0].prenom,
                age             : documents[0].age,
                genre           : documents[0].genre,            // femme (F)  ou homme(H)
                telephone       : documents[0].telephone,      
                adresse         : documents[0].adresse, 
                cp              : documents[0].cp,           // code postal
                ville           : documents[0].ville,           // ville 
                pays            : documents[0].pays,           // pays
                profil          : documents[0].profil,           // est proprietaire ou souhaite adopté ou neutre           
                preference      : documents[0].preference,           // preferences            
                amis            : documents[0].amis,            // liste d'amis
                alerte          : documents[0].alerte            // tableau des messages d'alerte    
            }
            console.log("pObjetMembreLocalMotDePasse.mpProvisoire et pDocumentsmpProvisoire true",pObjetMembreLocalMotDePasse.mp);       
            this.DBMgr.colMembres.updateOne(        // misa à jour du nouveau mots de passe
                {pseudo:    documents[0].pseudo},
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
                pWebSocketConnection.emit('mailSendInfoParametreMp',objetMembreLocal);    
                pWebSocketConnection.emit('profileConnect', objetMembreLocal); // On envoie au client les données de profil du membre  pour parer à toutes invitations d'amis            
                                
        });  
    });
};


//************************************************************************************************************  
// Gestion de l'affichage de la fenetre des infos d'un ami confirmé
// - récupération des donnees du membre dans la collection membres 
// - envoie des données au client au membre 
//************************************************************************************************************ 
    MemberServer.prototype.sendInfoMurAmi = function(pPseudoDunMembre, pObjetDuMembre, pWebSocketConnection, pSocketIo) {   
        console.log('pPseudoDunMembre  avant Find dans la collection membres partie info Amis',pPseudoDunMembre); 

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
                console.log("documents avant envoie des infos d'un memmbre partie info Amis", documents);
                let infoMembre = documents[0];              // Récupération des données du membre dans l'objet infoMembre de stockage provisoire
            pWebSocketConnection.emit('infoMembreAmi',infoMembre);   // On envoie au client les données de profil d'un ami    
            pWebSocketConnection.emit('infoMembreAmiConfirme',infoMembre);   // On envoie au client les données de profil d'un ami    
        });       
    };  

    
//************************************************************************************************************  
// Gestion de l'affichage de la fenetre des infos d'un ami en attente de confirmation
// - récupération des donnees du membre dans la collection membres 
// - envoie des données au client au membre 
//************************************************************************************************************ 
    MemberServer.prototype.sendInfoMurAmiAttente = function(pPseudoDunMembre, pObjetDuMembre, pWebSocketConnection, pSocketIo) {   
        console.log('pPseudoDunMembre  avant Find dans la collection membres partie info Amis',pPseudoDunMembre); 

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
                console.log("documents avant envoie des infos d'un memmbre partie info Amis", documents);
                let infoMembre = documents[0];              // Récupération des données du membre dans l'objet infoMembre de stockage provisoire
            pWebSocketConnection.emit('infoMembreAmi',infoMembre);   // On envoie au client les données de profil d'un ami    
            pWebSocketConnection.emit('infoMembreAmiAttente',infoMembre);   // On envoie au client les données de profil d'un ami    
        });       
    };  
    
//************************************************************************************************************  
// Gestion membre accepté sur une liste d'amis
// - le membre receveur est ajouté à la liste d'amis : statut confirmé pour le membre demandeur
// - le membre demandeur est ajouté à la liste d'amis : statut confirmé pour le membre receveur                    
//************************************************************************************************************ 
    MemberServer.prototype.invitationAccepte= function(pObjetDunMembre, pObjetDuMembre, pWebSocketConnection, pSocketIo) {   
        console.log('pObjetDunMembre  avant MAJ de la collection membres',pObjetDunMembre); 
        console.log('pObjetDuMembre  avant MAJ de la collection membres',pObjetDuMembre); 

        // mise à jour de l'objet membre demandeur
        //statut  = confirme

        this.DBMgr.colMembres.updateOne (
            {
                pseudo:pObjetDunMembre.pseudo,      // membre demandeur
            
                amis:   { $elemMatch :               // 2ème opérateur: on sélectionne le membre receveur dans la liste des amis  
                        {pseudo:pObjetDuMembre.pseudo}
                    }
            },
            {   $set:   {   "amis.$.statut":"C"
                    }
            },(error, document) => {

            if (error) {
                console.log('Erreur de upadte dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                throw error;
            }          
            
            console.log('update ok dans le document du membre demandeur ');
        
        }); 

        let dataAlerte =    {};
        dataAlerte.indicateur   = true; // indicateur d'alerte pour affichager le  message qui indique que le membre a accepté l'invitation
        dataAlerte.pseudo       =  pObjetDuMembre.pseudo;   
        dataAlerte.message      = "a accepté votre invitation !";  // on ne veut afficher ce message qu'une seule fois

        this.DBMgr.colMembres.updateOne (
            {pseudo: pObjetDunMembre.pseudo},
            {$push:{alerte: dataAlerte }},(error, document) => {

            if (error) {
                console.log('Erreur de upadte dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                throw error;
            }          
            
            console.log("update ok du message d'alerte dans le document du membre demandeur ");
        
        }); 

        
        // mise à jour du membre receveur
        //statut  = confirme
        
        this.DBMgr.colMembres.updateOne (
            {
                pseudo:pObjetDuMembre.pseudo,        // membre receveur
                amis: { $elemMatch :                // 2ème opérateur: on sélectionne le membre demandeur dans la liste des amis  
                    {pseudo:pObjetDunMembre.pseudo}
                }
            },

                {$set:{ "amis.$.statut":"C" }
            
            },(error, document) => {

            if (error) {
                console.log('Erreur de upadte dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                throw error;
            }          
            
            console.log('update ok dans le document du membre demandeur ');

            this.DBMgr.colMembres.find(  // on récupérère le document du membre receveur mis à jour 
                {
                    pseudo:pObjetDuMembre.pseudo,
                
                    amis: { $elemMatch :                // 2ème opérateur: on sélectionne le membre demandeur dans la liste des amis  
                            {pseudo:pObjetDunMembre.pseudo}
                        }
                }
                                    
                ).toArray((error, documents) => {                     
                if (error) {
                    console.log('Erreur de find dans collection colMembres',error);
                    throw error;
                }                                
                if (!documents.length) { 
                    console.log('erreur find du membre on ne retrouve pas le membre demandeur on observe le  documents',documents);
                
                    return false;                     
                }  
                let infoMembre = documents[0];              // Récupération des données du membre dans l'objet infoMembre de stockage provisoire
                pWebSocketConnection.emit('sendAmiConfirme',infoMembre);    // on renvoie au client la confirmation et les donnees du membre mise à jour
            }); 
        }); 
    }; 

//************************************************************************************************************  
// Gestion membre refuse une invitation une liste d'amis
// - le membre receveur est retiré de la liste d'amis du membre demandeur
// - le membre demandeur est retiré de la liste d'amis du membre receveur                 
//************************************************************************************************************ 
    MemberServer.prototype.invitationRefuse= function(pObjetDunMembre, pObjetDuMembre, pWebSocketConnection, pSocketIo) {   
        console.log('pObjetDunMembre  avant MAJ de la collection membres',pObjetDunMembre); 
        console.log('pObjetDuMembre  avant MAJ de la collection membres',pObjetDuMembre); 

        // mise à jour de l'objet membre demandeur
        //on supprime le membre receveur de la liste d'amis

        this.DBMgr.colMembres.updateOne (
            {
                pseudo:pObjetDunMembre.pseudo,  // membre demande
            },
            {   
                $pull:{amis:{pseudo:pObjetDuMembre.pseudo}}  // on supprime le membre receveur dans la liste des amis 

            },(error, document) => {

            if (error) {
                console.log('Erreur de upadte dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                throw error;
            }          
            
            console.log('pull ok dans le document du membre demandeur ');
        
        }); 

        let dataAlerte =    {};
        dataAlerte.indicateur   = true; // indicateur d'alerte pour affichager le  message qui indique que le membre a refusé l'invitation
        dataAlerte.pseudo       =  pObjetDuMembre.pseudo;   
        dataAlerte.message      = "a refusé votre invitation !";  // on ne veut afficher ce message qu'une seule fois

        this.DBMgr.colMembres.updateOne (
            {pseudo: pObjetDunMembre.pseudo},
            {$push:{alerte: dataAlerte }},(error, document) => {

            if (error) {
                console.log('Erreur de upadte dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                throw error;
            }          
            
            console.log("update ok du message d'alerte refus dans le document du membre demandeur ");
        
        }); 

        
        // mise à jour de l'objet membre receveur
        //on supprime le membre demandeur de la liste d'amis
        
        this.DBMgr.colMembres.updateOne (
            {
                pseudo:pObjetDuMembre.pseudo,       // membre receveur
            },
            {   
                $pull:{amis:{pseudo:pObjetDunMembre.pseudo}}  // on supprime le membre demandeur dans la liste des amis

            },(error, document) => {  

            if (error) {
                console.log('Erreur de upadte dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                throw error;
            }          
            
            console.log('pull ok dans le document du membre receveur');

            this.DBMgr.colMembres.find(  // on récupérère le document du membre receveur mis à jour 
                {
                    pseudo:pObjetDuMembre.pseudo,           
                }
                                    
                ).toArray((error, documents) => {                     
                if (error) {
                    console.log('Erreur de find dans collection colMembres',error);
                    throw error;
                }                                
                if (!documents.length) { 
                    console.log('erreur find du membre on ne retrouve pas le membre demandeur on observe le  documents',documents);
                
                    return false;                     
                }  
                let infoMembre = documents[0];              // Récupération des données du membre dans l'objet infoMembre de stockage provisoire
                pWebSocketConnection.emit('sendAmiRefuse',infoMembre);   // on renvoie au client qu'on apris en compte son refus et les donnees du membre mise à jour
            }); 
        }); 
    }; 

//************************************************************************************************************  
// Gestion message d'alerte affiché
// - le membre a reçut la fenetre de message d'alerte lui indiquant qu'un membre a accepté son invitation
// - mettre l'indicateur de message d'alerte à false                 
//************************************************************************************************************ 
    MemberServer.prototype.modifIndicateurAlerte = function(pAlerte, pObjetDuMembre, pWebSocketConnection, pSocketIo) {   
        console.log('pObjetDunMembre  avant MAJ de la collection membres pour indicateur alerte message',pAlerte); 
        console.log('pObjetDuMembre  avant MAJ de la collection membres pour indicateur alerte message',pObjetDuMembre); 
        
            // mise à jour de l'objet membre 
            //alerte.indicateur = false

        this.DBMgr.colMembres.updateOne (
            {
                pseudo:pObjetDuMembre.pseudo,
                alerte: { $elemMatch :             // 2ème opérateur: on se place dans l'alerte correspondant au pseudo qui a accepté l'invitation  
                        {pseudo:pAlerte.pseudo}
                    }
            },
            {   $set:{ 
                "alerte.$.indicateur":false  // on met l'indicateur à false l'alerte vient d'être affichée
                    }
            },(error, document) => {

            if (error) {
                console.log('Erreur de upadte dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                throw error;
            }          
            console.log('update ok dans le document du membre indicateur alerte a été mis à false ');
        }); 
    }; 

//************************************************************************************************************  
// recommandation d'un ami à un ami selectionné dans la liste d'amis confirmés
// - mise à jour des du membre (receveur de la recommandation) dans le collection membres :
//      on rajoute les donnees de l'ami recommandé et le pseudo de celui qui est à l'origine de la recommandation 
//          dans l'objet amis avec statut =  "R" (Recommandé) et le pseudo à l'origine de la recommandation 
//      - envoie d'un mail au membre qui reçoit la recommandation
// - envoie d'un message au membre à l'origine de la recommandation
//************************************************************************************************************ 

    MemberServer.prototype.gestionRecommandation= function(pPseudoAmi, pObjetDunMembre, pObjetDuMembre, pWebSocketConnection, pSocketIo) {   
        console.log('pObjetDuMembre  avant MAJ de la collection membres',pObjetDuMembre); 
        console.log('pObjetDunMembre  avant MAJ de la collection membres',pObjetDunMembre); 
        console.log('pPseudoAmi  avant MAJ de la collection membres',pPseudoAmi); 

      

        this.DBMgr.colMembres.find(                         // on récupère les données du membre à qui souhaite recommander et ajouter un membre à sa liste d'amis
            {  pseudo: pPseudoAmi
                } 
                                
            ).toArray((error, documents) => {    
            if (error) {
                console.log('Erreur de find dans collection colMembres',error);
                throw error;
            }                                
            if (!documents.length) { 
                console.log("on n'a trouvé le membre --  documents:",documents);

                return false;                     
            }  

            // mise à jour du membre qu'on recommande
            let dataAmiReceveur = {};          //on prépare les données du membre qui a reçu la recommandation  pour les inserer dans le document du membre qu'on recommande
            dataAmiReceveur.pseudo        = documents[0].pseudo; // pseudo du membre qu'on souhaite rajouter dans sa liste d'amis (receveur)
            dataAmiReceveur.statut        = "I"; // statut invitation en cours 
            dataAmiReceveur.nom           = documents[0].nom; 
            dataAmiReceveur.prenom        = documents[0].prenom;
            dataAmiReceveur.photoProfile  = documents[0].photoProfile;
            console.log('dataAmiReceveur',dataAmiReceveur);

            this.DBMgr.colMembres.updateOne (
                {pseudo: pObjetDunMembre.pseudo},
                {$push:{amis: dataAmiReceveur }},(error, document) => {

                if (error) {
                    console.log('Erreur de upadte dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                    throw error;
                }          
                
                console.log('update ok dans le document du membre qui a été recommandé on observe le documents:', documents);
            
            }); 

            console.log('documents apres find ami à qui on souhaite ajouter et recommander un ami',documents);
            let sengridEmail = documents[0].email; // adresse mail du membre receveur de la recommandation

            // mise à jour du membre qui reçoit la recommandation
            let dataAmiRecommande = {};  //on prépare les données du membre qu'on recommande pour les inserer dans le document du membre qui reçoit la recommandation
            dataAmiRecommande.pseudo        = pObjetDunMembre.pseudo; // pseudo du membre qu'on recommande
            dataAmiRecommande.statut        = "R"; // statut Recommandé
            dataAmiRecommande.origine       = pObjetDuMembre.pseudo; // pseudo du membre à l'origine de la recommandation
            dataAmiRecommande.nom           = pObjetDunMembre.nom; 
            dataAmiRecommande.prenom        = pObjetDunMembre.prenom;
            dataAmiRecommande.photoProfile  = pObjetDunMembre.photoProfile;
            console.log('dataAmiRecommande',dataAmiRecommande);

            this.DBMgr.colMembres.updateOne (
                {pseudo: pPseudoAmi},
                {$push:{amis: dataAmiRecommande }},(error, document) => {

                if (error) {
                    console.log('Erreur de upadte dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                    throw error;
                }          
                console.log('update ok dans rajout recommandation ami');            
                console.log('update ok dans le document du membre receveur de la recommandation on observe le documents:', documents);
                let pseudoSengrid = pPseudoAmi;
                let messageToSend = {  // on envoie un mail au membre receveur pour lui signaler l'invitation 
                    to       : sengridEmail,
                    from     : constMailFrom,
                    subject  : "Recommandation d'amis",
                    html     : '<h1 style="color: black;">Bonjour '+pseudoSengrid+"</h1><p><h2> <b>" +pObjetDuMembre.pseudo+ "</b></h2><h3> vous recommande un ami, consultez vite votre profil pour connaitre ce nouvel ami<b>Adopte un Maître</b> </h3><br />" +
                        '<br /><i>Adopte un Maitre Team</i>',
                    }
                    
                sgMail.send(messageToSend);     // envoie du mail d'information demande d'invitation
                pWebSocketConnection.emit('profileConnect', pObjetDuMembre); // On envoie au client les données de profil du membre  pour parer à toutes invitations d'amis en temps réel   
                pWebSocketConnection.emit('recommandationAmiOk',pObjetDuMembre);  // envoie au membre que la recommandation à bien été envoyé            
            
            }); 
        }); 
    };  

//************************************************************************************************************  
// Gestion et controle du formulaire d'inscription Profil
// - verification des champs saisies 
// - Mise à jour des donnees du membre dans la collection membres de la BDD adopteunmaitre
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
                        pWebSocketConnection.emit('mailSendInfoChangeProfil',pObjetMembreLocal);             
                    
                        pWebSocketConnection.emit('profileConnect', pObjetMembreLocal); // On envoie au client les données de profil du membre pour prendre en compte les modifs et demande d'amis eventuelles                        
                });  
            });
    };  

//************************************************************************************************************  
// Gestion de la liste de tous les membres pour la recherche d'amis
// - récupération des données des membres dans la collection membres dans la BDD
// - envoie de la liste
//************************************************************************************************************ 
    MemberServer.prototype.sendListeDeTousLesMembres = function(pWebSocketConnection, pSocketIo) {   
    
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
        
                pWebSocketConnection.emit('SendlisteDeTousLesMembres', documents); // On envoie au client la liste de données de tous les membres pour la recherche d'amis                       
        });  
    };

//************************************************************************************************************  
// Gestion et controle du formulaire de recherche de membres
// - verification des champs saisies 
// - recherches par criteres : 
//          - searchTerm (pseudo et ou nom et ou prénom)
//          - la liste ne doit afficher que les membres qui n'appartienne pas à la liste d'amis
//          - et qui n'ont pas récu d'invitation
//************************************************************************************************************ 
    MemberServer.prototype.rechercheMembres = function(pData, pObjetDuMembre, pWebSocketConnection, pSocketIo) {   
        console.log('pData avant recherche de la collection membres',pData); 
        console.log('pObjetDuMembre.pseudo avant recherche',pObjetDuMembre.pseudo);
        let objetResultatRecherche = [];
        let searchTerm = pData.nom + " " +  pData.prenom + " " + pData.pseudo;
        console.log("searchTerm",searchTerm);
        
        this.DBMgr.colMembres.aggregate(
            [
                { $match: { $text: { $search: searchTerm  } } },     // opérateur de recherche de texte : searchTerm (pseudo et ou nom et ou prénom) 
                { $match: { pseudo:{ $ne:pObjetDuMembre.pseudo}}}       // opérateur pour ne pas que le membre demandeur apparaisse dans la liste d'ami
            ]
        
    
        ).toArray((error, documents) => {     

            if (error) {
                console.log('Erreur de find dans collection colMembres',error);
                throw error;
            }                                
            if (!documents.length) { 
                console.log('on a pas trouvé de membre la recherche ne retourne rien --  documents:',documents);
                pWebSocketConnection.emit('resultatRecherche', documents); // On envoie au client les resultats de la recherche de membres 
                return false;                     
            }  
                console.log('la recherche retourne des membres on observe le documents:', documents);
            
                let dataResultat = documents;                               

                for(let i = 0; i < dataResultat.length; i++) {    // on va exclure dans ce premier résultat de recherche de membres, les membres qui sont déjà les amis du membre demamdeur
                    console.log('dataResultat[i]',dataResultat[i]);
                    console.log('dataResultat[i].pseudo',dataResultat[i].pseudo);
                    this.DBMgr.colMembres.find({
                        
                        pseudo :pObjetDuMembre.pseudo ,        // 1er opérateur: on veut se plasser dans le document du membre demandeur 
                        amis: { $elemMatch :                // 2ème opérateur: on regarde si l'ami est déja dans la liste des amis du membre demandeur    

                        {pseudo:dataResultat[i].pseudo}
                            }
                        },
                            
                        {"amis.pseudo":1, "amis.nom":1}
                                            
                        ).toArray((error, documents) => {    
                        if (error) {
                            console.log('Erreur de find dans collection colMembres',error);
                            throw error;
                        }  

                        if (documents.length) {  // on ne veut pas de ce membre dans la liste d'amis car il est déjà dans la liste d'amis du membre demandeur
                            console.log('on a trouvé ce membre dans la recherche on ne veut pas de lui documents:',documents);
                            let objetVide ={}
                            pWebSocketConnection.emit('resultatRecherche', objetVide); // On envoie au client les resultats de la recherche de membres
                        }  else { 
                            console.log('on ne trouve pas ce membre dans notre liste on observe documents:', documents);
                            console.log(dataResultat[i]);  // l'ami n'est pas dans la liste du membre demandeur on le plasse dans la liste
                            objetResultatRecherche.push(dataResultat[i]);
                            console.log('objetResultatRecherche',objetResultatRecherche);
                            pWebSocketConnection.emit('resultatRecherche', objetResultatRecherche); // On envoie au client les resultats de la recherche de membres  
                            
                        }
                    });
                    
                }
        
        });  
    };  

//************************************************************************************************************  
// rajout d'un membre selectionné dans la liste d'amis
// - mise à jour des deux membres (demandeur et receveur) dans le collection membres 
// - membre qui invite: 
//      on rajoute les donnees de l'ami receveur dans l'objet amis avec statut =  "I" (invitation en cours )
// - membre qui reçoit l'invitation (receveur): 
//      on rajoute les donnees de l'ami demandeur dans l'objet amis avec statut = "A" (en attente de confirmation)
// - envoie d'un mail aux deux membres
//************************************************************************************************************ 
    MemberServer.prototype.demandeRajoutListeAmi= function(pPseudoAmi, pObjetDuMembre, pWebSocketConnection, pSocketIo) {   
        console.log('pObjetDuMembre  avant MAJ de la collection membres',pObjetDuMembre); 
        console.log('pPseudoAmi  avant MAJ de la collection membres',pPseudoAmi); 
        this.DBMgr.colMembres.find(                         // on récupère les données du membre qu'on souhaite ajouter à sa liste d'amis
            {  pseudo: pPseudoAmi
                } 
                                
            ).toArray((error, documents) => {    
            if (error) {
                console.log('Erreur de find dans collection colMembres',error);
                throw error;
            }                                
            if (!documents.length) { 
                console.log("on n'a trouvé le membre --  documents:",documents);
    
                return false;                     
            }  

            console.log('documents apres find ami',documents);
            let sengridEmail = documents[0].email; // adresse mail du membre receveur
            // mise à jour du membre qui invite Demandeur
            let dataAmiReceveur = {}; //on prépare les données du membre receveur pour les inserer dans le document du membre qui demande (demandeur)
            dataAmiReceveur.pseudo        = documents[0].pseudo; // pseudo du membre qu'on souhaite rajouter dans sa liste d'amis (receveur)
            dataAmiReceveur.statut        = "I"; // statut invitation en cours 
            dataAmiReceveur.nom           = documents[0].nom; 
            dataAmiReceveur.prenom        = documents[0].prenom;
            dataAmiReceveur.photoProfile  = documents[0].photoProfile;
            console.log('dataAmiReceveur',dataAmiReceveur);
        
            this.DBMgr.colMembres.updateOne (
                {pseudo: pObjetDuMembre.pseudo},
                {$push:{amis: dataAmiReceveur }},(error, document) => {

                if (error) {
                    console.log('Erreur de upadte dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                    throw error;
                }          
                
                console.log('update ok dans le document du membre demandeur on observe le documents:', documents);
            
            }); 


            // mise à jour du membre qui reçoit l'invitation
            let dataAmiDemande = {};  //on prépare les données du membre demandeur pour les inserer dans le document du membre qui reçoit l'invitation (receveur)
            dataAmiDemande.pseudo        = pObjetDuMembre.pseudo; // pseudo du membre qui nous a envoyé l'invitation (demandeur)
            dataAmiDemande.statut        = "A"; // statut en attente de confirmation 
            dataAmiDemande.nom           = pObjetDuMembre.nom; 
            dataAmiDemande.prenom        = pObjetDuMembre.prenom;
            dataAmiDemande.photoProfile  = pObjetDuMembre.photoProfile;
            console.log('dataAmiAmiDemande',dataAmiDemande);

            this.DBMgr.colMembres.updateOne (
                {pseudo: pPseudoAmi},
                {$push:{amis: dataAmiDemande }},(error, document) => {

                if (error) {
                    console.log('Erreur de upadte dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                    throw error;
                }          
                console.log('update ok dans rajout ami');            
                console.log('update ok dans le document du membre receveur on observe le documents:', documents);
                let pseudoSengrid = dataAmiReceveur.pseudo;
                let messageToSend = {  // on envoie un mail au membre receveur pour lui signaler l'invitation 
                    to       : sengridEmail,
                    from     : constMailFrom,
                    subject  : "Demande d'invitation",
                    html     : '<h1 style="color: black;">Bonjour '+pseudoSengrid+"</h1><p><h2> <b>" +pObjetDuMembre.pseudo+ "</b></h2><h3> souhaite vous inviter à rejoindre sa liste d'amis sur :<b>Adopte un Maître</b> </h3><br />" +
                        '<br /><i>Adopte un Maitre Team</i>',
                    }
                    
                sgMail.send(messageToSend);     // envoie du mail d'information demande d'invitation
                pWebSocketConnection.emit('profileConnect', pObjetDuMembre); // On envoie au client les données de profil du membre  pour parer à toutes invitations d'amis en temps réel   
                pWebSocketConnection.emit('invitationDemandeAmiOk',pObjetDuMembre);  // envoie au membre que l'invitation à bien été envoyé            
            
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