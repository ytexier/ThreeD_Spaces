$(function() {
var code = $( "#code" ),
allFields = $( [] ).add( code ),
tips = $( ".validateTips" );
localStorage['maCle']="";

function updateTips( t ) {
tips
.text( t )
.addClass( "ui-state-highlight" );
setTimeout(function() {
tips.removeClass( "ui-state-highlight", 1500 );
}, 500 );
}
function checkLength( o, n, min, max ) {
if ( o.val().length > max || o.val().length < min ) {
o.addClass( "ui-state-error" );
updateTips( "Le  " + n + " doit etre d'une longueur de " +
min +"." );
return false;
} else {
return true;
}
}
function checkRegexp( o, regexp, n ) {
if ( !( regexp.test( o.val() ) ) ) {
o.addClass( "ui-state-error" );
updateTips( n );
return false;
} else {
return true;
}
}
$( "#dialog-form" ).dialog({
autoOpen: false,
height: 375,
width: 360,
modal: true,
buttons: {
"Valider": function() {
var bValid = true;
allFields.removeClass( "ui-state-error" );
bValid = bValid && checkLength( code, "Code", 6, 6 );
bValid = bValid && checkRegexp( code, /^([0-9])+$/i, "Le code est compose de 6 chiffres" );
if ( bValid ) {
var param= "adresse="+"http://www.kozikaza.com/wanaplan/"+code.val()+".json";

envoyerRequete( "recuperationJson.php",param , "wp2json", true);
$( this ).dialog( "close" );
}
},
"Annuler": function() {
$( this ).dialog( "close" );
}
},
close: function() {
allFields.val( "" ).removeClass( "ui-state-error" );
}
});
});

function initiateMusee(){

	//C'est ici que l'on récupère l'adresse du fichier JSon
	var param ="adresse="+"http://www.kozikaza.com/wanaplan/684861.json";
	envoyerRequete( "recuperationJson.php",param , "wp2json", true);
}

function initiateNouveau(){
	$( "#dialog-form" ).dialog( "open" );
}

function initiateEnter3D(){
	alert(localStorage['maCle']);
}


