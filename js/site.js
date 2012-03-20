$(document).ready(function() {

  var Site = window.Site = {}
  /* Wrap markdown sections
   *
   * Take the a selector (h1, h2, etc) up until the next tag 
   * that usually marks a section (h1, h2, etc), and wrap all of
   * that in a <div> with a given css_class */
  Site.markdownwrapper = function(selector, css_class_list) {
    var section_break_elements = [ "H1", "H2", "H3" ]
    var count = 0;
    $(selector).each(function(i, element) {
      var current = $(element)
      var contents = [current];
      for (var el = current.next(); el && el.size() > 0 ; el = el.next()) {
        var tag = el.get(0).tagName;
        if ($.inArray(tag, section_break_elements) >= 0) {
          break;
        }
        contents.push(el);
      }

      var outer = $("<div>");
      outer.insertAfter(current);
      var inner = $("<div>")
      $.each(css_class_list, function(i, value) { outer.addClass(value) })
      $.each(contents, function(i, value) {
        inner.append(value);
      });
      outer.addClass("outer")
      inner.addClass("inner")
      outer.append(inner)
    }); /* $(selector).each */
  }; /* Site.markdownwrapper */

  Site.table_of_contents = function(selector) {
    var toc = $("<div>").addClass("table-of-contents");
    toc.append("<h1>Table of Contents</h1>");
    $(selector).each(function(i, element) {
      var el = $(element);
      console.log($(element));
      var entry = $("<div>");
      var link = $("<a>").attr("href", "#" + el.text()).text(el.text());
      /* Add a 'topic-h2' or similar class */
      entry.addClass("topic-" + element.tagName.toLowerCase());
      entry.append(link);
      toc.append(entry);
    });
    //toc.insertBefore($(selector).first());
    toc.appendTo(".article-splash .inner");
  }; /* Site.table_of_contents */

  /* If the first element of an article is a 'ul' then fix it up all pretty
   * and move it into the '.article-splash .inner' */
  Site.fix_intro = function(selector) {
    /* Upgrade items of 'Goal: Hello World' to something more than just text. */
    var el = $(selector + " > *").first();
    if (el.is("ul")) {
      el.addClass("bullet-list")
      $("li", el).each(function() {
        var item = $(this);
        var text = item.text();
        var text_a = text.split(/: */)
        var subject = text_a[0];
        var message = text_a[1];

        var title = $("<span>").addClass("bullet-title").text(subject + ":");
        var text = $("<span>").addClass("bullet-text").text(message);
        item.addClass("bullet").empty().append(title).append(text);
      });
      el.appendTo(".article-splash .inner");
    }
  }; /* Site.fix_intro */

  /* Make the text of matching elements into anchors. */
  Site.anchor = function(selector) {
    $(selector).each(function() {
      var el = $(this);
      var anchor = $("<a>").attr("name", el.text());
      $(this).prepend(anchor);
    });
  }

  jQuery.fn.linkify = function(selector) {
    this.delegate(selector, "click", function(event) {
      event.preventDefault();
      $("a:first-of-type", this).each(function(i, el) {
        document.location = $(el).attr("href");
      });
    });
  };
  
});
