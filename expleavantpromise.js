// ---------------------------------------------------------------------------------------------------------------------------
    // Vérification des données du visiteur (Pseudo + MDP) :
    // On cherche la combinaison Pseudo et MDP
    // - Si la combinaison n'existe pas --> Rejet de la demande Login ('retryLoginForm')
    // - Par contre, si elle existe, on demande au client de désactiver l'icône de Login et d'activer l'icône de déconnexion ('disableConnectBtn')
    // ---------------------------------------------------------------------------------------------------------------------------
 MemberServer.prototype.checkVisitorIsMember = function(pVisiteurLoginData, pObjectPopulation, pWebSocketConnection){
    this.DBMgr.memberCollection.find(
         { 
            "pseudo": pVisiteurLoginData.pseudo, 
            "password": pVisiteurLoginData.password, 
       },
         ).toArray((error, documents) => {
            if (error) {
                console.log('Erreur de lecture dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
               throw error
            } 
            
           if (!documents.length){
                pWebSocketConnection.emit('retryLoginForm');              //  Le login est erroné et n a pas ete trouvé dans la BDD, et la tentative de connexion est refusée
                return false
            } 
                    
            pWebSocketConnection.emit('disableConnectBtn');               // Le visiteur est bien un membre, on l'ajoute à la liste des membres
             this.objectMember.email = documents[0].email;                                        
            this.objectMember.pseudo = documents[0].pseudo;                                        
           this.objectMember.password = documents[0].password;
             this.objectMember.role =  documents[0].role;                                       
             this.objectMember.dateCreation = documents[0].dateCreation;                                      

            this.objectMember.id = Math.round(Math.random() * 10000) + (new Date()).getTime();
             pObjectPopulation.members[this.objectMember.id] = this.objectMember;                     // On ajoute le membre qu'on vient de lire pour cette connexion dans un objet qui les recense
            pObjectPopulation.nbrMembersInSession++;

             return pObjectPopulation;
        });
    }