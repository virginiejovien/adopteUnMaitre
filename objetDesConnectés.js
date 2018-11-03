//Voici mon objet general de contenu de population
//Regarder en particulier la propriété "vMembers" :
let objectPopulation = 
{
    vMembers : {},                          // On définit un objet vide pour accueillir les membres en nombre indéfini.
    vNbrMembersInSession : 0,               // Nombre de membres connectés 
    vNbrConnectionsAlive : 0,               // Nombre total de connexions en cours sur ce serveur     !!! ATTENTION !!! Il ne's'agit pas encore de membres valides , juste de visiteurs
}

//Et voici comment je l'utilise (inspiré de l'exmple 5 ddu cours WebSocket) :
this.objectMember.id = Math.round(Math.random() * 10000) + (new Date()).getTime();
pObjectPopulation.vMembers[this.objectMember.id] = this.objectMember;  // On ajoute le membre qu'on vient de lire pour cette connexion dans un objet qui les recense

 // ---------------------------------------------------------------------------------------------------------------------------
    // Vérification des données du visiteur (Pseudo + MDP) :
    // On cherche la combinaison Pseudo et MDP
    // - Si la combinaison n'existe pas --> Rejet de la demande Login ('retryLoginForm')
    // - Par contre, si elle existe, on demande au client de désactiver l'icône de Login et d'activer l'icône de déconnexion ('disableConnectBtn')
    // ---------------------------------------------------------------------------------------------------------------------------
    MemberServer.prototype.checkVisitorIsMember = async (pVisiteurLoginData, pObjectPopulation, pWebSocketConnection) => {
        let promiseResult = await this.checkVisitorIsMemberPromise(pVisiteurLoginData, pObjectPopulation, pWebSocketConnection);
        return promiseResult;
    };

    MemberServer.prototype.checkVisitorIsMemberPromise = (pVisiteurLoginData, pObjectPopulation, pWebSocketConnection) => {
        return new Promise((resolve, reject) => {
            this.DBMgr.memberCollection.find(
                { 
                    "pseudo": pVisiteurLoginData.pseudo, 
                    "password": pVisiteurLoginData.password, 
                },)
                .limit(1)
                .toArray((error, documents) => {
                    if (error) {
                        reject(error);
                        console.log('Erreur de lecture dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                        throw error;
                    }

                    resolve(pObjectPopulation);
                    if (!documents.length){
                        pWebSocketConnection.emit('retryLoginForm');                  //  Le login est erroné et n a pas ete trouvé dans la BDD, et la tentative de connexion est refusée
                    } else {
                        pWebSocketConnection.emit('disableConnectBtn');               // Le visiteur est bien un membre, on l'ajoute à la liste des membres
                        this.objectMember.email = documents[0].email;                                        
                        this.objectMember.pseudo = documents[0].pseudo;                                        
                        this.objectMember.password = documents[0].password;
                        this.objectMember.role =  documents[0].role;                                       
                        this.objectMember.dateCreation = documents[0].dateCreation;                                      
                
                        this.objectMember.id = Math.round(Math.random() * 10000) + (new Date()).getTime();
                        pObjectPopulation.vMembers[this.objectMember.id] = this.objectMember;  // On ajoute le membre qu'on vient de lire pour cette connexion dans un objet qui les recense
                        pObjectPopulation.vNbrMembersInSession++;
                    }
                });
        });
    };   
    
    
    // en local 
    module.exports = function MemberServer(pDBMgr){   // Fonction constructeur exportée
        this.DBMgr = pDBMgr;
        this.members;
        this.nbrMembersInSession;
    
        this.objectMember =                          // Structure du membre
        {   
            id              : -1,                    // Id du membre connecté
            email           : '',
            pseudo          : '',
            password        : '',
            role            : 0,                     // Membre, Admin ou SuperAdmin
            dateCreation    : -1,                    // Timestamp de la création du record
        }

        //
    webSocketConnection.on('disconnect', function() {
            objectPopulation.vNbrConnectionsAlive--;
    
            if (vMemberServer.objectMember.id){                                     // Le visiteur qui se deconnecte était un membre
                objectPopulation.vNbrMembersInSession--;                            // Nombre de visiteurs incluant les [membres + Admins]
                delete objectPopulation.vMembers[vMemberServer.objectMember.id];    // Suppression du membre de la liste des membres connectés
    };