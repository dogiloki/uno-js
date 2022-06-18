var cartas=[];
var tableros=[];
var carta_monto;
var carta_jugada=null;
var template_tablero=document.getElementById('template-tablero').content;
var template_carta=document.getElementById('template-carta').content;
var content_inicio=document.getElementById('content-inicio');
var content_juego=document.getElementById('content-juego');
var content_monto=document.getElementById('content-monto');
var content_jugada=document.getElementById('content-jugada');
var content_turno=document.getElementById('content-turno');
var btn_jugar=document.getElementById('btn-jugar');
var caja_nombre=document.getElementById('caja-nombre');
var turno=0;
var direccion=1;
var posicion_cartas=0;
var clases_tableros=[
	"tablero-abajo",
	"tablero-der",
	"tablero-arriba",
	"tablero-izq"
];
var nombre="";

document.addEventListener("DOMContentLoaded",()=>{
	//this.socket=io();
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
				let carta={
					numero:null,
					color:color,
					tipo:Diccionario.tipo[(a<=1)?0:a-1], // normal; reversa; mas2; bloqueo
					especial:null, // cambio; mas4
					jugador:0 // 0=monto de cartas; -1=ya jugadas; 1-4=jugador
					/*aumento:()=>{
						return (this.tipo==Diccionario.tipo[2])?(2):
								((this.especial==Diccionario.especial[1])?4:0);
					}*/
				};
				if(carta.tipo==Diccionario.tipo[0]){
					carta.numero=b;
				}
				this.cartas.push(carta);
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
		this.tomarMonto(1,0,false);
	});
});

btn_jugar.addEventListener("click",()=>{
	if(Util.esNumero(this.caja_nombre.value) && !Util.esDecimal((this.caja_nombre.value)) && this.caja_nombre.value<=Diccionario.max_jugadores && this.caja_nombre.value>0){
		this.juego();	
	}else{
		alert("Cantidad no válida");
	}
});

function modal(content,visible=-1){
	content.style.display=(visible==-1)?
						((content.style.display=="none")?"":"none"):
						(visible)?"":"none";
}

function inicio(){
	this.modal(content_inicio,true);
	this.modal(content_juego,false);
}

function juego(){
	this.barajear(this.cartas);
	this.generarTableros();
	this.cambiarTurno();
	this.modal(content_inicio,false);
	this.modal(content_juego,true);
}

function crearCarta(posicion){
	let carta=this.cartas[posicion];
	this.template_carta.getElementById("carta").style.background=carta.color;
	this.template_carta.getElementById("centro").style.color=carta.color;
	this.template_carta.getElementById("centro").style.background="#ffffff";
	if(carta.tipo==Diccionario.tipo[0]){
		aisgnarNumero(carta.numero);
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
		this.template_carta.getElementById("num1").textContent=num;
		this.template_carta.getElementById("num2").textContent=num;
		this.template_carta.getElementById("num3").textContent=num.indexOf("+")==-1?num:num.substring(0,1);
	}
	this.template_carta.getElementById("carta").setAttribute("name","carta"+posicion);
	this.template_carta.getElementById("carta").setAttribute("onclick","ponerCarta('"+posicion+"')");
	return this.template_carta.cloneNode(true);
}

function barajear(cartas){
	this.cartas=[];
	let conta=0;
	(Util.numeroAleatorio(cartas.length-1,0,cartas.length)).forEach((posicion)=>{
		this.cartas.push(cartas[posicion]);
		conta++;
	});
}

function generarTableros(){
	// Repartir cartas a los jugadores
	for(let a=0; a<this.caja_nombre.value; a++){
		let tablero=this.template_tablero.getElementById("tablero");
		this.template_tablero.getElementById("num_cartas").textContent=7;
		this.template_tablero.getElementById("num_cartas").setAttribute("name","num_cartas"+(a+1));
		let cartas=this.template_tablero.getElementById("cartas");
		cartas.setAttribute("class","cartas "+((a%2==0)?"cartas_horizontal":"cartas_vertical"));
		cartas.innerHTML="";
		tablero.setAttribute("class","tablero "+this.clases_tableros[a]);
		tablero.setAttribute("name","tablero"+(a+1));
		cartas.setAttribute("name","cartas"+(a+1));
		for(let b=0; b<Diccionario.num_cartas; b++){
			/*let numero;
			do{
				numero=Util.numeroAleatorio(this.cartas.length-1);
			}while(this.cartas[numero].jugador!=0);*/
			this.cartas[this.posicion_cartas].jugador=(a+1);
			cartas.appendChild(this.crearCarta(this.posicion_cartas));
			this.posicion_cartas++;
		}
		this.content_juego.appendChild(tablero.cloneNode(true));
	}
	// Poner cartas del monto a a usarse
}

function cambiarTurno(){
	if(this.direccion==1){
		if(this.turno<this.caja_nombre.value){
			this.turno++;
		}else{
			this.turno=1;
		}
	}else{
		if(this.turno>1){
			this.turno--;
		}else{
			this.turno=this.caja_nombre.value;
		}
	}
	this.content_turno.textContent=((this.direccion==0)?"<~":"~>")+" Turno: "+this.turno;
}

function tomarMonto(num=1,conta=0,cambio=true){
	if(conta<num){
		let cartas=document.getElementsByName('cartas'+this.turno)[0];
		let num_cartas=document.getElementsByName('num_cartas'+this.turno)[0];
		num_cartas.innerHTML=Number(num_cartas.innerHTML)+1;
		cartas.appendChild(this.crearCarta(this.posicion_cartas));
		this.cartas[this.posicion_cartas].jugador=this.turno;
		this.posicion_cartas++;
		if(this.posicion_cartas>=this.cartas.length-1){
			this.content_monto.innerHTML="";
			alert("Juego empatado");
		}
		this.posicion_cartas++;
		if(cambio){
			this.cambiarTurno();
		}
		tomarMonto(num,conta+1,cambio);
	}
}

/*function enviarCarta(posicion){
	this.socket.emit('ponerCarta',this.cartas,this.turno,posicion);
}*/

function ponerCarta(posicion){
	if(this.cartas[posicion].jugador<1 || this.cartas[posicion].jugador!=this.turno){
		return;
	}
	let num_cartas=document.getElementsByName('num_cartas'+this.turno)[0];
	let carta=this.crearCarta(posicion);
	let done=false;
	if(this.carta_jugada!=null){
		if(this.cartas[posicion].numero==this.cartas[this.carta_jugada].numero || this.cartas[posicion].color==this.cartas[this.carta_jugada].color){
			done=true;
		}
	}else{
		done=true;
	}
	if(done){
		document.getElementsByName('carta'+posicion)[0].remove();
		this.content_jugada.innerHTML="";
		this.carta_jugada=posicion;
		this.content_jugada.appendChild(carta);
		this.cartas[posicion].jugador=-1;
		num_cartas.innerHTML=Number(num_cartas.innerHTML)-1;
		if(this.cartas.filter((carta)=>carta.jugador==this.turno).length<=0){
			alert("Gano el jugador "+this.turno);
			return;
		}
		switch(this.cartas[posicion].tipo){
			case Diccionario.tipo[0]: this.cambiarTurno(); break;
			case Diccionario.tipo[1]: this.direccion=this.direccion==0?1:0; this.cambiarTurno(); break;
			case Diccionario.tipo[2]: this.cambiarTurno(); this.tomarMonto(2,0,false); break;
			case Diccionario.tipo[3]: this.cambiarTurno(); this.cambiarTurno(); break;
		}
	}
}