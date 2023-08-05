const ctx = document.getElementById( 'myChart' );

window.addEventListener( 'load', async ( ev ) =>
{
    ev.preventDefault();
    let response = await fetch( `${ window.location.origin }/charts-data`, { method: "GET" } );
    let json = await response.json();
    let incomes = json.incomes;
    let expenses = json.expenses;


    let firstDate = incomes[ 0 ].createdDay;
    let labels = [ firstDate ];

    let IncomesData = new Array( 7 ).fill( 0 );
    IncomesData[ 0 ] = incomes[ 0 ].totalAmount;

    let ExpensesData = new Array( 7 ).fill( 0 );
    ExpensesData[ 0 ] = expenses[ 0 ].totalAmount;

    for ( let i = 1; i < 7; i++ )
    {
        IncomesData[ i ] = incomes[ i ] ? incomes[ i ].totalAmount : 0;

        ExpensesData[ i ] = expenses[ i ] ? expenses[ i ].totalAmount : 0;


        let firstDateObj = new Date( firstDate );
        let lastDateObj = new Date( firstDateObj );
        lastDateObj.setDate( lastDateObj.getDate() + i );
        let lastDate = lastDateObj.toISOString().slice( 0, 10 );
        labels.push( lastDate );
    }


    await new Chart( ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [ {
                label: '# Incomes',
                data: IncomesData,
                backgroundColor: ' rgba(5, 71, 138,.7)',
            },
            {
                label: '# Expenses',
                data: ExpensesData,
                backgroundColor: ' rgba( 51.0, 51.0, 51.0 ,.7)',
            } ]
        },
        options: {

            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 16,
                            weight: 700
                        }
                    }
                }
            }

        }
    } );
    return;
} );

