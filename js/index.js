		/*DataSets URl*/
		const PARQUES = "dataSets/parques.geojson";
		const PARQUEADEROBICI = "http://datosabiertos.bogota.gov.co/api/action/datastore_search?resource_id=8457f9c1-53c7-40fd-8e38-2712de094de1&q=Parqueadero%20Bici";

		const CENTERMAP = {
		  lat: 4.598889,
		  lng: -74.080833
		}; /*Position University*/
		//var json = require(PARQUES);

		/*CD is a  COMMUNITY DISTRICT /
		const coordUniversity={lat:40.7291, lng:-73.9965 }; /*Position University*/
		/*JSON filtered */
		var infoRows = [];
		var nbInfo = [];
		/*Variables for GMaps*/
		var map;
		var markers = [];



		var parques = [];

		function mostrarDatos(event) {


		  console.log(this.prototype);
		}

		class Parque {
		  /*Parques en la ciudad*/
		  constructor(id, nombre, coorCenter, localidad, coordLimit) {
		    this._id = id,
		      this._nombre = nombre;
		    this._coorCentro = coorCenter; /*Acomodar para si recibe POINT lo organize*/
		    this._localidad = localidad;
		    this._limites = coordLimit;
		    this._color = "#111111"; /*Dejar ramdom dentro del costructor para luego usar*/
		    this._parqueDibujo,
				this._inventario = []
		  }
		  get id() {
		    return this._id;
		  }
		  get nombre() {
		    return this._nombre;
		  }

		  get coorCentro() {
		    return this._coorCentro;
		  }

		  get localidad() {
		    return this._localidad;
		  }

		  get limites() {
		    return this._limites;
		  }

		  get color() {
		    return this._color;
		  }

			get inventario(){
				return this._inventario	;
			}

		  draw(fill) {
		    this._parqueDibujo = new google.maps.Polygon({
		      paths: this._limites,
		      strokeColor: this._color,
		      strokeWeight: 2,
		      fillColor: fill,
		    });
		    this._parqueDibujo.setMap(map);

		    this._parqueDibujo.id = this.id;

		    google.maps.event.addListener(this._parqueDibujo, 'click', function(event) {
		      console.log(parques[this.id]);
		    });



		    return this._parqueDibujo;
		  }


		}

		function mostrarDatos(action) {
		  console.log(action);
		}
		function coorGmaps(x,y){
		  return new google.maps.LatLng(
				x,
				y,
			);
		}
		function setMarker(image, coordinates, textHover) {
		  var marker = new google.maps.Marker({
		    position: coordinates,
		    map: map,
		    /*Mapa donde se colocara el marker*/
		    icon: image,
		    title: textHover,
		    /*Text show in event Hover*/
		    zIndex: 100
		  });
		  marker.setMap(map);
		  return marker;
		}

		function pullParques() {
		  fetch("dataSets/parques.geojson")
		    .then(response => response.json())
		    .then(
		      json => {
		        for (var i = 0; i < json.features.length; i++) {

		          var limites = [];
		          for (var j = 0; j < json.features[i].geometry.coordinates[0][0].length; j++) {
								var point = coorGmaps(
		              json.features[i].geometry.coordinates[0][0][j][1],
		              json.features[i].geometry.coordinates[0][0][j][0],
		            );
		            limites.push(point);
		          }
		          var init = json.features[i].properties.description.indexOf("NOMBRE</td>\n\n<td>");
		          var end = json.features[i].properties.description.indexOf("</td>\n\n</tr>\n\n<tr bgcolor=");

		          var name = json.features[i].properties.description.substring(end + 46, init + 26);
		          data = json.features[i].properties.description.split("td>")
		          park = new Parque(
		            i,
		            data[14].substring(0, data[14].length - 2),
		            "",
		            "",
		            limites,
		          );
		          park.draw("green");
		          parques.push(park);
		        }
		        console.log(parques);
		      }
		    );

		}

		function pullBicis() {
		  fetch("dataSets/biciParqueaderos.json")
		    .then(response => response.json())
		    .then(
		      json => {
						var image = {
							url: 'https://i.imgur.com/QDsm8jB.png',
							size: new google.maps.Size(45, 45),
							origin: new google.maps.Point(0, 0),
							anchor: new google.maps.Point(25, 45)
						};
		        console.log(json);
						for(var i = 0; i < json.length ;i++ ){
							markerNYU = setMarker(image,
								coorGmaps(json[i].Y,
													json[i].X)
													, 'NYC University');

						}
		      }
		    );
		}

		function pullInventario(){
			fetch("dataSets/inventario.json")
				.then(response => response.json())
				.then(
					json => {

						for (var i =0 ; i <json.length;i++){


var found = parques.find(function(element) {
  return element.nombre == json[i].NOMBRE;
});

if (found != null){
		found.inventario.push(json[i]);
		console.log(found);
}



						}
					}
				);
		}


		$("document").ready(function() {

		  pullParques();

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
		    anchor: new google.maps.Point(25, 45)
		  };
		  setMarker(image, CENTERMAP, 'NYC University');

		}
