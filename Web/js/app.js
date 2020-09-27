window.onload = function () {
  let mapa = Microsoft.Maps.Map(document.getElementById("mapa"), {
    center: new Microsoft.Maps.Location(-22.952696, -43.20208),
    zoom: 13,
  });
};
function formSubmit() {
  // Pega os dados do formulário
  let endereco = document.getElementById("endereco").value;
  let cidade = document.getElementById("cidade").value;

  // Pega a Latitude e Longitude
  let localizacao = [];
  pegarLocalizacao(endereco, cidade)
    .then((data) => {
      localizacao = data;
    })
    .then(() => {
      let todasEstacoes = [];
      buscarEstacoes()
        .then((data) => {
          todasEstacoes = data;
        })
        .then(() => {
          let estacaoMaisPerto = [];
          calcularEstacaoMaisPerto(
            todasEstacoes,
            localizacao[0],
            localizacao[1]
          ).then((data) => {
            estacaoMaisPerto = data;
            var mapa = new Microsoft.Maps.Map(document.getElementById("mapa"), {
              center: new Microsoft.Maps.Location(-22.952696, -43.20208),
              zoom: 12,
            });
            Microsoft.Maps.loadModule("Microsoft.Maps.Directions", function () {
              var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(
                mapa
              );
              for(pin of todasEstacoes){
                var loc = {latitude: parseFloat(pin[5]), longitude: parseFloat(pin[6])};
                var pushpin = new Microsoft.Maps.Pushpin(loc, null);
                mapa.entities.push(pushpin);
              }
              // Set Route Mode to walking
              directionsManager.setRequestOptions({
                routeMode: Microsoft.Maps.Directions.RouteMode.walking
              },{
                distanceUnity: Microsoft.Maps.Directions.DistanceUnit.km
              });
              var usuario_loc = new Microsoft.Maps.Directions.Waypoint({
                location: new Microsoft.Maps.Location(
                  parseFloat(localizacao[0]),
                  parseFloat(localizacao[1])
                ),
              });
              var estacao_loc = new Microsoft.Maps.Directions.Waypoint({
                location: new Microsoft.Maps.Location(
                  parseFloat(estacaoMaisPerto[5]),
                  parseFloat(estacaoMaisPerto[6])
                ),
              });
              directionsManager.addWaypoint(usuario_loc);
              directionsManager.addWaypoint(estacao_loc);
              // Set the element in which the itinerary will be rendered
              directionsManager.setRenderOptions({
                itineraryContainer: document.getElementById("itinerario"),
              });
              directionsManager.calculateDirections();
            });
          });
        });
    });
}

async function pegarLocalizacao(endereco, cidade) {
  let response = await fetch(
    "https://nominatim.openstreetmap.org/search?street=" +
      endereco +
      "&city=" +
      cidade +
      "&county=Brasil&format=json"
  );

  response = await response.json();

  let localizacao = [response[0]["lat"], response[0]["lon"]];

  return localizacao;
}

async function buscarEstacoes() {
  let response = await fetch(
    "http://dadosabertos.rio.rj.gov.br/apiTransporte/apresentacao/rest/index.cfm/estacoesBikeRio"
  );

  response = await response.json();

  let todasEstacoes = response["DATA"];

  return todasEstacoes;
}

function calcularDistacia(latitude_1, longitude_1, latitude_2, longitude_2) {
  let distancia = 0.0;
  distancia = parseFloat(
    Math.hypot(
      parseFloat(latitude_2) - parseFloat(latitude_1),
      parseFloat(longitude_2) - parseFloat(longitude_1)
    )
  );
  return distancia;
}

async function calcularEstacaoMaisPerto(todasEstacoes, latitude, longitude) {
  let estacaoMaisPerto = [];
  let menorDistancia = 0.0;
  let estacoes = [];
  for (estacoes of todasEstacoes) {
    if (estacoes == todasEstacoes[0]) {
      estacaoMaisPerto = estacoes;
      menorDistancia = calcularDistacia(
        latitude,
        longitude,
        estacoes[5],
        estacoes[6]
      );
    } else {
      let aux = calcularDistacia(latitude, longitude, estacoes[5], estacoes[6]);
      if (aux < menorDistancia) {
        menorDistancia = aux;
        estacaoMaisPerto = estacoes;
      }
    }
  }
  return estacaoMaisPerto;
}
