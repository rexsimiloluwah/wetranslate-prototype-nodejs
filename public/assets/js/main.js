/**
* Template Name: NewBiz - v2.0.0
* Template URL: https://bootstrapmade.com/newbiz-bootstrap-business-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function($) {
  "use strict";

  // Preloader (if the #preloader div exists)
  $(window).on('load', function() {
    if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow', function() {
        $(this).remove();
      });
    }
  });

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 1500, 'easeInOutExpo');
    return false;
  });

  // Initiate the wowjs animation library
  new WOW().init();

  // Header scroll class
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Smooth scroll for the navigation and links with .scrollto classes
  $('.main-nav a, .mobile-nav a, .scrollto').on('click', function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        var top_space = 0;

        if ($('#header').length) {
          top_space = $('#header').outerHeight();

          if (!$('#header').hasClass('header-scrolled')) {
            top_space = top_space - 20;
          }
        }

        $('html, body').animate({
          scrollTop: target.offset().top - top_space
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.main-nav, .mobile-nav').length) {
          $('.main-nav .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('.mobile-nav-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.main-nav, .mobile-nav');
  var main_nav_height = $('#header').outerHeight();

  $(window).on('scroll', function() {
    var cur_pos = $(this).scrollTop();

    nav_sections.each(function() {
      var top = $(this).offset().top - main_nav_height,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        main_nav.find('li').removeClass('active');
        main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
      }
    });
  });

  // jQuery counterUp (used in Whu Us section)
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Porfolio isotope and filter
  $(window).on('load', function() {
    var portfolioIsotope = $('.portfolio-container').isotope({
      itemSelector: '.portfolio-item'
    });
    $('#portfolio-flters li').on('click', function() {
      $("#portfolio-flters li").removeClass('filter-active');
      $(this).addClass('filter-active');

      portfolioIsotope.isotope({
        filter: $(this).data('filter')
      });
    });
  });

  // Initiate venobox (lightbox feature used in portofilo)
  $(document).ready(function() {
    $('.venobox').venobox();
  });

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    items: 1
  });

})(jQuery);

// SELECT INPUT


$('.select2').select2();
$('.select2-selection').css('border-color','#B452CD');

$('#datetimepicker').datetimepicker();

$(document).ready(function (){
  $("#fileUpload").on("change", (e) => {

    var files = $("#fileUpload")[0].files
    console.log(files)
    if (files.length >= 2){
      console.log("More than 1 file uploaded !")
      $(".label-text").text(files.length + " files ready to Upload !")
    }
    else{
      var filename = e.target.value.split('\\').pop()
      $(".label-text").text(filename)
      console.log("Only one file Uploaded !")
    }
  })


  

})

  $("#generate-prices").on("click", (e) => {
    
    $("#generate-text").text("Generating prices")
    $("#fa-spin").css("display" , "inline-block")

    setTimeout(() => {
      $("#generate-prices").attr("disabled", false)
      $("#generate-text").text("Check prices")
      $("#fa-spin").css("display" , "none")
    }, 3000)

    
//   $.ajax({
//     global: false,
//     type: 'POST',
//     url: '/generate-prices',
//     contentType: 'application/json; charset=utf-8',
//     dataType: 'json',
//     data: {
//         fromLanguage : $("#fromLanguage").val(),
//         toLanguage: $("#toLanguage").val(),
//         context: $("#context").val(),
//         deliveryDate: $("#datetimepicker").val()
//     },
//     success: function (result) {
//         console.log(result);
//     },
//     error: function (err) {
//         console.log(err)
//     }
// });

   
}
)

$('#exampleModalCenter').appendTo("body") 

$('#exampleModalCenter').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var plan = button.data('plan') // Extract info from data-* attributes
  var price = button.data('price')
  var file = button.data('file')
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this)
  modal.find('.modal-title').text('Plan :-  '+ plan);
  modal.find('.modal-body input[name="selectedPlan"]').val(plan);
  modal.find('.modal-body input[name="totalCost"]').val("$ "+price);
  modal.find(' .modal-body input[name= "fileName"]').val(file)

})