const express = require('express');


const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


const port = process.env.PORT || 5000

const app = express();
const host = process.env.IFLEET_URL || 'localhost';

const mongoDBUrl = process.env.IFLEET_DB || "mongodb://localhost:27017/ifleetdb";
var urlencodedParser = bodyParser.urlencoded({extended: false})
// app.use(urlencodedParser);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoDBUrl, { useNewUrlParser: true }, () => {
    console.log('mongo connected');
});


const apiRouter = express.Router();
app.use('/api/v1', apiRouter);


apiRouter.get('/live', (req, res) => {
   res.status(200).json({status: 200, data: {}, message: 'yes we are live'});
});

//here we import our controllers.
const VehicleController = require('./controllers/VehicleController');

//okay so here we begin to register our routes.
apiRouter.get('/vehicles',  VehicleController.index); //get all vehicles, also by category if the categories query param is filled

apiRouter.get('/vehicles/:licenseNumber', VehicleController.show); //retrieve a single vehicle by license number.

apiRouter.post('/vehicles', VehicleController.store); //create a new vehicle.

apiRouter.put('/vehicles/:licenseNumber', VehicleController.update); //update an already existing vehicle.

apiRouter.delete('/vehicles/:licenseNumber', VehicleController.delete); //delete an already existing vehicle.


app.listen(port, () => {
   console.log('IFleet API Started');
});