'use strict';

/*****************************************************************************************************/
/*************************  PARTIE CLIENT  FRONT         *********************************************/
/*****************************************************************************************************/  
        
window.addEventListener('DOMContentLoaded', function() {

//************************************************************************************************
// Déclaration des variables globales
//************************************************************************************************   
    var websocketConnection = io();

 // elements single page
    var blockFormulaire =  window.document.getElementById('formulaire'); 
    var deconnexion = window.document.getElementById('deconnexion');

// elements formulaire de changement de mots de passe 
    var blockChangeMp =  window.document.getElementById('change-mp');
    var formChangeMp =  window.document.getElementById('form-change-mp');
    var changeMpRecup = window.document.getElementById('change-mp-recup');
    var changeMp1 = window.document.getElementById('change-mp1'); 
    var changeMp2 = window.document.getElementById('change-mp2');
    var messageRecup= window.document.getElementById('idRecupMpAlertMsg'); 

 // elements formulaire de connexion   
    var formConnect = window.document.getElementById('form-connection');
    var formRecupMp =  window.document.getElementById('form-recup-mp');
    var mailRecupMp =  window.document.getElementById('mail-recup-mp');
    var messageRecupMp = window.document.getElementById('message-recup-mp');  
    var pseudoConnect= window.document.getElementById('pseudo');
    var mpConnect = window.document.getElementById('mp');   
    var messageConnection = window.document.getElementById('idLoginAlertMsg');
    var fermeMp = window.document.getElementById('ferme-mp');
    var fermeMpChange = window.document.getElementById('ferme-mp-change');

    var blockOublie =  window.document.getElementById('mot-de-passe-oublie');
    var oublie =  window.document.getElementById('oublie');
 
 // elements formulaire d'inscription'
    var formInscription = window.document.getElementById('form-inscription');
    var pseudoInscription = window.document.getElementById('pseudo-inscription');
    var mailInscription = window.document.getElementById('mail-inscription');
    var mp1Inscription = window.document.getElementById('mp-inscription');
    var mp2Inscription = window.document.getElementById('mp2-inscription'); 
    var messageInscription = window.document.getElementById('idInscritAlertMsg');  
   
   
   
    // Eléments de fenêtres modales
    var vGenericModal = window.document.getElementById('idGenericModal');
    var idFelicitation = window.document.getElementById('idFelicitation');
    var vModalTitle = window.document.getElementById('idModalTitle');
    var vModalBodyText = window.document.getElementById('idModalBodyText');
    var vModalTitleG = window.document.getElementById('idModalTitleG');
    var vModalBodyTextG = window.document.getElementById('idModalBodyTextG');
    var fermeFelicitation = window.document.getElementById('ferme-felicitation');
 
   // Eléments de la page profile de connexion
   
    var pseudoProfil = window.document.getElementById('pseudo-profil');
   // Eléments de la page profile inscription 
    var blockProfilMembre =  window.document.getElementById('profile-membre');  
    var pseudoDeProfil = window.document.getElementById('pseudoprofil');
    var pseudoDeProfil = window.document.getElementById('pseudoprofil');
    var emailDeProfil = window.document.getElementById('email-profil');

    var objetDuMembre = {};
    var objetDuVisiteur = {};
    
    mp1Inscription.onchange = function(){validatePassword(mp1Inscription, mp2Inscription)};    // Vérification que les MDP sont identiques
    mp2Inscription.onkeyup = function(){validatePassword(mp1Inscription, mp2Inscription)};     //
    changeMp1.onchange = function(){validatePasswordChange(changeMp1, changeMp2)};    // Vérification que les MDP sont identiques
    changeMp2.onkeyup = function(){validatePasswordChange(changeMp1, changeMp2)};     //
//************************************************************************************************
// Verification que la connexion est établie avec le serveur sur le port:2000
//************************************************************************************************
    websocketConnection.on('connexionServeurOK', function(msg) {
        console.log('msg',msg);
       
    });

//************************************************************************************************
// Formulaire de connexion
// A l'évènement submit on envoi au serveur les données du formulaire de connection
//************************************************************************************************ 

    formConnect.addEventListener('submit', function (event){
        event.preventDefault();
        colorInput();
        var objetDuMembre =                                     // Mise en forme pour transmission au serveur des données saisies
            {
                pseudo :    pseudoConnect.value ,
                motDePasse : mpConnect.value 
            }
        websocketConnection.emit('controleConnection', objetDuMembre);  // Transmission au serveur des infos saisies

        pseudoConnect.value = ''                                 // RAZ des données de login saisies
        mpConnect.value = ''

    //  $('#idModalLogin').modal('toggle');                                 // Fermeture de la fenêtre modale de Login
    });

// -------------------------------------------------------------------------------------
// Cette fonction initialise le contenu de la fenetre modale "Recuperation Mot de Passe"
// après la demande réussie de recuperation de mot de passe du nouveau membre
// -------------------------------------------------------------------------------------
function initModalRecupText(pModalTitleG, pModalBodyTextG){
    pModalTitleG.innerText = 'Recuperation mot de passe reussie dans Adopte un Maitre'
    pModalBodyTextG.innerHTML = '<h2>Adopte un Maitre Team vous informe:</h2>';
    pModalBodyTextG.innerHTML += '<br /><p>Vos identifiants vous ont été envoyés avec succès.</p>';
    pModalBodyTextG.innerHTML += '<br /><p>Nous venons de vous envoyer un email avec vos identifiants de connexion, consultez votre boîte spam si vous ne le voyez pas !</p>';
    pModalBodyTextG.innerHTML += '<br /><p>Bonne navigation !</p>';
};


//*******************************************************************************
// message au visiteur qui se connecte que le pseudo saisie n'existe pas
//*******************************************************************************
    websocketConnection.on('messageConnection', function(message,pObjetMembre) { 
        pseudoConnect.value; 
        mpConnect.value = ''; 
        messageConnection.style.display= 'block';        
        setTimeout(function(){ messageConnection.style.display= 'none';},9000);      
    });

//**********************************************************************************************
// message au visiteur qui change de mot de passe que le mot de passe saisie n'est pas valable
//**********************************************************************************************
    websocketConnection.on('messagePbChangeRecupMp', function(message,pObjetMembre) { 
        changeMpRecup.value = ''; 
        changeMp1.value = ''; 
        changeMp2.value = ''; 
        messageRecup.style.display= 'block';        
        setTimeout(function(){ messageRecup.style.display= 'none';},9000);      
    });

// click sur mot de passe "oublié" le membre recoit une fenettre pour recuperer son mot de passe
    oublie.addEventListener('click', function (event) { 
        console.log('mot de passe oublié');   
        blockFormulaire.style.display = 'none';                       
        blockOublie.style.display = 'block'; 
        websocketConnection.emit('recupMotDePasse');           
    });

//***************************************************************************************************
// A l'évènement submit on envoi au serveur les données du formulaire de recuperation de mot de passe
//*************************************************************************************************** 
    formRecupMp.addEventListener('submit', function (event) { 
        event.preventDefault();  
        colorInput();    
        var email =  mailRecupMp.value;      // Mise en forme pour transmission au serveur des données saisies
        console.log("email pour recup mot de passe",email);   
        websocketConnection.emit('envoieEmailRecupMp', email);  // Transmission au serveur des infos saisies
        mailRecupMp.value = ''                                    // RAZ des données email saisies                              
    });

// click sur la croix de fermetture  recup mot de passe le membre recoit ferme la fenetre de recuperation de mot de passe
    fermeMp.addEventListener('click', function (event) { 
        console.log('ferme fenetre recuperation de mot de passe');   
        blockFormulaire.style.display = 'block';                       
        blockOublie.style.display = 'none';               
    });

// click sur la croix de fermetture  change mot de passe le membre recoit ferme la fenetre de changement de mot de passe
fermeMpChange.addEventListener('click', function (event) { 
    console.log('ferme fenetre changement de mot de passe');   
    blockFormulaire.style.display = 'block';                       
    blockChangeMp.style.display = 'none';               
});
 // --------------------------------------------------------------------------------------------------------
    // Le visiteur a envoyé son adresse mail pour récuperer son mot de passe
    // Message de confirmation d'envoie du mot de passe et affichage de la page pour changer de mot de passe
    // -----------------------------------------------------------------------------------------------------
    websocketConnection.on('mailSendForRecupMp', function(pseudoRecup){ 
        console.log('bravo mail de recup envoyé');
        console.log("pseudoRecup",pseudoRecup);
        objetDuMembre.pseudo = pseudoRecup;
        initModalRecupText(vModalTitleG, vModalBodyTextG);
        $('#idGenericModal').modal('toggle');    // ouverture de la fenêtre modale bravo la recuperation de mot de passe ok
   //     blockFormulaire.style.display = 'block';                       
        blockOublie.style.display = 'none';  
        blockChangeMp.style.display = 'block';        // préparation page pour obliger le membre à changer de mot de passe                                
    });  

//*******************************************************************************
// message au visiteur qu'on n'a pas trouver son adresse mail
//*******************************************************************************
    websocketConnection.on('messageNoRecupMp', function(message) { 
        messageRecupMp.style.display= 'block';        
        setTimeout(function(){ messageRecupMp.style.display= 'none';},9000);      
    });

//************************************************************************************************
// Formulaire de changement de mot de passe
// A l'évènement submit on envoi au serveur les données du formulaire de changement de mot de passe
//************************************************************************************************ 
formChangeMp.addEventListener('submit', function (event) { 
    event.preventDefault();  
    colorInput();  
    objetDuMembre.mpProvisoire =  changeMpRecup.value;
    objetDuMembre.mp1Recup =      changeMp1.value;
    objetDuMembre.mp2Recup =      changeMp2.value;
    
    console.log("changeMp1.value dans formulaire change de mot de passe",changeMp1.value);
       
    console.log("changeMp2.value dans formulaire change de mot de passe",changeMp2.value);
    console.log("objetDuMembre dans formulaire change de mot de passe",objetDuMembre);
   
    websocketConnection.emit('controleChangeMp', objetDuMembre);  // Transmission au serveur des infos saisies
    changeMpRecup.value = ''                                    // RAZ des données saisies
    changeMp1.value = ''                                    
    changeMp2.value = ''
   
});

    
//************************************************************************************************
// Formulaire d'inscription
// A l'évènement submit on envoi au serveur les données du formulaire d'inscription
//************************************************************************************************ 
    formInscription.addEventListener('submit', function (event) { 
        event.preventDefault();  
        colorInput();      
        var objetDuVisiteur =                                     // Mise en forme pour transmission au serveur des données saisies
        {
            pseudoInscription : pseudoInscription.value,
            mailInscription : mailInscription.value,
            mp1Inscription : mp1Inscription.value,
            mp2Inscription : mp2Inscription.value
        }
        console.log("objetDuVisiteur",objetDuVisiteur);
       
        websocketConnection.emit('controleInscription', objetDuVisiteur);  // Transmission au serveur des infos saisies
        pseudoInscription.value = ''                                    // RAZ des données de Sign-in saisies
        mailInscription.value = ''                                    // RAZ des données de Sign-in saisies
        mp1Inscription.value = ''
        mp2Inscription.value = ''
       
    });
 
    
// *******************************************************************************
// Cette fonction vérifie que le MDP et sa confirmation sont bien identiques
// *******************************************************************************
    function validatePassword(pSignInPassword, pSignInConfirmPassword){
        if(pSignInPassword.value != pSignInConfirmPassword.value) {
            pSignInConfirmPassword.setCustomValidity("Les mots de passe ne correspondent pas");
        } else {
            pSignInConfirmPassword.setCustomValidity('');
        }
    }; 
// *******************************************************************************
// Cette fonction vérifie que le MDP et sa confirmation sont bien identiques
// *******************************************************************************
function validatePasswordChange(pSignInPassword, pSignInConfirmPassword){
    if(pSignInPassword.value != pSignInConfirmPassword.value) {
        pSignInConfirmPassword.setCustomValidity("Les mots de passe ne correspondent pas");
    } else {
        pSignInConfirmPassword.setCustomValidity('');
    }
}; 
 // *******************************************************************************
// Cette fonction en cas d'erreur modifie la couleur des input
// ******************************************************************************* 
    function colorInput() {
        var invalidClassName = 'invalid'
        var inputs = document.querySelectorAll('input, select, textarea')
        inputs.forEach(function (input) {
            // Add a css class on submit when the input is invalid.
            input.addEventListener('invalid', function () {
            input.classList.add(invalidClassName)
            });

            // Remove the class when the input becomes valid.
            // 'input' will fire each time the user types
            input.addEventListener('input', function () {
                if (input.validity.valid) {
                    input.classList.remove(invalidClassName)
                }
            });
        });  
    };

// -----------------------------------------------------------------------------
// Cette fonction initialise le contenu de la fenetre modale "Félicitations et Bienvenue"
// apr-s la création réussi du nouveau membre
// -----------------------------------------------------------------------------
    function initModalWelcomeText(pModalTitle, pModalBodyText){
        pModalTitle.innerText = 'Bienvenue dans Adopte un Maitre'
        pModalBodyText.innerHTML = '<h2>Bienvenue sur Adopte un Maître!</h2>';
        pModalBodyText.innerHTML += '<br /><p>Votre compte a été créé avec succès.</p>';
        pModalBodyText.innerHTML += '<br /><p>Nous venons de vous envoyer un email de confirmation avec un rappel de vos identifiants de connexion, consulter votre boite spam si vous ne le voyez pas !</p>';
        pModalBodyText.innerHTML += '<br /><p>Nous vous invitons à compléter votre profil.</p>';
    };
//*******************************************************************************
// message au visiteur que l'adrese mail saisie existe déjà
//*******************************************************************************
    websocketConnection.on('messageInscription', function(message) { 
        console.log('message reçu adresse mail existe déjà',message);
        var messageMailExiste = message.message; 
        mp1Inscription.value = ''; 
        mp2Inscription.value = '';  
        messageInscription.innerHTML = messageMailExiste;
        messageInscription.style.display= 'block'; 
        setTimeout(function(){ messageInscription.style.display= 'none';},9000);         
    });
   
    
//*******************************************************************************
// message au visiteur qui se connecte error
//*******************************************************************************
    websocketConnection.on('message', function(message) { 
        var message = message; 
        alert(message.message);      
    });

//*******************************************************************************
// message au visiteur qui se connecte avec un code administrateur erroné
//*******************************************************************************
websocketConnection.on('inscriptionAdministrateur', function(message) { 
    var message = message; 
    alert(message.message);      
});

//***************************************************************************************
// recoit changement mot de passe ok on cache la fenettre de changement de mot de passe 
//***************************************************************************************
    websocketConnection.on('mailSendInfoChangeMp', function(message) { 
        alert('Un mail avec vos nouvelles coordonnees de connexion vous a été envoyé');
       blockChangeMp.style.display = 'none';           
    });

//**************************************************************************************************
// LE CONNECTE EST UN MEMBRE A PRESENT ON LE REDIRIGE VERS SON PROFILE
//**************************************************************************************************  

    // --------------------------------------------------------------
   // Le visiteur s'est loggé avec succès et est donc reconnu comme membre
   // ==> Désactivation du vbouton "Connexion"
   // ==> Activation du bouton "Deconnexion"
   // --------------------------------------------------------------
   websocketConnection.on('disableConnectBtn', function() {
       deconnexion.setAttribute('class','dropdown-item');
       deconnexion.style.color = '#212529';           //      Activation du bouton 'Déconnexion'  
    });

// Le client reçoit toutes les données personnelles du membre connecté
    websocketConnection.on('profileConnect', function(documents) {
        blockFormulaire.style.display = 'none'; 
        console.log('blockFormulaire.style.display', blockFormulaire.style.display);
        blockProfilMembre.style.display = 'block'; 
        console.log('blockProfilMembre.style.display',blockProfilMembre.style.display);
        console.log('documents',documents);
    //    documents.forEach(function(infoMembre) {
        var photoImage = ' <img margin ="auto" src="' +documents.photoInscription+'"alt="photo" title="photo de profil">'; 
       
        pseudoProfil.innerHTML = documents.pseudo;  
        pseudoDeProfil.innerHTML = documents.pseudo;  
        console.log("pseudoDeProfil.innerHTML",pseudoDeProfil.innerHTML); 
           
  //      });
    });   


// Le client reçoit toutes les données personnelles du membre inscrit
    websocketConnection.on('profileInscription', function(documents) {
        blockFormulaire.style.display = 'none'; 
        console.log('blockFormulaire.style.display', blockFormulaire.style.display);
        blockProfilMembre.style.display = 'block'; 
        console.log('blockProfilMembre.style.display',blockProfilMembre.style.display);
        console.log(' inscription documents',documents);
        console.log("documents.pseudoInscription", documents.pseudoInscription);
    //    documents.forEach(function(infoMembre) {
        var photoImage = ' <img margin ="auto" src="' +documents.photoInscription+'"alt="photo" title="photo de profil">'; 
      //      photoProfil.innerHTML = photoImage; 
            pseudoProfil.innerHTML = documents.pseudoInscription;  
            pseudoDeProfil.innerHTML = documents.pseudoInscription; 
            emailDeProfil.innerHTML = documents.mailInscription;    
            console.log("pseudoDeProfil.innerHTML",pseudoDeProfil.innerHTML); 
            console.log("emailDeProfil.innerHTML",emailDeProfil.innerHTML); 
      //      console.log("photoProfil.innerHTML",photoProfil.innerHTML); 
  //      });
    });   

 // --------------------------------------------------------------
    // Le visiteur a créé son compte avec succès et est donc reconnu comme membre
    // Message d'accueil et de b=Bienvenue
    // ==> Désactivation du bouton "Connexion"
    // ==> Désactivation du bouton "Créer un compte"
    // ==> Activation du bouton "Deconnexion"
    // --------------------------------------------------------------
    websocketConnection.on('felicitationMembre', function(){ 
        console.log('Congratulations ');
        initModalWelcomeText(vModalTitle, vModalBodyText);
        $('#idFelicitation').modal('toggle');                                    // ouverture de la fenêtre modale de Félicitations
    });    


});     