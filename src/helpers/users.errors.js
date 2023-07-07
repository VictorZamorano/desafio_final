export const handleErrors = (code, message = "Error desconocido") => {
  if (!code) {
    return {
      status: 500,
      message: `Error de servidor: ${message}`,
    };
  }
  switch (code) {
    //la query que se esta enviando no esta recibiendo parametros dinamicos
    case "08P01":
      return {
        status: 409,
        message: `08P01: ${message}`,
      };

    //se ha violado la condicion UNIQUE
    case "23505":
      return {
        status: 409,
        message: `23505: ${message}`,
      };

    //valor invalido para timestamp with time zone
    case "22007":
      return {
        status: 400,
        message: `22007: ${message}`,
      };

    //se ha violado la condicion NOT NULL
    case "23502":
      return {
        status: 400,
        message: `23502: ${message}`,
      };

    //valor muy largo para limitacion de varchar
    case "22001":
      return {
        status: 400,
        message: `22001: ${message}`,
      };

    //valor invalido para el tipo de dato solicitado
    case "22P02":
      return {
        status: 400,
        message: `22P02: ${message}`,
      };

    //la columna no existe en la tabla
    case "42703":
      return {
        status: 400,
        message: `42703: ${message}`,
      };

    //error de sintaxis en palabra clave
    case "42601":
      return {
        status: 400,
        message: `42601: ${message}`,
      };

    //la tabla no existe en la base de datos
    case "42P01":
      return {
        status: 404,
        message: `42P01: ${message}`,
      };

    case "400":
      return {
        status: 400,
        message: "Se requieren email y contraseña",
      };

    case "401":
      return {
        status: 401,
        message: "Clave incorrecta",
      };

    case "402":
      return {
        status: 400,
        message: "Se necesita el token bearer",
      };

    case "403":
      return {
        status: 400,
        message:
          "La contraseña no cumple con la extension requerida. (min.8 caracteres ~ max.20 caracteres)",
      };

    case "404":
      return {
        status: 404,
        message: "Usuario no existe",
      };

    case "405":
      return {
        status: 404,
        message:
          "Ausencia de datos: Se requieren todos los datos para continuar",
      };

    case "406":
      return {
        status: 401,
        message: "No autorizado: Requiere poderes",
      };

    case "407":
      return {
        status: 401,
        message:
          "No autorizado: Solo puede modificar informacion de su propio usuario",
      };

    case "410":
      return {
        status: 401,
        message: "No autorizado: Credenciales incongruentes",
      };
    case "411":
      return {
        status: 404,
        message:
          "Retorno vacio: No se esta solicitando ningun campo en la consulta. ",
      };
  }
};
