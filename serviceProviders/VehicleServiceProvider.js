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

    //next we kinda go through our categories in the list supplied,  first of all car and truck
    //can't share the same room and at the same time we must have at least one of those options
    //present.

    let hasFoundCar = false;
    let hasFoundTruck = false;

    lowerCaseCategories.map((category) => {
        if(category.trim() === 'car'){
            hasFoundCar = true;
        }

        if(category.trim() === 'truck'){
            hasFoundTruck = true;
        }
    });

    if(hasFoundCar && hasFoundTruck){
        //we can't have both car and truck.
        return { success: false, data: null, message: 'we can\'t have categories list containing both car and truck, choose one'};
    }

    if(!(hasFoundCar || hasFoundTruck)){
        //we need to have at either car or truck present in the categories list.
        return { success: false, data: null, message: 'we need to have categories list containing either car or truck, one must be present'};
    }


    //next we send over our categories list to the category service provider to create the categories that doesn't exist
    //and return a list of the created cateogries model.
    const returnedCategories = await CategoryServiceProvider.createCategoriesFromList(lowerCaseCategories);

    const returnedCategoryIds = returnedCategories.map((returnedCategory) => {
        return returnedCategory._id;
    });



    let createdVehicle = await VehicleModel.create({
        name, colour, year, licenseNumber, returnedCategoryIds
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




