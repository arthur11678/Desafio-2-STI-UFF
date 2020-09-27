import requests 
import json
import math 


def pegarLocalizacao(rua, numero, cidade):
    requisicao = 'https://nominatim.openstreetmap.org/search?street='+rua+','+numero+'&city='+cidade+'&county=Brasil&format=json'
    response = requests.get(requisicao)
    response = response.json()
    return float(response[0]['lat']), float(response[0]['lon'])

def pegarEstacoes():
    response = requests.get('http://dadosabertos.rio.rj.gov.br/apiTransporte/apresentacao/rest/index.cfm/estacoesBikeRio')
    response = response.json()
    return response['DATA']

def Dist(lat1, long1, lat2, long2):
    distAB = math.dist([lat1, long1], [lat2, long2])
    return distAB

def checarEstacaoProxima(lat, log, estacoesBikeRio):
    estacaoMaisProxima = list()
    menorDistancia = 0.0
    for estacoes in estacoesBikeRio:
        if estacoes == estacoesBikeRio[0]:
            menorDistancia = Dist(lat, log, float(estacoes[5]), float(estacoes[6]))
            estacaoMaisProxima = estacoes
        else:
            aux = Dist(lat, log, float(estacoes[-2]), float(estacoes[-1]))
            if aux < menorDistancia:
                menorDistancia = aux
                estacaoMaisProxima = estacoes
    return estacaoMaisProxima, menorDistancia



rua, numero, cidade = input("Digite sua localizacao no formato : 'Rua, numero, cidade'").split(',')
lat, lon = pegarLocalizacao(rua, numero, cidade)
print(lat, lon)
estacoesBikeRio = pegarEstacoes()
print(checarEstacaoProxima(lat, lon, estacoesBikeRio))

