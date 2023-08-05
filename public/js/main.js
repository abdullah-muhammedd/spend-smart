document.addEventListener( "DOMContentLoaded", () =>
{
        const bars = document.getElementById( "bars" );
        bars.addEventListener( "click", () =>
        {
                const nav = document.getElementById( "nav" );
                nav.classList.toggle( "active" );
        } );
} );

let form = document.querySelector( "form" );
if ( form )
{
        let btn = form.querySelector( "[type='submit']" );
        btn.addEventListener( "click", async ( ev ) =>
        {
                ev.preventDefault();
                let csrfInput = form.querySelector( "[name='_csrf']" );
                let response = await fetch( `${ window.location.origin }/get-csrf-token`, { method: "GET" } );
                let json = await response.json();
                let token = json.csrfToken;
                csrfInput.value = token;
                form.submit();
        } );
}

let filterBarIcon = document.getElementById( "bar-icon" );
if ( filterBarIcon )
{
        let filters = document.querySelector( '.filters' );
        filterBarIcon.addEventListener( 'click', () =>
        {
                filters.classList.toggle( "active-filter-bar" );
                filterBarIcon.classList.toggle( "animated" );
        } );
}


function deleteConfirm ( link )
{
        let choice = confirm( "Are you sure you want to delete this item?" );
        if ( choice ) { window.location = link}
}