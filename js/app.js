function formSubmit() {
  // Pega os dados do formulário
  let endereco = document.getElementById("endereco").value;
  let cidade = document.getElementById("cidade").value;
  let mapa = Microsoft.Maps.Map(document.getElementById("mapa"),{
    center : new Microsoft.Maps.Location(-22.952696, -43.202080),
    zoom : 12
  });

 

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
            Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function(){
              let directionsManager = new Microsoft.Maps.Directions.directionsManager(mapa);
              directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.walking });
              var waypoint1 = new Microsoft.Maps.Directions.Waypoint({ address: 'Minha Localização', location: new Microsoft.Maps.Location(parseFloat(localizacao[0]), parseFloat[1]) });
              var waypoint2 = new Microsoft.Maps.Directions.Waypoint({ address: 'Localização da estação', location: new Microsoft.Maps.Location(estacaoMaisPerto[5], estacaoMaisPerto[6]) });
              directionsManager.addWaypoint(waypoint1);
              directionsManager.addWaypoint(waypoint2);
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
  }     //fghfghfghfgjghjghkjkhjkhjlhjkl
  return estacaoMaisPerto;
}
