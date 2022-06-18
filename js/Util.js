class Util{

	static numeroAleatorio(max,min=0,cantidad=1){
		if(((max-min)+1)<cantidad){
			return null;
		}
		let numeros=[];
		do{
			let repetido=false;
			let numero=Math.round(Math.random()*(max-min)+min);
			for(let a=0; a<numeros.length; a++){
				if(numeros[a]==numero){
					repetido=true;
					a=numeros.length;
				}
			}
			if(!repetido){
				numeros.push(numero);
			}
		}while(numeros.length<cantidad);
		return (cantidad==1)?numeros[0]:numeros;
	}
	
}