// updated the routers for supporting the integration of the database with the rest api end points
// this files serves the business logic which will initiate the database operation on the backend with the help of mongoose
const express = require('express');
const bodyParser = require('body-parser');
const mongoose =require('mongoose'); 

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// method 1 without if/else condition

dishRouter.route('/')
// with the next callback, the modified data (req,res) is then passed to subsequent codes/methods, here get and post both will receive the res.statusCode and res.setHeaders, which follows below if used for same endpoint.
.get((req, res, next) => {
    Dishes.find({})
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);  // this will put the dishes collection/ document in the message body of the get request
    }, (err) => next(err)) // with this I will pass the error to the error handling that will take care of it.
    .catch((err) => next(err));
})
// with the use of body-parser we now have the access to the req.body which is in json format.
.post((req, res, next) => {
    Dishes.create(req.body)
    .then((dish) => {
        console.log('Dish Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /dishes');
})
.delete((req, res, next) => {
    Dishes.remove({})
    .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


dishRouter.route('/:dishId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);  // this will put the dishes collection/ document in the message body of the get request
    }, (err) => next(err)) // with this I will pass the error to the error handling that will take care of it.
    .catch((err) => next(err));
})
// with the use of body-parser we now have the access to the req.body which is in json format.
.post((req, res, next) => {
    res.end('POST operation is not supported on /dishes/' + req.params.dishId);
})
.put((req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {new: true})
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);  
    }, (err) => next(err)) 
    .catch((err) => next(err));

 })
.delete((req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);  
    }, (err) => next(err)) 
    .catch((err) => next(err));
});

module.exports = dishRouter;

// Method 2 with if else condition

// dishesRouter.route('/:dishId?')
// .all((req, res, next) => {
//     res.statusCode = 200;  
//     next();  
// })
// .get((req, res, next) => {
//     if(!req.params.dishId)
//         res.end('getting all list of Dishes');    
//     else    
//         res.end('Details of dish is '+ req.params.dishId);
// })
// .post((req, res, next) => {
//     if(!req.body.name)
//     {
//         res.statusCode = 403;  
//         res.end('New dish details are missing in payload');    
//     }    
//     res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
// })
// .put((req, res, next) => {
//     if(!req.params.dishId)
//     {
//         res.statusCode = 403;  
//         res.end('Dish Id is missing');        
//     }
//     res.end('Dish '+ req.params.dishId +' is updated in menu');
// })
// .delete((req, res, next) => {
//     if(!req.params.dishId)
//     {
//         res.statusCode = 403;  
//         res.end('Dish Id is missing');    
//     }    
//     res.end('Dish '+ req.params.dishId +' is removed from menu');
// });


