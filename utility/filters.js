const { Op } = require( "sequelize" );
const datesUtil = require( "../utility/dates" );
/**
 * @description preparing the query filters to run filter correctly and keep it clean
 * @param {date : requestDateFilter} 
 * @param {budgetId : requestBudgetFilter} 
 * @param {categoryId : requestCategoryFilter} 
 * @returns {Object : options = query where caluse options}}
 */

exports.getOptionsObject = function ( requestDateFilter, requestBudgetFilter, requestCategoryFilter )
{
    const options = new Object();
    if ( requestDateFilter )
    {
        const { startDate, endDate } = datesUtil.formatFilterDate( requestDateFilter );
        options.createdAt = { [ Op.between ]: [ startDate, endDate ] };
    }
    if ( requestBudgetFilter )
    {
        options.budgetId = requestBudgetFilter;
    }

    if ( requestCategoryFilter )
    {
        options.categoryId = requestCategoryFilter;
    }
    return options;
};