/*DataSets URl*/
const PARQUES = "";
const CENTERMAP = {lat:4.598889, lng:-74.080833 }; /*Position University*/


/*CD is a  COMMUNITY DISTRICT /
const coordUniversity={lat:40.7291, lng:-73.9965 }; /*Position University*/
/*JSON filtered */
var infoRows = [];
var nbInfo = [];
/*Variables for GMaps*/
var map;
var markers = [];



var shapePark = [];


class Park {
	/*Neighborhood in the 5 district */
	constructor(nombre,coorCenter,localidad,coordLimit) {
		this._name = nombre;
		this._coorCenter = coorCenter;/*Acomodar para si recibe POINT lo organize*/
		this._district = localidad;
		this._coordLimits = coordLimit;
		this._habitable = habitable;
		this._color = "#111111"; /*Dejar ramdom dentro del costructor para luego usar*/
	}
	get name() {
		return this._name;
	}

	get coorCenter(){
		return this._coorCenter;
	}

	get district(){
		return this._district;
	}

	get coordLimits(){
		return this._coordLimits;
	}

	get habitable(){
		return this._habitable;
	}

}
class CommunityDistrict {
	/*CommunityDistrict in the 5 district */
	constructor(num,coorCenter,coordLimits,habitable) {
		this._id = Number(num);
		this._coorCenter = coorCenter;/*Acomodar para si recibe POINT lo organize*/
		this._coordLimits = coordLimits;
		this._habitable = habitable;
		this._color = "#111111"; /*Dejar ramdom dentro del costructor para luego usar*/
	}
	get id() {
		return this._id;
	}

	get coorCenter(){
		return this._coorCenter;
	}
	get district(){
		return nameDistrict(this._id);
	}
	get coordLimits(){
		return this._coordLimits;
	}

	get habitable(){
		return this._habitable;
	}



}

function castToCoordinate( coordinates ){
	for (var i = 0; i < coordinates.length ; i++){
		var point = {
			lat: coordinates[1],
			lng: coordinates[0]
		}
	}
}

function getDataShapePark( url ){
	var data = $.get(url, () => {
	})
	.done(function () {
		var responseJSON = JSON.parse(data.responseText)
		for(var i = 0 ;i < responseJSON.features.length ;i++){
			var communityDistrict = new CommunityDistrict(
				responseJSON.features[i].properties.BoroCD,
				"",
				[],
				"true", /*Tem*/
			);
			shapePark.push(communityDistrict);
			/*Make object with contains of DataSets*/
		}



		for (var i = 0; i < responseJSON.features.length; i++) {
						if (responseJSON.features[i].geometry.type == "MultiPolygon") {
							for (var j = 0; j < responseJSON.features[i].geometry.coordinates.length; j++) {
								for (var g = 0; g < responseJSON.features[i].geometry.coordinates[j].length; g++) {
									var arra = [];
									for (var k = 0; k < responseJSON.features[i].geometry.coordinates[j][g].length; k++) {
										var point = {
											lat: responseJSON.features[i].geometry.coordinates[j][g][k][1],
											lng: responseJSON.features[i].geometry.coordinates[j][g][k][0]
										}
											arra.push(point);
									}
									shapePark[i]._coordLimits.push(arra);
								}
							}
						}else{
							for (var j = 0; j < responseJSON.features[i].geometry.coordinates.length; j++) {
								for (var g = 0; g < responseJSON.features[i].geometry.coordinates[j].length; g++) {
									var point = {
										lat: responseJSON.features[i].geometry.coordinates[j][g][1],
										lng: responseJSON.features[i].geometry.coordinates[j][g][0]
									}
									shapePark[i]._coordLimits.push(point);
								}
							}
						}
					}

			console.log(shapePark);
			drawNB();

})
.fail(function (error) {
	/**/
	console.error(error);
})
}



function getDataNeighborhood(URL){
	/*Como parametro podria tener la URL */
	var data = $.get(URL,function(){})
	.done(function(){
		let responseJSON = JSON.parse(data.responseText);
		for(var i = 0 ;i < data.responseJSON.data.length ;i++){
			var neighborhood = new Neighborhood(
				data.responseJSON.data[i][10],
				data.responseJSON.data[i][9],
				data.responseJSON.data[i][16],
				"", /*Tem*/
				"True" /*Tem*/
			);
			infoRows.push(neighborhood);
			/*Make object with contains of DataSets*/
		}
		console.log(infoRows);
		console.log(infoRows.sort(function(name){

		}));
})
.fail(function(error){
	console.log(error);
})
}


$("document").ready(function(){
	//var data =  getDataShapeDistric(SHAPECD);
	//drawNB();

});





/*Matriz que contiene los marcaadores para posicionar en el mapa*/
function initMap() {
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
		/*Aqui vive el mapa,se maneja dentro de la clase google.maps*/
		center: CENTERMAP,
		zoom: 11
		/*29 niveles de zoom para iniciar la vista*/
	});


	var image = {
		url: 'https://i.imgur.com/QDsm8jB.png',
		size: new google.maps.Size(45, 45),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(25,45 )
	};
	setMarker(image,CENTERMAP,'NYC University');

}


/*Functions for Google Maps*/

function setMarker(image,coordinates,textHover) {
	var marker = new google.maps.Marker({
		position:coordinates,
		map: map,
		/*Mapa donde se colocara el marker*/
		icon: image,
		title: textHover,
		/*Text show in event Hover*/
		zIndex: 100
	});
}
