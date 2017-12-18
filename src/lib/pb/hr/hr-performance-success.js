/**
 * Created by dmarler on 11/2/16.
 * This file contains all custom JS for hr performance success pages.
 */
$(document).ready(function() {


/*
 * Top Menu
 */

// Scroll to specific section on page
// e.g. <a href="#" id="topmenu-<ID_NAME_OF_SECTION_ELEMENT>">
$("#hrps-topmenu a").click(function(e) { 
    e.preventDefault(); 

    var id = $(this).attr("id");
    id = id.replace("topmenu-", "");
    
    $('html,body').animate({
        scrollTop: ($("#hrps-"+id).offset().top-$('.hrps-breadcrumbBar').outerHeight())-$('#hrps-topmenu').outerHeight()
    }, 'slow');         
});

// Sticky header
$(window).scroll(function() {
    if (!$('#hrps-topmenu').length) {
        return false;
    }

    var $menu = $('#hrps-topmenu');
    var offset = $menu.offset().top;
    var scrollpos = $(window).scrollTop();

    if ((scrollpos > offset - $('.hub-header').outerHeight()) && scrollpos > 80) { // last one prevents firing event onload
        // Dock the menu
        $menu.addClass('hrps-topmenu-fixed');
    } else {
        // Undock the menu
        $menu.removeClass('hrps-topmenu-fixed');
    }
});

/*
 * Reveal/Hide Content (/site/hr/page/evaluatingsuccess)
 */
$('.hrps-actions-toggle').click(function() {
    var $toggle = $(this);
    var $container = $('.hrps-actions');

    if ($container.hasClass('expanded')) {
        $container.removeClass('expanded');
        $toggle.removeClass('expanded');
        $('html,body').animate({
            scrollTop: $('#hrps-actions').offset().top-200},
        800);
    } else {
        $container.addClass('expanded');
        $toggle.addClass('expanded');
    }
});

/*
 * Reveal/Hide Content (/site/hr/page/developing-career-success)
 */
$('.accordian-toggle').click(function(e) {
    e.preventDefault();

    var $toggle = $(this);
    var $panel = $toggle.parents('.accordian-item');
    var $container = $toggle.parents('.accordian-group');

    if ($panel.hasClass('open')) {
        $panel.removeClass('open');
    } else {
        $container.find('.accordian-item').removeClass('open');
        $panel.addClass('open');
    }
});

/*
 * Reveal/Hide Overlay (Videos)
 */
$('.hrps-overlay-trigger').click(function(e) {
    e.preventDefault();

    // Class prevents document from scrolling
    $('body').addClass('hrps-overlay-disableScroll');

    // Show overlay
    $(this).parent().find('.hrps-overlay').addClass('show');
});

$('.hrps-overlay-close').click(function(e) {
    e.preventDefault();

    // Class prevents document from scrolling
    $('body').removeClass('hrps-overlay-disableScroll');

    // Show overlay
    $(this).parent().removeClass('show');

    // Stop/reset video
    var $iframe = $(this).parent().find('iframe');
    $iframe.attr('src', $iframe.attr('src'));
});


});