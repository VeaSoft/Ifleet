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