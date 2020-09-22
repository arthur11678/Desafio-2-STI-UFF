function formSubmit() {
  // Pega os dados do formulário
  let endereco = document.getElementById("endereco").value;
  let cidade = document.getElementById("cidade").value;

  // console.log(endereco, cidade);

  // Pega a Latitude e Longitude
  let localizacao = pegarLocalizacao(endereco, cidade);

  // Pega Lista de todas as Estações
  let todasEstacoes = buscarEstacoes();

  // Pega a Localização da Estação mais perto do endereço
  let estacaoMaisPerto = estacaoMaisPerto(
    todasEstacoes,
    localizacao[0],
    localizacao[1]
  );

  console.log(estacaoMaisPerto);
}

function pegarLocalizacao(endereco, cidade) {
  let localizacao = [];
  // Lógica da Requisição Json
  return localizacao;
}

function buscarEstacoes() {
  let todasEstacoes = [];
  // Lógica da Requisição Json
  return todasEstacoes;
}

function calcularDistacia(latitude_1, longitude_1, latitude_2, longitude_2) {
  let distancia = 0;
  return distancia;
}

function estacaoMaisPerto(todasEstacoes, latitude, longitude) {
  let estacaoMaisPerto = [];
  // Lógica de Cálcular a Distância entre os pontos
  return estacaoMaisPerto;
}
