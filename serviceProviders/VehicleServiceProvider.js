const VehicleModel  = require('../models/Vehicle');
const CategoryServiceProvider = require('./CategoryServiceProvider');

/**
 |
 | -----------------------------------------------------------------------
 | This file contain functions that carry out various operations on the
 | Vehicle model.
 |-----------------------------------------------------------------------
 |-----------------------------------------------------------------------
 |
 */


/**
 *
 * This method is responsible for creating a vehicle inside the mongodb database.
 *
 * @param name | the name of the vehicle being added.
 * @param colour | the colour of the vehicle being added.
 * @param year | the year the vehicle was made.
 * @param licenseNumber | the licenseNumber of the vehicle being added.
 * @param categories | an array of categories that the vehicle belongs to.
 *
 * @returns {Object} | resolves to the added vehicles.
 *
 */
exports.createVehicle = async (name, colour, year, licenseNumber, categories) => {

    //so first we love dealing with lower case characters all through so we convert all our parameters
    //to lower case characters.

    name = name.toLocaleLowerCase();
    colour = colour.toLocaleLowerCase();
    year = year.toLocaleLowerCase();
    licenseNumber = licenseNumber.toLocaleLowerCase();

    let lowerCaseCategories = [];

    categories.map((category) => {
        lowerCaseCategories.push(category.toLocaleLowerCase());
    });

    //at this point we have all our data in lowercase,  next we do some series of confirmations.

    //we confirm first that another vehicle with that licenseNumber does not exist yet.
    if(await exports.getVehicleByLicenseNumber(licenseNumber)){
       return {success: false, data: null, message: 'a vehicle with that license number already exists'};
    }

    //we kinda go through our categories in the list supplied, validate them and act accordingly
    const returnedCategoriesResponse = await CategoryServiceProvider.validateAndCreateCategories(lowerCaseCategories);

    if(!returnedCategoriesResponse.success){
        return returnedCategoriesResponse;
    }

    const returnedCategories = returnedCategoriesResponse.data;
    const returnedCategoryNames = returnedCategories.map((returnedCategory) => {
        return returnedCategory.name;
    });



    let createdVehicle = await VehicleModel.create({
        name, colour, year, licenseNumber, categories: returnedCategoryNames
    });

    return (createdVehicle) ?
        {success: true, data: createdVehicle, message: `created vehicle ${licenseNumber} successfully`} :
        {success: false, data: null, message: `could not create vehicle ${licenseNumber}`};

}

/**
 *
 * This method is responsible for updating a vehicle that already exist on mongodb.
 *
 * @param licenseNumber | the license number of the vehicle to update.
 * @param newName | the new name which the vehicle should carry.
 * @param newColour | the new colour which the vehicle should carry.
 * @param newYear | the new year the vehicle should carry.
 * @param newCategories | the new categories list the vehicle should carry.
 *
 * @returns {Object}
 *
 */
exports.updateVehicle = async (licenseNumber, newName, newColour, newYear, newCategories) => {
    //so first we love dealing with lower case characters all through so we convert all our parameters
    //to lower case characters.

    newName = newName.toLocaleLowerCase();
    newColour = newColour.toLocaleLowerCase();
    newYear = newYear.toLocaleLowerCase();
    licenseNumber = licenseNumber.toLocaleLowerCase();

    let lowerCaseCategories = [];

    categories.map((category) => {
        lowerCaseCategories.push(category.toLocaleLowerCase());
    });

    //at this point we have all our data in lowercase,  next we do some series of confirmations.

    //we confirm first that the vehicle exist.
    let vehicle = await exports.getVehicleByLicenseNumber(licenseNumber);
    if(!vehicle){
        return {success: false, data: null, message: 'we couldn\'t find the vehicle in question'};
    }

    //before we make any changes we store the current state of the vehicle to our change log.

    vehicle.changeLog.push(vehicle);

    //we kinda go through our categories in the list supplied, validate them and act accordingly
    const returnedCategoriesResponse = await CategoryServiceProvider.validateAndCreateCategories(lowerCaseCategories);

    if(!returnedCategoriesResponse.success){
        return returnedCategoriesResponse;
    }

    const returnedCategories = returnedCategoriesResponse.data;
    const returnedCategoryNames = returnedCategories.map((returnedCategory) => {
        return returnedCategory.name;
    });



    //with that out of the way, next we update the various fields on the vehicle object.
    let updatedVehicle = await VehicleModel.update({licenseNumber}, {
        name: newName,
        colour: newColour,
        year: newYear,
        changeLog: vehicle.changeLog,
        categories: returnedCategoryNames
    });

    return (updatedVehicle)?
        {success: true, data: updatedVehicle, message: `vehicle ${licenseNumber} updated successfully`} :
        {success: false, data: null, message: `could not update vehicle ${licenseNumber}`};


}


/**
 *
 * This method is responsible for retrieving a vehicle record by it's license number.
 *
 * @param licenseNumber | the license number of the vehicle to be retrieved.
 *
 * @returns {Promise<void>} | resolves to the vehicle object.
 *
 */
exports.getVehicleByLicenseNumber = async (licenseNumber) => {

    licenseNumber = licenseNumber.toLocaleLowerCase();
    return await VehicleModel.findOne({licenseNumber});
}


/**
 *
 * This method is responsible for retrieving all vehicles that exist in the database.
 *
 * @param limit | a number dictating how many should be returned. -1 = everything.
 *
 * @returns {Promise<void>} | resolves to the vehicle array object.
 *
 */
exports.getAllVehicles = async (limit = -1) => {
    return (limit > 0 )?
     await VehicleModel.find({}).limit(limit) : await VehicleModel.find({});
}


/**
 *
 * This method is responsible for retrieving all vehicles that exist under a particular list of categories.
 *
 * @param categoryNames | the list of the category names.
 * @param limit | how many should be returned. -1 = everything.
 *
 * @returns {Promise<void>} |resolves to the vehicle array object.
 *
 */
exports.getAllVehiclesUnderACategory = async (categoryNames, limit = -1) => {
    let lowerCaseCategories = [];
    categoryNames.map((categoryName) => {
        lowerCaseCategories.push(categoryName.toLocaleLowerCase());
    });

    return (limit > 0) ? await VehicleModel.find({categories: { $all: lowerCaseCategories }}).limit(limit) :
        await VehicleModel.find({categories: { $all: lowerCaseCategories }});
};

/**
 *
 * This method is responsible for deleting a vehicle using it's license plate number.
 *
 * @param licenseNumber | the license plate number.
 *
 * @returns {Object}
 *
 */
exports.deleteVehicleByLicenseNumber = async (licenseNumber) => {
    licenseNumber = licenseNumber.toLocaleLowerCase();

    //we confirm first that the vehicle exist.
    let vehicle = await exports.getVehicleByLicenseNumber(licenseNumber);
    if(!vehicle){
        return {success: false, data: null, message: 'we couldn\'t find the vehicle in question'};
    }

    await VehicleModel.findAndRemove({vehicle});
    return {success: false, data: {}, message: 'vehicle has been deleted.'};

}




