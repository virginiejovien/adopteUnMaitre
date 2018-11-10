
    // Cette fonction recherche dans la table des membres, celui qui a la propriété passée en parametre
    // ---------------------------------------------------------------------------------------------------------------------------
    MemberServer.prototype.searchMemberInTableOfMembers = (pProperty, pValue) => {
        let myIndex = this.objectPopulation.members.map((propertyFilter) => {
            return propertyFilter[pProperty];
        })
        .indexOf(pValue);
        this.objectFound = this.objectPopulation.members[myIndex];
        return myIndex; 
    }
myIndex = this.searchMemberInTableOfMembers('idMember', pWebSocketConnection.id);  // Recherche du visiteur dans le tableau des membres

let myIndex = this.searchMemberInTableOfMembers('pseudo', this.member.pseudo)
this.objectPopulation.members.splice(myIndex, 1);


    // Deconnexion d'un visiteur et eventuellement d'un membre  :
    // 

    MemberServer.prototype.disconnectMember = function(pWebSocketConnection, pSocketIo){
        let myIndex = this.searchMemberInTableOfMembers('idMember' ,pWebSocketConnection.id);

        if (this.objectPopulation.members[myIndex].isMember){                    // Le visiteur qui se deconnecte était un membre
            this.objectPopulation.nbrMembersInSession--;                         // Nombre de visiteurs incluant les [membres + Admins]
            
            if (this.objectPopulation.members[myIndex].role < cstMembre){    // Il s'agit obligatoiremennt d'un Admin ou Super-Admin
            this.objectPopulation.nbrAdminsInSessions--;  // Si le memnbre est un Admin, on retire 1 aux nombre d'Admin connectés
            }
    
        }

        this.objectPopulation.members.splice(myIndex, 1);
        this.objectPopulation.nbrConnections--;
        this.UpdateDisplayPopulation(pSocketIo);
    }
 