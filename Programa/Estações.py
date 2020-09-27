class Estacoes:
    def __init__(self, bairro, estacao, codigo, endereco, numero, latitude, longitude, distancia):
        self.bairro = bairro
        self.estacao = estacao
        self.codigo = codigo
        self.endereco = endereco
        self.numero = numero
        self.latitude = latitude
        self.longitude = longitude
        self.distancia = distancia
    
    def __repr__(self):
        return repr((self.bairro, self.estacao, self.codigo, self.endereco, self.numero, self.latitude, self.longitude, self.distancia))