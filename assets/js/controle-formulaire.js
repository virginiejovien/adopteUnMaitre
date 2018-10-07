'use strict';

$(document).ready(function () {

    $('#form-inscription').validate({ 
        rules: {
            nomInscrit: {
                required: true,
                minlength: 4,
                maxlength: 20,
                lettreAvecEspace: true
            },
            mailInscrit: {
                required: true,
                email: true
            },
            mpInscrit: {
                required: true,
                minlength: 6,
                maxlength: 10,
                Uppercase: true,
                LowserCase: true,
                Digit: true
            },
             mp2Inscrit: {
                equalTo: "#mp-inscription"
                }
        }
    });

    jQuery.validator.addMethod("lettreAvecEspace", function(value, element) { 
        return this.optional(element) || /^[a-z][a-z\s]*$/i.test(value); 
    }, "Lettres seulement"); 
    $.validator.addMethod("Uppercase", function (value, element) {
        return this.optional(element) || /[A-Z]/.test(value);
    }, "Entrer au moins une lettre majuscule");
    $.validator.addMethod("LowserCase", function (value, element) {
        return this.optional(element) || /[a-z]/.test(value);
    }, "Entrer au moins une lettre minuscule");
    $.validator.addMethod("Digit", function (value, element) {
        return this.optional(element) || /[0-9]/.test(value);
    }, "Entrer au moins un nombre");   
});

/*
$(document).ready(function(){
	// Ajout de notre méthode
	$.validator.addClassRules({
        checkinput:{
            required:true,
            minlength: 5,
            maxlength: 9
        },
        checkemail:{
            required:true,
            email: true
        }
    });
	// Initialisation du plugin
	$("#form-inscription").validate();
});*/
