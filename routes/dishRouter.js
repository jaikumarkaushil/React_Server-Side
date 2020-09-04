// updated the routers for supporting the integration of the database with the rest api end points
// this files serves the business logic which will initiate the database operation on the backend with the help of mongoose
const express = require('express');
const bodyParser = require('body-parser');
const mongoose =require('mongoose'); 

const authenticate = require('../authenticate');

const Dishes = require('../models/dishes');
// const { request } = require('../app');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// method 1 without if/else condition

dishRouter.route('/')
// with the next callback, the modified data (req,res) is then passed to subsequent codes/methods, here get and post both will receive the res.statusCode and res.setHeaders, which follows below if used for same endpoint.
.get((req, res, next) => {
    Dishes.find({})
    .populate('comments.author') // using this we can construct the user model with details of user in it for reference
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);  // this will put the dishes collection/ document in the message body of the get request
    }, (err) => next(err)) // with this I will pass the error to the error handling that will take care of it.
    .catch((err) => next(err));
})
// with the use of body-parser we now have the access to the req.body which is in json format.
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => { // the user will able to post only it is verified user with middleware authenticate.verifyUser provided in authenticate.js file
    Dishes.create(req.body)
    .then((dish) => {
        console.log('Dish Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /dishes');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);  // this will put the dishes collection/ document in the message body of the get request
    }, (err) => next(err)) // with this I will pass the error to the error handling that will take care of it.
    .catch((err) => next(err));
})
// with the use of body-parser we now have the access to the req.body which is in json format.
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.end('POST operation is not supported on /dishes/' + req.params.dishId);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);  
    }, (err) => next(err)) 
    .catch((err) => next(err));
});

dishRouter.route('/:dishId/comments')
// with the next callback, the modified data (req,res) is then passed to subsequent codes/methods, here get and post both will receive the res.statusCode and res.setHeaders, which follows below if used for same endpoint.
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if (dish != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);  // this will put the comments documents to dish document in the message body of the get request
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found')
            err.status = 404;
            return next(err);
        } 
    }, (err) => next(err)) // with this I will pass the error to the error handling that will take care of it.
    .catch((err) => next(err));
})
// with the use of body-parser we now have the access to the req.body which is in json format.
.post(authenticate.verifyUser, (req, res, next) => {
    // now the comments.author is no more in req.body, we have to resolve this issue
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) {
            req.body.author = req.user._id;  // with the help of verifyuser middleware, we now have the user information , so we can now refer it to the user logged in.
            dish.comments.push(req.body);
            dish.save()
            .then((dish) => {
                Dishes.findbyId(dish._id)
                    .populate('comments.author')
                    .then((dish) => {
                        res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);  //this will send the updated dish to the user on client side.
                    })
                
            },(err) => next(err))
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found')
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /dishes' + req.params.dishId + '/comments');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) {
            for (var i = (dish.comments.length -1); i >=0; i--){
                dish.comments.id(dish.comments[i]._id).remove(); //dish.comments.id(dish.comments[i]._id) - this is used to access the subdocuments inside a document
            }
                dish.save()
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);  //this will send the updated dish to the user on client side.
            },(err) => next(err))
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found')
            err.status = 404;
            return next(err);
        }
        
    }, (err) => next(err)) // with this I will pass the error to the error handling that will take care of it.
    .catch((err) => next(err));
});


dishRouter.route('/:dishId/comments/:commentId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));  // this will put the comments documents to dish document in the message body of the get request
        }
        else if (dish == null){
            err = new Error('Dish ' + req.params.dishId + ' not found')
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found')
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err)) // with this I will pass the error to the error handling that will take care of it.
    .catch((err) => next(err));
})
// with the use of body-parser we now have the access to the req.body which is in json format.
.post(authenticate.verifyUser, (req, res, next) => {
    res.end('POST operation is not supported on /dishes/' + req.params.dishId + '/comments/' + req.params.commentId);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        const userID = req.user._id;
        console.log(req.body.comments);
        // if(req.user._id.equals(comments.author)) {
            if (dish != null && dish.comments.id(req.params.commentId) != null) {  // there is no specific way to handle the modifiication of subdocument (embedded document) fields and their value. This is the best way which works very well
                if (req.body.rating) {
                    dish.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if (req.body.comment){
                    dish.comments.id(req.params.commentId).comment = req.body.comment;
                }
                dish.save()
                .then((dish) => {
                    Dishes.findById(dish._id)
                        .populate('comments.author')
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        })  
                },(err) => next(err))
            }
            else if (dish == null){
                err = new Error('Dish ' + req.params.dishId + ' not found')
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error('Comment ' + req.params.commentId + ' not found')
                err.status = 404;
                return next(err);
            }
        // }
        
    }, (err) => next(err)) // with this I will pass the error to the error handling that will take care of it.
    .catch((err) => next(err));

 })
.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);  //this will send the updated dish to the user on client side.
            },(err) => next(err))
        }
        else if (dish == null){
            err = new Error('Dish ' + req.params.dishId + ' not found')
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found')
            err.status = 404;
            return next(err);
        }
        
    }, (err) => next(err)) // with this I will pass the error to the error handling that will take care of it.
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


