var cartas=[];
var template_tablero=document.getElementById('template-tablero').content;
var template_carta=document.getElementById('template-carta').content;
var content_juego=document.getElementById('content-juego');
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
				this.template_carta.getElementById("carta").setAttribute("name","carta"+conta);
				this.template_carta.getElementById("carta").style.background=color;
				this.template_carta.getElementById("num1").textContent="";
				this.template_carta.getElementById("num2").textContent="";
				this.template_carta.getElementById("num3").textContent="";
				this.template_carta.getElementById("centro").style.color=color;
				let carta={
					obj:this.template_carta.cloneNode(true),
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
	console.log(cartas);
	this.barajear(cartas);
	this.tableros();
});

function barajear(cartas){
	this.cartas=[];
	(Util.numeroAleatorio(cartas.length-1,0,cartas.length)).forEach((posicion)=>{
		this.cartas.push(cartas[posicion]);
	});
	console.log(this.cartas);
}

function tableros(){
	let conta=0;
	for(let a=0; a<4; a++){
		let tablero=this.template_tablero.getElementById("tablero");
		this.template_tablero.getElementById("num_cartas").textContent=7;
		this.template_tablero.getElementById("num_cartas").setAttribute("name","num_cartas"+(a+1));
		let cartas=this.template_tablero.getElementById("cartas");
		cartas.setAttribute("class","cartas "+((a<2)?"cartas_horizontal":"cartas_vertical"));
		cartas.innerHTML="";
		tablero.setAttribute("class","tablero "+this.clases_tableros[a]);
		tablero.setAttribute("name","tablero"+(a+1));
		for(let b=0; b<7; b++){
			/*let numero;
			do{
				numero=Util.numeroAleatorio(this.cartas.length-1);
			}while(this.cartas[numero].jugador!=0);*/
			this.cartas[conta].jugador=(a+1);
			cartas.appendChild(this.cartas[conta].obj);
			conta++;
		}
		this.content_juego.appendChild(this.template_tablero.cloneNode(true));
	}
}