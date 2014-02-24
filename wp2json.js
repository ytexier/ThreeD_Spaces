// Retourne le le point d'intersection entre le segment [(x0,y0),(x1,y1)] et une ligne partant du point (x,y)
function intersectionPoint(x, y, x0, y0, x1, y1){
    if(!(x1 - x0))
        return {x: x0, y: y};
    else if(!(y1 - y0))
        return {x: x, y: y0};
    var left, tg = -1 / ((y1 - y0) / (x1 - x0));
    return {x: left = (x1 * (x * tg - y + y0) + x0 * (x * - tg + y - y1)) / (tg * (x1 - x0) + y0 - y1), y: tg * left - tg * x + y};
}

function wp2json(jsonWP)
{
	var json;
	
	$.getJSON("wpObjects.json", function (data) {
		async : false
	
		var nbEtages = 0;
		var nbMurs = 0;
		var nbPortes = 0;
		var nbFenetres = 0;
		var nbPeintures = 0;
	
		// Nom du plan
		json = "{\"name\": \"" + data.name + "\",";
		
		// Etages
		json += "\"floors\": [";
		
		for (var obj in data.members) { nbEtages++; }
		
		var nbEtagesCurr = 0;
		for (var etage in data.members)
		{
			nbEtagesCurr++;
			json += "{";
			
			// Calcul de la superficie d'un étage en ne prenant que les 4 premiers points (les autres décrivant les murs intérieurs)
			var arrayPoint = new Array();
			var arrayDim = new Array();
			var aire = 0;
			for (var obj in data.members[etage].points)
			{
				if (obj < 4)
				{
					var tmp = {};
					tmp['x'] = parseInt(data.members[etage].points[obj].x);
					tmp['y'] = parseInt(data.members[etage].points[obj].y);
					arrayPoint.push(tmp);
				}
			}
			
			var longueur = Math.sqrt(Math.pow((arrayPoint[1].x-arrayPoint[0].x),2) + Math.pow((arrayPoint[1].y-arrayPoint[0].y),2));
			var largeur = Math.sqrt(Math.pow((arrayPoint[2].x-arrayPoint[1].x),2) + Math.pow((arrayPoint[2].y-arrayPoint[1].y),2));
			
			aire = longueur * largeur;
			
			var hauteurMax = 0;
			for (var obj in data.members[etage].walls)
			{
				if (data.members[etage].walls[obj].height > hauteurMax)
					hauteurMax = data.members[etage].walls[obj].height;
			}
			
			json += "\"r\": " + data.members[etage].elevation + ",";
			json += "\"width\": " + aire + ",";
			json += "\"height\": " + hauteurMax + ",";
			json += "\"depth\": " + "0,";
			json += "\"texture\": " + "\"\",";
			json += "\"walls\": [";
			
			// Murs
			nbMurs = 0;
			for (var obj in data.members[etage].walls) { nbMurs++; }
			
			var nbMursCurr = 0;
			for (var mur in data.members[etage].walls)
			{
				nbMursCurr++;
				
				var pointsIds1 = data.members[etage].walls[mur].pointsIds[0];
				var pointsIds2 = data.members[etage].walls[mur].pointsIds[1];
				var x1 = parseInt(data.members[etage].points[pointsIds1].x);
				var y1 = parseInt(data.members[etage].points[pointsIds1].y);
				var x2 = parseInt(data.members[etage].points[pointsIds2].x);
				var y2 = parseInt(data.members[etage].points[pointsIds2].y);
				
				var xMur = (x1 + x2) / 2;
				var yMur = (y1 + y2) / 2;
				
				var taille = Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
				
				json += "{";
				
				json += "\"width\": " + taille + ",";
				json += "\"height\": " + data.members[etage].walls[mur].height + ",";
				json += "\"depth\": " + data.members[etage].walls[mur].thickness + ",";
				json += "\"posX\": " + xMur + ",";
				json += "\"posZ\": " + yMur + ",";
				json += "\"angle\": " + "0,";
				json += "\"texture\": " + "\"\",";
				json += "\"doors\":[";
				
				// Portes
				nbPortes = 0;
				for (var obj in data.members[etage].overtures) {
					if (data.members[etage].overtures[obj].type == "Door" || data.members[etage].overtures[obj].type == "Overture")
					{
						nbPortes++;
					}
				}
				
				var nbPortesCurr = 0;
				for (var porte in data.members[etage].overtures)
				{
					if (data.members[etage].overtures[porte].type == "Door" || data.members[etage].overtures[obj].type == "Overture")
					{
						// Test pour savoir si l'ouverture se trouve sur le mur en question
						if (data.members[etage].overtures[porte].parentWallId == mur)
						{
							nbPortesCurr++;
							json += "{";
							
							json += "\"width\": " + data.members[etage].overtures[porte].width + ",";
							json += "\"height\": " + data.members[etage].overtures[porte].height + ",";
							json += "\"posX\": " + data.members[etage].overtures[porte].position.x + ",";
							json += "\"posZ\": " + data.members[etage].overtures[porte].position.z;
							
							json += "}";
							if (nbPortesCurr != nbPortes)
							{
								json += ",";
							}
						}
					}
				}
					
				// ] du "doors"
				json += "],";
				
				json += "\"windows\": [";
				
				// Fenetres
				nbFenetres = 0;
				for (var obj in data.members[etage].overtures) {
					if (data.members[etage].overtures[obj].type == "Window")
					{
						nbFenetres++;
					}
				}
				
				var nbFenetresCurr = 0;
				for (var fenetre in data.members[etage].overtures)
				{
					if (data.members[etage].overtures[fenetre].type == "Window")
					{
						if (data.members[etage].overtures[fenetre].parentWallId == mur)
						{
							nbFenetresCurr++;
							json += "{";
							
							json += "\"width\": " + data.members[etage].overtures[fenetre].width + ",";
							json += "\"height\": " + data.members[etage].overtures[fenetre].height + ",";
							json += "\"posX\": " + data.members[etage].overtures[fenetre].position.x + ",";
							json += "\"posY\": " + data.members[etage].overtures[fenetre].position.y + ",";
							json += "\"posZ\": " + data.members[etage].overtures[fenetre].position.z;
							
							json += "}";
							if (nbFenetresCurr != nbFenetres)
							{
								json += ",";
							}
						}
					}
				}
				
				// ] du "windows"
				json += "],";
				
				json += "\"paintings\": [";
				
				// Peintures
				/** Problème : pas de référence au mur **/
				nbPeintures = 0;
				for (var obj in data.members[etage].objects) { nbPeintures++; }
				
				var nbPeinturesCurr = 0;
				for (var peinture in data.members[etage].objects)
				{
					// Peinture sur le mur courant
					var x = data.members[etage].objects[peinture].position.x;
					var y = data.members[etage].objects[peinture].position.z;
					var intersect = intersectionPoint(x,y,x1,y1,x2,y2);
					var dist = Math.sqrt(Math.pow((intersect.x-x),2) + Math.pow((intersect.y-y),2));
					
					if (dist <= 25)
					{
						nbPeinturesCurr++;
						json += "{";
						
						json += "\"posX\": " + data.members[etage].objects[peinture].position.x + ",";
						json += "\"posY\": " + data.members[etage].objects[peinture].position.y + ",";
						json += "\"posZ\": " + data.members[etage].objects[peinture].position.z;
						
						json += "}";
						if (nbPeinturesCurr != nbPeintures)
						{
							json += ",";
						}
					}
				}
				
				// ] du "paintings"
				json += "]";
				
				json += "}";
				if (nbMursCurr != nbMurs)
				{
					json += ",";
				}
			}
			
			// ] du "walls"
			json += "],";
			
			
			// Objets
			json += "\"objects\": [";
			
			nbObjets = 0;
			for (var obj in data.members[etage].objects) { nbObjets++; }
			
			var nbObjetsCurr = 0;
			for (var objet in data.members[etage].objects)
			{
				// Objets autre que les tableaux
				if (data.members[etage].objects[objet].filename != "PhotoFrame.js")
				{
					nbObjetsCurr++;
					
					json += "{";
					
					json += "\"posX\": " + data.members[etage].objects[objet].position.x + ",";
					json += "\"posZ\": " + data.members[etage].objects[objet].position.z + ",";
					json += "\"model\": " + "\"\"";
					
					json += "}";
					if (nbObjetsCurr != nbObjets)
					{
						json += ",";
					}
				}
			}
			// ] du "objects"
			json += "],";
			
			json += "}";
			if (nbEtagesCurr != nbEtages)
			{
				json += ",";
			}
		}
		
		// ] du "floors"
		json += "]";
		
		json += "}";
		
		document.write(json);
		//return json;
	});
	//return json;
}