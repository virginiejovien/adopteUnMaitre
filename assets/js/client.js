'use strict';

/*****************************************************************************************************/
/*************************  PARTIE CLIENT  FRONT         *********************************************/
/*****************************************************************************************************/  
        
window.addEventListener('DOMContentLoaded', function() {

//************************************************************************************************
// Déclaration des variables globales
//************************************************************************************************   
    var websocketConnection = io();

//**********************************/
 // elements single page formulaire
 //**********************************/
    var blockFormulaire =  window.document.getElementById('formulaire'); 
    var deconnexion = window.document.getElementById('deconnexion');
    var nbMembresConnectes = window.document.getElementById('nb-membres-connectes');
    var pseudoNav = window.document.getElementById('pseudo-nav');
    // elements formulaire de changement de mots de passe 
    var blockChangeMp =  window.document.getElementById('change-mp');
    var formChangeMp =  window.document.getElementById('form-change-mp');
    var changeMpRecup = window.document.getElementById('change-mp-recup');
    var changeMp1 = window.document.getElementById('change-mp1'); 
    var changeMp2 = window.document.getElementById('change-mp2');
    var messageRecup= window.document.getElementById('idRecupMpAlertMsg'); 
    var formRecupMp =  window.document.getElementById('form-recup-mp');
    var mailRecupMp =  window.document.getElementById('mail-recup-mp');
    var messageRecupMp = window.document.getElementById('message-recup-mp'); 
    var fermeMp = window.document.getElementById('ferme-mp');
    var fermeMpChange = window.document.getElementById('ferme-mp-change');

    // elements formulaire de connexion   
    var formConnect = window.document.getElementById('form-connection');   
    var pseudoConnect= window.document.getElementById('pseudo');
    var mpConnect = window.document.getElementById('mp');   
    var messageConnection = window.document.getElementById('idLoginAlertMsg');  
    var blockOublie =  window.document.getElementById('mot-de-passe-oublie');
    var oublie =  window.document.getElementById('oublie');
 
    // elements formulaire d'inscription'
    var formInscription = window.document.getElementById('form-inscription');
    var pseudoInscription = window.document.getElementById('pseudo-inscription');
    var mailInscription = window.document.getElementById('mail-inscription');
    var mp1Inscription = window.document.getElementById('mp-inscription');
    var mp2Inscription = window.document.getElementById('mp2-inscription'); 
    var messageInscription = window.document.getElementById('idInscritAlertMsg');  
   
    // Eléments de fenêtres modales partie connexion inscription
    var vGenericModal = window.document.getElementById('idGenericModal');
    var vModalTitle = window.document.getElementById('idModalTitle');
    var vModalBodyText = window.document.getElementById('idModalBodyText');
    var idFelicitation = window.document.getElementById('idFelicitation');
    var fermeFelicitation = window.document.getElementById('ferme-felicitation');
    var vModalBodyTextG = window.document.getElementById('idModalBodyTextG');  
    var vModalTitleG = window.document.getElementById('idModalTitleG');
 
 //**********************************/
 // elements single page profile 
 //**********************************/
   
 //   var pseudoProfil = window.document.getElementById('pseudo-profil');
 
 //*****************************************/
 // elements single page profile inscription
 //*****************************************/   
   // Eléments de la page profile inscription 
   var blockProfilMembre =  window.document.getElementById('profile-membre');
   var formProfilInscription = window.document.getElementById('form-profil-inscription');
   var pseudoProfil = window.document.getElementById('pseudo-profil');
   var emailProfil = window.document.getElementById('email-profil');
   var photoImageProfil = window.document.getElementById('photo-profil');
   // variables entrees du formulaires   
   var nomProfil =  window.document.getElementById('nom-profil');
   var prenomProfil =  window.document.getElementById('prenom-profil'); 
   var genreProfil =  window.document.getElementById('genre-profil');
   var ageProfil = window.document.getElementById('age-profil');
   var telephoneProfil = window.document.getElementById('telephone-profil');
   var adresseProfil = window.document.getElementById('adresse-profil');
   var cpProfil = window.document.getElementById('cp-profil');
   var villeProfil = window.document.getElementById('ville-profil');
   var paysProfil = window.document.getElementById('pays-profil');
   var profilProfil = window.document.getElementById('profil-profil');
   var preferenceProfil = window.document.getElementById('preference-profil');
   var messageErrProfilInscrit = window.document.getElementById('idProfilMpAlertMsg');

 //   var pseudoProfil = window.document.getElementById('pseudo-profil');
 
 //*****************************************/
 // elements single page mur de profile 
 //*****************************************/   
   // Eléments de la page mur de profile
   var blockMurProfile =  window.document.getElementById('mur-profile');  
   var murPseudo = window.document.getElementById('mur-pseudo');
   var murEmail = window.document.getElementById('mur-email');
   var murPhotoProfil = window.document.getElementById('mur-photo-profile');
   // variables entrees du formulaires   
  

   


 
 //   var pseudoDeProfil = window.document.getElementById('pseudoprofil');


    var objetDuMembre = {};
    var objetDuVisiteur = {};
   
//************************************************************************************************
// Déclaration des fonctions globales
//************************************************************************************************      
    
    mp1Inscription.onchange = function(){validatePassword(mp1Inscription, mp2Inscription)};    // Vérification que les MDP sont identiques
    mp2Inscription.onkeyup = function(){validatePassword(mp1Inscription, mp2Inscription)};     //
    changeMp1.onchange = function(){validatePassword(changeMp1, changeMp2)};    // Vérification que les MDP sont identiques
    changeMp2.onkeyup = function(){validatePassword(changeMp1, changeMp2)};     //

// -------------------------------------------------------------------------------------
// Cette fonction initialise le contenu de la fenetre modale "Recuperation Mot de Passe"
// après la demande réussie de recuperation de mot de passe du nouveau membre
// -------------------------------------------------------------------------------------
    function initModalRecupText(pModalTitleG, pModalBodyTextG) {
        pModalTitleG.innerText = 'Recuperation mot de passe reussie dans Adopte un Maitre'
        pModalBodyTextG.innerHTML = '<h2>Adopte un Maitre Team vous informe:</h2>';
        pModalBodyTextG.innerHTML += '<br /><p>Vos identifiants vous ont été envoyés avec succès.</p>';
        pModalBodyTextG.innerHTML += '<br /><p>Nous venons de vous envoyer un email avec vos identifiants de connexion, consultez votre boîte spam si vous ne le voyez pas !</p>';
        pModalBodyTextG.innerHTML += '<br /><p>Bonne navigation !</p>';
    };

// *******************************************************************************
// Cette fonction vérifie que le MDP et sa confirmation sont bien identiques
// *******************************************************************************
    function validatePassword(pSignInPassword, pSignInConfirmPassword) {
        if (pSignInPassword.value != pSignInConfirmPassword.value) {
            pSignInConfirmPassword.setCustomValidity("Les mots de passe ne correspondent pas");
        } else {
            pSignInConfirmPassword.setCustomValidity('');
        }
    }; 

// *******************************************************************************
// Cette fonction vérifie que le MDP et sa confirmation sont bien identiques
// *******************************************************************************
    function validatePasswordChange(pSignInPassword, pSignInConfirmPassword) {
        if (pSignInPassword.value != pSignInConfirmPassword.value) {
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
    function initModalWelcomeText(pModalTitle, pModalBodyText) {
        pModalTitle.innerText = 'Bienvenue dans Adopte un Maitre'
        pModalBodyText.innerHTML = '<h2>Bienvenue sur Adopte un Maître!</h2>';
        pModalBodyText.innerHTML += '<br /><p>Votre compte a été créé avec succès.</p>';
        pModalBodyText.innerHTML += '<br /><p>Nous venons de vous envoyer un email de confirmation avec un rappel de vos identifiants de connexion, consulter votre boite spam si vous ne le voyez pas !</p>';
        pModalBodyText.innerHTML += '<br /><p>Nous vous invitons à compléter votre profil.</p>';
    };


//************************************************************************************************************
// **********************        PARTIE COMMUNICATION AVEC LE SERVEUR WEB               ********************** 
// **********************           ****************  **************                    **********************      
// ***********************************************************************************************************  

//************************************************************************************************
// Verification que la connexion est établie avec le serveur sur le port:2000
//************************************************************************************************
    websocketConnection.on('connexionServeurOK', function(msg) {
        console.log('msg',msg);
       
    });

//************************************************************************************************
// Réception du nombre de membres connectés en temps réel
//************************************************************************************************
    websocketConnection.on('nbMembresConnect', function(population) {
        console.log('nbMembresConnectes',population.nbrMembers);
        nbMembresConnectes.innerHTML = population.nbrMembers;       
    });

//************************************************************************************************************
// **********************                        PARTIE 1                               ********************** 
// **********************           ****************  **************                    **********************
// **********************      CONNEXION ET INSCRIPTION AU SITE ADOPTE UN MAITRE        **********************
// **********************      -- consultation : apropos                                **********************            
// **********************      -- connexion :   - contrôle                              **********************
// **********************                       - gestion du mot de passe oublié        **********************
// **********************      -- inscription : - contrôle                              **********************
// **********************                       - envoie mail de confirmation           **********************    
// ***********************************************************************************************************

//************************************************************************************************************
// Formulaire de connexion
// A l'évènement submit on envoi au serveur les données du formulaire de connection
//************************************************************************************************************ 

    formConnect.addEventListener('submit', function (event) {
        event.preventDefault();
    
         objetDuVisiteur =                                     // Mise en forme pour transmission au serveur des données saisies
            {
                pseudo :    pseudoConnect.value ,
                motDePasse : mpConnect.value 
            }
        websocketConnection.emit('controleConnection', objetDuVisiteur);  // Transmission au serveur des infos saisies

        pseudoConnect.value = ''                                 // RAZ des données de login saisies
        mpConnect.value = ''
    });

//************************************************************************************************************
// message au visiteur qui se connecte que le pseudo saisie n'existe pas
//***********************************************************************************************************
    websocketConnection.on('messageNoConnection', function(message,pObjetMembre) { 
        pseudoConnect.value; 
        mpConnect.value = ''; 
        messageConnection.style.display= 'block';        
        setTimeout(function(){ messageConnection.style.display= 'none';},9000);      
    });


//************************************************************************************************************
// message au visiteur qui se connecte qu'il a déjà ouvert une session 
//***********************************************************************************************************
    websocketConnection.on('membreDejaConnecte', function(data) { 
        pseudoConnect.value; 
        mpConnect.value = ''; 
        alert('Vous ne pouvez pas vous connecter car vous avez déjà ouvert une session');    
    });

// ***********************************************************************************************************
// message au visiteur qui change de mot de passe que le mot de passe saisie n'est pas valable
// ***********************************************************************************************************
    websocketConnection.on('messagePbChangeRecupMp', function(message,pObjetMembre) { 
        changeMpRecup.value = ''; 
        changeMp1.value = ''; 
        changeMp2.value = ''; 
        messageRecup.style.display= 'block';        
        setTimeout(function(){ messageRecup.style.display= 'none';},9000);      
    });

// ***********************************************************************************************************
// click sur mot de passe "oublié" le membre recoit une fenettre pour recuperer son mot de passe
// ***********************************************************************************************************
    oublie.addEventListener('click', function (event) { 
        console.log('mot de passe oublié');   
        blockFormulaire.style.display = 'none';                       
        blockOublie.style.display = 'block'; 
        websocketConnection.emit('recupMotDePasse');           
    });

// ***********************************************************************************************************
// A l'évènement submit on envoi au serveur les données du formulaire de recuperation de mot de passe
// ***********************************************************************************************************
    formRecupMp.addEventListener('submit', function (event) { 
        event.preventDefault();        
        var email =  mailRecupMp.value;      // Mise en forme pour transmission au serveur des données saisies
        console.log("email pour recup mot de passe",email);   
        websocketConnection.emit('envoieEmailRecupMp', email);  // Transmission au serveur des infos saisies
        mailRecupMp.value = ''                                    // RAZ des données email saisies                              
    });

// ***********************************************************************************************************
// click sur la croix de fermeture  recup mot de passe le membre recoit ferme la fenetre de recuperation de mot de passe
// ***********************************************************************************************************    
    fermeMp.addEventListener('click', function (event) { 
        console.log('ferme fenetre recuperation de mot de passe');   
        blockFormulaire.style.display = 'block';                       
        blockOublie.style.display = 'none';               
    });

// ***********************************************************************************************************
// click sur la croix de fermeture  change mot de passe le membre recoit ferme la fenetre de changement de mot de passe
// ***********************************************************************************************************    
    fermeMpChange.addEventListener('click', function (event) { 
        console.log('ferme fenetre changement de mot de passe');   
        blockFormulaire.style.display = 'block';                       
        blockChangeMp.style.display = 'none';               
    });

// ***********************************************************************************************************
// Le visiteur a envoyé son adresse mail pour récuperer son mot de passe
// Message de confirmation d'envoie du mot de passe et affichage de la page pour changer de mot de passe
// ***********************************************************************************************************
    websocketConnection.on('mailSendForRecupMp', function(pseudoRecup) { 
        console.log('bravo mail de recup envoyé');
        console.log("pseudoRecup",pseudoRecup);
        objetDuMembre.pseudo = pseudoRecup;
        initModalRecupText(vModalTitleG, vModalBodyTextG);
        $('#idGenericModal').modal('toggle');    // ouverture de la fenêtre modale bravo la recuperation de mot de passe ok
   //     blockFormulaire.style.display = 'block';                       
        blockOublie.style.display = 'none';  
        blockChangeMp.style.display = 'block';        // préparation page pour obliger le membre à changer de mot de passe                                
    });  

// ***********************************************************************************************************
// message au visiteur qu'on n'a pas trouver son adresse mail
// ***********************************************************************************************************
    websocketConnection.on('messageNoRecupMp', function(message) { 
        messageRecupMp.style.display= 'block';        
        setTimeout(function(){ messageRecupMp.style.display= 'none';},9000);      
    });

// ***********************************************************************************************************
// Formulaire de changement de mot de passe
// A l'évènement submit on envoi au serveur les données du formulaire de changement de mot de passe
// *********************************************************************************************************** 
    formChangeMp.addEventListener('submit', function (event) { 
        event.preventDefault();  
       
        objetDuMembre.mpProvisoire =  changeMpRecup.value;
        objetDuMembre.mp1Recup =      changeMp1.value;
        objetDuMembre.mp2Recup =      changeMp2.value;
        
        console.log("changeMp1.value dans formulaire change de mot de passe",changeMp1.value);
        
        console.log("changeMp2.value dans formulaire change de mot de passe",changeMp2.value);
        console.log("objetDuMembre dans formulaire change de mot de passe",objetDuMembre);
    
        websocketConnection.emit('controleChangeMp', objetDuMembre);  // Transmission au serveur des infos saisies
        changeMpRecup.value = '';                                   // RAZ des données saisies
        changeMp1.value = '';                                   
        changeMp2.value = '';    
    });
  
// ***********************************************************************************************************
// Formulaire d'inscription
// A l'évènement submit on envoi au serveur les données du formulaire d'inscription
// ***********************************************************************************************************
    formInscription.addEventListener('submit', function (event) { 
        event.preventDefault(); 
        var objetDuVisiteur =                                     // Mise en forme pour transmission au serveur des données saisies
        {
            pseudoInscription : pseudoInscription.value,
            mailInscription : mailInscription.value,
            mp1Inscription : mp1Inscription.value,
            mp2Inscription : mp2Inscription.value
        }
        console.log("objetDuVisiteur",objetDuVisiteur);
       
        websocketConnection.emit('controleInscription', objetDuVisiteur);  // Transmission au serveur des infos saisies
        pseudoInscription.value = '';                                    // RAZ des données de Sign-in saisies
        mailInscription.value = '';                                    // RAZ des données de Sign-in saisies
        mp1Inscription.value = '';
        mp2Inscription.value = '';       
    });
 
// ***********************************************************************************************************
// message au visiteur que l'adrese mail saisie existe déjà
// ***********************************************************************************************************
    websocketConnection.on('messageNoInscription', function(message) { 
        console.log('message reçu adresse mail existe déjà',message);
        var messageMailExiste = message.message; 
        mp1Inscription.value = ''; 
        mp2Inscription.value = '';  
        messageInscription.innerHTML = messageMailExiste;
        messageInscription.style.display= 'block'; 
        setTimeout(function(){ messageInscription.style.display= 'none';},9000);         
    });
    
// ***********************************************************************************************************
// message au visiteur qui se connecte error
// ***********************************************************************************************************
    websocketConnection.on('message', function(message) { 
        var message = message; 
        alert(message.message);      
    });

// ***********************************************************************************************************
// message au visiteur qui se connecte avec un code administrateur erroné
// ***********************************************************************************************************
    websocketConnection.on('inscriptionAdministrateur', function(message) { 
        var message = message; 
        alert(message.message);      
    });

// ***********************************************************************************************************
// recoit changement mot de passe ok on cache la fenettre de changement de mot de passe 
// ***********************************************************************************************************
    websocketConnection.on('mailSendInfoChangeMp', function(message) { 
        alert('Un mail avec vos nouvelles coordonnees de connexion vous a été envoyé');
       blockChangeMp.style.display = 'none';           
    });

//***********************************************************************************************************
// Le visiteur a créé son compte avec succès et est donc reconnu comme membre
// Message d'accueil et de b=Bienvenue
//***********************************************************************************************************
    websocketConnection.on('felicitationMembre', function(documents) {        
        objetDuMembre = documents;
        console.log('Congratulations objetDuMembre', objetDuMembre);
        initModalWelcomeText(vModalTitle, vModalBodyText);
        $('#idFelicitation').modal('toggle');                                    // ouverture de la fenêtre modale de Félicitations
    });    




//************************************************************************************************************
// **********************                        PARTIE 2                               ********************** 
// **********************           ****************  **************                    **********************
// **********************                     PAGE DE PROFILE                           **********************
// **********************      -- consultation : apropos                                **********************            
// **********************      -- connexion :   - contrôle                              **********************
// **********************                       - gestion du mot de passe oublié        **********************
// **********************      -- inscription : - contrôle                              **********************
// **********************                       - envoie mail de confirmation           **********************    
// ***********************************************************************************************************

// ***********************************************************************************************************
// LE CONNECTE EST UN MEMBRE A PRESENT ON LE REDIRIGE VERS SON PROFILE
// ==> Désactivation du bouton "Connexion"
// ==> Désactivation du bouton "Créer un compte"
// ==> Activation du bouton "Deconnexion"
// *********************************************************************************************************** 

// *********************************************************************************************************** 
// Le visiteur s'est loggé avec succès et est donc reconnu comme membre
// ==> Désactivation du vbouton "Connexion"
// ==> Activation du bouton "Deconnexion"
// *********************************************************************************************************** 
   websocketConnection.on('disableConnectBtn', function() {
    deconnexion.setAttribute('class','dropdown-item');
    deconnexion.style.color = '#212529';           //      Activation du bouton 'Déconnexion'  
 });


// ***********************************************************************************************************
// Le client reçoit toutes les données personnelles du membre connecté
// ***********************************************************************************************************
 websocketConnection.on('profileConnect', function(documents) {
     window.scrollTo(0,0);                           // affichage page haut de page 
     objetDuMembre = documents;
     console.log('objetDuMembre profile connexion', objetDuMembre);
     blockFormulaire.style.display = 'none'; 
     blockProfilMembre.style.display = 'none'; 
     console.log('blockFormulaire.style.display', blockFormulaire.style.display);
     blockMurProfile.style.display = 'block';
     
       console.log('documents',documents);
 //    documents.forEach(function(infoMembre) {
     murPhotoProfil = ' <img margin ="auto" src="' +documents.photoProfile+'"alt="photo" title="photo de profil">';
    
    murPseudo.innerHTML = documents.pseudo; 
    murEmail.innerHTML = documents.email; 
  //   nomProfil.innerHTML = documents.nom; 
 //    pseudoDeProfil.innerHTML = documents.pseudo;  
 //    console.log("pseudoDeProfil.innerHTML",pseudoDeProfil.innerHTML); 
        
//      });
 });   

// ***********************************************************************************************************
// Le client reçoit toutes les données personnelles du membre inscrit
// ***********************************************************************************************************
 websocketConnection.on('profileInscription', function(documents) {
    window.scrollTo(0,0);          // affichage page haut de page 
    objetDuMembre = documents;
   // affichage du pseudo dans le menu de navigation
    pseudoNav.innerHTML = documents.pseudo;

    console.log('objetDuMembre profile inscription', objetDuMembre);
    blockFormulaire.style.display = 'none'; 
    console.log('blockFormulaire.style.display', blockFormulaire.style.display);
    blockProfilMembre.style.display = 'block'; 
    console.log('blockProfilMembre.style.display',blockProfilMembre.style.display);
    console.log(' inscription documents',documents);
    console.log("documents.pseudoInscription", documents.pseudoInscription);
 //    documents.forEach(function(infoMembre) {
    photoImageProfil = ' <img margin ="auto" src="' +documents.photoProfile+'"alt="photo" title="photo de profil">'; 
   //      photoProfil.innerHTML = photoImage; 
    pseudoProfil.innerHTML = documents.pseudo;  
   //      pseudoDeProfil.innerHTML = documents.pseudoInscription; 
    emailProfil.innerHTML = documents.email;    
    //     console.log("pseudoDeProfil.innerHTML",pseudoDeProfil.innerHTML); 
    console.log("emailProfil.innerHTML",emailProfil.innerHTML); 
   //      console.log("photoProfil.innerHTML",photoProfil.innerHTML); 
//      });
   
 });   

// ***********************************************************************************************************
// Formulaire suite inscription profile du memmbre 
// A l'évènement submit on envoi au serveur les données du formulaire d'inscription
// ***********************************************************************************************************
formProfilInscription.addEventListener('submit', function (event) { 
    event.preventDefault(); 
    window.scrollTo(0,0);  
     
  //   Mise en forme pour transmission au serveur des données saisies    
        
    objetDuMembre.nom         =   nomProfil.value;
    objetDuMembre.prenom      =   prenomProfil.value;
    objetDuMembre.genre       =   genreProfil.value;
    objetDuMembre.age         =   ageProfil.value;
    objetDuMembre.telephone   =   telephoneProfil.value;  
    objetDuMembre.adresse     =   adresseProfil.value;
    objetDuMembre.cp          =   cpProfil.value;
    objetDuMembre.ville       =   villeProfil.value;
    objetDuMembre.pays        =   paysProfil.value;
    objetDuMembre.profil      =   profilProfil.value;
    objetDuMembre.preference  =   preferenceProfil.value;
     
    console.log("objetDuMembre avant envoie au serveur web",objetDuMembre);
   
    websocketConnection.emit('controleProfileInscription', objetDuMembre);  // Transmission au serveur des infos saisies
       
});

// ***********************************************************************************************************
// message erreur formulaire profile inscription
// ***********************************************************************************************************
websocketConnection.on('messageErrorProfilInscription', function(message) { 
    console.log('message reçu veuillez renseigner tous les champs',message);   
    messageErrProfilInscrit.innerHTML = message.message; 
    messageErrProfilInscrit.style.display= 'block'; 
    setTimeout(function(){ messageErrProfilInscrit.style.display= 'none';},9000);         
});



});     