'use strict';

/*****************************************************************************************************/
/*************************  PARTIE CLIENT  FRONT         *********************************************/
/*****************************************************************************************************/  
        
window.addEventListener('DOMContentLoaded', function() {

//************************************************************************************************
// Déclaration des variables globales
//************************************************************************************************   
    var websocketConnection = io();
    var formConnect = window.document.getElementById('form-connection');
    var formInscription = window.document.getElementById('form-inscription');
    
    var objetDuMembre = {};
    var objetDuVisiteur = {};
    


//************************************************************************************************
// Verification que la connexion est établie avec le serveur sur le port:2000
//************************************************************************************************
    websocketConnection.on('connexionServeurOK', function(msg) {
        console.log('msg',msg);
    });

//************************************************************************************************
// A l'évènement submit on envoi au serveur les données du formulaire de connection
//************************************************************************************************ 
formConnect.addEventListener('submit', function (event) { 
    event.preventDefault();                
    objetDuMembre.username = elementUsername.value;                        
    websocketConnection.emit('controleConnection', objetDuMembre);
});

//************************************************************************************************
// A l'évènement submit on envoi au serveur les données du formulaire d'inscription
//************************************************************************************************ 
formInscription.addEventListener('submit', function (event) { 
    event.preventDefault();                
    objetDuVisiteur.username = elementUsername.value;                        
    websocketConnection.emit('controleInscription', objetDuVisiteur);
});


//**************************************************************************************************
// LE CONNECTE EST UN MEMBRE A PRESENT
//**************************************************************************************************  
    websocketConnection.on('pret', function(joueur) {
       
    });

// Le client reçoit qu'il peut éffacer le formulaire car son inscription au jeu est ok
    websocketConnection.on('EffaceFormulaire', function( ) {
        blockPseudo.style.display = 'none'; 
    });

}); 