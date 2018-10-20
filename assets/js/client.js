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
    var mpConnect = window.document.getElementById('mot-de-passe');
    var mailConnect= window.document.getElementById('mail');
    var formInscription = window.document.getElementById('form-inscription');
    var pseudoInscription = window.document.getElementById('pseudo-inscription');
    var mailInscription = window.document.getElementById('mail-inscription');
    var mp1Inscription = window.document.getElementById('mp-inscription');
    var mp2Inscription = window.document.getElementById('mp2-inscription');   
    var blockFormulaire =  window.document.getElementById('formulaire'); 
    var blockProfilMembre =  window.document.getElementById('profile-membre');  
    var pseudo = window.document.getElementById('pseudo');
    var pseudoProfil = window.document.getElementById('pseudo-profil');
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
        objetDuMembre.mail = mailConnect.value;   
        objetDuMembre.motDePasse = mpConnect.value;                     
        websocketConnection.emit('controleConnection', objetDuMembre);
    });

//*******************************************************************************
// message au visiteur qui se connecte que l'adrese mail saisie n'existe pas
//*******************************************************************************
    websocketConnection.on('messageConnection', function(message) { 
        console.log("message reçu adresse mail n'existe pas",message);
        var messageMailNoExiste = message; 
        mailConnect.value; 
        mpConnect.value = ''; 
        alert(messageMailNoExiste.message);      
    });

    //*******************************************************************************
// message au visiteur qui se connecte que son ne mot de passe n'est pas correct
//*******************************************************************************
    websocketConnection.on('messageMotDePasse', function(message) { 
        console.log("message reçu mot de passe n'est pas correct",message);
        var messageFalseMp = message; 
        mailConnect.value; 
        mpConnect.value = ''; 
        alert(messageFalseMp.message);      
    });
//************************************************************************************************
// A l'évènement submit on envoi au serveur les données du formulaire d'inscription
//************************************************************************************************ 
    formInscription.addEventListener('submit', function (event) { 
        event.preventDefault();                
        objetDuVisiteur.pseudoInscription = pseudoInscription.value; 
        objetDuVisiteur.mailInscription = mailInscription.value;  
        objetDuVisiteur.mp1Inscription = mp1Inscription.value; 
        objetDuVisiteur.mp2Inscription = mp2Inscription.value;                        
        websocketConnection.emit('controleInscription', objetDuVisiteur);
    });

//*******************************************************************************
// message au visiteur que l'adrese mail saisie existe déjà
//*******************************************************************************
    websocketConnection.on('messageInscription', function(message) { 
        console.log('message reçu adresse mail existe déjà',message);
        var messageMailExiste = message; 
        mailInscription.value; 
        mailInscription.value = ''; 
        mp1Inscription.value = ''; 
        mp2Inscription.value = '';  
        alert(messageMailExiste.message);      
    });
   
    
//*******************************************************************************
// message au visiteur qui se connecte que l'adrese mail saisie n'existe pas
//*******************************************************************************
websocketConnection.on('message', function(message) { 
    console.log("message reçu vous devez remplir tous les champs",message);
    var message = message; 
    alert(message.message);      
});

//**************************************************************************************************
// LE CONNECTE EST UN MEMBRE A PRESENT ON LE REDIRIGE VERS SON PROFILE
//**************************************************************************************************  
  
// Le client reçoit toutes les données personnelles du membre inscrit
    websocketConnection.on('profile', function(documents) {
        blockFormulaire.style.display = 'none'; 
        console.log('blockFormulaire.style.display', blockFormulaire.style.display);
        blockProfilMembre.style.display = 'block'; 
        console.log('blockProfilMembre.style.display',blockProfilMembre.style.display);
        console.log('documents',documents);
        documents.forEach(function(infoMembre) {
            pseudo.innerHTML = infoMembre.pseudoInscription; 
            pseudoProfil.innerHTML = infoMembre.pseudoInscription;        
        });
    });    
});     