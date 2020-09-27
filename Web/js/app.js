window.onload = function () {                                      //Inicializa o mapa do Rio de Janeiro
  let mapa = Microsoft.Maps.Map(document.getElementById("mapa"), {
    center: new Microsoft.Maps.Location(-22.952696, -43.20208),
    zoom: 13,
  });
};
function formSubmit() {
  // Pega os dados do formulário
  let endereco = document.getElementById("endereco").value;
  let cidade = document.getElementById("cidade").value;

  // Chama a função pegarLocalização e aguarda as coordenadas do endereço digitado pelo usuario.
  let localizacao = [];
  pegarLocalizacao(endereco, cidade)
    .then((data) => {    // Ao recever as coordenadas do endereço escreve na variavel localização
      localizacao = data;
    })
    .then(() => {       // Chama a função que busca as estações
      let todasEstacoes = [];
      buscarEstacoes()
        .then((data) => { // Espera a função retornar a resposta da requisição e armazena na variavel todasEstações.
          todasEstacoes = data;
        })
        .then(() => {     // Chama a função que calcula a estação BikeRio mais proxima do usuario
          let estacaoMaisPerto = [];
          calcularEstacaoMaisPerto(
            todasEstacoes,
            localizacao[0],
            localizacao[1]
          ).then((data) => {  // Espera o retorno da função com a estação mais proxima.
            estacaoMaisPerto = data;
            var mapa = new Microsoft.Maps.Map(document.getElementById("mapa"), {    //Chama API do Bing Maps que desenha um mapa com a localização do usuario no centro.
              center: new Microsoft.Maps.Location(-22.952696, -43.20208),
              zoom: 12,
            });
            Microsoft.Maps.loadModule("Microsoft.Maps.Directions", function () {    // Carrega o modulo de direções do Bing Maps.
              var directionsManager = new Microsoft.Maps.Directions.DirectionsManager( //Indica a variavel mapa como o mapa.
                mapa
              );
              for(pin of todasEstacoes){  // Cria um pin para cada estação BikeRio retornada pela API
                var loc = {latitude: parseFloat(pin[5]), longitude: parseFloat(pin[6])}; // Define a localização do pin
                var pushpin = new Microsoft.Maps.Pushpin(loc, null);    // Cria o pin
                mapa.entities.push(pushpin);  //Desenha o pin
              }
              // Define o modo de rota para caminhada e a medida da distancia para kilometros
              directionsManager.setRequestOptions({
                routeMode: Microsoft.Maps.Directions.RouteMode.walking
              },{
                distanceUnity: Microsoft.Maps.Directions.DistanceUnit.km
              });
              var usuario_loc = new Microsoft.Maps.Directions.Waypoint({  //Define a variavel com a localização do usuario.
                location: new Microsoft.Maps.Location(
                  parseFloat(localizacao[0]),
                  parseFloat(localizacao[1])
                ),
              });
              var estacao_loc = new Microsoft.Maps.Directions.Waypoint({  //Define a variavel com a localização da estação BikeRio mais proxima.
                location: new Microsoft.Maps.Location(
                  parseFloat(estacaoMaisPerto[5]),
                  parseFloat(estacaoMaisPerto[6])
                ),
              });
              directionsManager.addWaypoint(usuario_loc); // Adiciona as duas localizações ao directionsManager do Bing Maps
              directionsManager.addWaypoint(estacao_loc);
              // Define onde o itinerario da viagem sera mostrado
              directionsManager.setRenderOptions({
                itineraryContainer: document.getElementById("itinerario"),
              });
              directionsManager.calculateDirections(); //Calcula a rota ate a estação BikeRio e atualiza o mapa.
            });
          });
        });
    });
}

async function pegarLocalizacao(endereco, cidade) {  // Cria a função que faz a requisição com o endereço do usario para o OSM que retorna as coordenas do endereço. A função é executada de forma assincrona.
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

async function buscarEstacoes() { //Cria a função que faz a requisição de todas as estações do BikeRio.
  let response = await fetch(
    "http://dadosabertos.rio.rj.gov.br/apiTransporte/apresentacao/rest/index.cfm/estacoesBikeRio"
  );

  response = await response.json();

  let todasEstacoes = response["DATA"];

  return todasEstacoes;
}

function calcularDistacia(latitude_1, longitude_1, latitude_2, longitude_2) { //Cria a função que calcula a distancia entre a posição do usuario e uma dada estação.
  let distancia = 0.0;
  distancia = parseFloat(
    Math.hypot(
      parseFloat(latitude_2) - parseFloat(latitude_1),
      parseFloat(longitude_2) - parseFloat(longitude_1)
    )
  );
  return distancia;
}

async function calcularEstacaoMaisPerto(todasEstacoes, latitude, longitude) { //Cria uma função que calcula qual a estação mais perto do usuario.
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
