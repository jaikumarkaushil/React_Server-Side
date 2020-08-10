const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req,res,next) => {  //next is a callback function, irrespective of which method is called, the default page will be at /promotions endpoint. .all will the use of various methods to the specified endpoint.
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
// with the next callback, the modified data (req,res) is then passed to subsequent codes/methods, here get and post both will receive the res.statusCode and res.setHeaders, which follows below if used for same endpoint.
.get((req, res, next) => {
    res.end('Will send all the promotions to you!') // since we have used the res.end here, therefore the request is ended over here. 
})
// with the use of body-parser we now have the access to the req.body which is in json format.
.post((req, res, next) => {
    res.end('Will add the promo: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /promotions');
})
.delete((req, res, next) => {
    res.end('Deleting all the promotions!') // since we have used the res.end here, therefore the request is ended over here. 
});


promoRouter.route('/:promoId')
.get((req, res, next) => {
    res.end('Will send the promotions of the promo: ' + req.params.promoId + ' to you!') // since we have used the res.end here, therefore the request is ended over here. 
})
// with the use of body-parser we now have the access to the req.body which is in json format.
.post((req, res, next) => {
    res.end('POST operation is not supported on /promotions/' + req.params.promoId);
})
.put((req, res, next) => {
    res.write('Updating the promo: ' + req.params.promoId + '\n');
    res.end('Will update the promo: ' + req.body.name + ' with details: ' + req.body.description);
})
.delete((req, res, next) => {
    res.end('Deleting promo: ' + req.params.promoId); // since we have used the res.end here, therefore the request is ended over here. 
});

module.exports = promoRouter;
