<?php
function copie_fichier_distant($fichier_source, $fichier_cible) {
// ---------------- Ouverture et lecture du fichier distant ----------------
//Ouverture du fichier $fichier
$fichierouvert = fopen ($fichier_source, "r");
// Initialisation de la variable contenu
$contenu ="";
//Mise en m?moire du fichier dans une variable $contenu
while (!feof($fichierouvert)) {
$contenu .= fread($fichierouvert, 8192);
}
fclose ($fichierouvert);
 
// ---------------- Cr?ation et ?criture du fichier local ----------------
//Ouverture du fichier de destination
$fichierouvert = fopen ($fichier_cible, "w+");
//Copie du fichier
if ( !fwrite($fichierouvert, $contenu)) {
echo "Impossible d'?crire dans le fichier ($filename)";
exit;
}
//Fermeture du fichier
fclose ($fichierouvert);
}

if (isset ($_POST['adresse'])and $_POST['adresse'] != "undefined")
{
	
	$adresse=$_POST['adresse'];
	// $adresse="http://www.kozikaza.com/wanaplan/684861.json";

	$pattern = '#^[\D]+([0-9]{6}).*$#';
	preg_match($pattern, $adresse, $matches);
	
	$fichier="./".$matches[1].".json";
	copie_fichier_distant($adresse,$fichier);
	echo $fichier;
}
else echo "Erreur";
?>