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
    var administrateur = window.document.getElementById('administrateur');
    var nbMembresConnectes = window.document.getElementById('nb-membres-connectes');
    var nbMessagesPublic = window.document.getElementById('nb-messages-publies');
    var nbVisiteursConnectes = window.document.getElementById('nb-visiteurs-connectes');
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
    var messageRecupMpMail = window.document.getElementById('message-recup-mp-mail'); 
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
    var tabChangeProfil =  window.document.getElementById('tab-change-profil');
    var tabProfil =  window.document.getElementById('tab-profil');
    var tabActivite =  window.document.getElementById('tab-activite');
    var tabParametre =  window.document.getElementById('tab-parametre');
    var idProfilMpAlertMsg = window.document.getElementById('idProfileMur')
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

 //parametres de compte modifier le mot de passe
    var formParametreMp =  window.document.getElementById('form-parametre-mp');
    var ancienMp = window.document.getElementById('ancien-mp');
    var parametreMp1 = window.document.getElementById('parametre-mp1'); 
    var parametreMp2 = window.document.getElementById('parametre-mp2');
    var messageParametreMp= window.document.getElementById('idParametreAlertMsg'); 
   
 //*****************************************/
 // elements single page mur de profile 
 //*****************************************/   
   // Eléments de la page mur de profile
    var blockMurProfile =  window.document.getElementById('mur-profile');  
    var idProfileChange =  window.document.getElementById('idProfileChange');
    var idRechercheAmis  =  window.document.getElementById('idRechercheAmis');  
    var murPseudo = window.document.getElementById('mur-pseudo');
    var murEmail = window.document.getElementById('mur-email');
    var murAge = window.document.getElementById('mur-age');
    var murGenre = window.document.getElementById('mur-genre');
    var murProfil = window.document.getElementById('mur-profil');
    var murVille = window.document.getElementById('mur-ville');
    var murPreference = window.document.getElementById('mur-preference');
    var murPhotoProfil = window.document.getElementById('mur-photo-profile');
   // variables entrees du formulaires   
  
//*****************************************/
// elements single page recherche d'amis
//*****************************************/   
   // Eléments de la page recherche amis
   var blockRechercheAmis =  window.document.getElementById('block-recherche-amis'); 
   var idRechercheAmis  =  window.document.getElementById('idRechercheAmis'); 

//*****************************************/
// elements single page administrateur
//*****************************************/   
   // Eléments de la page administrateurs
    var blockAdministrateur =  window.document.getElementById('block-administrateur'); 
    var idProfilAdmin  =  window.document.getElementById('idProfilAdmin'); 
    var murPseudoAdmin = window.document.getElementById('mur-pseudo-admin'); 
    var murPhotoProfilAdmin = window.document.getElementById('mur-photo-profile-Admin');
    var listePseudo = window.document.getElementById('liste-pseudo')
    var listeStatut = window.document.getElementById('liste-statut');
    var listeDate = window.document.getElementById('liste-date');
    var listeEmail = window.document.getElementById('liste-email');
    var info = window.document.getElementById('info');
    var listeDesMembres = window.document.getElementById('liste-des-membres')
 //*****************************************/
 // elements single page footer
 //*****************************************/  
    
    var footerActivite = window.document.getElementById('footer-activite');   
    var nbrMembresConnectes = window.document.getElementById('nbr-membres-connectes');
    var nbrMessagesPublic = window.document.getElementById('nbr-messages-publies');
    var nbrVisiteursConnectes = window.document.getElementById('nbr-visiteurs-connectes');

 
 //   var pseudoDeProfil = window.document.getElementById('pseudoprofil');

    var lienPseudo=[];
    var objetDuMembre = {};
    var objetDuVisiteur = {};
    var objetDesMembres = {};
    var objetDunMembre = {};
   
//************************************************************************************************
// Déclaration des fonctions globales
//************************************************************************************************      
    
    mp1Inscription.onchange = function(){validatePassword(mp1Inscription, mp2Inscription)};    // Vérification que les MDP sont identiques
    mp2Inscription.onkeyup = function(){validatePassword(mp1Inscription, mp2Inscription)};     //
    changeMp1.onchange = function(){validatePassword(changeMp1, changeMp2)};    // Vérification que les MDP sont identiques
    changeMp2.onkeyup = function(){validatePassword(changeMp1, changeMp2)};     //
    parametreMp1.onchange = function(){validatePassword(parametreMp1, parametreMp2)};    // Vérification que les MDP sont identiques
    parametreMp2.onkeyup = function(){validatePassword(parametreMp1, parametreMp2)};   
// -------------------------------------------------------------------------------------
// Cette fonction initialise le contenu de la fenetre modale "Recuperation Mot de Passe"
// après la demande réussie de recuperation de mot de passe du nouveau membre
// -------------------------------------------------------------------------------------
    function initModalRecupTextBravo(pModalTitleG, pModalBodyTextG) {
        pModalTitleG.innerText = 'Récuperation du mot de passe reussie dans Adopte un Maitre'
        pModalBodyTextG.innerHTML = '<h2>Adopte un Maitre Team vous informe:</h2>';
        pModalBodyTextG.innerHTML += '<br /><p>Vos identifiants vous ont été envoyés avec succès.</p>';
        pModalBodyTextG.innerHTML += '<br /><p>Nous venons de vous envoyer un email avec vos identifiants de connexion, consultez votre boîte spam si vous ne le voyez pas !</p>';
        pModalBodyTextG.innerHTML += '<br /><p>Bonne navigation !</p>';
    };

// -------------------------------------------------------------------------------------
// Cette fonction initialise le contenu de la fenetre modale "Changement de Mot de Passe"
// après la demande réussie de changement de mot de passe du nouveau membre
// -------------------------------------------------------------------------------------
    function initModalRecupTextMp(pModalTitleG, pModalBodyTextG) {
        pModalTitleG.innerText = 'Changement de mot de passe reussie dans Adopte un Maitre'
        pModalBodyTextG.innerHTML = '<h2>Adopte un Maitre Team vous informe:</h2>';
        pModalBodyTextG.innerHTML += '<br /><p>Votre nouveau mot de passe est pris en compte</p>';
        pModalBodyTextG.innerHTML += '<br /><p>Nous venons de vous envoyer un email avec un rappel de vos identifiants de connexion, consultez votre boîte spam si vous ne le voyez pas !</p>';
        pModalBodyTextG.innerHTML += '<br /><p>Bonne navigation !</p>';
    };

// -------------------------------------------------------------------------------------
// Cette fonction initialise le contenu de la fenetre modale "mise à jour fiche profil"
// après la validation réussie du formulaire d'inscription fiche profil
// -------------------------------------------------------------------------------------
    function initModalRecupTextProfil(pModalTitleG, pModalBodyTextG) {
        pModalTitleG.innerText = 'Fiche de renseignements mise à jour dans Adopte un Maitre'
        pModalBodyTextG.innerHTML = '<h2>Adopte un Maitre Team vous informe:</h2>';
        pModalBodyTextG.innerHTML += '<br /><p>Bravo votre fiche de renseignements est à jour</p>';
        pModalBodyTextG.innerHTML += '<br /><p>Nous venons de vous envoyer un email confirmant que nous avons bien pris en compte vos données de profil, consultez votre boîte spam si vous ne le voyez pas !</p>';
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

// -----------------------------------------------------------------------------
// Cette fonction initialise les données du mur de profile
// que l'on souhaite afficher
// -----------------------------------------------------------------------------
    function initMurProfil(pObjetDuMembre) {
        // affichage des donnees de la page du mur de profile du membre
        murPhotoProfil = ' <img margin ="auto" src="' +pObjetDuMembre.photoProfile+'"alt="photo" title="photo de profil">';    
        murPseudo.innerHTML = pObjetDuMembre.pseudo;
    
        if (pObjetDuMembre.ville == ''){
            murVille.innerHTML = 'Non renseigné'; 
        } else {
            murVille.innerHTML =  pObjetDuMembre.ville + ' ans';
        } 

        switch(pObjetDuMembre.genre) {
            case 'F':                                           
            murGenre.innerHTML = 'Femme';  
            break;
            case 'H':                        
            murGenre.innerHTML = 'Homme';  
            break;
            case '':      
            murGenre.innerHTML = 'Non renseigné';        
            break;
        };
        
        console.log(pObjetDuMembre.profil);
        switch(pObjetDuMembre.profil) {
            case 'AM':                                           
            murProfil.innerHTML = 'Adopte un maître';  
            break;
            case 'AC':                        
            murProfil.innerHTML = 'Adopte un chat';  
            break;
            case 'NSP':      
            murProfil.innerHTML = 'Ne sais pas encore'; 
            break;
            case '':
            murProfil.innerHTML = 'Non renseigné'; 
            break;
        };
                
        if (pObjetDuMembre.age == ''){
            murAge.innerHTML = 'Non renseigné'; 
        } else {
            murAge.innerHTML = pObjetDuMembre.age + ' ans';
        } 

        murEmail.innerHTML = pObjetDuMembre.email;  

        if (pObjetDuMembre.preference == '') {
            murPreference.innerHTML = 'Non renseigné'; 
        } else {
            murPreference.innerHTML = pObjetDuMembre.preference;
        } 
        
    };

//******************************************************************************** 
// convertisseur de date en format JJ/MM/AAAA
//********************************************************************************  
    var getFormatDate  = function(pdate) {
        var today = new Date(pdate);
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        } 
        var today = dd+'/'+mm+'/'+yyyy;
        return today
    };

//************************************************************************************************************
// Fonction qui affichage des infos de tous les membres  membres  : pseudo, date, statut email
//************************************************************************************************************
    var affichageListeMembres = function(pObjetDesMembres) {  
        var listeExiste = false;
        console.log('1 listeExiste',listeExiste)
        if (!listeExiste) {
        for (var i=0; i < pObjetDesMembres.length; i++) {            
        
        var today = getFormatDate(pObjetDesMembres[i].dateCreation);
        
   // Création physique dynamique et ajout au DOM de la liste des membres
        var tr = document.createElement('tr');
        document.getElementById('liste-des-membres').appendChild(tr);      
    
        var td = document.createElement('td');
        tr.appendChild(td);
        
        var a = document.createElement('a');
        a.id = 'liste-pseudo'+[i];
        a.setAttribute ( 'href' , '#');
        a.className = 'user-link';
        a.innerHTML =  pObjetDesMembres[i].pseudo;
        td.appendChild(a); 

        var span = document.createElement('span');
        span.className = 'user-subhead';
        span.innerHTML = pObjetDesMembres[i].profil;
        td.appendChild(span);

        var td1 = document.createElement('td'); 
        td1.id= 'liste-date'+[i];
        td1.innerHTML =  today; 
        tr.appendChild(td1);

        var td2 = document.createElement('td'); 
        td2.className = 'text-center';       
        tr.appendChild(td2);

        var span2 = document.createElement('span');
        span2.className = 'label label-default';
        span2.id = 'liste-statut';
        span2.innerHTML = pObjetDesMembres[i].statut;
        td2.appendChild(span2);

        var td3 = document.createElement('td');
        tr.appendChild(td3);
        
        var a3 = document.createElement('a');
        a3.id = 'listes-email'+[i];
        a3.setAttribute ( 'href' , '#');
        a3.innerHTML =  pObjetDesMembres[i].email;
        td3.appendChild(a3); 

        var td4 = document.createElement('td');       
        td4.setAttribute ( 'style' , 'width: 20%;');
        tr.appendChild(td4);

        var a4 = document.createElement('a');
        a4.id = 'info'+[i];
        a4.setAttribute ( 'href' , '#');
        a4.className = 'table-link success';        
        td4.appendChild(a4); 

        var span4 = document.createElement('span');
        span4.className = 'fa-stack';       
        a4.appendChild(span4);

        var i1 = document.createElement('i');
        i1.className = 'fa fa-square fa-stack-2x';
        span4.appendChild(i1);

        var i2 = document.createElement('i');
        i2.className = 'fa fa-search-plus fa-stack-1x fa-inverse';
        span4.appendChild(i2);

        
        var a5 = document.createElement('a');
        a5.id = 'modifie'+[i];
        a5.setAttribute ( 'href' , '#');
        a5.className = 'table-link';        
        td4.appendChild(a5); 

        var span5 = document.createElement('span');
        span5.className = 'fa-stack';       
        a5.appendChild(span5);

        var i3 = document.createElement('i');
        i3.className = 'fa fa-square fa-stack-2x';
        span5.appendChild(i3);

        var i4 = document.createElement('i');
        i4.className = 'fa fa-pencil fa-stack-1x fa-inverse';
        span5.appendChild(i4);

        var a6 = document.createElement('a');
        a6.id = 'supprime'+[i];
        a6.setAttribute ( 'href' , '#');
        a6.className = 'table-link danger';        
        td4.appendChild(a6); 

        var span6 = document.createElement('span');
        span6.className = 'fa-stack';       
        a6.appendChild(span6);

        var i5 = document.createElement('i');
        i5.className = 'fa fa-square fa-stack-2x';
        span6.appendChild(i5);

        var i6 = document.createElement('i');
        i6.className = 'fa fa-trash-o fa-stack-1x fa-inverse';
        span6.appendChild(i6);
  /*      
        var affichageListeMembres  = '<tr><td><a id="liste-pseudo'+[i]+'" href="#" class="user-link">'
        + pObjetDesMembres[i].pseudo+'</a><span class="user-subhead">'+pObjetDesMembres[i].profil+'</span></td><td id="liste-date">'+today+
        '</td><td class="text-center"><span class="label label-default" id="liste-statut">' + pObjetDesMembres[i].statut+
        '</span></td><td><a id="liste-email" href="#">'+pObjetDesMembres[i].email+'</a></td></td>'+
        '<td style="width: 20%;"><a id="info'+[i]+'" href="" class="table-link success"><span class="fa-stack">'+
        '<i class="fa fa-square fa-stack-2x"></i><i class="fa fa-search-plus fa-stack-1x fa-inverse"></i></span></a>'+
        '<a href="#" class="table-link"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i>'+
        '<i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a><a href="#" class="table-link danger"><span class="fa-stack">'+
        '<i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a></td></tr>';
*/


        lienPseudo[i]=  window.document.getElementById('liste-pseudo'+[i]); 
        console.log("lienPseudo",lienPseudo);     
    
        console.log("pseudo avec innerhtml  lienPseudo[i].innerHTML",lienPseudo[i].innerHTML);
    
    
        };
        listeExiste = true;
        console.log('2 listeExiste',listeExiste);
        // ***********************************************************************************************************
        // click sur un des membres de la liste on consulte son mur de profil
        // ***********************************************************************************************************
    ////    info[i].addEventListener('click', function (event) { 
    //        console.log("click sur le pseudo d'un des membres --info:",listePseudo[i].innerHTML);         
    //        websocketConnection.emit('demandeAffiMurDunMembre', listePseudo[i].innerHTML);  // Demande au serveur la liste de tous les membres     
    //    });       
    //   listePseudo.innerHTML += pObjetDesMembres[i].pseudo;
    //   listeDate.innerHTML += today;
    //   listeEmail.innerHTML += pObjetDesMembres[i].email;
    //   listeStatut.innerHTML +=    pObjetDesMembres[i].statut;


        }
         // ***********************************************************************************************************
        // click sur un des membres de la liste on consulte son mur de profil
        // ***********************************************************************************************************

        console.log("lienPseudo.length",lienPseudo.length);
        for(var j=0;j<lienPseudo.length;j++){
            lienPseudo[j].addEventListener('click', function (event) { 
            console.log("click sur le pseudo d'un des membres --lienPseudo", lienPseudo); 
            console.log("lienPseudo[i] dans le click",lienPseudo); 
            console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj',j);                  
            websocketConnection.emit('demandeAffiMurDunMembre', lienPseudo);  // Demande au serveur la liste de tous les membres     
        });
    }; 
        
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
        console.log('population',population);
        nbMembresConnectes.innerHTML = population.nbrMembers;  // Affichage du nombre de membres connectés sur la page principale 
        nbrMembresConnectes.innerHTML = population.nbrMembers; // Affichage du nombre de membres connectés sur le pied de page 
        var nombreVisiteurs   = population.nbrVisitors - population.nbrMembers;  
        nbrVisiteursConnectes.innerHTML = nombreVisiteurs;  // Affichage du nombre de visiteurs connectés sur la page principale 
        nbVisiteursConnectes.innerHTML = nombreVisiteurs;   // Affichage du nombre de visiteurs connectés sur la pied de page
        nbMessagesPublic.innerHTML = population.nbMessagesPublic; // Affichage du nombre de messages publiés sur la page principale 
        nbrMessagesPublic.innerHTML = population.nbMessagesPublic;        // Affichage du nombre de messages publiés sur le pied de page
    });

//************************************************************************************************
// Réception du nombre de messages publics echangés en temps réel
//************************************************************************************************
    websocketConnection.on('nbMessagesPublic', function(nbMessagesPublic) {
        console.log('nbMessagesPublic',nbMessagesPublic);
        nbMessagesPublic.innerHTML = nbMessagesPublic;  
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
// click sur mot de passe "oublié" le membre recoit une fenetre pour recuperer son mot de passe
// ***********************************************************************************************************
    oublie.addEventListener('click', function (event) { 
        console.log('mot de passe oublié');   
        blockFormulaire.style.display = 'none'; 
        footerActivite.style.display = 'block';                        
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
        footerActivite.style.display = 'none';                        
        blockOublie.style.display = 'none';               
    });

// ***********************************************************************************************************
// click sur la croix de fermeture  recup mot de passe le membre recoit ferme la fenetre de recuperation de mot de passe
// ***********************************************************************************************************    
    fermeMp.addEventListener('click', function (event) { 
        console.log('ferme fenetre recuperation de mot de passe');   
        blockFormulaire.style.display = 'block'; 
        footerActivite.style.display = 'none';                        
        blockOublie.style.display = 'none';               
    });
    
// ***********************************************************************************************************
// Reception changement de mot de passe ok le membre recoit ferme la fenetre de changement de mot de passe
// - renvoie le formulaire de connexion
// ***********************************************************************************************************    
    websocketConnection.on('sendFormulaireConnexion', function (data) { 
        console.log('ferme fenetre changement de mot de passe');   
        blockFormulaire.style.display = 'block'; 
        footerActivite.style.display = 'none';                      
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
        initModalRecupTextBravo(vModalTitleG, vModalBodyTextG);
        $('#idGenericModal').modal('toggle');    // ouverture de la fenêtre modale bravo la recuperation de mot de passe ok
    //     blockFormulaire.style.display = 'block';                       
        blockOublie.style.display = 'none';  
        blockChangeMp.style.display = 'block';        // préparation page pour obliger le membre à changer de mot de passe                                
    });  

// ***********************************************************************************************************
// message au visiteur qu'on n'a pas trouver son adresse mail
// ***********************************************************************************************************
    websocketConnection.on('messageNoRecupMpMail', function(message) { 
        messageRecupMpMail.style.display= 'block';        
        setTimeout(function(){ messageRecupMpMail.style.display= 'none';},9000);      
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
    websocketConnection.on('mailSendInfoChangeMp', function(data) { 
        console.log("bravo mail d'info de prise en compte du nouveau mot de passe envoyé partie connexion");
        console.log("data membre apres changement de mot de passe dans les parametres du compte",data);
        objetDuMembre.pseudo;
        initModalRecupTextMp(vModalTitleG, vModalBodyTextG);
        $('#idGenericModal').modal('toggle');    // ouverture de la fenêtre modale bravo le changement de mot de passe ok          
        blockChangeMp.style.display = 'none';           
    });

// ***********************************************************************************************************
// recoit modification du profile ok 
// ***********************************************************************************************************
    websocketConnection.on('mailSendInfoChangeProfil', function(data) { 
        console.log("bravo mail d'info de prise en compte du formulaire de renseignements du profile mise à jour");
        console.log("data membre apres renseignement du formulaire du profilez d'inscription",data);
        objetDuMembre.pseudo;
        initModalRecupTextProfil(vModalTitleG, vModalBodyTextG);
        $('#idGenericModal').modal('toggle');    // ouverture de la fenêtre modale bravo le changement de mot de passe ok                     
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
// Le visiteur s'est loggé avec succès et est donc reconnu comme membre
// ==> Activation du bouton "Deconnexion"
// *********************************************************************************************************** 
    websocketConnection.on('disableConnectBtn', function() {
        deconnexion.setAttribute('class','dropdown-item');
        deconnexion.style.color = '#212529';           //      Activation du bouton 'Déconnexion'  
    });

// ***********************************************************************************************************
// ==> Activation du bouton "Administrateur si statut du membre = 1 ou 2
// *********************************************************************************************************** 
    websocketConnection.on('disableAdministrateurBtn', function() {
        administrateur.setAttribute('class','dropdown-item');
        administrateur.style.color = '#212529';           //      Activation du bouton 'administrateur'  
    });

// ***********************************************************************************************************
// LE NOUVEAU MEMBRE FAIT PARTI DES CONNECTES A PRESENT ON LE REDIRIGE VERS SON PROFILE D'INSCRIPTION
// ***********************************************************************************************************
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
        footerActivite.style.display = 'block';  
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
// click sur lien mur de profile profile on affiche le mur de profile
// ***********************************************************************************************************
    idProfileMur.addEventListener('click', function (event) { 
        console.log('click mur de  profile');  
        // affichage des donnees de la page du mur de profile du membre
        initMurProfil(objetDuMembre);
        blockMurProfile.style.display = 'block';                     
        blockProfilMembre.style.display = 'none';
    });

// ***********************************************************************************************************
// message erreur formulaire profile inscription
// ***********************************************************************************************************
    websocketConnection.on('messageErrorProfilInscription', function(message) { 
        console.log('message reçu veuillez renseigner votre profil',message);   
        messageErrProfilInscrit.innerHTML = message.message; 
        messageErrProfilInscrit.style.display= 'block'; 
        setTimeout(function(){ messageErrProfilInscrit.style.display= 'none';},9000);         
    });

// ***********************************************************************************************************
// Formulaire dans la page parametre de changement de mot de passe
// A l'évènement submit on envoi au serveur les données du formulaire dans la page parametre de changement de mot de passe
// *********************************************************************************************************** 
    formParametreMp.addEventListener('submit', function (event) { 
        event.preventDefault();     
        objetDuMembre.ancienMp      =  ancienMp.value;
        objetDuMembre.mp            =  parametreMp1.value;
        objetDuMembre.mpConfirme    =  parametreMp2.value;
        
        console.log("ancienMp.value dans formulaire parametre de mot de passe",ancienMp.value);
        
        console.log("parametreMp2.value dans formulaire parametre de mot de passe",parametreMp1.value);
        console.log("objetDuMembre dans formulaire parametre de mot de passe",objetDuMembre);

        websocketConnection.emit('controleParametreMp', objetDuMembre);  // Transmission au serveur des infos saisies
        ancienMp.value = '';                                   // RAZ des données saisies
        parametreMp1.value = '';                                   
        parametreMp2.value = '';    
    });

// ***********************************************************************************************************
// message au membre qui change de mot de passe que le mot de passe saisie n'est pas valable
// ***********************************************************************************************************
    websocketConnection.on('messagePbParametreChangeMp', function(message,pObjetMembre) { 
        ancienMp.value = ''; 
        parametreMp1.value = ''; 
        parametreMp2.value = ''; 
        messageParametreMp.style.display= 'block';      
    });

// ***********************************************************************************************************
// Le membre a changé de mot de passe dans ses parametres de compte
// Message de confirmation d'envoie du nouveau mot de passe 
// ***********************************************************************************************************
    websocketConnection.on('mailSendInfoParametreMp', function(data) { 
        console.log("bravo mail d'info de prise en compte du nouveau mot de passe envoyé partie paramèetre");
        console.log("data membre apres changement des parametres de mot de passe dans les parametres du compte",data);
        objetDuMembre.pseudo;
        initModalRecupTextMp(vModalTitleG, vModalBodyTextG);
        $('#idGenericModal').modal('toggle');    // ouverture de la fenêtre modale bravo le changement de mot de passe ok       
        messageParametreMp.style.display= 'none'; 
    //    tabChangeProfil.className ="active";   // positionne le li sur changer son profil
    //    tabProfil.className = "";   
    //    tabActivite.className = "";   
    //   tabParametre.className = "";                              
    }); 

// ***********************************************************************************************************
// LE CONNECTE EST UN MEMBRE A PRESENT ON LE REDIRIGE VERS SON PROFILE
// *********************************************************************************************************** 
// ***********************************************************************************************************
// Le client reçoit toutes les données personnelles du membre connecté
// ***********************************************************************************************************
    websocketConnection.on('profileConnect', function(documents) {
        window.scrollTo(0,0);                           // affichage page haut de page 
        objetDuMembre = documents;
        pseudoNav.innerHTML = documents.pseudo; // le pseudo est affiché dans le menu connexion en haut
        console.log('objetDuMembre profile connexion', objetDuMembre);
        blockFormulaire.style.display = 'none'; 
        footerActivite.style.display = 'block';  
        blockProfilMembre.style.display = 'none'; 
        console.log('blockFormulaire.style.display', blockFormulaire.style.display);
        blockMurProfile.style.display = 'block';
        
        initMurProfil(objetDuMembre);    // affichage des donnees de la page du mur de profile du membre

        // affichage des donnees de la page d'inscription du profile du membre    
        photoImageProfil = ' <img margin ="auto" src="' +documents.photoProfile+'"alt="photo" title="photo de profil">';
        pseudoProfil.innerHTML = objetDuMembre.pseudo; 
        emailProfil.innerHTML = objetDuMembre.email;  
        nomProfil.value =  objetDuMembre.nom;    
        console.log("mur profile preparation affichage profile inscription nomProfil.value", nomProfil.value);   
        prenomProfil.value =   objetDuMembre.prenom;
        genreProfil.value= objetDuMembre.genre;
        ageProfil.value= objetDuMembre.age;
        telephoneProfil.value= objetDuMembre.telephone;
        adresseProfil.value= objetDuMembre.adresse;
        cpProfil.value= objetDuMembre.cp;
        villeProfil.value= objetDuMembre.ville;
        paysProfil.value= objetDuMembre.pays;
        profilProfil.value= objetDuMembre.profil;
        preferenceProfil.value= objetDuMembre.preference;
    });   

// ***********************************************************************************************************
// click sur lien changer son profile on affiche le profile d'inscription
// ***********************************************************************************************************

    idProfileChange.addEventListener('click', function (event) { 
        console.log('change profile');   
        blockMurProfile.style.display = 'none';                     
        blockProfilMembre.style.display = 'block';  
        tabChangeProfil.className ="active";   // positionne le li sur changer son profil
        tabProfil.className ="";   
        tabActivite.className ="";   
        tabParametre.className ="";        
    });

//***********************************************************************************************************
// PARTIE RECHERCHE D'AMIS
// ***********************************************************************************************************     
// ***********************************************************************************************************
// click sur lien chercher des amis on affiche la page de recherche d'amis
// ***********************************************************************************************************

    idRechercheAmis.addEventListener('click', function (event) { 
        console.log('demande rechercher amis');   
        blockMurProfile.style.display = 'none';                     
        blockRechercheAmis.style.display = 'block';
        tabProfil.className ="";   
        tabActivite.className ="";   
        tabParametre.className ="";        
    });
// ***********************************************************************************************************
// PARTIE ADMINISTRATEUR
// *********************************************************************************************************** 

// ***********************************************************************************************************
// click sur lien administrateur on affiche le tableau de bord des utilisateurs
// ***********************************************************************************************************
    administrateur.addEventListener('click', function (event) { 
        console.log('click lien vers page administrateur objetDuMembre', objetDuMembre);          
        // affichage des donnees de la page administrateur
        murPhotoProfilAdmin = ' <img margin ="auto" src="' +objetDuMembre.photoProfile+'"alt="photo" title="photo de profil">';    
        murPseudoAdmin.innerHTML = objetDuMembre.pseudo; 
        // affichage liste des comptes des  membres       
        blockAdministrateur.style.display = 'block';                     
        blockFormulaire.style.display = 'none';
        blockMurProfile.style.display = 'none';
        blockProfilMembre.style.display ='none';
        websocketConnection.emit('demandeListeMembres', objetDuMembre);  // Demande au serveur la liste de tous les membres
    });

// ***********************************************************************************************************
// click sur lien mon profil on affiche le mur de profil
// ***********************************************************************************************************
    idProfilAdmin.addEventListener('click', function (event) { 
        console.log('click lien vers page mur de profil');         
        // affichage des donnees de la page administrateur
        initMurProfil(objetDuMembre);    // affichage des donnees de la page du mur de profile du membre
        blockAdministrateur.style.display = 'none';                     
        blockFormulaire.style.display = 'none';
        blockMurProfile.style.display = 'block';
        blockProfilMembre.style.display ='none';       
    });

// ***********************************************************************************************************
// Le client qui est administrateur reçoit la liste des données personnelles de tous les membres
// ***********************************************************************************************************
    websocketConnection.on('SendlisteDesMembres', function(documents) {
        objetDesMembres = documents;
        console.log('liste de tous les membres -- objetDesMembres:',objetDesMembres);
        affichageListeMembres(objetDesMembres);          
       
    });   

//************************************************************************************************************
// message au membre qu'il n'est pas autorisé à consulter la liste des membres 
//***********************************************************************************************************
    websocketConnection.on('messageNoAutorise', function(data) { 
        alert(data);    
    });


// ***********************************************************************************************************
// Le client qui est administrateur reçoit les données personnelles d'un membre:
// à lui maintenant d'afficher le mur de ce membre avec ses données
// ***********************************************************************************************************
    websocketConnection.on('infoDunMembre', function(data) {
        objetDunMembre = data;
        console.log('info d un membre  -- objetDunMembre:',objetDunMembre);
        initMurProfil(objetDunMembre);    // affichage des donnees de la page du mur de profile du membre
        blockAdministrateur.style.display = 'none';                     
        blockFormulaire.style.display = 'none';
        blockMurProfile.style.display = 'block';
        blockProfilMembre.style.display ='none';    
    }); 

});     