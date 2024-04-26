#! /usr/bin/python3
from itertools import combinations
from math import factorial
# import matplotlib.pyplot as plt
from datetime import datetime
import pandas as pd

def comb(m, n):
    """Calcula y devuelve el número de combinaciones
       posibles que se pueden hacer con m elementos
       tomando n elementos a la vez.
    """
    return factorial(m) // (factorial(n) * factorial(m - n))

def generar_combinaciones(partidos, num_apuestas, cuotas, ganado):
    """
    Genera todas las combinaciones posibles de apuestas a partir de una lista de partidos, sus cuotas y resultados de ganado.

    Args:
        partidos (list): Lista de partidos (pueden ser números, nombres, etc.).
        num_apuestas (int): Número de apuestas deseadas.
        cuotas (list): Lista de cuotas asociadas a cada partido.
        ganado (list): Lista de booleanos que indican si el partido fue ganado o no.

    Returns:
        list: Una lista de tuples, donde cada sublista representa una combinación de apuestas con su cuota y resultado de ganado.
    """
    if num_apuestas < 1 or num_apuestas > len(partidos):
        raise ValueError("El número de apuestas debe estar entre 1 y la cantidad de partidos.")

    if len(partidos) != len(cuotas) or len(partidos) != len(ganado):
        raise ValueError("Las listas de partidos, cuotas y ganado deben tener la misma longitud.")

    # Generar todas las combinaciones de tamaño num_apuestas
    combinaciones = list(combinations(partidos, num_apuestas))

    # Calcular la cuota y el resultado de ganado para cada combinación
    resultados_combinados = []
    for combinacion in combinaciones:
        cuota_combinacion = 1
        resultado_ganado = all([ganado[partidos.index(partido)] for partido in combinacion])
        for i in range(len(combinacion)):
            cuota_combinacion *= cuotas[partidos.index(combinacion[i])]
        resultados_combinados.append((combinacion, cuota_combinacion, resultado_ganado))
        
    return resultados_combinados


fecha_hora_actual = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
nombre_del_resultado= datetime.now().strftime("%Y-%m-%d")
print("\n")
print("**Bienvenido a la calculadora de analisis** \n")
print("**Author: Juan Diego Florez Vera** \n")
print(f"**Date: {fecha_hora_actual}**\n")
print("\n")
print("\n")

# ingresar datos
cuotas=[] 
num_partidos_opc=int(input("ingrese el número de partidos: "))
for partido in range(0,num_partidos_opc):
    cuotas.append(float(input(f"ingrese la cuota número {partido+1}: ")))
cant_partidos=len(cuotas)
partidos = [numero for numero in range(1, cant_partidos + 1)]
Mar_ganado=[]
for i in range(num_partidos_opc):
    Mar_ganado.append(1==int(input("ingrese el resultado (ganado=1/perdido=0): ")))
importe =int(input("ingrese el importe que va a apostar: "))
recoleta_datos_ganancia=[]

valor_cada_apuesta=[]
numero_apuestas=[]


print("\n")
print(f"**resultado**\n")
print("\n")
print(f"Con un valor de apuesta total de: {importe}\n")
print(f"con un marcador de {Mar_ganado}\n")
print(f"las cuotas de los partidos son {cuotas}\n")
print("\n")
# creación de listas para el visualización del dataframe
valor_cada_apuesta=[]
numero_apuestas=[]
ganancia=[]
cuotaganada=[]
#*********************************************************
for i in range(1,cant_partidos+1):
    numero_apuestas.append(i) #-->print(f"para el numero de apuestas igual a {i}\n")
    num_apuestas =i #int(input("ingrese el numero de partidos a combinar: "))
    valor_unitario = importe / comb(len(partidos), num_apuestas)
    todas_combinaciones = generar_combinaciones(partidos, num_apuestas, cuotas, Mar_ganado)
    # Imprimir todas las combinaciones
    valor_cada_apuesta.append(valor_unitario) #-->print(f"Valor de cada apuesta: {valor_unitario}\n")
    ganar=0
    for i, (combinacion, cuota, ganado) in enumerate(todas_combinaciones, start=1):
        #print(f"Apuesta {i}: {combinacion} cuota: {cuota:.3f} ganancia: {valor_unitario*cuota:.3f} ganado: {ganado}")
        if (ganado):
            ganar+=valor_unitario*cuota
    
    ganancia.append(round(ganar,3))#--> print(f"lo que se gana es {ganar:.3f}\n")
    cuotaganada.append(round(ganar/importe,3))#-->print("la cuota de la apuesta es: {}".format(round(ganar/importe,3)))
    recoleta_datos_ganancia.append(ganar-importe)
# creación de la visualización del DataFrame
df=pd.DataFrame({"valor cada apuesta":valor_cada_apuesta,
                    "numero de apuestas":numero_apuestas,
                    "ganar":ganancia,
                    "cuota":cuotaganada
                    })
print(df)
print("*"*50+"\n")
### Grafica
# plt.bar(partidos,recoleta_datos_ganancia)
# plt.title("ganancia")
# plt.xlabel("numero de apuestas")
# plt.ylabel("ganancias")
# plt.grid()
# plt.show()
