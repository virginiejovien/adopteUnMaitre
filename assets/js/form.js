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
    var elementMpConnect = window.document.getElementById('mot-de-passe');
    var elementMailConnect= window.document.getElementById('mail');
    var formInscription = window.document.getElementById('form-inscription');
    var elementNomInscri = window.document.getElementById('nom-inscription');
    var elementMailInscri = window.document.getElementById('mail-inscription');
    var elementMpInscri = window.document.getElementById('mp-inscription');
    var elementMp2Inscri = window.document.getElementById('mp2-inscription');

    var objetDuMembre = {};
    var objetDuVisiteur = {};
    
   //************************************************************************************************
// Fonction modifier la couleur d'arrière-plan si formulaire mal rempli
//************************************************************************************************  
function surligne(champ, erreur) {
    if (erreur)
       champ.style.backgroundColor = "#fba";
    else
       champ.style.backgroundColor = "";
 };


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
    objetDuMembre.nom = elementNom.value;  
    objetDuMembre.mail = elementMail.value;   
    objetDuMembre.motDePasse = elementMotDePasse.value;                     
    websocketConnection.emit('controleConnection', objetDuMembre);
});

//************************************************************************************************
// A l'évènement submit on envoi au serveur les données du formulaire d'inscription
//************************************************************************************************ 
formInscription.addEventListener('submit', function (event) { 
    event.preventDefault();                
    objetDuVisiteur.elementNomInscri = elementUsername.value; 
    objetDuVisiteur.elementMailInscri = elementUsername.value;                        
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