import requests 
import json
import math
import operator
from Estações import Estacoes               #Importa a classe Estaçoes




def pegarLocalizacao(rua, numero, cidade):                                      #Define uma função que faz uma requisição a api OSM, transforma a resposta para o formato json e retorna somente a latitude e longitude do endereço inserido.
    requisicao = 'https://nominatim.openstreetmap.org/search?street='+rua+','+numero+'&city='+cidade+'&county=Brasil&format=json'
    response = requests.get(requisicao)
    response = response.json()
    return float(response[0]['lat']), float(response[0]['lon'])

def pegarEstacoes():                                                            #Define uma função que faz uma requisição a api do BikeRio, trasnforma a resposta para o formato json e retorna somenta a parte de dados do json. 
    response = requests.get('http://dadosabertos.rio.rj.gov.br/apiTransporte/apresentacao/rest/index.cfm/estacoesBikeRio')
    response = response.json()
    return response['DATA']

def Dist(lat1, long1, lat2, long2):                                             #Define uma função para calcular a distancia entre o usuario e uma dada estação
    distAB = math.dist([lat1, long1], [lat2, long2])
    return distAB

def ordenarEstacoes(lat, log, estacoesBikeRio):                                  #Define uma função que ordena as estações em relação a distancia ate o usuario de maneira decrescente. 
    distancia = 0.0
    ordenar = list()
    for estacoes in estacoesBikeRio:
        distancia = float(Dist(lat, log, float(estacoes[5]), float(estacoes[6])))
        ordenar.append(Estacoes(estacoes[0], estacoes[1], estacoes[2], estacoes[3], estacoes[4], estacoes[5], estacoes[6], (distancia*100)))
    return sorted(ordenar, key=operator.attrgetter('distancia'), reverse= True)



rua, numero, cidade = input("Digite sua localizacao no formato : 'Rua, numero, cidade'").split(',') #Recebe o endereço do usuario  
lat, lon = pegarLocalizacao(rua, numero, cidade)                            #Passa o endereço para a função e recebe a latitude e longitude do usuario
estacoesBikeRio = pegarEstacoes()                                           #Recebe todas as estações do BikeRio
estacoes_ordenadas = ordenarEstacoes(lat, lon, estacoesBikeRio)             #Ordena as estações em ordem decrescente
print("Estaçoes ordenadas em ordem decrescente de distancia")
for linha in estacoes_ordenadas:                                            #Printa as estações
    print(linha)

