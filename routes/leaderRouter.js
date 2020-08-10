const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req,res,next) => {  //next is a callback function, irrespective of which method is called, the default page will be at /leaders endpoint. .all will the use of various methods to the specified endpoint.
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
// with the next callback, the modified data (req,res) is then passed to subsequent codes/methods, here get and post both will receive the res.statusCode and res.setHeaders, which follows below if used for same endpoint.
.get((req, res, next) => {
    res.end('Will send all the leaders to you!') // since we have used the res.end here, therefore the request is ended over here. 
})
// with the use of body-parser we now have the access to the req.body which is in json format.
.post((req, res, next) => {
    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /leaders');
})
.delete((req, res, next) => {
    res.end('Deleting all the leaders!') // since we have used the res.end here, therefore the request is ended over here. 
});


leaderRouter.route('/:leaderId')
.get((req, res, next) => {
    res.end('Will send the leaders of the leader: ' + req.params.leaderId + ' to you!') // since we have used the res.end here, therefore the request is ended over here. 
})
// with the use of body-parser we now have the access to the req.body which is in json format.
.post((req, res, next) => {
    res.end('POST operation is not supported on /leaders/' + req.params.leaderId);
})
.put((req, res, next) => {
    res.write('Updating the leader: ' + req.params.leaderId + '\n');
    res.end('Will update the leader: ' + req.body.name + ' with details: ' + req.body.description);
})
.delete((req, res, next) => {
    res.end('Deleting leader: ' + req.params.leaderId); // since we have used the res.end here, therefore the request is ended over here. 
});

module.exports = leaderRouter;
