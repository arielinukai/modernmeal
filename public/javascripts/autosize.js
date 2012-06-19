jQuery(document).ready(function(){
  if (jQuery("#content").height() < jQuery(window).height()) {
    var height = jQuery(window).height();
    jQuery("#content").css({"min-height":height-30});
    jQuery(".wrapper").css({"height":height});
    jQuery(window).resize(function() {
       var height = jQuery(window).height();
       jQuery(".wrapper").css({"height":height});
       jQuery("#content").css({"min-height":height-30});
    });
  }
});