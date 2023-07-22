import request from "supertest";
import { app } from "../../index.js";
import {expect, jest} from '@jest/globals';
import { cartModel } from "../models/cart.model.js";
import { orderModel } from "../models/order.model.js";

const getCartMock = {
    id: 45,
    user_account_id: 12,
    total_price: 999970,
    product: [
      {
        product_name: "ASUS ROG Strix Z390-E Gaming",
        product_id: 1,
        product_quantity: 1,
        price_x_quantity: 299980,
        image_url: "https://img.pccomponentes.com/articles/17/172090/5.jpg"
      },
      {
        product_name: "MSI MPG Z390 Gaming Pro Carbon AC",
        product_id: 2,
        product_quantity: 1,
        price_x_quantity: 699990,
        image_url: "https://images.anandtech.com/doci/13407/msi-mpg_z390_gaming_pro_carbon_ac-2d-led.jpg"
      }
    ]
  };

  const addProductMockRequest = {
    user_account_id:12,
    product:[
       {
          product_id:2,
          quantity:2
       }
    ]
};
const addProductMockBadRequest = {
    user_account_id:12,
    product:[
       {
          product_id:2,
          quantity:-1
       }
    ]
};

const addProductMockResponse = {
        id: 45,
        user_account_id: 12,
        total_price: 299980,
        product: [
          {
            product_name: "ASUS ROG Strix Z390-E Gaming",
            product_id: 1,
            product_quantity: 1,
            price_x_quantity: 299980,
            image_url: "https://img.pccomponentes.com/articles/17/172090/5.jpg"
          }
        ]
      };

const productToDeleteRequest = {
    user_account_id:12,
    product:[
       {
          product_id:1,
          quantity:1
       }
    ]
 }

const productToDeleteResponse = {
        id: 45,
        user_account_id: 12,
        total_price: 1199920,
        product: [
          {
            product_name: "ASUS ROG Strix Z390-E Gaming",
            product_id: 1,
            product_quantity: 1,
            price_x_quantity: 1199920,
            image_url: "https://img.pccomponentes.com/articles/17/172090/5.jpg"
          }
]};

const orderResponse = {
    id: 45,
    user_account_id: 12,
    total_price: 1199920,
    product: [
      {
        product_name: "ASUS ROG Strix Z390-E Gaming",
        product_id: 1,
        product_quantity: 1,
        price_x_quantity: 1199920,
        image_url: "https://img.pccomponentes.com/articles/17/172090/5.jpg"
      }
]};

let token;

describe("API Rest testing", ()  => { 
    beforeEach(async ()=>{
        const {body} = await request(app)
        .post("/users/login")
        .send({
            email:"test@test.com",
            password:"123456asd"
            }
        );
       token = body.token 
    });

   describe("successful status response test", ()  =>	{   
    it("should respond code '200' in GET /cart/", async () => {

        jest.spyOn(cartModel, "getCart").mockReturnValue(getCartMock); 

		const response = await request(app)
			.get("/cart/")
			.set("Authorization", "Bearer " + token);  

		expect(response.status).toBe(200);
        expect(response.body).toEqual(getCartMock);
	});

    it("should respond code '200' in PUT /cart/", async () => {

        jest.spyOn(cartModel, "addProductToCart").mockReturnValue(addProductMockResponse); 

		const response = await request(app)
			.put("/cart/")
			.set("Authorization", "Bearer " + token)
			.send(addProductMockRequest);
            
        expect(response.body).toEqual(addProductMockResponse)
		expect(response.status).toBe(200);
	});

    it("should respond code '200' in DELETE /cart/", async () => {
		
        jest.spyOn(cartModel, "deleteProductFromCart").mockReturnValue(productToDeleteResponse); 

		const response = await request(app)
			.delete("/cart/")
			.set("Authorization", "Bearer " + token)
			.send(productToDeleteRequest);
        expect(response.body).toEqual(productToDeleteResponse)
		expect(response.status).toBe(200);
	});

    it("should respond code '200' in POST /order/", async () => {
		
        jest.spyOn(orderModel, "genOrder").mockReturnValue(orderResponse); 

		const response = await request(app)
			.post("/order/")
			.set("Authorization", "Bearer " + token)
        expect(response.body).toEqual(orderResponse)
		expect(response.status).toBe(200);
	});
   });

   
   describe("request without token test", ()  => { 
    it("should respond code '401' in GET /cart/ if its called without bearer token", async () => {

        jest.spyOn(cartModel, "getCart").mockReturnValue(getCartMock); 
 
        const response = await request(app)
            .get("/cart/")  
 
        expect(response.status).toBe(401);
    })
 
    it("should respond code '401' in PUT /cart/", async () => {
 
        jest.spyOn(cartModel, "addProductToCart").mockReturnValue(addProductMockResponse); 
 
        const response = await request(app)
            .put("/cart/")
            .send(addProductMockRequest);
 
        expect(response.status).toBe(401);
    });
 
    it("should respond code '401' in DELETE /cart/", async () => {
        
        jest.spyOn(cartModel, "deleteProductFromCart").mockReturnValue(productToDeleteResponse); 
 
        const response = await request(app)
            .delete("/cart/")
            .send(productToDeleteRequest);
        expect(response.status).toBe(401);
    });
 
    it("should respond code '401' in POST /order/", async () => {
        
        jest.spyOn(orderModel, "genOrder").mockReturnValue(orderResponse); 
 
        const response = await request(app)
            .post("/order/")
 
        expect(response.status).toBe(401);
    });

    it("should respond code '401' in GET /cart/ if its called without bearer token", async () => {

        jest.spyOn(cartModel, "getCart").mockReturnValue(getCartMock); 
 
        const response = await request(app)
            .get("/cart/")  
 
        expect(response.status).toBe(401);
    })
 
    it("should respond code '401' in PUT /cart/", async () => {
 
        jest.spyOn(cartModel, "addProductToCart").mockReturnValue(addProductMockResponse); 
 
        const response = await request(app)
            .put("/cart/")
            .send(addProductMockRequest);
 
        expect(response.status).toBe(401);
    });
 
    it("should respond code '401' in DELETE /cart/", async () => {
        
        jest.spyOn(cartModel, "deleteProductFromCart").mockReturnValue(productToDeleteResponse); 
 
        const response = await request(app)
            .delete("/cart/")
            .send(productToDeleteRequest);
        expect(response.status).toBe(401);
    });
 
    it("should respond code '401' in POST /order/", async () => {
        
        jest.spyOn(orderModel, "genOrder").mockReturnValue(orderResponse); 
 
        const response = await request(app)
            .post("/order/")
 
        expect(response.status).toBe(401);
    });
   });

describe("bad request test", ()  => {
    
    it("should respond code '400' in PUT /cart/ ", async () => {

        jest.spyOn(cartModel, "addProductToCart").mockReturnValue(addProductMockResponse); 

		const response = await request(app)
			.put("/cart/")
			.set("Authorization", "Bearer " + token)
			.send(addProductMockBadRequest);
            
		expect(response.status).toBe(400);
	});

    it("should respond code '400' in DELETE /cart/", async () => {
		
        jest.spyOn(cartModel, "deleteProductFromCart").mockReturnValue(productToDeleteResponse); 

		const response = await request(app)
			.delete("/cart/")
			.set("Authorization", "Bearer " + token)
			.send(addProductMockBadRequest);

		expect(response.status).toBe(400);
	});
  });
});

