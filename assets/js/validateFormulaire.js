    // -------------------------------------------------------------------------
    // Initialisations
    // -------------------------------------------------------------------------
    
    // window.addEventListener('keydown',vVisiteur.hidePalmaresAndRules.bind(vVisiteur,vOuterBrdrWindowList,vWindowList));   
    // });    
    // vBtnImgBtnDisclaimer.addEventListener('click', function(){
    //     vVisiteur.displayDisclaimer(vOuterBrdrWindowList, vWindowList, webSocketConnection);
    // });    
    
        
    vToolBox = new ToolBox();
    var vVisiteur = new Visiteur();       // Instanciation de l'objet descrivant un visiteur et les méthodes de gestion de ce visiteur
    
    // Eléments de menu
    var vConnexion = document.getElementById('idConnexion');
    var vCreation = document.getElementById('idCreation');
    var vDeconnexion = document.getElementById('idDeconnexion');
    var vGenericModal = document.getElementById('idGenericModal');

    // Eléments de fenêtres modales
    var vModalLogin = document.getElementById('idModalLogin');
    var vModalContent = document.getElementById('idModalContent');
    var vModalContent = document.getElementById('idModalContent');
    var vModalTitle = document.getElementById('idModalTitle');
    var vModalBodyText = document.getElementById('idModalBodyText');
    
    initGenericModalText(vModalTitle, vModalBodyText);                        // Initialisation primaire de la fenetre modale en mode "A propos"


    // Eléments de champs de saisie de la fenêtre de Login
    var vLoginForm = document.getElementById('idLoginForm');
    var vLoginAlertMsg = document.getElementById('idLoginAlertMsg');

    // Eléments de champs de saisie de la fenêtre de Création
    var vSignInForm = document.getElementById('idSignInForm');
    var vSignInAlertMsg = document.getElementById('idSignInAlertMsg');
    var vSignInPassword = document.getElementById('idSignInPassword');
    var vSignInConfirmPassword = document.getElementById('idSignInConfirmPassword');

    vSignInPassword.onchange = function(){validatePassword(vSignInPassword, vSignInConfirmPassword)};           // Vérification que les MDP sont identiques
    vSignInConfirmPassword.onkeyup = function(){validatePassword(vSignInPassword, vSignInConfirmPassword)};     //

    // Initialisations comportementales
    giveFocusToModalFirstField('idModalLogin', 'idLoginPseudo');                                                // Donne le Focus au 1er de la Form
    giveFocusToModalFirstField('idModalSignIn', 'idSignInEmail');                                               //
    vGenericModal.addEventListener('click', function(){
        initGenericModalText(vModalTitle, vModalBodyText)                     // Initialisation secondaire de la fenetre modale en mode "A propos" (réaction au "Click")
    });

    // -------------------------------------------------------------------------
    // Envoi des infos de login du visiteur lorsque la saisie du Login est validée 
    // syntaxiquement et par la validation globale de celle-ci
    // -------------------------------------------------------------------------
    vLoginForm.addEventListener('submit', function (event){ 
        event.preventDefault();                

        var visiteurLoginData =                                     // Mise en forme pour transmission au serveur des données saisies
            {
                pseudo : vLoginForm.idLoginPseudo.value,
                password : vLoginForm.idLoginPassword.value,
            }
        webSocketConnection.emit('visiteurLoginData', visiteurLoginData);   // Transmission au serveur des infos saisies
        
        vLoginForm.idLoginPseudo.value = ''                                 // RAZ des données de login saisies
        vLoginForm.idLoginPassword.value = ''

        $('#idModalLogin').modal('toggle');                                 // Fermeture de la fenêtre modale de Login
    });

    // -------------------------------------------------------------------------
    // Envoi des infos de création du visiteur lorsque la Création de compte est 
    // validée syntaxiquement et par la validation globale de celle-ci
    // -------------------------------------------------------------------------
    vSignInForm.addEventListener('submit', function (event){ 
        event.preventDefault();                

        var visiteurSignInData =                                     // Mise en forme pour transmission au serveur des données saisies
            {
                email : vSignInForm.idSignInEmail.value,
                pseudo : vSignInForm.idSignInPseudo.value,
                password : vSignInForm.idSignInPassword.value,
            }

        webSocketConnection.emit('visiteurSignInData', visiteurSignInData);     // Transmission au serveur des infos saisies
        
        vSignInForm.idSignInEmail.value = ''                                    // RAZ des données de Sign-in saisies
        vSignInForm.idSignInPseudo.value = ''                                    // RAZ des données de Sign-in saisies
        vSignInForm.idSignInPassword.value = ''
        vSignInForm.idSignInConfirmPassword.value = ''

        $('#idModalSignIn').modal('toggle');                                    // Fermeture de la fenêtre modale de Sign-In
    });

    // --------------------------------------------------------------
    // Le serveur a rejeté la demande Login, et redemande au visiteur 
    // de réessayer de se loger
    // --------------------------------------------------------------
    webSocketConnection.on('retryLoginForm', function(){   

        vLoginAlertMsg.style.visibility = 'visible'                                 // Affichage du message d'alerte de connexion erronée
        setTimeout(function(){$("#idModalLogin").modal('toggle')},300);             // Obligation de temporiser la réouverture sinon ça ne marche pas
        giveFocusToModalFirstField('idModalLogin', 'idLoginPseudo');                // Focus sur 1er champ de la Form de connexion
    });

    // --------------------------------------------------------------
    // Le serveur a rejeté la demande Signin, et redemande au visiteur 
    // de ressaisir ses infos de Sign-In
    // --------------------------------------------------------------
    webSocketConnection.on('retrySignInForm', function(){   
        // var myClass = vModalContent.getAttribute('class');
        // myClass += ' border border-danger';                                     // Bordure de la fenêtre en rouge
        // vModalContent.setAttribute('class', myClass);
        // Equivalent a "element.classList.add("mystyle");" / "element.classList.remove("mystyle");""

        vSignInAlertMsg.style.visibility = 'visible'                               // Affichage du message d'alerte de connexion erronée
        setTimeout(function(){$("#idModalSignIn").modal('toggle')},300);           // Obligation de temporiser la réouverture sinon ça ne marche pas
        giveFocusToModalFirstField('idModalSignIn', 'idSignInEmail');              // Focus sur 1er champ de la Form de connexion
    });

    // --------------------------------------------------------------
    // Le visiteur s'est loggé avec succès et est donc reconnu comme membre
    // ==> Désactivation du bouton "Connexion"
    // ==> Désactivation du bouton "Créer un compte"
    // ==> Activation du bouton "Deconnexion"
    // --------------------------------------------------------------
    webSocketConnection.on('disableConnectBtn', function(){   
        toggleLoginLogoutBtn(vConnexion, vCreation, vDeconnexion);
    });

    // --------------------------------------------------------------
    // Le visiteur a créé son compte avec succès et est donc reconnu comme membre
    // Message d'accueil et de b=Bienvenue
    // ==> Désactivation du bouton "Connexion"
    // ==> Désactivation du bouton "Créer un compte"
    // ==> Activation du bouton "Deconnexion"
    // --------------------------------------------------------------
    webSocketConnection.on('congratNewMember', function(){ 
console.log('Congratulations')
        initModalWelcomeText(vModalTitle, vModalBodyText);
        $('#idGenericModal').modal('toggle');                                    // ouverture de la fenêtre modale de Félicitations
        toggleLoginLogoutBtn(vConnexion, vCreation, vDeconnexion);
    });    
});
// -----------------------------------------------------------------------------
//  Cette fonction donne le focus au champs pIdField  de la fenêtre modale pIdModal
//  passée en paramètre car le composant "Modal" court-circuite l'attibut "Auto-focus"
// -----------------------------------------------------------------------------
function giveFocusToModalFirstField(pIdModal, pIdField){
    $('#'+pIdModal).on('shown.bs.modal', function() {
        $('#'+pIdField).focus();
    })
}
// -----------------------------------------------------------------------------
// Cette fonction vérifie que le MDP et sa confirmation sont bien identiques
// -----------------------------------------------------------------------------
function validatePassword(pSignInPassword, pSignInConfirmPassword){
    if(pSignInPassword.value != pSignInConfirmPassword.value) {
        pSignInConfirmPassword.setCustomValidity("Les mots de passe ne correspondent pas");
    } else {
        pSignInConfirmPassword.setCustomValidity('');
    }
}
// -----------------------------------------------------------------------------
// Cette fonction initialise le contenu de la fenetre générique modale en mode "About"
// -----------------------------------------------------------------------------
function initGenericModalText(pModalTitle, pModalBodyText){
    pModalTitle.innerText = 'A propos...'
    pModalBodyText.innerHTML = '<h5>Bienvenue dans Collect\'Or</h5>';
    pModalBodyText.innerHTML += '<p>Collector est un réseau social destiné aux collectionneurs de figurines, véhicules, avions, bateaux, et autres sujets historiques, principalement militaires, mais les autres types de collections sont également les bienvenus</p>';
    pModalBodyText.innerHTML += '<p>Vous pourrez notamment discuter en public ou en privé avec d\'autres collectionneurs, déposer / lire des annonces de vente, d\'échange, de recherche, de manifestations...</p>';
    pModalBodyText.innerHTML += '<p>De plus, vous pourrez laisser vos avis sur des sujets particuliers, accéder à la galerie pour admirer les collections ou y déposer vos propres photos, accéder aux trucs et astuces de modéliste, y déposer vos expériences, et enfin poser vos questions</p>';
}
// -----------------------------------------------------------------------------
// Cette fonction initialise le contenu de la fenetre modale "Félicitations et Bienvenue"
// apr-s la création réussi du nouveau membre
// -----------------------------------------------------------------------------
function initModalWelcomeText(pModalTitle, pModalBodyText){
    pModalTitle.innerText = 'Bienvenue dans Collect\'Or'
    pModalBodyText.innerHTML = '<h5>Félicitations !</h5>';
    pModalBodyText.innerHTML += '<br /><p>Votre compte a été créé avec succès</p>';
    pModalBodyText.innerHTML += '<br /><p>Un mail de confirmation vous été envoyé, si vous le voyez pas, veuillez regarder dans le dosssier des SPAMs</p>';
    pModalBodyText.innerHTML += '<br /><p>Bonne navigation...</p>';
}
// -----------------------------------------------------------------------------
// Cette fonction initialise le contenu de la fenetre modale "Félicitations et Bienvenue"
// apr-s la création réussi du nouveau membre
// -----------------------------------------------------------------------------
function toggleLoginLogoutBtn(pConnexion, pCreation, pDeconnexion){

    pConnexion.disabled = true;                     //
    pConnexion.style.visibility = 'hidden';         //      Désactivation du bouton 'Connexion'

    pCreation.disabled = true;                      //
    pCreation.style.visibility = 'hidden';          //      Désactivation du bouton 'Creation de compte'

    pDeconnexion.setAttribute('class','dropdown-item');
    pDeconnexion.style.color = '#212529';           //      Activation du bouton 'Déconnexion'
}
    // -------------------------- Fin du module ----------------------------------------