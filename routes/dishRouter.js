const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// method 1 without if/else condition

dishRouter.route('/')
.all((req,res,next) => {  //next is a callback function, irrespective of which method is called, the default page will be at /dishes endpoint. .all will the use of various methods to the specified endpoint.
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
// with the next callback, the modified data (req,res) is then passed to subsequent codes/methods, here get and post both will receive the res.statusCode and res.setHeaders, which follows below if used for same endpoint.
.get((req, res, next) => {
    res.end('Will send all the dishes to you!') // since we have used the res.end here, therefore the request is ended over here. 
})
// with the use of body-parser we now have the access to the req.body which is in json format.
.post((req, res, next) => {
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /dishes');
})
.delete((req, res, next) => {
    res.end('Deleting all the dishes!') // since we have used the res.end here, therefore the request is ended over here. 
});


dishRouter.route('/:dishId')
.get((req, res, next) => {
    res.end('Will send the dishes of the dish: ' + req.params.dishId + ' to you!') // since we have used the res.end here, therefore the request is ended over here. 
})
// with the use of body-parser we now have the access to the req.body which is in json format.
.post((req, res, next) => {
    res.end('POST operation is not supported on /dishes/' + req.params.dishId);
})
.put((req, res, next) => {
    res.write('Updating the dish: ' + req.params.dishId + '\n');
    res.end('Will update the dish: ' + req.body.name + ' with details: ' + req.body.description);
})
.delete((req, res, next) => {
    res.end('Deleting dish: ' + req.params.dishId); // since we have used the res.end here, therefore the request is ended over here. 
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


