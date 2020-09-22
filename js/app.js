function formSubmit() {
  // Pega os dados do formulário
  let endereco = document.getElementById("endereco").value;
  let cidade = document.getElementById("cidade").value;

  // console.log(endereco, cidade);

  // Pega a Latitude e Longitude
  let localizacao = [];
  pegarLocalizacao(endereco, cidade).then((data) => {
    localizacao = data;
    console.log(localizacao);
  });

  // Pega Lista de todas as Estações
  let todasEstacoes = [];
  buscarEstacoes().then((data) => {
    todasEstacoes = data;
    console.log(todasEstacoes);
  });
  // .then(() => {});

  // Pega a Localização da Estação mais perto do endereço
  let estacaoMaisPerto = [];
  estacaoMaisPerto = calcularEstacaoMaisPerto(
    todasEstacoes,
    localizacao[0],
    localizacao[1]
  );

  // console.log(estacaoMaisPerto);
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
  let distancia = 0;
  distancia = Math.hypot(latitude_2 - latitude_1, longitude_2 - longitude_1);
  return distancia;
}

function calcularEstacaoMaisPerto(todasEstacoes, latitude, longitude) {
  let estacaoMaisPerto = [];
  estacaoMaisPerto = calcularDistacia(
    todasEstacoes[5],
    todasEstacoes[6],
    latitude,
    longitude
  );
  return estacaoMaisPerto;
}
