'use strict';
/*
$(function(){
    $("form").on("submit", function() {
      if($("input").val().length < 4) {
        $("div.form-group").addClass("has-error");
        $("div.alert").show("slow").delay(4000).hide("slow");
        return false;
      }
    });
  }); 
*/
$(document).ready(function(){
	// Ajout de notre méthode
	$.validator.addClassRules({
        checkinput:{
           
       
            minlength: 5,
            maxlength: 5
        },
        checkemail:{
         
            email: true
        }
    });
	// Initialisation du plugin
	$("#form-inscription").validate();
});
