		/*DataSets URl*/
		const PARQUES = "dataSets/parques.geojson";
		const PARQUEADEROBICI = "http://datosabiertos.bogota.gov.co/api/action/datastore_search?resource_id=8457f9c1-53c7-40fd-8e38-2712de094de1&q=Parqueadero%20Bici";
		const CAI = "https://www.datos.gov.co/api/views/7pce-3uf3/rows.json?accessType=DOWNLOAD";
const BICIPARK = "https://datosabiertos.bogota.gov.co/dataset/287ab07c-b22b-4851-ab41-233708db0024/resource/1bcd9f68-0ac5-480a-a671-9bee0212b572/download/cicloparqueaderos_certificad.geojson";




		const CENTERMAP = {
		  lat: 4.659237,
		  lng: -74.092898
};


		//var json = require(PARQUES);

		/*JSON filtered */
		var infoRows = [];
		var nbInfo = [];
		/*Variables for GMaps*/
		var map;
		var markers = [];



		var parques = [];


		class Parque {
		  /*Parques en la ciudad*/
	constructor(id, nombre, coorCenter, localidad, coordLimit){
		this._id = id;
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

	get inventario() {
		return this._inventario;
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

		google.maps.event.addListener(this._parqueDibujo, 'click', function (event) {

//						$("#table").bootstrapTable('removeAll');

						$(Nombre).html(parques[this.id].nombre);
						$("#inventario").html(parques[this.id].inventario[0]);
						updateTable(parques[this.id].inventario);
		      console.log(parques[this.id].inventario);
		    });



		    return this._parqueDibujo;
		  }


		}



function coorGmaps(x, y) {
		  return new google.maps.LatLng(
				x,
				y,
			);
		}

		function updateTable(inventario) {
  $('#table').bootstrapTable({
    data: inventario,
    showExport: true,
    exportOptions: {
      fileName: 'AsinyTableFilter'
    },
		onClickRow: function (row, $element) {

			if (typeof (shapeActive) == "object" && typeof (neigMarkActive) == "object") {
        shapeActive.setVisible(false);
        for (var i = 0; i < neigMarkActive.length; i++) {
          neigMarkActive[i].setVisible(false);
        }
      };
      $element.css({
        backgroundColor: row.color
      });
      shapeActive = row.draw(row.color);
      neigMarkActive = row.drawNB();
      $('#nameBoro').html(row.borough);
      $('#numberCD').html("Community District : " + row.numberCD);
      drawChart(row.incomeUnits);
      drawPie(row.bedroomUnits);
      directionsRenderer.setMap(null);
      map.setCenter(row.neighborhoods[0].coorCenter);
      map.setZoom(13);
    },
  });
  /*Update text in button to export table*/
  $('.export .caret').html("Export To");
  $('.keep-open .caret').html("Columns");

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

		function detailFormatter(index, row) {
			 var html = [];
			 $.each(row, function (key, value) {
					 html.push('<p><b>' + key + ':</b> ' + value + '</p>');
			 });
			 return html.join('');
	 }

		function pullParques() {
			return new Promise(resolve => {
		fetch(PARQUES)
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
				resolve(markers);
				})

		}

		function pullBicis() {
			return new Promise(resolve => {
		var markers = [];
		  fetch("dataSets/biciParqueaderos.json")
		    .then(response => response.json())
		    .then(
		      json => {
						var image = {
								url: 'https://i.imgur.com/XwGlYlo.png',
							size: new google.maps.Size(45, 45),
							origin: new google.maps.Point(0, 0),
							anchor: new google.maps.Point(25, 45)
						};
		        console.log(json);
					for (var i = 0; i < json.length; i++) {
							var marker = setMarker(image,
								coorGmaps(json[i].Y,
								json[i].X), 'NYC University');

						}
						markers.push(marker);
		      }
		    );
			resolve(markers);
				})
		}
$('#chk1').change(function () {
		  var value = $(this).prop('checked');
	if (value) {
				/*Mostrar PARQUEADEROBICI*/
				pullBicis();
	} else {
				/*Esconder PARQUEADEROBICI*/

			}
		})

function pullInventario() {
			fetch("dataSets/inventario.json")
				.then(response => response.json())
				.then(
					json => {

				for (var i = 0; i < json.length; i++) {


					var found = parques.find(function (element) {
  return element.nombre == json[i].NOMBRE;
});

					if (found != null) {
		found.inventario.push(json[i]);
		console.log(found);
}



						}
					}
				);
		}


$("document").ready(async function () {

		   await pullParques();
			 await pullInventario();
	await pullBikePath();



		});





		/*Matriz que contiene los marcaadores para posicionar en el mapa*/
		function initMap() {
		  // Constructor creates a new map - only center and zoom are required.
		  map = new google.maps.Map(document.getElementById('map'), {
		    /*Aqui vive el mapa,se maneja dentro de la clase google.maps*/
		    center: CENTERMAP,
		    zoom: 13
		    /*29 niveles de zoom para iniciar la vista*/
		  });

		}
