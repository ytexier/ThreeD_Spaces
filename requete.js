
// structure de requete
var requete = null,
requete = initialiserRequete(),
//le retour de la fonction
retourFnct="";

/**************************************************************/

// Initialisation d'une requete suivant le navigateur
function initialiserRequete()
{
	
	
	try 
		{
			requete = new XMLHttpRequest();
		} 
	catch (essaimicrosoft) 
	{
		try 
		{
			requete = new ActiveXObject("Msxml2.XMLHTTP");
		} 
		catch (autremicrosoft) 
		{
			try 
			{
				requete = new ActiveXObject("Microsoft.XMLHTTP");
			} 
			catch (echec) 
			{
				requete = null;
				alert("flute");
			}
		}
	}

	if (requete == null)
	  alert("Impossible de créer l'objet requête!");

	  return requete;
}
  





//récupération du résultat d'un script PHP
function recupererDonneesPhp()
{
	
	if (requete.readyState == 4) 
	{
		if (requete.status == 200 || requete.status == 0) 
		{
		  
		  var reponse = requete.responseText;
		  //on enlève les caractère de retour à la ligne
		  reponse = reponse.replace(String.fromCharCode(13) + String.fromCharCode(10), "" );
			// alert("la reponse recuperee "+reponse);
			return reponse;

		}
		else 
		{
		  var message = requete.getResponseHeader("Statut");
		  if ((message == null) || (message.length <= 0)) 
		  {
			alert("Erreur ! Le statut de la requête est " + requete.status);
		  } 
		  else 
		  {
			alert(message);
		  }
		}
    }

}





// Envoie de la requete au script PHP
// url : l'url du script PHP
// les paramètre à envoyer au script sous la forme du chaines de variables GET
//fonction, la fonction de traitement du résultat
// synchro :true  si doit etre asynchrone, false sinon
function envoyerRequete( url, params, fonction, synchro)
{
	
	// alert (params);
	requete.open("POST", url, synchro);
	requete.onreadystatechange= function(){
	var resultat=recupererDonneesPhp();
	
	
	if (resultat!= null)
	{
	// alert("resultat pas null");
		if (fonction == -1)
		{
			// alert("bien pris en compte" + retour);
			$('#retourTemp').html(resultat);
			// alert ("ok "+resultat); 
			// alert ($('#retourTemp').html());
			return;
			
		}
		else
		{
			// alert ("resultat =" + resultat + "aaaa");
			var fnct= fonction+'("'+resultat+'")';
			fnct = fnct.replace(String.fromCharCode(13) + String.fromCharCode(10), "" );
			// alert("Retour requete "+fnct);
			eval(fnct);
			return true;// alert ("dude :"+ retour);  
		}
	}
	
	}
	
	
	requete.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	requete.setRequestHeader("Content-length", params.length);
	requete.setRequestHeader("Connection", "close");
	requete.send(params);
	
	
}
