// -----------------------------------------------------------------------------
    // Cette fonction met à jour l'avatar (si aucune photo n a été chargée), avec une 
    // silhouette Profil par défaut, en concordance avec la sélection du sexe
    // 
    // Si pas de photo, initialiser avec l avatar correspondant au sexe
    // et le faire vivre a chaque changement de sexe
    // Sinon, ignorer les changements de sexe
    // -----------------------------------------------------------------------------
    function updateAvatar(pIndex){ 
        var myPhoto = vAccountPhotoImg.getAttribute('src').split('static/images/members/')[1];

        if (myPhoto){
            if (myPhoto.startsWith('default-avatar-')){
                switch (pIndex){
                    case 0 :
                    vAccountPhotoImg.setAttribute('src', 'static/images/members/default-avatar-inconnu.png');
                    break;
                    case 1 :
                    vAccountPhotoImg.setAttribute('src', 'static/images/members/default-avatar-male.png');
                    break;
                    case 2 :
                    vAccountPhotoImg.setAttribute('src', 'static/images/members/default-avatar-female.png');
                    break;
                }
            } 
        }
    }