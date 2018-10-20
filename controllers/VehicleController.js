const VehicleServiceProvider = require('../serviceProviders/VehicleServiceProvider');
const StatusCodes = require('./StatusCodes');

/**
 |
 | -----------------------------------------------------------------------
 | This file contain functions that carry out various operations in response
 | to HTTP requests in respect to the Vehicle.
 |
 |-----------------------------------------------------------------------
 |-----------------------------------------------------------------------
 |
 */

/**
 *
 * This method is responsible for handling http get request to list all vehicles.
 *
 * @param req | Http Request object.
 * @param res | Http Response Object.
 *
 * @returns {Object}
 *
 */
exports.index = async (req, res) => {
    try{
        const categories = req.query.categories;
        let vehicles = [];
        if(categories){
            //we are checking if there's a query parameter called category.
            let categoryNames = categories.split(',');
            vehicles = await VehicleServiceProvider.getAllVehiclesUnderACategoryList(categoryNames);
        }else{
            //we've confirmed that no categories was specified
            vehicles = await VehicleServiceProvider.getAllVehicles();
        }

        //return json response
        return res.status(StatusCodes.OK).json({status: StatusCodes.OK, data: vehicles, message: 'vehicles retrieved successfully'});

    }catch (err){
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR, data: null, message: `${err.message}`
        });
    }
};

/**
 *
 * This method is used to respond to a request to retrieve a single vehicle.
 *
 * @param req | the request object.
 * @param res | the response object.
 *
 * @returns {Promise<*|void|JSON|Promise<any>>}
 *
 */
exports.show = async (req, res) => {
    try{
        const licenseNumber = req.params.licenseNumber;

        const vehicle = await VehicleServiceProvider.getVehicleByLicenseNumber(licenseNumber);
        if(!vehicle){
            //we couldn't find thhe vehicles so we just return a 404.
            return res.status(StatusCodes.NOT_FOUND).json({
               status: StatusCodes.NOT_FOUND, data: null, message: 'vehicle not found,  please try with a valid number'
            });
        }

        //we found the vehicle so we return a response.
        return res.status(StatusCodes.OK).json({
            status: StatusCodes.OK, data: vehicle, message: 'vehicle found'
        });

    }catch (err){
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR, data: null, message: `${err.message}`
        });
    }
};

/**
 *
 * This method is responsible for creating a new vehicle.
 *
 * @param req | the request object.
 * @param res | the response object.
 *
 * @returns {Promise<*|void|JSON|Promise<any>>}
 *
 */
exports.store = async (req, res) => {
    try{

        let name = req.body.name;
        let colour = req.body.colour;
        let year = req.body.year;
        let licenseNumber = req.body.licenseNumber;
        let categories = req.body.categories;

        console.log('vehicles working: ', req.body);

        //we kinda do a quick check to make sure that at least we have both name and license number.
        if((!(name && licenseNumber))){
            return res.status(StatusCodes.BAD_REQUEST).json({
               status: StatusCodes.BAD_REQUEST, data: null, message: `both name and license number must be present`
            });
        }

        //we go ahead to create the vehicle
        let vehicleResponse = await VehicleServiceProvider.createVehicle(name, colour, year, licenseNumber, categories);
        console.log(vehicleResponse);

        if(!vehicleResponse.success){
            //in this case the creation process might have failed for a variety of reasons.
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.BAD_REQUEST, data: null, message: vehicleResponse.message
            });
        }

        //we successfully created the vehicle.
        return res.status(StatusCodes.CREATED).json({
            status: StatusCodes.CREATED, data: vehicleResponse.data, message: vehicleResponse.message
        });

    }catch (err){
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR, data: null, message: `${err.message}`
        });
    }
};

/**
 *
 * This method is responsible for updating a vehicle.
 *
 * @param req | the request object.
 * @param res | the response object.
 *
 * @returns {Promise<*|void|JSON|Promise<any>>}
 *
 */
exports.update = async (req, res) => {
    try{

        let name = req.body.name;
        let colour = req.body.colour;
        let year = req.body.year;
        let licenseNumber = req.params.licenseNumber;
        let categories = req.body.categories;

        //we kinda do a quick check to make sure that at least we have both name and license number.
        if((!(name && licenseNumber)) || (name.trim().length > 0 && licenseNumber.trim().length > 0)){
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.BAD_REQUEST, data: null, message: `both name and license-number(param) must be present`
            });
        }

        //we goahead to start the update operation.
        let updateVehicleResponse = await VehicleServiceProvider.updateVehicle(licenseNumber, name, colour, year, categories);
        if(!updateVehicleResponse.success){
            //so the update operation was not successful
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.BAD_REQUEST, data: null, message: updateVehicleResponse.message
            });
        }

        //the update operation was successful
        return res.status(StatusCodes.OK).json({
            status: StatusCodes.OK, data: updateVehicleResponse.data, message: updateVehicleResponse.message
        });

    }catch (err){
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR, data: null, message: `${err.message}`
        });
    }
};

/**
 *
 * This method is responsible for deleting a vehicle.
 *
 * @param req | the request object.
 * @param res | the response object.
 *
 * @returns {Promise<*|void|JSON|Promise<any>>}
 *
 */
exports.delete = async (req, res) => {
    try{

        let licenseNumber = req.params.licenseNumber;
        //so we try to delete the vehicle
        let deleteVehicleResponse = await VehicleServiceProvider.deleteVehicleByLicenseNumber(licenseNumber);
        if(!deleteVehicleResponse.success){
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.BAD_REQUEST, data: null, message: deleteVehicleResponse.message
            });
        }

        return res.status(StatusCodes.OK).json({
            status: StatusCodes.OK, data: deleteVehicleResponse.data, message: deleteVehicleResponse.message
        });


    }catch (err){
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR, data: null, message: `${err.message}`
        });
    }
};

