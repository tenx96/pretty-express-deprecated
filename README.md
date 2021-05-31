# Pretty-Express

> Typescript Decorators for writing pretty express code

## What is it

Pretty express is a library that adds Typescript decorators to methods/classes and parameters to simplify the way we write express code. It also includes jwt authenticaion and validation decorator built using [class-decorator](https://www.npmjs.com/package/class-validator)


## Features
* Controllers with a base route, marked with `@Controller` decorator
* `@get` `@post` `@patch` `@del` and `@put` decorators available for methods
* `@requestBody` `@requestParams` `@authUser` as parameter decorators inside decorated methods
* `@validate`  decorator for request body validation
* `@authenticate` decorator for jwt authentication with roles
* `@middleware` decorator passing middlewares



## Installation
````batch
$ npm install --save pretty-express
$ npm install --save reflect-meta
````
> **IMPORTANT** requires ``experimentalDecorators`` &  ``emitDecoratorMetadata`` set to ``true`` in the ``tsconfig.json`` file

> also requires  ``import "reflect-metadata";'`` at the top of your entry level file (eg ``index.ts``)

## Getting started


### Creating your controller : 

````typescript
import "reflect-metadata";
import { Controller, get, post, requestParams, Server } from "pretty-express";
import express, { Request, Response, NextFunction, Express } from "express";


@Controller("/api/users")
class UserController {
  @get("/")
  async getUsers(req: Request, res: Response, next: NextFunction) {
    return { message: "hello pretty express" }; 
    //the returned object is sent as json response with default status code : 200.
  }
// @requestParams passes the parameter data.
  @post("/:id")
  async addUsers(@requestParams data: any) {
    return { msg: "Recieved params ", data };
  }
}

````


### Register your controller with your express app



````typescript
class ApplicationServer extends Server {
  constructor(private app: Express) {
    super(app);
  }

  start() {
// register your controller
    this.addControllersToServer([new UserController()]);

    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      console.log(`Listening on http://localhost:${port}`);
    });
  }
}

const app = express();
const server = new ApplicationServer(app);
server.start();
````


## Parameter Decorators
> Pretty express provides 3 parameter decorators for our decorated functions

|decorators|details|
|-|-|
|@requestBody|the request body|
|@requestParams|the request parameters|
|@authUser|the credentials of the authenticated user eg ``{id , iat}``|
|||

````typescript
  @post("/")
  async addUsers(@requestBody data: UserCredentials , @requestParams params : any , @authUser authUser : any) {
    return  {data};
  }
````

> if no parameters are decorated the default arguments ``(Request, Response, NextFunction)`` from the express RouterHandler will be passed

````typescript
  @get("/")
  async getUsers(req: Request, res: Response, next: NextFunction) {
    return { message: "hello pretty express" };
  }
````

> Optionally You can also access the express routeHandler params as the final 3 arguments of the function in order.


````typescript
  @get("/")
  async getUsers(@requestBody data : any, req: Request, res: Response, next: NextFunction) {
    return { message: "hello pretty express" };
  }
````


# returning a response

> By default the returned object of a decorated fucntion is returned as a JSON object with a status : 200


```typescript
  @del("/")
  async de(req: Request, res: Response, next: NextFunction) {
    return { method: "delete" };
  }
```

> To return a response with a custom status code. Simply return an object of type HttpResponse(status, object)

```typescript
  @post("/")
  async putFunction(req: Request, res: Response, next: NextFunction) {
    return new HttpResponse(201, { message: "created" });
  }
```

> to return an error response, just throw an error of type HttpError


````typescript
  @patch("/")
  async errprFunction(req: Request, res: Response, next: NextFunction) {
    throw new HttpError(400, "Hello Erro!");
  }
````











## Request Level and Controller level middlewares

#### You can pass middlewares using the @middleware decorator on controllers and fucntions

> define your middleware

````typescript
function requestMiddleware (req : Request,res : Response,next : NextFunction) {
  console.log("Entered request middleware. Do something")
  next()
}
````

> use the @middleware decorator

````typescript
  @middleware(requestMiddleware)
  @post("/:id")
  async addUsers(@requestParams data: any) {
    return { msg: "Recieved params ", data };
  }
````

> you can also pass multiple middlewares like this


````typescript
  @middleware(requestMiddleware , requestMiddleware2, requestMiddlewar3)
  @post("/:id")
  async addUsers(@requestParams data: any) {
    return { msg: "Recieved params ", data };
  }
````


### Similarly on controllers
````typescript 
@middleware(controllerMiddleware)
@Controller("/api/users")
class UserController {
  @get("/")
  async getUsers(req: Request, res: Response, next: NextFunction) {
    return { message: "hello pretty express" };
  }

  // @requestParams passes the parameter data.
  @middleware(requestMiddleware)
  @post("/:id")
  async addUsers(@requestParams data: any) {
    return { msg: "Recieved params ", data };
  }
}
````

> Note That the controller level middlewares are called first followed by the request level middlewares.



## Request Body Validation

> Request body is validated using the [class-validator](https://www.npmjs.com/package/class-validator) library
> Our library provides a @validate decorator were you can pass models created with class validator and validator options


> Use ``npm install class-validator`` to get the model decorators used below.
> See [class-validator](https://www.npmjs.com/package/class-validator) page for more details about the available decorators

````typescript
export class UserCredentials {
    @IsEmail()
    email: string;
  
    @IsString()
    password: string;
  
    @IsOptional()
    @IsString()
    name: string;
  }

@Controller("/api/users")
class UserController {
  // @requestBody passes the body data.
  @validate(UserCredentials, { whitelist: true })
  @post("/")
  async addUsers(@requestBody data: UserCredentials) {
    return  {data};
  }
}
````
> The request body after validation is passed with the ``@requestBody`` decorator to our function where you can now access it.

> It is also possible to use @validate at the controller level

````typescript
@validate(UserCredentials)
@Controller("/api/users")
class UserController {
  @get("/")
  async getUsers(@requestBody data : any, req: Request, res: Response, next: NextFunction) {
    return { message: "hello pretty express" };
  }


  @post("/")
  async addUsers(@requestBody data: UserCredentials , @requestParams params : any , @authUser authUser : any) {
    return  {data};
  }
}
````



## JWT AUTHENTICATION (Testing / Under Development)
### Pretty express provides @authenticate decorator to protect your routes
### The actual authenticaion logic is not implemented by the package. It only provides helpers and decorators to achieve the authentication.


> To start, we need to create a AuthenticaionService class that inhereits ``JwtAuthenticationStrategy`` with a `@AuthStrategy` decorator <br>
>`@AuthStrategy` will take a string as an input which will be the name of our authentication strategy <br>

> In the service class we have to implement the given abstract methods:
 ``verifyToken`` , ``verifyCredentials``  and ``generateToken`` <br>
 ``generateToken`` returns a string token <br>
``verifyToken`` verifies the token string and returns the decoded data<br>
``verifyCredentials`` checks the data and the required role. <br>


> In the example below we used [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) to generate the tokens.

````typescript
import { JwtAuthenticationStrategy, AuthStrategy } from "pretty-express";
import jwt from "jsonwebtoken";

const jwtKey = "Auth Key";

export interface UserCredentials {
  id: string;
  email: string;
  role?: string;
}

@AuthStrategy("jwt")
export class MyJwtAuthService extends JwtAuthenticationStrategy {

  // generates a token
  async generateToken(credentials: UserCredentials): Promise<string> {
    return await jwt.sign(credentials, jwtKey);
  }

  // verifies the token and returns the decoded data
  async verifyToken(token: string): Promise<Object> {
    try {
      const decoded = await jwt.verify(token, jwtKey);
      return decoded;
    } catch (err) {
      throw new Error("An error occured while verifying token");
    }
  }

// verifies the role and other data. the requiredRole is recieved as a string array
  async verifyCredentials(
    credentials: UserCredentials,
    requiredRole?: string[]
  ): Promise<Object> {
    try {
      if (requiredRole && requiredRole.length > 0) {
        if (requiredRole.includes(credentials.role)) {
          throw new Error("User is not of required role. Access Denied!");
        }
      }
      return credentials;
    } catch (err) {
      throw err;
    }
  }
}

````

### Register your service on your server

````typescript
export class ApplicationServer extends Server {
  private app : Express;

  constructor(app : Express) {
    super(app);
    this.app = app;
  }

  start() {
// register authentication service here
    this.addAuthenticationStrategies([new MyJwtAuthService()]);
// register your controllers here
    this.addControllersToServer([new UserController()]);

    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      console.log(`Listening on http://localhost:${port}`);
    });
  }
}
````



### you can now use this authentication with the @authenticate decorator on your functions and controlllers

<br>

> Request level
````typescript
  @authenticate("jwt" , {role : ["admin"]})
  @post("/")
  async addUsers(@requestBody data: UserCredentials , @requestParams params : any , @authUser authUser : any) {
    return  {data};
  }
````

> Controller level
````typescript
@authenticate("jwt" , {role : ["user"]})
@Controller("/api/users")
class UserController {
  @get("/")
  async getUsers(@requestBody data : any, req: Request, res: Response, next: NextFunction) {
    return { message: "hello pretty express" };
  }

  @authenticate("jwt" , {role : ["admin"]})
  @post("/")
  async addUsers(@requestBody data: UserCredentials , @requestParams params : any , @authUser authUser : any) {
    return  {data};
  }
}

````



> if no role is provided, it will skip the role check

````typescript
  @authenticate("jwt")
  @post("/")
  async addUsers(@requestBody data: UserCredentials , @requestParams params : any , @authUser authUser : any) {
    return  {data};
  }
````



## CONCLUSION

### Pretty Express is still under rapid development. To Contribute checkout the github page.

### If you find any bugs please raise an issue on our github page.

<br>

# THANKS!
















