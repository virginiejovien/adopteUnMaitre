 // ---------------------------------------------------------------------------------------------------------------------------
    // Ajout des données du visiteur (futur membre) (Email, Pseudo, MDP, timestamp (au format brut), et statut dans la BDD)
    // ATTENTION !!!!
    // S'il n'y aucun membre dans la BDD, le Premier membre qui est créé est le Super-Administrateur
    // 
    // Codification des privilèges
    // 1 --> SuperAdmin
    // 2 --> Admin
    // 4 --> Membre
    // ---------------------------------------------------------------------------------------------------------------------------
    MemberServer.prototype.addMemberInDatabase = function(pMember, pWebSocketConnection){
        var myRole;

        this.DBMgr.memberCollection.countDocuments((error, count) => {        // On compte le nombre de membres dans la base pour savoir si le nouveau membre sera le SuperAdmin
            if (error){
                console.log('Erreur de comptage dans la collection \'membres\' : ',error);   // Si erreur technique... Message et Plantage
                throw error;
            } else {
                count === 0 ? myRole = cstSuperAdmin : myRole = cstMembre;      // Si c'est le 1er membre qui s'enregistre, c'est forcément le SuperAdmin

                this.objectMember.email = pMember.email,
                this.objectMember.pseudo = pMember.pseudo,
                this.objectMember.password = pMember.password,
                this.objectMember.role = myRole,
                this.objectMember.dateCreation = new Date(),                                  // Timestamp de la création du record

                this.DBMgr.memberCollection.insertOne(this.objectMember, (error, result) => {
                    if (error){
                        console.log('Erreur d\'insertion dans la collection \'membres\' : ',error);   // Si erreur techn throw error;ique... Message et Plantage
                       
                    } else {
                        console.log("addMemberInDatabase - 1 document inserted : ",memberRecord);    
                    
                        let messageToSend = {
                            to       : pMember.email,
                            from     : 'collector@vcp.com',
                            subject  : 'Votre inscription à Collect\'Or',
                            // text  : 'Félicitations\n\nVous êtes dorénavant membre de la Communauté \'Collect\'Or\'',
                            html     : '<h1 style="color: black;">Félicitations</h1><p><h2>Vous êtes dorénavant membre de la Communauté \'Collect\'Or\'.</h2><br />' +
                                        'Vos identifiants sont : <p><Strong>Pseudonyme : </strong>'+pMember.pseudo+'<p><strong>Mot de passe : </strong>'+pMember.password +
                                        '</p><br /><br /><br /><i>Vil-Coyote Products</i>',
                        }
                        sgMail.send(messageToSend);
                        pWebSocketConnection.emit('congratNewMember'); 
                    }
                });
            }
        });
    }