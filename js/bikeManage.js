/*En este archivo se establecen las funcionalidades y servicios que estaran disponibles para los BiciUsuarios

*/
const BIKEPATH = "https://datosabiertos.bogota.gov.co/dataset/fe3b2925-3e76-4928-9a01-91cbd2e02f3b/resource/0ee86336-840a-458b-8e90-65a8bd10a927/download/cicl.geojson";



function pullBikePath() {

	map.data.loadGeoJson(BIKEPATH);
	map.data.setStyle({
		fillColor: 'green',
		strokeColor: 'blue'
    });

}