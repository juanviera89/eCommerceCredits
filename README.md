# eCommerceCredits

   Author: Juan Viera
   Country: Chile
   Region/County/State: Region Metropolitana
   Contact: juanviera89@gmail.com

## Project Description

MVP API Rest for store's credits management

## Platforms

   1. -Node Js

## Requirements

   1. -Node Js LTS
   2. -Express Js @4
   3. -sequelize  @6
   4. -JSON web token @8
   5. -basic-auth @2
   6. -md5 @2
   7. -pg @8

## Commands

  1. Execute on local: node index.js
    *a. arguments can modify behavior; see arguments list.
  2. build for deployment: docker build -t ## . 
  3. Components test: npm test
  4. Server test: npm run testserver
  5. Dev auto restart: npm run nodemon

### Execution arguments

Argument | function
--- | ---
log | Show logs made in script          
## Porject Folder Structure
``` 
root
|__ index.js : Main script 
|__ .env.example : example structure of .env file for enviroment variables assignation in local deployment enviroment ~ it is not suggested to use this file on production deployment
|__ app : express applications pool handler
|__ components : Components for data processing - Microservices arquitecture type components
|   |__ component : 
|       |__ controller : functions for request handling
|       |__ middleware : utilities functions required for preprocessing data
|__ config : configuration files repositorie ~ More about configuration @ [github](https://github.com/lorenwest/node-config/wiki) and [npmjs](https://www.npmjs.com/package/config)
|__ db : database connection handler ~ more info about sequelize @ [sequelize](https://sequelize.org/master/ https://www.npmjs.com/package/sequelize)
|   |__ models : sequelize models schemas. 
|__ router : routing module for express app. Procedure for auto routes loading is stored in this folder
|   |__ routes : this folder contains root route and subroutes to be loaded by router module
|       |__ index : script that defines and exports methods to be aplied to the route
|       |__ middleware.pre : script that defines and exports middlewares to be aplied before route controller
|       |__ middleware.post : script that defines and exports middlewares to be aplied after route controller
|   |__ index.js : Routes autoloader
|__ utils : Utilitie functions for horizontal use across aplication
```

## Project Navigation Map

Endpoints are described in [swagger yaml](./api.yaml) following the [OPEN API 2.0](https://swagger.io/specification/) rules.

After server init, console will display routes definition made by router autoloader description exporter

API definition file can be imported in Postman for testing purposes.

## Configurations

   All configuration variables are disposed in a centralized files in  folder  **(./config)** , separated for each deployment and/or development enviroment. To define the enviroment, enviroment variable NODE_ENV must be set; if not set, [.env](./.env) would be readed and NODE_ENV would get the value specified in that file (Only if dev dependencies are installed). Patterns to setup configuration files are descrbibe at [default example](./config/default.json.example) and [enviroment example](./config/enviroment.json.example)

   To get a config in the App, import config, and library will automatically load files related to actual enviroment specified by NODE_ENV

   for more information about config visit:
   1. [github](https://github.com/lorenwest/node-config/wiki)
   2. [npmjs](https://www.npmjs.com/package/config)

### Example of use:

   getting DB host:
   `config.get('db.host')`

## Routing 

To route a new endpoint, define controller at components folder, create the folder (And subfolders if needed) that represents the path to follor in url (routes folder acts as base path), create an index file, import controllers and define routes method with express router.method(path, controller); finally export router. For route description, define an object, with method as property, input format schema and finally export a object with the format {methods : description, routes : expressRouter} 

## Query handling

Queries in this project are handled with ORM models by sequelize.
   1. [github](https://github.com/sequelize/sequelize)
   2. [npmjs](https://www.npmjs.com/package/sequelize)

## Automated Tests

  Tests are made with mocha and assert library chai. In this project, test are splitted by components and routes (server) and each test command is specified at command point in this document.
  
   1. [mocha-npmjs](https://www.npmjs.com/package/mocha)
   2. [chai-npmjs](https://www.npmjs.com/package/chai)
  
  In order to ensure that everything stills running after changes were made, test must pass.

  If any component runs logical operations more than querying and compare, test should be made at those operations, refactoring is recommended.

  All routes must have test.

  To create a test file, name it with the format *.test.js

## Manual Tests

  Tests via postman can be made by importing the collection @ [PostmanCollection](./ecommerceCredits.postman_collection.json).

  Request parameters required can be found @ [swagger yaml](./api.yaml)

## Deployment
Deployment is made with AWS ECS and AWS ECR services.
in order to build project for deployment, the following commands are executed: **AWS CLI is required to perform this actions**
 ***Must be previously logged with AWS CLI***
1. aws ecr get-login --region us-east-2 --no-include-email
   *use login command result*
2. docker build -t ecommerce-credits .
    *in root folder*
3. docker tag ecommerce-credits:latest 750466127305.dkr.ecr.us-east-2.amazonaws.com/ecommerce-credits:latest
    *TAG usually refers to enviroment or release*
4. docker push  750466127305.dkr.ecr.us-east-2.amazonaws.com/ecommerce-credits:latest

## Endpoint definitions

if endpoint paths or requirements are updated and/or created, definitions must be made in swagger files following Open API rules.