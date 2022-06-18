var cartas=[];
var tableros=[];
var carta_monto;
var carta_jugada=null;
var template_tablero=document.getElementById('template-tablero').content;
var template_carta=document.getElementById('template-carta').content;
var content_juego=document.getElementById('content-juego');
var content_monto=document.getElementById('content-monto');
var content_jugada=document.getElementById('content-jugada');
var turno=0;
var direccion=1;
var posicion_cartas=0;
var clases_tableros=[
	"tablero-abajo",
	"tablero-arriba",
	"tablero-izq",
	"tablero-der"
];

document.addEventListener("DOMContentLoaded",()=>{
	let cartas=[];
	// Generar cartas
	let conta=0; // Conteo de cartas totales
	// Cartas normales
	// 2 del 1-9 en cada color
	// 1 de 0 en cada color
	// Carta de reversa, mas, bloqueo
	// 2 cada color
	for(let a=0; a<5; a++){
		(Diccionario.colores).forEach((color)=>{
			let inicio=(a==0 || a>=2)?0:
						(a==1)?1:0;
			let fin=(a<=1)?9:1;
			for(let b=inicio; b<=fin; b++){
				this.template_carta.getElementById("carta").style.background=color;
				this.template_carta.getElementById("num1").textContent="";
				this.template_carta.getElementById("num2").textContent="";
				this.template_carta.getElementById("num3").textContent="";
				this.template_carta.getElementById("centro").style.color=color;
				let obj=this.template_carta.cloneNode(true)
				let carta={
					obj:obj,
					numero:null,
					color:color,
					tipo:Diccionario.tipo[(a<=1)?0:a-1], // normal; reversa; mas2; bloqueo
					especial:null, // cambio; mas4
					jugador:0, // 0=monto de cartas; -1=ya jugadas; 1-4=jugador
					aumento:()=>{
						return (this.tipo==Diccionario.tipo[2])?2:
								(this.especial==Diccionario.especial[1])?4:0;
					}
				};
				if(carta.tipo==Diccionario.tipo[0]){
					aisgnarNumero(b);
				}else
				if(carta.tipo==Diccionario.tipo[1]){
					aisgnarNumero("R");
				}else
				if(carta.tipo==Diccionario.tipo[2]){
					aisgnarNumero("+2");
				}else
				if(carta.tipo==Diccionario.tipo[3]){
					aisgnarNumero("B");
				}
				function aisgnarNumero(num){
					num+="";
					carta.numero=num;
					carta.obj.getElementById("num1").textContent=num;
					carta.obj.getElementById("num2").textContent=num;
					carta.obj.getElementById("num3").textContent=num.indexOf("+")==-1?num:num.substring(0,1);
				}
				cartas.push(carta);
				conta++;
			}
		});
	}
	// 4 mas4 y de cambio
	// Carta volteada
	this.template_carta.getElementById("carta").setAttribute("name","cartas_monto");
	this.template_carta.getElementById("carta").style.background="#353535";
	this.template_carta.getElementById("num1").textContent="";
	this.template_carta.getElementById("num2").textContent="";
	this.template_carta.getElementById("num3").textContent="UNO";
	this.template_carta.getElementById("centro").style.background="#b0160b";
	this.template_carta.getElementById("centro").style.color="#c3c80d";
	this.template_carta.getElementById("centro").setAttribute("title","Monto");
	this.content_monto.appendChild(this.template_carta.cloneNode(true));
	this.carta_monto=document.getElementsByName("cartas_monto")[0];
	this.carta_monto.addEventListener("click",()=>{
		this.tomarMonto();
	});
	// Métodos principales
	this.barajear(cartas);
	this.generarTableros();
	this.cambiarTurno();
});

function barajear(cartas){
	this.cartas=[];
	let conta=0;
	(Util.numeroAleatorio(cartas.length-1,0,cartas.length)).forEach((posicion)=>{
		this.cartas.push(cartas[posicion]);
		cartas[posicion].obj.getElementById("carta").setAttribute("name","carta"+conta);
		cartas[posicion].obj.getElementById("carta").setAttribute("onclick","ponerCarta(this,'"+conta+"')");
		this.cartas[conta].obj=cartas[posicion].obj;
		conta++;
	});
	console.log(this.cartas);
}

function generarTableros(){
	// Repartir cartas a los jugadores
	for(let a=0; a<Diccionario.max_jugadores; a++){
		let tablero=this.template_tablero.getElementById("tablero");
		this.template_tablero.getElementById("num_cartas").textContent=7;
		this.template_tablero.getElementById("num_cartas").setAttribute("name","num_cartas"+(a+1));
		let cartas=this.template_tablero.getElementById("cartas");
		cartas.setAttribute("class","cartas "+((a<2)?"cartas_horizontal":"cartas_vertical"));
		cartas.innerHTML="";
		tablero.setAttribute("class","tablero "+this.clases_tableros[a]);
		tablero.setAttribute("name","tablero"+(a+1));
		cartas.setAttribute("name","cartas"+(a+1));
		for(let b=0; b<7; b++){
			/*let numero;
			do{
				numero=Util.numeroAleatorio(this.cartas.length-1);
			}while(this.cartas[numero].jugador!=0);*/
			this.cartas[this.posicion_cartas].jugador=(a+1);
			cartas.appendChild(this.cartas[this.posicion_cartas].obj.getElementById("carta").cloneNode(true));
			this.posicion_cartas++;
		}
		this.content_juego.appendChild(tablero.cloneNode(true));
	}
	// Poner cartas del monto a a usarse

}

function cambiarTurno(){
	if(this.turno<Diccionario.max_jugadores){
		if(direccion==0){
			this.turno--;
		}else{
			this.turno++;
		}
	}else{
		this.turno=1;
	}
}

function tomarMonto(){
	let cartas=document.getElementsByName('cartas'+this.turno)[0];
	let num_cartas=document.getElementsByName('num_cartas'+this.turno)[0];
	num_cartas.innerHTML=Number(num_cartas.innerHTML)+1;
	cartas.appendChild(this.cartas[this.posicion_cartas].obj);
	this.posicion_cartas++;
	this.cambiarTurno();
}

function ponerCarta(obj,posicion){
	let carta=this.cartas[posicion].obj.getElementById("carta").cloneNode(true);
	let done=false;
	if(this.carta_jugada!=null){
		if(this.cartas[posicion].numero==this.cartas[this.carta_jugada].numero || this.cartas[posicion].color==this.cartas[this.carta_jugada].color){
			done=true;
		}
	}else{
		done=true;
	}
	if(done){
		this.content_jugada.innerHTML="";
		this.carta_jugada=posicion;
		this.content_jugada.appendChild(carta.cloneNode(true));
		this.cartas[posicion].jugador=-1;
		obj.remove();
	}
}