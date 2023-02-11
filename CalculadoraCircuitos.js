var r1, r2, r3, r4, r5, r6, r7, r8, r9, r10;

function setR(a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0){
    r1 = a;r2 = b;r3 = c;r4 = d;r5 = e;
    r6 = f;r7 = g;r8 = h;r9 = i;r10 = j;
}


//Aquellos que apuntan a 0 son los que tienen mayor prioridad
//Mientras mayor sea el numero al que se apunta menor es la prioridad

//Circuito 1
setR(20, 10, 30, 15, 25);
orden = {0:1, 1:2, 2:3, 3:4, 4:5, 5:0}
//resultado = 100

//Circuito 2
//setR(50, 25, 0, 0, 0, 0);
//orden = {0: [1, 2], 1:0, 2:0}
//Resultado = 50/3

//Circuito 3
//setR(50, 25, 100/3, 0, 0, 0);
//orden = {0: [1, 2], 1:3, 2:3, 3:0}
//Resultado = 50

//Circuito 4
//setR(5, 15, 0, 7, 3)
//orden = {0: [1, 2], 1:3, 2:3, 3:[4, 5], 4:0, 5:0}
//Resultado = 5.85

//Circuito 5
//setR(15, 20, 10, 5, 25, 15)
//orden = {0: 1, 1:[2, 3], 2:0, 3:4, 4:0}
//Resultado = 23.57...

//Circuito 6
//setR(15, 20, 10, 5, 25, 15)
//orden = {0: 1, 1:[2, 3], 2:0, 3:[4, 5], 4: 0, 5: 6, 6:0}
//Resultado = 23.38...

//INCREIBLEMENTE HICE LA FUNCION RECURSIVA QUE CALCULA EL CIRCUITO 6 DE MANERA CORRECTA >:D

//valores en realidad es valoresR
valores = {0: 0, 1: r1, 2: r2, 3: r3, 4: r4, 5: r5, 6: r6, 7: r7, 8: r8, 9:r9, 10:r10}
valoresI = {};
valoresV = {};
valoresP = {};
voltaje = 10; //10V
//El problema de esta funcion es plantear la recursividad presente dentro de esta
//el caso inicial siempre sera calcular orden[0], lo cual en caso de ser en serie siempre debe apuntar a 1
function calcularR(i){
    //Caso base
    if(i == 0){
        return 0;

    }
    else if(typeof(i) == 'number'){
        return valores[i] + calcularR(orden[i]);
    }
    else if(typeof(i) == 'object'){
        if(orden[i[0]] == orden[i[1]]){
            return (valores[i[0]] * valores[i[1]]) / ((valores[i[0]] + valores[i[1]])) + calcularR(orden[i[0]]);
        }
        else if(orden[i[0]] == 0){
            return (valores[i[0]] * calcularR(i[1])) / (valores[i[0]] + calcularR(i[1]))
        }
        else if(orden[i[1]] == 0){
            return (valores[i[1]] * calcularR(i[0])) / (valores[i[1]] + calcularR(i[0]))
        }
    }
}

//Terminado el calculo de la resistencia equivalente, ahora se debe calcular el voltaje en cada uno de los elementos
//para asi obtener la potencia y caidas de voltaje.

//Esta funcion se encarga de distribuir las corrientes que pasan por un circuito iterando por el orden

intensidad = voltaje / calcularR(orden[0]);

function calcularIV(i, amp){
    if(i == 0){
        return;
    }
    else if(typeof(i) == "number"){
        valoresI[i] = amp;
        valoresV[i] = valores[i] * amp;
        valoresP[i] = valoresV[i] * amp;
        calcularIV(orden[i], amp);
    }

    else if(typeof(i) == 'object'){
        valoresI[i[0]] = amp * valores[i[1]]/(valores[i[0]] + valores[i[1]]);
        valoresV[i[0]] = valores[i[0]]  * valoresI[i[0]];
        valoresP[i[0]] = valoresV[i[0]] * valoresI[i[0]];
        valoresI[i[1]] = amp * valores[i[0]]/(valores[i[0]] + valores[i[1]]);
        valoresV[i[1]] = valores[i[1]]  * valoresI[i[1]];
        valoresP[i[1]] = valoresV[i[1]] * valoresI[i[1]];

        //console.log(orden[i[0]], orden[i[1]])
        if(orden[i[0]] == orden[i[1]]){
            calcularIV(orden[i[0]], amp);
        }
        else{
            calcularIV(orden[i[0]], valoresI[i[0]]);
            calcularIV(orden[i[1]], valoresI[i[1]]);

        }
    }

}

console.log("\tCalculadora Recursiva de Circuitos Electronicos.")
console.log("Voltaje de la Fuente:", voltaje, "V")
console.log("Resultado Final:",calcularR(orden[0]), "OHM");
console.log("Amperaje del Circuito:" ,intensidad, "A\n");

//console.log(r1, r2, r3, r4, r5, r6, r7, r8, r9, r10);

calcularIV(orden[0], intensidad);
console.log("Valores Resistencias (OHM):", valores);

console.log("Valores Intensidades: (A)", valoresI);
console.log("Caidas de Voltajes: (V)", valoresV);
console.log("Potencias: (W)", valoresP);