const moment = require( "moment" );
/**
 *
 * @descreption Format the date in a form that SQL queries can understand 
 * @param {date : dateParam} 
 * @returns {{date , date} :  { startDate , endDate }}
 */

exports.formatFilterDate = function ( dateParam )
{
    const date = moment( dateParam );

    const formattedDate = date.format( "YYYY-MM-DD" );

    const startDate = formattedDate + " 00:00:00";

    const endDate = formattedDate + " 23:59:59";

    return { startDate: startDate, endDate: endDate };
};