let observer = new IntersectionObserver( ( entries ) =>
{
    entries.forEach( entrie =>
    {
        if ( entrie.isIntersecting )
        {
            entrie.target.classList.add( 'visible-item' );
        }
        else
        {
            entrie.target.classList.remove( 'visible-item' );
        }
    } );
} );

let hiddenCards = document.querySelectorAll( ".hidden-item" );
hiddenCards.forEach( hc => observer.observe( hc ) );