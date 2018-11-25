'use strict';

/*****************************************************************************************************/
/*************************  PARTIE CLIENT  FRONT         *********************************************/
/*****************************************************************************************************/  
        
window.addEventListener('DOMContentLoaded', function() {

//************************************************************************************************
// Déclaration des variables globales
//************************************************************************************************   
    var webSocketConnection = io();
    
    var siofu = new SocketIOFileUpload(webSocketConnection);
    
//************************************************************************************************************
//  Eléments du UpLoader
//************************************************************************************************************

    siofu.addEventListener("complete", function(event){
        console.log(event.success);
        console.log(event.file);
    });

    // Do something on upload progress:
    siofu.addEventListener("progress", function(event){
        var percent = event.bytesLoaded / event.file.size * 100;
        console.log("File is", percent.toFixed(2), "percent loaded");
    });

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

    // Eléments de fenêtres modales partie fiche membre formulaire à modifier   
    var idFiche = window.document.getElementById('idFiche');
    var fermeFiche = window.document.getElementById('ferme-fiche');
    var formFiche = window.document.getElementById('form-fiche');
    var pseudoTitreFiche  =  window.document.getElementById('pseudoTitreFiche');
    var pseudoFiche = window.document.getElementById('pseudo-fiche');
    var emailFiche = window.document.getElementById('email-fiche');
    var idModalTitleFiche =window.document.getElementById('idModalTitleFiche');
    // variables entrees du formulaires  
    var capturePhotoFileFiche = window.document.getElementById('capturePhotoFileFiche');
    var capturePhotoImgFiche = window.document.getElementById('capturePhotoImgFiche');
    var capturePhotoFileCoverFiche = window.document.getElementById('capturePhotoFileCoverFiche');
    var capturePhotoImgCoverFiche = window.document.getElementById('capturePhotoImgCoverFiche'); 
    var nomFiche =  window.document.getElementById('nom-fiche');
    var prenomFiche =  window.document.getElementById('prenom-fiche'); 
    var genreFiche =  window.document.getElementById('genre-fiche');
    var ageFiche = window.document.getElementById('age-fiche');
    var telephoneFiche = window.document.getElementById('telephone-fiche');
    var adresseFiche = window.document.getElementById('adresse-fiche');
    var cpFiche = window.document.getElementById('cp-fiche');
    var villeFiche = window.document.getElementById('ville-fiche');
    var paysFiche = window.document.getElementById('pays-fiche');
    var profilFiche = window.document.getElementById('profil-fiche');
    var preferenceFiche = window.document.getElementById('preference-fiche');
    var messageErrFicheInscrit = window.document.getElementById('idFicheMpAlertMsg');

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
    var idProfileMur= window.document.getElementById('idProfileMur')
    var formProfilInscription = window.document.getElementById('form-profil-inscription');
    var pseudoProfil = window.document.getElementById('pseudo-profil');
    var emailProfil = window.document.getElementById('email-profil');
    var capturePhotoFile = window.document.getElementById('capturePhotoFile');
    var capturePhotoImg = window.document.getElementById('capturePhotoImg');
    var capturePhotoFileCover = window.document.getElementById('capturePhotoFileCover');
    var capturePhotoImgCover = window.document.getElementById('capturePhotoImgCover');
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
    var idDiscussions  =  window.document.getElementById('idDiscussions');  
    var murPseudo = window.document.getElementById('mur-pseudo');
    var murEmail = window.document.getElementById('mur-email');
    var murAge = window.document.getElementById('mur-age');
    var murGenre = window.document.getElementById('mur-genre');
    var murProfil = window.document.getElementById('mur-profil');
    var murVille = window.document.getElementById('mur-ville');
    var murPreference = window.document.getElementById('mur-preference');
    var murPhotoProfil = window.document.getElementById('mur-photo-profile');
    var murPhotoCover = window.document.getElementById('mur-photo-cover');
    // variables entrees du formulaires   

//*****************************************/
// elements single page recherche d'amis
//*****************************************/   
    // Eléments de la page recherche amis
    var blockRechercheAmis =  window.document.getElementById('block-recherche-amis'); 
    var idRechercheAmis  =  window.document.getElementById('idRechercheAmis'); 
    var idAmisVersMur =  window.document.getElementById('amis-vers-mur');
    var idAmisVersMessages =  window.document.getElementById('amis-vers-messages');
    var amisPseudo = window.document.getElementById('amis-pseudo');
    var amisPhotoProfil = window.document.getElementById('amis-photo-profil');
    var amisPhotoCover = window.document.getElementById('amis-photo-cover');
    var formRechercheAmis =  window.document.getElementById('form-recherche-amis');
    var nomAmis =  window.document.getElementById('nom-amis');
    var prenomAmis =  window.document.getElementById('prenom-amis');
    var pseudoAmis =  window.document.getElementById('pseudo-amis');
    var tbodyResultat;    // tableau DOM resultat de la recherche des membres
    var tbodyExisteResultat = false; // variable pour identifier sur la tableau resultat recherche liste des membres existe
    var compteurAmis = 0;  // compteur nombre de clique sur la recherche d'amis

//*****************************************/
// elements single page messagerie instantannée
//*****************************************/   
    // Eléments de la page recherche amis
    var blockMessages =  window.document.getElementById('block-messages'); 
    var idRechercheAmis  =  window.document.getElementById('idRechercheAmis'); 
    var idMessagesVersMur =  window.document.getElementById('messages-vers-mur');
//   var idAmisVersMessages =  window.document.getElementById('amis-vers-messages');

//*****************************************/
// elements single page administrateur
//*****************************************/   
    // Eléments de la page administrateurs
    var blockAdministrateur =  window.document.getElementById('block-administrateur'); 
    var idProfilAdmin  =  window.document.getElementById('idProfilAdmin'); 
    var murPseudoAdmin = window.document.getElementById('mur-pseudo-admin'); 
    var tbody;    // tableau DOM liste des membres
    var compteurAdmin = 0;  // compteur nombre de clique sur le tableau de bord administrateur
    var tbodyExiste = false; // variable pour identifier sur la tableau liste des membres existe

//*******************************************************/
// elements single page administrateur détail d'un membre
//*******************************************************/  
    var blockDetailMembre =  window.document.getElementById('block-detail-membre');
    var idDasboard       =   window.document.getElementById('idDasboard');
    var pseudoDetail     =   window.document.getElementById('pseudo-detail');
    var detailPseudo      =   window.document.getElementById('detail-pseudo');
    var detailNom = window.document.getElementById('detail-nom');
    var detailPrenom = window.document.getElementById('detail-prenom');
    var detailTelephone = window.document.getElementById('detail-telephone');
    var detailEmail = window.document.getElementById('detail-email');
    var detailAge = window.document.getElementById('detail-age');
    var detailGenre = window.document.getElementById('detail-genre');
    var detailProfil = window.document.getElementById('detail-profil');
    var detailAdresse = window.document.getElementById('detail-adresse');
    var detailCp = window.document.getElementById('detail-cp');
    var detailVille = window.document.getElementById('detail-ville');
    var detailPays = window.document.getElementById('detail-pays');
    var detailPreference = window.document.getElementById('detail-preference');
    var detailPhotoProfil = window.document.getElementById('detail-photo-profile');
    var detailPhotoCover = window.document.getElementById('detail-photo-cover');
    var modifMembre = window.document.getElementById('modif-membre');
    var supprimeMembre = window.document.getElementById('supprime-membre');
//*****************************************/
// elements single page footer
//*****************************************/  
    
    var footerActivite = window.document.getElementById('footer-activite');   
    var nbrMembresConnectes = window.document.getElementById('nbr-membres-connectes');
    var nbrMessagesPublic = window.document.getElementById('nbr-messages-publies');
    var nbrVisiteursConnectes = window.document.getElementById('nbr-visiteurs-connectes');
   
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

// -------------------------------------------------------------------------------------
// Cette fonction initialise le contenu de la fenetre modale "membre supprimé"
// après la suppression réussit du membre
// -------------------------------------------------------------------------------------
    function initModalRecupTextSupprime(pModalTitleG, pModalBodyTextG) {
        pModalTitleG.innerText = 'Membre supprimé dans Adopte un Maitre'
        pModalBodyTextG.innerHTML = '<h2>Adopte un Maitre Team vous informe:</h2>';
        pModalBodyTextG.innerHTML += '<br /><p>Suppression réussit</p>';
        pModalBodyTextG.innerHTML += '<br /><p>Le membre a bien été supprimé dans la collection membres de la BDD Adopte un Maître !</p>';
        pModalBodyTextG.innerHTML += '<br /><p>Team Adopte un Maître!</p>';
    };

// -------------------------------------------------------------------------------------
// Cette fonction initialise le contenu de la fenetre modale "membre modifié"
// après la modification réussit du profil du membre
// -------------------------------------------------------------------------------------
    function initModalRecupTextModifie(pModalTitleG, pModalBodyTextG) {
        pModalTitleG.innerText = 'Membre modifié dans Adopte un Maitre'
        pModalBodyTextG.innerHTML = '<h2>Adopte un Maitre Team vous informe:</h2>';
        pModalBodyTextG.innerHTML += '<br /><p>Mise à jour réussit! </p>';
        pModalBodyTextG.innerHTML += '<br /><p>Le membre a bien été modifié dans la collection membres de la BDD Adopte un Maître !</p>';
        pModalBodyTextG.innerHTML += '<br /><p>Team Adopte un Maître!</p>';
    };

// -------------------------------------------------------------------------------------
// Cette fonction initialise le contenu de la fenetre modale "inscription administrateur"
// apres inscription réussit d'un administrateur du site
// -------------------------------------------------------------------------------------
    function initModalRecupTextBienvenueAdmin(pModalTitleG, pModalBodyTextG) {
        pModalTitleG.innerText = 'Administrateur inscrit avec succès dans Adopte un Maitre'
        pModalBodyTextG.innerHTML = '<h2>Adopte un Maitre Team vous informe:</h2>';
        pModalBodyTextG.innerHTML += "<br /><p>Vous faites partis de nos administrateurs</p>";
        pModalBodyTextG.innerHTML += "<br /><p>Vous avez accès à l'interface de gestion du site!</p>";
        pModalBodyTextG.innerHTML += '<br /><p>Bienvenue dans la Team Adopte un Maître!</p>';
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
        murPhotoProfil.setAttribute('src','static/images/membres/'+pObjetDuMembre.photoProfile);  
        murPhotoCover.setAttribute('src','static/images/membres/'+pObjetDuMembre.photoCover);     
        murPseudo.innerHTML = pObjetDuMembre.pseudo;
    
        if (pObjetDuMembre.ville == ''){
            murVille.innerHTML = 'Non renseigné'; 
        } else {
            murVille.innerHTML =  pObjetDuMembre.ville;
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

    
// -----------------------------------------------------------------------------
// Cette fonction ajoute un événement onclick à une ligne du tableau 
// tableau resultat-des-membres
// -----------------------------------------------------------------------------
    function addRowHandlersResultatMembres() {
        console.log('je suis dans la fonction addRowHandlersResultatMembres');
        var tableauResultatMembres = document.getElementById("resultat-des-membres");
        var rows = tableauResultatMembres.getElementsByTagName("tr");
        for (var j = 0; j < rows.length; j++) {
            var currentRow = tableauResultatMembres.rows[j];
            var createClickHandler = function(row) {
                return function() {
                    var cell = row.getElementsByTagName("td")[0];
                    var cella = cell.getElementsByTagName("a")[0];
                    var id = cella.innerHTML;
                    console.log("id:" + id);                    
                
                compteurAmis ++;   // on ajoute 1 au compteurAmis pour savoir si on créé le tableau resultat recherche liste des membres 
                console.log('compteur des cliques sur le tableau recherche amis compteurAmis:',compteurAmis);  
                console.log('objetDuMembre avant demande rajout ami',objetDuMembre);           
                webSocketConnection.emit('demandeRajoutAmi', id, objetDuMembre);  // Demande au serveur de rajouter ce membre dans la liste d'amis
                };
            };
        
        currentRow.onclick = createClickHandler(currentRow);
        
        }
    };
    
//************************************************************************************************************
// Fonction qui affichage sous forme de liste le résulat de la recherche de membres: photo nom prenom pseudo
//************************************************************************************************************
    var affichageResultatMembres = function(pObjetDesMembres) { 
        if (tbodyExisteResultat) {                                   // on verifie si le tableau resultat recherche des membres existe ou pas pour ne pas le créer deux fois
                console.log('tbodyExisteResultat :',tbodyExisteResultat);
                document.getElementById('table-resultat-membres').removeChild(tbodyResultat) // retire le tableau du DOM
        } 
            tbodyResultat = document.createElement('tbody');
            tbodyResultat.id = 'resultat-des-membres';
            document.getElementById('table-resultat-membres').appendChild(tbodyResultat); 
            tbodyExisteResultat = true;
            for (var i=0; i < pObjetDesMembres.length; i++) {            
            
                var today = getFormatDate(pObjetDesMembres[i].dateCreation);     // on met la date au bon format JJ/MM/AAAA
                
        // Création physique dynamique et ajout au DOM de la liste des membres: on crée une ligne psysique de chaque membre

                var tr = document.createElement('tr');
                document.getElementById('resultat-des-membres').appendChild(tr);      
            
                var td = document.createElement('td');
                tr.appendChild(td);

                var img = document.createElement('img');
                img.setAttribute('src','static/images/membres/'+ pObjetDesMembres[i].photoProfile,'alt', 'image');
                img.className='img-circle';
                td.appendChild(img);
                
                var a = document.createElement('a');
                a.id = 'resultat-pseudo'+[i];
                a.setAttribute ( 'href' , '#');
                a.className = 'user-link';
                a.innerHTML =  pObjetDesMembres[i].pseudo;
                td.appendChild(a); 

                var span = document.createElement('span');
                span.className = 'user-subhead';
                span.innerHTML = pObjetDesMembres[i].profil;
                td.appendChild(span);

                var td1 = document.createElement('td'); 
                td1.className = 'text-center'; 
                td1.id= 'resultat-nom'+[i];
                td1.innerHTML =  pObjetDesMembres[i].nom;  
                tr.appendChild(td1);

                var td2 = document.createElement('td'); 
                td2.className = 'text-center'; 
                td2.id= 'resultat-prenom'+[i];
                td2.innerHTML =  pObjetDesMembres[i].prenom;   
                tr.appendChild(td2);


                var td3 = document.createElement('td');
                td3.className = 'text-center'; 
                td3.id= 'resultat-date'+[i];
                td3.innerHTML = today;   
                tr.appendChild(td3);
                
                var td4 = document.createElement('td');       
                td4.setAttribute ( 'style' , 'width: 20%;');
                tr.appendChild(td4);

                var a4 = document.createElement('a');
                a4.id = 'suivre'+[i];
                a4.setAttribute ( 'href' , '#');
                a4.className = 'btn btn-azure btn-sm';  
                a4.innerHTML = 'Suivre'      
                td4.appendChild(a4); 

                var i1 = document.createElement('i');
                i1.className = 'fa fa-share';
                a4.appendChild(i1);


        }

        addRowHandlersResultatMembres(); // appel de la fonction qui permet de récuperer l'endroit où on a cliquer dans le tableau
    };


// -----------------------------------------------------------------------------
// Cette fonction ajoute un événement onclick à une ligne du tableau 
// tableau liste-des-membres
// -----------------------------------------------------------------------------
    function addRowHandlersListeMembres() {
        console.log('je suis dans la fonction addRowHandlersListeMembres');
        var tableauListeMembres = document.getElementById("liste-des-membres");
        var rows = tableauListeMembres.getElementsByTagName("tr");
        for (var j = 0; j < rows.length; j++) {
            var currentRow = tableauListeMembres.rows[j];
            var createClickHandler = function(row) {
                return function() {
                    var cell = row.getElementsByTagName("td")[0];
                    var cella = cell.getElementsByTagName("a")[0];
                    var id = cella.innerHTML;
                    console.log("id:" + id);
                    webSocketConnection.emit('demandeAffiMurDunMembre', id);  // Demande au serveur la liste de tous les membres   
                };
            };
        
        currentRow.onclick = createClickHandler(currentRow);
        
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
        if (tbodyExiste) {                                   // on verifie si le tableau des membres existe ou pas pour ne pas le créer deux fois
                console.log('tbodyExiste :',tbodyExiste);
                document.getElementById('table-liste-membres').removeChild(tbody) // retire le tableau du DOM
        } 
            tbody = document.createElement('tbody');
            tbody.id = 'liste-des-membres';
            document.getElementById('table-liste-membres').appendChild(tbody); 
            tbodyExiste = true;
            for (var i=0; i < pObjetDesMembres.length; i++) {            
            
                var today = getFormatDate(pObjetDesMembres[i].dateCreation);     // on met la date au bon format JJ/MM/AAAA
                
        // Création physique dynamique et ajout au DOM de la liste des membres: on crée une ligne psysique de chaque membre

                var tr = document.createElement('tr');
                document.getElementById('liste-des-membres').appendChild(tr);      
            
                var td = document.createElement('td');
                tr.appendChild(td);

                var img = document.createElement('img');
                img.setAttribute('src','static/images/membres/'+ pObjetDesMembres[i].photoProfile,'alt', 'image');
                img.className='img-circle';
                td.appendChild(img);
                
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
    
        }

        addRowHandlersListeMembres(); // appel de la fonction qui permet de récuperer l'endroit où on a cliquer dans le tableau
    };

// -----------------------------------------------------------------------------
// Cette fonction initialise les données d'un membre pour un administrateur
// sur la page détail d'un membre
// -----------------------------------------------------------------------------
    function initDetailMembre(pObjetDunMembre) {
        // affichage des donnees de la page du mur de profile du membre
    
        detailPseudo.innerHTML = pObjetDunMembre.pseudo;
        pseudoDetail.innerHTML = pObjetDunMembre.pseudo;
        detailPhotoProfil.setAttribute('src','static/images/membres/'+pObjetDunMembre.photoProfile);
        detailPhotoCover.setAttribute('src','static/images/membres/'+pObjetDunMembre.photoCover);

        if (pObjetDunMembre.ville == '') {
            detailVille.innerHTML = 'Non renseigné'; 
        } else {
            detailVille.innerHTML =  pObjetDunMembre.ville;
        } 

        switch(pObjetDunMembre.genre) {
            case 'F':                                           
            detailGenre.innerHTML = 'Femme';  
            break;
            case 'H':                        
            detailGenre.innerHTML = 'Homme';  
            break;
            case '':      
            detailGenre.innerHTML = 'Non renseigné';        
            break;
        };
        
        console.log(pObjetDunMembre.profil);
        switch(pObjetDunMembre.profil) {
            case 'AM':                                           
            detailProfil.innerHTML = 'Adopte un maître';  
            break;
            case 'AC':                        
            detailProfil.innerHTML = 'Adopte un chat';  
            break;
            case 'NSP':      
            detailProfil.innerHTML = 'Ne sais pas encore'; 
            break;
            case '':
            detailProfil.innerHTML = 'Non renseigné'; 
            break;
        };
                
        if (pObjetDunMembre.age == ''){
            detailAge.innerHTML = 'Non renseigné'; 
        } else {
            detailAge.innerHTML = pObjetDunMembre.age + ' ans';
        } 

        detailEmail.innerHTML   = pObjetDunMembre.email;  
        detailNom.innerHTML     = pObjetDunMembre.nom; 
        detailPrenom.innerHTML  = pObjetDunMembre.prenom;  
        detailCp.innerHTML      = pObjetDunMembre.cp;
        detailAdresse           = pObjetDunMembre.adresse;
        detailPays              = pObjetDunMembre.pays;
        detailTelephone         = pObjetDunMembre.telephone;

        if (pObjetDunMembre.preference == '') {
            detailPreference.innerHTML = 'Non renseigné'; 
        } else {
            detailPreference.innerHTML = pObjetDunMembre.preference;
        } 
        
    };

// -----------------------------------------------------------------------------
// Cette fonction initialise les données d'un membre pour un administrateur
// sur la page détail d'un membre
// -----------------------------------------------------------------------------
    function initFicheMembre(objetDunMembre) {
        // affichage des donnees de la  Fiche du membre qu'on souhaite modifier
        // affichage des donnees  du membre    
        capturePhotoImgFiche.setAttribute('src','static/images/membres/'+objetDunMembre.photoProfile);
        capturePhotoImgCoverFiche.setAttribute('src','static/images/membres/'+objetDunMembre.photoCover);
        idModalTitleFiche.innerHTML = objetDunMembre.pseudo;
        emailFiche.innerHTML = objetDunMembre.email; 
        pseudoFiche.value =  objetDunMembre.pseudo;   
        nomFiche.value =  objetDunMembre.nom;    
        console.log("fiche de renseignement  nomFiche.value", nomFiche.value);   
        prenomFiche.value =   objetDunMembre.prenom;
        genreFiche.value= objetDunMembre.genre;
        ageFiche.value= objetDunMembre.age;
        telephoneFiche.value= objetDunMembre.telephone;
        adresseFiche.value= objetDunMembre.adresse;
        cpFiche.value= objetDunMembre.cp;
        villeFiche.value= objetDunMembre.ville;
        paysFiche.value= objetDunMembre.pays;
        profilFiche.value= objetDunMembre.profil;
        preferenceFiche.value= objetDunMembre.preference;
        
    };


//************************************************************************************************************
// **********************        PARTIE COMMUNICATION AVEC LE SERVEUR WEB               ********************** 
// **********************           ****************  **************                    **********************      
// ***********************************************************************************************************  

//************************************************************************************************
// Verification que la connexion est établie avec le serveur sur le port:2000
//************************************************************************************************
    webSocketConnection.on('connexionServeurOK', function(msg) {
        console.log('msg',msg);    
    });

//************************************************************************************************
// Réception du nombre de membres connectés en temps réel
//************************************************************************************************
    webSocketConnection.on('nbMembresConnect', function(population) {
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
    webSocketConnection.on('nbMessagesPublic', function(nbMessagesPublic) {
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
        webSocketConnection.emit('controleConnection', objetDuVisiteur);  // Transmission au serveur des infos saisies

        pseudoConnect.value = ''                                 // RAZ des données de login saisies
        mpConnect.value = ''
    });

//************************************************************************************************************
// message au visiteur qui se connecte que le pseudo saisie n'existe pas
//***********************************************************************************************************
    webSocketConnection.on('messageNoConnection', function(message,pObjetMembre) { 
        pseudoConnect.value; 
        mpConnect.value = ''; 
        messageConnection.style.display= 'block';        
        setTimeout(function(){ messageConnection.style.display= 'none';},9000);      
    });


//************************************************************************************************************
// message au visiteur qui se connecte qu'il a déjà ouvert une session 
//***********************************************************************************************************
    webSocketConnection.on('membreDejaConnecte', function(data) { 
        pseudoConnect.value; 
        mpConnect.value = ''; 
        alert('Vous ne pouvez pas vous connecter car vous avez déjà ouvert une session');    
    });

// ***********************************************************************************************************
// message au visiteur qui change de mot de passe que le mot de passe saisie n'est pas valable
// ***********************************************************************************************************
    webSocketConnection.on('messagePbChangeRecupMp', function(message,pObjetMembre) { 
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
        webSocketConnection.emit('recupMotDePasse');           
    });

// ***********************************************************************************************************
// A l'évènement submit on envoi au serveur les données du formulaire de recuperation de mot de passe
// ***********************************************************************************************************
    formRecupMp.addEventListener('submit', function (event) { 
        event.preventDefault();        
        var email =  mailRecupMp.value;      // Mise en forme pour transmission au serveur des données saisies
        console.log("email pour recup mot de passe",email);   
        webSocketConnection.emit('envoieEmailRecupMp', email);  // Transmission au serveur des infos saisies
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
    webSocketConnection.on('sendFormulaireConnexion', function (data) { 
        console.log('ferme fenetre changement de mot de passe');   
        blockFormulaire.style.display = 'block'; 
        footerActivite.style.display = 'none';                      
        blockChangeMp.style.display = 'none';               
    });

// ***********************************************************************************************************
// Le visiteur a envoyé son adresse mail pour récuperer son mot de passe
// Message de confirmation d'envoie du mot de passe et affichage de la page pour changer de mot de passe
// ***********************************************************************************************************
    webSocketConnection.on('mailSendForRecupMp', function(pseudoRecup) { 
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
    webSocketConnection.on('messageNoRecupMpMail', function(message) { 
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
    
        webSocketConnection.emit('controleChangeMp', objetDuMembre);  // Transmission au serveur des infos saisies
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

        webSocketConnection.emit('controleInscription', objetDuVisiteur);  // Transmission au serveur des infos saisies
        pseudoInscription.value = '';                                    // RAZ des données de Sign-in saisies
        mailInscription.value = '';                                    // RAZ des données de Sign-in saisies
        mp1Inscription.value = '';
        mp2Inscription.value = '';       
    });

// ***********************************************************************************************************
// message au visiteur que l'adrese mail saisie existe déjà
// ***********************************************************************************************************
    webSocketConnection.on('messageNoInscription', function(message) { 
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
    webSocketConnection.on('message', function(message) { 
        var message = message; 
        alert(message.message);      
    });

// ***********************************************************************************************************
// message au visiteur qui se connecte avec un code administrateur 
// ***********************************************************************************************************
    webSocketConnection.on('inscriptionAdministrateur', function(message) { 
        initModalRecupTextBienvenueAdmin(vModalTitleG, vModalBodyTextG);
        $('#idGenericModal').modal('toggle');    // ouverture de la fenêtre modale inscription en tant qu'admin  ok      
    });

// ***********************************************************************************************************
// recoit changement mot de passe ok on cache la fenettre de changement de mot de passe 
// ***********************************************************************************************************
    webSocketConnection.on('mailSendInfoChangeMp', function(data) { 
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
    webSocketConnection.on('mailSendInfoChangeProfil', function(data) { 
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
    webSocketConnection.on('felicitationMembre', function(documents) {        
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
    webSocketConnection.on('disableConnectBtn', function() {
        deconnexion.setAttribute('class','dropdown-item');
        deconnexion.style.color = '#212529';           //      Activation du bouton 'Déconnexion'  
    });

// ***********************************************************************************************************
// ==> Activation du bouton "Administrateur si statut du membre = 1 ou 2
// *********************************************************************************************************** 
    webSocketConnection.on('disableAdministrateurBtn', function() {
        administrateur.setAttribute('class','dropdown-item');
        administrateur.style.color = '#212529';           //      Activation du bouton 'administrateur'  
    });

// ***********************************************************************************************************
// LE NOUVEAU MEMBRE FAIT PARTI DES CONNECTES A PRESENT ON LE REDIRIGE VERS SON PROFILE D'INSCRIPTION
// ***********************************************************************************************************
// ***********************************************************************************************************
// Le client reçoit toutes les données personnelles du membre inscrit
// ***********************************************************************************************************
    webSocketConnection.on('profileInscription', function(documents) {
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
       
        capturePhotoImg.setAttribute('src','static/images/membres/'+documents.photoProfile);
        console.log('documents.photoProfile',documents.photoProfile);
        console.log('capturePhotoImg',capturePhotoImg);
        capturePhotoImgCover.setAttribute('src','static/images/membres/'+documents.photoCover);
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
// A l'évènement submit on envoi au serveur les données du formulaire de renseignements de profil 
// ***********************************************************************************************************
    formProfilInscription.addEventListener('submit', function (event) { 
        event.preventDefault(); 
        window.scrollTo(0,0);  

    // Récupération de la photo de profil
        if (capturePhotoFile.value.length){                                                                 // Si une image a été choisie 
            objetDuMembre.photoProfile = capturePhotoFile.value.split('C:\\fakepath\\')[1];                // On ne garde que le nom de l'image pour la BDD
            siofu.submitFiles(capturePhotoFile.files);                                                    // Alors on la transfère vers le serveur
        } else {
            objetDuMembre.photoProfile = capturePhotoImg.getAttribute('src').split('static/images/membres/')[1]; 
        }

    // Récupération de la photo de couverture
        if (capturePhotoFileCover.value.length){                                                                 // Si une image a été choisie 
            objetDuMembre.photoCover = capturePhotoFileCover.value.split('C:\\fakepath\\')[1];                // On ne garde que le nom de l'image pour la BDD
            siofu.submitFiles(capturePhotoFileCover.files);                                                    // Alors on la transfère vers le serveur
        } else {
            objetDuMembre.photoCover = capturePhotoImgCover.getAttribute('src').split('static/images/membres/')[1]; 
        }

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
    
        webSocketConnection.emit('controleProfileInscription', objetDuMembre);  // Transmission au serveur des infos saisies
        
    });
// -------------------------------------------------------------------------
// Affiche l'image de profil apres l'avoir selectionné avec un input type="file"
// -------------------------------------------------------------------------
    capturePhotoFile.addEventListener("change", function(){
        capturePhotoImg.setAttribute('src',window.URL.createObjectURL(capturePhotoFile.files[0]));
    }, false);

// -------------------------------------------------------------------------
// Affiche l'image de couverture apres l'avoir selectionné avec un input type="file"
// -------------------------------------------------------------------------
    capturePhotoFileCover.addEventListener("change", function(){
        capturePhotoImgCover.setAttribute('src',window.URL.createObjectURL(capturePhotoFileCover.files[0]));
    }, false);

    // -------------------------------------------------------------------------
// Affiche l'image de profil apres l'avoir selectionné avec un input type="file"
// -------------------------------------------------------------------------
    capturePhotoFileFiche.addEventListener("change", function(){
        capturePhotoImgFiche.setAttribute('src',window.URL.createObjectURL(capturePhotoFileFiche.files[0]));
    }, false);

// -------------------------------------------------------------------------
// Affiche l'image de couverture apres l'avoir selectionné avec un input type="file"
// -------------------------------------------------------------------------
    capturePhotoFileCoverFiche.addEventListener("change", function(){
        capturePhotoImgCover.setAttribute('src',window.URL.createObjectURL(capturePhotoFileCoverFiche.files[0]));
    }, false);

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
    webSocketConnection.on('messageErrorProfilInscription', function(message) { 
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

        webSocketConnection.emit('controleParametreMp', objetDuMembre);  // Transmission au serveur des infos saisies
        ancienMp.value = '';                                   // RAZ des données saisies
        parametreMp1.value = '';                                   
        parametreMp2.value = '';    
    });

// ***********************************************************************************************************
// message au membre qui change de mot de passe que le mot de passe saisie n'est pas valable
// ***********************************************************************************************************
    webSocketConnection.on('messagePbParametreChangeMp', function(message,pObjetMembre) { 
        ancienMp.value = ''; 
        parametreMp1.value = ''; 
        parametreMp2.value = ''; 
        messageParametreMp.style.display= 'block';      
    });

// ***********************************************************************************************************
// Le membre a changé de mot de passe dans ses parametres de compte
// Message de confirmation d'envoie du nouveau mot de passe 
// ***********************************************************************************************************
    webSocketConnection.on('mailSendInfoParametreMp', function(data) { 
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
    webSocketConnection.on('profileConnect', function(documents) {
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
        capturePhotoImg.setAttribute('src','static/images/membres/'+documents.photoProfile);
        capturePhotoImgCover.setAttribute('src','static/images/membres/'+documents.photoCover);
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
        // affichage des donnees de la page recherche d'amis
        amisPhotoProfil.setAttribute('src','static/images/membres/'+objetDuMembre.photoProfile);  
        amisPhotoCover.setAttribute('src','static/images/membres/'+objetDuMembre.photoCover); 
        amisPseudo.innerHTML = objetDuMembre.pseudo; 
        
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

// ***********************************************************************************************************
// click sur lien messages on affiche la messagerie instantanée
// ***********************************************************************************************************
    idDiscussions.addEventListener('click', function (event) { 
        console.log('click de mur vers discussions');  
        // affichage des donnees de la page du mur de profile du membre
    //   initMurProfil(objetDuMembre);
        blockMurProfile.style.display = 'none';
        blockMessages.style.display = 'block';                     
    });

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


//***********************************************************************************************************
// PARTIE RECHERCHE D'AMIS
// ***********************************************************************************************************    

// ***********************************************************************************************************
// click sur lien mur de profile profile on affiche le mur de profile
// ***********************************************************************************************************
    idAmisVersMur.addEventListener('click', function (event) { 
        console.log('click de amis vers mur de  profile');  
        // affichage des donnees de la page du mur de profile du membre
    //   initMurProfil(objetDuMembre);
        blockMurProfile.style.display = 'block';                     
        blockRechercheAmis.style.display = 'none';
    });


// ***********************************************************************************************************
// click sur lien messages on affiche la messagerie instantanée
// ***********************************************************************************************************
    idAmisVersMessages.addEventListener('click', function (event) { 
        console.log('click de amis vers mur de  profile');  
        // affichage des donnees de la page du mur de profile du membre
    //   initMurProfil(objetDuMembre);
        blockMessages.style.display = 'block';                     
        blockRechercheAmis.style.display = 'none';
    });




//***********************************************************************************************************
// PARTIE RECHERCHE D'AMIS
// ***********************************************************************************************************    

// ***********************************************************************************************************
// click sur lien mur de profile profile on affiche le mur de profile
// ***********************************************************************************************************
    idMessagesVersMur.addEventListener('click', function (event) { 
        console.log('click de amis vers mur de  profile');  
        // affichage des donnees de la page du mur de profile du membre
    //   initMurProfil(objetDuMembre);
        blockMurProfile.style.display = 'block';                     
        blockMessages.style.display = 'none';
    });

// ***********************************************************************************************************
// Formulaire recherche d'amis:
// - par nom et/ou prénom et/ou pseudo
// A l'évènement submit on envoi au serveur les données du formulaire de recherche
// ***********************************************************************************************************
    formRechercheAmis.addEventListener('submit', function (event) { 
        event.preventDefault(); 
        window.scrollTo(0,0);  
        var objetRechercheDesMembres = {};
        if (compteurAmis > 0){
            tbodyExisteResultat = true; // on réinitialise le tableau pour chaque nouvelle recherche d'amis on detruit le tableau et on force sa création
        }
    //   Mise en forme pour transmission au serveur des données saisies  
        objetRechercheDesMembres.nom        =   nomAmis.value;
        objetRechercheDesMembres.prenom     =   prenomAmis.value;
        objetRechercheDesMembres.pseudo     =   pseudoAmis.value;
    
        console.log("objetDesMembres recherche amis  avant envoie au serveur web",objetRechercheDesMembres);

        webSocketConnection.emit('controleFormRechercheAmis', objetRechercheDesMembres);  // Transmission au serveur des infos saisies
        
    });

// ***********************************************************************************************************
// Le client  reçoit le résultat de la recherche de membres
// ***********************************************************************************************************
    webSocketConnection.on('resultatRecherche', function(objetResultatRecherche) {
        
        console.log('Resultat de la recherche liste des membres trouvés-- objetResultatRecherche:',objetResultatRecherche);
        affichageResultatMembres(objetResultatRecherche);          
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
        compteurAdmin ++;   // on ajoute 1 au compteurAdministrateur pour savoir si on créé le tableau liste des membres 
        console.log("compteur des cliques sur le tableau de bord Administrateur",compteurAdmin);
        murPseudoAdmin.innerHTML = objetDuMembre.pseudo; 
        // affichage liste des comptes des  membres       
        blockAdministrateur.style.display = 'block';                     
        blockFormulaire.style.display = 'none';
        blockMurProfile.style.display = 'none';
        blockProfilMembre.style.display ='none';
        blockRechercheAmis.style.display = 'none';
        blockMessages.style.display = 'none';
        webSocketConnection.emit('demandeListeMembres', objetDuMembre);  // Demande au serveur la liste de tous les membres
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
    webSocketConnection.on('SendlisteDesMembres', function(documents) {
        objetDesMembres = documents;
        console.log('liste de tous les membres -- objetDesMembres:',objetDesMembres);
        affichageListeMembres(objetDesMembres);          
    });   

//************************************************************************************************************
// message au membre qu'il n'est pas autorisé à consulter la liste des membres 
//***********************************************************************************************************
    webSocketConnection.on('messageNoAutorise', function(data) { 
        alert(data);    
    });

// ***********************************************************************************************************
// Le client qui est administrateur reçoit les données personnelles d'un membre:
// à lui maintenant d'afficher le mur de ce membre avec ses données
// ***********************************************************************************************************
    webSocketConnection.on('infoDunMembre', function(data) {
        objetDunMembre = data;
        console.log('info d un membre  -- objetDunMembre:',objetDunMembre);
        initDetailMembre(objetDunMembre);    // affichage des donnees d'un membre sur la page détail d'un membre
        blockAdministrateur.style.display = 'none';                     
        blockFormulaire.style.display = 'none';
        blockMurProfile.style.display = 'none';
        blockProfilMembre.style.display ='none';  
        blockDetailMembre.style.display ='block';    
    }); 

// ***********************************************************************************************************
// click sur lien tableau de bord on affiche le tableau de bord
// ***********************************************************************************************************
    idDasboard.addEventListener('click', function (event) { 
        console.log('click lien vers tableau de bord');         
        // affichage des donnees de la page administrateur
        if (compteurAdmin > 0){
            tbodyExiste = true; // comme il est possible que le membre est été supprimé on detruit le tableau et on force sa création
        }
        
        initMurProfil(objetDuMembre);    // affichage des donnees de la page du mur de profile du membre                          
        blockFormulaire.style.display = 'none';
        blockMurProfile.style.display = 'none';
        blockProfilMembre.style.display ='none';  
        blockDetailMembre.style.display ='none';  
        blockAdministrateur.style.display = 'block';      
    });

// ***********************************************************************************************************
// click sur bouton modifier la fiche du membre
// ***********************************************************************************************************
    modifMembre.addEventListener('click', function (event) { 
        console.log('click sur modifier membre');     
     //  console.log('objetDunMembre:',objetDunMembre);         
     //   webSocketConnection.emit('demandeSupprimeUnMembre', objetDunMembre);  // Demande au serveur la liste de tous les membres 
       initFicheMembre(objetDunMembre);
     
        $('#idFiche').modal('toggle');                                    // ouverture de la fenêtre modale fiche formulaire de renseignements du membre
    });   


// ***********************************************************************************************************
// Formulaire fiche d'un membre
// A l'évènement submit on envoi au serveur les données du formulaire de la fiche modifié
// ***********************************************************************************************************
    formFiche.addEventListener('submit', function (event) { 
        event.preventDefault(); 
        //   Mise en forme pour transmission au serveur des données saisies 

        // Récupération de la photo de profil
        if (capturePhotoFileFiche.value.length){                                                                 // Si une image a été choisie 
            objetDunMembre.photoProfile = capturePhotoFileFiche.value.split('C:\\fakepath\\')[1];                // On ne garde que le nom de l'image pour la BDD
            siofu.submitFiles(capturePhotoFileFiche.files);                                                    // Alors on la transfère vers le serveur
        } else {
            objetDunMembre.photoProfile = capturePhotoImgFiche.getAttribute('src').split('static/images/membres/')[1]; 
        }

        // Récupération de la photo de couverture
        if (capturePhotoFileCoverFiche.value.length){                                                                 // Si une image a été choisie 
            objetDunMembre.photoCover = capturePhotoFileCoverFiche.value.split('C:\\fakepath\\')[1];                // On ne garde que le nom de l'image pour la BDD
            siofu.submitFiles(capturePhotoFileCoverFiche.files);                                                    // Alors on la transfère vers le serveur
        } else {
            objetDunMembre.photoCover = capturePhotoImgCoverFiche.getAttribute('src').split('static/images/membres/')[1]; 
        }  
            
        objetDunMembre.nom         =   nomFiche.value;
        objetDunMembre.prenom      =   prenomFiche.value;
        objetDunMembre.genre       =   genreFiche.value;
        objetDunMembre.age         =   ageFiche.value;
        objetDunMembre.telephone   =   telephoneFiche.value;  
        objetDunMembre.adresse     =   adresseFiche.value;
        objetDunMembre.cp          =   cpFiche.value;
        objetDunMembre.ville       =   villeFiche.value;
        objetDunMembre.pays        =   paysFiche.value;
        objetDunMembre.profil      =   profilFiche.value;
        objetDunMembre.preference  =   preferenceFiche.value;
        
        console.log("objetDunMembre avant envoie au serveur web pour update ",objetDunMembre);
        $('#idFiche').modal('toggle');  // Fermeture de la fenêtre modale 
    
    
        webSocketConnection.emit('controleFicheModifDunMembre', objetDunMembre);  // Transmission au serveur des infos saisies
    });

    
// ***********************************************************************************************************
// on reçoit membre a bien été modifié
// ***********************************************************************************************************
    webSocketConnection.on('modifMembreParAdminOk', function(documents) {         
        console.log("membre modifié avec succès");
        objetDesMembres = documents;
        console.log('liste de tous les membres apres modif-- objetDesMembres:',objetDesMembres);
        tbodyExiste = true; // comme un membre a été modifié on detruit le tableau et on force sa création
        blockAdministrateur.style.display = 'block'; 
        blockDetailMembre.style.display = 'none';                       
        blockFormulaire.style.display = 'none';
        blockMurProfile.style.display = 'none';
        blockProfilMembre.style.display ='none';
        blockRechercheAmis.style.display = 'none';
        blockMessages.style.display = 'none';   
        affichageListeMembres(objetDesMembres);
        initModalRecupTextModifie(vModalTitleG, vModalBodyTextG);
        $('#idGenericModal').modal('toggle');    // ouverture de la fenêtre modale membre supprimé                 
    });

// ***********************************************************************************************************
// click sur bouton supprimer un membre
// ***********************************************************************************************************
    supprimeMembre.addEventListener('click', function (event) { 
        console.log('click sur supprime membre');     
        console.log('objetDunMembre:',objetDunMembre);         
        webSocketConnection.emit('demandeSupprimeUnMembre', objetDunMembre);  // Demande au serveur la liste de tous les membres 
    });

// ***********************************************************************************************************
// on reçoit membre a bien été supprimé
// ***********************************************************************************************************
    webSocketConnection.on('membreSupprimeOk', function(documents) {         
        console.log("membre supprimé avec succès");
        objetDesMembres = documents;
        console.log('liste de tous les membres -- objetDesMembres:',objetDesMembres);
        tbodyExiste = true; // comme un membre a été supprimé on detruit le tableau et on force sa création
        blockAdministrateur.style.display = 'block'; 
        blockDetailMembre.style.display = 'none';                       
        blockFormulaire.style.display = 'none';
        blockMurProfile.style.display = 'none';
        blockProfilMembre.style.display ='none';
        blockRechercheAmis.style.display = 'none';
        blockMessages.style.display = 'none';   
        affichageListeMembres(objetDesMembres);
        initModalRecupTextSupprime(vModalTitleG, vModalBodyTextG);
        $('#idGenericModal').modal('toggle');    // ouverture de la fenêtre modale membre supprimé                 
    });

    
});     