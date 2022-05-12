$( document ).ready( function() {

	$( 'header' ).on( 'click', '.search-submit, .search-button' , function( e ) {
		e.preventDefault();
		$( this ).parents( 'form' ).first().submit();
	} );

});