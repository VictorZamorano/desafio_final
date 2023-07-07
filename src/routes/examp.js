// PREGUNTAR POR RUTAS PUT EN SHOPPING CART y ORDER 

// ================================================================================================
// USER/CUSTOMER ROUTES    USER/CUSTOMER ROUTES
// ================================================================================================

// request: 
    // body: register: {email: string, password: string} 
// response: {ok: boolean, result: register}
router.post("/register");

// ------------------------------------------------------------------------------------------------


// request:
    // headers: {"Authorization": "Bearer token" }
    // body: login: {email: string, password: string}
// response: {ok: boolean, result: login}
router.post("/login");

// ------------------------------------------------------------------------------------------------

// request:
    // headers: {"Authorization": "Bearer token" }
    // params: {id: number}
// response: response: {ok: boolean, result: {customer: {name: string, first_name: string, phone: number}} }
router.get("/perfil");

// ------------------------------------------------------------------------------------------------
// request:
    // headers: {"Authorization": "Bearer token" }
    // queries: {id: number, user_account_id: number, city: string, address: string} 
// response: response: {ok: boolean, result: {address: {region: string, city: string, address: string}} }
router.get("/address");


// router.get("/favorites");?????

// ------------------------------------------------------------------------------------------------

// request:
//  headers: {"Authorization": "Bearer token" }
//  params: {id}
//  queries: user_account: {id: number}

// PREGUNTAR CUAL USAR O COMO HACERLO 
// ??? request: queries: shopping_cart_details: [{id: number, product_id: id, quantity: number, price: number, total_price: number}] 
router.get("/cart");

// ================================================================================================
// END USER/CUSTOMER ROUTES    USER/CUSTOMER ROUTES
// ================================================================================================

// ================================================================================================
// PRODUCTS ROUTES    PRODUCTS ROUTES
// ================================================================================================

// request:
    // query: [{limit: 10, page: number, order_by: string}] 
// response: {ok: boolean, result: [{product: string, price: number}...]}
router.get("/products"); /* INICIO PRODUCTOS?*/
// router.get("/categories");

// ------------------------------------------------------------------------------------------------

// request: 
    // params: {id: number/string,} 
    // queries: queries: { product: string, price: number}
// response: response: {ok: boolean, result: {id: number?, product: string, price: number, description: varchar} }
router.get("/product/:id");

// ------------------------------------------------------------------------------------------------

// request: 
    // queries: {price_max, price_min, categories,...}
// response: {ok: boolean, result: [{id: number?, product: string, price: number},...] }
router.get("/products/filters")


// ================================================================================================
// ORDER ROUTES    ORDER ROUTES
// ================================================================================================

// request:
    // headers: {"Authorization": "Bearer token" }
    // params: {id: number}
    // query: [{limit?, page?, order_by: string}] 
// PREGUNTAR
// query for order_details
// request: queries: {shopping_cart: id: number, user_account_id: number, total_price: number}
// response: {ok: boolean, result: [{product_id: number?, product: string, quantity: number, price: number},...]

router.get("/order")

// ------------------------------------------------------------------------------------------------

// request:
    // headers: {"Authorization": "Bearer token" }
    // params: {id: number}
    // query: [{limit?, page?, order_by: string, total_price}] <--------------

// PREGUNTAR
// query for order
// request: queries: {order: user_account_id: number, total_price: number}
// response: {ok: boolean, result: [{order_id: number?, product_id: number, product: string, quantity: number, total_price: number},...]
router.get("/order/payment")

// ================================================================================================
// END ORDER ROUTES    ORDER ROUTES
// ================================================================================================





[{id: serial, region_name: string}] 
router.get("/region)
{id: serial, region_name: string}
router.get("/region/:idRegion) 
// -------------------------------
[{id: serial, city_name: string}] 
Router.get("/city)
// ==========================
No se si usar esta ruta/* ?????? */ 
{email, string, phone: number, } 
router.get("/contactos");
// ==========================
router.get("/centrodeayuda");