const CategoryModel = require('../models/Category');

/**
 |
 | -----------------------------------------------------------------------
 | This file contain functions that carry out various operations on the
 | Category model.
 |-----------------------------------------------------------------------
 |-----------------------------------------------------------------------
 |
 */


/**
 *
 * This method is responsible for creating multiple categories based on a list
 * of name supplied to it,  it also makes sure that it does not create duplicates.
 *
 * @param categoryNames | the array list of the category names.
 *
 * @returns Array.
 *
 */
exports.createCategoriesFromList = async (categoryNames) => {



    let createdCategories = [];
    await Promise.all(await categoryNames.map(async (categoryName) => {
        //first we make sure that the value we're working with is in lower cases.
        categoryName = categoryName.toLocaleLowerCase();

        //we do a find to see if perhaps we already have a category with that name.
        let category = await exports.getCategoryByName(categoryName)
        if(!category){
            //well, if it doesn't exist then we just go ahead and create it.
            category = await CategoryModel.create({
               name: categoryName,
            });
        }

        //we push it to our result carrier
        createdCategories.push(category);
    }));


    return createdCategories;

}

/**
 *
 * This method is responsible for making sure that each categorylist being created
 * is valid.
 *
 * @param categoryNames | the category names to be created.
 * @returns {Object}
 *
 */
exports.validateAndCreateCategories = async (categoryNames) => {

    //we kinda go through our categories in the list supplied,  first of all car and truck
    //can't share the same room and at the same time we must have at least one of those options
    //present.

    let hasFoundCar = false;
    let hasFoundTruck = false;

    lowerCaseCategories.map((category) => {
        if (category.trim() === 'car') {
            hasFoundCar = true;
        }

        if (category.trim() === 'truck') {
            hasFoundTruck = true;
        }
    });

    if (hasFoundCar && hasFoundTruck) {
        //we can't have both car and truck.
        return {
            success: false,
            data: null,
            message: 'we can\'t have categories list containing both car and truck, choose one'
        };
    }

    if (!(hasFoundCar || hasFoundTruck)) {
        //we need to have at either car or truck present in the categories list.
        return {
            success: false,
            data: null,
            message: 'we need to have categories list containing either car or truck, one must be present'
        };
    }


    //next we send over our categories list to the category service provider to create the categories that doesn't exist
    //and return a list of the created cateogries model.
    const returnedCategories = await exports.createCategoriesFromList(lowerCaseCategories);

    return {
        success: true,
        data: returnedCategories,
        message: 'categories retrieved'
    };


}


/**
 *
 * This method is responsible for retrieving a category by it's category name.
 *
 * @param categoryName | the name of the category to be retrieved.
 *
 * @returns Category
 *
 */
exports.getCategoryByName = async (categoryName) => {
    return await CategoryModel.findOne({name: (categoryName.toLocaleLowerCase())});
}