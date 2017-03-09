'use strict';

$(document).ready(function() {
  /**
   * @section Collapse
   *
   * @author Gaël Poupard
   * @note Replcement for Bootstrap's collapse
   */
   var $collapses = $('[data-toggle="collapse"]');

   $collapses.each(function() {
     var $this = $(this);
     var $href = $this.attr('href');
     var $target = $href.split('#');

     $this.attr({
       'aria-controls': $target[1],
       'aria-expanded': 'false'
     });

     $($href).attr('aria-hidden', 'true');

     $this.on('click', function(e) {
       e.preventDefault();
       var $expanded = $this.attr('aria-expanded');
       var $controls = $('[href="' + $href + '"]');
       var $open     = $('[data-toggle="collapse"][aria-expanded="true"]').not($this);

       if ($open.length) {
         var $target = $open.attr('href');

         $open.attr('aria-expanded', 'false');
         $($target).attr('aria-hidden', 'true');
       }

       if ($expanded === 'true') {
         $($href).attr('aria-hidden', 'true');
         $controls.attr('aria-expanded', 'false');
       } else {
         $($href).removeAttr('aria-hidden');
         $controls.attr('aria-expanded', 'true');
       }
     });
   });

  /**
   * @section Navbar-mega
   *
   * @author Dany Ropital & Gaël Poupard
   * @note POC for orange.com website
   */
  var $menus = $('.fresh-menu'),
  $subs = $menus.find('ul'),
  $nav  = $('#nav');

  // Init subnavs
  $subs.each(function() {
    var $this = $(this),
    $level = $this.parents('li').length,
    $index = $this.parents('li').first().index(),
    $link  = $this.prev('a'),
    $title = $link.text(),
    $col   = $this.parents('ul.fresh-menu').data('menu'),
    $id    = 'subnav-' + $col + '-' + $index + '-' + $level,
    $href  = $this.parents('ul').attr('id'),
    $last  = $this.find('li').last().find('a');

    // Sets an ID and a state
    $this.attr({
      'id': $id,
      'aria-hidden': 'true',
      'data-level': $level
    });
    $this.addClass('has-subnav');

    // If has subnav
    if ($link.length) {
      // Add some text to the button
      $link.append('<span aria-hidden="true">→</span>');
      $link.attr({
        'class': 'js-open-subnav',
        'aria-controls': $id,
        'aria-expanded': 'false',
        'href': '#' + $id
      });
    }

    // If level 2 or more, add a Go back button as a first child
    // Watch DOM to see which is level 2
    if (2 <= $level) {
      // Still in ul, needs to be wrapped in list-item
      var $li = $('<li></li>'),
      $back = $('<a></a>');
      // Every thing that makes this link actually close subnav
      $back.attr({
        'class': 'js-close-subnav',
        'aria-controls': $id,
        'aria-expanded': 'false',
        'href': '#' + $href
      });
      // Add some text to the link, obviously
      $back.html('<span aria-hidden="true">&nbsp;←</span>' + $title);
      $li.append($back);
      // And add everything as subnav's first item
      $this.prepend($li);
    }
    // Add a class to each subnav's last link
    $last.addClass('last-item');
  });

  // Get every buttons we created
  var $open  = $('.js-open-subnav'),
  $close = $('.js-close-subnav'),
  $last = $('.last-item');

  var levelUp = function($target, $current, $level, $grandpa) {
    // Gets targets opened, removing its parent thinggy classes
    $('[aria-controls="' + $target + '"]').attr('aria-expanded', 'false');
    // Close the current subnav
    $current.attr('aria-hidden', 'true');
    // set current level to nav data attribute
    $nav.attr('data-level', $level - 1);
    // If we get back to a subnav
    if ($grandpa.length) {
      // Gets related buttons to say it's open!
      $('[aria-controls="' + $grandpa.attr('id') + '"]').attr('aria-expanded', 'true');
    }
  };

  // Buttons meant to go downstairs
  $open.each(function() {
    var $this = $(this),
    $controls = $this.attr('aria-controls'),
    $target   = $('#' + $controls),
    $parent   = $this.parents('.has-subnav').first(),
    $level    = $target.data('level');

    $this.on('click', function(e) {
      // @note prevent scroll jump
      e.preventDefault();
      // but allow hash change
      // @link http://lea.verou.me/2011/05/change-url-hash-without-page-jump/
      history.pushState(null, null, '#' + $controls);
      // Subnav opens
      $target.removeAttr('aria-hidden');
      $('[aria-controls="' + $controls + '"]').attr('aria-expanded', 'true');
      // And when $target is visible (when transition ends)
      $nav.on('transitionend', ".navbar-mega", function(e) {
        // Its first link gets focused
        $target.find('.js-close-subnav').first().focus();
      });
      // set current level to nav data attribute
      $nav.attr('data-level', $level);
    });
  });

  // Needs to prevent the transitionend event bubbling
  $('a, .fresh-menu').on('transitionend', function(e) {
    e.stopPropagation();
  });

  // Buttons meant to go upstairs
  $close.each(function() {
    var $this    = $(this),
    $target  = $this.attr('aria-controls'),
    $current = $this.parents('.has-subnav').first(),
    $grandpa = $('#' + $target).parents('.has-subnav').first(),
    $origin  = $this.parents('.fresh-menu').first(),
    $level   = $('#' + $target).data('level');

    $this.on('click', function() {
      // Close current, open parent
      levelUp($target, $current, $level, $grandpa);
      // Handle focus
      if ($grandpa.length) {
        $grandpa.find('.js-close-subnav').first().focus();
      } else {
        $origin.find('[aria-controls="' + $target + '"]').first().focus();
      }
    });

    $this.on('keydown', function(e) {
      // When tabbing back on a close subnav link
      if (e.shiftKey && e.keyCode == 9) {
        e.preventDefault();
        // Fire click event, which handles subnav closing + focus to the parent link
        $(this).click();
      }
    });
  });

  // Last link in subnavs
  $last.each(function() {
    var $this = $(this),
    $current = $this.parents('.has-subnav').first(),
    $target  = $current.find('.js-close-subnav').first().attr('aria-controls'),
    $grandpa = $('#' + $target).parents('.has-subnav').first(),
    $level   = $('#' + $target).data('level');

    $this.on('keydown', function(e) {
      // When tabbing on a subnav's last link
      if (!e.shiftKey && e.keyCode == 9) {
        // Close current, open parent
        levelUp($target, $current, $level, $grandpa);
      }
    });
  });


  /**
   * @section Collapse main nav element
   */
  var $hamburger = $('<button></button>'),
  $controls = 'nav';

  // First add needed attributes
  $hamburger.attr({
    'class': 'btn-hamburger',
    'type': 'button',
    'aria-controls': $controls,
    'aria-expanded': 'false',
    'aria-label': 'Navigation'
  });
  $hamburger.html('<svg aria-hidden="true" class="hamburger"><use xlink:href="#hamburger"/></svg>');
  // Then add button to markup
  $('.anchors').before($hamburger);
  // and hide navigation
  $nav.attr('aria-hidden', 'true');

  // On click on hamburger button
  $hamburger.on('click', function() {
    // Check if nav is opened
    var $open = $nav.attr('aria-hidden');
    // If so, close it
    if(!$open) {
      $hamburger.attr('aria-expanded', 'false');
      $nav.attr('aria-hidden', 'true');
      $nav.removeClass('is-opened');
    // If not, open it
    } else {
      $hamburger.attr('aria-expanded', 'true');
      $nav.removeAttr('aria-hidden');
      $nav.addClass('is-opened');
    }
  });

  /**
   * @section Anchor to main nav opens it
   */
  $('.anchors [data-toggle="collapse"]').on('click', function() {
    var $isClosed = $nav.attr('aria-hidden');
    // If main nav is closed
    if($isClosed) {
      // Click on the hamburger, which will open main nav *and* update aria-attributes on hamburger button
      $hamburger.trigger('click');
    }
  });
});
