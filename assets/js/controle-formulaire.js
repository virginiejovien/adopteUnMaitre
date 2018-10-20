'use strict';

$(document).ready(function () {

    $('#form-connection').validate({ 
        rules: {          
            mail: {
                required: true,
                email: true,
                valideEmail: true
            },
            mp: {
                required: true,
                minlength: 6,
                maxlength: 10,
                Uppercase: true,
                LowserCase: true,
                Digit: true
            }
        },
        
        highlight: function ( element, errorClass, validClass ) {
            $( element ).parents( ".form-group" ).addClass( "has-error" ).removeClass( "has-success" );
        },
        unhighlight: function (element, errorClass, validClass) {
            $( element ).parents( ".form-group" ).addClass( "has-success" ).removeClass( "has-error" );
        }
    });

    $('#form-inscription').validate({ 
        rules: {
            pseudoInscrit: {
                required: true,
                minlength: 4,
                maxlength: 30,
                lettreAvecEspace: true
            },
            mailInscrit: {
                required: true,
                email: true,
                valideEmail: true
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
        },
        
        highlight: function ( element, errorClass, validClass ) {
            $( element ).parents( ".form-group" ).addClass( "has-error" ).removeClass( "has-success" );
        },
        unhighlight: function (element, errorClass, validClass) {
            $( element ).parents( ".form-group" ).addClass( "has-success" ).removeClass( "has-error" );
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
    $.validator.addMethod('valideEmail', function (value, element) {
        return this.optional(element) || /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
    }, "Veuillez fournir une adresse mail valide");

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
