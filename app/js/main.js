$(document).ready(function(){
  
  //animation effects
  fade();
  function fade () {
    if($(window).width() > 768) {
      $('#first-screen, .hero-img, #video, #aboutId, #aboutMeId, #reviewsId, #afishaId, #contactsId, #groupsId')
        .addClass('fade');
        var groupsEven = $('.group-wrapper:even').addClass('even fade'),
          groupsOdd = $('.group-wrapper:odd').addClass('odd fade');

      $('.fade').waypoint(function(){
        var tracked = $(this.element);
          
          //add fade in to sections
          tracked.addClass('animated fadeIn');
          this.destroy();

          //video autoplay
          // if(tracked.attr('id') == 'video') {
          //   document.getElementById('video').play();
          //console.log(tracked);
          // }   
        }, {offset: '85%'});
      
      //sliding groups
      $('#groupsId').find('.group-wrapper').waypoint(function(){
        $this = $(this.element);
        if ($this.hasClass('even')) {
            $this.children('.group-img').addClass('animated fadeIn slideInLeft')
            .siblings('.group-desc').addClass('animated fadeIn slideInRight'); 
          } else {
            $this.children('.group-img').addClass('animated fadeIn slideInRight')
            .siblings('.group-desc').addClass('animated fadeIn slideInLeft'); 
          }
           this.destroy();
      }, {offset: '85%'});

      //shaking contacts
      $('#contactsId').waypoint(function(){
        $(this.element).find('.icon-wrapper')
          .addClass('animated shake');
          this.destroy();
      }, {offset: '70%'});

      //active menu
      // var navLi = $('#nav ul li');
      // $('#first-screen, #aboutId, #aboutMeId, #reviewsId, #afishaId, #contactsId, #groupsId, #video, #galleryId')
      //   .addClass('trackNav');

      // $('.trackNav').waypoint(function(){
      //   navLi.removeClass('active');
      //   var hash = $(this.element).attr('id');
      //   $.each(navLi, function(){
      //     if($(this).children('a').attr('href').slice(1) == hash) {
      //       $(this).addClass('active');
      //     }
      //   })
      // }, {offset: '10%'});
    }
  }


  //owl carousel
  $('.owl-carousel').owlCarousel({
    loop:true,
    items:1,
    dots: false,
    autoplay: false,
    nav: true,
    navText: ["<img src='./img/left.png'>","<img src='./img/right.png'>"]
  });


//slide to section
$("#nav, #mouse, .footer-nav").on("click", 'a', function (e) {
    e.preventDefault();
    var id  = $(this).attr('href');
    var top = $(id).offset().top;

    $('body,html').animate({scrollTop: top}, 800);
  });

//mouse on first screen
$('#mouse').hover(function(){
  $(this).addClass('animated bounce infinite');
}, function(){
  $(this).removeClass('animated bounce infinite');
});

//hamburger menu
 $("#hamburger").click(function(){
    $(this).toggleClass("is-active");

    if( $('#nav').is(':visible') ) {
      $('#nav').fadeOut(300, function(){
      $('body').removeClass('mobile-nav-active');   
      });
    } else {
      $('body').addClass('mobile-nav-active');
      $('#nav').fadeIn();
    }

  });


 $('#nav').find('a').click(function() {
  $('body').removeClass('mobile-nav-active')
    .find('#nav').removeAttr('style');
  $("#hamburger").removeClass('is-active');
 });

 $(window).resize(function() {
   if( $(window).width() > 768 ) {
    $('body').removeClass('mobile-nav-active')
      .find('#nav').removeAttr('style');
  $("#hamburger").removeClass('is-active');
   } else {
    $('#nav').removeAttr('style');
   }
 });


//modal
$('#btnQuestion, #btnOrder').on('click', function(e){
  e.preventDefault();
  $('body').addClass('modal-box-active')
    .find('#modalBox').fadeIn(300);
});
$('#modalClose').click(function(){
  $('body').find('#modalBox').fadeOut(300, function(){
    $('body').removeClass('modal-box-active');
  });
});

//form
$('#mainForm').submit(function(e) {
  e.preventDefault();
  $.ajax({
    type: 'POST',
    url: 'mail.php',
    data: $('#mainForm').serialize(),
    success: function(){
      $('#mainForm').prepend("<p style='margin-bottom: 15px'>Спасибо! Ваше сообщение отправлено.</p>");

      setTimeout(function(){
        $('#mainForm').find('p').fadeOut(300, function(){
          $(this).remove();
        });
        $('body').find('#modalBox').fadeOut(300, function(){
        $('body').removeClass('modal-box-active');
      });

      }, 1000);


    }
  }).fail(function(){
       $('#mainForm').prepend("<p style='margin-bottom: 15px'>Сообщение не удалось отправить:(, попробуйте обновить страницу, либо свяжитесь с администратором. Спасибо.</p>");
  });

});

//sticky menu 
var lastScroll = 0;
$(window).on('scroll', function(){
  if($(window).width() > 768) {
    var scrollTop = $(this).scrollTop();
    var nav = $('#nav');

    if (scrollTop > lastScroll){ //down
      nav.addClass('slideOutUp').removeClass('slideInDown');
    } else { //up
      nav.removeClass('slideOutUp').addClass('animated sticky slideInDown');
    }
      lastScroll = scrollTop;
    if(scrollTop == 0) {
      nav.removeAttr('class');
    }
  }

  // if($(window).scrollTop() == 0 ) {
  //   $('#nav ul li').removeClass('active');
  //   $('#nav ul li:first-child').addClass('active');
  // }
});


//lightbox
function getFileName(src) {  // returns match array
  var regexp = /([a-zA-z0-9x.\-_]+.(jpg|png|svg))/ig;
  return src.match(regexp);
}

var imgs = $('.gallery img').get(); // get all imgs
var length = imgs.length;

function currentPos(img) {   //
  for(key in imgs) {
    var i = getFileName( $(imgs[key]).attr('src') );
    if (i[0] == img[0]) {
      return key;
    } else {
      continue;
    }
  }
}
function getImg(i) {
  for(key in imgs) {
    if (key == i) {
      return imgs[key];
    } else {
      continue;
    }
}
}
$('.gallery img').click(function(){

  if($(window).width() >= 768) {
    var img = $(this).attr('src'); //get sourse url
    var fileName = getFileName(img); // get file name
    var dir = './img/gallery/', //directory name
        str = '<img src=' + dir + fileName + '>'; //url of showing img
    $('#lightbox').prepend(str).ready(function(){ //waiting for dom elem to load
      $('#lightbox').fadeIn(400);
    }).siblings('.gallery').addClass('covered');
    $('body').addClass('gallery-active');

  }

});

$('#lightbox').children('.navigation').find('div')
  .click(function() {
    var c = getFileName( $('#lightbox img').attr('src') );
    var cur = currentPos( c );
    var dir = $(this).data('dir');
    (dir == 'next') ? ++cur : --cur;
    if (cur <= 0) {
      cur = length-1;
    } else if(cur >= length) {
      cur = 0
    }

    var fileName = getFileName($(getImg(cur)).attr('src'));
    
    $('#lightbox').hide().find('img').remove();

    var direct = './img/gallery/', //directory name
        str = '<img src=' + direct + fileName + '>'; //url of showing img
    
    $('#lightbox').prepend(str).ready(function(){
      $('#lightbox').fadeIn(400);
    });
});

$('#exit, #modal_overlay').click(function(event) {
  $('#lightbox').hide().find('img').remove();
  $('#lightbox').siblings('.gallery').removeClass('covered');
  $('body').removeClass('gallery-active');
});

//video
// if($(window).width()>768) {
//   var video = new Waypoint({
//     element: document.getElementById('video'),
//     handler: function(direction){
//       document.getElementById('video').play();
//     },
//     continuous: false,
//     offset: 200
//   });
// }
if($(window).width()<769) {
  $('.icon-play-button').css('display', 'inline-block')
}
$('#video').on('ended', function(){
  $('#video').siblings('.icon-play-button').show(300);
});

$('#video').click(function(){
    $('#video').siblings('.icon-play-button').show(300);
    $('#video')[0].pause();
});

 $('#video').siblings('.icon-play-button').click(function(){
  $('#video')[0].play();
  $('#video').siblings('.icon-play-button').toggle(300);
 });

});