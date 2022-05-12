'use strict';

/**
 * social-sharing.js
 * @fileOverview Contains the Social Page Sharing module
 * @version 0.2.0.0
 * @copyright 2018 Centers for Disease Control
 */

( function( $, window, document, undefined ) {

	var pluginName = "cdc_socialSharing",
		defaults = {
			container: '.page-share-wrapper'
		};

	function CDCPlugin( element, options ) {
		this.element = element;
		this.options = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	function inArray( target, array ) {
		/* Caching array.length doesn't increase the performance of the for loop on V8 (and probably on most of other major engines) */
		for ( var i = 0; i < array.length; i++ ) {
			if ( array[i] === target ) {
				return true;
			}
		}
		return false;
	}

	CDCPlugin.prototype = {
		init: function( url ) {
			//var defaults = this._defaults;
			url = url || window.location;
			this.updateSocialLinks( url );
		},

		updateSocialLinks: function( url, title ) {

			var t = this,
				socialMediaParams = {
					url: $( "meta[property='og:title']" ).attr( "content" ),
					title: title || $( "meta[property='og:title']" ).attr( "content" ) || document.title,
					description: $( "meta[property='og:description']" ).attr( "content" ) || $( 'meta[name=description]' ).attr( 'content' ),
					author: $( "meta[property='og:author']" ).attr( "content" ) || 'CDCgov',
					media: $( "meta[property='og:image']" ).attr( "content" ),
					twitter: {
						creator: $( "meta[name='twitter:creator']" ).attr( "content" ) || 'CDCgov',
						title: $( "meta[name='twitter:title']" ).attr( "content" ) || document.title,
						description: $( "meta[name='twitter:description']" ).attr( "content" ) || $( 'meta[name=description]' ).attr( 'content' ),
						media: $( "meta[name='twitter:image:src']" ).attr( "content" )
					}
				},
				socialUrl;


			// Facebook
			if ( $( ".page-share-facebook" ).length ) {
				socialUrl = 'https://api.addthis.com/oexchange/0.8/forward/facebook/offer?url=' + url + '&title=' + socialMediaParams.title + '&description=' + socialMediaParams.description + '&via=' + socialMediaParams.via + '&media=' + socialMediaParams.media;
				$( ".page-share-facebook" )
					.attr( "href", encodeURI( socialUrl ) );
				$( '.page-share-facebook' ).on( 'click', function( e ) {
					$( this ).trigger( 'metrics-capture', [ 'social-media-share-facebook', 'click' ] );
				} );
			}

			// Twitter
			if ( $( ".page-share-twitter" ).length ) {
				var twitterAccount = socialMediaParams.twitter.creator.replace( /^\@+/, '' );
				socialUrl = 'https://api.addthis.com/oexchange/0.8/forward/twitter/offer?url=' + url + '&title=' + socialMediaParams.twitter.title + '&description=' + socialMediaParams.twitter.description + '&via=' + twitterAccount + '&media=' + socialMediaParams.twitter.media;
				$( ".page-share-twitter" )
					.attr( "href", encodeURI( socialUrl ) );
				$( '.page-share-twitter' ).on( 'click', function( e ) {
					$( this ).trigger( 'metrics-capture', [ 'social-media-share-twitter', 'click' ] );
				} );
			}

			// E-mail
			if ( $( ".page-share-email" ).length ) {
				socialUrl = 'https://api.addthis.com/oexchange/0.8/forward/email/offer?url=' + url + '&title=' + socialMediaParams.title + '&description=' + socialMediaParams.description + '&via=' + socialMediaParams.author + '&ct=0&media=' + socialMediaParams.media;
				$( ".page-share-email" )
					.attr( "href", encodeURI( socialUrl ) );
				$( '.page-share-email' ).on( 'click', function( e ) {
					$( this ).trigger( 'metrics-capture', [ 'social-media-share-email', 'click' ] );
				} );
			}

			// LinkedIn
			if ( $( ".page-share-linkedin" ).length ) {
				var testEnvs = [ 'vvv', '-stage', '-test', 'dev.' ];
				var envUrl   = window.hostName;

				if ( true === inArray( envUrl, testEnvs ) ) {
					//result++;
					url = 'https://www.cdc.gov';
				}

				socialUrl = 'https://api.addthis.com/oexchange/0.8/forward/linkedin/offer?url=' + url + '&title=' + socialMediaParams.title + '&description=' + socialMediaParams.description + '&via=' + socialMediaParams.creator + '&ct=0&media=' + socialMediaParams.media;
				$( ".page-share-linkedin" )
					.attr( "href", encodeURI( socialUrl ) );
				$( '.page-share-linkedin' ).on( 'click', function( e ) {
					$( this ).trigger( 'metrics-capture', [ 'social-media-share-linkedin', 'click' ] );
				} );
			}

			// Syndication
			// **  Replaced with window.CDC.tp4.public.updateSocialSyndLink(); in App.js
			//if ($(".page-share-syndication").length) {
			// let socialUrl = `https://tools.cdc.gov/medialibrary/index.aspx#/sharecontent/${url}`;
			// $(".page-share-syndication")
			// 	.attr("href", encodeURI(socialUrl));
			//}
		}
	};


	// don't let the plugin load multiple times
	$.fn[ pluginName ] = function( options ) {
		return this.each( function() {
			if ( ! $.data( this, "plugin_" + pluginName ) ) {
				$.data( this, "plugin_" + pluginName, new CDCPlugin( this, options ) );
			}
		} );
	};

} )( jQuery, window, document );

$( document ).cdc_socialSharing();
