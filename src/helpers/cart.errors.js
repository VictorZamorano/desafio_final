export const cartHandleErrors = (code) => {
	if (!code) {
		return {
			status: 500,
			message: "Error de servidor, código desconocido",
		};
	}

	switch (code) {
		case "22P02":
			return {
				status: 400,
				message: "Formato no válido en el parámetro",
			};
		case "400":
			return {
				status: 400,
				message: "Faltan datos en la petición",
			};
		case "400.1":
			return {
				status: 400,
				message: "No hay stock suficiente para agregar al carro",
			};
		case "404":
			return {
				status: 404,
				message: "No existe ese registro",
			};
		case "404.1":
			return {
				status: 404,
				message: "Tu carro se encuentra vacio, debes agregar productos para visualizarlos",
			};	
		case "404.2":
			return {
				status: 404,
				message: "No estas autorizado para acceder a esta ruta o realizar esta acción",
			};
		case "404.3":
			return {
				status: 404,
				message: "Debes agregar 1 producto como minimo para añadirlo a tu carro",
			};
		case "404.4":
			return {
				status: 404,
				message: "No hay stock suficiente para tu petición",
			};
		case "404.5":
			return {
				status: 404,
				message: "El producto seleccionado no existe o no se encuentra disponible",
			};
		case "404.6":
			return {
				status: 404,
				message: "No puedes eliminar un producto que no se encuentra en tu carro",
			};
		default:
			return {
				status: 500,
				message: "Error de servidor",
			};
	}
};
