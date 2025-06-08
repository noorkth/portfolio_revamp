/* Olio Theme Scripts */

(function($){ "use strict";
             
    $(window).on('load', function() {
        $('body').addClass('loaded');
    });

             
/*=========================================================================
	Sticky Header
=========================================================================*/ 
	$(function() {
		var header = $("#header"),
			yOffset = 0,
			triggerPoint = 80;
		$(window).on( 'scroll', function() {
			yOffset = $(window).scrollTop();

			if (yOffset >= triggerPoint) {
				header.addClass("navbar-fixed-top");
			} else {
				header.removeClass("navbar-fixed-top");
			}

		});
	});

/*=========================================================================
        textrotator
=========================================================================*/
    $(".rotate").textrotator({
      animation: "flipUp", // You can pick the way it animates when rotating through words. Options are dissolve (default), fade, flip, flipUp, flipCube, flipCubeUp and spin.
      separator: ",", // If you don't want commas to be the separator, you can define a new separator (|, &, * etc.) by yourself using this field.
      speed: 2000 // How many milliseconds until the next word show.
    }); 

/*=========================================================================
        Mobile Menu
=========================================================================*/  
    $('.menu-wrap ul.nav').slicknav({
        prependTo: '.header-section .navbar',
        label: '',
        allowParentLinks: true
    });
             
/*=========================================================================
        Active venobox
=========================================================================*/
	$('.img-popup').venobox({
		numeratio: true,
		infinigall: true
	});              
                          
             
/*=========================================================================
	Initialize smoothscroll plugin
=========================================================================*/
	smoothScroll.init({
		offset: 60
	});
	 
/*=========================================================================
	Scroll To Top
=========================================================================*/ 
    $(window).on( 'scroll', function () {
        if ($(this).scrollTop() > 100) {
            $('#scroll-to-top').fadeIn();
        } else {
            $('#scroll-to-top').fadeOut();
        }
    });

/*=========================================================================
	WOW Active
=========================================================================*/ 
   new WOW().init(); 

/*=========================================================================
    Google Map Settings
=========================================================================*/
    google.maps.event.addDomListener(window, 'load', init);

    function init() {

        var mapOptions = {
            zoom: 11,
            center: new google.maps.LatLng(40.6700, -73.9400), 
            scrollwheel: false,
            navigationControl: false,
            mapTypeControl: false,
            scaleControl: false,
            draggable: false,
            styles: [{"featureType":"administrative","elementType":"all","stylers":[{"saturation":"-100"}]},{"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","elementType":"all","stylers":[{"saturation":-100},{"lightness":"50"},{"visibility":"simplified"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":"-100"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"lightness":"30"}]},{"featureType":"road.local","elementType":"all","stylers":[{"lightness":"40"}]},{"featureType":"transit","elementType":"all","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]},{"featureType":"water","elementType":"labels","stylers":[{"lightness":-25},{"saturation":-100}]}]
        };

        var mapElement = document.getElementById('google-map');

        var map = new google.maps.Map(mapElement, mapOptions);

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(40.6700, -73.9400),
            map: map,
            title: 'Location!'
        });
    }     


})(jQuery);
