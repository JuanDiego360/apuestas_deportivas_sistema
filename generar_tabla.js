(function () {
    var oldLog = console.log;
    var oldTable = console.table;

    console.log = function () {
        var outputElement = document.getElementById('consoleOutput');
        var preElement = outputElement.querySelector('pre');

        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] == 'object') {
                preElement.textContent += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '\n';
            } else {
                preElement.textContent += arguments[i] + '\n';
            }
        }

        oldLog.apply(console, arguments);
    };

    console.table = function (data) {
        var outputElement = document.getElementById('consoleOutput');
        var tableElement = document.createElement('table');

        if (Array.isArray(data)) {
            var headerRow = document.createElement('tr');
            var keys = Object.keys(data[0]);
            keys.forEach(function (key) {
                var th = document.createElement('th');
                th.textContent = key;
                headerRow.appendChild(th);
            });
            tableElement.appendChild(headerRow);

            data.forEach(function (rowData) {
                var row = document.createElement('tr');
                keys.forEach(function (key) {
                    var cell = document.createElement('td');
                    cell.textContent = rowData[key];
                    row.appendChild(cell);
                });
                tableElement.appendChild(row);
            });
        } else {
            console.log('Los datos deben ser un array de objetos.');
        }

        outputElement.appendChild(tableElement);
        oldTable.apply(console, arguments);
    };
})();

// Función para calcular combinaciones
function comb(m, n) {
    function factorial(num) {
      let result = 1;
      for (let i = 2; i <= num; i++) {
        result *= i;
      }
      return result;
    }
    return factorial(m) / (factorial(n) * factorial(m - n));
}
  
  // Función para generar combinaciones
  function generarCombinaciones(partidos, numApuestas, cuotas, ganado) {
    if (numApuestas < 1 || numApuestas > partidos.length) {
      throw new Error("El número de apuestas debe estar entre 1 y la cantidad de partidos.");
    }
    if (partidos.length !== cuotas.length || partidos.length !== ganado.length) {
      throw new Error("Las listas de partidos, cuotas y ganado deben tener la misma longitud.");
    }
  
    const combinaciones = [];
    const generateCombinations = (sourceArray, comboLength, start = 0, initialStuff = [], output = []) => {
      if (initialStuff.length >= comboLength) {
        output.push([...initialStuff]);
      } else {
        const maxLoops = sourceArray.length - comboLength + initialStuff.length + 1;
        for (let i = start; i < maxLoops; i++) {
          generateCombinations(sourceArray, comboLength, i + 1, initialStuff.concat(sourceArray[i]), output);
        }
      }
      return output;
    };
    const allCombinations = generateCombinations(partidos, numApuestas);
  
    let resultadosCombinados = [];
    allCombinations.forEach(combinacion => {
      let cuotaCombinacion = 1;
      let resultadoGanado = combinacion.every(partido => ganado[partidos.indexOf(partido)]);
      combinacion.forEach(partido => {
        cuotaCombinacion *= cuotas[partidos.indexOf(partido)];
      });
      resultadosCombinados.push([combinacion, cuotaCombinacion, resultadoGanado]);
    });
    return resultadosCombinados;
  }
  
  // Función para generar lista de combinaciones
  function generarListaCombinaciones(n) {
    if (n <= 1) {
      return [[false], [true]];
    }
    let resultado = [];
    resultado.push(new Array(n).fill(true));
    for (let i = 0; i < n; i++) {
      let listaAux = new Array(n).fill(true);
      listaAux[i] = false;
      resultado.push(listaAux);
    }
    return resultado;
  }
  
  // Obtener fecha y hora actual
  const fechaHoraActual = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  const nombreDelResultado = new Date().toISOString().split('T')[0];
  
  // Ingresar datos
  let cuotas = [];
  const numPartidosOpc = parseInt(prompt("ingrese el número de partidos: "), 10);
  for (let partido = 0; partido < numPartidosOpc; partido++) {
    cuotas.push(parseFloat(prompt(`ingrese la cuota número ${partido + 1}: `)));
  }
  const cantPartidos = cuotas.length;
  const partidos = Array.from({ length: cantPartidos }, (_, i) => i + 1);
  // mostrar un unico resultado
  
  // continuación del codigo
  const MarGanado = generarListaCombinaciones(cantPartidos);
  const importe = parseInt(prompt("ingrese el importe que va a apostar: "), 10);
  let recoletaDatosGanancia = [];
  console.log("\n");
  console.log(`Con un valor de apuesta total de: ${importe}\n`);
  console.log(`las cuotas de los partidos son ${cuotas}\n`);
  for (let difMarcado = 0; difMarcado <= cantPartidos; difMarcado++) {
    //console.log("\n");
    //console.log(`**resultado numero ${difMarcado + 1}**\n`);
    //console.log(`con un marcador de ${MarGanado[difMarcado]}\n`);
    //console.log("\n");
    
    // Creación de listas para visualización del DataFrame
    let valorCadaApuesta = [];
    let numeroApuestas = [];
    let ganancia = [];
    let cuotaGanada = [];
    let resultado = []
    
    for (let i = 1; i <= cantPartidos; i++) {
      numeroApuestas.push(i);
      const numApuestas = i;
      const valorUnitario = importe / comb(partidos.length, numApuestas);
      const todasCombinaciones = generarCombinaciones(partidos, numApuestas, cuotas, MarGanado[difMarcado]);
      valorCadaApuesta.push(valorUnitario);
      let ganar = 0;
      todasCombinaciones.forEach(([combinacion, cuota, ganado], index) => {
        if (ganado) {
          ganar += valorUnitario * cuota;
        }
      });
      ganancia.push(Math.round(ganar * 1000) / 1000);
      cuotaGanada.push(Math.round((ganar / importe) * 1000) / 1000);
      recoletaDatosGanancia.push(ganar - importe);
      resultado.push(MarGanado[difMarcado]);
    }
    // Creación de la visualización del DataFrame
    const df = valorCadaApuesta.map((valor, index) => ({
        "valor apuesta": valor.toFixed(3),
        "# apuestas": numeroApuestas[index],
        "resultados": resultado[0],
        "ganar": ganancia[index],
        "cuota": cuotaGanada[index]
    }));
    console.table(df);
    //console.log("*".repeat(50) + "\n");
  }
