'use strict';
$(document).ready(function () {

    $('#form-inscription').validate({ // initialize the plugin
        rules: {
            pseudoInscrit: {
                required: true,
                minlength: 4,
                maxlength: 15
            },
            mailInscrit: {
                required: true,
                email: true
            },
            mpInscrit: "required",
            mp2Inscrit: {
            equalTo: "#mp-inscription"
    }
        }
    });

});/*
jQuery . validateur . addMethod ( "extension" , fonction ( valeur , élément , param ) { 
                param = typeof param === "chaîne" ? param . remplacer ( /, / g , '|' ) : "png | jpe? g | gif" ; retourner ce . en option ( élément ) || valeur . correspondance ( nouveau         
                   RegExp ( ". (" + Param + ") $" , "i" )); }, jQuery . format ( "Veuillez entrer une valeur avec une extension valide." ));   */