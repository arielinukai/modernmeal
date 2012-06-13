jQuery(function(){
	initCufon();
	initCustomForms();
	clearInputs();
	initTabs();
	initOpenClose();
	initGallery();
	initLightbox();
});

function initCufon() {
	Cufon.replace('.logo-area .slogan', { textShadow: '#839f59 -1px -1px, #839f59 -1px -1px', fontFamily: 'Avenir LT Std' });
	Cufon.replace('#login .heading-holder h3, .social-box h4', { fontFamily: 'Avenir LT Std'});
	Cufon.replace('.lightbox .text-block .title, .lightbox-holder .lightbox .text, .threecolumns .column h3, .columns-box .info-box h3, .threecolumns h4 a, #sidebar .title-holder h3, .list-box .title1, .contact-info .address-block h3', { fontFamily: 'Avenir Heavy'});
	Cufon.replace('.contact-info .address-block address span, .contact-info .address-block h4', { fontFamily: 'Avenir Book'});
	Cufon.replace('.lightbox .text-block p, .columns-section h4, .ad-section .ad-title, .invite h4, .block-container .trigger, .title-holder .recipe-title, .review-block .form-columns h3.title, .box-container h3, .recipe-search .heading, .main-content .title, .profile-heading h2, .total-box h3, .detail-section h2, .search-box .search-title', { fontFamily: 'Avenir Medium'});
}

function initLightbox(){
	jQuery('a.with-popup').fancybox({
		onLoad:function(){
			Cufon.replace('.lightbox .text-block .title, .lightbox-holder .lightbox .text', { fontFamily: 'Avenir Heavy'});
			Cufon.replace('.lightbox .text-block p', { fontFamily: 'Avenir Medium'});
		},
		overlayOpacity:0.5,
		overlayColor:"#000000"
	});
	jQuery('.with-popup.redirect').each(function(){
		var _link = jQuery(this);
		var _url = _link.attr('title');
		_link.removeAttr('title');
		var requestData = "Test";
		_link.click(function(){
			setTimeout(function(){
				jQuery('#fancybox-overlay').trigger('click');
				var str;
				var resturl = "http://127.0.0.1:8080/modernmeal/recipe/submit";
			    formVars = "recipe-data=Testing";
				console.log('Testing' + formVars);
				jQuery.ajax({
				  type: 'POST',
				  url: resturl,
				  crossDomain: true,
				  data: formVars,
				  success: function(data){
				    console.log(data);
				  }
				});
				
				jQuery.cookie('ModernMeal', str);
				/*setTimeout(function(){
					window.location = _url;},200)*/
			},2000)
			return false;
		})
	})
}

// custom forms init
function initCustomForms() {
	jQuery('select').customSelect();
	jQuery('input:radio').customRadio();
	jQuery('input:checkbox').customCheckbox();
}

function initOpenClose(){
	jQuery('div.trigger-block').OpenClose();
	jQuery('.block-container').each(function(){
		var _holder = jQuery(this);
		var _links = jQuery('.trigger-block .trigger', _holder);
		_links.bind('click', function(){
			var _link = jQuery(this);
			if (!_link.hasClass('active')){
				_links.filter('.active').trigger('click');
			}
			return false;
		})
	});
}

function initGallery(){
	jQuery('div.fade-gallery').slideshow();
}

//create jQuery plugin
jQuery.fn.slideshow = function(options){return new slideshow(this, options);}

//constructor
function slideshow(obj, options){this.init(obj,options)}

//prototype
slideshow.prototype = {
	init:function(obj, options) {
		this.options = jQuery.extend({
			slides:'ul.gallery >li',
			nextBtn:'a.next',
			prevBtn:'a.prev',
			pagingHolder:'ul.steps-list',
			pagingTag:'li',
			createPaging:false,
			autoPlay:true,
			dynamicLoad:false,
			imgAttr:'alt',
			effect:'fade',//fade, slideX, slideY,
			startSlide:false,
			switchTime:6000,
			animSpeed:900
		},options);
		
		this.mainHolder = jQuery(obj);
		this.slides = jQuery(this.options.slides,this.mainHolder);		
		this.nextBtn = jQuery(this.options.nextBtn,this.mainHolder);
		this.prevBtn = jQuery(this.options.prevBtn,this.mainHolder);
		this.dynamicLoad = this.options.dynamicLoad;
		this.imgAttr = this.options.imgAttr;
		this.animSpeed = this.options.animSpeed;
		this.switchTime = this.options.switchTime;
		this.effect = this.options.effect;
		this.autoPlay = this.options.autoPlay;
		this.previous = -1;
		this.loadingFrame = 1;
		this.busy = false;
		this.direction = 1;
		this.timer;
		this.pagingArray = new Array;
		this.loadArray = new Array;
		this.preloader = new Array;
		this.slidesParent = this.slides.eq(0).parent();
		this.slideW = this.slidesParent.width();
		this.slideH = this.slidesParent.height();
		
		(function(){
			if (this.options.startSlide) this.current = this.options.startSlide
			else {
				var active = -1;
				for(var i = 0; i< this.slides.length-1; i++) {
					if (this.slides.eq(i).hasClass('active')) {
						active = i;
						break;						
					}
				}
				if (active != -1) this.current = active;
				else this.current = 0;
			}
		}).apply(this);
		
		this.initPaging();
		this.setStyles();
		this.bindEvents();
		this.showSlide();
	},
	
	initPaging:function(){
		var obj = this;
		this.pagingHolder = jQuery(this.options.pagingHolder,this.mainHolder);
		
		if (this.options.createPaging) {
			this.pagingHolder.each(function(i){
				var _this = jQuery(this);
				_this.empty();
				var list = jQuery('<ul>');
				for (var i = 0; i < obj.slides.length; i++) jQuery('<li><a href="#">' + (i + 1) + '</a></li>').appendTo(list);
				_this.append(list);
			});
		}
		
		this.paging = jQuery(this.options.pagingTag, this.pagingHolder);
		var ratio = Math.ceil(this.paging.length / this.slides.length);
		for (var i = 0; i < ratio; i++) {
			this.pagingArray.push(this.paging.slice(i*this.slides.length, (i*this.slides.length)+this.slides.length));
		}
	},
	
	setStyles:function(){
		//loader
		if (this.dynamicLoad) {
			this.loader = jQuery('<div class="loader">');
			this.loaderDiv = jQuery('<div>').appendTo(this.loader)
			this.loader.append(this.loaderDiv).appendTo(this.slidesParent);
		}
		
		//slides
		if (this.effect == 'fade') {
			this.slides.css({display:'none'});
			this.slides.eq(this.current).css({display:'block'});
		} else if (this.effect == 'slideX'){
			this.slides.css({display: 'none',left:-this.slideW});
			this.slides.eq(this.current).css({display:'block',left:0});
		} else if (this.effect == 'slideY'){
			this.slides.css({display:'none',top:-this.slideH});
			this.slides.eq(this.current).css({display:'block',top:0});
		}
	},
	
	bindEvents:function(){
		var obj = this;
		this.nextBtn.bind('click',function(){
			if (!obj.busy) obj.nextSlide();
			return false;
		});
		
		this.prevBtn.bind('click',function(){
			if (!obj.busy) obj.prevSlide();
			return false;
		});
		
		for (var i = 0; i < this.pagingArray.length; i++) {
			this.pagingArray[i].each(function(i){
				jQuery(this).bind('click',function(){
					if (i != obj.current && !obj.busy) {
						obj.previous = obj.current;
						obj.current = i;
						if (obj.previous > i) obj.direction = -1
						else obj.direction = 1;
						obj.showSlide();
					}
					return false;
				});
			});
		}
		
		if (this.dynamicLoad) this.loader.bind('click',function(){
			obj.abortLoading();
		});
	},
	
	nextSlide:function(){
		this.previous = this.current;
		if (this.current < this.slides.length-1) this.current++
		else this.current = 0;
		this.direction = 1;
		this.showSlide();
	},
	
	prevSlide:function(){
		this.previous = this.current;
		if (this.current > 0) this.current--
		else this.current = this.slides.length-1;
		this.direction = -1;
		this.showSlide();
	},
	
	showSlide:function(){
		var obj = this;
		var _current = this.current;
		this.busy = true;
		clearTimeout(this.timer);
		
		if (typeof this.loadArray[_current] != 'undefined' || !this.dynamicLoad) {
			//slide already loaded
			this.switchSlide();
		
		} else {
			//slide not loaded
			this.showLoading();
			var images = jQuery(this.dynamicLoad,this.slides.eq(this.current));
			if (images.length) {
				var counter = 0;
				images.each(function(){
					var preloader = new Image;
					obj.preloader.push(preloader);
					var img = jQuery(this);
					preloader.onload = function(){
						counter++;
						checkImages();
					}
					preloader.onerror = function(){
						//ignore errors
						counter++;
						checkImages();
					}
					preloader.src = img.attr(obj.imgAttr);
				});
				
				function checkImages(){
					if (counter == images.length) {
						images.each(function(){
							var img = jQuery(this);
							img.attr('src',img.attr(obj.imgAttr));
						});
						successLoad();
					}
				}
				
			} else successLoad();
		}
		
		function successLoad(){
			obj.loadArray[_current] = 1;
			obj.hideLoading();
			obj.switchSlide();
		}
	},
	
	switchSlide:function(){
		var obj = this;
		
		if (this.previous != -1) {
			var nextSlide = this.slides.eq(this.current);
			var prevSlide = this.slides.eq(this.previous);
			
			if (this.effect == 'fade') {
				nextSlide.css({display:'block',opacity:0}).animate({opacity:1},this.animSpeed,function(){
					jQuery(this).css({opacity:'auto'});
				});
				prevSlide.animate({opacity:0},this.animSpeed,callback);
			} else if (this.effect == 'slideX'){
				nextSlide.css({display:'block',left:this.slideW*this.direction}).animate({left:0},this.animSpeed);
				prevSlide.animate({left:-this.slideW*this.direction},this.animSpeed+10,callback);
			} else if (this.effect == 'slideY'){
				nextSlide.css({display:'block',top:this.slideH*this.direction}).animate({top:0},this.animSpeed);
				prevSlide.animate({top:-this.slideH*this.direction},this.animSpeed+10,callback);
			}
		} else {
			if (this.autoPlay) this.startAutoPlay();
			this.busy = false;
		}
		
		this.refreshStatus();
		
		function callback(){
			prevSlide.css({display:'none'});
			if (obj.autoPlay) obj.startAutoPlay();
			obj.busy = false;
		}
	},
	
	refreshStatus:function(){
		for (var i = 0; i < this.pagingArray.length;i++) {
			this.pagingArray[i].eq(this.previous).removeClass('active');
			this.pagingArray[i].eq(this.current).addClass('active');
		}
		this.slides.eq(this.previous).removeClass('active');
		this.slides.eq(this.current).addClass('active');
	},
	
	showLoading:function(){
		var obj = this;
		this.loader.show();
		clearInterval(this.loadingTimer);
		obj.loadingTimer = setInterval(animateLoading, 66);
		
		function animateLoading(){
			obj.loaderDiv.css('top', obj.loadingFrame * -40);
			obj.loadingFrame = (obj.loadingFrame + 1) % 12;
		}
	},
	
	hideLoading:function(){
		this.loader.hide();
		clearInterval(this.loadingTimer);
	},
	
	abortLoading:function(){
		this.busy = false;
		this.hideLoading();
		this.current = this.previous;
		for (var i = 0; i < this.preloader.length; i++) {
			this.preloader[i].onload = null;
			this.preloader[i].onerror = null;
		}
		if (this.autoPlay) this.startAutoPlay();
	},
	
	startAutoPlay:function(){
		var obj = this;
		clearTimeout(obj.timer);
		obj.timer = setTimeout(function(){
			obj.nextSlide();
		},obj.switchTime);
	}
}

// open-close plugin
jQuery.fn.OpenClose = function(_options){
	// default options
	var _options = jQuery.extend({
		activeClass:'active',
		opener:'.trigger',
		slider:'div.toggle-container',
		slideSpeed: 400,
		animStart:false,
		animEnd:false,
		event:'click'
	},_options);

	return this.each(function(){
		// options
		var _holder = jQuery(this);
		var _slideSpeed = _options.slideSpeed;
		var _activeClass = _options.activeClass;
		var _opener = jQuery(_options.opener, _holder);
		var _slider = jQuery(_options.slider, _holder);
		var _animStart = _options.animStart;
		var _animEnd = _options.animEnd;
		var _event = _options.event;
		if(_slider.length) {
			_opener.bind(_event,function(){
				if(!_slider.is(':animated')) {
					if(typeof _animStart === 'function') _animStart();
					if(_opener.hasClass(_activeClass)) {
						_slider.slideUp(_slideSpeed,function(){
							if(typeof _animEnd === 'function') _animEnd();
							_opener.removeClass(_activeClass);
						});
					} else {
						_slider.slideDown(_slideSpeed,function(){
							if(typeof _animEnd === 'function') _animEnd();
							_opener.addClass(_activeClass);
						});
					}
				}
				return false;
			});
			if(_opener.hasClass(_activeClass)) _slider.show();
			else _slider.hide();
		}
	});
}

function initTabs() {
	jQuery('ul.tabset').each(function(){
		var _list = jQuery(this);
		var _links = _list.find('a.tab');

		_links.each(function() {
			var _link = jQuery(this);
			var _href = _link.attr('href');
			var _tab = jQuery(_href);

			if(_link.hasClass('active')) _tab.show();
			else _tab.hide();

			_link.click(function(){
				_links.filter('.active').each(function(){
					jQuery(jQuery(this).removeClass('active').attr('href')).hide();
				});
				_link.addClass('active');
				_tab.show();
				return false;
			});
		});
	});
}

// custom forms plugin
;(function(jQuery){
	// custom checkboxes module
	jQuery.fn.customCheckbox = function(_options){
		var _options = jQuery.extend({
			checkboxStructure: '<div></div>',
			checkboxDisabled: 'disabled',
			checkboxDefault: 'checkboxArea',
			checkboxChecked: 'checkboxAreaChecked',
			filterClass:'default'
		}, _options);
		return this.each(function(){
			var checkbox = jQuery(this);
			if(!checkbox.hasClass('outtaHere') && checkbox.is(':checkbox') && !checkbox.hasClass(_options.filterClass)){
				var replaced = jQuery(_options.checkboxStructure);
				this._replaced = replaced;
				if(checkbox.is(':disabled')) replaced.addClass(_options.checkboxDisabled);
				else if(checkbox.is(':checked')) replaced.addClass(_options.checkboxChecked);
				else replaced.addClass(_options.checkboxDefault);

				replaced.click(function(){
					if(checkbox.is(':checked')) checkbox.removeAttr('checked');
					else checkbox.attr('checked', 'checked');
					changeCheckbox(checkbox);
				});
				checkbox.click(function(){
					changeCheckbox(checkbox);
				});
				replaced.insertBefore(checkbox);
				checkbox.addClass('outtaHere');
			}
		});
		function changeCheckbox(_this){
			_this.change();
			if(_this.is(':checked')) _this.get(0)._replaced.removeClass().addClass(_options.checkboxChecked);
			else _this.get(0)._replaced.removeClass().addClass(_options.checkboxDefault);
		}
	}

	// custom radios module
	jQuery.fn.customRadio = function(_options){
		var _options = jQuery.extend({
			radioStructure: '<div></div>',
			radioDisabled: 'disabled',
			radioDefault: 'radioArea',
			radioChecked: 'radioAreaChecked',
			filterClass:'default'
		}, _options);
		return this.each(function(){
			var radio = jQuery(this);
			if(!radio.hasClass('outtaHere') && radio.is(':radio') && !radio.hasClass(_options.filterClass)){
				var replaced = jQuery(_options.radioStructure);
				this._replaced = replaced;
				if(radio.is(':disabled')) replaced.addClass(_options.radioDisabled);
				else if(radio.is(':checked')) replaced.addClass(_options.radioChecked);
				else replaced.addClass(_options.radioDefault);
				replaced.click(function(){
					if(jQuery(this).hasClass(_options.radioDefault)){
						radio.attr('checked', 'checked');
						changeRadio(radio.get(0));
					}
				});
				radio.click(function(){
					changeRadio(this);
				});
				replaced.insertBefore(radio);
				radio.addClass('outtaHere');
			}
		});
		function changeRadio(_this){
			jQuery(_this).change();
			jQuery('input:radio[name='+jQuery(_this).attr("name")+']').not(_this).each(function(){
				if(this._replaced && !jQuery(this).is(':disabled')) this._replaced.removeClass().addClass(_options.radioDefault);
			});
			_this._replaced.removeClass().addClass(_options.radioChecked);
		}
	}

	// custom selects module
	jQuery.fn.customSelect = function(_options) {
		var _options = jQuery.extend({
			selectStructure: '<div class="selectArea"><span class="left"></span><span class="center"></span><a href="#" class="selectButton"></a><div class="disabled"></div></div>',
			hideOnMouseOut: false,
			copyClass: true,
			selectText: '.center',
			selectBtn: '.selectButton',
			selectDisabled: '.disabled',
			optStructure: '<div class="optionsDivVisible"><div class="select-top"></div><div class="select-center"><ul></ul><div class="select-bottom"></div></div>',
			optList: 'ul',
			filterClass:'default'
		}, _options);
		return this.each(function() {
			var select = jQuery(this);
			if(!select.hasClass('outtaHere') && !select.hasClass(_options.filterClass)) {
				if(select.is(':visible')) {
					var hideOnMouseOut = _options.hideOnMouseOut;
					var copyClass = _options.copyClass;
					var replaced = jQuery(_options.selectStructure);
					var selectText = replaced.find(_options.selectText);
					var selectBtn = replaced.find(_options.selectBtn);
					var selectDisabled = replaced.find(_options.selectDisabled).hide();
					var optHolder = jQuery(_options.optStructure);
					var optList = optHolder.find(_options.optList);
					if(copyClass) optHolder.addClass('drop-'+select.attr('class'));

					if(select.attr('disabled')) selectDisabled.show();
					select.find('option').each(function(){
						var selOpt = jQuery(this);
						var _opt = jQuery('<li><a href="#">' + selOpt.html() + '</a></li>');
						if(selOpt.attr('selected')) {
							selectText.html(selOpt.html());
							_opt.addClass('selected');
						}
						_opt.children('a').click(function() {
							optList.find('li').removeClass('selected');
							select.find('option').removeAttr('selected');
							jQuery(this).parent().addClass('selected');
							selOpt.attr('selected', 'selected');
							selectText.html(selOpt.html());
							select.change();
							optHolder.hide();
							return false;
						});
						optList.append(_opt);
					});
					replaced.width(select.outerWidth());
					replaced.insertBefore(select);
					optHolder.css({
						width: select.outerWidth(),
						display: 'none',
						position: 'absolute'
					});
					jQuery(document.body).append(optHolder);

					var optTimer;
					replaced.hover(function() {
						if(optTimer) clearTimeout(optTimer);
					}, function() {
						if(hideOnMouseOut) {
							optTimer = setTimeout(function() {
								optHolder.hide();
							}, 200);
						}
					});
					optHolder.hover(function(){
						if(optTimer) clearTimeout(optTimer);
					}, function() {
						if(hideOnMouseOut) {
							optTimer = setTimeout(function() {
								optHolder.hide();
							}, 200);
						}
					});
					selectBtn.click(function() {
						if(optHolder.is(':visible')) {
							optHolder.hide();
						}
						else{
							if(_activeDrop) _activeDrop.hide();
							optHolder.children('ul').css({height:'auto', overflow:'hidden'});
							optHolder.css({
								top: replaced.offset().top + replaced.outerHeight(),
								left: replaced.offset().left,
								display: 'block'
							});
							if(optHolder.children('ul').height() > 200) optHolder.children('ul').css({height:200, overflow:'auto'});
							_activeDrop = optHolder;
						}
						return false;
					});
					replaced.addClass(select.attr('class'));
					select.addClass('outtaHere');
				}
			}
		});
	}

	// event handler on DOM ready
	var _activeDrop;
	jQuery(function(){
		jQuery('body').click(hideOptionsClick)
		jQuery(window).resize(hideOptions)
	});
	function hideOptions() {
		if(_activeDrop && _activeDrop.length) {
			_activeDrop.hide();
			_activeDrop = null;
		}
	}
	function hideOptionsClick(e) {
		if(_activeDrop && _activeDrop.length) {
			var f = false;
			jQuery(e.target).parents().each(function(){
				if(this == _activeDrop) f=true;
			});
			if(!f) {
				_activeDrop.hide();
				_activeDrop = null;
			}
		}
	}
})(jQuery);

function clearInputs()
{
	clearFormFields({
		clearInputs: true,
		clearTextareas: true,
		passwordFieldText: true,
		addClassFocus: "focus",
		filterClass: "default"
	});
}
function clearFormFields(o)
{
	if (o.clearInputs == null) o.clearInputs = true;
	if (o.clearTextareas == null) o.clearTextareas = true;
	if (o.passwordFieldText == null) o.passwordFieldText = false;
	if (o.addClassFocus == null) o.addClassFocus = false;
	if (!o.filter) o.filter = "default";
	if(o.clearInputs) {
		var inputs = document.getElementsByTagName("input");
		for (var i = 0; i < inputs.length; i++ ) {
			if((inputs[i].type == "text" || inputs[i].type == "password") && inputs[i].className.indexOf(o.filterClass)) {
				inputs[i].valueHtml = inputs[i].value;
				inputs[i].onfocus = function ()	{
					if(this.valueHtml == this.value) this.value = "";
					if(this.fake) {
						inputsSwap(this, this.previousSibling);
						this.previousSibling.focus();
					}
					if(o.addClassFocus && !this.fake) {
						this.className += " " + o.addClassFocus;
						this.parentNode.className += " parent-" + o.addClassFocus;
					}
				}
				inputs[i].onblur = function () {
					if(this.value == "") {
						this.value = this.valueHtml;
						if(o.passwordFieldText && this.type == "password") inputsSwap(this, this.nextSibling);
					}
					if(o.addClassFocus) {
						this.className = this.className.replace(o.addClassFocus, "");
						this.parentNode.className = this.parentNode.className.replace("parent-"+o.addClassFocus, "");
					}
				}
				if(o.passwordFieldText && inputs[i].type == "password") {
					var fakeInput = document.createElement("input");
					fakeInput.type = "text";
					fakeInput.value = inputs[i].value;
					fakeInput.className = inputs[i].className;
					fakeInput.fake = true;
					inputs[i].parentNode.insertBefore(fakeInput, inputs[i].nextSibling);
					inputsSwap(inputs[i], null);
				}
			}
		}
	}
	if(o.clearTextareas) {
		var textareas = document.getElementsByTagName("textarea");
		for(var i=0; i<textareas.length; i++) {
			if(textareas[i].className.indexOf(o.filterClass)) {
				textareas[i].valueHtml = textareas[i].value;
				textareas[i].onfocus = function() {
					if(this.value == this.valueHtml) this.value = "";
					if(o.addClassFocus) {
						this.className += " " + o.addClassFocus;
						this.parentNode.className += " parent-" + o.addClassFocus;
					}
				}
				textareas[i].onblur = function() {
					if(this.value == "") this.value = this.valueHtml;
					if(o.addClassFocus) {
						this.className = this.className.replace(o.addClassFocus, "");
						this.parentNode.className = this.parentNode.className.replace("parent-"+o.addClassFocus, "");
					}
				}
			}
		}
	}
	function inputsSwap(el, el2) {
		if(el) el.style.display = "none";
		if(el2) el2.style.display = "inline";
	}
}

/*
 * Copyright (c) 2009 Simo Kinnunen.
 * Licensed under the MIT license.
 *
 * @version 1.09i
 */
var Cufon=(function(){var m=function(){return m.replace.apply(null,arguments)};var x=m.DOM={ready:(function(){var C=false,E={loaded:1,complete:1};var B=[],D=function(){if(C){return}C=true;for(var F;F=B.shift();F()){}};if(document.addEventListener){document.addEventListener("DOMContentLoaded",D,false);window.addEventListener("pageshow",D,false)}if(!window.opera&&document.readyState){(function(){E[document.readyState]?D():setTimeout(arguments.callee,10)})()}if(document.readyState&&document.createStyleSheet){(function(){try{document.body.doScroll("left");D()}catch(F){setTimeout(arguments.callee,1)}})()}q(window,"load",D);return function(F){if(!arguments.length){D()}else{C?F():B.push(F)}}})(),root:function(){return document.documentElement||document.body}};var n=m.CSS={Size:function(C,B){this.value=parseFloat(C);this.unit=String(C).match(/[a-z%]*jQuery/)[0]||"px";this.convert=function(D){return D/B*this.value};this.convertFrom=function(D){return D/this.value*B};this.toString=function(){return this.value+this.unit}},addClass:function(C,B){var D=C.className;C.className=D+(D&&" ")+B;return C},color:j(function(C){var B={};B.color=C.replace(/^rgba\((.*?),\s*([\d.]+)\)/,function(E,D,F){B.opacity=parseFloat(F);return"rgb("+D+")"});return B}),fontStretch:j(function(B){if(typeof B=="number"){return B}if(/%jQuery/.test(B)){return parseFloat(B)/100}return{"ultra-condensed":0.5,"extra-condensed":0.625,condensed:0.75,"semi-condensed":0.875,"semi-expanded":1.125,expanded:1.25,"extra-expanded":1.5,"ultra-expanded":2}[B]||1}),getStyle:function(C){var B=document.defaultView;if(B&&B.getComputedStyle){return new a(B.getComputedStyle(C,null))}if(C.currentStyle){return new a(C.currentStyle)}return new a(C.style)},gradient:j(function(F){var G={id:F,type:F.match(/^-([a-z]+)-gradient\(/)[1],stops:[]},C=F.substr(F.indexOf("(")).match(/([\d.]+=)?(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)/ig);for(var E=0,B=C.length,D;E<B;++E){D=C[E].split("=",2).reverse();G.stops.push([D[1]||E/(B-1),D[0]])}return G}),quotedList:j(function(E){var D=[],C=/\s*((["'])([\s\S]*?[^\\])\2|[^,]+)\s*/g,B;while(B=C.exec(E)){D.push(B[3]||B[1])}return D}),recognizesMedia:j(function(G){var E=document.createElement("style"),D,C,B;E.type="text/css";E.media=G;try{E.appendChild(document.createTextNode("/**/"))}catch(F){}C=g("head")[0];C.insertBefore(E,C.firstChild);D=(E.sheet||E.styleSheet);B=D&&!D.disabled;C.removeChild(E);return B}),removeClass:function(D,C){var B=RegExp("(?:^|\\s+)"+C+"(?=\\s|jQuery)","g");D.className=D.className.replace(B,"");return D},supports:function(D,C){var B=document.createElement("span").style;if(B[D]===undefined){return false}B[D]=C;return B[D]===C},textAlign:function(E,D,B,C){if(D.get("textAlign")=="right"){if(B>0){E=" "+E}}else{if(B<C-1){E+=" "}}return E},textShadow:j(function(F){if(F=="none"){return null}var E=[],G={},B,C=0;var D=/(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)|(-?[\d.]+[a-z%]*)|,/ig;while(B=D.exec(F)){if(B[0]==","){E.push(G);G={};C=0}else{if(B[1]){G.color=B[1]}else{G[["offX","offY","blur"][C++]]=B[2]}}}E.push(G);return E}),textTransform:(function(){var B={uppercase:function(C){return C.toUpperCase()},lowercase:function(C){return C.toLowerCase()},capitalize:function(C){return C.replace(/\b./g,function(D){return D.toUpperCase()})}};return function(E,D){var C=B[D.get("textTransform")];return C?C(E):E}})(),whiteSpace:(function(){var D={inline:1,"inline-block":1,"run-in":1};var C=/^\s+/,B=/\s+jQuery/;return function(H,F,G,E){if(E){if(E.nodeName.toLowerCase()=="br"){H=H.replace(C,"")}}if(D[F.get("display")]){return H}if(!G.previousSibling){H=H.replace(C,"")}if(!G.nextSibling){H=H.replace(B,"")}return H}})()};n.ready=(function(){var B=!n.recognizesMedia("all"),E=false;var D=[],H=function(){B=true;for(var K;K=D.shift();K()){}};var I=g("link"),J=g("style");function C(K){return K.disabled||G(K.sheet,K.media||"screen")}function G(M,P){if(!n.recognizesMedia(P||"all")){return true}if(!M||M.disabled){return false}try{var Q=M.cssRules,O;if(Q){search:for(var L=0,K=Q.length;O=Q[L],L<K;++L){switch(O.type){case 2:break;case 3:if(!G(O.styleSheet,O.media.mediaText)){return false}break;default:break search}}}}catch(N){}return true}function F(){if(document.createStyleSheet){return true}var L,K;for(K=0;L=I[K];++K){if(L.rel.toLowerCase()=="stylesheet"&&!C(L)){return false}}for(K=0;L=J[K];++K){if(!C(L)){return false}}return true}x.ready(function(){if(!E){E=n.getStyle(document.body).isUsable()}if(B||(E&&F())){H()}else{setTimeout(arguments.callee,10)}});return function(K){if(B){K()}else{D.push(K)}}})();function s(D){var C=this.face=D.face,B={"\u0020":1,"\u00a0":1,"\u3000":1};this.glyphs=D.glyphs;this.w=D.w;this.baseSize=parseInt(C["units-per-em"],10);this.family=C["font-family"].toLowerCase();this.weight=C["font-weight"];this.style=C["font-style"]||"normal";this.viewBox=(function(){var F=C.bbox.split(/\s+/);var E={minX:parseInt(F[0],10),minY:parseInt(F[1],10),maxX:parseInt(F[2],10),maxY:parseInt(F[3],10)};E.width=E.maxX-E.minX;E.height=E.maxY-E.minY;E.toString=function(){return[this.minX,this.minY,this.width,this.height].join(" ")};return E})();this.ascent=-parseInt(C.ascent,10);this.descent=-parseInt(C.descent,10);this.height=-this.ascent+this.descent;this.spacing=function(L,N,E){var O=this.glyphs,M,K,G,P=[],F=0,J=-1,I=-1,H;while(H=L[++J]){M=O[H]||this.missingGlyph;if(!M){continue}if(K){F-=G=K[H]||0;P[I]-=G}F+=P[++I]=~~(M.w||this.w)+N+(B[H]?E:0);K=M.k}P.total=F;return P}}function f(){var C={},B={oblique:"italic",italic:"oblique"};this.add=function(D){(C[D.style]||(C[D.style]={}))[D.weight]=D};this.get=function(H,I){var G=C[H]||C[B[H]]||C.normal||C.italic||C.oblique;if(!G){return null}I={normal:400,bold:700}[I]||parseInt(I,10);if(G[I]){return G[I]}var E={1:1,99:0}[I%100],K=[],F,D;if(E===undefined){E=I>400}if(I==500){I=400}for(var J in G){if(!k(G,J)){continue}J=parseInt(J,10);if(!F||J<F){F=J}if(!D||J>D){D=J}K.push(J)}if(I<F){I=F}if(I>D){I=D}K.sort(function(M,L){return(E?(M>=I&&L>=I)?M<L:M>L:(M<=I&&L<=I)?M>L:M<L)?-1:1});return G[K[0]]}}function r(){function D(F,G){if(F.contains){return F.contains(G)}return F.compareDocumentPosition(G)&16}function B(G){var F=G.relatedTarget;if(!F||D(this,F)){return}C(this,G.type=="mouseover")}function E(F){C(this,F.type=="mouseenter")}function C(F,G){setTimeout(function(){var H=d.get(F).options;m.replace(F,G?h(H,H.hover):H,true)},10)}this.attach=function(F){if(F.onmouseenter===undefined){q(F,"mouseover",B);q(F,"mouseout",B)}else{q(F,"mouseenter",E);q(F,"mouseleave",E)}}}function u(){var C=[],D={};function B(H){var E=[],G;for(var F=0;G=H[F];++F){E[F]=C[D[G]]}return E}this.add=function(F,E){D[F]=C.push(E)-1};this.repeat=function(){var E=arguments.length?B(arguments):C,F;for(var G=0;F=E[G++];){m.replace(F[0],F[1],true)}}}function A(){var D={},B=0;function C(E){return E.cufid||(E.cufid=++B)}this.get=function(E){var F=C(E);return D[F]||(D[F]={})}}function a(B){var D={},C={};this.extend=function(E){for(var F in E){if(k(E,F)){D[F]=E[F]}}return this};this.get=function(E){return D[E]!=undefined?D[E]:B[E]};this.getSize=function(F,E){return C[F]||(C[F]=new n.Size(this.get(F),E))};this.isUsable=function(){return !!B}}function q(C,B,D){if(C.addEventListener){C.addEventListener(B,D,false)}else{if(C.attachEvent){C.attachEvent("on"+B,function(){return D.call(C,window.event)})}}}function v(C,B){var D=d.get(C);if(D.options){return C}if(B.hover&&B.hoverables[C.nodeName.toLowerCase()]){b.attach(C)}D.options=B;return C}function j(B){var C={};return function(D){if(!k(C,D)){C[D]=B.apply(null,arguments)}return C[D]}}function c(F,E){var B=n.quotedList(E.get("fontFamily").toLowerCase()),D;for(var C=0;D=B[C];++C){if(i[D]){return i[D].get(E.get("fontStyle"),E.get("fontWeight"))}}return null}function g(B){return document.getElementsByTagName(B)}function k(C,B){return C.hasOwnProperty(B)}function h(){var C={},B,F;for(var E=0,D=arguments.length;B=arguments[E],E<D;++E){for(F in B){if(k(B,F)){C[F]=B[F]}}}return C}function o(E,M,C,N,F,D){var K=document.createDocumentFragment(),H;if(M===""){return K}var L=N.separate;var I=M.split(p[L]),B=(L=="words");if(B&&t){if(/^\s/.test(M)){I.unshift("")}if(/\sjQuery/.test(M)){I.push("")}}for(var J=0,G=I.length;J<G;++J){H=z[N.engine](E,B?n.textAlign(I[J],C,J,G):I[J],C,N,F,D,J<G-1);if(H){K.appendChild(H)}}return K}function l(D,M){var C=D.nodeName.toLowerCase();if(M.ignore[C]){return}var E=!M.textless[C];var B=n.getStyle(v(D,M)).extend(M);var F=c(D,B),G,K,I,H,L,J;if(!F){return}for(G=D.firstChild;G;G=I){K=G.nodeType;I=G.nextSibling;if(E&&K==3){if(H){H.appendData(G.data);D.removeChild(G)}else{H=G}if(I){continue}}if(H){D.replaceChild(o(F,n.whiteSpace(H.data,B,H,J),B,M,G,D),H);H=null}if(K==1){if(G.firstChild){if(G.nodeName.toLowerCase()=="cufon"){z[M.engine](F,null,B,M,G,D)}else{arguments.callee(G,M)}}J=G}}}var t=" ".split(/\s+/).length==0;var d=new A();var b=new r();var y=new u();var e=false;var z={},i={},w={autoDetect:false,engine:null,forceHitArea:false,hover:false,hoverables:{a:true},ignore:{applet:1,canvas:1,col:1,colgroup:1,head:1,iframe:1,map:1,optgroup:1,option:1,script:1,select:1,style:1,textarea:1,title:1,pre:1},printable:true,selector:(window.Sizzle||(window.jQuery&&function(B){return jQuery(B)})||(window.dojo&&dojo.query)||(window.Ext&&Ext.query)||(window.YAHOO&&YAHOO.util&&YAHOO.util.Selector&&YAHOO.util.Selector.query)||(window.jQueryjQuery&&function(B){return jQueryjQuery(B)})||(window.jQuery&&function(B){return jQuery(B)})||(document.querySelectorAll&&function(B){return document.querySelectorAll(B)})||g),separate:"words",textless:{dl:1,html:1,ol:1,table:1,tbody:1,thead:1,tfoot:1,tr:1,ul:1},textShadow:"none"};var p={words:/\s/.test("\u00a0")?/[^\S\u00a0]+/:/\s+/,characters:"",none:/^/};m.now=function(){x.ready();return m};m.refresh=function(){y.repeat.apply(y,arguments);return m};m.registerEngine=function(C,B){if(!B){return m}z[C]=B;return m.set("engine",C)};m.registerFont=function(D){if(!D){return m}var B=new s(D),C=B.family;if(!i[C]){i[C]=new f()}i[C].add(B);return m.set("fontFamily",'"'+C+'"')};m.replace=function(D,C,B){C=h(w,C);if(!C.engine){return m}if(!e){n.addClass(x.root(),"cufon-active cufon-loading");n.ready(function(){n.addClass(n.removeClass(x.root(),"cufon-loading"),"cufon-ready")});e=true}if(C.hover){C.forceHitArea=true}if(C.autoDetect){delete C.fontFamily}if(typeof C.textShadow=="string"){C.textShadow=n.textShadow(C.textShadow)}if(typeof C.color=="string"&&/^-/.test(C.color)){C.textGradient=n.gradient(C.color)}else{delete C.textGradient}if(!B){y.add(D,arguments)}if(D.nodeType||typeof D=="string"){D=[D]}n.ready(function(){for(var F=0,E=D.length;F<E;++F){var G=D[F];if(typeof G=="string"){m.replace(C.selector(G),C,true)}else{l(G,C)}}});return m};m.set=function(B,C){w[B]=C;return m};return m})();Cufon.registerEngine("vml",(function(){var e=document.namespaces;if(!e){return}e.add("cvml","urn:schemas-microsoft-com:vml");e=null;var b=document.createElement("cvml:shape");b.style.behavior="url(#default#VML)";if(!b.coordsize){return}b=null;var h=(document.documentMode||0)<8;document.write(('<style type="text/css">cufoncanvas{text-indent:0;}@media screen{cvml\\:shape,cvml\\:rect,cvml\\:fill,cvml\\:shadow{behavior:url(#default#VML);display:block;antialias:true;position:absolute;}cufoncanvas{position:absolute;text-align:left;}cufon{display:inline-block;position:relative;vertical-align:'+(h?"middle":"text-bottom")+";}cufon cufontext{position:absolute;left:-10000in;font-size:1px;}a cufon{cursor:pointer}}@media print{cufon cufoncanvas{display:none;}}</style>").replace(/;/g,"!important;"));function c(i,j){return a(i,/(?:em|ex|%)jQuery|^[a-z-]+jQuery/i.test(j)?"1em":j)}function a(l,m){if(m==="0"){return 0}if(/pxjQuery/i.test(m)){return parseFloat(m)}var k=l.style.left,j=l.runtimeStyle.left;l.runtimeStyle.left=l.currentStyle.left;l.style.left=m.replace("%","em");var i=l.style.pixelLeft;l.style.left=k;l.runtimeStyle.left=j;return i}function f(l,k,j,n){var i="computed"+n,m=k[i];if(isNaN(m)){m=k.get(n);k[i]=m=(m=="normal")?0:~~j.convertFrom(a(l,m))}return m}var g={};function d(p){var q=p.id;if(!g[q]){var n=p.stops,o=document.createElement("cvml:fill"),i=[];o.type="gradient";o.angle=180;o.focus="0";o.method="sigma";o.color=n[0][1];for(var m=1,l=n.length-1;m<l;++m){i.push(n[m][0]*100+"% "+n[m][1])}o.colors=i.join(",");o.color2=n[l][1];g[q]=o}return g[q]}return function(ac,G,Y,C,K,ad,W){var n=(G===null);if(n){G=K.alt}var I=ac.viewBox;var p=Y.computedFontSize||(Y.computedFontSize=new Cufon.CSS.Size(c(ad,Y.get("fontSize"))+"px",ac.baseSize));var y,q;if(n){y=K;q=K.firstChild}else{y=document.createElement("cufon");y.className="cufon cufon-vml";y.alt=G;q=document.createElement("cufoncanvas");y.appendChild(q);if(C.printable){var Z=document.createElement("cufontext");Z.appendChild(document.createTextNode(G));y.appendChild(Z)}if(!W){y.appendChild(document.createElement("cvml:shape"))}}var ai=y.style;var R=q.style;var l=p.convert(I.height),af=Math.ceil(l);var V=af/l;var P=V*Cufon.CSS.fontStretch(Y.get("fontStretch"));var U=I.minX,T=I.minY;R.height=af;R.top=Math.round(p.convert(T-ac.ascent));R.left=Math.round(p.convert(U));ai.height=p.convert(ac.height)+"px";var F=Y.get("color");var ag=Cufon.CSS.textTransform(G,Y).split("");var L=ac.spacing(ag,f(ad,Y,p,"letterSpacing"),f(ad,Y,p,"wordSpacing"));if(!L.length){return null}var k=L.total;var x=-U+k+(I.width-L[L.length-1]);var ah=p.convert(x*P),X=Math.round(ah);var O=x+","+I.height,m;var J="r"+O+"ns";var u=C.textGradient&&d(C.textGradient);var o=ac.glyphs,S=0;var H=C.textShadow;var ab=-1,aa=0,w;while(w=ag[++ab]){var D=o[ag[ab]]||ac.missingGlyph,v;if(!D){continue}if(n){v=q.childNodes[aa];while(v.firstChild){v.removeChild(v.firstChild)}}else{v=document.createElement("cvml:shape");q.appendChild(v)}v.stroked="f";v.coordsize=O;v.coordorigin=m=(U-S)+","+T;v.path=(D.d?"m"+D.d+"xe":"")+"m"+m+J;v.fillcolor=F;if(u){v.appendChild(u.cloneNode(false))}var ae=v.style;ae.width=X;ae.height=af;if(H){var s=H[0],r=H[1];var B=Cufon.CSS.color(s.color),z;var N=document.createElement("cvml:shadow");N.on="t";N.color=B.color;N.offset=s.offX+","+s.offY;if(r){z=Cufon.CSS.color(r.color);N.type="double";N.color2=z.color;N.offset2=r.offX+","+r.offY}N.opacity=B.opacity||(z&&z.opacity)||1;v.appendChild(N)}S+=L[aa++]}var M=v.nextSibling,t,A;if(C.forceHitArea){if(!M){M=document.createElement("cvml:rect");M.stroked="f";M.className="cufon-vml-cover";t=document.createElement("cvml:fill");t.opacity=0;M.appendChild(t);q.appendChild(M)}A=M.style;A.width=X;A.height=af}else{if(M){q.removeChild(M)}}ai.width=Math.max(Math.ceil(p.convert(k*P)),0);if(h){var Q=Y.computedYAdjust;if(Q===undefined){var E=Y.get("lineHeight");if(E=="normal"){E="1em"}else{if(!isNaN(E)){E+="em"}}Y.computedYAdjust=Q=0.5*(a(ad,E)-parseFloat(ai.height))}if(Q){ai.marginTop=Math.ceil(Q)+"px";ai.marginBottom=Q+"px"}}return y}})());Cufon.registerEngine("canvas",(function(){var b=document.createElement("canvas");if(!b||!b.getContext||!b.getContext.apply){return}b=null;var a=Cufon.CSS.supports("display","inline-block");var e=!a&&(document.compatMode=="BackCompat"||/frameset|transitional/i.test(document.doctype.publicId));var f=document.createElement("style");f.type="text/css";f.appendChild(document.createTextNode(("cufon{text-indent:0;}@media screen,projection{cufon{display:inline;display:inline-block;position:relative;vertical-align:middle;"+(e?"":"font-size:1px;line-height:1px;")+"}cufon cufontext{display:-moz-inline-box;display:inline-block;width:0;height:0;overflow:hidden;text-indent:-10000in;}"+(a?"cufon canvas{position:relative;}":"cufon canvas{position:absolute;}")+"}@media print{cufon{padding:0;}cufon canvas{display:none;}}").replace(/;/g,"!important;")));document.getElementsByTagName("head")[0].appendChild(f);function d(p,h){var n=0,m=0;var g=[],o=/([mrvxe])([^a-z]*)/g,k;generate:for(var j=0;k=o.exec(p);++j){var l=k[2].split(",");switch(k[1]){case"v":g[j]={m:"bezierCurveTo",a:[n+~~l[0],m+~~l[1],n+~~l[2],m+~~l[3],n+=~~l[4],m+=~~l[5]]};break;case"r":g[j]={m:"lineTo",a:[n+=~~l[0],m+=~~l[1]]};break;case"m":g[j]={m:"moveTo",a:[n=~~l[0],m=~~l[1]]};break;case"x":g[j]={m:"closePath"};break;case"e":break generate}h[g[j].m].apply(h,g[j].a)}return g}function c(m,k){for(var j=0,h=m.length;j<h;++j){var g=m[j];k[g.m].apply(k,g.a)}}return function(V,w,P,t,C,W){var k=(w===null);if(k){w=C.getAttribute("alt")}var A=V.viewBox;var m=P.getSize("fontSize",V.baseSize);var B=0,O=0,N=0,u=0;var z=t.textShadow,L=[];if(z){for(var U=z.length;U--;){var F=z[U];var K=m.convertFrom(parseFloat(F.offX));var I=m.convertFrom(parseFloat(F.offY));L[U]=[K,I];if(I<B){B=I}if(K>O){O=K}if(I>N){N=I}if(K<u){u=K}}}var Z=Cufon.CSS.textTransform(w,P).split("");var E=V.spacing(Z,~~m.convertFrom(parseFloat(P.get("letterSpacing"))||0),~~m.convertFrom(parseFloat(P.get("wordSpacing"))||0));if(!E.length){return null}var h=E.total;O+=A.width-E[E.length-1];u+=A.minX;var s,n;if(k){s=C;n=C.firstChild}else{s=document.createElement("cufon");s.className="cufon cufon-canvas";s.setAttribute("alt",w);n=document.createElement("canvas");s.appendChild(n);if(t.printable){var S=document.createElement("cufontext");S.appendChild(document.createTextNode(w));s.appendChild(S)}}var aa=s.style;var H=n.style;var j=m.convert(A.height);var Y=Math.ceil(j);var M=Y/j;var G=M*Cufon.CSS.fontStretch(P.get("fontStretch"));var J=h*G;var Q=Math.ceil(m.convert(J+O-u));var o=Math.ceil(m.convert(A.height-B+N));n.width=Q;n.height=o;H.width=Q+"px";H.height=o+"px";B+=A.minY;H.top=Math.round(m.convert(B-V.ascent))+"px";H.left=Math.round(m.convert(u))+"px";var r=Math.max(Math.ceil(m.convert(J)),0)+"px";if(a){aa.width=r;aa.height=m.convert(V.height)+"px"}else{aa.paddingLeft=r;aa.paddingBottom=(m.convert(V.height)-1)+"px"}var X=n.getContext("2d"),D=j/A.height;X.scale(D,D*M);X.translate(-u,-B);X.save();function T(){var x=V.glyphs,ab,l=-1,g=-1,y;X.scale(G,1);while(y=Z[++l]){var ab=x[Z[l]]||V.missingGlyph;if(!ab){continue}if(ab.d){X.beginPath();if(ab.code){c(ab.code,X)}else{ab.code=d("m"+ab.d,X)}X.fill()}X.translate(E[++g],0)}X.restore()}if(z){for(var U=z.length;U--;){var F=z[U];X.save();X.fillStyle=F.color;X.translate.apply(X,L[U]);T()}}var q=t.textGradient;if(q){var v=q.stops,p=X.createLinearGradient(0,A.minY,0,A.maxY);for(var U=0,R=v.length;U<R;++U){p.addColorStop.apply(p,v[U])}X.fillStyle=p}else{X.fillStyle=P.get("color")}T();return s}})());

//cufon fonts
Cufon.registerFont({"w":200,"face":{"font-family":"Avenir LT Std","font-weight":400,"font-stretch":"normal","units-per-em":"360","panose-1":"2 11 5 3 2 2 3 2 2 4","ascent":"272","descent":"-88","x-height":"4","bbox":"-60 -334 360 90","underline-thickness":"18","underline-position":"-18","stemh":"24","stemv":"28","unicode-range":"U+0020-U+FB02"},"glyphs":{" ":{"w":100},"\ufb01":{"d":"110,-168r0,23r-41,0r0,145r-28,0r0,-145r-37,0r0,-23r37,0v-8,-66,13,-124,81,-104r-4,25v-47,-19,-54,27,-49,79r41,0xm136,0r0,-168r28,0r0,168r-28,0xm130,-234v0,-11,8,-21,20,-21v12,0,21,10,21,21v0,12,-9,20,-21,20v-12,0,-20,-8,-20,-20","w":193,"k":{"\u2019":-6,"f":6,"\ufb01":6,"\ufb02":6,"\u00df":6}},"\ufb02":{"d":"41,0r0,-145r-37,0r0,-23r37,0v-8,-66,13,-124,81,-104r-4,25v-47,-19,-54,27,-49,79r41,0r0,23r-41,0r0,145r-28,0xm136,0r0,-272r28,0r0,272r-28,0","w":193,"k":{"\u2019":-6,"f":6,"\ufb01":6,"\ufb02":6,"\u00df":6}},"!":{"d":"65,-255r0,184r-30,0r0,-184r30,0xm50,-41v12,0,22,10,22,22v0,12,-11,21,-22,21v-11,0,-22,-9,-22,-21v0,-12,10,-22,22,-22","w":100},"\"":{"d":"54,-168r0,-87r26,0r0,87r-26,0xm107,-168r0,-87r26,0r0,87r-26,0","w":186},"#":{"d":"35,0r11,-77r-35,0r0,-23r39,0r7,-55r-35,0r0,-24r38,0r11,-76r24,0r-10,76r45,0r11,-76r24,0r-11,76r35,0r0,24r-38,0r-8,55r36,0r0,23r-39,0r-11,77r-24,0r11,-77r-46,0r-11,77r-24,0xm119,-100r8,-55r-46,0r-7,55r45,0"},"jQuery":{"d":"92,30r0,-26v-30,0,-59,-9,-77,-33r25,-22v10,16,31,26,52,27r0,-91v-38,-10,-71,-29,-71,-73v0,-40,33,-68,71,-71r0,-24r17,0r0,24v26,0,53,10,70,29r-23,22v-11,-14,-28,-23,-47,-23r0,90v39,12,76,26,76,73v0,43,-35,69,-76,72r0,26r-17,0xm92,-146r0,-85v-23,4,-39,20,-39,43v0,25,17,33,39,42xm109,-111r0,87v24,-3,44,-20,44,-43v0,-26,-22,-37,-44,-44"},"%":{"d":"14,-196v0,-35,28,-63,63,-63v35,0,63,28,63,63v0,35,-28,63,-63,63v-35,0,-63,-28,-63,-63xm40,-196v0,20,17,37,37,37v20,0,37,-17,37,-37v0,-20,-17,-37,-37,-37v-20,0,-37,17,-37,37xm160,-59v0,-35,28,-63,63,-63v35,0,63,28,63,63v0,35,-28,63,-63,63v-35,0,-63,-28,-63,-63xm186,-59v0,20,17,37,37,37v20,0,37,-17,37,-37v0,-20,-17,-37,-37,-37v-20,0,-37,17,-37,37xm61,0r160,-266r20,11r-160,267","w":299},"&":{"d":"213,0r-34,-37v-36,63,-156,53,-157,-31v0,-36,25,-60,56,-74v-17,-17,-30,-35,-30,-59v0,-38,30,-59,65,-59v35,0,64,20,64,57v0,32,-28,52,-54,65r54,57r34,-57r35,0r-49,78r58,60r-42,0xm78,-199v0,19,15,31,26,42v19,-10,43,-22,43,-47v0,-19,-15,-30,-33,-30v-20,0,-36,14,-36,35xm161,-57r-64,-67v-22,12,-45,28,-45,55v0,27,23,47,50,47v26,0,43,-16,59,-35","w":259},"\u2019":{"d":"78,-255r-29,87r-27,0r24,-87r32,0","w":100,"k":{"\u2019":33,"s":27,"\u0161":27,"t":6}},"(":{"d":"92,42r-20,14v-69,-94,-68,-229,0,-320r20,15v-62,84,-61,206,0,291","w":100},")":{"d":"8,-250r20,-14v69,94,68,229,0,320r-20,-14v62,-85,61,-207,0,-292","w":100},"*":{"d":"91,-255r0,54r51,-18r7,21r-51,18r32,42r-18,14r-32,-44r-31,44r-18,-14r31,-42r-51,-18r7,-21r51,18r0,-54r22,0","w":159},"+":{"d":"26,-97r0,-24r82,0r0,-82r24,0r0,82r82,0r0,24r-82,0r0,82r-24,0r0,-82r-82,0","w":239},",":{"d":"76,-37r-30,87r-27,0r24,-87r33,0","w":100},"-":{"d":"16,-73r0,-26r88,0r0,26r-88,0","w":119},".":{"d":"50,-41v12,0,22,10,22,22v0,12,-11,21,-22,21v-11,0,-22,-9,-22,-21v0,-12,10,-22,22,-22","w":100},"\/":{"d":"132,-261r-108,276r-23,-9r108,-276","w":133},"0":{"d":"14,-127v0,-58,16,-132,86,-132v70,0,86,74,86,132v0,58,-16,131,-86,131v-70,0,-86,-73,-86,-131xm44,-127v0,37,6,105,56,105v50,0,56,-68,56,-105v0,-37,-6,-106,-56,-106v-50,0,-56,69,-56,106"},"1":{"d":"130,-255r0,255r-31,0r0,-216r-46,39r-18,-22r68,-56r27,0"},"2":{"d":"18,0r0,-35r96,-93v24,-23,36,-37,36,-62v0,-27,-20,-43,-46,-43v-26,0,-44,16,-49,40r-32,-2v7,-85,158,-86,157,5v0,41,-23,63,-49,87r-79,75r130,0r0,28r-164,0"},"3":{"d":"73,-121r0,-26v33,0,66,-1,68,-44v2,-51,-76,-55,-91,-14r-29,-11v24,-64,152,-57,150,23v0,27,-18,51,-44,59v32,5,53,33,53,65v1,89,-146,99,-167,20r31,-10v11,57,105,45,103,-13v-1,-40,-36,-51,-74,-49"},"4":{"d":"151,-255r0,169r37,0r0,28r-37,0r0,58r-30,0r0,-58r-108,0r0,-34r101,-163r37,0xm121,-86r-1,-134r-81,134r82,0"},"5":{"d":"171,-255r0,28r-104,0r-1,69v59,-22,114,19,114,78v0,90,-136,113,-163,38r30,-12v20,51,102,37,102,-26v0,-59,-73,-72,-114,-42r2,-133r134,0"},"6":{"d":"142,-255r-68,107v54,-25,111,11,111,72v0,50,-37,80,-85,80v-48,0,-85,-30,-85,-80v0,-30,10,-49,24,-71r68,-108r35,0xm100,-130v-31,0,-55,21,-55,54v0,33,24,54,55,54v31,0,55,-21,55,-54v0,-33,-24,-54,-55,-54"},"7":{"d":"173,-255r0,28r-102,227r-34,0r103,-227r-123,0r0,-28r156,0"},"8":{"d":"27,-193v0,-40,32,-66,73,-66v75,0,101,102,31,123v31,6,50,34,50,66v0,46,-36,74,-81,74v-45,0,-81,-28,-81,-74v0,-32,19,-60,50,-66v-26,-7,-42,-33,-42,-57xm58,-191v0,24,17,42,42,42v25,0,43,-18,43,-42v0,-24,-18,-42,-43,-42v-25,0,-42,18,-42,42xm49,-72v0,30,23,50,51,50v28,0,51,-20,51,-50v0,-30,-23,-51,-51,-51v-28,0,-51,21,-51,51"},"9":{"d":"58,0r68,-107v-54,25,-111,-11,-111,-72v0,-50,37,-80,85,-80v48,0,85,30,85,80v0,30,-10,49,-24,71r-67,108r-36,0xm100,-125v31,0,55,-21,55,-54v0,-33,-24,-54,-55,-54v-31,0,-55,21,-55,54v0,33,24,54,55,54"},":":{"d":"50,-173v12,0,22,10,22,22v0,12,-11,21,-22,21v-11,0,-22,-9,-22,-21v0,-12,10,-22,22,-22xm50,-41v12,0,22,10,22,22v0,12,-11,21,-22,21v-11,0,-22,-9,-22,-21v0,-12,10,-22,22,-22","w":100},";":{"d":"76,-37r-30,87r-27,0r24,-87r33,0xm50,-173v12,0,22,10,22,22v0,12,-11,21,-22,21v-11,0,-22,-9,-22,-21v0,-12,10,-22,22,-22","w":100},"<":{"d":"214,-203r0,24r-159,70r159,70r0,24r-188,-84r0,-21","w":239},"=":{"d":"26,-125r0,-24r188,0r0,24r-188,0xm26,-69r0,-24r188,0r0,24r-188,0","w":239},">":{"d":"26,-15r0,-24r159,-70r-159,-70r0,-24r188,83r0,21","w":239},"?":{"d":"157,-197v0,56,-70,59,-59,126r-30,0r0,-23v-6,-48,57,-58,56,-102v0,-23,-14,-39,-38,-39v-24,0,-40,16,-44,39r-32,-4v5,-79,147,-83,147,3xm83,-41v12,0,22,10,22,22v0,29,-43,26,-43,0v0,-12,9,-22,21,-22","w":173},"@":{"d":"94,-105v0,20,14,34,32,34v31,0,55,-46,55,-76v0,-18,-14,-34,-29,-34v-34,0,-58,45,-58,76xm223,-198r-34,120v0,5,3,7,9,7v23,0,50,-38,50,-78v0,-57,-48,-93,-98,-93v-62,0,-110,53,-110,115v0,64,51,114,110,114v36,0,72,-18,91,-44r23,0v-23,39,-67,63,-114,63v-76,0,-134,-58,-134,-133v0,-75,60,-134,134,-134v66,0,122,46,122,110v0,62,-50,104,-84,104v-13,0,-20,-10,-24,-24v-24,41,-96,24,-96,-32v0,-50,33,-102,84,-102v18,0,31,10,41,30r6,-23r24,0","w":288},"A":{"d":"2,0r112,-255r29,0r108,255r-35,0r-26,-63r-127,0r-27,63r-34,0xm179,-91r-52,-125r-52,125r104,0","w":253},"B":{"d":"32,0r0,-255v74,0,159,-11,162,63v1,31,-20,48,-45,58v33,3,58,30,58,63v0,83,-94,71,-175,71xm62,-227r0,80v46,-1,100,9,100,-41v0,-47,-55,-38,-100,-39xm62,-119r0,91v51,1,113,6,113,-44v0,-55,-60,-47,-113,-47","w":226},"C":{"d":"237,-221r-27,19v-54,-70,-161,-9,-161,75v0,94,118,142,171,70r23,19v-68,90,-226,32,-226,-89v0,-115,148,-181,220,-94","w":253},"D":{"d":"27,0r0,-255r98,0v50,0,125,34,125,128v0,136,-102,130,-223,127xm57,-227r0,199v90,5,160,-5,160,-99v0,-93,-69,-106,-160,-100","w":266},"E":{"d":"32,0r0,-255r160,0r0,28r-130,0r0,80r121,0r0,28r-121,0r0,91r136,0r0,28r-166,0","w":213},"F":{"d":"32,0r0,-255r158,0r0,28r-128,0r0,84r119,0r0,29r-119,0r0,114r-30,0","k":{"A":20,"\u00c6":20,"\u00c1":20,"\u00c2":20,"\u00c4":20,"\u00c0":20,"\u00c5":20,"\u00c3":20,",":57,".":57}},"G":{"d":"248,-143r0,126v-97,55,-231,9,-231,-110v0,-117,144,-176,227,-101r-23,24v-59,-63,-172,-16,-172,77v0,85,92,130,169,91r0,-78r-59,0r0,-29r89,0","w":280},"H":{"d":"32,0r0,-255r30,0r0,108r136,0r0,-108r30,0r0,255r-30,0r0,-119r-136,0r0,119r-30,0","w":259},"I":{"d":"32,0r0,-255r30,0r0,255r-30,0","w":93},"J":{"d":"142,-255r0,189v0,34,-19,72,-73,72v-36,0,-62,-18,-68,-54r30,-6v4,20,17,32,38,32v35,0,43,-26,43,-54r0,-179r30,0","w":173},"K":{"d":"32,0r0,-255r30,0r0,110r4,0r116,-110r44,0r-126,116r132,139r-44,0r-122,-130r-4,0r0,130r-30,0","w":226},"L":{"d":"32,0r0,-255r30,0r0,227r117,0r0,28r-147,0","w":180,"k":{"T":33,"V":33,"W":20,"y":13,"\u00fd":13,"\u00ff":13,"Y":40,"\u00dd":40,"\u0178":40,"\u2019":27}},"M":{"d":"32,0r0,-255r45,0r87,200r87,-200r44,0r0,255r-30,0r-1,-214r-92,214r-18,0r-92,-214r0,214r-30,0","w":326},"N":{"d":"32,0r0,-255r38,0r148,212r0,-212r30,0r0,255r-38,0r-148,-212r0,212r-30,0","w":280},"O":{"d":"150,6v-77,0,-133,-56,-133,-133v0,-77,56,-134,133,-134v77,0,133,57,133,134v0,77,-56,133,-133,133xm150,-22v60,0,101,-46,101,-105v0,-59,-41,-106,-101,-106v-60,0,-101,47,-101,106v0,59,41,105,101,105","w":300},"P":{"d":"32,0r0,-255v78,0,165,-11,165,70v0,76,-66,72,-135,71r0,114r-30,0xm62,-227r0,84v48,1,102,5,102,-42v0,-47,-54,-43,-102,-42","w":213,"k":{"A":27,"\u00c6":27,"\u00c1":27,"\u00c2":27,"\u00c4":27,"\u00c0":27,"\u00c5":27,"\u00c3":27,",":64,".":64}},"Q":{"d":"296,-26r0,26r-148,0v-75,0,-131,-57,-131,-131v0,-74,56,-130,131,-130v75,0,131,56,131,130v1,44,-26,87,-62,105r79,0xm49,-131v0,58,43,103,99,103v56,0,99,-45,99,-103v0,-57,-42,-102,-99,-102v-57,0,-99,45,-99,102","w":300},"R":{"d":"32,0r0,-255v78,2,166,-17,166,70v0,37,-23,62,-63,68r72,117r-37,0r-69,-114r-39,0r0,114r-30,0xm62,-227r0,84v46,-1,104,9,104,-42v0,-52,-56,-40,-104,-42","w":219,"k":{"T":6,"V":6,"W":6,"Y":13,"\u00dd":13,"\u0178":13}},"S":{"d":"177,-231r-24,21v-23,-37,-100,-30,-101,20v0,23,12,33,53,46v40,13,77,26,77,76v0,84,-127,97,-168,39r26,-21v22,42,109,38,109,-16v0,-31,-21,-37,-66,-52v-36,-12,-64,-28,-64,-70v0,-79,115,-96,158,-43"},"T":{"d":"203,-255r0,28r-85,0r0,227r-30,0r0,-227r-84,0r0,-28r199,0","w":206,"k":{"\u00fc":33,"\u0161":40,"\u00f2":40,"\u00f6":40,"\u00e8":40,"\u00eb":40,"\u00ea":40,"\u00e3":40,"\u00e5":40,"\u00e0":40,"\u00e4":40,"\u00e2":40,"w":40,"y":40,"\u00fd":40,"\u00ff":40,"A":33,"\u00c6":33,"\u00c1":33,"\u00c2":33,"\u00c4":33,"\u00c0":33,"\u00c5":33,"\u00c3":33,",":40,".":40,"c":40,"\u00e7":40,"e":40,"\u00e9":40,"o":40,"\u00f8":40,"\u0153":40,"\u00f3":40,"\u00f4":40,"\u00f5":40,"-":46,"a":40,"\u00e6":40,"\u00e1":40,"r":33,"s":40,"u":33,"\u00fa":33,"\u00fb":33,"\u00f9":33,":":40,";":40}},"U":{"d":"223,-255v-6,117,34,261,-96,261v-130,0,-90,-144,-96,-261r30,0r0,153v0,41,15,80,66,80v103,0,55,-140,66,-233r30,0","w":253},"V":{"d":"94,0r-97,-255r34,0r79,210r81,-210r32,0r-100,255r-29,0","w":219,"k":{"\u00f6":20,"\u00f4":20,"\u00ee":6,"\u00e8":20,"\u00eb":20,"\u00ea":20,"\u00e3":20,"\u00e5":20,"\u00e0":20,"\u00e4":20,"\u00e2":20,"y":6,"\u00fd":6,"\u00ff":6,"A":17,"\u00c6":17,"\u00c1":17,"\u00c2":17,"\u00c4":17,"\u00c0":17,"\u00c5":17,"\u00c3":17,",":46,".":46,"e":20,"\u00e9":20,"o":20,"\u00f8":20,"\u0153":20,"\u00f3":20,"\u00f2":20,"\u00f5":20,"-":20,"a":20,"\u00e6":20,"\u00e1":20,"r":13,"u":13,"\u00fa":13,"\u00fb":13,"\u00fc":13,"\u00f9":13,":":17,";":17,"i":6,"\u00ed":6,"\u00ef":6,"\u00ec":6}},"W":{"d":"77,0r-75,-255r34,0r58,212r63,-212r34,0r63,212r59,-212r32,0r-75,255r-33,0r-64,-216r-63,216r-33,0","w":346,"k":{"\u00fc":6,"\u00f6":21,"\u00ea":17,"\u00e4":13,"A":9,"\u00c6":9,"\u00c1":9,"\u00c2":9,"\u00c4":9,"\u00c0":9,"\u00c5":9,"\u00c3":9,",":27,".":27,"e":17,"\u00e9":17,"\u00eb":17,"\u00e8":17,"o":21,"\u00f8":21,"\u0153":21,"\u00f3":21,"\u00f4":21,"\u00f2":21,"\u00f5":21,"a":13,"\u00e6":13,"\u00e1":13,"\u00e2":13,"\u00e0":13,"\u00e5":13,"\u00e3":13,"r":6,"u":6,"\u00fa":6,"\u00fb":6,"\u00f9":6,":":6,";":6}},"X":{"d":"-1,0r93,-134r-86,-121r39,0r69,100r68,-100r38,0r-86,121r94,134r-40,0r-76,-113r-76,113r-37,0","w":226},"Y":{"d":"92,0r0,-110r-95,-145r38,0r72,115r74,-115r36,0r-95,145r0,110r-30,0","w":213,"k":{"\u00fc":27,"\u00f6":40,"v":20,"A":27,"\u00c6":27,"\u00c1":27,"\u00c2":27,"\u00c4":27,"\u00c0":27,"\u00c5":27,"\u00c3":27,",":50,".":50,"e":40,"\u00e9":40,"\u00ea":40,"\u00eb":40,"\u00e8":40,"o":40,"\u00f8":40,"\u0153":40,"\u00f3":40,"\u00f4":40,"\u00f2":40,"\u00f5":40,"q":33,"-":40,"a":33,"\u00e6":33,"\u00e1":33,"\u00e2":33,"\u00e4":33,"\u00e0":33,"\u00e5":33,"\u00e3":33,"u":27,"\u00fa":27,"\u00fb":27,"\u00f9":27,":":33,";":33,"i":13,"\u00ed":13,"\u00ee":13,"\u00ef":13,"\u00ec":13,"p":27}},"Z":{"d":"10,0r0,-27r148,-200r-145,0r0,-28r181,0r0,26r-147,201r149,0r0,28r-186,0","w":206},"[":{"d":"69,-264r0,22r-33,0r0,277r33,0r0,21r-59,0r0,-320r59,0","w":93},"\\":{"d":"109,15r-108,-276r23,-9r108,276","w":133},"]":{"d":"24,-242r0,-22r59,0r0,320r-59,0r0,-21r33,0r0,-277r-33,0","w":93},"^":{"d":"29,-99r80,-156r22,0r80,156r-27,0r-64,-126r-65,126r-26,0","w":239},"_":{"d":"0,45r0,-18r180,0r0,18r-180,0","w":180},"\u2018":{"d":"22,-168r29,-87r27,0r-24,87r-32,0","w":100,"k":{"\u2018":33}},"a":{"d":"42,-129r-18,-18v42,-44,138,-35,138,45v0,34,-2,72,3,102r-27,0v-3,-8,0,-20,-3,-25v-20,43,-120,38,-118,-21v2,-60,69,-59,117,-59v6,-51,-65,-51,-92,-24xm134,-81v-40,-1,-87,1,-87,32v0,21,16,30,37,30v36,-1,52,-27,50,-62","w":186},"b":{"d":"25,0r0,-272r28,0r1,128v46,-60,149,-19,149,60v0,84,-112,116,-150,54r0,30r-28,0xm53,-84v0,35,24,62,60,62v36,0,60,-27,60,-62v0,-35,-24,-63,-60,-63v-36,0,-60,28,-60,63","w":219},"c":{"d":"169,-146r-22,20v-33,-43,-107,-14,-100,42v-5,55,69,84,100,42r21,19v-49,56,-151,20,-151,-61v0,-80,101,-118,152,-62","w":173},"d":{"d":"167,0v-1,-9,2,-23,-1,-30v-10,19,-35,34,-65,34v-47,0,-84,-38,-84,-88v0,-80,102,-118,150,-60r0,-128r28,0r0,272r-28,0xm167,-84v0,-35,-24,-63,-60,-63v-36,0,-60,28,-60,63v0,35,24,62,60,62v36,0,60,-27,60,-62","w":219},"e":{"d":"156,-47r21,16v-46,67,-160,32,-160,-53v0,-52,36,-89,86,-89v51,0,83,36,80,97r-136,0v-1,55,81,73,109,29xm47,-99r106,0v-1,-28,-20,-48,-51,-48v-31,0,-51,20,-55,48"},"f":{"d":"41,0r0,-145r-37,0r0,-23r37,0v-8,-66,13,-124,81,-104r-4,25v-47,-19,-54,27,-49,79r41,0r0,23r-41,0r0,145r-28,0","w":113,"k":{"\u2019":-6,"f":6,"\ufb01":6,"\ufb02":6,"\u00df":6}},"g":{"d":"195,-168r0,160v9,100,-119,120,-175,62r20,-23v18,19,37,29,63,29v58,-1,68,-41,63,-89v-42,64,-149,21,-149,-55v0,-84,108,-120,150,-56r0,-28r28,0xm47,-84v0,34,27,60,60,60v39,0,60,-29,60,-61v0,-36,-24,-62,-60,-62v-35,0,-60,28,-60,63","w":219},"h":{"d":"27,0r0,-272r28,0r0,127v8,-13,28,-28,54,-28v84,-2,63,96,65,173r-29,0v-5,-55,21,-146,-38,-147v-65,-2,-51,83,-52,147r-28,0"},"i":{"d":"29,0r0,-168r28,0r0,168r-28,0xm23,-234v0,-11,8,-21,20,-21v12,0,21,10,21,21v0,12,-9,20,-21,20v-12,0,-20,-8,-20,-20","w":86},"j":{"d":"57,-168r0,206v7,22,-29,60,-69,45r3,-25v25,8,38,-8,38,-33r0,-193r28,0xm23,-234v0,-11,8,-21,20,-21v12,0,21,10,21,21v0,12,-9,20,-21,20v-12,0,-20,-8,-20,-20","w":86},"k":{"d":"27,0r0,-272r28,0r0,178r76,-74r40,0r-81,76r90,92r-42,0r-83,-89r0,89r-28,0","w":180},"l":{"d":"29,0r0,-272r28,0r0,272r-28,0","w":86},"m":{"d":"27,0r-2,-168r27,0v0,9,1,18,1,27v8,-17,28,-32,56,-32v36,0,49,20,54,32v12,-20,27,-32,53,-32v87,0,60,97,64,173r-28,0v-8,-59,26,-144,-41,-147v-58,-2,-43,88,-44,147r-28,0v-5,-50,17,-147,-32,-147v-65,0,-51,83,-52,147r-28,0","w":306},"n":{"d":"27,0r-2,-168r27,0v0,9,1,18,1,27v8,-17,28,-32,56,-32v84,-2,63,96,65,173r-29,0v-5,-55,21,-146,-38,-147v-65,-2,-51,83,-52,147r-28,0"},"o":{"d":"17,-84v0,-53,38,-89,90,-89v52,0,90,36,90,89v0,53,-38,88,-90,88v-52,0,-90,-35,-90,-88xm47,-84v0,35,24,62,60,62v36,0,60,-27,60,-62v0,-35,-24,-63,-60,-63v-36,0,-60,28,-60,63","w":213},"p":{"d":"25,82r0,-250r28,0v1,7,-2,18,1,24v46,-60,149,-19,149,60v0,84,-112,116,-150,54r0,112r-28,0xm53,-84v0,35,24,62,60,62v36,0,60,-27,60,-62v0,-35,-24,-63,-60,-63v-36,0,-60,28,-60,63","w":219},"q":{"d":"195,-168r0,250r-28,0r-1,-106v-46,58,-149,19,-149,-60v0,-50,37,-89,84,-89v31,-1,54,17,66,34r0,-29r28,0xm167,-84v0,-35,-24,-63,-60,-63v-36,0,-60,28,-60,63v0,35,24,62,60,62v36,0,60,-27,60,-62","w":219},"r":{"d":"27,0r-2,-168r27,0v0,9,1,18,1,27v8,-19,37,-38,68,-30r-2,28v-41,-9,-64,16,-64,61r0,82r-28,0","w":126,"k":{",":33,".":33,"c":6,"\u00e7":6,"d":6,"\u0131":6,"e":6,"\u00e9":6,"\u00ea":6,"\u00eb":6,"\u00e8":6,"g":6,"o":6,"\u00f8":6,"\u0153":6,"\u00f3":6,"\u00f4":6,"\u00f6":6,"\u00f2":6,"\u00f5":6,"q":6,"-":20}},"s":{"d":"43,-123v11,36,104,15,98,74v-6,65,-104,70,-133,22r22,-17v11,14,23,22,43,22v18,0,38,-8,38,-26v0,-18,-18,-22,-36,-26v-32,-7,-60,-14,-60,-49v0,-58,97,-68,120,-19r-23,15v-10,-25,-65,-29,-69,4","w":153},"t":{"d":"119,-168r0,23r-50,0r0,85v-7,34,22,46,50,33r1,25v-42,16,-79,1,-79,-50r0,-93r-37,0r0,-23r37,0r0,-48r28,0r0,48r50,0","w":126},"u":{"d":"174,-168r1,168r-27,0v-1,-9,2,-21,-1,-28v-8,17,-28,32,-56,32v-84,3,-61,-95,-64,-172r28,0v6,55,-21,145,38,146v65,2,51,-83,52,-146r29,0"},"v":{"d":"170,-168r-67,168r-31,0r-68,-168r32,0r54,132r50,-132r30,0","w":173,"k":{",":27,".":27}},"w":{"d":"262,-168r-55,168r-27,0r-49,-130r-42,130r-29,0r-55,-168r31,0r39,129r44,-129r29,0r45,129r38,-129r31,0","w":266,"k":{",":20,".":20}},"x":{"d":"1,0r69,-91r-60,-77r36,0r45,60r42,-60r34,0r-58,77r70,91r-37,0r-53,-73r-53,73r-35,0","w":180},"y":{"d":"170,-168r-81,207v-11,36,-39,57,-82,43r4,-24v25,6,43,-2,51,-25r11,-32r-69,-169r32,0r53,132r50,-132r31,0","w":173,"k":{",":27,".":27}},"z":{"d":"11,0r0,-22r99,-123r-95,0r0,-23r132,0r0,21r-99,123r101,0r0,24r-138,0","w":159},"{":{"d":"106,-264r0,22v-52,-12,-37,48,-37,92v0,33,-24,42,-31,47v8,1,31,10,31,46v0,38,-21,101,37,92r0,21v-38,3,-63,-5,-63,-45v0,-41,5,-106,-31,-104r0,-21v36,1,31,-64,31,-105v0,-40,26,-48,63,-45","w":119},"|":{"d":"28,-270r24,0r0,360r-24,0r0,-360","w":79},"}":{"d":"14,-242r0,-22v38,-3,63,5,63,45v0,42,-5,106,31,105r0,21v-36,-2,-31,63,-31,104v0,40,-25,48,-63,45r0,-21v52,11,37,-48,37,-92v0,-38,24,-43,31,-47v-8,-2,-31,-14,-31,-46v0,-38,21,-101,-37,-92","w":119},"~":{"d":"82,-133v38,0,90,49,109,-1r12,17v-11,15,-24,32,-46,32v-37,0,-90,-50,-108,1r-12,-18v11,-15,23,-31,45,-31","w":239},"\u00a1":{"d":"35,80r0,-184r30,0r0,184r-30,0xm50,-134v-12,0,-22,-10,-22,-22v0,-27,44,-27,44,0v0,12,-10,22,-22,22","w":100},"\u00a2":{"d":"100,-22r0,-124v-62,9,-59,115,0,124xm100,28r0,-24v-46,-6,-76,-40,-76,-88v0,-47,31,-84,76,-88r0,-25r17,0r0,24v23,1,44,10,59,27r-22,20v-10,-13,-23,-20,-37,-21r0,125v16,-1,28,-7,37,-20r21,19v-15,17,-36,26,-58,27r0,24r-17,0"},"\u00a3":{"d":"21,0r0,-28r38,0r0,-91r-34,0r0,-24r34,0v-6,-72,23,-116,77,-116v22,0,43,7,58,22r-19,21v-32,-35,-95,-13,-85,45r0,28r58,0r0,24r-58,0r0,91r88,0r0,28r-157,0"},"\u2044":{"d":"-60,0r160,-266r20,11r-160,267","w":60},"\u00a5":{"d":"85,0r0,-63r-57,0r0,-21r57,0v-1,-11,2,-25,-3,-32r-54,0r0,-21r41,0r-69,-118r36,0r64,118r64,-118r36,0r-69,118r41,0r0,21r-54,0v-5,7,-2,21,-3,32r57,0r0,21r-57,0r0,63r-30,0"},"\u0192":{"d":"155,-153r0,24r-45,0r-24,124v-2,44,-48,72,-90,48r13,-22v27,16,50,-8,49,-34r22,-116r-39,0r0,-24r44,0v9,-48,9,-106,66,-106v13,0,25,4,36,10r-13,22v-46,-25,-55,35,-60,74r41,0"},"\u00a7":{"d":"167,-228r-27,15v-12,-32,-75,-30,-75,9v0,28,32,32,51,43v24,14,55,27,55,59v0,22,-13,38,-31,48v15,10,25,25,25,45v-2,75,-124,82,-145,17r28,-13v7,41,82,44,84,-2v-12,-54,-106,-38,-106,-103v0,-25,15,-41,36,-51v-17,-9,-27,-23,-27,-42v0,-67,106,-78,132,-25xm54,-115v0,32,41,35,63,49v12,-5,23,-17,23,-31v-2,-29,-35,-36,-55,-49v-14,6,-31,13,-31,31"},"\u00a4":{"d":"38,-127v0,33,28,64,62,64v34,0,62,-31,62,-64v0,-35,-28,-65,-62,-65v-34,0,-62,30,-62,65xm10,-53r20,-20v-27,-30,-26,-79,0,-109r-20,-20r16,-15r19,19v31,-25,79,-25,110,0r19,-19r16,15r-19,20v25,30,26,79,0,109r19,20r-16,16r-19,-20v-31,26,-79,26,-110,0r-19,20"},"'":{"d":"37,-168r0,-87r26,0r0,87r-26,0","w":100},"\u201c":{"d":"31,-168r30,-87r27,0r-24,87r-33,0xm99,-168r29,-87r28,0r-25,87r-32,0","w":186},"\u00ab":{"d":"92,-150r-42,64r42,64r-20,13r-51,-77r51,-77xm159,-150r-42,64r42,64r-20,13r-51,-77r51,-77","w":180},"\u2039":{"d":"92,-150r-42,64r42,64r-20,13r-51,-77r51,-77","w":113},"\u203a":{"d":"21,-22r42,-64r-42,-64r20,-13r51,77r-51,77","w":113},"\u2013":{"d":"180,-99r0,26r-180,0r0,-26r180,0","w":180},"\u2020":{"d":"114,-255r0,73r74,0r0,24r-74,0r0,203r-28,0r0,-203r-73,0r0,-24r73,0r0,-73r28,0"},"\u2021":{"d":"114,-255r0,69r71,0r0,24r-71,0r0,114r71,0r0,24r-71,0r0,69r-28,0r0,-69r-71,0r0,-24r71,0r0,-114r-71,0r0,-24r71,0r0,-69r28,0"},"\u00b7":{"d":"50,-133v12,0,22,10,22,22v0,12,-11,21,-22,21v-11,0,-22,-9,-22,-21v0,-12,10,-22,22,-22","w":100},"\u00b6":{"d":"105,45r0,-159v-44,0,-75,-30,-75,-67v0,-47,32,-74,82,-74r87,0r0,300r-25,0r0,-276r-43,0r0,276r-26,0","w":216},"\u2022":{"d":"26,-127v0,-35,29,-64,64,-64v35,0,64,29,64,64v0,35,-29,63,-64,63v-35,0,-64,-28,-64,-63","w":180},"\u201a":{"d":"78,-37r-29,87r-27,0r24,-87r32,0","w":100},"\u201e":{"d":"88,-37r-29,87r-28,0r24,-87r33,0xm156,-37r-30,87r-27,0r24,-87r33,0","w":186},"\u201d":{"d":"88,-255r-29,87r-28,0r24,-87r33,0xm156,-255r-30,87r-27,0r24,-87r33,0","w":186},"\u00bb":{"d":"21,-22r42,-64r-42,-64r20,-13r51,77r-51,77xm88,-22r42,-64r-42,-64r20,-13r51,77r-51,77","w":180},"\u2026":{"d":"60,-41v12,0,22,10,22,22v0,29,-43,26,-43,0v0,-12,9,-22,21,-22xm180,-41v12,0,22,10,22,22v0,27,-44,27,-44,0v0,-12,10,-22,22,-22xm300,-41v12,0,21,10,21,22v0,12,-10,21,-21,21v-11,0,-22,-9,-22,-21v0,-12,10,-22,22,-22","w":360},"\u2030":{"d":"117,-52v0,-31,26,-57,57,-57v31,0,56,26,56,57v0,31,-25,56,-56,56v-31,0,-57,-25,-57,-56xm141,-52v0,17,16,33,33,33v17,0,33,-16,33,-33v0,-17,-16,-33,-33,-33v-17,0,-33,16,-33,33xm247,-52v0,-31,25,-57,56,-57v31,0,57,26,57,57v0,31,-26,56,-57,56v-31,0,-56,-25,-56,-56xm271,-52v0,17,15,33,32,33v17,0,33,-16,33,-33v0,-17,-16,-33,-33,-33v-17,0,-32,16,-32,33xm6,-203v0,-31,26,-56,57,-56v31,0,57,25,57,56v0,31,-26,57,-57,57v-31,0,-57,-26,-57,-57xm30,-203v0,17,16,33,33,33v17,0,33,-16,33,-33v0,-17,-16,-32,-33,-32v-17,0,-33,15,-33,32xm29,0r160,-266r20,11r-160,267","w":366},"\u00bf":{"d":"105,-81v6,48,-56,58,-56,102v0,23,14,39,38,39v24,0,40,-16,44,-39r33,4v-6,79,-147,84,-147,-3v0,-56,70,-59,58,-126r30,0r0,23xm90,-134v-12,0,-21,-10,-21,-22v0,-12,10,-21,21,-21v11,0,22,9,22,21v0,12,-10,22,-22,22","w":173},"`":{"d":"31,-255r37,52r-26,0r-51,-52r40,0","w":86},"\u00b4":{"d":"18,-203r38,-52r39,0r-51,52r-26,0","w":86},"\u02c6":{"d":"-13,-203r40,-52r32,0r41,52r-29,0r-29,-37r-28,37r-27,0","w":86},"\u02dc":{"d":"70,-209v-25,1,-60,-31,-70,2r-17,0v3,-19,15,-38,36,-38v24,0,57,33,67,-1r17,0v-3,18,-12,37,-33,37","w":86},"\u00af":{"d":"93,-238r0,22r-99,0r0,-22r99,0","w":86},"\u02d8":{"d":"-12,-253r18,0v6,37,70,39,75,0r17,0v-1,63,-110,64,-110,0","w":86},"\u02d9":{"d":"43,-246v11,0,20,9,20,19v0,11,-9,20,-20,20v-11,0,-19,-9,-19,-20v0,-10,8,-19,19,-19","w":86},"\u00a8":{"d":"8,-246v11,0,19,9,19,19v0,11,-8,20,-19,20v-11,0,-20,-9,-20,-20v0,-10,9,-19,20,-19xm79,-246v11,0,19,9,19,19v0,11,-8,20,-19,20v-11,0,-20,-9,-20,-20v0,-10,9,-19,20,-19","w":86},"\u02da":{"d":"8,-232v0,-19,14,-36,35,-36v21,0,36,17,36,36v0,19,-15,35,-36,35v-21,0,-35,-16,-35,-35xm23,-232v0,26,41,26,41,0v0,-26,-41,-28,-41,0","w":86},"\u00b8":{"d":"57,0r-16,23v18,-3,41,1,41,23v0,36,-49,37,-78,25r6,-14v15,7,44,12,48,-9v-2,-22,-32,-5,-40,-17r23,-31r16,0","w":86},"\u02dd":{"d":"63,-255r-47,52r-24,0r36,-52r35,0xm124,-255r-51,52r-25,0r39,-52r37,0","w":86},"\u02db":{"d":"66,51r7,15v-19,23,-67,16,-67,-17v0,-23,18,-53,52,-49v-11,8,-28,24,-28,41v0,19,26,21,36,10","w":86},"\u02c7":{"d":"99,-255r-39,52r-33,0r-40,-52r29,0r28,37r28,-37r27,0","w":86},"\u2014":{"d":"0,-73r0,-26r360,0r0,26r-360,0","w":360},"\u00c6":{"d":"-4,0r166,-255r157,0r0,28r-106,0r0,80r99,0r0,28r-99,0r0,91r110,0r0,28r-140,0r0,-69r-106,0r-44,69r-37,0xm183,-97r0,-130r-5,0r-83,130r88,0","w":339},"\u00aa":{"d":"60,-259v61,-4,46,52,49,104r-22,0v-1,-6,-1,-11,-1,-16v-12,28,-76,24,-74,-13v2,-36,45,-35,74,-35v1,-13,-6,-21,-26,-21v-14,0,-27,6,-32,11r-11,-15v11,-10,27,-15,43,-15xm86,-201v-21,1,-47,-6,-50,16v9,26,58,9,50,-16","w":121},"\u0141":{"d":"32,0r0,-80r-28,25r0,-29r28,-24r0,-147r30,0r0,121r78,-67r0,29r-78,67r0,77r117,0r0,28r-147,0","w":180,"k":{"T":33,"V":33,"W":20,"y":13,"\u00fd":13,"\u00ff":13,"Y":40,"\u00dd":40,"\u0178":40,"\u2019":27}},"\u00d8":{"d":"227,-198r-141,153v62,54,165,5,165,-82v0,-27,-9,-52,-24,-71xm72,-59r140,-153v-64,-52,-163,0,-163,85v0,26,9,50,23,68xm22,-4r29,-32v-75,-79,-17,-225,99,-225v32,0,60,10,83,27r28,-32r15,14r-28,31v22,23,35,57,35,94v0,112,-135,171,-218,105r-29,32","w":300},"\u0152":{"d":"217,-227r0,80r101,0r0,28r-101,0r0,91r110,0r0,28r-166,0v-94,0,-141,-61,-141,-127v0,-66,47,-128,141,-128r164,0r0,28r-108,0xm186,-28r0,-199v-86,-8,-134,44,-134,100v0,56,48,107,134,99","w":346},"\u00ba":{"d":"11,-206v0,-31,24,-53,58,-53v34,0,59,22,59,53v0,32,-25,53,-59,53v-34,0,-58,-21,-58,-53xm35,-206v0,18,12,34,34,34v22,0,35,-16,35,-34v0,-17,-13,-34,-35,-34v-22,0,-34,17,-34,34","w":138},"\u00e6":{"d":"264,-47r21,16v-29,50,-119,42,-138,-1v-13,27,-40,36,-68,36v-29,0,-62,-14,-62,-50v0,-58,65,-53,119,-53v8,-52,-62,-60,-92,-31r-18,-19v35,-30,99,-37,126,5v52,-60,149,-24,140,68r-130,0v-3,58,76,71,102,29xm136,-76v-37,1,-89,-8,-89,28v0,19,20,26,39,26v31,0,52,-21,50,-54xm162,-99r99,0v-1,-28,-19,-48,-50,-48v-28,0,-48,25,-49,48","w":306},"\u0131":{"d":"29,0r0,-168r28,0r0,168r-28,0","w":86},"\u0142":{"d":"29,0r0,-111r-29,29r0,-29r29,-29r0,-132r28,0r0,104r29,-30r0,30r-29,29r0,139r-28,0","w":86},"\u00f8":{"d":"58,-47r86,-87v-37,-31,-97,-1,-97,50v0,14,4,27,11,37xm156,-122r-87,88v38,30,98,1,98,-50v0,-14,-4,-28,-11,-38xm13,-1r25,-25v-48,-53,-8,-147,69,-147v22,0,42,7,57,19r24,-25r13,11r-25,25v47,54,9,147,-69,147v-22,0,-42,-6,-57,-18r-24,25","w":213},"\u0153":{"d":"314,-76r-130,0v-3,58,76,71,102,29r21,16v-34,46,-105,49,-137,1v-43,64,-157,32,-157,-54v0,-84,112,-121,157,-55v46,-64,155,-33,144,63xm43,-84v0,32,19,62,56,62v38,0,59,-27,59,-62v0,-33,-19,-63,-57,-63v-38,0,-58,29,-58,63xm184,-99r99,0v-1,-28,-19,-48,-50,-48v-28,0,-48,25,-49,48","w":326},"\u00df":{"d":"27,0r0,-194v0,-44,21,-82,78,-82v72,0,99,100,31,120v37,7,62,37,62,78v0,57,-50,92,-109,79r0,-25v44,10,79,-15,78,-57v-1,-42,-29,-64,-72,-61r0,-24v32,2,52,-13,53,-43v0,-26,-19,-42,-44,-42v-38,0,-49,28,-49,59r0,192r-28,0","w":213},"\u00b9":{"d":"62,-104r0,-127r-30,24r-11,-17v21,-11,29,-36,65,-33r0,153r-24,0","w":129},"\u00ac":{"d":"26,-125r0,-24r188,0r0,100r-24,0r0,-76r-164,0","w":239},"\u00b5":{"d":"174,-168r1,168r-27,0v-1,-9,2,-21,-1,-28v-9,27,-62,43,-92,23r0,87r-28,0r0,-250r28,0v6,55,-21,145,38,146v65,2,51,-83,52,-146r29,0"},"\u2122":{"d":"70,-107r0,-124r-47,0r0,-24r117,0r0,24r-46,0r0,124r-24,0xm170,-107r0,-148r38,0r44,113r45,-113r36,0r0,148r-23,0r-1,-124r-49,124r-16,0r-50,-124r0,124r-24,0","w":356},"\u00d0":{"d":"27,-145r0,-110r98,0v50,0,125,34,125,128v0,136,-102,130,-223,127r0,-121r-26,0r0,-24r26,0xm57,-227r0,82r91,0r0,24r-91,0r0,93v90,5,160,-5,160,-99v0,-93,-69,-106,-160,-100","w":266},"\u00bd":{"d":"48,0r159,-266r20,11r-160,267xm54,-104r-1,-127r-29,24r-12,-17v22,-11,30,-36,65,-33r0,153r-23,0xm181,0r0,-21v25,-28,73,-48,82,-89v0,-35,-53,-33,-56,-2r-22,-1v4,-57,104,-57,102,3v-2,46,-52,61,-75,91r76,0r0,19r-107,0","w":300},"\u00b1":{"d":"26,-119r0,-24r82,0r0,-60r24,0r0,60r82,0r0,24r-82,0r0,61r-24,0r0,-61r-82,0xm26,-15r0,-24r188,0r0,24r-188,0","w":239},"\u00de":{"d":"32,0r0,-255r30,0r0,45v69,-2,135,0,135,70v0,76,-66,72,-135,71r0,69r-30,0xm62,-182r0,84v48,1,102,5,102,-42v0,-47,-54,-43,-102,-42","w":213},"\u00bc":{"d":"266,-153r0,101r20,0r0,20r-20,0r0,32r-24,0r0,-32r-70,0r0,-23r66,-98r28,0xm54,0r159,-266r20,11r-160,267xm242,-52r0,-73r-48,73r48,0xm56,-104r-1,-127r-29,24r-12,-17v22,-11,30,-36,66,-33r0,153r-24,0","w":300},"\u00f7":{"d":"26,-97r0,-24r188,0r0,24r-188,0xm99,-168v0,-12,10,-21,21,-21v11,0,20,10,20,21v0,12,-9,20,-20,20v-11,0,-21,-9,-21,-20xm99,-50v0,-12,10,-20,21,-20v11,0,20,9,20,20v0,12,-9,21,-20,21v-11,0,-21,-10,-21,-21","w":239},"\u00a6":{"d":"28,-243r24,0r0,126r-24,0r0,-126xm28,-63r24,0r0,126r-24,0r0,-126","w":79},"\u00b0":{"d":"21,-208v0,-29,22,-51,51,-51v29,0,51,22,51,51v0,29,-22,52,-51,52v-29,0,-51,-23,-51,-52xm72,-240v-41,1,-42,63,0,64v41,-1,42,-63,0,-64","w":144},"\u00fe":{"d":"25,82r0,-354r28,0r1,128v46,-60,149,-19,149,60v0,84,-112,116,-150,54r0,112r-28,0xm53,-84v0,35,24,62,60,62v36,0,60,-27,60,-62v0,-35,-24,-63,-60,-63v-36,0,-60,28,-60,63","w":219},"\u00be":{"d":"271,-153r0,101r20,0r0,20r-20,0r0,32r-24,0r0,-32r-70,0r0,-23r66,-98r28,0xm68,0r160,-266r19,11r-160,267xm247,-52r0,-73r-48,73r48,0xm49,-174r0,-20v17,0,39,-1,39,-25v0,-28,-46,-28,-55,-6r-20,-9v18,-38,99,-33,99,15v0,16,-12,30,-29,35v21,3,34,20,34,39v1,52,-96,59,-108,10r20,-8v3,25,65,32,64,-4v-1,-25,-24,-27,-44,-27","w":300},"\u00b2":{"d":"12,-104r0,-21v25,-28,72,-48,81,-89v0,-35,-53,-33,-56,-2r-22,-1v4,-57,104,-57,102,3v-2,46,-52,61,-75,91r76,0r0,19r-106,0","w":129},"\u00ae":{"d":"93,-49r0,-157v52,-1,114,-7,114,45v0,28,-19,40,-42,43r45,69r-25,0r-43,-68r-25,0r0,68r-24,0xm117,-186r0,50v30,-1,66,7,66,-26v0,-33,-37,-22,-66,-24xm10,-127v0,-76,61,-134,134,-134v73,0,134,58,134,134v0,76,-61,133,-134,133v-73,0,-134,-57,-134,-133xm34,-127v0,65,48,114,110,114v61,0,110,-49,110,-114v0,-65,-49,-115,-110,-115v-62,0,-110,50,-110,115","w":288},"\u2212":{"d":"26,-121r188,0r0,24r-188,0r0,-24","w":239},"\u00f0":{"d":"46,-220r38,-19v-10,-9,-21,-19,-31,-27r24,-14v10,9,23,19,33,28r39,-19r16,14r-40,20v38,36,72,78,72,142v0,58,-30,99,-90,99v-52,0,-90,-35,-90,-88v0,-74,86,-112,137,-72v-13,-25,-33,-47,-54,-68r-39,19xm47,-84v0,35,24,62,60,62v36,0,60,-27,60,-62v0,-35,-24,-63,-60,-63v-36,0,-60,28,-60,63","w":213},"\u00d7":{"d":"51,-196r69,70r69,-70r18,17r-70,70r70,69r-18,18r-69,-70r-70,70r-17,-17r70,-70r-70,-69","w":239},"\u00b3":{"d":"50,-174r0,-20v18,0,40,0,40,-25v0,-28,-46,-28,-55,-6r-20,-9v17,-38,98,-33,98,15v0,16,-11,30,-28,35v21,3,34,20,34,39v1,52,-96,59,-108,10r20,-8v3,25,65,32,64,-4v-1,-25,-24,-27,-45,-27","w":129},"\u00a9":{"d":"194,-102r22,0v-18,94,-154,60,-147,-25v-11,-88,134,-115,147,-28r-22,0v-19,-63,-101,-33,-101,28v0,33,22,62,56,62v24,0,42,-16,45,-37xm10,-127v0,-76,61,-134,134,-134v73,0,134,58,134,134v0,76,-61,133,-134,133v-73,0,-134,-57,-134,-133xm34,-127v0,65,48,114,110,114v61,0,110,-49,110,-114v0,-65,-49,-115,-110,-115v-62,0,-110,50,-110,115","w":288},"\u00c1":{"d":"2,0r112,-255r29,0r108,255r-35,0r-26,-63r-127,0r-27,63r-34,0xm179,-91r-52,-125r-52,125r104,0xm102,-273r37,-52r40,0r-52,52r-25,0","w":253},"\u00c2":{"d":"2,0r112,-255r29,0r108,255r-35,0r-26,-63r-127,0r-27,63r-34,0xm179,-91r-52,-125r-52,125r104,0xm70,-273r40,-52r33,0r40,52r-29,0r-28,-37r-28,37r-28,0","w":253},"\u00c4":{"d":"2,0r112,-255r29,0r108,255r-35,0r-26,-63r-127,0r-27,63r-34,0xm179,-91r-52,-125r-52,125r104,0xm91,-316v11,0,20,9,20,19v0,11,-9,20,-20,20v-11,0,-19,-9,-19,-20v0,-10,8,-19,19,-19xm162,-316v11,0,20,9,20,19v0,11,-9,20,-20,20v-11,0,-19,-9,-19,-20v0,-10,8,-19,19,-19","w":253},"\u00c0":{"d":"2,0r112,-255r29,0r108,255r-35,0r-26,-63r-127,0r-27,63r-34,0xm179,-91r-52,-125r-52,125r104,0xm114,-325r38,52r-26,0r-51,-52r39,0","w":253},"\u00c5":{"d":"2,0r112,-255r29,0r108,255r-35,0r-26,-63r-127,0r-27,63r-34,0xm179,-91r-52,-125r-52,125r104,0xm91,-298v0,-19,15,-36,36,-36v21,0,35,17,35,36v0,19,-14,35,-35,35v-21,0,-36,-16,-36,-35xm106,-298v0,26,41,27,41,0v0,-27,-41,-27,-41,0","w":253},"\u00c3":{"d":"2,0r112,-255r29,0r108,255r-35,0r-26,-63r-127,0r-27,63r-34,0xm179,-91r-52,-125r-52,125r104,0xm153,-279v-25,0,-60,-32,-69,2r-17,0v3,-19,15,-38,36,-38v23,0,57,32,67,-1r17,0v-3,18,-13,37,-34,37","w":253},"\u00c7":{"d":"237,-221r-27,19v-54,-70,-161,-9,-161,75v0,94,118,142,171,70r23,19v-23,31,-55,44,-96,44r-12,17v19,-3,41,1,41,23v0,36,-49,38,-77,25r6,-14v15,7,44,12,48,-9v-2,-22,-33,-5,-40,-17r18,-26v-65,-7,-114,-60,-114,-132v0,-115,148,-181,220,-94","w":253},"\u00c9":{"d":"32,0r0,-255r160,0r0,28r-130,0r0,80r121,0r0,28r-121,0r0,91r136,0r0,28r-166,0xm82,-273r38,-52r39,0r-51,52r-26,0","w":213},"\u00ca":{"d":"32,0r0,-255r160,0r0,28r-130,0r0,80r121,0r0,28r-121,0r0,91r136,0r0,28r-166,0xm50,-273r40,-52r33,0r40,52r-29,0r-28,-37r-28,37r-28,0","w":213},"\u00cb":{"d":"32,0r0,-255r160,0r0,28r-130,0r0,80r121,0r0,28r-121,0r0,91r136,0r0,28r-166,0xm71,-316v11,0,20,9,20,19v0,11,-9,20,-20,20v-11,0,-19,-9,-19,-20v0,-10,8,-19,19,-19xm143,-316v11,0,19,9,19,19v0,11,-8,20,-19,20v-11,0,-20,-9,-20,-20v0,-10,9,-19,20,-19","w":213},"\u00c8":{"d":"32,0r0,-255r160,0r0,28r-130,0r0,80r121,0r0,28r-121,0r0,91r136,0r0,28r-166,0xm94,-325r38,52r-26,0r-51,-52r39,0","w":213},"\u00cd":{"d":"32,0r0,-255r30,0r0,255r-30,0xm22,-273r37,-52r40,0r-51,52r-26,0","w":93},"\u00ce":{"d":"32,0r0,-255r30,0r0,255r-30,0xm-10,-273r40,-52r33,0r40,52r-29,0r-28,-37r-28,37r-28,0","w":93},"\u00cf":{"d":"32,0r0,-255r30,0r0,255r-30,0xm11,-316v11,0,20,9,20,19v0,11,-9,20,-20,20v-11,0,-19,-9,-19,-20v0,-10,8,-19,19,-19xm82,-316v11,0,20,9,20,19v0,11,-9,20,-20,20v-11,0,-19,-9,-19,-20v0,-10,8,-19,19,-19","w":93},"\u00cc":{"d":"32,0r0,-255r30,0r0,255r-30,0xm34,-325r38,52r-26,0r-51,-52r39,0","w":93},"\u00d1":{"d":"32,0r0,-255r38,0r148,212r0,-212r30,0r0,255r-38,0r-148,-212r0,212r-30,0xm167,-279v-25,1,-60,-31,-70,2r-17,0v3,-19,15,-38,36,-38v23,0,58,33,67,-1r17,0v-3,18,-12,37,-33,37","w":280},"\u00d3":{"d":"150,6v-77,0,-133,-56,-133,-133v0,-77,56,-134,133,-134v77,0,133,57,133,134v0,77,-56,133,-133,133xm150,-22v60,0,101,-46,101,-105v0,-59,-41,-106,-101,-106v-60,0,-101,47,-101,106v0,59,41,105,101,105xm125,-273r38,-52r39,0r-51,52r-26,0","w":300},"\u00d4":{"d":"150,6v-77,0,-133,-56,-133,-133v0,-77,56,-134,133,-134v77,0,133,57,133,134v0,77,-56,133,-133,133xm150,-22v60,0,101,-46,101,-105v0,-59,-41,-106,-101,-106v-60,0,-101,47,-101,106v0,59,41,105,101,105xm94,-273r40,-52r32,0r41,52r-30,0r-28,-37r-28,37r-27,0","w":300},"\u00d6":{"d":"150,6v-77,0,-133,-56,-133,-133v0,-77,56,-134,133,-134v77,0,133,57,133,134v0,77,-56,133,-133,133xm150,-22v60,0,101,-46,101,-105v0,-59,-41,-106,-101,-106v-60,0,-101,47,-101,106v0,59,41,105,101,105xm114,-316v11,0,20,9,20,19v0,11,-9,20,-20,20v-11,0,-19,-9,-19,-20v0,-10,8,-19,19,-19xm186,-316v11,0,19,9,19,19v0,11,-8,20,-19,20v-11,0,-20,-9,-20,-20v0,-10,9,-19,20,-19","w":300},"\u00d2":{"d":"150,6v-77,0,-133,-56,-133,-133v0,-77,56,-134,133,-134v77,0,133,57,133,134v0,77,-56,133,-133,133xm150,-22v60,0,101,-46,101,-105v0,-59,-41,-106,-101,-106v-60,0,-101,47,-101,106v0,59,41,105,101,105xm138,-325r37,52r-26,0r-51,-52r40,0","w":300},"\u00d5":{"d":"150,6v-77,0,-133,-56,-133,-133v0,-77,56,-134,133,-134v77,0,133,57,133,134v0,77,-56,133,-133,133xm150,-22v60,0,101,-46,101,-105v0,-59,-41,-106,-101,-106v-60,0,-101,47,-101,106v0,59,41,105,101,105xm177,-279v-25,1,-60,-31,-70,2r-17,0v3,-19,15,-38,36,-38v23,0,58,33,67,-1r17,0v-3,18,-12,37,-33,37","w":300},"\u0160":{"d":"177,-231r-24,21v-23,-37,-100,-30,-101,20v0,23,12,33,53,46v40,13,77,26,77,76v0,84,-127,97,-168,39r26,-21v22,42,109,38,109,-16v0,-31,-21,-37,-66,-52v-36,-12,-64,-28,-64,-70v0,-79,115,-96,158,-43xm156,-325r-39,52r-33,0r-40,-52r29,0r28,37r28,-37r27,0"},"\u00da":{"d":"223,-255v-6,117,34,261,-96,261v-130,0,-90,-144,-96,-261r30,0r0,153v0,41,15,80,66,80v103,0,55,-140,66,-233r30,0xm102,-273r37,-52r40,0r-52,52r-25,0","w":253},"\u00db":{"d":"223,-255v-6,117,34,261,-96,261v-130,0,-90,-144,-96,-261r30,0r0,153v0,41,15,80,66,80v103,0,55,-140,66,-233r30,0xm70,-273r40,-52r33,0r40,52r-29,0r-28,-37r-28,37r-28,0","w":253},"\u00dc":{"d":"223,-255v-6,117,34,261,-96,261v-130,0,-90,-144,-96,-261r30,0r0,153v0,41,15,80,66,80v103,0,55,-140,66,-233r30,0xm91,-316v11,0,20,9,20,19v0,11,-9,20,-20,20v-11,0,-19,-9,-19,-20v0,-10,8,-19,19,-19xm162,-316v11,0,20,9,20,19v0,11,-9,20,-20,20v-11,0,-19,-9,-19,-20v0,-10,8,-19,19,-19","w":253},"\u00d9":{"d":"223,-255v-6,117,34,261,-96,261v-130,0,-90,-144,-96,-261r30,0r0,153v0,41,15,80,66,80v103,0,55,-140,66,-233r30,0xm114,-325r38,52r-26,0r-51,-52r39,0","w":253},"\u00dd":{"d":"92,0r0,-110r-95,-145r38,0r72,115r74,-115r36,0r-95,145r0,110r-30,0xm82,-273r38,-52r39,0r-51,52r-26,0","w":213,"k":{"v":20,"A":27,"\u00c6":27,"\u00c1":27,"\u00c2":27,"\u00c4":27,"\u00c0":27,"\u00c5":27,"\u00c3":27,",":50,".":50,"e":40,"\u00e9":40,"\u00ea":40,"\u00eb":40,"\u00e8":40,"o":40,"\u00f8":40,"\u0153":40,"\u00f3":40,"\u00f4":40,"\u00f6":40,"\u00f2":40,"\u00f5":40,"q":33,"-":40,"a":33,"\u00e6":33,"\u00e1":33,"\u00e2":33,"\u00e4":33,"\u00e0":33,"\u00e5":33,"\u00e3":33,"u":27,"\u00fa":27,"\u00fb":27,"\u00fc":27,"\u00f9":27,":":33,";":33,"i":13,"\u00ed":13,"\u00ee":13,"\u00ef":13,"\u00ec":13,"p":27}},"\u0178":{"d":"92,0r0,-110r-95,-145r38,0r72,115r74,-115r36,0r-95,145r0,110r-30,0xm71,-316v11,0,20,9,20,19v0,11,-9,20,-20,20v-11,0,-19,-9,-19,-20v0,-10,8,-19,19,-19xm143,-316v11,0,19,9,19,19v0,11,-8,20,-19,20v-11,0,-20,-9,-20,-20v0,-10,9,-19,20,-19","w":213,"k":{"v":20,"A":27,"\u00c6":27,"\u00c1":27,"\u00c2":27,"\u00c4":27,"\u00c0":27,"\u00c5":27,"\u00c3":27,",":50,".":50,"e":40,"\u00e9":40,"\u00ea":40,"\u00eb":40,"\u00e8":40,"o":40,"\u00f8":40,"\u0153":40,"\u00f3":40,"\u00f4":40,"\u00f6":40,"\u00f2":40,"\u00f5":40,"q":33,"-":40,"a":33,"\u00e6":33,"\u00e1":33,"\u00e2":33,"\u00e4":33,"\u00e0":33,"\u00e5":33,"\u00e3":33,"u":27,"\u00fa":27,"\u00fb":27,"\u00fc":27,"\u00f9":27,":":33,";":33,"i":13,"\u00ed":13,"\u00ee":13,"\u00ef":13,"\u00ec":13,"p":27}},"\u017d":{"d":"10,0r0,-27r148,-200r-145,0r0,-28r181,0r0,26r-147,201r149,0r0,28r-186,0xm159,-325r-39,52r-33,0r-40,-52r29,0r28,37r28,-37r27,0","w":206},"\u00e1":{"d":"42,-129r-18,-18v42,-44,138,-35,138,45v0,34,-2,72,3,102r-27,0v-3,-8,0,-20,-3,-25v-20,43,-120,38,-118,-21v2,-60,69,-59,117,-59v6,-51,-65,-51,-92,-24xm134,-81v-40,-1,-87,1,-87,32v0,21,16,30,37,30v36,-1,52,-27,50,-62xm69,-209r37,-52r40,0r-52,52r-25,0","w":186},"\u00e2":{"d":"42,-129r-18,-18v42,-44,138,-35,138,45v0,34,-2,72,3,102r-27,0v-3,-8,0,-20,-3,-25v-20,43,-120,38,-118,-21v2,-60,69,-59,117,-59v6,-51,-65,-51,-92,-24xm134,-81v-40,-1,-87,1,-87,32v0,21,16,30,37,30v36,-1,52,-27,50,-62xm37,-209r40,-52r33,0r40,52r-29,0r-28,-37r-29,37r-27,0","w":186},"\u00e4":{"d":"42,-129r-18,-18v42,-44,138,-35,138,45v0,34,-2,72,3,102r-27,0v-3,-8,0,-20,-3,-25v-20,43,-120,38,-118,-21v2,-60,69,-59,117,-59v6,-51,-65,-51,-92,-24xm134,-81v-40,-1,-87,1,-87,32v0,21,16,30,37,30v36,-1,52,-27,50,-62xm58,-252v11,0,19,9,19,19v0,11,-8,20,-19,20v-11,0,-19,-9,-19,-20v0,-10,8,-19,19,-19xm129,-252v11,0,20,9,20,19v0,11,-9,20,-20,20v-11,0,-19,-9,-19,-20v0,-10,8,-19,19,-19","w":186},"\u00e0":{"d":"42,-129r-18,-18v42,-44,138,-35,138,45v0,34,-2,72,3,102r-27,0v-3,-8,0,-20,-3,-25v-20,43,-120,38,-118,-21v2,-60,69,-59,117,-59v6,-51,-65,-51,-92,-24xm134,-81v-40,-1,-87,1,-87,32v0,21,16,30,37,30v36,-1,52,-27,50,-62xm81,-261r37,52r-25,0r-52,-52r40,0","w":186},"\u00e5":{"d":"42,-129r-18,-18v42,-44,138,-35,138,45v0,34,-2,72,3,102r-27,0v-3,-8,0,-20,-3,-25v-20,43,-120,38,-118,-21v2,-60,69,-59,117,-59v6,-51,-65,-51,-92,-24xm134,-81v-40,-1,-87,1,-87,32v0,21,16,30,37,30v36,-1,52,-27,50,-62xm58,-238v0,-19,15,-36,36,-36v21,0,35,17,35,36v0,19,-14,36,-35,36v-21,0,-36,-17,-36,-36xm73,-238v0,26,41,28,41,0v0,-26,-41,-26,-41,0","w":186},"\u00e3":{"d":"42,-129r-18,-18v42,-44,138,-35,138,45v0,34,-2,72,3,102r-27,0v-3,-8,0,-20,-3,-25v-20,43,-120,38,-118,-21v2,-60,69,-59,117,-59v6,-51,-65,-51,-92,-24xm134,-81v-40,-1,-87,1,-87,32v0,21,16,30,37,30v36,-1,52,-27,50,-62xm120,-215v-25,0,-60,-32,-69,2r-18,0v3,-19,15,-38,36,-38v23,0,57,33,67,-1r18,0v-3,18,-13,37,-34,37","w":186},"\u00e7":{"d":"169,-146r-22,20v-33,-43,-107,-14,-100,42v-5,55,69,84,100,42r21,19v-15,17,-35,26,-57,27r-14,19v18,-3,41,1,41,23v0,36,-49,37,-78,25r7,-14v15,7,44,13,47,-9v-1,-22,-32,-5,-39,-17r19,-28v-47,-4,-77,-38,-77,-87v0,-80,101,-118,152,-62","w":173},"\u00e9":{"d":"156,-47r21,16v-46,67,-160,32,-160,-53v0,-52,36,-89,86,-89v51,0,83,36,80,97r-136,0v-1,55,81,73,109,29xm47,-99r106,0v-1,-28,-20,-48,-51,-48v-31,0,-51,20,-55,48xm75,-209r38,-52r39,0r-51,52r-26,0"},"\u00ea":{"d":"156,-47r21,16v-46,67,-160,32,-160,-53v0,-52,36,-89,86,-89v51,0,83,36,80,97r-136,0v-1,55,81,73,109,29xm47,-99r106,0v-1,-28,-20,-48,-51,-48v-31,0,-51,20,-55,48xm44,-209r40,-52r32,0r41,52r-30,0r-28,-37r-28,37r-27,0"},"\u00eb":{"d":"156,-47r21,16v-46,67,-160,32,-160,-53v0,-52,36,-89,86,-89v51,0,83,36,80,97r-136,0v-1,55,81,73,109,29xm47,-99r106,0v-1,-28,-20,-48,-51,-48v-31,0,-51,20,-55,48xm64,-252v11,0,20,9,20,19v0,11,-9,20,-20,20v-11,0,-19,-9,-19,-20v0,-10,8,-19,19,-19xm136,-252v11,0,19,9,19,19v0,11,-8,20,-19,20v-11,0,-20,-9,-20,-20v0,-10,9,-19,20,-19"},"\u00e8":{"d":"156,-47r21,16v-46,67,-160,32,-160,-53v0,-52,36,-89,86,-89v51,0,83,36,80,97r-136,0v-1,55,81,73,109,29xm47,-99r106,0v-1,-28,-20,-48,-51,-48v-31,0,-51,20,-55,48xm87,-261r38,52r-26,0r-51,-52r39,0"},"\u00ed":{"d":"29,0r0,-168r28,0r0,168r-28,0xm18,-209r38,-52r39,0r-51,52r-26,0","w":86},"\u00ee":{"d":"29,0r0,-168r28,0r0,168r-28,0xm-13,-209r40,-52r32,0r41,52r-29,0r-29,-37r-28,37r-27,0","w":86},"\u00ef":{"d":"29,0r0,-168r28,0r0,168r-28,0xm8,-252v11,0,19,9,19,19v0,11,-8,20,-19,20v-11,0,-20,-9,-20,-20v0,-10,9,-19,20,-19xm79,-252v11,0,19,9,19,19v0,11,-8,20,-19,20v-11,0,-20,-9,-20,-20v0,-10,9,-19,20,-19","w":86},"\u00ec":{"d":"29,0r0,-168r28,0r0,168r-28,0xm31,-261r37,52r-26,0r-51,-52r40,0","w":86},"\u00f1":{"d":"27,0r-2,-168r27,0v0,9,1,18,1,27v8,-17,28,-32,56,-32v84,-2,63,96,65,173r-29,0v-5,-55,21,-146,-38,-147v-65,-2,-51,83,-52,147r-28,0xm127,-215v-25,1,-60,-31,-70,2r-17,0v3,-19,15,-38,36,-38v23,0,58,33,67,-1r17,0v-3,18,-12,37,-33,37"},"\u00f3":{"d":"17,-84v0,-53,38,-89,90,-89v52,0,90,36,90,89v0,53,-38,88,-90,88v-52,0,-90,-35,-90,-88xm47,-84v0,35,24,62,60,62v36,0,60,-27,60,-62v0,-35,-24,-63,-60,-63v-36,0,-60,28,-60,63xm82,-209r38,-52r39,0r-51,52r-26,0","w":213},"\u00f4":{"d":"17,-84v0,-53,38,-89,90,-89v52,0,90,36,90,89v0,53,-38,88,-90,88v-52,0,-90,-35,-90,-88xm47,-84v0,35,24,62,60,62v36,0,60,-27,60,-62v0,-35,-24,-63,-60,-63v-36,0,-60,28,-60,63xm50,-209r40,-52r33,0r40,52r-29,0r-28,-37r-28,37r-28,0","w":213},"\u00f6":{"d":"17,-84v0,-53,38,-89,90,-89v52,0,90,36,90,89v0,53,-38,88,-90,88v-52,0,-90,-35,-90,-88xm47,-84v0,35,24,62,60,62v36,0,60,-27,60,-62v0,-35,-24,-63,-60,-63v-36,0,-60,28,-60,63xm71,-252v11,0,20,9,20,19v0,11,-9,20,-20,20v-11,0,-19,-9,-19,-20v0,-10,8,-19,19,-19xm143,-252v11,0,19,9,19,19v0,11,-8,20,-19,20v-11,0,-20,-9,-20,-20v0,-10,9,-19,20,-19","w":213},"\u00f2":{"d":"17,-84v0,-53,38,-89,90,-89v52,0,90,36,90,89v0,53,-38,88,-90,88v-52,0,-90,-35,-90,-88xm47,-84v0,35,24,62,60,62v36,0,60,-27,60,-62v0,-35,-24,-63,-60,-63v-36,0,-60,28,-60,63xm94,-261r38,52r-26,0r-51,-52r39,0","w":213},"\u00f5":{"d":"17,-84v0,-53,38,-89,90,-89v52,0,90,36,90,89v0,53,-38,88,-90,88v-52,0,-90,-35,-90,-88xm47,-84v0,35,24,62,60,62v36,0,60,-27,60,-62v0,-35,-24,-63,-60,-63v-36,0,-60,28,-60,63xm134,-215v-25,0,-60,-31,-70,2r-17,0v3,-19,15,-38,36,-38v23,0,57,32,67,-1r17,0v-3,18,-12,37,-33,37","w":213},"\u0161":{"d":"43,-123v11,36,104,15,98,74v-6,65,-104,70,-133,22r22,-17v11,14,23,22,43,22v18,0,38,-8,38,-26v0,-18,-18,-22,-36,-26v-32,-7,-60,-14,-60,-49v0,-58,97,-68,120,-19r-23,15v-10,-25,-65,-29,-69,4xm133,-261r-40,52r-33,0r-39,-52r29,0r28,37r27,-37r28,0","w":153},"\u00fa":{"d":"174,-168r1,168r-27,0v-1,-9,2,-21,-1,-28v-8,17,-28,32,-56,32v-84,3,-61,-95,-64,-172r28,0v6,55,-21,145,38,146v65,2,51,-83,52,-146r29,0xm75,-209r38,-52r39,0r-51,52r-26,0"},"\u00fb":{"d":"174,-168r1,168r-27,0v-1,-9,2,-21,-1,-28v-8,17,-28,32,-56,32v-84,3,-61,-95,-64,-172r28,0v6,55,-21,145,38,146v65,2,51,-83,52,-146r29,0xm44,-209r40,-52r32,0r41,52r-30,0r-28,-37r-28,37r-27,0"},"\u00fc":{"d":"174,-168r1,168r-27,0v-1,-9,2,-21,-1,-28v-8,17,-28,32,-56,32v-84,3,-61,-95,-64,-172r28,0v6,55,-21,145,38,146v65,2,51,-83,52,-146r29,0xm64,-252v11,0,20,9,20,19v0,11,-9,20,-20,20v-11,0,-19,-9,-19,-20v0,-10,8,-19,19,-19xm136,-252v11,0,19,9,19,19v0,11,-8,20,-19,20v-11,0,-20,-9,-20,-20v0,-10,9,-19,20,-19"},"\u00f9":{"d":"174,-168r1,168r-27,0v-1,-9,2,-21,-1,-28v-8,17,-28,32,-56,32v-84,3,-61,-95,-64,-172r28,0v6,55,-21,145,38,146v65,2,51,-83,52,-146r29,0xm87,-261r38,52r-26,0r-51,-52r39,0"},"\u00fd":{"d":"170,-168r-81,207v-11,36,-39,57,-82,43r4,-24v25,6,43,-2,51,-25r11,-32r-69,-169r32,0r53,132r50,-132r31,0xm62,-209r37,-52r40,0r-52,52r-25,0","w":173,"k":{",":27,".":27}},"\u00ff":{"d":"170,-168r-81,207v-11,36,-39,57,-82,43r4,-24v25,6,43,-2,51,-25r11,-32r-69,-169r32,0r53,132r50,-132r31,0xm51,-252v11,0,20,9,20,19v0,11,-9,20,-20,20v-11,0,-19,-9,-19,-20v0,-10,8,-19,19,-19xm122,-252v11,0,20,9,20,19v0,11,-9,20,-20,20v-11,0,-19,-9,-19,-20v0,-10,8,-19,19,-19","w":173,"k":{",":27,".":27}},"\u017e":{"d":"11,0r0,-22r99,-123r-95,0r0,-23r132,0r0,21r-99,123r101,0r0,24r-138,0xm136,-261r-40,52r-32,0r-40,-52r29,0r28,37r28,-37r27,0","w":159},"\u2206":{"d":"11,0r0,-19r91,-242r31,0r89,242r0,19r-211,0xm39,-22r154,0r-76,-207r-2,0v-21,67,-52,141,-76,207","w":233},"\u2126":{"d":"18,-22v17,-1,38,2,53,-1v-26,-23,-48,-62,-48,-113v0,-72,46,-122,108,-122v64,0,105,57,105,120v1,54,-26,93,-50,116r55,0r0,22r-87,0r0,-17v27,-18,54,-58,54,-116v0,-48,-27,-102,-78,-102v-49,0,-80,46,-80,103v0,54,27,97,54,115r0,17r-86,0r0,-22","w":259},"\u03bc":{"d":"174,-168r1,168r-27,0v-1,-9,2,-21,-1,-28v-9,27,-62,43,-92,23r0,87r-28,0r0,-250r28,0v6,55,-21,145,38,146v65,2,51,-83,52,-146r29,0"},"\u03c0":{"d":"196,-166r-29,0v1,50,-4,130,5,166r-26,0v-10,-31,-5,-119,-6,-166r-65,0v-2,47,-14,131,-27,166r-26,0v14,-39,25,-117,26,-166v-22,0,-32,2,-40,5r-5,-18v40,-18,135,-7,195,-10","w":205},"\u20ac":{"d":"189,-246r-8,25v-44,-27,-103,-11,-113,49r100,0r-6,21r-98,0v-2,14,-2,32,-1,47r87,0r-6,21r-78,0v3,63,72,82,106,41r16,16v-12,17,-36,30,-64,30v-49,0,-79,-30,-89,-87r-27,0r7,-21r17,0v-1,-16,-1,-33,1,-47r-24,0r7,-21r21,0v15,-77,87,-106,152,-74"},"\u2113":{"d":"153,-54r13,11v-16,30,-39,46,-67,46v-42,-1,-59,-33,-59,-72v-6,5,-14,11,-21,16r-9,-15v10,-9,20,-16,29,-25r0,-100v0,-66,29,-87,56,-87v31,0,44,26,44,59v0,46,-29,89,-74,133v-3,42,16,69,40,69v22,0,39,-18,48,-35xm95,-260v-36,0,-30,97,-30,145v31,-34,56,-70,56,-106v0,-23,-7,-39,-26,-39","w":174},"\u212e":{"d":"66,-50v36,64,146,59,187,3r21,0v-26,31,-69,51,-116,51v-81,0,-146,-58,-146,-131v0,-73,65,-132,146,-132v82,1,148,59,147,135r-239,2r0,72xm251,-205v-33,-61,-139,-58,-182,-8v-6,21,-4,60,-1,82r183,-2r0,-72","w":317},"\u2202":{"d":"37,-245r-10,-20v68,-47,152,-9,152,117v0,86,-32,151,-94,151v-47,0,-70,-43,-70,-84v0,-57,36,-93,77,-93v34,0,52,25,60,35v5,-66,-26,-123,-67,-123v-22,0,-38,9,-48,17xm87,-20v35,0,56,-44,61,-92v-5,-16,-24,-40,-52,-40v-30,0,-54,32,-54,71v0,36,18,61,45,61","w":196},"\u220f":{"d":"242,-229r-39,0r0,264r-27,0r0,-264r-101,0r0,264r-26,0r0,-264r-40,0r0,-25r233,0r0,25","w":252},"\u2211":{"d":"191,35r-183,0r0,-18r97,-126r-92,-126r0,-19r172,0r0,24r-135,1r86,116r-93,122r148,0r0,26","w":199},"\u2219":{"d":"50,-133v12,0,22,10,22,22v0,12,-11,21,-22,21v-11,0,-22,-9,-22,-21v0,-12,10,-22,22,-22","w":100},"\u221a":{"d":"206,-302r-80,356r-24,0r-57,-168r-27,10r-6,-17r50,-19r46,135v2,9,5,20,6,27r72,-324r20,0","w":206},"\u221e":{"d":"262,-105v0,35,-27,57,-55,57v-23,0,-41,-14,-66,-43v-19,22,-39,43,-69,43v-29,0,-54,-24,-54,-56v0,-33,25,-57,57,-57v27,0,48,20,67,43v19,-21,38,-43,68,-43v31,0,52,23,52,56xm75,-65v23,0,41,-22,56,-38v-16,-20,-32,-42,-58,-42v-23,0,-37,19,-37,41v0,22,16,39,39,39xm244,-104v0,-26,-15,-41,-37,-41v-24,0,-43,27,-56,40v24,27,37,40,57,40v23,0,36,-20,36,-39","w":280},"\u222b":{"d":"50,-219v0,-64,21,-102,73,-86r-5,19v-36,-13,-43,20,-43,70v0,57,5,124,5,183v1,68,-22,103,-75,86r5,-20v38,10,45,-13,45,-67v0,-60,-5,-128,-5,-185","w":128},"\u2248":{"d":"66,-157v44,0,83,57,109,1r11,9v-10,19,-24,35,-46,35v-25,0,-50,-27,-76,-28v-17,0,-27,13,-36,27r-11,-9v11,-21,28,-35,49,-35xm66,-95v46,0,82,56,109,0r11,10v-10,19,-24,34,-46,34v-24,0,-51,-27,-76,-27v-17,0,-27,13,-36,27r-11,-10v11,-21,28,-34,49,-34","w":203},"\u2260":{"d":"144,-183r-16,36r56,0r0,17r-63,0r-25,53r88,0r0,18r-95,0r-19,42r-14,-6r16,-36r-54,0r0,-18r62,0r24,-53r-86,0r0,-17r93,0r19,-42","w":203},"\u2264":{"d":"184,-35r-163,-82r0,-18r162,-82r0,22r-144,69r145,70r0,21xm184,-2r-166,0r0,-18r166,0r0,18","w":203},"\u2265":{"d":"21,-217r163,82r0,18r-163,82r0,-21r144,-70r-144,-69r0,-22xm184,-2r-165,0r0,-18r165,0r0,18","w":203},"\u25ca":{"d":"186,-127r-72,144r-22,0r-72,-144r73,-143r21,0xm162,-126v-19,-41,-43,-77,-59,-121v-17,42,-40,80,-59,120r60,121v15,-44,39,-79,58,-120","w":206},"\u00a0":{"w":100},"\u00ad":{"d":"16,-73r0,-26r88,0r0,26r-88,0","w":119},"\u02c9":{"d":"93,-238r0,22r-99,0r0,-22r99,0","w":86},"\u03a9":{"d":"18,-22v17,-1,38,2,53,-1v-26,-23,-48,-62,-48,-113v0,-72,46,-122,108,-122v64,0,105,57,105,120v1,54,-26,93,-50,116r55,0r0,22r-87,0r0,-17v27,-18,54,-58,54,-116v0,-48,-27,-102,-78,-102v-49,0,-80,46,-80,103v0,54,27,97,54,115r0,17r-86,0r0,-22","w":259},"\u2215":{"d":"-60,0r160,-266r20,11r-160,267","w":60}}});
Cufon.registerFont({"w":200,"face":{"font-family":"Avenir Medium","font-weight":600,"font-stretch":"normal","units-per-em":"360","panose-1":"2 11 6 3 2 2 3 2 2 4","ascent":"272","descent":"-88","x-height":"4","bbox":"-60 -333 373 102","underline-thickness":"18","underline-position":"-18","stemh":"28","stemv":"32","unicode-range":"U+0020-U+FB02"},"glyphs":{" ":{"w":100},"\ufb01":{"d":"140,0r0,-171r33,0r0,171r-33,0xm133,-231v0,-13,11,-24,24,-24v13,0,24,11,24,24v0,13,-11,23,-24,23v-13,0,-24,-10,-24,-23xm37,0r0,-143r-37,0r0,-28r37,0v-6,-69,10,-120,83,-103r-4,29v-28,-10,-46,3,-46,35r0,39r38,0r0,28r-39,0r0,143r-32,0","k":{"\u2019":-6,"f":6,"\ufb01":6,"\ufb02":6,"\u00df":6}},"\ufb02":{"d":"141,0r0,-272r32,0r0,272r-32,0xm37,0r0,-143r-37,0r0,-28r37,0v-6,-69,10,-120,83,-103r-4,29v-28,-10,-46,3,-46,35r0,39r38,0r0,28r-39,0r0,143r-32,0","k":{"\u2019":-6,"f":6,"\ufb01":6,"\ufb02":6,"\u00df":6}},"!":{"d":"67,-255r0,182r-35,0r0,-182r35,0xm26,-22v0,-13,11,-23,24,-23v13,0,24,10,24,23v0,13,-11,24,-24,24v-13,0,-24,-11,-24,-24","w":100},"\"":{"d":"53,-166r0,-89r28,0r0,89r-28,0xm106,-166r0,-89r28,0r0,89r-28,0","w":186},"#":{"d":"33,0r10,-73r-34,0r0,-29r38,0r7,-51r-34,0r0,-28r38,0r10,-74r29,0r-10,74r42,0r10,-74r28,0r-10,74r34,0r0,28r-38,0r-7,51r34,0r0,29r-38,0r-10,73r-29,0r10,-73r-41,0r-10,73r-29,0xm125,-153r-42,0r-7,51r41,0"},"jQuery":{"d":"108,-285r0,26v26,0,53,9,71,28r-26,25v-11,-14,-27,-23,-45,-23r0,85v42,12,78,25,78,74v0,44,-36,71,-78,74r0,26r-19,0r0,-26v-31,0,-61,-9,-80,-34r28,-25v11,18,32,28,52,29r0,-88v-39,-10,-74,-28,-74,-74v0,-41,35,-68,74,-71r0,-26r19,0xm89,-149r0,-80v-23,4,-39,18,-39,41v0,23,19,33,39,39xm108,-109r0,83v24,-3,43,-18,43,-42v0,-25,-21,-34,-43,-41"},"%":{"d":"13,-198v0,-35,29,-63,64,-63v35,0,64,28,64,63v0,35,-29,64,-64,64v-35,0,-64,-29,-64,-64xm41,-198v0,20,16,36,36,36v20,0,36,-16,36,-36v0,-20,-16,-35,-36,-35v-20,0,-36,15,-36,35xm166,-57v0,-35,29,-64,64,-64v35,0,63,29,63,64v0,35,-28,63,-63,63v-35,0,-64,-28,-64,-63xm194,-57v0,20,16,35,36,35v20,0,35,-15,35,-35v0,-20,-15,-36,-35,-36v-20,0,-36,16,-36,36xm245,-255r-160,266r-22,-11r160,-266","w":306},"&":{"d":"198,-59r58,59r-46,0r-31,-34v-22,26,-45,40,-79,40v-58,0,-83,-36,-83,-73v0,-36,27,-58,58,-73v-16,-17,-30,-34,-30,-59v0,-39,32,-60,68,-60v36,0,66,18,66,57v0,32,-27,53,-53,66r50,52r32,-52r40,0xm144,-202v0,-17,-13,-27,-31,-27v-18,0,-33,11,-33,30v0,17,14,31,25,42v18,-10,39,-22,39,-45xm158,-56r-62,-64v-21,12,-42,26,-42,52v0,25,24,44,48,44v25,0,43,-16,56,-32","w":259},"\u2019":{"d":"80,-255r-30,89r-30,0r25,-89r35,0","w":100,"k":{"\u2019":36,"s":27,"\u0161":27,"t":6}},"(":{"d":"70,-264r21,14v-62,86,-61,207,0,292r-21,14v-69,-90,-71,-227,0,-320","w":100},")":{"d":"30,56r-21,-14v61,-86,62,-206,0,-291r21,-15v69,90,71,227,0,320","w":100},"*":{"d":"97,-255r0,53r50,-17r7,24r-50,16r32,43r-20,15r-32,-44r-33,43r-19,-14r32,-43r-51,-17r7,-23r51,17r0,-53r26,0","w":167},"+":{"d":"24,-95r0,-28r82,0r0,-82r28,0r0,82r82,0r0,28r-82,0r0,82r-28,0r0,-82r-82,0","w":239},",":{"d":"77,-41r-30,89r-30,0r25,-89r35,0","w":100},"-":{"d":"101,-102r0,30r-88,0r0,-30r88,0","w":113},".":{"d":"50,2v-13,0,-24,-11,-24,-24v0,-13,11,-23,24,-23v13,0,24,10,24,23v0,13,-11,24,-24,24","w":100},"\/":{"d":"140,-261r-115,277r-25,-10r115,-277","w":140},"0":{"d":"12,-127v0,-56,16,-132,88,-132v72,0,88,76,88,132v0,54,-16,131,-88,131v-72,0,-88,-77,-88,-131xm47,-127v0,33,5,101,53,101v48,0,53,-68,53,-101v0,-35,-5,-102,-53,-102v-48,0,-53,67,-53,102"},"1":{"d":"97,0r0,-215r-47,43r-20,-24r71,-59r31,0r0,255r-35,0"},"2":{"d":"17,0r0,-37r102,-101v35,-23,40,-94,-16,-93v-25,0,-42,15,-46,39r-38,-3v6,-89,166,-89,165,4v0,33,-22,58,-45,80r-84,81r129,0r0,30r-167,0"},"3":{"d":"17,-51r36,-11v8,53,96,44,96,-10v0,-42,-40,-48,-72,-48r0,-30v53,0,66,-15,66,-40v1,-51,-73,-53,-86,-12r-35,-11v24,-69,156,-65,155,21v0,27,-17,50,-43,58v32,5,50,34,50,65v1,90,-148,99,-167,18"},"4":{"d":"121,0r0,-56r-109,0r0,-35r102,-164r42,0r0,169r36,0r0,30r-36,0r0,56r-35,0xm121,-86r-1,-128r-78,128r79,0"},"5":{"d":"170,-255r0,33r-104,0r-1,63v61,-19,114,16,114,79v0,91,-141,115,-167,33r35,-12v16,52,97,40,97,-19v0,-58,-67,-68,-114,-43r3,-134r137,0"},"6":{"d":"143,-255r-64,99v52,-18,109,7,109,75v0,56,-40,85,-88,85v-48,0,-87,-32,-87,-82v0,-77,61,-120,90,-177r40,0xm47,-79v0,31,21,53,53,53v32,0,53,-22,53,-53v0,-31,-21,-53,-53,-53v-32,0,-53,22,-53,53"},"7":{"d":"35,0r103,-225r-123,0r0,-30r160,0r0,30r-101,225r-39,0"},"8":{"d":"100,4v-46,0,-83,-29,-83,-77v-1,-33,23,-53,49,-63v-19,-5,-40,-25,-40,-60v0,-39,34,-63,74,-63v40,0,75,24,75,63v1,36,-23,54,-40,61v28,8,48,30,48,62v0,48,-37,77,-83,77xm60,-191v0,20,14,41,40,41v27,0,40,-20,40,-41v0,-23,-16,-40,-40,-40v-22,0,-40,16,-40,40xm100,-26v29,0,49,-19,49,-47v0,-31,-22,-47,-49,-47v-28,0,-49,20,-49,47v0,30,23,47,49,47"},"9":{"d":"57,0r63,-99v-51,19,-107,-8,-107,-75v0,-56,39,-85,87,-85v48,0,88,32,88,82v0,31,-11,51,-26,75r-64,102r-41,0xm153,-176v0,-31,-21,-53,-53,-53v-32,0,-53,22,-53,53v0,31,21,53,53,53v32,0,53,-22,53,-53"},":":{"d":"50,-125v-13,0,-24,-11,-24,-24v0,-13,11,-24,24,-24v13,0,24,11,24,24v0,13,-11,24,-24,24xm26,-22v0,-13,11,-23,24,-23v13,0,24,10,24,23v0,13,-11,24,-24,24v-13,0,-24,-11,-24,-24","w":100},";":{"d":"77,-41r-30,89r-30,0r25,-89r35,0xm26,-149v0,-13,11,-23,24,-23v13,0,24,10,24,23v0,13,-11,24,-24,24v-13,0,-24,-11,-24,-24","w":100},"<":{"d":"216,-44r0,29r-192,-79r0,-30r192,-79r0,28r-163,66","w":239},"=":{"d":"24,-151r192,0r0,28r-192,0r0,-28xm24,-95r192,0r0,28r-192,0r0,-28","w":239},">":{"d":"24,-175r0,-28r192,79r0,30r-192,79r0,-29r162,-65","w":239},"?":{"d":"76,-71v-15,-68,58,-74,58,-122v0,-22,-17,-38,-38,-38v-23,0,-39,16,-42,40r-37,-3v3,-84,151,-92,151,-1v0,60,-67,58,-58,124r-34,0xm69,-22v0,-13,11,-23,24,-23v13,0,23,10,23,23v0,13,-10,24,-23,24v-13,0,-24,-11,-24,-24","w":180},"@":{"d":"152,-175v-34,0,-52,33,-52,68v0,18,7,29,25,29v29,0,50,-38,50,-65v0,-17,-8,-32,-23,-32xm221,-196r-32,109v0,6,4,9,11,9v20,0,44,-33,44,-71v0,-57,-43,-89,-94,-89v-62,0,-106,49,-106,111v0,103,135,146,191,73r29,0v-20,36,-67,60,-113,60v-76,0,-135,-59,-135,-134v0,-74,60,-133,133,-133v67,0,123,46,123,109v0,61,-50,102,-84,102v-14,0,-20,-12,-25,-23v-27,40,-94,22,-94,-34v0,-47,32,-96,81,-96v17,0,33,9,39,28r6,-21r26,0","w":288},"A":{"d":"0,0r113,-255r31,0r109,255r-40,0r-26,-63r-121,0r-25,63r-41,0xm78,-93r97,0r-49,-117","w":253},"B":{"d":"33,0r0,-255v75,0,166,-11,166,64v0,30,-20,46,-44,57v31,2,55,29,55,63v0,77,-95,74,-177,71xm67,-225r0,76v44,0,92,7,95,-38v2,-41,-52,-41,-95,-38xm67,-119r0,89v50,-2,101,12,106,-43v4,-49,-55,-48,-106,-46","w":226},"C":{"d":"239,-222r-29,22v-53,-65,-156,-11,-156,75v0,54,36,99,95,99v29,0,51,-13,66,-34r29,22v-8,10,-38,44,-96,44v-81,0,-131,-67,-131,-131v0,-118,147,-182,222,-97","w":253},"D":{"d":"27,0r0,-255r89,0v108,0,134,81,134,128v0,65,-49,127,-140,127r-83,0xm62,-222r0,190v83,7,149,-16,151,-95v0,-32,-17,-95,-100,-95r-51,0","w":266},"E":{"d":"33,0r0,-255r164,0r0,33r-130,0r0,75r121,0r0,33r-121,0r0,82r137,0r0,32r-171,0","w":219},"F":{"d":"33,0r0,-255r160,0r0,33r-126,0r0,79r117,0r0,33r-117,0r0,110r-34,0","w":206,"k":{"A":20,"\u00c6":20,"\u00c1":20,"\u00c2":20,"\u00c4":20,"\u00c0":20,"\u00c5":20,"\u00c3":20,",":57,".":57}},"G":{"d":"159,-143r91,0r0,126v-25,15,-66,23,-97,23v-86,0,-136,-61,-136,-133v0,-76,55,-134,133,-134v47,0,75,12,95,33r-25,26v-62,-61,-166,-12,-166,75v0,82,90,125,161,88r0,-71r-56,0r0,-33","w":280},"H":{"d":"33,0r0,-255r34,0r0,106r132,0r0,-106r35,0r0,255r-35,0r0,-117r-132,0r0,117r-34,0","w":266},"I":{"d":"33,0r0,-255r34,0r0,255r-34,0","w":100},"J":{"d":"112,-84r0,-171r35,0r0,182v0,64,-47,79,-75,79v-36,0,-62,-18,-69,-55r34,-8v4,19,16,31,35,31v34,0,40,-29,40,-58","w":173},"K":{"d":"33,0r0,-255r34,0r0,110r3,0r113,-110r48,0r-123,118r131,137r-50,0r-119,-127r-3,0r0,127r-34,0","w":233},"L":{"d":"33,0r0,-255r34,0r0,223r117,0r0,32r-151,0","w":186,"k":{"T":33,"V":33,"W":20,"y":13,"\u00fd":13,"\u00ff":13,"Y":40,"\u00dd":40,"\u0178":40,"\u2019":40}},"M":{"d":"30,0r0,-255r52,0r82,193r80,-193r52,0r0,255r-35,0r0,-210r-86,210r-23,0r-87,-210r0,210r-35,0","w":326},"N":{"d":"33,0r0,-255r45,0r141,210r0,-210r35,0r0,255r-44,0r-143,-210r0,210r-34,0","w":286},"O":{"d":"150,6v-78,0,-133,-57,-133,-133v0,-76,55,-134,133,-134v78,0,133,58,133,134v0,76,-55,133,-133,133xm150,-26v58,0,96,-45,96,-101v0,-56,-38,-102,-96,-102v-58,0,-96,46,-96,102v0,56,38,101,96,101","w":299},"P":{"d":"33,0r0,-255r89,0v65,0,82,39,82,71v0,32,-17,72,-82,72r-55,0r0,112r-34,0xm67,-225r0,82v47,-2,100,11,100,-41v0,-52,-53,-39,-100,-41","w":213,"k":{"A":27,"\u00c6":27,"\u00c1":27,"\u00c2":27,"\u00c4":27,"\u00c0":27,"\u00c5":27,"\u00c3":27,",":64,".":64}},"Q":{"d":"296,-30r0,30r-147,0v-72,0,-132,-54,-132,-130v0,-75,57,-131,132,-131v72,0,130,54,130,127v1,44,-23,85,-59,104r76,0xm148,-32v56,0,94,-44,94,-100v0,-54,-40,-97,-94,-97v-53,0,-94,43,-94,96v0,56,39,101,94,101","w":299},"R":{"d":"33,0r0,-255r89,0v113,1,102,126,19,139r73,116r-43,0r-65,-112r-39,0r0,112r-34,0xm67,-225r0,82v47,-2,100,11,100,-41v0,-52,-53,-39,-100,-41","w":219,"k":{"T":6,"Y":6,"\u00dd":6,"\u0178":6}},"S":{"d":"12,-29r28,-24v23,39,105,38,105,-15v0,-59,-126,-23,-126,-122v0,-30,26,-71,87,-71v28,0,54,6,73,29r-28,25v-9,-13,-25,-22,-45,-22v-38,0,-50,23,-50,39v0,64,126,26,126,118v0,85,-129,102,-170,43"},"T":{"d":"86,0r0,-222r-82,0r0,-33r199,0r0,33r-82,0r0,222r-35,0","w":206,"k":{"\u00fc":36,"\u0161":40,"\u00f2":40,"\u00f6":40,"\u00e8":40,"\u00eb":40,"\u00ea":40,"\u00e3":40,"\u00e5":40,"\u00e0":40,"\u00e4":40,"\u00e2":40,"w":40,"y":40,"\u00fd":40,"\u00ff":40,"A":33,"\u00c6":33,"\u00c1":33,"\u00c2":33,"\u00c4":33,"\u00c0":33,"\u00c5":33,"\u00c3":33,",":40,".":40,"c":40,"\u00e7":40,"e":40,"\u00e9":40,"o":40,"\u00f8":40,"\u0153":40,"\u00f3":40,"\u00f4":40,"\u00f5":40,"-":46,"a":40,"\u00e6":40,"\u00e1":40,"r":33,"s":40,"u":36,"\u00fa":36,"\u00fb":36,"\u00f9":36,":":40,";":40}},"U":{"d":"28,-255r35,0r0,156v0,32,16,73,64,73v48,0,64,-41,64,-73r0,-156r34,0r0,162v0,59,-42,99,-98,99v-56,0,-99,-40,-99,-99r0,-162","w":253},"V":{"d":"96,0r-98,-255r40,0r75,207r78,-207r38,0r-100,255r-33,0","w":226,"k":{"\u00f6":20,"\u00f4":20,"\u00ee":6,"\u00e8":20,"\u00eb":20,"\u00ea":20,"\u00e3":20,"\u00e5":20,"\u00e0":20,"\u00e4":20,"\u00e2":20,"y":6,"\u00fd":6,"\u00ff":6,"A":17,"\u00c6":17,"\u00c1":17,"\u00c2":17,"\u00c4":17,"\u00c0":17,"\u00c5":17,"\u00c3":17,",":46,".":46,"e":20,"\u00e9":20,"o":20,"\u00f8":20,"\u0153":20,"\u00f3":20,"\u00f2":20,"\u00f5":20,"-":20,"a":20,"\u00e6":20,"\u00e1":20,"r":13,"u":13,"\u00fa":13,"\u00fb":13,"\u00fc":13,"\u00f9":13,":":17,";":17,"i":6,"\u00ed":6,"\u00ef":6,"\u00ec":6}},"W":{"d":"75,0r-75,-255r36,0r57,204r60,-204r40,0r61,204r56,-204r36,0r-74,255r-37,0r-62,-208r-62,208r-36,0","w":346,"k":{"\u00fc":6,"\u00f6":17,"\u00ea":17,"\u00e4":17,"A":9,"\u00c6":9,"\u00c1":9,"\u00c2":9,"\u00c4":9,"\u00c0":9,"\u00c5":9,"\u00c3":9,",":32,".":32,"e":17,"\u00e9":17,"\u00eb":17,"\u00e8":17,"o":17,"\u00f8":17,"\u0153":17,"\u00f3":17,"\u00f4":17,"\u00f2":17,"\u00f5":17,"a":17,"\u00e6":17,"\u00e1":17,"\u00e2":17,"\u00e0":17,"\u00e5":17,"\u00e3":17,"r":6,"u":6,"\u00fa":6,"\u00fb":6,"\u00f9":6,":":6,";":6}},"X":{"d":"-1,0r93,-134r-86,-121r44,0r67,98r65,-98r43,0r-85,121r94,134r-45,0r-73,-111r-74,111r-43,0","w":233},"Y":{"d":"93,0r0,-109r-97,-146r45,0r69,112r72,-112r42,0r-97,146r0,109r-34,0","w":220,"k":{"\u00fc":27,"\u00f6":40,"v":20,"A":27,"\u00c6":27,"\u00c1":27,"\u00c2":27,"\u00c4":27,"\u00c0":27,"\u00c5":27,"\u00c3":27,",":50,".":50,"e":40,"\u00e9":40,"\u00ea":40,"\u00eb":40,"\u00e8":40,"o":40,"\u00f8":40,"\u0153":40,"\u00f3":40,"\u00f4":40,"\u00f2":40,"\u00f5":40,"q":33,"-":40,"a":33,"\u00e6":33,"\u00e1":33,"\u00e2":33,"\u00e4":33,"\u00e0":33,"\u00e5":33,"\u00e3":33,"u":27,"\u00fa":27,"\u00fb":27,"\u00f9":27,":":33,";":33,"i":13,"\u00ed":13,"\u00ee":13,"\u00ef":13,"\u00ec":13,"p":27}},"Z":{"d":"12,0r0,-32r145,-190r-141,0r0,-33r184,0r0,33r-145,190r147,0r0,32r-190,0","w":213},"[":{"d":"26,56r0,-320r63,0r0,24r-33,0r0,272r33,0r0,24r-63,0","w":100},"\\":{"d":"115,16r-115,-277r25,-10r115,277","w":140},"]":{"d":"12,56r0,-24r32,0r0,-272r-32,0r0,-24r62,0r0,320r-62,0","w":100},"^":{"d":"29,-99r76,-156r29,0r77,156r-30,0r-61,-127r-61,127r-30,0","w":239},"_":{"d":"0,45r0,-18r180,0r0,18r-180,0","w":180},"\u2018":{"d":"20,-166r30,-89r30,0r-25,89r-35,0","w":100,"k":{"\u2018":36}},"a":{"d":"45,-130r-20,-20v37,-44,138,-27,139,32r2,118r-29,0v-2,-8,1,-19,-2,-26v-25,47,-119,39,-119,-21v-1,-52,58,-62,118,-59v11,-49,-70,-52,-89,-24xm134,-82v-37,-1,-84,1,-85,33v0,19,14,27,36,27v40,0,51,-28,49,-60","w":186},"b":{"d":"24,0r0,-272r33,0r1,126v43,-60,156,-18,146,61v8,78,-100,119,-147,61r0,24r-33,0xm113,-26v35,0,56,-24,56,-59v0,-35,-21,-60,-56,-60v-35,0,-56,25,-56,60v0,35,21,59,56,59","w":219},"c":{"d":"171,-148r-24,23v-32,-39,-103,-12,-96,41v-5,51,66,79,96,39r23,23v-51,55,-154,18,-154,-63v0,-83,103,-119,155,-63","w":173},"d":{"d":"195,-272r0,272r-32,0v-1,-7,2,-18,-1,-24v-45,59,-155,16,-146,-61v-8,-79,102,-120,147,-61r0,-126r32,0xm107,-26v35,0,56,-24,56,-59v0,-35,-21,-60,-56,-60v-35,0,-56,25,-56,60v0,35,21,59,56,59","w":219},"e":{"d":"186,-73r-137,0v0,51,80,66,104,24r25,18v-44,64,-164,35,-164,-54v0,-51,38,-90,89,-90v64,0,85,48,83,102xm49,-99r102,0v-1,-28,-16,-50,-49,-50v-32,0,-53,27,-53,50"},"f":{"d":"37,0r0,-143r-37,0r0,-28r37,0v-6,-69,10,-120,83,-103r-4,29v-28,-10,-46,3,-46,35r0,39r38,0r0,28r-39,0r0,143r-32,0","w":119,"k":{"\u2019":-6,"f":6,"\ufb01":6,"\ufb02":6,"\u00df":6}},"g":{"d":"195,-171r0,170v6,87,-120,114,-176,57r22,-28v17,18,36,28,61,28v58,-2,65,-39,60,-84v-42,62,-146,20,-146,-57v0,-79,101,-121,147,-61r0,-25r32,0xm107,-145v-35,0,-56,25,-56,60v0,35,21,57,56,57v35,0,56,-22,56,-57v0,-35,-21,-60,-56,-60","w":219},"h":{"d":"24,0r0,-272r33,0r1,128v23,-48,118,-42,118,34r0,110r-33,0v-3,-54,17,-145,-39,-145v-27,0,-47,17,-47,57r0,88r-33,0"},"i":{"d":"27,0r0,-171r32,0r0,171r-32,0xm19,-232v0,-13,11,-24,24,-24v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-11,-24,-24","w":86},"j":{"d":"27,-171r32,0r0,195v0,18,0,62,-52,62v-7,0,-14,0,-21,-3r4,-30v22,8,37,-2,37,-30r0,-194xm19,-232v0,-13,11,-24,24,-24v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-11,-24,-24","w":86},"k":{"d":"24,0r0,-272r33,0r0,176r73,-74r45,0r-79,77r86,93r-46,0r-79,-89r0,89r-33,0","w":186},"l":{"d":"27,0r0,-272r32,0r0,272r-32,0","w":86},"m":{"d":"24,0r0,-171r31,0r0,27v3,-10,24,-31,55,-31v25,0,42,11,53,32v11,-21,33,-32,54,-32v90,3,59,96,65,175r-32,0v-7,-55,24,-145,-37,-145v-63,0,-38,87,-43,145r-33,0v-6,-54,21,-145,-36,-145v-23,0,-44,17,-44,56r0,89r-33,0","w":306},"n":{"d":"24,0r0,-171r33,0v1,8,-2,21,1,27v23,-48,118,-42,118,34r0,110r-33,0v-3,-54,17,-145,-39,-145v-27,0,-47,17,-47,57r0,88r-33,0"},"o":{"d":"51,-85v0,35,21,59,56,59v35,0,56,-24,56,-59v0,-35,-21,-60,-56,-60v-35,0,-56,25,-56,60xm16,-85v0,-50,40,-90,91,-90v51,0,91,40,91,90v0,50,-40,89,-91,89v-51,0,-91,-39,-91,-89","w":213},"p":{"d":"24,102r0,-273r33,0v1,8,-2,19,1,25v44,-60,155,-17,146,61v8,79,-102,119,-147,61r0,126r-33,0xm113,-145v-35,0,-56,25,-56,60v0,35,21,59,56,59v35,0,56,-24,56,-59v0,-35,-21,-60,-56,-60","w":219},"q":{"d":"195,-171r0,253r-32,0r-1,-106v-43,59,-156,17,-146,-61v-8,-78,101,-121,147,-61r0,-25r32,0xm107,-145v-35,0,-56,25,-56,60v0,35,21,59,56,59v35,0,56,-24,56,-59v0,-35,-21,-60,-56,-60","w":219},"r":{"d":"24,0r0,-171r33,0v1,8,-2,21,1,27v10,-21,37,-36,65,-29r-1,35v-39,-8,-65,9,-65,52r0,86r-33,0","w":133,"k":{",":33,".":33,"c":6,"\u00e7":6,"d":6,"\u0131":6,"e":6,"\u00e9":6,"\u00ea":6,"\u00eb":6,"\u00e8":6,"g":6,"o":6,"\u00f8":6,"\u0153":6,"\u00f3":6,"\u00f4":6,"\u00f6":6,"\u00f2":6,"\u00f5":6,"q":6,"-":20}},"s":{"d":"140,-147r-25,19v-10,-19,-63,-26,-63,2v0,21,29,24,43,27v28,7,50,18,50,50v0,66,-105,69,-135,23r25,-20v12,22,76,31,76,-2v0,-19,-28,-23,-42,-26v-28,-7,-52,-15,-52,-48v1,-61,96,-70,123,-25","w":159},"t":{"d":"116,-171r0,28r-47,0r0,78v0,19,1,39,25,39v8,0,17,-1,23,-5r0,30v-8,4,-23,5,-29,5v-84,-4,-40,-82,-51,-147r-37,0r0,-28r37,0r0,-48r32,0r0,48r47,0","w":133},"u":{"d":"176,-171r0,171r-33,0r0,-26v-24,47,-119,41,-119,-35r0,-110r33,0v3,54,-17,145,39,145v27,0,47,-17,47,-57r0,-88r33,0"},"v":{"d":"73,0r-69,-171r37,0r52,131r48,-131r35,0r-67,171r-36,0","w":180,"k":{",":27,".":27}},"w":{"d":"60,0r-56,-171r36,0r40,128r40,-128r34,0r44,128r37,-128r34,0r-55,171r-33,0r-45,-127r-41,127r-35,0","w":273,"k":{",":20,".":20}},"x":{"d":"2,0r69,-91r-60,-80r42,0r41,61r41,-61r39,0r-58,80r69,91r-42,0r-50,-72r-51,72r-40,0","w":186},"y":{"d":"75,1r-71,-172r37,0r52,134r48,-134r35,0r-81,208v-11,40,-41,58,-87,45r4,-30v41,18,53,-22,63,-51","w":180,"k":{",":27,".":27}},"z":{"d":"13,0r0,-29r96,-114r-93,0r0,-28r133,0r0,29r-98,114r103,0r0,28r-141,0","w":166},"{":{"d":"109,-264r0,26v-46,-9,-34,46,-34,86v0,34,-23,44,-30,49v8,1,30,11,30,48v0,36,-17,93,34,85r0,26v-43,3,-64,-2,-64,-55v0,-38,1,-92,-31,-90r0,-28v34,2,31,-59,31,-99v0,-43,24,-52,64,-48","w":119},"|":{"d":"26,-270r28,0r0,360r-28,0r0,-360","w":79},"}":{"d":"10,56r0,-26v47,10,35,-45,35,-85v0,-34,23,-44,30,-49v-8,-1,-30,-12,-30,-49v0,-36,17,-93,-35,-85r0,-26v61,-15,65,41,65,104v0,26,14,42,30,42r0,28v-34,-1,-30,59,-30,99v0,43,-26,50,-65,47","w":119},"~":{"d":"82,-136v41,1,85,57,109,0r14,22v-30,61,-81,15,-126,6v-15,0,-24,14,-30,26r-14,-22v11,-19,24,-32,47,-32","w":239},"\u00a1":{"d":"33,80r0,-182r35,0r0,182r-35,0xm74,-153v0,13,-11,23,-24,23v-13,0,-24,-10,-24,-23v0,-13,11,-24,24,-24v13,0,24,11,24,24","w":100},"\u00a2":{"d":"123,-147r0,123v15,0,28,-6,38,-18r22,20v-14,16,-36,24,-60,26r0,24r-19,0r0,-24v-48,-5,-78,-42,-78,-89v0,-49,30,-83,78,-90r0,-24r19,0r0,24v23,1,46,10,60,27r-23,22v-9,-11,-23,-21,-37,-21xm104,-24r0,-123v-62,9,-60,114,0,123"},"\u00a3":{"d":"156,-144r0,26r-59,0r0,88r89,0r0,30r-160,0r0,-30r37,0r0,-88r-35,0r0,-26r35,0v-5,-66,11,-112,79,-115v23,0,44,6,61,22r-22,25v-33,-31,-84,-20,-84,41r0,27r59,0"},"\u2044":{"d":"120,-255r-158,267r-22,-12r158,-266","w":60},"\u00a5":{"d":"85,0r0,-67r-62,0r0,-24r62,0v1,-12,0,-23,-6,-29r-56,0r0,-24r41,0r-66,-111r36,0r65,114r66,-114r37,0r-67,111r42,0r0,24r-56,0v-6,6,-7,16,-6,29r62,0r0,24r-62,0r0,67r-30,0"},"\u0192":{"d":"162,-153r0,26r-49,0r-26,132v-5,41,-55,59,-91,38r13,-26v26,14,44,-5,48,-27r22,-117r-39,0r0,-26r44,0v7,-46,18,-108,65,-106v15,0,31,2,42,8r-14,27v-23,-11,-45,-5,-52,31r-7,40r44,0"},"\u00a7":{"d":"174,-225r-30,16v-9,-30,-72,-31,-72,6v0,42,106,38,106,103v0,21,-12,37,-30,47v15,10,23,24,23,43v-2,76,-126,83,-149,18r32,-14v8,37,81,40,81,-4v0,-37,-107,-40,-107,-95v0,-29,15,-45,36,-55v-17,-10,-29,-23,-29,-42v2,-68,112,-80,139,-23xm145,-97v0,-30,-37,-34,-58,-47v-13,5,-26,12,-26,28v0,33,40,36,63,50v11,-7,21,-18,21,-31"},"\u00a4":{"d":"8,-200r20,-20r18,17v33,-23,75,-23,108,0r18,-17r21,20r-18,18v24,32,24,77,0,109r18,17r-21,21r-18,-18v-32,24,-76,24,-108,0r-18,18r-20,-21r17,-17v-23,-32,-23,-77,0,-109xm36,-128v0,36,28,65,64,65v36,0,65,-29,65,-65v0,-36,-29,-64,-65,-64v-36,0,-64,28,-64,64"},"'":{"d":"64,-255r0,89r-28,0r0,-89r28,0","w":100},"\u201c":{"d":"91,-255r-24,89r-35,0r30,-89r29,0xm155,-255r-25,89r-35,0r31,-89r29,0","w":186},"\u00ab":{"d":"69,-10r-52,-77r52,-78r22,15r-42,63r43,63xm141,-10r-53,-77r52,-78r23,15r-42,63r42,63","w":180},"\u2039":{"d":"72,-10r-53,-77r53,-78r22,15r-42,63r42,63","w":113},"\u203a":{"d":"42,-10r-23,-14r43,-63r-43,-63r22,-15r53,78","w":113},"\u2013":{"d":"180,-102r0,29r-180,0r0,-29r180,0","w":180},"\u2020":{"d":"84,45r0,-199r-71,0r0,-28r71,0r0,-73r32,0r0,73r72,0r0,28r-72,0r0,199r-32,0"},"\u2021":{"d":"84,45r0,-69r-69,0r0,-28r69,0r0,-110r-69,0r0,-28r69,0r0,-65r32,0r0,65r69,0r0,28r-69,0r0,110r69,0r0,28r-69,0r0,69r-32,0"},"\u00b7":{"d":"26,-109v0,-13,11,-24,24,-24v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-11,-24,-24","w":100},"\u00b6":{"d":"94,45r0,-159v-44,0,-76,-30,-76,-67v0,-47,31,-74,82,-74r90,0r0,300r-28,0r0,-276r-40,0r0,276r-28,0","w":216},"\u2022":{"d":"26,-127v0,-35,29,-64,64,-64v35,0,64,29,64,64v0,35,-29,63,-64,63v-35,0,-64,-28,-64,-63","w":180},"\u201a":{"d":"80,-41r-30,89r-30,0r25,-89r35,0","w":100},"\u201e":{"d":"91,-41r-30,89r-29,0r25,-89r34,0xm155,-41r-30,89r-30,0r25,-89r35,0","w":186},"\u201d":{"d":"91,-255r-30,89r-29,0r25,-89r34,0xm155,-255r-30,89r-30,0r25,-89r35,0","w":186},"\u00bb":{"d":"111,-165r52,78r-52,77r-22,-14r42,-63r-43,-63xm39,-165r53,78r-52,77r-23,-14r42,-63r-42,-63","w":180},"\u2026":{"d":"60,2v-13,0,-24,-11,-24,-24v0,-13,11,-23,24,-23v13,0,24,10,24,23v0,13,-11,24,-24,24xm180,2v-13,0,-24,-11,-24,-24v0,-13,11,-23,24,-23v13,0,24,10,24,23v0,13,-11,24,-24,24xm300,2v-13,0,-24,-11,-24,-24v0,-13,11,-23,24,-23v13,0,24,10,24,23v0,13,-11,24,-24,24","w":360},"\u2030":{"d":"183,6v-32,0,-59,-26,-59,-58v0,-32,27,-59,59,-59v32,0,58,27,58,59v0,32,-26,58,-58,58xm183,-19v18,0,32,-15,32,-33v0,-18,-14,-33,-32,-33v-18,0,-33,15,-33,33v0,18,15,33,33,33xm256,-52v0,-32,26,-59,58,-59v32,0,59,27,59,59v0,32,-27,58,-59,58v-32,0,-58,-26,-58,-58xm314,-19v18,0,33,-15,33,-33v0,-18,-15,-33,-33,-33v-18,0,-32,15,-32,33v0,18,14,33,32,33xm7,-201v0,-32,27,-58,59,-58v32,0,58,26,58,58v0,32,-26,59,-58,59v-32,0,-59,-27,-59,-59xm33,-201v0,18,15,33,33,33v18,0,32,-15,32,-33v0,-18,-14,-32,-32,-32v-18,0,-33,14,-33,32xm215,-256r-159,267r-23,-11r161,-266","w":380},"\u00bf":{"d":"104,-104v15,68,-58,74,-58,122v0,22,17,38,38,38v23,0,39,-16,42,-40r37,3v-3,84,-151,92,-151,1v0,-60,67,-58,58,-124r34,0xm111,-153v0,13,-11,23,-24,23v-13,0,-23,-10,-23,-23v0,-13,10,-24,23,-24v13,0,24,11,24,24","w":180},"`":{"d":"30,-255r37,52r-30,0r-54,-52r47,0","w":86},"\u00b4":{"d":"19,-203r38,-52r46,0r-54,52r-30,0","w":86},"\u02c6":{"d":"103,-203r-33,0r-27,-35r-26,35r-33,0r40,-52r38,0","w":86},"\u02dc":{"d":"70,-209v-25,1,-60,-31,-70,2r-17,0v3,-19,15,-38,36,-38v24,0,57,33,67,-1r18,0v-3,18,-13,37,-34,37","w":86},"\u00af":{"d":"95,-240r0,24r-104,0r0,-24r104,0","w":86},"\u02d8":{"d":"-13,-253r19,0v5,35,70,35,75,0r19,0v-2,33,-25,50,-57,50v-32,0,-54,-17,-56,-50","w":86},"\u02d9":{"d":"43,-214v-13,0,-22,-10,-22,-23v0,-26,45,-26,45,0v0,13,-10,23,-23,23","w":86},"\u00a8":{"d":"-16,-237v0,-26,45,-26,45,0v0,13,-10,23,-23,23v-13,0,-22,-10,-22,-23xm80,-257v11,0,22,8,22,20v0,13,-9,23,-22,23v-13,0,-22,-10,-22,-23v0,-12,11,-20,22,-20","w":86},"\u02da":{"d":"6,-234v0,-20,18,-36,37,-36v20,0,37,15,37,35v0,20,-17,36,-37,36v-19,0,-37,-15,-37,-35xm65,-234v0,-12,-10,-21,-22,-21v-12,0,-21,9,-21,21v0,12,10,20,21,20v11,0,22,-8,22,-20","w":86},"\u00b8":{"d":"2,74r7,-15v17,7,46,13,50,-9v0,-26,-35,-4,-42,-19r22,-31r18,0r-16,22v22,-1,44,4,44,26v0,40,-53,39,-83,26","w":86},"\u02dd":{"d":"-18,-203r37,-52r46,0r-53,52r-30,0xm43,-203r37,-52r46,0r-54,52r-29,0","w":86},"\u02db":{"d":"69,51r8,16v-22,22,-68,16,-68,-18v0,-20,18,-40,33,-52r20,0v-10,10,-27,30,-27,45v0,20,23,19,34,9","w":86},"\u02c7":{"d":"24,-203r-40,-52r31,0r28,35r27,-35r33,0r-41,52r-38,0","w":86},"\u2014":{"d":"360,-102r0,29r-360,0r0,-29r360,0","w":360},"\u00c6":{"d":"-3,0r165,-255r164,0r0,33r-106,0r0,75r100,0r0,33r-100,0r0,82r110,0r0,32r-145,0r0,-62r-109,0r-36,62r-43,0xm95,-94r90,0r0,-128r-6,0","w":346},"\u00aa":{"d":"111,-153r-24,0v-1,-5,2,-13,-1,-16v-12,29,-75,23,-74,-13v1,-37,45,-37,75,-37v3,-26,-42,-26,-56,-9r-13,-16v23,-27,105,-15,93,20r0,71xm58,-170v23,0,32,-16,28,-32v-21,0,-50,1,-50,19v0,10,11,13,22,13","w":121},"\u0141":{"d":"33,0r0,-75r-26,22r0,-32r26,-22r0,-148r34,0r0,118r78,-67r0,32r-78,67r0,73r117,0r0,32r-151,0","w":186,"k":{"T":33,"V":33,"W":20,"y":13,"\u00fd":13,"\u00ff":13,"Y":40,"\u00dd":40,"\u0178":40,"\u2019":40}},"\u00d8":{"d":"224,-194r-135,147v61,50,157,2,157,-80v0,-26,-8,-49,-22,-67xm75,-62r134,-147v-62,-50,-155,1,-155,82v0,25,8,47,21,65xm35,11r-15,-14r30,-33v-72,-80,-17,-225,100,-225v32,0,61,10,83,27r29,-32r16,13r-30,33v75,77,21,226,-98,226v-33,0,-62,-10,-84,-28","w":299},"\u0152":{"d":"332,-32r0,32r-164,0v-94,0,-147,-53,-147,-127v0,-77,55,-128,147,-128r160,0r0,33r-106,0r0,75r99,0r0,33r-99,0r0,82r110,0xm188,-32r0,-190v-81,-7,-130,37,-130,95v0,61,49,102,130,95","w":353},"\u00ba":{"d":"69,-259v36,0,60,21,60,54v0,33,-24,54,-60,54v-36,0,-59,-21,-59,-54v0,-33,23,-54,59,-54xm69,-238v-21,0,-33,13,-33,33v0,20,12,33,33,33v21,0,34,-13,34,-33v0,-20,-13,-33,-34,-33","w":138},"\u00e6":{"d":"213,-175v72,0,82,56,80,102r-127,0v-7,51,77,69,95,24r27,20v-32,43,-107,51,-138,1v-16,22,-38,34,-70,34v-46,0,-66,-28,-66,-55v0,-58,65,-50,121,-50v8,-53,-61,-63,-91,-31r-20,-20v35,-30,100,-38,129,2v11,-13,29,-27,60,-27xm135,-73v-32,2,-86,-9,-86,24v0,17,16,30,35,30v29,0,53,-19,51,-54xm166,-99r92,0v-1,-26,-12,-48,-45,-48v-30,0,-47,22,-47,48","w":306},"\u0131":{"d":"27,0r0,-171r32,0r0,171r-32,0","w":86},"\u0142":{"d":"27,0r0,-107r-28,28r0,-33r28,-28r0,-132r32,0r0,100r28,-28r0,33r-28,27r0,140r-32,0","w":86},"\u00f8":{"d":"62,-49r82,-83v-35,-30,-93,-5,-93,47v0,14,4,26,11,36xm28,12r-13,-13r24,-25v-51,-52,-9,-149,68,-149v23,0,43,8,58,21r27,-27r13,13r-27,27v47,55,4,145,-71,145v-20,0,-39,-6,-54,-17xm155,-117r-80,81v49,35,113,-24,80,-81","w":213},"\u0153":{"d":"286,-49r26,18v-28,46,-111,47,-141,2v-9,12,-26,33,-70,33v-55,0,-87,-38,-87,-89v0,-83,113,-122,158,-57v12,-15,31,-33,67,-33v54,1,85,41,80,102r-129,0v-9,47,78,68,96,24xm190,-99r95,0v-1,-24,-16,-50,-47,-50v-31,0,-48,29,-48,50xm101,-24v81,1,74,-122,3,-123v-37,0,-55,28,-55,62v0,33,18,61,52,61","w":333},"\u00df":{"d":"24,0r0,-183v0,-51,14,-93,81,-93v40,0,74,23,74,65v1,31,-18,47,-40,56v28,4,61,27,61,76v0,60,-52,94,-113,80r0,-29v43,9,79,-11,78,-54v0,-40,-28,-57,-67,-56r0,-30v28,1,46,-13,46,-39v0,-29,-21,-39,-40,-39v-36,0,-47,25,-47,59r0,187r-33,0","w":219},"\u00b9":{"d":"55,-104r0,-129r-30,26r-15,-17r46,-35r25,0r0,155r-26,0","w":129},"\u00ac":{"d":"216,-151r0,100r-28,0r0,-72r-164,0r0,-28r192,0","w":239},"\u00b5":{"d":"24,82r0,-253r33,0v3,54,-17,145,39,145v27,0,47,-17,47,-57r0,-88r33,0r0,171r-33,0r0,-26v-10,25,-55,38,-86,24r0,84r-33,0"},"\u2122":{"d":"57,-107r0,-124r-45,0r0,-24r118,0r0,24r-45,0r0,124r-28,0xm158,-107r0,-148r43,0r41,114r40,-114r43,0r0,148r-28,0r-1,-123r-43,123r-23,0r-44,-123r0,123r-28,0","w":360},"\u00d0":{"d":"27,0r0,-121r-26,0r0,-24r26,0r0,-110r89,0v108,0,134,81,134,128v0,65,-49,127,-140,127r-83,0xm62,-121r0,89v83,7,149,-16,151,-95v0,-32,-17,-95,-100,-95r-51,0r0,77r84,0r0,24r-84,0","w":266},"\u00bd":{"d":"57,-104r0,-129r-31,26r-15,-17r46,-35r26,0r0,155r-26,0xm178,0r0,-27r64,-58v18,-9,24,-47,-7,-46v-14,0,-23,8,-24,21r-31,-2v0,-56,112,-58,109,0v-2,43,-52,61,-77,88r77,0r0,24r-111,0xm50,0r158,-266r22,11r-158,267","w":300},"\u00b1":{"d":"24,-113r0,-28r82,0r0,-59r28,0r0,59r82,0r0,28r-82,0r0,54r-28,0r0,-54r-82,0xm24,-18r0,-28r192,0r0,28r-192,0","w":239},"\u00de":{"d":"33,0r0,-255r34,0r0,52r55,0v65,0,82,40,82,72v0,32,-17,71,-82,71r-55,0r0,60r-34,0xm67,-172r0,82v47,-2,100,11,100,-41v0,-52,-53,-39,-100,-41","w":213},"\u00bc":{"d":"242,0r0,-34r-70,0r0,-21r66,-100r28,0r0,97r22,0r0,24r-22,0r0,34r-24,0xm240,-58v-1,-22,2,-47,-1,-67r-41,67r42,0xm55,0r158,-266r21,11r-158,267xm58,-104r0,-129r-31,26r-15,-17r46,-35r26,0r0,155r-26,0","w":300},"\u00f7":{"d":"24,-123r192,0r0,28r-192,0r0,-28xm96,-169v0,-13,11,-24,24,-24v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-11,-24,-24xm96,-48v0,-13,11,-24,24,-24v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-11,-24,-24","w":239},"\u00a6":{"d":"26,-243r28,0r0,126r-28,0r0,-126xm26,-63r28,0r0,126r-28,0r0,-126","w":79},"\u00b0":{"d":"18,-206v0,-30,24,-53,54,-53v30,0,54,23,54,53v0,30,-24,54,-54,54v-30,0,-54,-24,-54,-54xm42,-206v0,17,13,30,30,30v17,0,30,-13,30,-30v0,-17,-13,-29,-30,-29v-17,0,-30,12,-30,29","w":144},"\u00fe":{"d":"24,82r0,-354r33,0r1,126v43,-60,156,-18,146,61v8,78,-100,119,-147,61r0,106r-33,0xm113,-26v35,0,56,-24,56,-59v0,-35,-21,-60,-56,-60v-35,0,-56,25,-56,60v0,35,21,59,56,59","w":219},"\u00be":{"d":"249,0r0,-34r-70,0r0,-21r66,-100r28,0r0,97r23,0r0,24r-23,0r0,34r-24,0xm249,-58r0,-67r-42,67r42,0xm69,0r158,-266r22,11r-158,267xm50,-172r0,-23v19,0,39,-1,39,-21v1,-25,-43,-24,-48,-3r-30,-7v11,-47,105,-44,106,7v0,17,-11,31,-28,35v21,3,32,18,32,37v1,56,-102,60,-113,9r30,-7v4,27,56,24,55,-4v-1,-22,-23,-23,-43,-23","w":300},"\u00b2":{"d":"9,-104r0,-27r65,-58v18,-9,24,-47,-7,-46v-14,0,-24,8,-25,21r-30,-2v0,-56,111,-59,108,0v-2,44,-52,62,-76,88r77,0r0,24r-112,0","w":129},"\u00ae":{"d":"93,-52r0,-153v52,-1,113,-6,113,46v0,27,-16,39,-37,42r40,65r-30,0r-38,-62r-20,0r0,62r-28,0xm121,-181r0,43v25,-1,56,6,56,-22v0,-28,-31,-19,-56,-21xm10,-127v0,-74,60,-134,134,-134v74,0,134,60,134,134v0,74,-60,133,-134,133v-74,0,-134,-59,-134,-133xm34,-127v0,61,49,110,110,110v61,0,110,-49,110,-110v0,-61,-49,-111,-110,-111v-61,0,-110,50,-110,111","w":288},"\u2212":{"d":"24,-123r192,0r0,28r-192,0r0,-28","w":239},"\u00f0":{"d":"152,-272r19,16r-40,19v37,40,67,84,67,140v0,61,-34,101,-91,101v-51,0,-91,-39,-91,-89v0,-69,85,-115,137,-73v-13,-24,-32,-45,-52,-64r-39,18r-17,-16r39,-19r-31,-26r28,-17r32,29xm51,-85v0,35,21,59,56,59v35,0,56,-24,56,-59v0,-35,-21,-60,-56,-60v-35,0,-56,25,-56,60","w":213},"\u00d7":{"d":"24,-33r76,-76r-76,-76r20,-20r76,76r77,-76r19,20r-76,76r76,76r-20,20r-76,-76r-76,76","w":239},"\u00b3":{"d":"50,-172r0,-23v19,0,39,-1,39,-21v1,-25,-43,-24,-48,-3r-30,-7v11,-47,105,-44,106,7v0,17,-11,31,-28,35v21,3,32,18,32,37v1,57,-101,60,-112,9r30,-7v4,26,55,25,54,-4v-1,-22,-22,-23,-43,-23","w":129},"\u00a9":{"d":"10,-127v0,-74,60,-134,134,-134v74,0,134,60,134,134v0,74,-60,133,-134,133v-74,0,-134,-59,-134,-133xm184,-103r28,0v-8,34,-32,57,-67,57v-50,0,-80,-34,-80,-83v0,-49,28,-82,79,-82v36,0,62,19,68,55r-28,0v-5,-18,-16,-29,-40,-29v-34,0,-51,22,-51,56v0,55,81,81,91,26xm34,-127v0,61,49,110,110,110v61,0,110,-49,110,-110v0,-61,-49,-111,-110,-111v-61,0,-110,50,-110,111","w":288},"\u00c1":{"d":"0,0r113,-255r31,0r109,255r-40,0r-26,-63r-121,0r-25,63r-41,0xm78,-93r97,0r-49,-117xm103,-269r37,-52r46,0r-53,52r-30,0","w":253},"\u00c2":{"d":"0,0r113,-255r31,0r109,255r-40,0r-26,-63r-121,0r-25,63r-41,0xm78,-93r97,0r-49,-117xm186,-269r-33,0r-26,-35r-27,35r-33,0r41,-52r38,0","w":253},"\u00c4":{"d":"0,0r113,-255r31,0r109,255r-40,0r-26,-63r-121,0r-25,63r-41,0xm78,-93r97,0r-49,-117xm90,-323v11,0,22,8,22,20v0,13,-9,23,-22,23v-13,0,-22,-10,-22,-23v0,-12,11,-20,22,-20xm141,-303v0,-26,45,-26,45,0v0,13,-10,23,-23,23v-13,0,-22,-10,-22,-23","w":253},"\u00c0":{"d":"0,0r113,-255r31,0r109,255r-40,0r-26,-63r-121,0r-25,63r-41,0xm78,-93r97,0r-49,-117xm113,-321r37,52r-29,0r-54,-52r46,0","w":253},"\u00c5":{"d":"0,0r113,-255r31,0r109,255r-40,0r-26,-63r-121,0r-25,63r-41,0xm78,-93r97,0r-49,-117xm90,-297v0,-20,18,-36,37,-36v20,0,36,16,36,36v0,20,-16,35,-36,35v-19,0,-37,-15,-37,-35xm148,-297v0,-12,-9,-21,-21,-21v-12,0,-22,9,-22,21v0,27,43,25,43,0","w":253},"\u00c3":{"d":"0,0r113,-255r31,0r109,255r-40,0r-26,-63r-121,0r-25,63r-41,0xm78,-93r97,0r-49,-117xm153,-275v-23,0,-59,-31,-69,1r-18,0v3,-19,16,-37,37,-37v24,-1,56,31,67,-1r17,0v-3,18,-13,37,-34,37","w":253},"\u00c7":{"d":"239,-222r-29,22v-53,-65,-156,-11,-156,75v0,54,36,99,95,99v29,0,51,-13,66,-34r29,22v-7,10,-43,46,-101,44r-11,16v22,-1,43,4,43,26v0,40,-52,40,-82,26r6,-15v17,7,46,13,50,-9v0,-26,-33,-4,-41,-19r19,-26v-68,-10,-110,-72,-110,-130v0,-118,147,-182,222,-97","w":253},"\u00c9":{"d":"33,0r0,-255r164,0r0,33r-130,0r0,75r121,0r0,33r-121,0r0,82r137,0r0,32r-171,0xm86,-269r38,-52r46,0r-54,52r-30,0","w":219},"\u00ca":{"d":"33,0r0,-255r164,0r0,33r-130,0r0,75r121,0r0,33r-121,0r0,82r137,0r0,32r-171,0xm170,-269r-33,0r-27,-35r-26,35r-33,0r40,-52r38,0","w":219},"\u00cb":{"d":"33,0r0,-255r164,0r0,33r-130,0r0,75r121,0r0,33r-121,0r0,82r137,0r0,32r-171,0xm51,-303v0,-26,45,-26,45,0v0,13,-10,23,-23,23v-13,0,-22,-10,-22,-23xm125,-303v0,-26,44,-26,44,0v0,13,-9,23,-22,23v-13,0,-22,-10,-22,-23","w":219},"\u00c8":{"d":"33,0r0,-255r164,0r0,33r-130,0r0,75r121,0r0,33r-121,0r0,82r137,0r0,32r-171,0xm96,-321r38,52r-30,0r-54,-52r46,0","w":219},"\u00cd":{"d":"33,0r0,-255r34,0r0,255r-34,0xm26,-269r38,-52r46,0r-54,52r-30,0","w":100},"\u00ce":{"d":"33,0r0,-255r34,0r0,255r-34,0xm109,-269r-32,0r-27,-35r-27,35r-32,0r40,-52r38,0","w":100},"\u00cf":{"d":"33,0r0,-255r34,0r0,255r-34,0xm-9,-303v0,-26,45,-26,45,0v0,13,-10,23,-23,23v-13,0,-22,-10,-22,-23xm64,-303v0,-26,45,-27,45,0v0,13,-9,23,-22,23v-13,0,-23,-10,-23,-23","w":100},"\u00cc":{"d":"33,0r0,-255r34,0r0,255r-34,0xm36,-321r38,52r-30,0r-54,-52r46,0","w":100},"\u00d1":{"d":"33,0r0,-255r45,0r141,210r0,-210r35,0r0,255r-44,0r-143,-210r0,210r-34,0xm170,-275v0,0,-59,-31,-70,1r-17,0v3,-19,15,-37,36,-37v23,-1,57,31,67,-1r18,0v-3,18,-13,37,-34,37","w":286},"\u00d3":{"d":"150,6v-78,0,-133,-57,-133,-133v0,-76,55,-134,133,-134v78,0,133,58,133,134v0,76,-55,133,-133,133xm150,-26v58,0,96,-45,96,-101v0,-56,-38,-102,-96,-102v-58,0,-96,46,-96,102v0,56,38,101,96,101xm126,-269r37,-52r47,0r-54,52r-30,0","w":299},"\u00d4":{"d":"150,6v-78,0,-133,-57,-133,-133v0,-76,55,-134,133,-134v78,0,133,58,133,134v0,76,-55,133,-133,133xm150,-26v58,0,96,-45,96,-101v0,-56,-38,-102,-96,-102v-58,0,-96,46,-96,102v0,56,38,101,96,101xm209,-269r-33,0r-26,-35r-27,35r-33,0r41,-52r38,0","w":299},"\u00d6":{"d":"150,6v-78,0,-133,-57,-133,-133v0,-76,55,-134,133,-134v78,0,133,58,133,134v0,76,-55,133,-133,133xm150,-26v58,0,96,-45,96,-101v0,-56,-38,-102,-96,-102v-58,0,-96,46,-96,102v0,56,38,101,96,101xm91,-303v0,-26,44,-26,44,0v0,13,-9,23,-22,23v-13,0,-22,-10,-22,-23xm164,-303v0,-26,45,-26,45,0v0,13,-10,23,-23,23v-13,0,-22,-10,-22,-23","w":299},"\u00d2":{"d":"150,6v-78,0,-133,-57,-133,-133v0,-76,55,-134,133,-134v78,0,133,58,133,134v0,76,-55,133,-133,133xm150,-26v58,0,96,-45,96,-101v0,-56,-38,-102,-96,-102v-58,0,-96,46,-96,102v0,56,38,101,96,101xm136,-321r38,52r-30,0r-54,-52r46,0","w":299},"\u00d5":{"d":"150,6v-78,0,-133,-57,-133,-133v0,-76,55,-134,133,-134v78,0,133,58,133,134v0,76,-55,133,-133,133xm150,-26v58,0,96,-45,96,-101v0,-56,-38,-102,-96,-102v-58,0,-96,46,-96,102v0,56,38,101,96,101xm176,-275v-23,0,-59,-31,-69,1r-18,0v3,-19,16,-37,37,-37v24,-1,56,31,67,-1r17,0v-3,18,-13,37,-34,37","w":299},"\u0160":{"d":"12,-29r28,-24v23,39,105,38,105,-15v0,-59,-126,-23,-126,-122v0,-30,26,-71,87,-71v28,0,54,6,73,29r-28,25v-9,-13,-25,-22,-45,-22v-38,0,-50,23,-50,39v0,64,126,26,126,118v0,85,-129,102,-170,43xm81,-269r-40,-52r31,0r28,34r27,-34r32,0r-40,52r-38,0"},"\u00da":{"d":"28,-255r35,0r0,156v0,32,16,73,64,73v48,0,64,-41,64,-73r0,-156r34,0r0,162v0,59,-42,99,-98,99v-56,0,-99,-40,-99,-99r0,-162xm103,-269r37,-52r46,0r-53,52r-30,0","w":253},"\u00db":{"d":"28,-255r35,0r0,156v0,32,16,73,64,73v48,0,64,-41,64,-73r0,-156r34,0r0,162v0,59,-42,99,-98,99v-56,0,-99,-40,-99,-99r0,-162xm186,-269r-33,0r-26,-35r-27,35r-33,0r41,-52r38,0","w":253},"\u00dc":{"d":"28,-255r35,0r0,156v0,32,16,73,64,73v48,0,64,-41,64,-73r0,-156r34,0r0,162v0,59,-42,99,-98,99v-56,0,-99,-40,-99,-99r0,-162xm90,-323v11,0,22,8,22,20v0,13,-9,23,-22,23v-13,0,-22,-10,-22,-23v0,-12,11,-20,22,-20xm141,-303v0,-26,45,-26,45,0v0,13,-10,23,-23,23v-13,0,-22,-10,-22,-23","w":253},"\u00d9":{"d":"28,-255r35,0r0,156v0,32,16,73,64,73v48,0,64,-41,64,-73r0,-156r34,0r0,162v0,59,-42,99,-98,99v-56,0,-99,-40,-99,-99r0,-162xm113,-321r37,52r-29,0r-54,-52r46,0","w":253},"\u00dd":{"d":"93,0r0,-109r-97,-146r45,0r69,112r72,-112r42,0r-97,146r0,109r-34,0xm86,-269r38,-52r46,0r-54,52r-30,0","w":220,"k":{"v":20,"A":27,"\u00c6":27,"\u00c1":27,"\u00c2":27,"\u00c4":27,"\u00c0":27,"\u00c5":27,"\u00c3":27,",":50,".":50,"e":40,"\u00e9":40,"\u00ea":40,"\u00eb":40,"\u00e8":40,"o":40,"\u00f8":40,"\u0153":40,"\u00f3":40,"\u00f4":40,"\u00f6":40,"\u00f2":40,"\u00f5":40,"q":33,"-":40,"a":33,"\u00e6":33,"\u00e1":33,"\u00e2":33,"\u00e4":33,"\u00e0":33,"\u00e5":33,"\u00e3":33,"u":27,"\u00fa":27,"\u00fb":27,"\u00fc":27,"\u00f9":27,":":33,";":33,"i":13,"\u00ed":13,"\u00ee":13,"\u00ef":13,"\u00ec":13,"p":27}},"\u0178":{"d":"93,0r0,-109r-97,-146r45,0r69,112r72,-112r42,0r-97,146r0,109r-34,0xm51,-303v0,-26,45,-26,45,0v0,13,-10,23,-23,23v-13,0,-22,-10,-22,-23xm125,-303v0,-26,44,-26,44,0v0,13,-9,23,-22,23v-13,0,-22,-10,-22,-23","w":220,"k":{"v":20,"A":27,"\u00c6":27,"\u00c1":27,"\u00c2":27,"\u00c4":27,"\u00c0":27,"\u00c5":27,"\u00c3":27,",":50,".":50,"e":40,"\u00e9":40,"\u00ea":40,"\u00eb":40,"\u00e8":40,"o":40,"\u00f8":40,"\u0153":40,"\u00f3":40,"\u00f4":40,"\u00f6":40,"\u00f2":40,"\u00f5":40,"q":33,"-":40,"a":33,"\u00e6":33,"\u00e1":33,"\u00e2":33,"\u00e4":33,"\u00e0":33,"\u00e5":33,"\u00e3":33,"u":27,"\u00fa":27,"\u00fb":27,"\u00fc":27,"\u00f9":27,":":33,";":33,"i":13,"\u00ed":13,"\u00ee":13,"\u00ef":13,"\u00ec":13,"p":27}},"\u017d":{"d":"12,0r0,-32r145,-190r-141,0r0,-33r184,0r0,33r-145,190r147,0r0,32r-190,0xm88,-269r-40,-52r31,0r28,34r27,-34r32,0r-40,52r-38,0","w":213},"\u00e1":{"d":"45,-130r-20,-20v37,-44,138,-27,139,32r2,118r-29,0v-2,-8,1,-19,-2,-26v-25,47,-119,39,-119,-21v-1,-52,58,-62,118,-59v11,-49,-70,-52,-89,-24xm134,-82v-37,-1,-84,1,-85,33v0,19,14,27,36,27v40,0,51,-28,49,-60xm70,-203r37,-52r46,0r-53,52r-30,0","w":186},"\u00e2":{"d":"45,-130r-20,-20v37,-44,138,-27,139,32r2,118r-29,0v-2,-8,1,-19,-2,-26v-25,47,-119,39,-119,-21v-1,-52,58,-62,118,-59v11,-49,-70,-52,-89,-24xm134,-82v-37,-1,-84,1,-85,33v0,19,14,27,36,27v40,0,51,-28,49,-60xm153,-203r-33,0r-26,-35r-27,35r-33,0r41,-52r38,0","w":186},"\u00e4":{"d":"45,-130r-20,-20v37,-44,138,-27,139,32r2,118r-29,0v-2,-8,1,-19,-2,-26v-25,47,-119,39,-119,-21v-1,-52,58,-62,118,-59v11,-49,-70,-52,-89,-24xm134,-82v-37,-1,-84,1,-85,33v0,19,14,27,36,27v40,0,51,-28,49,-60xm57,-257v11,0,22,8,22,20v0,13,-9,23,-22,23v-13,0,-22,-10,-22,-23v0,-12,11,-20,22,-20xm108,-237v0,-26,45,-26,45,0v0,13,-10,23,-23,23v-13,0,-22,-10,-22,-23","w":186},"\u00e0":{"d":"45,-130r-20,-20v37,-44,138,-27,139,32r2,118r-29,0v-2,-8,1,-19,-2,-26v-25,47,-119,39,-119,-21v-1,-52,58,-62,118,-59v11,-49,-70,-52,-89,-24xm134,-82v-37,-1,-84,1,-85,33v0,19,14,27,36,27v40,0,51,-28,49,-60xm80,-255r37,52r-30,0r-53,-52r46,0","w":186},"\u00e5":{"d":"45,-130r-20,-20v37,-44,138,-27,139,32r2,118r-29,0v-2,-8,1,-19,-2,-26v-25,47,-119,39,-119,-21v-1,-52,58,-62,118,-59v11,-49,-70,-52,-89,-24xm134,-82v-37,-1,-84,1,-85,33v0,19,14,27,36,27v40,0,51,-28,49,-60xm57,-234v0,-20,18,-36,37,-36v20,0,36,15,36,35v0,20,-16,36,-36,36v-19,0,-37,-15,-37,-35xm115,-234v0,-12,-9,-21,-21,-21v-12,0,-22,9,-22,21v0,27,43,25,43,0","w":186},"\u00e3":{"d":"45,-130r-20,-20v37,-44,138,-27,139,32r2,118r-29,0v-2,-8,1,-19,-2,-26v-25,47,-119,39,-119,-21v-1,-52,58,-62,118,-59v11,-49,-70,-52,-89,-24xm134,-82v-37,-1,-84,1,-85,33v0,19,14,27,36,27v40,0,51,-28,49,-60xm120,-209v-25,1,-60,-31,-70,2r-17,0v3,-19,15,-38,36,-38v25,0,57,33,68,-1r17,0v-3,18,-13,37,-34,37","w":186},"\u00e7":{"d":"171,-148r-24,23v-32,-39,-103,-12,-96,41v-5,51,66,79,96,39r23,23v-16,18,-38,26,-62,26r-13,18v23,-1,44,4,44,26v0,40,-53,39,-83,26r7,-15v17,7,46,13,50,-9v0,-26,-34,-4,-41,-19r19,-28v-45,-5,-75,-40,-75,-88v0,-83,103,-119,155,-63","w":173},"\u00e9":{"d":"186,-73r-137,0v0,51,80,66,104,24r25,18v-44,64,-164,35,-164,-54v0,-51,38,-90,89,-90v64,0,85,48,83,102xm49,-99r102,0v-1,-28,-16,-50,-49,-50v-32,0,-53,27,-53,50xm76,-203r38,-52r46,0r-54,52r-30,0"},"\u00ea":{"d":"186,-73r-137,0v0,51,80,66,104,24r25,18v-44,64,-164,35,-164,-54v0,-51,38,-90,89,-90v64,0,85,48,83,102xm49,-99r102,0v-1,-28,-16,-50,-49,-50v-32,0,-53,27,-53,50xm159,-203r-32,0r-27,-35r-27,35r-32,0r40,-52r38,0"},"\u00eb":{"d":"186,-73r-137,0v0,51,80,66,104,24r25,18v-44,64,-164,35,-164,-54v0,-51,38,-90,89,-90v64,0,85,48,83,102xm49,-99r102,0v-1,-28,-16,-50,-49,-50v-32,0,-53,27,-53,50xm41,-237v0,-26,45,-26,45,0v0,13,-10,23,-23,23v-13,0,-22,-10,-22,-23xm114,-237v0,-26,45,-27,45,0v0,13,-9,23,-22,23v-13,0,-23,-10,-23,-23"},"\u00e8":{"d":"186,-73r-137,0v0,51,80,66,104,24r25,18v-44,64,-164,35,-164,-54v0,-51,38,-90,89,-90v64,0,85,48,83,102xm49,-99r102,0v-1,-28,-16,-50,-49,-50v-32,0,-53,27,-53,50xm86,-255r38,52r-30,0r-54,-52r46,0"},"\u00ed":{"d":"27,0r0,-171r32,0r0,171r-32,0xm19,-203r38,-52r46,0r-54,52r-30,0","w":86},"\u00ee":{"d":"27,0r0,-171r32,0r0,171r-32,0xm103,-203r-33,0r-27,-35r-26,35r-33,0r40,-52r38,0","w":86},"\u00ef":{"d":"27,0r0,-171r32,0r0,171r-32,0xm-16,-237v0,-26,45,-26,45,0v0,13,-10,23,-23,23v-13,0,-22,-10,-22,-23xm80,-257v11,0,22,8,22,20v0,13,-9,23,-22,23v-13,0,-22,-10,-22,-23v0,-12,11,-20,22,-20","w":86},"\u00ec":{"d":"27,0r0,-171r32,0r0,171r-32,0xm30,-255r37,52r-30,0r-54,-52r47,0","w":86},"\u00f1":{"d":"24,0r0,-171r33,0v1,8,-2,21,1,27v23,-48,118,-42,118,34r0,110r-33,0v-3,-54,17,-145,-39,-145v-27,0,-47,17,-47,57r0,88r-33,0xm127,-209v-25,1,-60,-31,-70,2r-17,0v3,-19,15,-38,36,-38v24,0,57,33,67,-1r18,0v-3,18,-13,37,-34,37"},"\u00f3":{"d":"51,-85v0,35,21,59,56,59v35,0,56,-24,56,-59v0,-35,-21,-60,-56,-60v-35,0,-56,25,-56,60xm16,-85v0,-50,40,-90,91,-90v51,0,91,40,91,90v0,50,-40,89,-91,89v-51,0,-91,-39,-91,-89xm83,-203r38,-52r46,0r-54,52r-30,0","w":213},"\u00f4":{"d":"51,-85v0,35,21,59,56,59v35,0,56,-24,56,-59v0,-35,-21,-60,-56,-60v-35,0,-56,25,-56,60xm16,-85v0,-50,40,-90,91,-90v51,0,91,40,91,90v0,50,-40,89,-91,89v-51,0,-91,-39,-91,-89xm166,-203r-32,0r-27,-35r-27,35r-32,0r40,-52r38,0","w":213},"\u00f6":{"d":"51,-85v0,35,21,59,56,59v35,0,56,-24,56,-59v0,-35,-21,-60,-56,-60v-35,0,-56,25,-56,60xm16,-85v0,-50,40,-90,91,-90v51,0,91,40,91,90v0,50,-40,89,-91,89v-51,0,-91,-39,-91,-89xm48,-237v0,-26,45,-26,45,0v0,13,-10,23,-23,23v-13,0,-22,-10,-22,-23xm121,-237v0,-26,45,-27,45,0v0,13,-9,23,-22,23v-13,0,-23,-10,-23,-23","w":213},"\u00f2":{"d":"51,-85v0,35,21,59,56,59v35,0,56,-24,56,-59v0,-35,-21,-60,-56,-60v-35,0,-56,25,-56,60xm16,-85v0,-50,40,-90,91,-90v51,0,91,40,91,90v0,50,-40,89,-91,89v-51,0,-91,-39,-91,-89xm93,-255r38,52r-30,0r-54,-52r46,0","w":213},"\u00f5":{"d":"51,-85v0,35,21,59,56,59v35,0,56,-24,56,-59v0,-35,-21,-60,-56,-60v-35,0,-56,25,-56,60xm16,-85v0,-50,40,-90,91,-90v51,0,91,40,91,90v0,50,-40,89,-91,89v-51,0,-91,-39,-91,-89xm134,-209v-25,0,-59,-31,-70,2r-18,0v3,-19,16,-38,37,-38v24,-1,56,33,67,-1r17,0v-3,18,-12,37,-33,37","w":213},"\u0161":{"d":"140,-147r-25,19v-10,-19,-63,-26,-63,2v0,21,29,24,43,27v28,7,50,18,50,50v0,66,-105,69,-135,23r25,-20v12,22,76,31,76,-2v0,-19,-28,-23,-42,-26v-28,-7,-52,-15,-52,-48v1,-61,96,-70,123,-25xm61,-203r-40,-52r31,0r28,35r27,-35r32,0r-40,52r-38,0","w":159},"\u00fa":{"d":"176,-171r0,171r-33,0r0,-26v-24,47,-119,41,-119,-35r0,-110r33,0v3,54,-17,145,39,145v27,0,47,-17,47,-57r0,-88r33,0xm76,-203r38,-52r46,0r-54,52r-30,0"},"\u00fb":{"d":"176,-171r0,171r-33,0r0,-26v-24,47,-119,41,-119,-35r0,-110r33,0v3,54,-17,145,39,145v27,0,47,-17,47,-57r0,-88r33,0xm159,-203r-32,0r-27,-35r-27,35r-32,0r40,-52r38,0"},"\u00fc":{"d":"176,-171r0,171r-33,0r0,-26v-24,47,-119,41,-119,-35r0,-110r33,0v3,54,-17,145,39,145v27,0,47,-17,47,-57r0,-88r33,0xm41,-237v0,-26,45,-26,45,0v0,13,-10,23,-23,23v-13,0,-22,-10,-22,-23xm114,-237v0,-26,45,-27,45,0v0,13,-9,23,-22,23v-13,0,-23,-10,-23,-23"},"\u00f9":{"d":"176,-171r0,171r-33,0r0,-26v-24,47,-119,41,-119,-35r0,-110r33,0v3,54,-17,145,39,145v27,0,47,-17,47,-57r0,-88r33,0xm86,-255r38,52r-30,0r-54,-52r46,0"},"\u00fd":{"d":"75,1r-71,-172r37,0r52,134r48,-134r35,0r-81,208v-11,40,-41,58,-87,45r4,-30v41,18,53,-22,63,-51xm66,-203r38,-52r46,0r-54,52r-30,0","w":180,"k":{",":27,".":27}},"\u00ff":{"d":"75,1r-71,-172r37,0r52,134r48,-134r35,0r-81,208v-11,40,-41,58,-87,45r4,-30v41,18,53,-22,63,-51xm31,-237v0,-26,45,-26,45,0v0,13,-10,23,-23,23v-13,0,-22,-10,-22,-23xm104,-237v0,-26,45,-27,45,0v0,13,-9,23,-22,23v-13,0,-23,-10,-23,-23","w":180,"k":{",":27,".":27}},"\u017e":{"d":"13,0r0,-29r96,-114r-93,0r0,-28r133,0r0,29r-98,114r103,0r0,28r-141,0xm64,-203r-40,-52r31,0r29,35r26,-35r33,0r-40,52r-39,0","w":166},"\u2206":{"d":"11,0r0,-21r88,-239r37,0r86,239r0,21r-211,0xm43,-26r146,0r-73,-199","w":233},"\u2126":{"d":"17,-26v17,-1,37,2,52,-1v-25,-23,-47,-61,-47,-111v0,-70,46,-120,108,-120v66,0,105,58,105,119v1,52,-25,90,-48,113r53,0r0,26r-88,0r0,-19v26,-17,52,-56,52,-114v0,-47,-25,-98,-74,-98v-46,0,-77,43,-77,99v0,54,26,96,52,113r0,19r-88,0r0,-26","w":257},"\u03bc":{"d":"24,82r0,-253r33,0v3,54,-17,145,39,145v27,0,47,-17,47,-57r0,-88r33,0r0,171r-33,0r0,-26v-10,25,-55,38,-86,24r0,84r-33,0"},"\u03c0":{"d":"198,-162r-28,0v1,48,-4,127,5,162r-30,0v-11,-31,-4,-116,-6,-162r-62,0v-2,45,-13,127,-26,162r-30,0v13,-40,24,-115,25,-162v-21,0,-30,1,-38,4r-5,-21v41,-19,137,-7,198,-10","w":207},"\u20ac":{"d":"181,-219r8,-27v-64,-31,-138,-6,-152,72r-21,0r-7,24r23,0v0,15,-2,30,0,44r-17,0r-7,23r26,0v3,87,107,113,154,57r-17,-18v-31,40,-105,23,-105,-39r78,0r6,-23r-87,0r1,-44r98,0r6,-24r-99,0v11,-58,69,-69,112,-45"},"\u2113":{"d":"155,-57r14,13v-17,32,-41,47,-69,47v-44,-1,-61,-32,-61,-71v-6,5,-13,12,-20,17r-9,-18v10,-9,20,-16,29,-25r0,-98v0,-66,28,-88,57,-88v31,0,46,27,46,60v0,45,-29,88,-73,132v-3,39,14,66,38,66v22,0,39,-19,48,-35xm97,-257v-33,0,-28,93,-28,139v30,-33,52,-68,52,-102v0,-22,-6,-37,-24,-37","w":177},"\u212e":{"d":"66,-50v36,64,146,59,187,3r21,0v-26,31,-69,51,-116,51v-81,0,-146,-58,-146,-131v0,-73,65,-132,146,-132v82,1,148,59,147,135r-239,2r0,72xm251,-205v-33,-61,-139,-58,-182,-8v-6,21,-4,60,-1,82r183,-2r0,-72","w":317},"\u2202":{"d":"37,-242r-10,-23v69,-46,154,-9,154,117v0,87,-34,151,-96,151v-48,0,-70,-44,-70,-85v0,-57,36,-93,77,-93v32,0,52,23,58,33v4,-65,-24,-119,-65,-118v-22,0,-38,10,-48,18xm46,-81v0,33,16,58,43,58v32,0,54,-44,58,-89v-5,-15,-23,-38,-50,-38v-28,0,-51,32,-51,69","w":198},"\u220f":{"d":"244,-225r-39,0r0,260r-31,0r0,-260r-96,0r0,260r-30,0r0,-260r-39,0r0,-29r235,0r0,29","w":253},"\u2211":{"d":"192,35r-184,0r0,-21r95,-123r-91,-123r0,-22r174,0r0,27r-131,1r83,112r-90,120r144,0r0,29","w":199},"\u2219":{"d":"26,-109v0,-13,11,-24,24,-24v13,0,24,11,24,24v0,13,-11,24,-24,24v-13,0,-24,-11,-24,-24","w":100},"\u221a":{"d":"208,-302r-80,356r-26,0r-57,-167r-27,10r-6,-18r52,-21r51,159r71,-319r22,0","w":207},"\u221e":{"d":"262,-105v0,36,-26,59,-55,59v-22,0,-41,-13,-66,-43v-19,22,-38,43,-68,43v-30,0,-55,-25,-55,-58v0,-34,24,-58,57,-58v27,0,48,19,67,42v18,-20,36,-42,67,-42v31,0,53,24,53,57xm38,-103v0,21,15,37,38,37v23,0,39,-21,54,-37v-16,-20,-32,-41,-57,-41v-23,0,-35,19,-35,41xm207,-144v-24,0,-43,26,-55,39v23,27,37,39,56,39v22,0,35,-20,35,-38v0,-25,-15,-40,-36,-40","w":280},"\u222b":{"d":"50,-218v0,-66,22,-104,76,-88r-5,22v-35,-13,-43,21,-43,69v0,57,5,121,5,181v0,70,-21,104,-78,88r5,-23v36,11,46,-12,45,-65v0,-61,-5,-126,-5,-184","w":132},"\u2248":{"d":"66,-158v33,1,46,26,73,27v15,0,24,-10,34,-27r12,11v-10,20,-24,35,-46,35v-24,0,-49,-26,-75,-27v-17,0,-27,12,-36,26r-12,-10v11,-21,29,-35,50,-35xm66,-96v44,0,81,56,107,1r12,11v-10,19,-24,35,-46,35v-25,0,-50,-27,-75,-28v-17,0,-27,13,-36,27r-12,-10v11,-21,29,-36,50,-36","w":201},"\u2260":{"d":"144,-183r-15,34r55,0r0,20r-63,0r-24,52r87,0r0,19r-94,0r-19,43r-16,-7r16,-36r-53,0r0,-19r61,0r23,-52r-84,0r0,-20r92,0r19,-41","w":201},"\u2264":{"d":"183,-35r-163,-82r0,-21r163,-81r0,24r-142,68r142,68r0,24xm184,-1r-166,0r0,-20r166,0r0,20","w":201},"\u2265":{"d":"21,-219r162,81r0,21r-162,82r0,-24r141,-68r-141,-68r0,-24xm183,-1r-164,0r0,-20r164,0r0,20","w":201},"\u25ca":{"d":"188,-127r-72,144r-25,0r-72,-144r73,-143r25,0xm160,-126r-57,-118v-14,42,-37,78,-55,117v18,39,41,75,55,118","w":207},"\u00a0":{"w":100},"\u00ad":{"d":"101,-102r0,30r-88,0r0,-30r88,0","w":113},"\u02c9":{"d":"95,-240r0,24r-104,0r0,-24r104,0","w":86},"\u03a9":{"d":"17,-26v17,-1,37,2,52,-1v-25,-23,-47,-61,-47,-111v0,-70,46,-120,108,-120v66,0,105,58,105,119v1,52,-25,90,-48,113r53,0r0,26r-88,0r0,-19v26,-17,52,-56,52,-114v0,-47,-25,-98,-74,-98v-46,0,-77,43,-77,99v0,54,26,96,52,113r0,19r-88,0r0,-26","w":257},"\u2215":{"d":"120,-255r-158,267r-22,-12r158,-266","w":60}}});
Cufon.registerFont({"w":213,"face":{"font-family":"Avenir Heavy","font-weight":700,"font-stretch":"normal","units-per-em":"360","panose-1":"2 11 7 3 2 2 3 2 2 4","ascent":"272","descent":"-88","x-height":"4","bbox":"-60 -338 418 90","underline-thickness":"18","underline-position":"-18","stemh":"37","stemv":"43","unicode-range":"U+0020-U+FB02"},"glyphs":{" ":{"w":106},"\ufb01":{"d":"40,0r0,-136r-36,0r0,-37r36,0v-1,-58,0,-104,64,-103v9,0,19,0,28,2r-3,37v-41,-13,-52,19,-46,64r40,0r0,37r-40,0r0,136r-43,0xm151,0r0,-173r43,0r0,173r-43,0xm145,-231v0,-14,12,-26,28,-26v16,0,28,11,28,26v0,15,-12,25,-28,25v-16,0,-28,-11,-28,-25","k":{"\u2019":-6,"f":6,"\ufb01":6,"\ufb02":6,"\u00df":6}},"\ufb02":{"d":"40,0r0,-136r-36,0r0,-37r36,0v-1,-58,0,-104,64,-103v9,0,19,0,28,2r-3,37v-41,-13,-52,19,-46,64r40,0r0,37r-40,0r0,136r-43,0xm151,0r0,-272r43,0r0,272r-43,0","k":{"\u2019":-6,"f":6,"\ufb01":6,"\ufb02":6,"\u00df":6}},"!":{"d":"75,-255r0,175r-43,0r0,-175r43,0xm24,-25v0,-15,13,-28,29,-28v15,0,29,12,29,27v0,15,-13,28,-29,28v-15,0,-29,-12,-29,-27","w":106},"\"":{"d":"43,-160r0,-95r37,0r0,95r-37,0xm107,-160r0,-95r37,0r0,95r-37,0","w":186},"#":{"d":"39,0r10,-75r-32,0r0,-30r36,0r7,-44r-33,0r0,-31r37,0r11,-75r31,0r-11,75r37,0r11,-75r32,0r-11,75r32,0r0,31r-37,0r-6,44r33,0r0,30r-36,0r-11,75r-32,0r11,-75r-37,0r-11,75r-31,0xm128,-149r-37,0r-6,44r37,0"},"jQuery":{"d":"114,-283r0,24v28,-1,54,8,74,25r-30,33v-11,-12,-27,-19,-44,-19v2,23,-4,53,2,72v40,11,81,24,81,73v0,48,-37,74,-83,79r0,26r-19,0r0,-26v-31,0,-62,-9,-84,-32r33,-33v12,16,31,24,51,26v-2,-24,4,-56,-2,-76v-40,-11,-76,-26,-76,-74v0,-43,38,-70,78,-74r0,-24r19,0xm95,-154r0,-66v-17,3,-32,15,-32,33v0,22,15,25,32,33xm114,-105r0,70v20,-4,38,-16,38,-37v0,-21,-21,-27,-38,-33"},"%":{"d":"182,-63v0,-37,30,-67,67,-67v37,0,67,30,67,67v0,37,-30,67,-67,67v-37,0,-67,-30,-67,-67xm281,-63v0,-18,-14,-32,-32,-32v-18,0,-33,14,-33,32v0,18,15,33,33,33v18,0,32,-15,32,-33xm11,-192v0,-37,30,-67,67,-67v37,0,67,30,67,67v0,37,-30,67,-67,67v-37,0,-67,-30,-67,-67xm110,-192v0,-18,-14,-33,-32,-33v-18,0,-33,15,-33,33v0,18,15,32,33,32v18,0,32,-14,32,-32xm74,-2r150,-264r29,13r-149,265","w":326},"&":{"d":"258,-134r-51,74r55,60r-56,0r-27,-29v-41,58,-161,43,-162,-39v0,-34,24,-60,55,-72v-16,-18,-29,-34,-29,-59v0,-42,34,-62,73,-62v38,0,72,18,72,60v0,31,-25,53,-50,66r41,44r28,-43r51,0xm117,-222v-43,1,-33,46,-6,62v29,-7,53,-59,6,-62xm152,-58r-52,-56v-17,10,-35,21,-35,43v0,22,18,39,40,39v20,0,34,-13,47,-26","w":266},"\u2019":{"d":"19,-160r25,-95r44,0r-31,95r-38,0","w":106,"k":{"\u2019":32,"s":27,"\u0161":27,"t":6}},"(":{"d":"70,-264v9,8,23,11,30,21v-61,80,-60,199,0,279r-30,20v-69,-89,-70,-231,0,-320","w":106},")":{"d":"37,56v-10,-7,-22,-12,-31,-20v61,-81,62,-199,0,-279r31,-21v68,89,69,231,0,320","w":106},"*":{"d":"99,-255r0,51r48,-16r10,29r-49,16r31,42r-25,18r-31,-42r-30,41r-25,-18r31,-41r-49,-17r9,-29r49,17r0,-51r31,0","w":166},"+":{"d":"22,-127r80,0r0,-80r36,0r0,80r79,0r0,36r-79,0r0,79r-36,0r0,-79r-80,0r0,-36","w":239},",":{"d":"14,45r25,-95r44,0r-31,95r-38,0","w":106},"-":{"d":"101,-107r0,37r-89,0r0,-37r89,0","w":113},".":{"d":"24,-25v0,-15,13,-28,29,-28v15,0,29,12,29,27v0,15,-13,28,-29,28v-15,0,-29,-12,-29,-27","w":106},"\/":{"d":"139,-261r-112,278r-30,-11r112,-279","w":140},"0":{"d":"14,-127v0,-121,65,-132,93,-132v28,0,92,11,92,132v0,121,-64,131,-92,131v-28,0,-93,-10,-93,-131xm58,-127v0,32,6,90,49,90v43,0,49,-58,49,-90v0,-32,-6,-91,-49,-91v-43,0,-49,59,-49,91"},"1":{"d":"96,0r0,-205r-47,44r-26,-30r77,-64r40,0r0,255r-44,0"},"2":{"d":"21,0r0,-46r99,-95v12,-12,27,-26,27,-44v-2,-45,-75,-42,-77,1r-45,-3v4,-47,38,-72,84,-72v46,0,83,23,83,72v0,32,-16,54,-39,75r-79,73r118,0r0,39r-171,0"},"3":{"d":"80,-113r0,-39v31,0,60,0,61,-35v0,-40,-67,-44,-75,-5r-45,-12v18,-79,163,-72,163,13v1,28,-19,49,-44,58v32,5,50,31,50,62v1,93,-156,101,-173,16r46,-13v5,47,86,41,84,-7v-1,-37,-35,-39,-67,-38"},"4":{"d":"121,0r0,-52r-109,0r0,-43r103,-160r49,0r0,164r37,0r0,39r-37,0r0,52r-43,0xm121,-91r-1,-103r-64,103r65,0"},"5":{"d":"182,-255r0,39r-103,0r-1,51v61,-14,112,21,112,81v0,100,-152,121,-174,30r45,-12v9,43,86,35,86,-14v0,-58,-74,-59,-113,-37r3,-138r145,0"},"6":{"d":"105,-255r52,0v-19,32,-45,64,-60,95v54,-18,100,25,100,77v0,53,-38,87,-90,87v-86,0,-108,-92,-67,-156xm61,-83v0,26,21,46,47,46v26,0,46,-20,46,-46v0,-26,-20,-47,-46,-47v-26,0,-47,21,-47,47"},"7":{"d":"15,-214r0,-41r173,0r0,40r-102,215r-50,0r104,-214r-125,0"},"8":{"d":"107,-259v43,0,78,24,78,67v1,28,-15,48,-39,58v24,5,47,31,47,62v0,50,-38,76,-86,76v-48,0,-86,-26,-86,-76v-1,-32,24,-56,46,-63v-26,-8,-39,-30,-39,-57v0,-43,36,-67,79,-67xm107,-222v-22,0,-35,15,-35,34v0,20,14,36,35,36v19,0,34,-16,34,-36v0,-19,-14,-34,-34,-34xm107,-118v-23,0,-43,17,-43,40v0,24,18,41,43,41v25,0,42,-17,42,-41v0,-23,-19,-40,-42,-40"},"9":{"d":"108,0r-52,0v19,-32,45,-64,60,-95v-53,17,-100,-26,-100,-77v0,-53,39,-87,91,-87v84,0,108,93,67,156xm152,-172v0,-26,-21,-46,-47,-46v-26,0,-46,20,-46,46v0,26,20,47,46,47v26,0,47,-21,47,-47"},":":{"d":"24,-25v0,-15,13,-28,29,-28v15,0,29,12,29,27v0,15,-13,28,-29,28v-15,0,-29,-12,-29,-27xm24,-147v0,-15,13,-28,29,-28v15,0,29,12,29,27v0,15,-13,28,-29,28v-15,0,-29,-12,-29,-27","w":106},";":{"d":"14,45r25,-95r44,0r-31,95r-38,0xm24,-147v0,-15,13,-28,29,-28v15,0,29,12,29,27v0,15,-13,28,-29,28v-15,0,-29,-12,-29,-27","w":106},"<":{"d":"211,-15r-182,-81r0,-26r182,-81r0,40r-122,54r122,54r0,40","w":239},"=":{"d":"22,-160r195,0r0,37r-195,0r0,-37xm22,-95r195,0r0,37r-195,0r0,-37","w":239},">":{"d":"29,-203r182,81r0,26r-182,81r0,-40r121,-54r-121,-54r0,-40","w":239},"?":{"d":"177,-191v0,53,-65,57,-58,116r-43,0v-12,-64,56,-64,56,-114v0,-19,-14,-31,-33,-31v-20,0,-34,16,-36,35r-46,-4v0,-91,160,-99,160,-2xm68,-25v0,-15,13,-28,29,-28v15,0,29,12,29,27v0,15,-13,28,-29,28v-15,0,-29,-12,-29,-27","w":186},"@":{"d":"144,-164v-24,0,-38,19,-38,43v0,8,0,34,30,34v44,1,48,-76,8,-77xm222,-48r40,0v-68,99,-250,52,-250,-79v0,-77,61,-134,137,-134v63,0,127,42,127,118v0,77,-57,88,-79,88v-21,1,-27,-13,-30,-20v-27,36,-105,20,-98,-41v-8,-59,75,-111,112,-60r3,-16r34,0r-17,91v0,9,2,14,10,14v15,0,31,-17,31,-54v0,-58,-39,-88,-94,-88v-60,0,-100,43,-100,102v0,91,110,128,174,79","w":288},"A":{"d":"0,0r111,-255r39,0r110,255r-52,0r-24,-58r-110,0r-23,58r-51,0xm89,-97r79,0r-39,-104","w":259},"B":{"d":"28,0r0,-255v79,2,175,-18,178,64v1,30,-20,47,-44,57v32,4,55,28,55,61v0,88,-103,72,-189,73xm74,-216r0,65v38,2,90,1,87,-32v4,-34,-48,-35,-87,-33xm74,-112r0,73v44,-2,92,11,97,-37v5,-41,-54,-36,-97,-36","w":233},"C":{"d":"239,-221r-36,26v-53,-59,-141,-6,-141,66v0,80,97,130,145,63r37,27v-69,91,-229,36,-229,-87v0,-121,149,-181,224,-95","w":246},"D":{"d":"28,0r0,-255r101,0v67,0,129,42,129,128v0,125,-108,134,-230,127xm74,-41v76,4,137,-11,137,-86v0,-78,-59,-92,-137,-87r0,173","w":273},"E":{"d":"28,0r0,-255r169,0r0,41r-123,0r0,63r117,0r0,41r-117,0r0,69r130,0r0,41r-176,0","w":219},"F":{"d":"28,0r0,-255r165,0r0,41r-119,0r0,67r112,0r0,41r-112,0r0,106r-46,0","w":206,"k":{"A":20,"\u00c6":20,"\u00c1":20,"\u00c2":20,"\u00c4":20,"\u00c0":20,"\u00c5":20,"\u00c3":20,",":46,".":46}},"G":{"d":"255,-149r0,130v-31,17,-67,25,-106,25v-78,0,-134,-52,-134,-132v0,-125,149,-173,235,-103r-34,34v-52,-53,-154,-15,-154,66v0,79,82,116,148,81r0,-60r-53,0r0,-41r98,0","w":280},"H":{"d":"28,0r0,-255r46,0r0,102r119,0r0,-102r45,0r0,255r-45,0r0,-112r-119,0r0,112r-46,0","w":266},"I":{"d":"27,0r0,-255r46,0r0,255r-46,0","w":100},"J":{"d":"153,-255r0,184v0,41,-25,77,-76,77v-40,0,-67,-18,-75,-58r42,-10v3,17,15,27,31,27v26,0,33,-18,33,-49r0,-171r45,0","w":180},"K":{"d":"28,0r0,-255r46,0v2,35,-4,77,2,108r105,-108r62,0r-120,118r128,137r-64,0r-111,-125r-2,0r0,125r-46,0","w":246},"L":{"d":"28,0r0,-255r46,0r0,214r108,0r0,41r-154,0","w":186,"k":{"T":33,"V":33,"W":20,"y":13,"\u00fd":13,"\u00ff":13,"Y":40,"\u00dd":40,"\u0178":40,"\u2019":79}},"M":{"d":"30,0r0,-255r69,0r68,179r68,-179r69,0r0,255r-43,0r-1,-212r-77,212r-32,0r-78,-212r0,212r-43,0","w":333},"N":{"d":"28,0r0,-255r61,0r124,189r0,-189r45,0r0,255r-57,0r-127,-195r0,195r-46,0","w":286},"O":{"d":"15,-126v0,-82,56,-135,134,-135v80,0,136,51,136,133v0,80,-56,134,-136,134v-78,0,-134,-52,-134,-132xm62,-129v0,54,35,94,88,94v53,0,88,-40,88,-94v0,-51,-35,-91,-88,-91v-53,0,-88,40,-88,91","w":299},"P":{"d":"28,0r0,-255v84,1,180,-15,180,74v0,76,-64,77,-134,76r0,105r-46,0xm74,-144v39,-1,87,9,87,-36v0,-42,-47,-35,-87,-36r0,72","w":219,"k":{"A":27,"\u00c6":27,"\u00c1":27,"\u00c2":27,"\u00c4":27,"\u00c0":27,"\u00c5":27,"\u00c3":27,",":61,".":61}},"Q":{"d":"302,-37r0,37r-148,0v-79,0,-139,-50,-139,-133v0,-75,61,-128,134,-128v73,0,134,53,134,128v0,53,-30,82,-54,96r73,0xm148,-220v-49,0,-86,37,-86,88v0,52,36,91,86,91v50,0,87,-39,87,-91v0,-51,-36,-88,-87,-88","w":306},"R":{"d":"28,0r0,-255v85,2,182,-17,184,73v0,37,-21,64,-59,69r68,113r-55,0r-59,-108r-33,0r0,108r-46,0xm74,-147v41,-2,91,10,91,-35v0,-44,-51,-32,-91,-34r0,69","w":226,"k":{"T":6,"Y":13,"\u00dd":13,"\u0178":13}},"S":{"d":"186,-235r-33,35v-18,-28,-86,-30,-86,12v0,51,121,22,121,113v0,91,-128,104,-177,47r34,-33v19,34,95,38,95,-8v0,-56,-121,-24,-121,-115v1,-82,116,-99,167,-51","w":206},"T":{"d":"81,0r0,-214r-78,0r0,-41r201,0r0,41r-78,0r0,214r-45,0","w":206,"k":{"\u00fc":33,"\u0161":40,"\u00f2":40,"\u00f6":40,"\u00e8":40,"\u00eb":40,"\u00ea":40,"\u00e3":36,"\u00e5":36,"\u00e0":36,"\u00e4":36,"\u00e2":36,"w":40,"y":40,"\u00fd":40,"\u00ff":40,"A":33,"\u00c6":33,"\u00c1":33,"\u00c2":33,"\u00c4":33,"\u00c0":33,"\u00c5":33,"\u00c3":33,",":40,".":40,"c":40,"\u00e7":40,"e":40,"\u00e9":40,"o":40,"\u00f8":40,"\u0153":40,"\u00f3":40,"\u00f4":40,"\u00f5":40,"-":46,"a":36,"\u00e6":36,"\u00e1":36,"r":33,"s":40,"u":33,"\u00fa":33,"\u00fb":33,"\u00f9":33,":":30,";":30}},"U":{"d":"233,-255r0,161v0,62,-45,100,-103,100v-58,0,-103,-38,-103,-100r0,-161r46,0r0,160v0,25,13,58,57,58v44,0,57,-33,57,-58r0,-160r46,0","w":259},"V":{"d":"99,0r-100,-255r52,0r70,193r71,-193r49,0r-103,255r-39,0","w":240,"k":{"\u00f6":20,"\u00f4":20,"\u00e8":20,"\u00eb":20,"\u00ea":20,"\u00e3":20,"\u00e5":20,"\u00e0":20,"\u00e4":20,"\u00e2":20,"y":6,"\u00fd":6,"\u00ff":6,"A":20,"\u00c6":20,"\u00c1":20,"\u00c2":20,"\u00c4":20,"\u00c0":20,"\u00c5":20,"\u00c3":20,",":46,".":46,"e":20,"\u00e9":20,"o":20,"\u00f8":20,"\u0153":20,"\u00f3":20,"\u00f2":20,"\u00f5":20,"-":20,"a":20,"\u00e6":20,"\u00e1":20,"r":13,"u":13,"\u00fa":13,"\u00fb":13,"\u00fc":13,"\u00f9":13,":":17,";":17,"i":-4,"\u00ed":-4,"\u00ee":-4,"\u00ef":-4,"\u00ec":-4}},"W":{"d":"75,0r-75,-255r50,0r48,184r58,-184r44,0r57,184r50,-184r46,0r-74,255r-43,0r-60,-194r-59,194r-42,0","w":353,"k":{"\u00fc":6,"\u00f6":6,"\u00ea":6,"\u00e4":13,"A":9,"\u00c6":9,"\u00c1":9,"\u00c2":9,"\u00c4":9,"\u00c0":9,"\u00c5":9,"\u00c3":9,",":27,".":27,"e":6,"\u00e9":6,"\u00eb":6,"\u00e8":6,"o":6,"\u00f8":6,"\u0153":6,"\u00f3":6,"\u00f4":6,"\u00f2":6,"\u00f5":6,"-":10,"a":13,"\u00e6":13,"\u00e1":13,"\u00e2":13,"\u00e0":13,"\u00e5":13,"\u00e3":13,"r":6,"u":6,"\u00fa":6,"\u00fb":6,"\u00f9":6,":":6,";":6}},"X":{"d":"0,0r91,-133r-85,-122r57,0r60,94r60,-94r55,0r-84,122r93,133r-58,0r-67,-108r-67,108r-55,0","w":246},"Y":{"d":"91,0r0,-109r-96,-146r57,0r62,102r64,-102r54,0r-96,146r0,109r-45,0","w":226,"k":{"\u00fc":31,"\u00f6":33,"v":20,"A":27,"\u00c6":27,"\u00c1":27,"\u00c2":27,"\u00c4":27,"\u00c0":27,"\u00c5":27,"\u00c3":27,",":40,".":40,"e":33,"\u00e9":33,"\u00ea":33,"\u00eb":33,"\u00e8":33,"o":33,"\u00f8":33,"\u0153":33,"\u00f3":33,"\u00f4":33,"\u00f2":33,"\u00f5":33,"q":33,"-":40,"a":33,"\u00e6":33,"\u00e1":33,"\u00e2":33,"\u00e4":33,"\u00e0":33,"\u00e5":33,"\u00e3":33,"u":31,"\u00fa":31,"\u00fb":31,"\u00f9":31,":":33,";":33,"i":3,"\u00ed":3,"\u00ee":3,"\u00ef":3,"\u00ec":3,"p":31}},"Z":{"d":"13,0r0,-41r136,-173r-134,0r0,-41r190,0r0,41r-137,173r139,0r0,41r-194,0","w":219},"[":{"d":"93,-264r0,29r-33,0r0,263r33,0r0,28r-69,0r0,-320r69,0","w":100},"\\":{"d":"1,-261r30,-12r112,279r-30,11","w":140},"]":{"d":"7,56r0,-28r33,0r0,-263r-33,0r0,-29r69,0r0,320r-69,0","w":100},"^":{"d":"67,-123r-42,0r80,-132r30,0r80,132r-43,0r-52,-87","w":239},"_":{"d":"180,45r-180,0r0,-18r180,0r0,18","w":180},"\u2018":{"d":"88,-255r-25,95r-44,0r30,-95r39,0","w":106,"k":{"\u2018":32}},"a":{"d":"132,0v-1,-7,2,-18,-1,-24v-25,45,-118,35,-118,-24v0,-59,70,-60,119,-60v4,-46,-63,-44,-85,-19r-23,-22v19,-19,47,-28,74,-28v74,0,73,54,73,78r0,99r-39,0xm86,-28v33,-1,46,-18,44,-49v-28,0,-74,-2,-74,26v0,16,16,23,30,23","w":193},"b":{"d":"24,0r0,-272r44,0r1,121v9,-11,26,-26,58,-26v49,0,84,40,84,91v0,79,-101,123,-145,60r0,26r-42,0xm168,-86v0,-27,-19,-52,-51,-52v-32,0,-51,25,-51,52v0,27,19,51,51,51v32,0,51,-24,51,-51","w":226},"c":{"d":"172,-151r-29,30v-28,-36,-88,-7,-84,35v-5,41,57,70,84,35r29,31v-60,53,-156,13,-156,-66v0,-80,102,-121,156,-65","w":173},"d":{"d":"161,0r0,-26v-43,63,-145,19,-145,-60v0,-51,34,-91,83,-91v33,0,49,16,60,26r0,-121r43,0r0,272r-41,0xm59,-86v0,27,19,51,51,51v32,0,51,-24,51,-51v0,-27,-19,-52,-51,-52v-32,0,-51,25,-51,52","w":226},"e":{"d":"191,-71r-132,0v3,50,73,51,93,17r31,24v-51,66,-167,30,-167,-56v0,-54,42,-91,94,-91v52,-1,85,40,81,106xm59,-104r89,0v0,-25,-17,-41,-44,-41v-26,0,-42,16,-45,41","w":206},"f":{"d":"40,0r0,-136r-36,0r0,-37r36,0v-1,-58,0,-104,64,-103v9,0,19,0,28,2r-3,37v-41,-13,-52,19,-46,64r40,0r0,37r-40,0r0,136r-43,0","w":126,"k":{"\u2019":-6,"f":6,"\ufb01":6,"\ufb02":6,"\u00df":6}},"g":{"d":"161,-173r41,0v-5,115,31,259,-97,259v-32,0,-62,-6,-86,-28r26,-35v36,45,134,27,113,-46v-47,56,-150,10,-142,-63v-9,-79,101,-124,145,-61r0,-26xm110,-138v-30,0,-51,20,-51,51v0,27,22,50,51,50v32,0,51,-21,51,-50v0,-30,-20,-51,-51,-51","w":226},"h":{"d":"68,-272r0,123v7,-14,24,-28,51,-28v87,2,58,99,63,177r-43,0r0,-87v0,-19,-2,-51,-32,-51v-60,0,-33,83,-39,138r-44,0r0,-272r44,0","w":206},"i":{"d":"25,0r0,-173r43,0r0,173r-43,0xm19,-231v0,-14,11,-26,27,-26v16,0,29,11,29,26v0,15,-13,25,-29,25v-16,0,-27,-11,-27,-25","w":93},"j":{"d":"25,-173r43,0r0,183v5,52,-25,87,-81,73r3,-37v26,10,35,-12,35,-35r0,-184xm19,-231v0,-14,11,-26,27,-26v16,0,29,11,29,26v0,15,-13,25,-29,25v-16,0,-27,-11,-27,-25","w":93},"k":{"d":"24,0r0,-272r44,0r0,171r66,-72r56,0r-74,79r78,94r-57,0r-69,-88r0,88r-44,0","w":193},"l":{"d":"25,0r0,-272r43,0r0,272r-43,0","w":93},"m":{"d":"23,0r0,-173r41,0r0,27v11,-37,95,-44,107,1v13,-22,31,-32,57,-32v84,0,59,99,63,177r-44,0r0,-98v0,-22,-6,-40,-32,-40v-58,0,-31,84,-37,138r-43,0v-7,-49,22,-138,-30,-138v-60,0,-33,83,-39,138r-43,0","w":313},"n":{"d":"24,0r0,-173r42,0r0,28v8,-17,24,-32,53,-32v87,2,58,99,63,177r-43,0r0,-87v0,-19,-2,-51,-32,-51v-60,0,-33,83,-39,138r-44,0","w":206},"o":{"d":"16,-86v0,-54,42,-91,94,-91v52,0,94,37,94,91v0,54,-42,90,-94,90v-52,0,-94,-36,-94,-90xm59,-86v0,27,19,51,51,51v32,0,51,-24,51,-51v0,-27,-19,-52,-51,-52v-32,0,-51,25,-51,52","w":219},"p":{"d":"24,82r0,-255r42,0r0,26v43,-63,145,-18,145,61v0,51,-35,90,-84,90v-33,0,-48,-16,-59,-26r0,104r-44,0xm168,-86v0,-27,-19,-52,-51,-52v-32,0,-51,25,-51,52v0,27,19,51,51,51v32,0,51,-24,51,-51","w":226},"q":{"d":"202,-173r0,255r-43,0r-1,-104v-9,11,-27,26,-59,26v-49,0,-83,-39,-83,-90v0,-79,101,-124,145,-61r0,-26r41,0xm59,-86v0,27,19,51,51,51v32,0,51,-24,51,-51v0,-27,-19,-52,-51,-52v-32,0,-51,25,-51,52","w":226},"r":{"d":"24,0r0,-173r44,0r0,28v11,-24,37,-37,67,-30r0,42v-7,-2,-14,-3,-21,-3v-41,0,-46,34,-46,43r0,93r-44,0","w":140,"k":{",":33,".":33,"c":6,"\u00e7":6,"d":6,"\u0131":6,"e":6,"\u00e9":6,"\u00ea":6,"\u00eb":6,"\u00e8":6,"g":6,"m":-6,"n":-6,"\u00f1":-6,"o":6,"\u00f8":6,"\u0153":6,"\u00f3":6,"\u00f4":6,"\u00f6":6,"\u00f2":6,"\u00f5":6,"q":6,"-":20}},"s":{"d":"145,-151r-28,26v-10,-21,-59,-28,-59,1v0,31,93,6,93,73v0,67,-106,70,-142,29r29,-27v11,12,23,21,41,21v13,0,29,-6,29,-20v0,-36,-94,-7,-94,-73v1,-64,98,-73,131,-30","w":159},"t":{"d":"40,-136r-36,0r0,-37r36,0r0,-50r43,0r0,50r48,0r0,37r-48,0v2,45,-17,127,48,98r0,37v-48,14,-91,0,-91,-56r0,-79","w":140},"u":{"d":"182,-173r0,173r-41,0v-1,-9,2,-21,-1,-28v-8,17,-24,32,-53,32v-87,-2,-58,-99,-63,-177r44,0r0,88v0,19,1,50,31,50v61,-2,34,-83,40,-138r43,0","w":206},"v":{"d":"72,0r-71,-173r47,0r47,121r46,-121r45,0r-68,173r-46,0","w":186,"k":{",":33,".":33}},"w":{"d":"61,0r-60,-173r47,0r38,121r35,-121r47,0r38,121r36,-121r43,0r-58,173r-43,0r-42,-118r-36,118r-45,0","w":286,"k":{",":27,".":27}},"x":{"d":"0,0r69,-93r-60,-80r53,0r34,52r38,-52r49,0r-59,80r70,93r-53,0r-45,-62r-45,62r-51,0","w":193},"y":{"d":"75,1r-74,-174r48,0r49,120r43,-120r45,0r-82,210v-13,43,-49,57,-99,45r5,-39v24,10,51,5,57,-21","w":186,"k":{",":33,".":33}},"z":{"d":"12,0r0,-40r93,-98r-88,0r0,-35r140,0r0,39r-94,99r98,0r0,35r-149,0","w":173},"{":{"d":"0,-88r0,-32v10,0,34,-4,34,-25r0,-71v7,-46,36,-51,79,-48r0,31v-24,-4,-48,7,-42,25r0,68v1,29,-26,33,-36,37v12,1,36,5,36,38v0,41,-23,99,42,91r0,30v-43,3,-79,-1,-79,-47r0,-69v0,-23,-24,-28,-34,-28","w":100},"|":{"d":"22,-270r36,0r0,360r-36,0r0,-360","w":79},"}":{"d":"100,-120r0,32v-10,0,-34,4,-34,25r0,72v-7,45,-37,50,-79,47r0,-30v24,4,48,-7,43,-25r0,-68v-1,-29,25,-33,35,-37v-12,-1,-35,-6,-35,-39v0,-42,22,-98,-43,-90r0,-31v43,-3,79,2,79,48r0,69v0,23,24,27,34,27","w":100},"~":{"d":"80,-139v25,-1,57,25,78,25v15,0,24,-14,32,-25r13,31v-11,15,-23,31,-45,31v-35,0,-91,-50,-109,0r-13,-31v8,-15,21,-31,44,-31","w":239},"\u00a1":{"d":"32,80r0,-175r43,0r0,175r-43,0xm82,-150v0,15,-13,28,-29,28v-15,0,-29,-12,-29,-27v0,-15,13,-28,29,-28v15,0,29,12,29,27","w":106},"\u00a2":{"d":"127,-201r0,24v23,1,47,7,62,25r-28,28v-9,-9,-21,-15,-34,-16r0,108v13,0,26,-7,35,-17r27,28v-15,17,-40,24,-62,25r0,26r-19,0r0,-26v-49,-4,-80,-42,-80,-91v0,-50,31,-84,80,-90r0,-24r19,0xm108,-32r0,-108v-53,9,-51,98,0,108"},"\u00a3":{"d":"24,0r0,-35r36,0r0,-78r-36,0r0,-31r36,0v-4,-66,9,-115,84,-115v26,0,51,7,69,23r-29,31v-25,-29,-85,-13,-80,29r0,32r58,0r0,31r-58,0r0,78r91,0r0,35r-171,0"},"\u2044":{"d":"-60,-2r150,-264r30,13r-150,265","w":60},"\u00a5":{"d":"85,0r0,-64r-61,0r0,-28r61,0v1,-13,-2,-22,-7,-29r-54,0r0,-28r39,0r-59,-106r49,0r56,106r53,-106r47,0r-59,106r39,0r0,28r-54,0v-5,7,-8,16,-7,29r61,0r0,28r-61,0r0,64r-43,0"},"\u0192":{"d":"173,-153r0,32r-50,0v-16,64,-13,175,-88,171v-13,0,-25,-3,-36,-9r16,-33v24,14,39,-3,45,-32r20,-97r-41,0r0,-32r47,0v10,-49,14,-106,73,-106v15,0,29,4,42,11r-17,33v-40,-21,-51,26,-55,62r44,0"},"\u00a7":{"d":"181,-225r-38,21v-7,-27,-63,-34,-63,1v0,40,108,34,108,102v0,20,-13,38,-31,46v14,10,22,26,22,43v-4,80,-133,86,-160,20r39,-19v5,18,23,26,41,26v15,0,33,-5,33,-23v0,-40,-108,-33,-108,-100v0,-26,13,-42,34,-53v-15,-9,-23,-23,-23,-41v3,-72,116,-78,146,-23xm65,-117v0,32,43,33,65,47v29,-15,13,-45,-12,-57r-32,-15v-12,5,-21,11,-21,25"},"\u00a4":{"d":"35,-34r-22,-22r18,-17v-23,-29,-24,-80,0,-109r-18,-18r22,-21r17,17v29,-22,80,-23,109,0r18,-17r21,21r-17,18v24,31,22,79,0,109r17,17r-21,22r-18,-18v-29,23,-78,24,-109,0xm54,-128v0,33,21,55,53,55v32,0,52,-22,52,-55v0,-33,-20,-54,-52,-54v-32,0,-53,21,-53,54"},"'":{"d":"35,-160r0,-95r37,0r0,95r-37,0","w":106},"\u201c":{"d":"90,-255r-25,95r-44,0r30,-95r39,0xm166,-255r-25,95r-44,0r30,-95r39,0","w":186},"\u00ab":{"d":"93,-152r-42,63r42,63r-27,18r-55,-81r55,-81xm173,-152r-42,63r42,63r-27,18r-55,-81r55,-81","w":186},"\u2039":{"d":"93,-152r-42,63r42,63r-27,18r-55,-81r55,-81","w":106},"\u203a":{"d":"14,-26r41,-63r-41,-63r27,-18r55,81r-55,81","w":106},"\u2013":{"d":"180,-106r0,35r-180,0r0,-35r180,0","w":180},"\u2020":{"d":"127,-255r0,73r72,0r0,35r-72,0r0,192r-41,0r0,-192r-71,0r0,-35r71,0r0,-73r41,0"},"\u2021":{"d":"127,-255r0,67r70,0r0,34r-70,0r0,98r70,0r0,34r-70,0r0,67r-41,0r0,-67r-69,0r0,-34r69,0r0,-98r-69,0r0,-34r69,0r0,-67r41,0"},"\u00b7":{"d":"24,-105v0,-15,13,-28,29,-28v15,0,29,13,29,28v0,15,-13,28,-29,28v-15,0,-29,-13,-29,-28","w":106},"\u00b6":{"d":"89,45r0,-167v-47,0,-78,-27,-78,-65v0,-83,100,-67,181,-68r0,300r-33,0r0,-274r-38,0r0,274r-32,0","w":216},"\u2022":{"d":"26,-127v0,-35,29,-64,64,-64v35,0,64,29,64,64v0,35,-29,63,-64,63v-35,0,-64,-28,-64,-63","w":180},"\u201a":{"d":"19,45r25,-95r44,0r-31,95r-38,0","w":106},"\u201e":{"d":"96,45r26,-95r44,0r-31,95r-39,0xm21,45r25,-95r44,0r-30,95r-39,0","w":186},"\u201d":{"d":"97,-160r25,-95r44,0r-31,95r-38,0xm21,-160r25,-95r44,0r-31,95r-38,0","w":186},"\u00bb":{"d":"94,-26r42,-63r-42,-63r27,-18r55,81r-55,81xm14,-26r41,-63r-41,-63r27,-18r55,81r-55,81","w":186},"\u2026":{"d":"31,-25v0,-15,13,-28,29,-28v15,0,29,12,29,27v0,15,-13,28,-29,28v-15,0,-29,-12,-29,-27xm151,-25v0,-15,13,-28,29,-28v15,0,29,12,29,27v0,15,-13,28,-29,28v-15,0,-29,-12,-29,-27xm271,-25v0,-15,13,-28,29,-28v15,0,29,12,29,27v0,15,-13,28,-29,28v-15,0,-29,-12,-29,-27","w":360},"\u2030":{"d":"148,-59v0,-35,28,-64,63,-64v35,0,64,29,64,64v0,35,-29,63,-64,63v-35,0,-63,-28,-63,-63xm180,-59v0,18,13,31,31,31v18,0,32,-13,32,-31v0,-18,-14,-31,-32,-31v-18,0,-31,13,-31,31xm291,-59v0,-35,28,-64,63,-64v35,0,64,29,64,64v0,35,-29,63,-64,63v-35,0,-63,-28,-63,-63xm323,-59v0,18,13,31,31,31v18,0,31,-13,31,-31v0,-18,-13,-31,-31,-31v-18,0,-31,13,-31,31xm3,-196v0,-35,28,-63,63,-63v35,0,64,28,64,63v0,35,-29,64,-64,64v-35,0,-63,-29,-63,-64xm35,-196v0,18,13,31,31,31v18,0,31,-13,31,-31v0,-18,-13,-31,-31,-31v-18,0,-31,13,-31,31xm48,-2r150,-264r30,13r-150,265","w":420},"\u00bf":{"d":"10,16v0,-53,65,-57,58,-116r43,0v12,64,-56,64,-56,114v0,19,13,31,32,31v20,0,34,-16,36,-35r47,4v0,91,-160,99,-160,2xm118,-150v0,15,-12,28,-28,28v-15,0,-29,-12,-29,-27v0,-15,13,-28,29,-28v15,0,28,12,28,27","w":186},"`":{"d":"28,-255r36,52r-34,0r-51,-52r49,0","w":93},"\u00b4":{"d":"30,-203r36,-52r48,0r-50,52r-34,0","w":93},"\u02c6":{"d":"112,-203r-41,0r-25,-32r-24,32r-41,0r42,-52r48,0","w":93},"\u02dc":{"d":"4,-204r-23,0v4,-23,13,-46,40,-46v0,0,59,30,68,-2r24,0v-4,23,-13,46,-40,46v-28,-1,-59,-31,-69,2","w":93},"\u00af":{"d":"104,-242r0,28r-115,0r0,-28r115,0","w":93},"\u02d8":{"d":"-14,-255r24,0v5,32,70,35,74,0r24,0v-2,68,-122,71,-122,0","w":93},"\u02d9":{"d":"19,-229v0,-14,11,-26,27,-26v16,0,29,11,29,26v0,15,-13,26,-29,26v-16,0,-27,-12,-27,-26","w":93},"\u00a8":{"d":"-18,-229v0,-14,11,-26,27,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-27,-12,-27,-26xm56,-229v0,-14,12,-26,28,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-28,-12,-28,-26","w":93},"\u02da":{"d":"85,-236v0,21,-17,37,-38,37v-21,0,-38,-15,-38,-36v0,-21,16,-38,38,-38v21,0,38,16,38,37xm67,-236v0,-11,-9,-19,-20,-19v-11,0,-21,8,-21,19v0,11,10,20,21,20v11,0,20,-8,20,-20","w":93},"\u00b8":{"d":"79,0r-15,22v21,0,43,1,43,29v0,40,-59,42,-88,25r8,-16v16,8,46,15,50,-8v-2,-22,-36,-4,-41,-20r22,-32r21,0","w":93},"\u02dd":{"d":"-7,-203r35,-52r49,0r-50,52r-34,0xm67,-203r35,-52r49,0r-51,52r-33,0","w":93},"\u02db":{"d":"64,53r9,18v-22,20,-72,18,-73,-19v0,-21,21,-42,36,-54r22,0v-11,10,-30,30,-30,46v0,19,25,19,36,9","w":93},"\u02c7":{"d":"-18,-255r41,0r25,33r24,-33r40,0r-41,52r-48,0","w":93},"\u2014":{"d":"360,-106r0,35r-360,0r0,-35r360,0","w":360},"\u00c6":{"d":"190,0r0,-67r-96,0r-41,67r-55,0r163,-255r178,0r0,41r-103,0r0,63r97,0r0,41r-97,0r0,69r108,0r0,41r-154,0xm118,-106r72,0r0,-108r-5,0","w":360},"\u00aa":{"d":"87,-155r0,-14v-19,24,-77,26,-77,-16v0,-36,46,-36,77,-36v1,-22,-43,-15,-54,-3r-16,-19v28,-25,99,-24,99,27r0,61r-29,0xm86,-197v-7,-5,-45,-3,-46,11v7,20,52,9,46,-11","w":125},"\u0141":{"d":"28,0r0,-67r-25,22r0,-40r25,-22r0,-148r46,0r0,108r74,-65r0,39r-74,66r0,66r108,0r0,41r-154,0","w":186,"k":{"T":33,"V":33,"W":20,"y":13,"\u00fd":13,"\u00ff":13,"Y":40,"\u00dd":40,"\u0178":40,"\u2019":79}},"\u00d8":{"d":"79,-71r122,-133v-57,-41,-139,3,-139,75v0,22,7,42,17,58xm218,-188r-123,135v57,44,143,1,143,-76v0,-23,-7,-44,-20,-59xm264,-272r17,16r-31,34v22,23,35,55,35,94v0,114,-135,170,-221,108r-30,33r-18,-16r31,-33v-21,-23,-32,-54,-32,-90v0,-116,128,-169,217,-112","w":299},"\u0152":{"d":"232,-214r0,63r97,0r0,41r-97,0r0,69r110,0r0,41r-179,0v-92,0,-145,-55,-145,-127v0,-73,53,-128,145,-128r173,0r0,41r-104,0xm187,-41r0,-173v-56,-2,-119,7,-119,87v0,79,64,88,119,86","w":360},"\u00ba":{"d":"71,-153v-33,0,-60,-22,-60,-53v0,-32,27,-53,60,-53v34,0,61,21,61,53v0,31,-27,53,-61,53xm71,-179v41,-1,41,-53,0,-54v-40,1,-40,53,0,54","w":142},"\u00e6":{"d":"211,-177v60,1,86,45,83,104r-126,0v1,53,66,56,88,22r30,21v-30,45,-114,44,-141,3v-28,45,-128,45,-132,-21v-3,-53,58,-59,119,-56v4,-48,-61,-50,-85,-23r-23,-23v35,-32,98,-41,131,-2v14,-15,31,-25,56,-25xm56,-51v14,43,84,18,76,-22v-30,0,-74,-3,-76,22xm168,-104r84,0v-1,-24,-17,-41,-42,-41v-24,0,-41,17,-42,41","w":306},"\u0131":{"d":"25,0r0,-173r43,0r0,173r-43,0","w":93},"\u0142":{"d":"25,0r0,-98r-25,25r0,-40r25,-25r0,-134r43,0r0,92r25,-25r0,38r-25,25r0,142r-43,0","w":93},"\u00f8":{"d":"67,-58r71,-72v-44,-28,-102,24,-71,72xm153,-114r-71,71v44,28,102,-23,71,-71xm193,-185r15,14r-25,26v49,56,5,149,-73,149v-22,0,-42,-6,-57,-17r-26,25r-14,-15r24,-24v-49,-55,-5,-150,73,-150v22,0,42,6,58,18","w":219},"\u0153":{"d":"320,-73r-126,0v2,51,69,54,89,19r29,22v-29,47,-108,47,-140,9v-52,57,-159,19,-159,-63v0,-83,109,-121,160,-63v15,-19,38,-28,64,-28v60,1,86,45,83,104xm193,-104r84,0v0,-25,-17,-41,-40,-41v-21,0,-43,14,-44,41xm56,-86v0,29,19,54,51,54v32,0,51,-25,51,-54v0,-29,-19,-54,-51,-54v-32,0,-51,25,-51,54","w":333},"\u00df":{"d":"20,0r0,-184v0,-65,29,-92,87,-92v42,0,78,22,78,66v1,27,-16,46,-38,58v94,19,63,163,-27,156v-10,0,-21,-1,-31,-4r0,-36v35,13,73,-8,72,-46v0,-36,-24,-53,-60,-52r0,-36v23,1,40,-12,40,-34v0,-20,-16,-34,-36,-34v-29,0,-42,19,-42,44r0,194r-43,0","w":219},"\u00b9":{"d":"64,-104r0,-114r-30,27r-20,-24r54,-42r33,0r0,153r-37,0","w":138},"\u00ac":{"d":"181,-53r0,-70r-159,0r0,-37r195,0r0,107r-36,0","w":239},"\u00b5":{"d":"24,-173r44,0r0,88v0,19,1,50,31,50v61,-2,34,-83,40,-138r43,0r0,173r-41,0v-1,-9,2,-21,-1,-28v-7,22,-39,38,-72,30r0,80r-44,0r0,-255","w":206},"\u2122":{"d":"58,-107r0,-115r-44,0r0,-33r125,0r0,33r-44,0r0,115r-37,0xm173,-107r0,-148r51,0r35,97r35,-97r52,0r0,148r-37,0r-1,-96r-36,96r-25,0r-37,-96r0,96r-37,0","w":360},"\u00d0":{"d":"28,0r0,-117r-23,0r0,-30r23,0r0,-108r101,0v67,0,129,42,129,128v0,125,-108,134,-230,127xm74,-41v76,4,137,-11,137,-86v0,-78,-59,-92,-137,-87r0,67r78,0r0,30r-78,0r0,76","w":273},"\u00bd":{"d":"62,-104r0,-114r-31,27r-19,-24r54,-42r32,0r0,153r-36,0xm193,0r0,-34v25,-25,61,-44,79,-75v-4,-24,-43,-14,-43,6r-34,-2v2,-34,25,-50,58,-50v53,0,74,57,35,85v-18,12,-36,25,-51,40r72,0r0,30r-116,0xm67,-2r150,-264r30,13r-150,265","w":320},"\u00b1":{"d":"102,-155r0,-52r37,0r0,52r78,0r0,37r-78,0r0,51r-37,0r0,-51r-80,0r0,-37r80,0xm22,-12r0,-36r195,0r0,36r-195,0","w":239},"\u00de":{"d":"28,0r0,-255r46,0r0,49v70,-2,134,2,134,74v0,76,-64,77,-134,76r0,56r-46,0xm74,-95v39,-1,87,9,87,-36v0,-42,-47,-35,-87,-36r0,72","w":219},"\u00bc":{"d":"254,0r0,-31r-71,0r0,-28r67,-94r41,0r0,92r19,0r0,30r-19,0r0,31r-37,0xm254,-61v-1,-16,2,-35,-1,-49r-34,49r35,0xm60,-104r0,-114r-30,27r-20,-24r54,-42r33,0r0,153r-37,0xm66,-2r150,-264r30,13r-150,265","w":320},"\u00f7":{"d":"22,-127r195,0r0,36r-195,0r0,-36xm93,-174v0,-15,12,-27,27,-27v15,0,27,12,27,27v0,15,-12,27,-27,27v-15,0,-27,-12,-27,-27xm93,-44v0,-15,12,-27,27,-27v15,0,27,12,27,27v0,15,-12,27,-27,27v-15,0,-27,-12,-27,-27","w":239},"\u00a6":{"d":"22,-243r36,0r0,126r-36,0r0,-126xm22,-63r36,0r0,126r-36,0r0,-126","w":79},"\u00b0":{"d":"14,-202v0,-32,26,-57,58,-57v32,0,58,25,58,57v0,32,-26,58,-58,58v-32,0,-58,-26,-58,-58xm42,-202v0,16,14,30,30,30v16,0,30,-14,30,-30v0,-16,-14,-29,-30,-29v-16,0,-30,13,-30,29","w":144},"\u00fe":{"d":"24,82r0,-354r44,0r0,122v10,-17,34,-27,58,-27v53,0,85,40,85,91v0,51,-35,90,-84,90v-33,0,-48,-16,-59,-26r0,104r-44,0xm168,-86v0,-27,-19,-52,-51,-52v-32,0,-51,25,-51,52v0,27,19,51,51,51v32,0,51,-24,51,-51","w":226},"\u00be":{"d":"257,-57r0,-64r-43,64r43,0xm256,0r0,-31r-71,0r0,-28r68,-94r40,0r0,92r19,0r0,30r-19,0r0,31r-37,0xm51,-168r0,-31v18,0,37,2,37,-16v0,-19,-39,-14,-41,4r-37,-7v7,-31,31,-41,59,-41v29,0,56,13,56,41v1,18,-13,29,-29,34v20,3,31,18,31,36v0,60,-112,63,-119,4r37,-8v0,23,47,25,46,0v0,-20,-21,-15,-40,-16xm76,-2r150,-264r30,13r-150,265","w":320},"\u00b2":{"d":"11,-104r0,-34v25,-25,62,-44,80,-75v-4,-24,-43,-14,-43,6r-34,-3v2,-34,25,-49,58,-49v53,0,73,57,35,85v-17,13,-36,25,-51,40r71,0r0,30r-116,0","w":138},"\u00ae":{"d":"93,-59r0,-140v48,1,107,-8,108,41v0,25,-17,42,-32,44r36,55r-38,0r-32,-54r-8,0r0,54r-34,0xm127,-171r0,30v18,-1,39,6,39,-15v0,-20,-22,-14,-39,-15xm10,-127v0,-74,60,-134,134,-134v74,0,134,60,134,134v0,74,-60,133,-134,133v-74,0,-134,-59,-134,-133xm45,-127v0,58,43,103,99,103v56,0,99,-45,99,-103v0,-58,-43,-104,-99,-104v-56,0,-99,46,-99,104","w":288},"\u2212":{"d":"22,-127r195,0r0,36r-195,0r0,-36","w":239},"\u00f0":{"d":"147,-163v-7,-20,-30,-40,-45,-57r-39,18r-21,-21r38,-18v-6,-7,-20,-17,-27,-23r36,-21v13,10,25,22,30,27r40,-18r23,20r-42,19v35,38,64,83,64,137v0,60,-32,104,-94,104v-52,0,-94,-36,-94,-90v0,-69,77,-116,131,-77xm110,-35v32,0,51,-24,51,-51v0,-27,-19,-52,-51,-52v-32,0,-51,25,-51,52v0,27,19,51,51,51","w":219},"\u00d7":{"d":"54,-201r66,66r65,-65r26,25r-66,65r67,67r-27,27r-65,-65r-66,65r-26,-26r66,-66r-66,-67","w":239},"\u00b3":{"d":"53,-168r0,-31v17,0,36,2,36,-16v0,-19,-39,-14,-41,4r-37,-7v7,-31,31,-41,59,-41v29,0,56,13,56,41v1,18,-12,29,-28,34v20,3,31,18,31,36v0,59,-112,64,-119,4r37,-8v0,23,46,25,45,0v0,-20,-20,-15,-39,-16","w":138},"\u00a9":{"d":"178,-107r34,0v-5,36,-33,56,-64,56v-45,0,-72,-35,-72,-78v0,-84,125,-105,136,-23r-34,0v-3,-17,-15,-22,-28,-22v-28,0,-39,19,-39,45v0,27,13,47,38,47v15,0,28,-6,29,-25xm10,-127v0,-74,60,-134,134,-134v74,0,134,60,134,134v0,74,-60,133,-134,133v-74,0,-134,-59,-134,-133xm45,-127v0,58,43,103,99,103v56,0,99,-45,99,-103v0,-58,-43,-104,-99,-104v-56,0,-99,46,-99,104","w":288},"\u00c1":{"d":"0,0r111,-255r39,0r110,255r-52,0r-24,-58r-110,0r-23,58r-51,0xm89,-97r79,0r-39,-104xm113,-272r36,-52r49,0r-51,52r-34,0","w":259},"\u00c2":{"d":"0,0r111,-255r39,0r110,255r-52,0r-24,-58r-110,0r-23,58r-51,0xm89,-97r79,0r-39,-104xm195,-272r-41,0r-24,-33r-25,33r-41,0r42,-52r48,0","w":259},"\u00c4":{"d":"0,0r111,-255r39,0r110,255r-52,0r-24,-58r-110,0r-23,58r-51,0xm89,-97r79,0r-39,-104xm65,-298v0,-14,12,-26,28,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-28,-12,-28,-26xm139,-298v0,-14,12,-26,28,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-28,-12,-28,-26","w":259},"\u00c0":{"d":"0,0r111,-255r39,0r110,255r-52,0r-24,-58r-110,0r-23,58r-51,0xm89,-97r79,0r-39,-104xm111,-324r36,52r-34,0r-51,-52r49,0","w":259},"\u00c5":{"d":"0,0r111,-255r39,0r110,255r-52,0r-24,-58r-110,0r-23,58r-51,0xm89,-97r79,0r-39,-104xm168,-301v0,21,-17,36,-38,36v-21,0,-38,-15,-38,-36v0,-21,16,-37,38,-37v21,0,38,16,38,37xm150,-301v0,-11,-9,-20,-20,-20v-11,0,-21,9,-21,20v0,11,10,19,21,19v11,0,20,-7,20,-19","w":259},"\u00c3":{"d":"0,0r111,-255r39,0r110,255r-52,0r-24,-58r-110,0r-23,58r-51,0xm89,-97r79,0r-39,-104xm87,-274r-23,0v4,-23,13,-45,40,-45v0,0,59,30,68,-2r24,0v-4,23,-13,46,-40,46v-28,-1,-59,-31,-69,1","w":259},"\u00c7":{"d":"239,-221r-36,26v-53,-59,-141,-6,-141,66v0,80,97,130,145,63r37,27v-23,31,-56,45,-93,45r-11,16v21,0,44,1,44,29v0,40,-59,42,-88,25r8,-16v16,8,45,14,50,-8v-3,-22,-36,-4,-42,-20r19,-27v-69,-8,-116,-58,-116,-131v0,-121,149,-181,224,-95","w":246},"\u00c9":{"d":"28,0r0,-255r169,0r0,41r-123,0r0,63r117,0r0,41r-117,0r0,69r130,0r0,41r-176,0xm93,-272r36,-52r49,0r-51,52r-34,0","w":219},"\u00ca":{"d":"28,0r0,-255r169,0r0,41r-123,0r0,63r117,0r0,41r-117,0r0,69r130,0r0,41r-176,0xm176,-272r-41,0r-25,-33r-25,33r-40,0r41,-52r49,0","w":219},"\u00cb":{"d":"28,0r0,-255r169,0r0,41r-123,0r0,63r117,0r0,41r-117,0r0,69r130,0r0,41r-176,0xm45,-298v0,-14,12,-26,28,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-28,-12,-28,-26xm120,-298v0,-14,11,-26,27,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-27,-12,-27,-26","w":219},"\u00c8":{"d":"28,0r0,-255r169,0r0,41r-123,0r0,63r117,0r0,41r-117,0r0,69r130,0r0,41r-176,0xm91,-324r36,52r-34,0r-51,-52r49,0","w":219},"\u00cd":{"d":"27,0r0,-255r46,0r0,255r-46,0xm33,-272r36,-52r49,0r-51,52r-34,0","w":100},"\u00ce":{"d":"27,0r0,-255r46,0r0,255r-46,0xm116,-272r-41,0r-25,-33r-25,33r-40,0r41,-52r49,0","w":100},"\u00cf":{"d":"27,0r0,-255r46,0r0,255r-46,0xm-15,-298v0,-14,12,-26,28,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-28,-12,-28,-26xm59,-298v0,-14,12,-26,28,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-28,-12,-28,-26","w":100},"\u00cc":{"d":"27,0r0,-255r46,0r0,255r-46,0xm31,-324r36,52r-34,0r-51,-52r49,0","w":100},"\u00d1":{"d":"28,0r0,-255r61,0r124,189r0,-189r45,0r0,255r-57,0r-127,-195r0,195r-46,0xm101,-274r-24,0v4,-23,13,-45,40,-45v28,0,59,29,69,-2r24,0v-4,23,-14,46,-41,46v-28,0,-59,-31,-68,1","w":286},"\u00d3":{"d":"15,-126v0,-82,56,-135,134,-135v80,0,136,51,136,133v0,80,-56,134,-136,134v-78,0,-134,-52,-134,-132xm62,-129v0,54,35,94,88,94v53,0,88,-40,88,-94v0,-51,-35,-91,-88,-91v-53,0,-88,40,-88,91xm133,-272r36,-52r49,0r-51,52r-34,0","w":299},"\u00d4":{"d":"15,-126v0,-82,56,-135,134,-135v80,0,136,51,136,133v0,80,-56,134,-136,134v-78,0,-134,-52,-134,-132xm62,-129v0,54,35,94,88,94v53,0,88,-40,88,-94v0,-51,-35,-91,-88,-91v-53,0,-88,40,-88,91xm216,-272r-41,0r-25,-33r-25,33r-40,0r41,-52r49,0","w":299},"\u00d6":{"d":"15,-126v0,-82,56,-135,134,-135v80,0,136,51,136,133v0,80,-56,134,-136,134v-78,0,-134,-52,-134,-132xm62,-129v0,54,35,94,88,94v53,0,88,-40,88,-94v0,-51,-35,-91,-88,-91v-53,0,-88,40,-88,91xm85,-298v0,-14,12,-26,28,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-28,-12,-28,-26xm159,-298v0,-14,12,-26,28,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-28,-12,-28,-26","w":299},"\u00d2":{"d":"15,-126v0,-82,56,-135,134,-135v80,0,136,51,136,133v0,80,-56,134,-136,134v-78,0,-134,-52,-134,-132xm62,-129v0,54,35,94,88,94v53,0,88,-40,88,-94v0,-51,-35,-91,-88,-91v-53,0,-88,40,-88,91xm131,-324r36,52r-34,0r-51,-52r49,0","w":299},"\u00d5":{"d":"15,-126v0,-82,56,-135,134,-135v80,0,136,51,136,133v0,80,-56,134,-136,134v-78,0,-134,-52,-134,-132xm62,-129v0,54,35,94,88,94v53,0,88,-40,88,-94v0,-51,-35,-91,-88,-91v-53,0,-88,40,-88,91xm108,-274r-24,0v4,-23,13,-45,40,-45v28,0,59,29,69,-2r23,0v-4,23,-13,46,-40,46v-28,0,-59,-31,-68,1","w":299},"\u0160":{"d":"186,-235r-33,35v-18,-28,-86,-30,-86,12v0,51,121,22,121,113v0,91,-128,104,-177,47r34,-33v19,34,95,38,95,-8v0,-56,-121,-24,-121,-115v1,-82,116,-99,167,-51xm38,-324r41,0r25,32r25,-32r39,0r-41,52r-48,0","w":206},"\u00da":{"d":"233,-255r0,161v0,62,-45,100,-103,100v-58,0,-103,-38,-103,-100r0,-161r46,0r0,160v0,25,13,58,57,58v44,0,57,-33,57,-58r0,-160r46,0xm113,-272r36,-52r49,0r-51,52r-34,0","w":259},"\u00db":{"d":"233,-255r0,161v0,62,-45,100,-103,100v-58,0,-103,-38,-103,-100r0,-161r46,0r0,160v0,25,13,58,57,58v44,0,57,-33,57,-58r0,-160r46,0xm195,-272r-41,0r-24,-33r-25,33r-41,0r42,-52r48,0","w":259},"\u00dc":{"d":"233,-255r0,161v0,62,-45,100,-103,100v-58,0,-103,-38,-103,-100r0,-161r46,0r0,160v0,25,13,58,57,58v44,0,57,-33,57,-58r0,-160r46,0xm65,-298v0,-14,12,-26,28,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-28,-12,-28,-26xm139,-298v0,-14,12,-26,28,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-28,-12,-28,-26","w":259},"\u00d9":{"d":"233,-255r0,161v0,62,-45,100,-103,100v-58,0,-103,-38,-103,-100r0,-161r46,0r0,160v0,25,13,58,57,58v44,0,57,-33,57,-58r0,-160r46,0xm111,-324r36,52r-34,0r-51,-52r49,0","w":259},"\u00dd":{"d":"91,0r0,-109r-96,-146r57,0r62,102r64,-102r54,0r-96,146r0,109r-45,0xm96,-272r36,-52r49,0r-51,52r-34,0","w":226,"k":{"v":20,"A":27,"\u00c6":27,"\u00c1":27,"\u00c2":27,"\u00c4":27,"\u00c0":27,"\u00c5":27,"\u00c3":27,",":40,".":40,"e":33,"\u00e9":33,"\u00ea":33,"\u00eb":33,"\u00e8":33,"o":33,"\u00f8":33,"\u0153":33,"\u00f3":33,"\u00f4":33,"\u00f6":33,"\u00f2":33,"\u00f5":33,"q":33,"-":40,"a":33,"\u00e6":33,"\u00e1":33,"\u00e2":33,"\u00e4":33,"\u00e0":33,"\u00e5":33,"\u00e3":33,"u":31,"\u00fa":31,"\u00fb":31,"\u00fc":31,"\u00f9":31,":":33,";":33,"i":3,"\u00ed":3,"\u00ee":3,"\u00ef":3,"\u00ec":3,"p":31}},"\u0178":{"d":"91,0r0,-109r-96,-146r57,0r62,102r64,-102r54,0r-96,146r0,109r-45,0xm49,-298v0,-14,11,-26,27,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-27,-12,-27,-26xm123,-298v0,-14,11,-26,27,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-27,-12,-27,-26","w":226,"k":{"v":20,"A":27,"\u00c6":27,"\u00c1":27,"\u00c2":27,"\u00c4":27,"\u00c0":27,"\u00c5":27,"\u00c3":27,",":40,".":40,"e":33,"\u00e9":33,"\u00ea":33,"\u00eb":33,"\u00e8":33,"o":33,"\u00f8":33,"\u0153":33,"\u00f3":33,"\u00f4":33,"\u00f6":33,"\u00f2":33,"\u00f5":33,"q":33,"-":40,"a":33,"\u00e6":33,"\u00e1":33,"\u00e2":33,"\u00e4":33,"\u00e0":33,"\u00e5":33,"\u00e3":33,"u":31,"\u00fa":31,"\u00fb":31,"\u00fc":31,"\u00f9":31,":":33,";":33,"i":3,"\u00ed":3,"\u00ee":3,"\u00ef":3,"\u00ec":3,"p":31}},"\u017d":{"d":"13,0r0,-41r136,-173r-134,0r0,-41r190,0r0,41r-137,173r139,0r0,41r-194,0xm45,-324r41,0r25,32r25,-32r39,0r-41,52r-48,0","w":219},"\u00e1":{"d":"132,0v-1,-7,2,-18,-1,-24v-25,45,-118,35,-118,-24v0,-59,70,-60,119,-60v4,-46,-63,-44,-85,-19r-23,-22v19,-19,47,-28,74,-28v74,0,73,54,73,78r0,99r-39,0xm86,-28v33,-1,46,-18,44,-49v-28,0,-74,-2,-74,26v0,16,16,23,30,23xm80,-203r36,-52r49,0r-51,52r-34,0","w":193},"\u00e2":{"d":"132,0v-1,-7,2,-18,-1,-24v-25,45,-118,35,-118,-24v0,-59,70,-60,119,-60v4,-46,-63,-44,-85,-19r-23,-22v19,-19,47,-28,74,-28v74,0,73,54,73,78r0,99r-39,0xm86,-28v33,-1,46,-18,44,-49v-28,0,-74,-2,-74,26v0,16,16,23,30,23xm162,-203r-41,0r-25,-32r-24,32r-41,0r42,-52r48,0","w":193},"\u00e4":{"d":"132,0v-1,-7,2,-18,-1,-24v-25,45,-118,35,-118,-24v0,-59,70,-60,119,-60v4,-46,-63,-44,-85,-19r-23,-22v19,-19,47,-28,74,-28v74,0,73,54,73,78r0,99r-39,0xm86,-28v33,-1,46,-18,44,-49v-28,0,-74,-2,-74,26v0,16,16,23,30,23xm32,-229v0,-14,11,-26,27,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-27,-12,-27,-26xm106,-229v0,-14,12,-26,28,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-28,-12,-28,-26","w":193},"\u00e0":{"d":"132,0v-1,-7,2,-18,-1,-24v-25,45,-118,35,-118,-24v0,-59,70,-60,119,-60v4,-46,-63,-44,-85,-19r-23,-22v19,-19,47,-28,74,-28v74,0,73,54,73,78r0,99r-39,0xm86,-28v33,-1,46,-18,44,-49v-28,0,-74,-2,-74,26v0,16,16,23,30,23xm78,-255r36,52r-34,0r-51,-52r49,0","w":193},"\u00e5":{"d":"132,0v-1,-7,2,-18,-1,-24v-25,45,-118,35,-118,-24v0,-59,70,-60,119,-60v4,-46,-63,-44,-85,-19r-23,-22v19,-19,47,-28,74,-28v74,0,73,54,73,78r0,99r-39,0xm86,-28v33,-1,46,-18,44,-49v-28,0,-74,-2,-74,26v0,16,16,23,30,23xm135,-236v0,21,-17,37,-38,37v-21,0,-38,-15,-38,-36v0,-21,16,-38,38,-38v21,0,38,16,38,37xm117,-236v0,-11,-9,-19,-20,-19v-11,0,-21,8,-21,19v0,11,10,20,21,20v11,0,20,-8,20,-20","w":193},"\u00e3":{"d":"132,0v-1,-7,2,-18,-1,-24v-25,45,-118,35,-118,-24v0,-59,70,-60,119,-60v4,-46,-63,-44,-85,-19r-23,-22v19,-19,47,-28,74,-28v74,0,73,54,73,78r0,99r-39,0xm86,-28v33,-1,46,-18,44,-49v-28,0,-74,-2,-74,26v0,16,16,23,30,23xm54,-204r-23,0v4,-23,13,-46,40,-46v0,0,59,30,68,-2r24,0v-4,23,-13,46,-40,46v-28,-1,-59,-31,-69,2","w":193},"\u00e7":{"d":"172,-151r-29,30v-28,-36,-88,-7,-84,35v-5,41,57,70,84,35r29,31v-17,17,-46,24,-61,24r-13,18v21,0,44,1,44,29v0,40,-59,42,-88,25r8,-16v16,8,45,14,50,-8v-3,-22,-36,-4,-42,-20r21,-29v-43,-8,-75,-41,-75,-89v0,-80,102,-121,156,-65","w":173},"\u00e9":{"d":"191,-71r-132,0v3,50,73,51,93,17r31,24v-51,66,-167,30,-167,-56v0,-54,42,-91,94,-91v52,-1,85,40,81,106xm59,-104r89,0v0,-25,-17,-41,-44,-41v-26,0,-42,16,-45,41xm86,-203r36,-52r49,0r-51,52r-34,0","w":206},"\u00ea":{"d":"191,-71r-132,0v3,50,73,51,93,17r31,24v-51,66,-167,30,-167,-56v0,-54,42,-91,94,-91v52,-1,85,40,81,106xm59,-104r89,0v0,-25,-17,-41,-44,-41v-26,0,-42,16,-45,41xm169,-203r-41,0r-25,-32r-25,32r-40,0r41,-52r49,0","w":206},"\u00eb":{"d":"191,-71r-132,0v3,50,73,51,93,17r31,24v-51,66,-167,30,-167,-56v0,-54,42,-91,94,-91v52,-1,85,40,81,106xm59,-104r89,0v0,-25,-17,-41,-44,-41v-26,0,-42,16,-45,41xm39,-229v0,-14,11,-26,27,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-27,-12,-27,-26xm113,-229v0,-14,11,-26,27,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-27,-12,-27,-26","w":206},"\u00e8":{"d":"191,-71r-132,0v3,50,73,51,93,17r31,24v-51,66,-167,30,-167,-56v0,-54,42,-91,94,-91v52,-1,85,40,81,106xm59,-104r89,0v0,-25,-17,-41,-44,-41v-26,0,-42,16,-45,41xm85,-255r35,52r-34,0r-50,-52r49,0","w":206},"\u00ed":{"d":"25,0r0,-173r43,0r0,173r-43,0xm26,-203r35,-52r49,0r-51,52r-33,0","w":93},"\u00ee":{"d":"25,0r0,-173r43,0r0,173r-43,0xm112,-203r-41,0r-25,-32r-24,32r-41,0r42,-52r48,0","w":93},"\u00ef":{"d":"25,0r0,-173r43,0r0,173r-43,0xm-18,-229v0,-14,11,-26,27,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-27,-12,-27,-26xm56,-229v0,-14,12,-26,28,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-28,-12,-28,-26","w":93},"\u00ec":{"d":"25,0r0,-173r43,0r0,173r-43,0xm32,-255r36,52r-34,0r-51,-52r49,0","w":93},"\u00f1":{"d":"24,0r0,-173r42,0r0,28v8,-17,24,-32,53,-32v87,2,58,99,63,177r-43,0r0,-87v0,-19,-2,-51,-32,-51v-60,0,-33,83,-39,138r-44,0xm61,-204r-24,0v4,-23,13,-46,40,-46v28,0,59,29,69,-2r24,0v-4,23,-14,46,-41,46v-28,0,-59,-31,-68,2","w":206},"\u00f3":{"d":"16,-86v0,-54,42,-91,94,-91v52,0,94,37,94,91v0,54,-42,90,-94,90v-52,0,-94,-36,-94,-90xm59,-86v0,27,19,51,51,51v32,0,51,-24,51,-51v0,-27,-19,-52,-51,-52v-32,0,-51,25,-51,52xm93,-203r36,-52r48,0r-50,52r-34,0","w":219},"\u00f4":{"d":"16,-86v0,-54,42,-91,94,-91v52,0,94,37,94,91v0,54,-42,90,-94,90v-52,0,-94,-36,-94,-90xm59,-86v0,27,19,51,51,51v32,0,51,-24,51,-51v0,-27,-19,-52,-51,-52v-32,0,-51,25,-51,52xm175,-203r-41,0r-25,-32r-24,32r-41,0r42,-52r48,0","w":219},"\u00f6":{"d":"16,-86v0,-54,42,-91,94,-91v52,0,94,37,94,91v0,54,-42,90,-94,90v-52,0,-94,-36,-94,-90xm59,-86v0,27,19,51,51,51v32,0,51,-24,51,-51v0,-27,-19,-52,-51,-52v-32,0,-51,25,-51,52xm45,-229v0,-14,11,-26,27,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-27,-12,-27,-26xm119,-229v0,-14,12,-26,28,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-28,-12,-28,-26","w":219},"\u00f2":{"d":"16,-86v0,-54,42,-91,94,-91v52,0,94,37,94,91v0,54,-42,90,-94,90v-52,0,-94,-36,-94,-90xm59,-86v0,27,19,51,51,51v32,0,51,-24,51,-51v0,-27,-19,-52,-51,-52v-32,0,-51,25,-51,52xm91,-255r36,52r-34,0r-51,-52r49,0","w":219},"\u00f5":{"d":"16,-86v0,-54,42,-91,94,-91v52,0,94,37,94,91v0,54,-42,90,-94,90v-52,0,-94,-36,-94,-90xm59,-86v0,27,19,51,51,51v32,0,51,-24,51,-51v0,-27,-19,-52,-51,-52v-32,0,-51,25,-51,52xm67,-204r-23,0v4,-23,13,-46,40,-46v0,0,59,30,68,-2r24,0v-4,23,-13,46,-40,46v-28,-1,-59,-31,-69,2","w":219},"\u0161":{"d":"145,-151r-28,26v-10,-21,-59,-28,-59,1v0,31,93,6,93,73v0,67,-106,70,-142,29r29,-27v11,12,23,21,41,21v13,0,29,-6,29,-20v0,-36,-94,-7,-94,-73v1,-64,98,-73,131,-30xm15,-255r41,0r25,33r24,-33r40,0r-41,52r-48,0","w":159},"\u00fa":{"d":"182,-173r0,173r-41,0v-1,-9,2,-21,-1,-28v-8,17,-24,32,-53,32v-87,-2,-58,-99,-63,-177r44,0r0,88v0,19,1,50,31,50v61,-2,34,-83,40,-138r43,0xm86,-203r36,-52r49,0r-51,52r-34,0","w":206},"\u00fb":{"d":"182,-173r0,173r-41,0v-1,-9,2,-21,-1,-28v-8,17,-24,32,-53,32v-87,-2,-58,-99,-63,-177r44,0r0,88v0,19,1,50,31,50v61,-2,34,-83,40,-138r43,0xm169,-203r-41,0r-25,-32r-25,32r-40,0r41,-52r49,0","w":206},"\u00fc":{"d":"182,-173r0,173r-41,0v-1,-9,2,-21,-1,-28v-8,17,-24,32,-53,32v-87,-2,-58,-99,-63,-177r44,0r0,88v0,19,1,50,31,50v61,-2,34,-83,40,-138r43,0xm39,-229v0,-14,11,-26,27,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-27,-12,-27,-26xm113,-229v0,-14,11,-26,27,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-27,-12,-27,-26","w":206},"\u00f9":{"d":"182,-173r0,173r-41,0v-1,-9,2,-21,-1,-28v-8,17,-24,32,-53,32v-87,-2,-58,-99,-63,-177r44,0r0,88v0,19,1,50,31,50v61,-2,34,-83,40,-138r43,0xm85,-255r35,52r-34,0r-50,-52r49,0","w":206},"\u00fd":{"d":"75,1r-74,-174r48,0r49,120r43,-120r45,0r-82,210v-13,43,-49,57,-99,45r5,-39v24,10,51,5,57,-21xm77,-203r35,-52r49,0r-50,52r-34,0","w":186,"k":{",":33,".":33}},"\u00ff":{"d":"75,1r-74,-174r48,0r49,120r43,-120r45,0r-82,210v-13,43,-49,57,-99,45r5,-39v24,10,51,5,57,-21xm29,-229v0,-14,11,-26,27,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-27,-12,-27,-26xm103,-229v0,-14,11,-26,27,-26v16,0,28,11,28,26v0,15,-12,26,-28,26v-16,0,-27,-12,-27,-26","w":186,"k":{",":33,".":33}},"\u017e":{"d":"12,0r0,-40r93,-98r-88,0r0,-35r140,0r0,39r-94,99r98,0r0,35r-149,0xm22,-255r41,0r24,33r25,-33r40,0r-41,52r-48,0","w":173},"\u2206":{"d":"10,0r0,-24r91,-236r48,0r89,236r0,24r-228,0xm52,-32r142,0r-71,-186v-19,60,-48,127,-71,186","w":248},"\u2126":{"d":"16,-32v17,-1,39,2,54,-1v-25,-21,-49,-57,-49,-106v0,-67,49,-119,117,-119v72,0,113,59,113,117v1,51,-25,86,-49,109r54,0r0,32r-97,0r0,-24v26,-17,51,-51,51,-109v0,-46,-25,-92,-73,-92v-45,0,-75,41,-75,94v0,53,25,92,52,107r0,24r-98,0r0,-32","w":273},"\u03bc":{"d":"24,-173r44,0r0,88v0,19,1,50,31,50v61,-2,34,-83,40,-138r43,0r0,173r-41,0v-1,-9,2,-21,-1,-28v-7,22,-39,38,-72,30r0,80r-44,0r0,-255","w":206},"\u03c0":{"d":"215,-156r-29,0v1,47,-4,123,6,156r-40,0v-11,-30,-4,-111,-6,-156r-59,0v-2,43,-13,121,-26,156r-39,0v13,-40,24,-113,25,-156v-20,0,-32,1,-40,4r-5,-27v44,-21,150,-7,216,-11","w":224},"\u20ac":{"d":"202,-27v-12,17,-39,31,-73,31v-57,0,-85,-33,-95,-82r-29,0r10,-33r15,0r0,-33r-24,0r12,-33r18,0v16,-71,93,-100,159,-70r-14,37v-36,-21,-82,-13,-97,33r89,0r-10,33r-86,0r-1,33r78,0r-10,33r-63,0v5,47,69,58,94,24"},"\u2113":{"d":"166,-64r18,17v-29,74,-144,62,-143,-16v-6,5,-13,10,-20,15r-11,-21v11,-9,21,-16,30,-25r0,-94v0,-66,30,-92,64,-92v36,0,52,28,52,63v0,44,-30,86,-77,130v-3,35,13,58,37,58v22,0,40,-18,50,-35xm106,-251v-32,0,-27,83,-27,127v28,-31,50,-63,50,-93v0,-20,-6,-34,-23,-34","w":191},"\u212e":{"d":"66,-50v36,64,146,59,187,3r21,0v-26,31,-69,51,-116,51v-81,0,-146,-58,-146,-131v0,-73,65,-132,146,-132v82,1,148,59,147,135r-239,2r0,72xm251,-205v-33,-61,-139,-58,-182,-8v-6,21,-4,60,-1,82r183,-2r0,-72","w":317},"\u2202":{"d":"39,-236r-13,-29v72,-48,169,-8,169,118v0,86,-37,150,-104,150v-53,0,-77,-47,-77,-86v0,-57,38,-94,82,-94v33,0,54,23,60,33v4,-60,-24,-109,-67,-109v-24,0,-40,9,-50,17xm54,-82v0,29,16,52,42,52v31,0,52,-41,56,-80v-4,-13,-22,-35,-48,-35v-28,0,-50,29,-50,63"},"\u220f":{"d":"261,-218r-40,0r0,253r-40,0r0,-253r-92,0r0,253r-40,0r0,-253r-40,0r0,-36r252,0r0,36","w":270},"\u2211":{"d":"204,35r-196,0r0,-25r96,-119r-91,-117r0,-28r185,0r0,34r-131,1r83,104r-91,114r145,0r0,36","w":211},"\u2219":{"d":"24,-105v0,-15,13,-28,29,-28v15,0,29,13,29,28v0,15,-13,28,-29,28v-15,0,-29,-13,-29,-28","w":106},"\u221a":{"d":"224,-303r-85,356r-34,0r-58,-163r-28,11r-7,-23r59,-23r51,153r73,-311r29,0","w":221},"\u221e":{"d":"271,-105v0,39,-28,63,-58,63v-22,0,-43,-13,-68,-44v-19,23,-39,44,-69,44v-31,0,-58,-25,-58,-61v0,-36,26,-62,61,-62v28,0,49,19,68,43v17,-19,36,-43,68,-43v32,0,56,24,56,60xm79,-65v22,0,40,-21,54,-37v-16,-21,-31,-41,-56,-41v-22,0,-35,18,-35,40v0,21,15,38,37,38xm248,-103v0,-24,-14,-40,-36,-40v-23,0,-42,26,-54,39v23,28,37,39,56,39v22,0,34,-20,34,-38","w":290},"\u222b":{"d":"51,-217v0,-68,26,-106,84,-91r-5,27v-37,-10,-45,20,-44,68v0,58,6,115,6,178v0,71,-30,109,-86,90r5,-28v36,11,46,-10,46,-62v0,-64,-6,-122,-6,-182","w":141},"\u2248":{"d":"69,-163v33,0,48,27,75,27v15,0,25,-10,35,-27r15,14v-12,21,-28,37,-50,37v-25,0,-51,-28,-77,-28v-17,0,-27,13,-37,27r-15,-13v11,-22,31,-37,54,-37xm69,-96v46,0,82,56,110,1r15,13v-12,21,-28,37,-50,37v-25,0,-52,-28,-77,-28v-17,0,-27,13,-37,27r-15,-13v11,-22,32,-37,54,-37","w":210},"\u2260":{"d":"152,-187r-16,34r56,0r0,24r-65,0r-23,52r88,0r0,23r-98,0r-19,44r-19,-8r16,-36r-54,0r0,-23r63,0r24,-52r-87,0r0,-24r96,0r19,-42","w":210},"\u2264":{"d":"190,-36r-169,-82r0,-26r169,-82r0,27r-145,68r145,68r0,27xm192,3r-173,0r0,-24r173,0r0,24","w":210},"\u2265":{"d":"21,-226r170,82r0,26r-170,82r0,-27r145,-68r-145,-68r0,-27xm191,3r-172,0r0,-24r172,0r0,24","w":210},"\u25ca":{"d":"202,-127r-76,145r-32,0r-75,-145r76,-144r32,0xm166,-126r-56,-113v-15,41,-37,74,-55,112r56,113v15,-40,37,-74,55,-112","w":221},"\u00a0":{"w":106},"\u00ad":{"d":"101,-107r0,37r-89,0r0,-37r89,0","w":113},"\u02c9":{"d":"104,-242r0,28r-115,0r0,-28r115,0","w":93},"\u03a9":{"d":"16,-32v17,-1,39,2,54,-1v-25,-21,-49,-57,-49,-106v0,-67,49,-119,117,-119v72,0,113,59,113,117v1,51,-25,86,-49,109r54,0r0,32r-97,0r0,-24v26,-17,51,-51,51,-109v0,-46,-25,-92,-73,-92v-45,0,-75,41,-75,94v0,53,25,92,52,107r0,24r-98,0r0,-32","w":273},"\u2215":{"d":"-60,-2r150,-264r30,13r-150,265","w":60}}});
Cufon.registerFont({"w":200,"face":{"font-family":"Avenir Book","font-weight":350,"font-stretch":"normal","units-per-em":"360","panose-1":"2 11 5 2 2 2 3 2 2 4","ascent":"272","descent":"-88","x-height":"4","bbox":"-60 -331 360 104","underline-thickness":"18","underline-position":"-18","stemh":"22","stemv":"26","unicode-range":"U+0020-U+FB02"},"glyphs":{" ":{"w":100},"\ufb01":{"d":"104,-168r0,21r-40,0r0,147r-23,0r0,-147r-36,0r0,-21r36,0v-6,-67,8,-125,77,-106r-5,22v-50,-17,-53,33,-49,84r40,0xm162,-168r0,168r-24,0r0,-168r24,0xm167,-233v0,10,-8,17,-17,17v-9,0,-17,-7,-17,-17v0,-10,8,-18,17,-18v9,0,17,8,17,18","w":193,"k":{"\u2019":-6,"f":6,"\ufb01":6,"\ufb02":6,"\u00df":6}},"\ufb02":{"d":"104,-168r0,21r-40,0r0,147r-23,0r0,-147r-36,0r0,-21r36,0v-6,-67,8,-125,77,-106r-5,22v-50,-17,-53,33,-49,84r40,0xm162,-272r0,272r-24,0r0,-272r24,0","w":193,"k":{"\u2019":-6,"f":6,"\ufb01":6,"\ufb02":6,"\u00df":6}},"!":{"d":"63,-255r0,186r-26,0r0,-186r26,0xm50,-37v25,0,25,39,0,39v-12,0,-19,-9,-19,-19v0,-10,7,-20,19,-20","w":100},"\"":{"d":"57,-170r0,-85r21,0r0,85r-21,0xm109,-170r0,-85r21,0r0,85r-21,0","w":186},"#":{"d":"39,0r10,-77r-36,0r0,-22r39,0r8,-58r-39,0r0,-22r42,0r11,-76r22,0r-11,76r48,0r11,-76r22,0r-11,76r33,0r0,22r-36,0r-8,58r34,0r0,22r-37,0r-11,77r-22,0r11,-77r-48,0r-11,77r-21,0xm82,-157r-8,58r48,0r8,-58r-48,0"},"jQuery":{"d":"91,-146r0,-91v-26,2,-43,22,-43,47v0,24,19,35,43,44xm109,-113r0,95v19,0,47,-10,47,-46v0,-24,-20,-40,-47,-49xm91,-18r0,-100v-33,-10,-69,-28,-69,-72v0,-42,34,-67,69,-70r0,-25r18,0r0,24v34,0,52,15,66,31r-20,17v-10,-17,-29,-24,-46,-24r0,96v35,13,73,30,73,77v0,40,-32,67,-73,70r0,24r-18,0r0,-24v-33,-2,-62,-18,-76,-39r22,-16v16,20,39,31,54,31"},"%":{"d":"140,-196v0,35,-27,63,-63,63v-36,0,-63,-28,-63,-63v0,-35,27,-63,63,-63v36,0,63,28,63,63xm119,-196v0,-24,-19,-42,-42,-42v-23,0,-42,18,-42,42v0,24,19,41,42,41v23,0,42,-17,42,-41xm286,-59v0,35,-27,63,-63,63v-36,0,-64,-28,-64,-63v0,-35,28,-63,64,-63v36,0,63,28,63,63xm265,-59v0,-24,-19,-41,-42,-41v-23,0,-42,17,-42,41v0,24,19,42,42,42v23,0,42,-18,42,-42xm240,-256r-162,267r-19,-10r163,-267","w":299},"&":{"d":"237,-138r-47,79r58,59r-37,0r-36,-37v-21,27,-43,43,-78,43v-42,0,-80,-26,-80,-72v0,-37,27,-61,58,-75v-15,-16,-30,-37,-30,-60v0,-38,28,-60,64,-60v34,0,62,20,62,57v0,33,-31,52,-57,66r59,61r35,-61r29,0xm145,-204v0,-20,-17,-34,-36,-34v-21,0,-38,15,-38,38v0,17,19,39,27,46v19,-11,47,-24,47,-50xm159,-55r-68,-70v-33,19,-46,33,-46,59v0,29,25,49,53,49v28,0,44,-17,61,-38","w":253},"\u2019":{"d":"73,-255r-29,85r-24,0r24,-85r29,0","w":93,"k":{"\u2019":13,"s":40,"\u0161":40,"t":6}},"(":{"d":"72,-265r19,12v-63,88,-64,207,-2,296r-19,15v-67,-93,-68,-229,2,-323","w":93},")":{"d":"22,58r-19,-13v62,-88,62,-207,1,-296r19,-14v67,92,68,229,-1,323","w":93},"*":{"d":"91,-255r0,52r50,-17r8,21r-51,16r32,43r-17,13r-33,-44r-33,44r-17,-13r32,-43r-51,-16r8,-21r50,17r0,-52r22,0","w":159},"+":{"d":"131,-201r0,81r81,0r0,22r-81,0r0,81r-22,0r0,-81r-81,0r0,-22r81,0r0,-81r22,0","w":239},",":{"d":"77,-34r-29,84r-25,0r25,-84r29,0","w":100},"-":{"d":"106,-98r0,23r-92,0r0,-23r92,0","w":119},".":{"d":"50,-37v25,0,25,39,0,39v-12,0,-19,-9,-19,-19v0,-10,7,-20,19,-20","w":100},"\/":{"d":"131,-254r-108,260r-21,-6r109,-261","w":133},"0":{"d":"100,-259v73,0,86,75,86,132v0,57,-13,131,-86,131v-73,0,-86,-74,-86,-131v0,-57,13,-132,86,-132xm100,-235v-55,0,-60,68,-60,108v0,40,5,108,60,108v55,0,61,-68,61,-108v0,-40,-6,-108,-61,-108"},"1":{"d":"125,-255r0,255r-26,0r0,-222r-45,40r-17,-20r65,-53r23,0"},"2":{"d":"179,-24r0,24r-162,0r0,-30r102,-103v15,-16,32,-35,32,-58v0,-28,-22,-44,-49,-44v-26,0,-46,16,-51,40r-27,-3v7,-80,153,-83,153,5v0,39,-25,65,-51,90r-81,79r134,0"},"3":{"d":"125,-135v28,8,50,33,50,66v0,88,-138,98,-161,22r27,-8v9,24,24,36,55,36v29,0,53,-21,53,-51v-1,-43,-35,-54,-76,-52r0,-23v39,2,68,-8,70,-47v2,-51,-80,-56,-96,-15r-23,-12v28,-61,145,-51,144,26v0,28,-20,50,-43,58"},"4":{"d":"150,-255r0,171r36,0r0,24r-36,0r0,60r-26,0r0,-60r-110,0r0,-30r103,-165r33,0xm124,-84r-1,-145r-88,145r89,0"},"5":{"d":"167,-255r0,24r-104,0r-1,77v57,-23,114,16,114,75v0,87,-127,114,-159,38r26,-11v21,53,107,36,107,-24v0,-59,-70,-76,-115,-47r2,-132r130,0"},"6":{"d":"139,-255r-69,110v52,-25,113,12,113,70v0,47,-35,79,-83,79v-80,0,-97,-88,-61,-147r69,-112r31,0xm43,-75v0,32,24,56,57,56v33,0,57,-24,57,-56v0,-32,-24,-55,-57,-55v-33,0,-57,23,-57,55"},"7":{"d":"171,-255r0,24r-103,231r-29,0r105,-231r-125,0r0,-24r152,0"},"8":{"d":"19,-68v-1,-34,22,-58,48,-68v-22,-8,-38,-31,-38,-57v0,-41,33,-66,71,-66v38,0,71,25,71,66v1,27,-18,48,-38,58v28,8,48,34,48,67v0,44,-38,72,-81,72v-43,0,-81,-28,-81,-72xm145,-190v0,-26,-19,-45,-45,-45v-26,0,-45,19,-45,45v0,26,19,45,45,45v26,0,45,-19,45,-45xm155,-72v0,-30,-22,-52,-55,-52v-33,0,-55,22,-55,52v0,30,22,53,55,53v33,0,55,-23,55,-53"},"9":{"d":"62,0r68,-110v-52,25,-113,-12,-113,-70v0,-47,35,-79,83,-79v80,0,97,88,61,147r-69,112r-30,0xm157,-180v0,-32,-24,-55,-57,-55v-33,0,-57,23,-57,55v0,32,24,55,57,55v33,0,57,-23,57,-55"},":":{"d":"69,-151v0,10,-7,20,-19,20v-25,0,-25,-39,0,-39v12,0,19,9,19,19xm50,-37v25,0,25,39,0,39v-12,0,-19,-9,-19,-19v0,-10,7,-20,19,-20","w":100},";":{"d":"77,-34r-29,84r-25,0r25,-84r29,0xm73,-151v0,10,-8,20,-20,20v-25,0,-25,-39,0,-39v12,0,20,9,20,19","w":100},"<":{"d":"212,-203r0,22r-155,72r155,72r0,22r-184,-86r0,-16","w":239},"=":{"d":"28,-147r184,0r0,22r-184,0r0,-22xm28,-93r184,0r0,22r-184,0r0,-22","w":239},">":{"d":"28,-181r0,-22r184,86r0,16r-184,86r0,-22r155,-72","w":239},"?":{"d":"158,-196v-1,67,-69,55,-59,127r-26,0v-14,-69,57,-74,59,-125v2,-58,-84,-50,-88,-2r-27,-3v4,-78,143,-81,141,3xm89,-37v25,0,25,39,0,39v-12,0,-20,-9,-20,-19v0,-10,8,-20,20,-20","w":173},"@":{"d":"181,-147v0,-21,-14,-36,-29,-36v-35,0,-61,45,-61,78v0,20,15,34,34,34v31,0,56,-46,56,-76xm193,-175v5,-6,5,-16,9,-23r20,0r-34,120v0,4,4,7,9,7v25,0,54,-38,54,-78v0,-54,-51,-93,-101,-93v-62,0,-113,55,-113,115v0,60,51,114,113,114v36,0,72,-17,91,-44r23,0v-23,40,-67,63,-114,63v-73,0,-135,-58,-135,-133v0,-75,62,-134,135,-134v67,0,123,45,123,110v0,62,-51,102,-83,102v-15,1,-22,-9,-26,-22v-25,37,-96,24,-96,-32v0,-50,33,-102,84,-102v18,0,33,8,41,30","w":288},"A":{"d":"58,-67r-28,67r-30,0r111,-255r25,0r111,255r-30,0r-28,-67r-131,0xm123,-225r-55,134r111,0","w":246},"B":{"d":"35,0r0,-255v74,0,156,-12,158,64v1,29,-19,49,-45,57v36,3,57,26,57,63v0,17,-11,71,-93,71r-77,0xm60,-231r0,88v51,0,102,8,105,-45v0,-10,-6,-43,-55,-43r-50,0xm60,-122r0,98v55,2,117,2,117,-48v0,-52,-61,-53,-117,-50","w":226},"C":{"d":"223,-55r21,15v-17,26,-52,46,-94,46v-76,0,-133,-56,-133,-133v0,-115,147,-181,221,-94r-22,17v-10,-17,-39,-34,-66,-34v-66,0,-105,52,-105,111v0,91,122,155,178,72","w":253},"D":{"d":"31,0r0,-255v119,-8,218,8,218,128v0,119,-100,135,-218,127xm57,-231r0,207r50,0v78,0,114,-50,114,-103v0,-53,-36,-104,-114,-104r-50,0","w":266},"E":{"d":"60,-121r0,97r137,0r0,24r-162,0r0,-255r158,0r0,24r-133,0r0,87r124,0r0,23r-124,0","w":213},"F":{"d":"60,-121r0,121r-25,0r0,-255r153,0r0,24r-128,0r0,87r119,0r0,23r-119,0","k":{"A":20,"\u00c6":20,"\u00c1":20,"\u00c2":20,"\u00c4":20,"\u00c0":20,"\u00c5":20,"\u00c3":20,",":46,".":46}},"G":{"d":"242,-227r-19,19v-17,-18,-42,-30,-73,-30v-66,0,-105,52,-105,111v0,59,39,110,105,110v26,0,52,-7,71,-18r0,-86r-61,0r0,-23r87,0r0,125v-96,59,-230,9,-230,-108v0,-116,148,-176,225,-100","w":280},"H":{"d":"35,0r0,-255r25,0r0,111r139,0r0,-111r26,0r0,255r-26,0r0,-121r-139,0r0,121r-25,0","w":259},"I":{"d":"60,-255r0,255r-25,0r0,-255r25,0","w":95},"J":{"d":"5,-47r26,-5v5,21,18,35,41,35v38,0,45,-33,45,-64r0,-174r26,0r0,185v0,34,-17,76,-72,76v-35,0,-60,-18,-66,-53","w":173},"K":{"d":"60,-255r0,111r4,0r120,-111r37,0r-128,116r135,139r-38,0r-125,-131r-5,0r0,131r-25,0r0,-255r25,0","w":226},"L":{"d":"60,-255r0,231r119,0r0,24r-144,0r0,-255r25,0","w":180,"k":{"T":33,"V":33,"W":20,"y":13,"\u00fd":13,"\u00ff":13,"Y":35,"\u00dd":35,"\u0178":35,"\u2019":35}},"M":{"d":"74,-255r86,207r86,-207r40,0r0,255r-26,0r-1,-220r-92,220r-14,0r-93,-220r0,220r-25,0r0,-255r39,0","w":320},"N":{"d":"67,-255r153,216r0,-216r26,0r0,255r-33,0r-153,-218r0,218r-25,0r0,-255r32,0","w":280},"O":{"d":"283,-127v0,77,-57,133,-133,133v-76,0,-133,-56,-133,-133v0,-77,57,-134,133,-134v76,0,133,57,133,134xm255,-127v0,-59,-39,-111,-105,-111v-66,0,-105,52,-105,111v0,59,39,110,105,110v66,0,105,-51,105,-110","w":300},"P":{"d":"35,0r0,-255v75,-2,158,-6,158,68v0,64,-63,74,-133,69r0,118r-25,0xm60,-231r0,89v51,5,113,-7,105,-45v7,-37,-54,-49,-105,-44","w":206,"k":{"A":27,"\u00c6":27,"\u00c1":27,"\u00c2":27,"\u00c4":27,"\u00c0":27,"\u00c5":27,"\u00c3":27,",":55,".":55}},"Q":{"d":"45,-131v0,57,38,107,101,107v63,0,101,-50,101,-107v0,-57,-38,-107,-101,-107v-63,0,-101,50,-101,107xm292,-24r0,24r-146,0v-74,0,-129,-55,-129,-131v0,-76,55,-130,129,-130v73,0,129,54,129,130v0,46,-19,85,-60,107r77,0","w":300},"R":{"d":"60,-118r0,118r-25,0r0,-255v76,-2,162,-7,162,68v0,35,-23,62,-65,66r73,121r-31,0r-70,-118r-44,0xm60,-231r0,89v51,5,117,-5,109,-45v8,-39,-58,-49,-109,-44","w":213,"k":{"T":-2,"V":-2,"W":-6,"y":-9,"\u00fd":-9,"\u00ff":-9,"Y":5,"\u00dd":5,"\u0178":5}},"S":{"d":"178,-230r-23,17v-22,-39,-103,-33,-104,21v0,69,131,33,131,125v0,82,-123,97,-164,36r23,-17v19,43,113,43,113,-16v0,-72,-131,-32,-131,-125v0,-80,112,-94,155,-41"},"T":{"d":"116,-231r0,231r-26,0r0,-231r-85,0r0,-24r197,0r0,24r-86,0","w":206,"k":{"\u00fc":33,"\u0161":40,"\u00f2":40,"\u00f6":40,"\u00ec":3,"\u00ed":3,"\u00e8":40,"\u00eb":40,"\u00ea":40,"\u00e3":40,"\u00e5":40,"\u00e0":40,"\u00e4":40,"\u00e2":40,"w":40,"y":40,"\u00fd":40,"\u00ff":40,"A":24,"\u00c6":24,"\u00c1":24,"\u00c2":24,"\u00c4":24,"\u00c0":24,"\u00c5":24,"\u00c3":24,",":40,".":40,"c":40,"\u00e7":40,"e":40,"\u00e9":40,"o":40,"\u00f8":40,"\u0153":40,"\u00f3":40,"\u00f4":40,"\u00f5":40,"-":46,"a":40,"\u00e6":40,"\u00e1":40,"i":3,"\u00ee":3,"\u00ef":3,"r":33,"s":40,"u":33,"\u00fa":33,"\u00fb":33,"\u00f9":33,":":40,";":40}},"U":{"d":"217,-255v-10,119,43,261,-94,261v-137,0,-82,-143,-93,-261r26,0r0,157v0,73,48,81,67,81v19,0,68,-8,68,-81r0,-157r26,0","w":246},"V":{"d":"28,-255r81,216r84,-216r28,0r-99,255r-26,0r-97,-255r29,0","w":219,"k":{"\u00f6":20,"\u00f4":20,"\u00e8":20,"\u00eb":20,"\u00ea":20,"\u00e3":20,"\u00e5":20,"\u00e0":20,"\u00e4":20,"\u00e2":20,"y":6,"\u00fd":6,"\u00ff":6,"A":20,"\u00c6":20,"\u00c1":20,"\u00c2":20,"\u00c4":20,"\u00c0":20,"\u00c5":20,"\u00c3":20,",":46,".":46,"e":20,"\u00e9":20,"o":20,"\u00f8":20,"\u0153":20,"\u00f3":20,"\u00f2":20,"\u00f5":20,"-":20,"a":20,"\u00e6":20,"\u00e1":20,"i":-2,"\u00ed":-2,"\u00ee":-2,"\u00ef":-2,"\u00ec":-2,"r":13,"u":13,"\u00fa":13,"\u00fb":13,"\u00fc":13,"\u00f9":13,":":27,";":27}},"W":{"d":"29,-255r62,218r64,-218r31,0r65,218r60,-218r29,0r-75,255r-31,0r-64,-218r-65,218r-30,0r-75,-255r29,0","w":339,"k":{"\u00fc":6,"\u00f6":6,"\u00ea":6,"\u00e4":13,"A":6,"\u00c6":6,"\u00c1":6,"\u00c2":6,"\u00c4":6,"\u00c0":6,"\u00c5":6,"\u00c3":6,",":27,".":27,"e":6,"\u00e9":6,"\u00eb":6,"\u00e8":6,"o":6,"\u00f8":6,"\u0153":6,"\u00f3":6,"\u00f4":6,"\u00f2":6,"\u00f5":6,"a":13,"\u00e6":13,"\u00e1":13,"\u00e2":13,"\u00e0":13,"\u00e5":13,"\u00e3":13,"i":-9,"\u00ed":-9,"\u00ee":-9,"\u00ef":-9,"\u00ec":-9,"r":6,"u":6,"\u00fa":6,"\u00fb":6,"\u00f9":6,":":6,";":6}},"X":{"d":"44,-255r70,102r71,-102r32,0r-86,121r94,134r-35,0r-77,-116r-78,116r-33,0r93,-134r-86,-121r35,0","w":226},"Y":{"d":"116,-110r0,110r-26,0r0,-110r-95,-145r32,0r76,120r76,-120r33,0","w":206,"k":{"\u00fc":27,"\u00f6":33,"v":20,"A":27,"\u00c6":27,"\u00c1":27,"\u00c2":27,"\u00c4":27,"\u00c0":27,"\u00c5":27,"\u00c3":27,",":44,".":36,"e":33,"\u00e9":33,"\u00ea":33,"\u00eb":33,"\u00e8":33,"o":33,"\u00f8":33,"\u0153":33,"\u00f3":33,"\u00f4":33,"\u00f2":33,"\u00f5":33,"q":33,"-":40,"a":33,"\u00e6":33,"\u00e1":33,"\u00e2":33,"\u00e4":33,"\u00e0":33,"\u00e5":33,"\u00e3":33,"i":3,"\u00ed":3,"\u00ee":3,"\u00ef":3,"\u00ec":3,"u":27,"\u00fa":27,"\u00fb":27,"\u00f9":27,":":33,";":33,"p":27}},"Z":{"d":"190,-255r0,22r-149,209r151,0r0,24r-184,0r0,-22r149,-209r-147,0r0,-24r180,0"},"[":{"d":"82,-264r0,20r-35,0r0,281r35,0r0,19r-59,0r0,-320r59,0","w":93},"\\":{"d":"111,6r-109,-260r20,-7r109,261","w":133},"]":{"d":"12,56r0,-19r34,0r0,-281r-34,0r0,-20r58,0r0,320r-58,0","w":93},"^":{"d":"29,-99r82,-156r18,0r82,156r-22,0r-69,-130r-69,130r-22,0","w":239},"_":{"d":"0,45r0,-18r180,0r0,18r-180,0","w":180},"\u2018":{"d":"20,-170r29,-85r24,0r-24,85r-29,0","w":93,"k":{"\u2018":13}},"a":{"d":"17,-45v0,-59,69,-58,117,-58v8,-59,-67,-58,-95,-28r-14,-17v32,-36,133,-40,133,35r0,75v0,13,2,29,3,38r-23,0v-1,-8,-3,-18,-3,-27v-23,46,-118,43,-118,-18xm134,-84v-33,0,-91,-2,-91,36v0,22,21,31,40,31v39,-1,54,-29,51,-67","w":186},"b":{"d":"26,0r0,-272r24,0r0,132v47,-66,156,-25,156,56v0,81,-108,120,-156,56r0,28r-24,0xm180,-84v0,-38,-25,-67,-64,-67v-39,0,-67,29,-67,67v0,38,28,67,67,67v39,0,64,-29,64,-67","w":219},"c":{"d":"168,-144r-19,15v-29,-44,-114,-15,-106,45v-7,60,77,90,106,44r19,15v-48,60,-151,20,-151,-59v0,-79,102,-121,151,-60","w":173},"d":{"d":"194,-272r0,272r-24,0r0,-28v-47,64,-156,25,-156,-56v0,-81,109,-122,156,-56r0,-132r24,0xm40,-84v0,38,25,67,64,67v39,0,67,-29,67,-67v0,-38,-28,-67,-67,-67v-39,0,-64,29,-64,67","w":219},"e":{"d":"183,-78r-141,0v-1,62,90,80,116,32r19,15v-48,66,-160,33,-160,-53v0,-51,37,-89,85,-89v55,0,84,40,81,95xm43,-97r114,0v0,-32,-21,-54,-55,-54v-31,0,-59,26,-59,54"},"f":{"d":"104,-168r0,21r-40,0r0,147r-23,0r0,-147r-36,0r0,-21r36,0v-6,-67,8,-125,77,-106r-5,22v-50,-17,-53,33,-49,84r40,0","w":106,"k":{"\u2019":-6,"f":6,"\ufb01":6,"\ufb02":6,"\u00df":6}},"g":{"d":"21,53r18,-19v14,19,37,31,64,31v60,-1,72,-44,65,-97v-43,65,-151,23,-151,-54v0,-79,101,-120,152,-54r0,-28r24,0r0,167v0,37,-15,87,-91,87v-33,0,-59,-10,-81,-33xm43,-86v0,35,28,64,63,64v35,0,64,-25,64,-64v0,-35,-24,-65,-64,-65v-35,0,-63,30,-63,65","w":219},"h":{"d":"26,0r0,-272r24,0r0,131v10,-18,35,-32,57,-32v84,0,60,97,63,173r-23,0v-5,-60,21,-154,-46,-151v-5,0,-51,3,-51,65r0,86r-24,0"},"i":{"d":"55,-168r0,168r-24,0r0,-168r24,0xm60,-233v0,10,-8,17,-17,17v-9,0,-17,-7,-17,-17v0,-10,8,-18,17,-18v9,0,17,8,17,18","w":86},"j":{"d":"-8,62v24,12,44,-10,39,-32r0,-198r24,0r0,201v0,10,3,53,-47,53v-6,0,-13,0,-19,-3xm60,-233v0,10,-8,17,-17,17v-9,0,-17,-7,-17,-17v0,-10,8,-18,17,-18v9,0,17,8,17,18","w":86},"k":{"d":"50,-272r0,179r79,-75r36,0r-84,77r93,91r-37,0r-87,-89r0,89r-24,0r0,-272r24,0","w":173},"l":{"d":"55,-272r0,272r-24,0r0,-272r24,0","w":86},"m":{"d":"26,0r-2,-168r26,0r0,25v27,-37,84,-47,108,5v24,-56,119,-43,119,31r0,107r-24,0v-6,-58,23,-153,-42,-151v-66,2,-44,88,-48,151r-23,0v-6,-59,23,-153,-43,-151v-6,0,-47,3,-47,65r0,86r-24,0","w":306},"n":{"d":"24,-168r25,0v1,9,1,18,1,27v10,-18,35,-32,57,-32v84,0,60,97,63,173r-23,0v-5,-60,21,-154,-46,-151v-5,0,-51,3,-51,65r0,86r-24,0"},"o":{"d":"196,-84v0,51,-36,88,-89,88v-52,0,-90,-37,-90,-88v0,-51,38,-89,90,-89v53,0,89,38,89,89xm170,-84v0,-38,-24,-67,-63,-67v-39,0,-64,29,-64,67v0,38,25,67,64,67v39,0,63,-29,63,-67","w":213},"p":{"d":"26,104r0,-272r24,0r0,28v47,-66,156,-25,156,56v0,81,-108,120,-156,56r0,132r-24,0xm180,-84v0,-38,-25,-67,-64,-67v-39,0,-67,29,-67,67v0,38,28,67,67,67v39,0,64,-29,64,-67","w":219},"q":{"d":"194,-168r0,272r-24,0r0,-132v-47,64,-156,25,-156,-56v0,-81,109,-122,156,-56r0,-28r24,0xm40,-84v0,38,25,67,64,67v39,0,67,-29,67,-67v0,-38,-28,-67,-67,-67v-39,0,-64,29,-64,67","w":219},"r":{"d":"28,0r-1,-168r23,0v1,10,-2,23,1,31v6,-23,37,-43,72,-34r-5,24v-38,-11,-66,25,-66,52r0,95r-24,0","w":119,"k":{",":33,".":33,"c":6,"\u00e7":6,"d":6,"\u0131":6,"e":6,"\u00e9":6,"\u00ea":6,"\u00eb":6,"\u00e8":6,"g":6,"m":-6,"n":-6,"\u00f1":-6,"o":6,"\u00f8":6,"\u0153":6,"\u00f3":6,"\u00f4":6,"\u00f6":6,"\u00f2":6,"\u00f5":6,"q":6,"-":20}},"s":{"d":"136,-143r-21,14v-9,-28,-68,-32,-71,3v-3,23,34,27,57,32v23,5,41,22,41,46v0,65,-102,68,-130,20r20,-14v10,15,25,25,45,25v19,0,39,-9,39,-28v-11,-49,-98,-11,-98,-77v0,-60,95,-68,118,-21","w":153},"t":{"d":"113,-168r0,21r-49,0r0,99v-1,38,28,35,49,24r1,22v-33,11,-73,13,-73,-39r0,-106r-36,0r0,-21r36,0r0,-48r23,0r0,48r49,0","w":119},"u":{"d":"172,0r-24,0v-2,-8,1,-20,-2,-27v-10,18,-35,31,-57,31v-84,0,-60,-97,-63,-172r24,0v5,60,-21,153,45,151v5,0,52,-3,52,-65r0,-86r23,0"},"v":{"d":"168,-168r-68,168r-27,0r-68,-168r28,0r55,141r53,-141r27,0","w":173,"k":{",":27,".":27}},"w":{"d":"5,-168r28,0r40,136r45,-136r24,0r46,136r39,-136r28,0r-53,168r-27,0r-45,-138r-45,138r-27,0","w":259,"k":{",":20,".":20}},"x":{"d":"0,0r69,-90r-61,-78r33,0r46,63r45,-63r30,0r-59,78r71,90r-33,0r-56,-74r-55,74r-30,0","w":173},"y":{"d":"36,-168r53,139r51,-139r29,0r-84,212v-11,33,-35,48,-75,40r2,-23v40,19,53,-28,63,-59r-69,-170r30,0","w":173,"k":{",":33,".":33}},"z":{"d":"141,-168r0,17r-98,129r102,0r0,22r-137,0r0,-17r99,-130r-94,0r0,-21r128,0","w":153},"{":{"d":"4,-93r0,-21v38,1,32,-63,32,-105v0,-44,24,-47,62,-45r0,22v-53,-11,-38,46,-38,92v0,37,-25,43,-32,47v8,1,32,11,32,46r0,62v-4,23,12,34,38,30r0,21v-37,2,-62,-1,-62,-45v0,-42,6,-105,-32,-104","w":93},"|":{"d":"29,-270r22,0r0,360r-22,0r0,-360","w":79},"}":{"d":"89,-114r0,21v-38,-2,-32,62,-32,104v0,44,-24,47,-62,45r0,-21v53,11,38,-46,38,-92v0,-37,26,-43,33,-47v-8,-1,-33,-11,-33,-46r0,-62v4,-23,-12,-34,-38,-30r0,-22v37,-2,62,1,62,45v0,42,-6,106,32,105","w":93},"~":{"d":"81,-134v26,0,52,27,76,28v17,0,30,-16,36,-26r15,14v-11,15,-26,33,-49,33v-27,0,-52,-27,-76,-27v-17,0,-30,16,-36,26r-15,-14v11,-15,26,-34,49,-34","w":239},"\u00a1":{"d":"37,82r0,-186r26,0r0,186r-26,0xm50,-136v-25,0,-25,-39,0,-39v12,0,19,9,19,19v0,10,-7,20,-19,20","w":100},"\u00a2":{"d":"104,-18r0,-132v-65,6,-66,126,0,132xm121,-151r0,133v17,-1,31,-10,38,-22r20,15v-15,18,-36,28,-58,29r0,22r-17,0r0,-23v-47,-5,-76,-41,-76,-87v0,-46,29,-83,76,-88r0,-22r17,0r0,22v22,1,43,10,58,28r-20,15v-7,-12,-21,-21,-38,-22"},"\u00a3":{"d":"153,-142r0,21r-60,0r0,99r91,0r0,22r-154,0r0,-22r37,0r0,-99r-35,0r0,-21r35,0v-3,-65,4,-115,76,-117v21,0,42,6,56,21r-17,19v-10,-11,-23,-19,-40,-19v-56,0,-49,51,-49,96r60,0"},"\u2044":{"d":"-41,12r-19,-12r162,-266r19,11","w":60},"\u00a5":{"d":"28,-80r59,0v-1,-10,2,-25,-2,-32r-57,0r0,-20r45,0r-74,-123r31,0r70,123r70,-123r31,0r-74,123r45,0r0,20r-56,0v-6,6,-2,21,-3,32r59,0r0,19r-59,0r0,61r-26,0r0,-61r-59,0r0,-19"},"\u0192":{"d":"152,-151r0,20r-43,0r-24,126v1,37,-45,72,-85,46r12,-17v27,14,44,-9,49,-34r23,-121r-39,0r0,-20r43,0v11,-46,7,-107,64,-108v12,0,24,3,34,10r-12,18v-47,-26,-56,38,-61,80r39,0"},"\u00a7":{"d":"163,-225r-21,10v-5,-9,-17,-23,-39,-23v-58,0,-43,52,-10,67v31,14,75,26,75,70v0,22,-13,37,-32,47v52,30,16,104,-42,104v-32,0,-60,-13,-72,-41r24,-12v8,22,28,31,48,31v19,0,41,-8,41,-36v0,-55,-107,-39,-107,-103v0,-24,17,-39,38,-48v-10,-6,-28,-17,-28,-43v0,-69,109,-71,125,-23xm142,-97v-1,-29,-37,-45,-61,-46v-14,6,-27,15,-27,30v0,31,41,34,62,48v13,-5,26,-18,26,-32"},"\u00a4":{"d":"189,-201r-19,19v25,31,26,78,0,109r19,19r-16,16r-19,-19v-32,25,-76,25,-108,0r-19,19r-16,-16r19,-19v-26,-31,-25,-78,0,-109r-19,-19r16,-16r19,19v32,-25,76,-25,108,0r19,-19xm35,-127v0,37,29,68,65,68v36,0,65,-31,65,-68v0,-37,-29,-68,-65,-68v-36,0,-65,31,-65,68"},"'":{"d":"36,-170r0,-85r22,0r0,85r-22,0","w":93},"\u201c":{"d":"34,-170r29,-85r24,0r-24,85r-29,0xm99,-170r30,-85r24,0r-24,85r-30,0","w":186},"\u00ab":{"d":"86,-150r-41,64r41,63r-17,12r-50,-75r50,-76xm152,-150r-42,64r42,63r-17,12r-51,-75r51,-76","w":173},"\u2039":{"d":"47,-86r42,63r-17,12r-51,-75r51,-76r17,12","w":113},"\u203a":{"d":"66,-86r-41,-64r17,-12r50,76r-50,75r-17,-12","w":113},"\u2013":{"d":"180,-98r0,23r-180,0r0,-23r180,0","w":180},"\u2020":{"d":"112,-255r0,74r73,0r0,21r-73,0r0,205r-24,0r0,-205r-73,0r0,-21r73,0r0,-74r24,0"},"\u2021":{"d":"112,-255r0,69r70,0r0,22r-70,0r0,119r70,0r0,21r-70,0r0,69r-24,0r0,-69r-70,0r0,-21r70,0r0,-119r-70,0r0,-22r70,0r0,-69r24,0"},"\u00b7":{"d":"69,-113v0,10,-7,19,-19,19v-12,0,-19,-9,-19,-19v0,-10,7,-19,19,-19v12,0,19,9,19,19","w":100},"\u00b6":{"d":"185,-255r0,300r-24,0r0,-280r-45,0r0,280r-23,0r0,-159v-44,0,-76,-30,-76,-67v0,-47,32,-74,82,-74r86,0","w":216},"\u2022":{"d":"26,-127v0,-35,29,-64,64,-64v35,0,64,29,64,64v0,35,-29,63,-64,63v-35,0,-64,-28,-64,-63","w":180},"\u201a":{"d":"73,-34r-29,84r-24,0r24,-84r29,0","w":93},"\u201e":{"d":"153,-34r-30,84r-24,0r24,-84r30,0xm87,-34r-29,84r-24,0r24,-84r29,0","w":186},"\u201d":{"d":"153,-255r-30,85r-24,0r24,-85r30,0xm87,-255r-29,85r-24,0r24,-85r29,0","w":186},"\u00bb":{"d":"87,-23r42,-63r-42,-64r17,-12r51,76r-51,75xm22,-23r41,-63r-41,-64r17,-12r50,76r-50,75","w":173},"\u2026":{"d":"60,-37v27,0,26,39,0,39v-12,0,-19,-9,-19,-19v0,-10,7,-20,19,-20xm180,-37v25,0,25,39,0,39v-12,0,-19,-9,-19,-19v0,-10,7,-20,19,-20xm300,-37v25,0,25,39,0,39v-12,0,-20,-9,-20,-19v0,-10,8,-20,20,-20","w":360},"\u2030":{"d":"119,-204v0,30,-24,56,-55,56v-31,0,-55,-26,-55,-56v0,-30,24,-55,55,-55v31,0,55,25,55,55xm100,-204v0,-20,-16,-36,-36,-36v-20,0,-36,16,-36,36v0,20,16,36,36,36v20,0,36,-16,36,-36xm225,-51v0,30,-24,55,-55,55v-31,0,-55,-25,-55,-55v0,-30,24,-56,55,-56v31,0,55,26,55,56xm206,-51v0,-20,-16,-36,-36,-36v-20,0,-36,16,-36,36v0,20,16,36,36,36v20,0,36,-16,36,-36xm351,-51v0,30,-24,55,-55,55v-31,0,-55,-25,-55,-55v0,-30,24,-56,55,-56v31,0,55,26,55,56xm332,-51v0,-20,-16,-36,-36,-36v-20,0,-36,16,-36,36v0,20,16,36,36,36v20,0,36,-16,36,-36xm207,-256r-162,267r-19,-10r163,-267","w":360},"\u00bf":{"d":"16,23v1,-67,68,-54,58,-127r26,0v14,68,-56,74,-58,125v-3,59,84,50,88,2r27,4v-5,38,-36,59,-73,59v-39,0,-68,-22,-68,-63xm85,-136v-25,0,-25,-39,0,-39v12,0,19,9,19,19v0,10,-7,20,-19,20","w":173},"`":{"d":"44,-203r-48,-52r33,0r36,52r-21,0","w":86},"\u00b4":{"d":"90,-255r-48,52r-21,0r36,-52r33,0","w":86},"\u02c6":{"d":"58,-255r39,52r-24,0r-30,-39r-30,39r-23,0r39,-52r29,0","w":86},"\u02dc":{"d":"68,-209v-23,0,-61,-34,-68,2r-15,0v3,-19,11,-38,33,-38v24,0,60,36,68,-1r16,0v-3,19,-12,37,-34,37","w":86},"\u00af":{"d":"92,-235r0,19r-97,0r0,-19r97,0","w":86},"\u02d8":{"d":"80,-255r16,0v-2,30,-23,48,-53,48v-30,0,-51,-18,-53,-48r16,0v5,38,69,37,74,0","w":86},"\u02d9":{"d":"43,-218v-23,0,-24,-37,0,-37v25,0,24,37,0,37","w":86},"\u00a8":{"d":"9,-215v-24,0,-25,-36,0,-36v23,0,24,36,0,36xm78,-215v-24,0,-25,-36,0,-36v23,0,24,36,0,36","w":86},"\u02da":{"d":"78,-234v0,19,-16,34,-35,34v-19,0,-34,-15,-34,-34v0,-19,15,-34,34,-34v19,0,35,15,35,34xm65,-234v0,-12,-10,-21,-22,-21v-12,0,-21,9,-21,21v0,12,9,21,21,21v12,0,22,-9,22,-21","w":86},"\u00b8":{"d":"56,0v-4,7,-14,16,-15,22v18,-8,41,2,40,24v-2,36,-49,39,-76,23r6,-12v16,8,46,11,49,-10v0,-4,-3,-15,-18,-15v-11,1,-17,7,-23,-2v12,-10,12,-33,37,-30","w":86},"\u02dd":{"d":"42,-255r-48,52r-21,0r36,-52r33,0xm114,-255r-48,52r-21,0r36,-52r33,0","w":86},"\u02db":{"d":"69,51r7,14v-19,20,-65,17,-65,-17v0,-20,17,-38,32,-50r17,0v-18,18,-28,29,-28,43v0,19,25,23,37,10","w":86},"\u02c7":{"d":"97,-255r-39,52r-29,0r-39,-52r23,0r30,39r30,-39r24,0","w":86},"\u2014":{"d":"360,-98r0,23r-360,0r0,-23r360,0","w":360},"\u00c6":{"d":"210,-231r0,87r99,0r0,23r-99,0r0,97r110,0r0,24r-136,0r0,-71r-107,0r-46,71r-31,0r166,-255r150,0r0,24r-106,0xm92,-95r92,0r0,-136r-4,0","w":339},"\u00aa":{"d":"85,-168v-13,22,-74,21,-74,-15v0,-24,24,-38,71,-36v3,-30,-40,-27,-55,-12r-12,-13v23,-29,96,-10,89,17r1,72r-19,0xm82,-201v-16,0,-47,-2,-49,17v11,30,57,6,49,-17","w":121},"\u0141":{"d":"60,-255r0,125r78,-67r0,25r-78,67r0,81r119,0r0,24r-144,0r0,-83r-30,25r0,-25r30,-25r0,-147r25,0","w":180,"k":{"T":33,"V":33,"W":20,"y":13,"\u00fd":13,"\u00ff":13,"Y":35,"\u00dd":35,"\u0178":35,"\u2019":35}},"\u00d8":{"d":"276,-249r-28,29v22,23,35,56,35,93v0,112,-136,172,-218,104r-27,29r-14,-12r28,-29v-76,-77,-18,-226,98,-226v33,0,62,10,85,29r27,-29xm230,-200r-148,159v17,15,40,24,68,24v97,3,134,-116,80,-183xm70,-55r148,-158v-17,-15,-40,-25,-68,-25v-96,-3,-134,117,-80,183","w":300},"\u0152":{"d":"213,-231r0,87r102,0r0,23r-102,0r0,97r110,0r0,24r-161,0v-102,0,-139,-73,-139,-128v0,-86,71,-127,139,-127r157,0r0,24r-106,0xm187,-24r0,-207v-79,-5,-135,29,-136,104v0,30,17,103,111,103r25,0","w":339},"\u00ba":{"d":"127,-206v0,30,-24,53,-58,53v-34,0,-58,-23,-58,-53v0,-31,24,-53,58,-53v34,0,58,22,58,53xm106,-206v0,-20,-15,-36,-37,-36v-21,0,-36,16,-36,36v0,19,15,36,36,36v22,0,37,-17,37,-36","w":138},"\u00e6":{"d":"289,-78r-126,0v-1,33,17,61,49,61v29,0,43,-14,53,-28r19,15v-35,44,-108,49,-134,-5v-17,28,-40,39,-75,39v-30,0,-58,-16,-58,-49v0,-59,66,-52,122,-52v2,-67,-60,-65,-94,-34r-15,-17v28,-32,107,-35,123,8v11,-20,36,-33,60,-33v54,1,79,40,76,95xm139,-78v-40,1,-96,-9,-96,30v0,22,21,31,40,31v35,0,57,-26,56,-61xm163,-97r103,0v0,-31,-20,-54,-52,-54v-28,0,-51,23,-51,54","w":306},"\u0131":{"d":"55,-168r0,168r-24,0r0,-168r24,0","w":86},"\u0142":{"d":"55,-272r0,107r29,-30r0,26r-29,30r0,139r-24,0r0,-114r-29,30r0,-27r29,-29r0,-132r24,0","w":86},"\u00f8":{"d":"158,-125r-92,94v40,33,104,3,104,-53v0,-15,-4,-29,-12,-41xm55,-43r92,-94v-39,-34,-104,-2,-104,53v0,16,4,30,12,41xm199,-167r-24,24v46,53,11,147,-68,147v-23,0,-43,-6,-57,-18r-24,24r-12,-11r24,-25v-48,-53,-8,-147,69,-147v22,0,42,7,57,19r24,-25","w":213},"\u0153":{"d":"315,-78r-127,0v-1,33,18,61,50,61v29,0,42,-14,52,-28r19,15v-35,44,-109,48,-136,-4v-48,71,-156,35,-156,-50v0,-86,114,-122,157,-51v37,-70,158,-35,141,57xm162,-84v0,-36,-20,-67,-59,-67v-35,0,-60,29,-60,67v0,38,25,67,60,67v39,0,59,-31,59,-67xm188,-97r103,0v0,-31,-20,-54,-52,-54v-28,0,-51,23,-51,54","w":331},"\u00df":{"d":"54,-198r0,198r-24,0r0,-196v0,-42,18,-80,76,-80v73,0,96,102,27,120v39,7,62,37,62,76v0,57,-47,94,-106,81r0,-20v46,9,81,-16,80,-62v0,-44,-28,-63,-73,-63r0,-21v29,0,53,-13,53,-45v0,-29,-20,-45,-44,-45v-39,0,-51,32,-51,57","w":213},"\u00b9":{"d":"81,-257r0,153r-22,0r0,-131r-29,24r-11,-14v21,-11,28,-34,62,-32","w":129},"\u00ac":{"d":"212,-147r0,100r-22,0r0,-78r-162,0r0,-22r184,0","w":239},"\u00b5":{"d":"26,82r0,-250r24,0v5,59,-22,151,45,151v29,0,52,-24,52,-65r0,-86r23,0r2,168r-25,0v-1,-8,2,-21,-1,-27v-15,28,-66,42,-96,21r0,88r-24,0"},"\u2122":{"d":"144,-255r0,20r-48,0r0,128r-21,0r0,-128r-49,0r0,-20r118,0xm334,-255r0,148r-22,0r0,-124r-50,124r-14,0r-51,-124r0,124r-22,0r0,-148r34,0r46,114r47,-114r32,0","w":360},"\u00d0":{"d":"31,0r0,-125r-26,0r0,-19r26,0r0,-111v119,-8,218,8,218,128v0,119,-100,135,-218,127xm57,-125r0,101r50,0v78,0,114,-50,114,-103v0,-53,-36,-104,-114,-104r-50,0r0,87r93,0r0,19r-93,0","w":266},"\u00bd":{"d":"65,12r-19,-12r162,-266r19,11xm76,-257r0,153r-22,0r0,-131r-30,24r-10,-14v21,-11,28,-35,62,-32xm286,-19r0,19r-105,0r0,-21r61,-59v23,-13,31,-54,-6,-56v-16,0,-28,9,-32,20r-20,-3v5,-47,104,-49,101,3v-2,46,-56,67,-81,97r82,0","w":300},"\u00b1":{"d":"28,-125r0,-22r81,0r0,-56r22,0r0,56r81,0r0,22r-81,0r0,54r-22,0r0,-54r-81,0xm28,-17r0,-22r184,0r0,22r-184,0","w":239},"\u00de":{"d":"35,0r0,-255r25,0r0,56v69,-3,133,-1,133,68v0,69,-63,73,-133,69r0,62r-25,0xm60,-175r0,89v49,-2,105,12,105,-45v0,-57,-56,-42,-105,-44","w":206},"\u00bc":{"d":"256,-153r0,100r21,0r0,19r-21,0r0,34r-22,0r0,-34r-69,0r0,-22r64,-97r27,0xm74,12r-19,-12r162,-266r19,11xm234,-53v-1,-25,2,-55,-1,-78r-49,78r50,0xm85,-257r0,153r-22,0r0,-131r-30,24r-10,-14v21,-11,28,-35,62,-32","w":300},"\u00f7":{"d":"212,-120r0,22r-184,0r0,-22r184,0xm120,-187v25,0,25,39,0,39v-12,0,-20,-9,-20,-19v0,-10,8,-20,20,-20xm139,-51v0,10,-7,20,-19,20v-27,0,-26,-39,0,-39v12,0,19,9,19,19","w":239},"\u00a6":{"d":"29,-243r22,0r0,126r-22,0r0,-126xm29,-63r22,0r0,126r-22,0r0,-126","w":79},"\u00b0":{"d":"126,-206v0,31,-23,54,-54,54v-31,0,-54,-23,-54,-54v0,-31,23,-53,54,-53v31,0,54,22,54,53xm108,-206v0,-20,-16,-36,-36,-36v-20,0,-36,16,-36,36v0,20,16,37,36,37v20,0,36,-17,36,-37","w":144},"\u00fe":{"d":"26,82r0,-354r24,0r0,135v51,-74,156,-27,156,53v0,81,-108,120,-156,56r0,110r-24,0xm180,-84v0,-38,-25,-67,-64,-67v-39,0,-67,29,-67,67v0,38,26,67,67,67v39,0,64,-29,64,-67","w":219},"\u00be":{"d":"263,-153r0,100r21,0r0,19r-21,0r0,34r-22,0r0,-34r-69,0r0,-22r65,-97r26,0xm88,12r-19,-12r163,-266r18,11xm241,-53v-1,-25,2,-55,-1,-78r-48,78r49,0xm50,-174r0,-19v42,10,65,-47,19,-47v-14,0,-22,4,-31,17r-17,-12v20,-38,94,-30,95,15v1,18,-14,30,-29,37v22,4,34,18,34,37v1,53,-90,60,-105,13r18,-11v5,30,61,29,65,-2v2,-14,-17,-31,-49,-28","w":300},"\u00b2":{"d":"118,-123r0,19r-106,0r0,-21r62,-59v24,-14,30,-55,-7,-56v-16,0,-27,9,-31,20r-21,-3v5,-47,103,-49,101,3v-2,46,-55,67,-80,97r82,0","w":129},"\u00ae":{"d":"94,-49r0,-155v51,0,112,-7,112,45v0,28,-18,39,-41,42r44,68r-23,0r-43,-67r-27,0r0,67r-22,0xm116,-185r0,50v31,-1,68,7,68,-26v0,-34,-38,-22,-68,-24xm9,-127v0,-77,62,-134,135,-134v73,0,135,57,135,133v0,77,-62,134,-135,134v-73,0,-135,-57,-135,-133xm31,-127v0,64,50,114,113,114v63,0,113,-49,113,-115v0,-64,-50,-114,-113,-114v-63,0,-113,49,-113,115","w":288},"\u2212":{"d":"212,-120r0,22r-184,0r0,-22r184,0","w":239},"\u00f0":{"d":"43,-84v0,38,25,67,64,67v39,0,63,-29,63,-67v0,-38,-24,-67,-63,-67v-39,0,-64,29,-64,67xm164,-257r-37,19v44,44,70,90,69,147v0,43,-20,95,-89,95v-52,0,-90,-37,-90,-88v0,-75,92,-114,144,-69v-19,-35,-35,-54,-57,-73r-40,20r-13,-13r39,-20v-12,-12,-24,-21,-34,-28r22,-13v12,10,24,19,35,29r36,-19","w":213},"\u00d7":{"d":"63,-182r57,57r57,-57r15,15r-57,58r57,57r-15,16r-57,-58r-57,58r-15,-16r57,-57r-57,-58","w":239},"\u00b3":{"d":"47,-174r0,-19v23,1,44,-6,44,-24v0,-28,-45,-31,-56,-6r-17,-12v20,-38,94,-30,95,15v1,18,-14,30,-29,37v22,4,34,18,34,37v1,53,-91,59,-106,13r19,-11v5,30,61,29,65,-2v2,-14,-17,-31,-49,-28","w":129},"\u00a9":{"d":"196,-102r21,0v-8,35,-35,57,-68,57v-49,0,-80,-35,-80,-82v0,-89,134,-115,147,-27r-20,0v-18,-64,-105,-34,-105,26v0,33,23,63,58,63v25,0,43,-16,47,-37xm9,-127v0,-77,62,-134,135,-134v73,0,135,57,135,133v0,77,-62,134,-135,134v-73,0,-135,-57,-135,-133xm31,-127v0,64,50,114,113,114v63,0,113,-49,113,-115v0,-64,-50,-114,-113,-114v-63,0,-113,49,-113,115","w":288},"\u00c1":{"d":"58,-67r-28,67r-30,0r111,-255r25,0r111,255r-30,0r-28,-67r-131,0xm123,-225r-55,134r111,0xm170,-318r-47,52r-21,0r36,-52r32,0","w":246},"\u00c2":{"d":"58,-67r-28,67r-30,0r111,-255r25,0r111,255r-30,0r-28,-67r-131,0xm123,-225r-55,134r111,0xm138,-318r39,52r-24,0r-30,-39r-29,39r-24,0r39,-52r29,0","w":246},"\u00c4":{"d":"58,-67r-28,67r-30,0r111,-255r25,0r111,255r-30,0r-28,-67r-131,0xm123,-225r-55,134r111,0xm71,-296v0,-9,7,-18,18,-18v11,0,18,9,18,18v0,9,-7,18,-18,18v-11,0,-18,-9,-18,-18xm140,-296v0,-9,7,-18,18,-18v11,0,18,9,18,18v0,9,-7,18,-18,18v-11,0,-18,-9,-18,-18","w":246},"\u00c0":{"d":"58,-67r-28,67r-30,0r111,-255r25,0r111,255r-30,0r-28,-67r-131,0xm123,-225r-55,134r111,0xm124,-266r-47,-52r32,0r36,52r-21,0","w":246},"\u00c5":{"d":"58,-67r-28,67r-30,0r111,-255r25,0r111,255r-30,0r-28,-67r-131,0xm123,-225r-55,134r111,0xm158,-297v0,19,-16,34,-35,34v-19,0,-34,-15,-34,-34v0,-19,15,-34,34,-34v19,0,35,15,35,34xm145,-297v0,-12,-10,-21,-22,-21v-12,0,-21,9,-21,21v0,12,9,21,21,21v12,0,22,-9,22,-21","w":246},"\u00c3":{"d":"58,-67r-28,67r-30,0r111,-255r25,0r111,255r-30,0r-28,-67r-131,0xm123,-225r-55,134r111,0xm149,-272v-23,-1,-61,-35,-68,2r-16,0v3,-19,11,-38,33,-38v24,0,61,36,68,-1r16,0v-3,19,-11,37,-33,37","w":246},"\u00c7":{"d":"223,-55r21,15v-18,28,-57,48,-101,46r-12,16v18,-8,41,2,41,24v0,36,-49,39,-76,23r6,-12v16,8,45,12,48,-10v0,-4,-2,-15,-17,-15v-11,0,-18,7,-23,-2r19,-25v-65,-10,-112,-62,-112,-132v0,-115,147,-181,221,-94r-22,17v-10,-17,-39,-34,-66,-34v-66,0,-105,52,-105,111v0,91,122,155,178,72","w":253},"\u00c9":{"d":"60,-121r0,97r137,0r0,24r-162,0r0,-255r158,0r0,24r-133,0r0,87r124,0r0,23r-124,0xm154,-318r-48,52r-21,0r36,-52r33,0","w":213},"\u00ca":{"d":"60,-121r0,97r137,0r0,24r-162,0r0,-255r158,0r0,24r-133,0r0,87r124,0r0,23r-124,0xm121,-318r40,52r-24,0r-30,-39r-30,39r-24,0r40,-52r28,0","w":213},"\u00cb":{"d":"60,-121r0,97r137,0r0,24r-162,0r0,-255r158,0r0,24r-133,0r0,87r124,0r0,23r-124,0xm54,-296v0,-9,7,-18,18,-18v11,0,19,9,19,18v0,9,-8,18,-19,18v-11,0,-18,-9,-18,-18xm123,-296v0,-9,7,-18,18,-18v11,0,19,9,19,18v0,9,-8,18,-19,18v-11,0,-18,-9,-18,-18","w":213},"\u00c8":{"d":"60,-121r0,97r137,0r0,24r-162,0r0,-255r158,0r0,24r-133,0r0,87r124,0r0,23r-124,0xm108,-266r-48,-52r33,0r36,52r-21,0","w":213},"\u00cd":{"d":"60,-255r0,255r-25,0r0,-255r25,0xm94,-318r-47,52r-21,0r36,-52r32,0","w":95},"\u00ce":{"d":"60,-255r0,255r-25,0r0,-255r25,0xm62,-318r39,52r-24,0r-29,-39r-30,39r-24,0r39,-52r29,0","w":95},"\u00cf":{"d":"60,-255r0,255r-25,0r0,-255r25,0xm-5,-296v0,-9,7,-18,18,-18v11,0,18,9,18,18v0,9,-7,18,-18,18v-11,0,-18,-9,-18,-18xm64,-296v0,-9,7,-18,18,-18v11,0,18,9,18,18v0,9,-7,18,-18,18v-11,0,-18,-9,-18,-18","w":95},"\u00cc":{"d":"60,-255r0,255r-25,0r0,-255r25,0xm48,-266r-47,-52r32,0r36,52r-21,0","w":95},"\u00d1":{"d":"67,-255r153,216r0,-216r26,0r0,255r-33,0r-153,-218r0,218r-25,0r0,-255r32,0xm165,-272v-23,0,-61,-34,-68,2r-15,0v3,-19,11,-38,33,-38v24,0,60,36,68,-1r15,0v-3,19,-11,37,-33,37","w":280},"\u00d3":{"d":"283,-127v0,77,-57,133,-133,133v-76,0,-133,-56,-133,-133v0,-77,57,-134,133,-134v76,0,133,57,133,134xm255,-127v0,-59,-39,-111,-105,-111v-66,0,-105,52,-105,111v0,59,39,110,105,110v66,0,105,-51,105,-110xm197,-318r-48,52r-21,0r36,-52r33,0","w":300},"\u00d4":{"d":"283,-127v0,77,-57,133,-133,133v-76,0,-133,-56,-133,-133v0,-77,57,-134,133,-134v76,0,133,57,133,134xm255,-127v0,-59,-39,-111,-105,-111v-66,0,-105,52,-105,111v0,59,39,110,105,110v66,0,105,-51,105,-110xm165,-318r39,52r-24,0r-30,-39r-30,39r-24,0r40,-52r29,0","w":300},"\u00d6":{"d":"283,-127v0,77,-57,133,-133,133v-76,0,-133,-56,-133,-133v0,-77,57,-134,133,-134v76,0,133,57,133,134xm255,-127v0,-59,-39,-111,-105,-111v-66,0,-105,52,-105,111v0,59,39,110,105,110v66,0,105,-51,105,-110xm97,-296v0,-9,8,-18,19,-18v11,0,18,9,18,18v0,9,-7,18,-18,18v-11,0,-19,-9,-19,-18xm166,-296v0,-9,8,-18,19,-18v11,0,18,9,18,18v0,9,-7,18,-18,18v-11,0,-19,-9,-19,-18","w":300},"\u00d2":{"d":"283,-127v0,77,-57,133,-133,133v-76,0,-133,-56,-133,-133v0,-77,57,-134,133,-134v76,0,133,57,133,134xm255,-127v0,-59,-39,-111,-105,-111v-66,0,-105,52,-105,111v0,59,39,110,105,110v66,0,105,-51,105,-110xm151,-266r-48,-52r33,0r36,52r-21,0","w":300},"\u00d5":{"d":"283,-127v0,77,-57,133,-133,133v-76,0,-133,-56,-133,-133v0,-77,57,-134,133,-134v76,0,133,57,133,134xm255,-127v0,-59,-39,-111,-105,-111v-66,0,-105,52,-105,111v0,59,39,110,105,110v66,0,105,-51,105,-110xm175,-272v-23,0,-61,-34,-68,2r-15,0v3,-19,11,-38,33,-38v24,0,60,36,68,-1r15,0v-3,19,-11,37,-33,37","w":300},"\u0160":{"d":"178,-230r-23,17v-22,-39,-103,-33,-104,21v0,69,131,33,131,125v0,82,-123,97,-164,36r23,-17v19,43,113,43,113,-16v0,-72,-131,-32,-131,-125v0,-80,112,-94,155,-41xm154,-318r-40,52r-28,0r-40,-52r24,0r30,39r30,-39r24,0"},"\u00da":{"d":"217,-255v-10,119,43,261,-94,261v-137,0,-82,-143,-93,-261r26,0r0,157v0,73,48,81,67,81v19,0,68,-8,68,-81r0,-157r26,0xm170,-318r-47,52r-21,0r36,-52r32,0","w":246},"\u00db":{"d":"217,-255v-10,119,43,261,-94,261v-137,0,-82,-143,-93,-261r26,0r0,157v0,73,48,81,67,81v19,0,68,-8,68,-81r0,-157r26,0xm138,-318r39,52r-24,0r-30,-39r-29,39r-24,0r39,-52r29,0","w":246},"\u00dc":{"d":"217,-255v-10,119,43,261,-94,261v-137,0,-82,-143,-93,-261r26,0r0,157v0,73,48,81,67,81v19,0,68,-8,68,-81r0,-157r26,0xm71,-296v0,-9,7,-18,18,-18v11,0,18,9,18,18v0,9,-7,18,-18,18v-11,0,-18,-9,-18,-18xm140,-296v0,-9,7,-18,18,-18v11,0,18,9,18,18v0,9,-7,18,-18,18v-11,0,-18,-9,-18,-18","w":246},"\u00d9":{"d":"217,-255v-10,119,43,261,-94,261v-137,0,-82,-143,-93,-261r26,0r0,157v0,73,48,81,67,81v19,0,68,-8,68,-81r0,-157r26,0xm124,-266r-47,-52r32,0r36,52r-21,0","w":246},"\u00dd":{"d":"116,-110r0,110r-26,0r0,-110r-95,-145r32,0r76,120r76,-120r33,0xm150,-318r-47,52r-22,0r36,-52r33,0","w":206,"k":{"v":20,"A":27,"\u00c6":27,"\u00c1":27,"\u00c2":27,"\u00c4":27,"\u00c0":27,"\u00c5":27,"\u00c3":27,",":44,".":36,"e":33,"\u00e9":33,"\u00ea":33,"\u00eb":33,"\u00e8":33,"o":33,"\u00f8":33,"\u0153":33,"\u00f3":33,"\u00f4":33,"\u00f6":33,"\u00f2":33,"\u00f5":33,"q":33,"-":40,"a":33,"\u00e6":33,"\u00e1":33,"\u00e2":33,"\u00e4":33,"\u00e0":33,"\u00e5":33,"\u00e3":33,"i":3,"\u00ed":3,"\u00ee":3,"\u00ef":3,"\u00ec":3,"u":27,"\u00fa":27,"\u00fb":27,"\u00fc":27,"\u00f9":27,":":33,";":33,"p":27}},"\u0178":{"d":"116,-110r0,110r-26,0r0,-110r-95,-145r32,0r76,120r76,-120r33,0xm50,-296v0,-9,8,-18,19,-18v11,0,18,9,18,18v0,9,-7,18,-18,18v-11,0,-19,-9,-19,-18xm120,-296v0,-9,7,-18,18,-18v11,0,18,9,18,18v0,9,-7,18,-18,18v-11,0,-18,-9,-18,-18","w":206,"k":{"v":20,"A":27,"\u00c6":27,"\u00c1":27,"\u00c2":27,"\u00c4":27,"\u00c0":27,"\u00c5":27,"\u00c3":27,",":44,".":36,"e":33,"\u00e9":33,"\u00ea":33,"\u00eb":33,"\u00e8":33,"o":33,"\u00f8":33,"\u0153":33,"\u00f3":33,"\u00f4":33,"\u00f6":33,"\u00f2":33,"\u00f5":33,"q":33,"-":40,"a":33,"\u00e6":33,"\u00e1":33,"\u00e2":33,"\u00e4":33,"\u00e0":33,"\u00e5":33,"\u00e3":33,"i":3,"\u00ed":3,"\u00ee":3,"\u00ef":3,"\u00ec":3,"u":27,"\u00fa":27,"\u00fb":27,"\u00fc":27,"\u00f9":27,":":33,";":33,"p":27}},"\u017d":{"d":"190,-255r0,22r-149,209r151,0r0,24r-184,0r0,-22r149,-209r-147,0r0,-24r180,0xm154,-318r-40,52r-28,0r-40,-52r24,0r30,39r30,-39r24,0"},"\u00e1":{"d":"17,-45v0,-59,69,-58,117,-58v8,-59,-67,-58,-95,-28r-14,-17v32,-36,133,-40,133,35r0,75v0,13,2,29,3,38r-23,0v-1,-8,-3,-18,-3,-27v-23,46,-118,43,-118,-18xm134,-84v-33,0,-91,-2,-91,36v0,22,21,31,40,31v39,-1,54,-29,51,-67xm140,-255r-47,52r-21,0r36,-52r32,0","w":186},"\u00e2":{"d":"17,-45v0,-59,69,-58,117,-58v8,-59,-67,-58,-95,-28r-14,-17v32,-36,133,-40,133,35r0,75v0,13,2,29,3,38r-23,0v-1,-8,-3,-18,-3,-27v-23,46,-118,43,-118,-18xm134,-84v-33,0,-91,-2,-91,36v0,22,21,31,40,31v39,-1,54,-29,51,-67xm108,-255r39,52r-24,0r-29,-39r-30,39r-24,0r39,-52r29,0","w":186},"\u00e4":{"d":"17,-45v0,-59,69,-58,117,-58v8,-59,-67,-58,-95,-28r-14,-17v32,-36,133,-40,133,35r0,75v0,13,2,29,3,38r-23,0v-1,-8,-3,-18,-3,-27v-23,46,-118,43,-118,-18xm134,-84v-33,0,-91,-2,-91,36v0,22,21,31,40,31v39,-1,54,-29,51,-67xm59,-215v-23,0,-24,-36,0,-36v23,0,24,36,0,36xm128,-215v-23,0,-24,-36,0,-36v24,0,25,36,0,36","w":186},"\u00e0":{"d":"17,-45v0,-59,69,-58,117,-58v8,-59,-67,-58,-95,-28r-14,-17v32,-36,133,-40,133,35r0,75v0,13,2,29,3,38r-23,0v-1,-8,-3,-18,-3,-27v-23,46,-118,43,-118,-18xm134,-84v-33,0,-91,-2,-91,36v0,22,21,31,40,31v39,-1,54,-29,51,-67xm94,-203r-47,-52r33,0r36,52r-22,0","w":186},"\u00e5":{"d":"17,-45v0,-59,69,-58,117,-58v8,-59,-67,-58,-95,-28r-14,-17v32,-36,133,-40,133,35r0,75v0,13,2,29,3,38r-23,0v-1,-8,-3,-18,-3,-27v-23,46,-118,43,-118,-18xm134,-84v-33,0,-91,-2,-91,36v0,22,21,31,40,31v39,-1,54,-29,51,-67xm128,-234v0,19,-15,34,-34,34v-19,0,-35,-15,-35,-34v0,-19,16,-34,35,-34v19,0,34,15,34,34xm115,-234v0,-12,-9,-21,-21,-21v-12,0,-22,9,-22,21v0,12,10,21,22,21v12,0,21,-9,21,-21","w":186},"\u00e3":{"d":"17,-45v0,-59,69,-58,117,-58v8,-59,-67,-58,-95,-28r-14,-17v32,-36,133,-40,133,35r0,75v0,13,2,29,3,38r-23,0v-1,-8,-3,-18,-3,-27v-23,46,-118,43,-118,-18xm134,-84v-33,0,-91,-2,-91,36v0,22,21,31,40,31v39,-1,54,-29,51,-67xm119,-209v-23,0,-61,-34,-68,2r-16,0v3,-19,11,-38,33,-38v24,0,61,36,68,-1r16,0v-3,19,-11,37,-33,37","w":186},"\u00e7":{"d":"168,-144r-19,15v-29,-44,-114,-15,-106,45v-7,60,77,90,106,44r19,15v-18,20,-38,30,-64,29r-13,18v18,-8,41,2,41,24v0,36,-49,39,-76,23r6,-12v16,8,46,11,49,-10v0,-4,-3,-15,-18,-15v-11,0,-18,7,-23,-2r20,-27v-45,-6,-73,-42,-73,-87v0,-79,102,-121,151,-60","w":173},"\u00e9":{"d":"183,-78r-141,0v-1,62,90,80,116,32r19,15v-48,66,-160,33,-160,-53v0,-51,37,-89,85,-89v55,0,84,40,81,95xm43,-97r114,0v0,-32,-21,-54,-55,-54v-31,0,-59,26,-59,54xm147,-255r-48,52r-21,0r36,-52r33,0"},"\u00ea":{"d":"183,-78r-141,0v-1,62,90,80,116,32r19,15v-48,66,-160,33,-160,-53v0,-51,37,-89,85,-89v55,0,84,40,81,95xm43,-97r114,0v0,-32,-21,-54,-55,-54v-31,0,-59,26,-59,54xm114,-255r40,52r-24,0r-30,-39r-30,39r-24,0r40,-52r28,0"},"\u00eb":{"d":"183,-78r-141,0v-1,62,90,80,116,32r19,15v-48,66,-160,33,-160,-53v0,-51,37,-89,85,-89v55,0,84,40,81,95xm43,-97r114,0v0,-32,-21,-54,-55,-54v-31,0,-59,26,-59,54xm66,-215v-24,0,-25,-36,0,-36v23,0,24,36,0,36xm135,-215v-24,0,-25,-36,0,-36v23,0,24,36,0,36"},"\u00e8":{"d":"183,-78r-141,0v-1,62,90,80,116,32r19,15v-48,66,-160,33,-160,-53v0,-51,37,-89,85,-89v55,0,84,40,81,95xm43,-97r114,0v0,-32,-21,-54,-55,-54v-31,0,-59,26,-59,54xm101,-203r-48,-52r33,0r36,52r-21,0"},"\u00ed":{"d":"55,-168r0,168r-24,0r0,-168r24,0xm90,-255r-48,52r-21,0r36,-52r33,0","w":86},"\u00ee":{"d":"55,-168r0,168r-24,0r0,-168r24,0xm58,-255r39,52r-24,0r-30,-39r-30,39r-23,0r39,-52r29,0","w":86},"\u00ef":{"d":"55,-168r0,168r-24,0r0,-168r24,0xm9,-215v-24,0,-25,-36,0,-36v23,0,24,36,0,36xm78,-215v-24,0,-25,-36,0,-36v23,0,24,36,0,36","w":86},"\u00ec":{"d":"55,-168r0,168r-24,0r0,-168r24,0xm44,-203r-48,-52r33,0r36,52r-21,0","w":86},"\u00f1":{"d":"24,-168r25,0v1,9,1,18,1,27v10,-18,35,-32,57,-32v84,0,60,97,63,173r-23,0v-5,-60,21,-154,-46,-151v-5,0,-51,3,-51,65r0,86r-24,0xm125,-209v-23,0,-61,-34,-68,2r-15,0v3,-19,11,-38,33,-38v24,0,60,36,68,-1r15,0v-3,19,-11,37,-33,37"},"\u00f3":{"d":"196,-84v0,51,-36,88,-89,88v-52,0,-90,-37,-90,-88v0,-51,38,-89,90,-89v53,0,89,38,89,89xm170,-84v0,-38,-24,-67,-63,-67v-39,0,-64,29,-64,67v0,38,25,67,64,67v39,0,63,-29,63,-67xm154,-255r-48,52r-21,0r36,-52r33,0","w":213},"\u00f4":{"d":"196,-84v0,51,-36,88,-89,88v-52,0,-90,-37,-90,-88v0,-51,38,-89,90,-89v53,0,89,38,89,89xm170,-84v0,-38,-24,-67,-63,-67v-39,0,-64,29,-64,67v0,38,25,67,64,67v39,0,63,-29,63,-67xm121,-255r40,52r-24,0r-30,-39r-30,39r-24,0r40,-52r28,0","w":213},"\u00f6":{"d":"196,-84v0,51,-36,88,-89,88v-52,0,-90,-37,-90,-88v0,-51,38,-89,90,-89v53,0,89,38,89,89xm170,-84v0,-38,-24,-67,-63,-67v-39,0,-64,29,-64,67v0,38,25,67,64,67v39,0,63,-29,63,-67xm72,-215v-23,0,-24,-36,0,-36v24,0,25,36,0,36xm141,-215v-23,0,-24,-36,0,-36v24,0,25,36,0,36","w":213},"\u00f2":{"d":"196,-84v0,51,-36,88,-89,88v-52,0,-90,-37,-90,-88v0,-51,38,-89,90,-89v53,0,89,38,89,89xm170,-84v0,-38,-24,-67,-63,-67v-39,0,-64,29,-64,67v0,38,25,67,64,67v39,0,63,-29,63,-67xm108,-203r-48,-52r33,0r36,52r-21,0","w":213},"\u00f5":{"d":"196,-84v0,51,-36,88,-89,88v-52,0,-90,-37,-90,-88v0,-51,38,-89,90,-89v53,0,89,38,89,89xm170,-84v0,-38,-24,-67,-63,-67v-39,0,-64,29,-64,67v0,38,25,67,64,67v39,0,63,-29,63,-67xm132,-209v-23,0,-61,-34,-68,2r-15,0v3,-19,11,-38,33,-38v24,0,60,36,68,-1r15,0v-3,19,-11,37,-33,37","w":213},"\u0161":{"d":"136,-143r-21,14v-9,-28,-68,-32,-71,3v-3,23,34,27,57,32v23,5,41,22,41,46v0,65,-102,68,-130,20r20,-14v10,15,25,25,45,25v19,0,39,-9,39,-28v-11,-49,-98,-11,-98,-77v0,-60,95,-68,118,-21xm130,-255r-39,52r-29,0r-39,-52r24,0r30,39r30,-39r23,0","w":153},"\u00fa":{"d":"172,0r-24,0v-2,-8,1,-20,-2,-27v-10,18,-35,31,-57,31v-84,0,-60,-97,-63,-172r24,0v5,60,-21,153,45,151v5,0,52,-3,52,-65r0,-86r23,0xm147,-255r-48,52r-21,0r36,-52r33,0"},"\u00fb":{"d":"172,0r-24,0v-2,-8,1,-20,-2,-27v-10,18,-35,31,-57,31v-84,0,-60,-97,-63,-172r24,0v5,60,-21,153,45,151v5,0,52,-3,52,-65r0,-86r23,0xm114,-255r40,52r-24,0r-30,-39r-30,39r-24,0r40,-52r28,0"},"\u00fc":{"d":"172,0r-24,0v-2,-8,1,-20,-2,-27v-10,18,-35,31,-57,31v-84,0,-60,-97,-63,-172r24,0v5,60,-21,153,45,151v5,0,52,-3,52,-65r0,-86r23,0xm66,-215v-24,0,-25,-36,0,-36v23,0,24,36,0,36xm135,-215v-24,0,-25,-36,0,-36v23,0,24,36,0,36"},"\u00f9":{"d":"172,0r-24,0v-2,-8,1,-20,-2,-27v-10,18,-35,31,-57,31v-84,0,-60,-97,-63,-172r24,0v5,60,-21,153,45,151v5,0,52,-3,52,-65r0,-86r23,0xm101,-203r-48,-52r33,0r36,52r-21,0"},"\u00fd":{"d":"36,-168r53,139r51,-139r29,0r-84,212v-11,33,-35,48,-75,40r2,-23v40,19,53,-28,63,-59r-69,-170r30,0xm134,-255r-48,52r-21,0r36,-52r33,0","w":173,"k":{",":33,".":33}},"\u00ff":{"d":"36,-168r53,139r51,-139r29,0r-84,212v-11,33,-35,48,-75,40r2,-23v40,19,53,-28,63,-59r-69,-170r30,0xm52,-215v-23,0,-24,-36,0,-36v24,0,25,36,0,36xm121,-215v-23,0,-24,-36,0,-36v24,0,25,36,0,36","w":173,"k":{",":33,".":33}},"\u017e":{"d":"141,-168r0,17r-98,129r102,0r0,22r-137,0r0,-17r99,-130r-94,0r0,-21r128,0xm130,-255r-39,52r-29,0r-39,-52r24,0r30,39r30,-39r23,0","w":153},"\u2206":{"d":"12,0r0,-17r91,-244r28,0r90,244r0,17r-209,0xm36,-20r159,0r-78,-212r-2,0","w":232},"\u2126":{"d":"18,-20v18,-1,39,2,55,-1v-26,-23,-50,-64,-50,-115v0,-73,48,-122,108,-122v64,0,105,56,105,120v1,55,-26,95,-50,118r55,0r0,20r-85,0r0,-15v28,-19,56,-60,56,-118v0,-48,-27,-105,-81,-105v-51,0,-83,48,-83,106v0,55,27,99,55,117r0,15r-85,0r0,-20","w":259},"\u03bc":{"d":"26,82r0,-250r24,0v5,59,-22,151,45,151v29,0,52,-24,52,-65r0,-86r23,0r2,168r-25,0v-1,-8,2,-21,-1,-27v-15,28,-66,42,-96,21r0,88r-24,0"},"\u03c0":{"d":"194,-168r-30,0v1,50,-4,133,6,168r-23,0v-12,-31,-6,-120,-7,-168r-68,0v-2,48,-13,134,-27,168r-23,0v14,-39,25,-118,27,-168v-23,0,-33,2,-41,5r-4,-16v40,-19,134,-7,193,-10","w":203},"\u20ac":{"d":"179,-222r7,-23v-64,-32,-137,-8,-150,74r-20,0r-7,20r24,0v-2,15,-1,32,0,47r-18,0r-7,20r27,0v1,83,103,119,150,56r-17,-12v-33,43,-105,21,-106,-44r78,0r7,-20r-87,0v-1,-15,-2,-32,0,-47r99,0r7,-20r-102,0v7,-65,70,-81,115,-51"},"\u2113":{"d":"153,-52r12,10v-15,29,-38,45,-66,45v-43,-1,-59,-34,-59,-74v-6,5,-14,11,-21,17r-8,-14v10,-9,20,-16,29,-25r0,-101v0,-66,28,-86,54,-86v30,0,43,26,43,58v0,46,-30,91,-75,135v-3,44,17,70,41,70v23,0,41,-18,50,-35xm93,-262v-35,0,-33,102,-31,150v32,-35,58,-72,58,-109v0,-24,-8,-41,-27,-41","w":173},"\u212e":{"d":"66,-50v36,64,146,59,187,3r21,0v-26,31,-69,51,-116,51v-81,0,-146,-58,-146,-131v0,-73,65,-132,146,-132v82,1,148,59,147,135r-239,2r0,72xm251,-205v-33,-61,-139,-58,-182,-8v-6,21,-4,60,-1,82r183,-2r0,-72","w":317},"\u2202":{"d":"37,-247r-9,-18v68,-47,149,-8,149,118v0,85,-31,150,-93,150v-46,0,-69,-42,-69,-84v0,-57,37,-92,77,-92v34,0,55,24,61,35v8,-97,-54,-159,-116,-109xm86,-17v35,0,59,-46,64,-96v-5,-17,-25,-41,-54,-41v-31,0,-56,33,-56,73v0,37,18,64,46,64","w":195},"\u220f":{"d":"241,-232r-40,0r0,267r-24,0r0,-267r-104,0r0,267r-24,0r0,-267r-40,0r0,-22r232,0r0,22","w":250},"\u2211":{"d":"191,35r-183,0r0,-16r99,-128r-94,-128r0,-17r172,0r0,21r-139,1r88,120r-95,124r152,0r0,23","w":199},"\u2219":{"d":"69,-113v0,10,-7,19,-19,19v-12,0,-19,-9,-19,-19v0,-10,7,-19,19,-19v12,0,19,9,19,19","w":100},"\u221a":{"d":"204,-301r-79,356r-22,0r-59,-170r-26,10r-6,-15r48,-19r47,139v3,8,3,21,7,26r72,-327r18,0","w":205},"\u221e":{"d":"210,-161v31,0,52,23,52,56v0,35,-27,56,-55,56v-23,0,-40,-15,-66,-43v-19,22,-39,43,-69,43v-29,0,-54,-24,-54,-55v0,-32,25,-57,57,-57v27,0,48,22,67,44v19,-21,38,-44,68,-44xm35,-104v0,22,16,40,40,40v23,0,42,-24,57,-40v-16,-20,-34,-41,-60,-41v-23,0,-37,19,-37,41xm208,-145v-25,0,-45,27,-58,40v24,26,39,41,58,41v23,0,37,-21,37,-40v0,-26,-16,-41,-37,-41","w":280},"\u222b":{"d":"50,-220v0,-63,21,-101,71,-85r-4,17v-37,-13,-46,21,-45,71v0,57,5,126,5,184v0,69,-21,101,-73,85r5,-18v36,12,47,-12,46,-67v0,-59,-5,-130,-5,-187","w":126},"\u2248":{"d":"66,-156v44,0,83,57,110,1r10,9v-9,19,-23,34,-46,34v-24,0,-50,-28,-76,-28v-17,0,-27,13,-36,27r-11,-8v11,-21,28,-35,49,-35xm66,-95v45,0,83,58,110,1r10,8v-9,19,-23,34,-46,34v-24,0,-51,-27,-76,-28v-17,0,-27,14,-36,28r-11,-9v11,-21,28,-34,49,-34","w":203},"\u2260":{"d":"144,-182r-17,36r58,0r0,16r-64,0r-25,54r89,0r0,16r-96,0r-20,42r-12,-6r17,-36r-55,0r0,-16r62,0r24,-54r-86,0r0,-16r93,0r19,-42","w":203},"\u2264":{"d":"184,-35r-163,-82r0,-17r163,-81r0,19r-145,71r145,71r0,19xm185,-3r-166,0r0,-17r166,0r0,17","w":203},"\u2265":{"d":"21,-215r163,81r0,17r-163,82r0,-19r146,-71r-146,-71r0,-19xm185,-3r-166,0r0,-17r166,0r0,17","w":203},"\u25ca":{"d":"185,-127r-73,143r-19,0r-73,-143r73,-143r20,0xm163,-126v-19,-41,-45,-77,-60,-123r-61,122v19,41,45,78,60,123","w":205},"\u00a0":{"w":100},"\u00ad":{"d":"106,-98r0,23r-92,0r0,-23r92,0","w":119},"\u02c9":{"d":"92,-235r0,19r-97,0r0,-19r97,0","w":86},"\u03a9":{"d":"18,-20v18,-1,39,2,55,-1v-26,-23,-50,-64,-50,-115v0,-73,48,-122,108,-122v64,0,105,56,105,120v1,55,-26,95,-50,118r55,0r0,20r-85,0r0,-15v28,-19,56,-60,56,-118v0,-48,-27,-105,-81,-105v-51,0,-83,48,-83,106v0,55,27,99,55,117r0,15r-85,0r0,-20","w":259},"\u2215":{"d":"-41,12r-19,-12r162,-266r19,11","w":60}}});


/*
 * FancyBox - jQuery Plugin
 * Simple and fancy lightbox alternative
 *
 * Examples and documentation at: http://fancybox.net
 *
 * Copyright (c) 2008 - 2010 Janis Skarnelis
 * That said, it is hardly a one-person project. Many people have submitted bugs, code, and offered their advice freely. Their support is greatly appreciated.
 *
 * Version: 1.3.4 (11/11/2010)
 * Requires: jQuery v1.3+
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

;(function(jQuery) {
	var tmp, loading, overlay, wrap, outer, content, close, title, nav_left, nav_right,

		selectedIndex = 0, selectedOpts = {}, selectedArray = [], currentIndex = 0, currentOpts = {}, currentArray = [],

		ajaxLoader = null, imgPreloader = new Image(), imgRegExp = /\.(jpg|gif|png|bmp|jpeg)(.*)?jQuery/i, swfRegExp = /[^\.]\.(swf)\s*jQuery/i,

		loadingTimer, loadingFrame = 1,

		titleHeight = 0, titleStr = '', start_pos, final_pos, busy = false, fx = jQuery.extend(jQuery('<div/>')[0], { prop: 0 }),

		isIE6 = jQuery.browser.msie && jQuery.browser.version < 7 && !window.XMLHttpRequest,

		/*
		 * Private methods 
		 */

		_abort = function() {
			loading.hide();

			imgPreloader.onerror = imgPreloader.onload = null;

			if (ajaxLoader) {
				ajaxLoader.abort();
			}

			tmp.empty();
		},

		_error = function() {
			if (false === selectedOpts.onError(selectedArray, selectedIndex, selectedOpts)) {
				loading.hide();
				busy = false;
				return;
			}

			selectedOpts.titleShow = false;

			selectedOpts.width = 'auto';
			selectedOpts.height = 'auto';

			tmp.html( '<p id="fancybox-error">The requested content cannot be loaded.<br />Please try again later.</p>' );

			_process_inline();
		},

		_start = function() {
			var obj = selectedArray[ selectedIndex ],
				href, 
				type, 
				title,
				str,
				emb,
				ret;

			_abort();

			selectedOpts = jQuery.extend({}, jQuery.fn.fancybox.defaults, (typeof jQuery(obj).data('fancybox') == 'undefined' ? selectedOpts : jQuery(obj).data('fancybox')));

			ret = selectedOpts.onStart(selectedArray, selectedIndex, selectedOpts);

			if (ret === false) {
				busy = false;
				return;
			} else if (typeof ret == 'object') {
				selectedOpts = jQuery.extend(selectedOpts, ret);
			}

			title = selectedOpts.title || (obj.nodeName ? jQuery(obj).attr('title') : obj.title) || '';

			if (obj.nodeName && !selectedOpts.orig) {
				selectedOpts.orig = jQuery(obj).children("img:first").length ? jQuery(obj).children("img:first") : jQuery(obj);
			}

			if (title === '' && selectedOpts.orig && selectedOpts.titleFromAlt) {
				title = selectedOpts.orig.attr('alt');
			}

			href = selectedOpts.href || (obj.nodeName ? jQuery(obj).attr('href') : obj.href) || null;

			if ((/^(?:javascript)/i).test(href) || href == '#') {
				href = null;
			}

			if (selectedOpts.type) {
				type = selectedOpts.type;

				if (!href) {
					href = selectedOpts.content;
				}

			} else if (selectedOpts.content) {
				type = 'html';

			} else if (href) {
				if (href.match(imgRegExp)) {
					type = 'image';

				} else if (href.match(swfRegExp)) {
					type = 'swf';

				} else if (jQuery(obj).hasClass("iframe")) {
					type = 'iframe';

				} else if (href.indexOf("#") === 0) {
					type = 'inline';

				} else {
					type = 'ajax';
				}
			}

			if (!type) {
				_error();
				return;
			}

			if (type == 'inline') {
				obj	= href.substr(href.indexOf("#"));
				type = jQuery(obj).length > 0 ? 'inline' : 'ajax';
			}

			selectedOpts.type = type;
			selectedOpts.href = href;
			selectedOpts.title = title;

			if (selectedOpts.autoDimensions) {
				if (selectedOpts.type == 'html' || selectedOpts.type == 'inline' || selectedOpts.type == 'ajax') {
					selectedOpts.width = 'auto';
					selectedOpts.height = 'auto';
				} else {
					selectedOpts.autoDimensions = false;	
				}
			}

			if (selectedOpts.modal) {
				selectedOpts.overlayShow = true;
				selectedOpts.hideOnOverlayClick = false;
				selectedOpts.hideOnContentClick = false;
				selectedOpts.enableEscapeButton = false;
				selectedOpts.showCloseButton = false;
			}

			selectedOpts.padding = parseInt(selectedOpts.padding, 10);
			selectedOpts.margin = parseInt(selectedOpts.margin, 10);

			tmp.css('padding', (selectedOpts.padding + selectedOpts.margin));

			jQuery('.fancybox-inline-tmp').unbind('fancybox-cancel').bind('fancybox-change', function() {
				jQuery(this).replaceWith(content.children());				
			});

			switch (type) {
				case 'html' :
					tmp.html( selectedOpts.content );
					_process_inline();
				break;

				case 'inline' :
					if ( jQuery(obj).parent().is('#fancybox-content') === true) {
						busy = false;
						return;
					}

					jQuery('<div class="fancybox-inline-tmp" />')
						.hide()
						.insertBefore( jQuery(obj) )
						.bind('fancybox-cleanup', function() {
							jQuery(this).replaceWith(content.children());
						}).bind('fancybox-cancel', function() {
							jQuery(this).replaceWith(tmp.children());
						});

					jQuery(obj).appendTo(tmp);

					_process_inline();
				break;

				case 'image':
					busy = false;

					jQuery.fancybox.showActivity();

					imgPreloader = new Image();

					imgPreloader.onerror = function() {
						_error();
					};

					imgPreloader.onload = function() {
						busy = true;

						imgPreloader.onerror = imgPreloader.onload = null;

						_process_image();
					};

					imgPreloader.src = href;
				break;

				case 'swf':
					selectedOpts.scrolling = 'no';

					str = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + selectedOpts.width + '" height="' + selectedOpts.height + '"><param name="movie" value="' + href + '"></param>';
					emb = '';

					jQuery.each(selectedOpts.swf, function(name, val) {
						str += '<param name="' + name + '" value="' + val + '"></param>';
						emb += ' ' + name + '="' + val + '"';
					});

					str += '<embed src="' + href + '" type="application/x-shockwave-flash" width="' + selectedOpts.width + '" height="' + selectedOpts.height + '"' + emb + '></embed></object>';

					tmp.html(str);

					_process_inline();
				break;

				case 'ajax':
					busy = false;

					jQuery.fancybox.showActivity();

					selectedOpts.ajax.win = selectedOpts.ajax.success;

					ajaxLoader = jQuery.ajax(jQuery.extend({}, selectedOpts.ajax, {
						url	: href,
						data : selectedOpts.ajax.data || {},
						error : function(XMLHttpRequest, textStatus, errorThrown) {
							if ( XMLHttpRequest.status > 0 ) {
								_error();
							}
						},
						success : function(data, textStatus, XMLHttpRequest) {
							var o = typeof XMLHttpRequest == 'object' ? XMLHttpRequest : ajaxLoader;
							if ( typeof selectedOpts.ajax.win == 'function' ) {
								ret = selectedOpts.ajax.win(href, data, textStatus, XMLHttpRequest);

								if (ret === false) {
									loading.hide();
									return;
								} else if (typeof ret == 'string' || typeof ret == 'object') {
									data = ret;
								}
							}

							tmp.html( data );
							_process_inline();
						}
					}));

				break;

				case 'iframe':
					_show();
				break;
			}
		},

		_process_inline = function() {
			var
				w = selectedOpts.width,
				h = selectedOpts.height;

			if (w.toString().indexOf('%') > -1) {
				w = parseInt( (jQuery(window).width() - (selectedOpts.margin * 2)) * parseFloat(w) / 100, 10) + 'px';

			} else {
				w = w == 'auto' ? 'auto' : w + 'px';	
			}

			if (h.toString().indexOf('%') > -1) {
				h = parseInt( (jQuery(window).height() - (selectedOpts.margin * 2)) * parseFloat(h) / 100, 10) + 'px';

			} else {
				h = h == 'auto' ? 'auto' : h + 'px';	
			}

			tmp.wrapInner('<div style="width:' + w + ';height:' + h + ';overflow: ' + (selectedOpts.scrolling == 'auto' ? 'auto' : (selectedOpts.scrolling == 'yes' ? 'scroll' : 'hidden')) + ';position:relative;"></div>');

			selectedOpts.width = tmp.width();
			selectedOpts.height = tmp.height();

			_show();
		},

		_process_image = function() {
			selectedOpts.width = imgPreloader.width;
			selectedOpts.height = imgPreloader.height;

			jQuery("<img />").attr({
				'id' : 'fancybox-img',
				'src' : imgPreloader.src,
				'alt' : selectedOpts.title
			}).appendTo( tmp );

			_show();
		},

		_show = function() {
			var pos, equal;

			loading.hide();

			if (wrap.is(":visible") && false === currentOpts.onCleanup(currentArray, currentIndex, currentOpts)) {
				jQuery.event.trigger('fancybox-cancel');

				busy = false;
				return;
			}

			busy = true;

			jQuery(content.add( overlay )).unbind();

			jQuery(window).unbind("resize.fb scroll.fb");
			jQuery(document).unbind('keydown.fb');

			if (wrap.is(":visible") && currentOpts.titlePosition !== 'outside') {
				wrap.css('height', wrap.height());
			}

			currentArray = selectedArray;
			currentIndex = selectedIndex;
			currentOpts = selectedOpts;

			if (currentOpts.overlayShow) {
				overlay.css({
					'background-color' : currentOpts.overlayColor,
					'opacity' : currentOpts.overlayOpacity,
					'cursor' : currentOpts.hideOnOverlayClick ? 'pointer' : 'auto',
					'height' : jQuery(document).height()
				});

				if (!overlay.is(':visible')) {
					if (isIE6) {
						jQuery('select:not(#fancybox-tmp select)').filter(function() {
							return this.style.visibility !== 'hidden';
						}).css({'visibility' : 'hidden'}).one('fancybox-cleanup', function() {
							this.style.visibility = 'inherit';
						});
					}

					overlay.show();
				}
			} else {
				overlay.hide();
			}

			final_pos = _get_zoom_to();

			_process_title();

			if (wrap.is(":visible")) {
				jQuery( close.add( nav_left ).add( nav_right ) ).hide();

				pos = wrap.position(),

				start_pos = {
					top	 : pos.top,
					left : pos.left,
					width : wrap.width(),
					height : wrap.height()
				};

				equal = (start_pos.width == final_pos.width && start_pos.height == final_pos.height);

				content.fadeTo(currentOpts.changeFade, 0.3, function() {
					var finish_resizing = function() {
						content.html( tmp.contents() ).fadeTo(currentOpts.changeFade, 1, _finish);
					};

					jQuery.event.trigger('fancybox-change');

					content
						.empty()
						.removeAttr('filter')
						.css({
							'border-width' : currentOpts.padding,
							'width'	: final_pos.width - currentOpts.padding * 2,
							'height' : selectedOpts.autoDimensions ? 'auto' : final_pos.height - titleHeight - currentOpts.padding * 2
						});

					if (equal) {
						finish_resizing();

					} else {
						fx.prop = 0;

						jQuery(fx).animate({prop: 1}, {
							 duration : currentOpts.changeSpeed,
							 easing : currentOpts.easingChange,
							 step : _draw,
							 complete : finish_resizing
						});
					}
				});

				return;
			}

			wrap.removeAttr("style");

			content.css('border-width', currentOpts.padding);

			if (currentOpts.transitionIn == 'elastic') {
				start_pos = _get_zoom_from();

				content.html( tmp.contents() );

				wrap.show();

				if (currentOpts.opacity) {
					final_pos.opacity = 0;
				}

				fx.prop = 0;

				jQuery(fx).animate({prop: 1}, {
					 duration : currentOpts.speedIn,
					 easing : currentOpts.easingIn,
					 step : _draw,
					 complete : _finish
				});

				return;
			}

			if (currentOpts.titlePosition == 'inside' && titleHeight > 0) {	
				title.show();	
			}

			content
				.css({
					'width' : final_pos.width - currentOpts.padding * 2,
					'height' : selectedOpts.autoDimensions ? 'auto' : final_pos.height - titleHeight - currentOpts.padding * 2
				})
				.html( tmp.contents() );

			wrap
				.css(final_pos)
				.fadeIn( currentOpts.transitionIn == 'none' ? 0 : currentOpts.speedIn, _finish );
				
			currentOpts.onLoad();
		},

		_format_title = function(title) {
			if (title && title.length) {
				if (currentOpts.titlePosition == 'float') {
					return '<table id="fancybox-title-float-wrap" cellpadding="0" cellspacing="0"><tr><td id="fancybox-title-float-left"></td><td id="fancybox-title-float-main">' + title + '</td><td id="fancybox-title-float-right"></td></tr></table>';
				}

				return '<div id="fancybox-title-' + currentOpts.titlePosition + '">' + title + '</div>';
			}

			return false;
		},

		_process_title = function() {
			titleStr = currentOpts.title || '';
			titleHeight = 0;

			title
				.empty()
				.removeAttr('style')
				.removeClass();

			if (currentOpts.titleShow === false) {
				title.hide();
				return;
			}

			titleStr = jQuery.isFunction(currentOpts.titleFormat) ? currentOpts.titleFormat(titleStr, currentArray, currentIndex, currentOpts) : _format_title(titleStr);

			if (!titleStr || titleStr === '') {
				title.hide();
				return;
			}

			title
				.addClass('fancybox-title-' + currentOpts.titlePosition)
				.html( titleStr )
				.appendTo( 'body' )
				.show();

			switch (currentOpts.titlePosition) {
				case 'inside':
					title
						.css({
							'width' : final_pos.width - (currentOpts.padding * 2),
							'marginLeft' : currentOpts.padding,
							'marginRight' : currentOpts.padding
						});

					titleHeight = title.outerHeight(true);

					title.appendTo( outer );

					final_pos.height += titleHeight;
				break;

				case 'over':
					title
						.css({
							'marginLeft' : currentOpts.padding,
							'width'	: final_pos.width - (currentOpts.padding * 2),
							'bottom' : currentOpts.padding
						})
						.appendTo( outer );
				break;

				case 'float':
					title
						.css('left', parseInt((title.width() - final_pos.width - 40)/ 2, 10) * -1)
						.appendTo( wrap );
				break;

				default:
					title
						.css({
							'width' : final_pos.width - (currentOpts.padding * 2),
							'paddingLeft' : currentOpts.padding,
							'paddingRight' : currentOpts.padding
						})
						.appendTo( wrap );
				break;
			}

			title.hide();
		},

		_set_navigation = function() {
			if (currentOpts.enableEscapeButton || currentOpts.enableKeyboardNav) {
				jQuery(document).bind('keydown.fb', function(e) {
					if (e.keyCode == 27 && currentOpts.enableEscapeButton) {
						e.preventDefault();
						jQuery.fancybox.close();

					} else if ((e.keyCode == 37 || e.keyCode == 39) && currentOpts.enableKeyboardNav && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
						e.preventDefault();
						jQuery.fancybox[ e.keyCode == 37 ? 'prev' : 'next']();
					}
				});
			}

			if (!currentOpts.showNavArrows) { 
				nav_left.hide();
				nav_right.hide();
				return;
			}

			if ((currentOpts.cyclic && currentArray.length > 1) || currentIndex !== 0) {
				nav_left.show();
			}

			if ((currentOpts.cyclic && currentArray.length > 1) || currentIndex != (currentArray.length -1)) {
				nav_right.show();
			}
		},

		_finish = function () {
			if (!jQuery.support.opacity) {
				content.get(0).style.removeAttribute('filter');
				wrap.get(0).style.removeAttribute('filter');
			}

			if (selectedOpts.autoDimensions) {
				content.css('height', 'auto');
			}

			wrap.css('height', 'auto');

			if (titleStr && titleStr.length) {
				title.show();
			}

			if (currentOpts.showCloseButton) {
				close.show();
			}

			_set_navigation();
	
			if (currentOpts.hideOnContentClick)	{
				content.bind('click', jQuery.fancybox.close);
			}

			if (currentOpts.hideOnOverlayClick)	{
				overlay.bind('click', jQuery.fancybox.close);
			}

			jQuery(window).bind("resize.fb", jQuery.fancybox.resize);

			if (currentOpts.centerOnScroll) {
				jQuery(window).bind("scroll.fb", jQuery.fancybox.center);
			}

			if (currentOpts.type == 'iframe') {
				jQuery('<iframe id="fancybox-frame" name="fancybox-frame' + new Date().getTime() + '" frameborder="0" hspace="0" ' + (jQuery.browser.msie ? 'allowtransparency="true""' : '') + ' scrolling="' + selectedOpts.scrolling + '" src="' + currentOpts.href + '"></iframe>').appendTo(content);
			}

			wrap.show();

			busy = false;

			jQuery.fancybox.center();

			currentOpts.onComplete(currentArray, currentIndex, currentOpts);

			_preload_images();
		},

		_preload_images = function() {
			var href, 
				objNext;

			if ((currentArray.length -1) > currentIndex) {
				href = currentArray[ currentIndex + 1 ].href;

				if (typeof href !== 'undefined' && href.match(imgRegExp)) {
					objNext = new Image();
					objNext.src = href;
				}
			}

			if (currentIndex > 0) {
				href = currentArray[ currentIndex - 1 ].href;

				if (typeof href !== 'undefined' && href.match(imgRegExp)) {
					objNext = new Image();
					objNext.src = href;
				}
			}
		},

		_draw = function(pos) {
			var dim = {
				width : parseInt(start_pos.width + (final_pos.width - start_pos.width) * pos, 10),
				height : parseInt(start_pos.height + (final_pos.height - start_pos.height) * pos, 10),

				top : parseInt(start_pos.top + (final_pos.top - start_pos.top) * pos, 10),
				left : parseInt(start_pos.left + (final_pos.left - start_pos.left) * pos, 10)
			};

			if (typeof final_pos.opacity !== 'undefined') {
				dim.opacity = pos < 0.5 ? 0.5 : pos;
			}

			wrap.css(dim);

			content.css({
				'width' : dim.width - currentOpts.padding * 2,
				'height' : dim.height - (titleHeight * pos) - currentOpts.padding * 2
			});
		},

		_get_viewport = function() {
			return [
				jQuery(window).width() - (currentOpts.margin * 2),
				jQuery(window).height() - (currentOpts.margin * 2),
				jQuery(document).scrollLeft() + currentOpts.margin,
				jQuery(document).scrollTop() + currentOpts.margin
			];
		},

		_get_zoom_to = function () {
			var view = _get_viewport(),
				to = {},
				resize = currentOpts.autoScale,
				double_padding = currentOpts.padding * 2,
				ratio;

			if (currentOpts.width.toString().indexOf('%') > -1) {
				to.width = parseInt((view[0] * parseFloat(currentOpts.width)) / 100, 10);
			} else {
				to.width = currentOpts.width + double_padding;
			}

			if (currentOpts.height.toString().indexOf('%') > -1) {
				to.height = parseInt((view[1] * parseFloat(currentOpts.height)) / 100, 10);
			} else {
				to.height = currentOpts.height + double_padding;
			}

			if (resize && (to.width > view[0] || to.height > view[1])) {
				if (selectedOpts.type == 'image' || selectedOpts.type == 'swf') {
					ratio = (currentOpts.width ) / (currentOpts.height );

					if ((to.width ) > view[0]) {
						to.width = view[0];
						to.height = parseInt(((to.width - double_padding) / ratio) + double_padding, 10);
					}

					if ((to.height) > view[1]) {
						to.height = view[1];
						to.width = parseInt(((to.height - double_padding) * ratio) + double_padding, 10);
					}

				} else {
					to.width = Math.min(to.width, view[0]);
					to.height = Math.min(to.height, view[1]);
				}
			}

			to.top = parseInt(Math.max(view[3] - 20, view[3] + ((view[1] - to.height - 40) * 0.5)), 10);
			to.left = parseInt(Math.max(view[2] - 20, view[2] + ((view[0] - to.width - 40) * 0.5)), 10);

			return to;
		},

		_get_obj_pos = function(obj) {
			var pos = obj.offset();

			pos.top += parseInt( obj.css('paddingTop'), 10 ) || 0;
			pos.left += parseInt( obj.css('paddingLeft'), 10 ) || 0;

			pos.top += parseInt( obj.css('border-top-width'), 10 ) || 0;
			pos.left += parseInt( obj.css('border-left-width'), 10 ) || 0;

			pos.width = obj.width();
			pos.height = obj.height();

			return pos;
		},

		_get_zoom_from = function() {
			var orig = selectedOpts.orig ? jQuery(selectedOpts.orig) : false,
				from = {},
				pos,
				view;

			if (orig && orig.length) {
				pos = _get_obj_pos(orig);

				from = {
					width : pos.width + (currentOpts.padding * 2),
					height : pos.height + (currentOpts.padding * 2),
					top	: pos.top - currentOpts.padding - 20,
					left : pos.left - currentOpts.padding - 20
				};

			} else {
				view = _get_viewport();

				from = {
					width : currentOpts.padding * 2,
					height : currentOpts.padding * 2,
					top	: parseInt(view[3] + view[1] * 0.5, 10),
					left : parseInt(view[2] + view[0] * 0.5, 10)
				};
			}

			return from;
		},

		_animate_loading = function() {
			if (!loading.is(':visible')){
				clearInterval(loadingTimer);
				return;
			}

			jQuery('div', loading).css('top', (loadingFrame * -40) + 'px');

			loadingFrame = (loadingFrame + 1) % 12;
		};

	/*
	 * Public methods 
	 */

	jQuery.fn.fancybox = function(options) {
		if (!jQuery(this).length) {
			return this;
		}

		jQuery(this)
			.data('fancybox', jQuery.extend({}, options, (jQuery.metadata ? jQuery(this).metadata() : {})))
			.unbind('click.fb')
			.bind('click.fb', function(e) {
				e.preventDefault();

				if (busy) {
					return;
				}

				busy = true;

				jQuery(this).blur();

				selectedArray = [];
				selectedIndex = 0;

				var rel = jQuery(this).attr('rel') || '';

				if (!rel || rel == '' || rel === 'nofollow') {
					selectedArray.push(this);

				} else {
					selectedArray = jQuery("a[rel=" + rel + "], area[rel=" + rel + "]");
					selectedIndex = selectedArray.index( this );
				}

				_start();

				return;
			});

		return this;
	};

	jQuery.fancybox = function(obj) {
		var opts;

		if (busy) {
			return;
		}

		busy = true;
		opts = typeof arguments[1] !== 'undefined' ? arguments[1] : {};

		selectedArray = [];
		selectedIndex = parseInt(opts.index, 10) || 0;

		if (jQuery.isArray(obj)) {
			for (var i = 0, j = obj.length; i < j; i++) {
				if (typeof obj[i] == 'object') {
					jQuery(obj[i]).data('fancybox', jQuery.extend({}, opts, obj[i]));
				} else {
					obj[i] = jQuery({}).data('fancybox', jQuery.extend({content : obj[i]}, opts));
				}
			}

			selectedArray = jQuery.merge(selectedArray, obj);

		} else {
			if (typeof obj == 'object') {
				jQuery(obj).data('fancybox', jQuery.extend({}, opts, obj));
			} else {
				obj = jQuery({}).data('fancybox', jQuery.extend({content : obj}, opts));
			}

			selectedArray.push(obj);
		}

		if (selectedIndex > selectedArray.length || selectedIndex < 0) {
			selectedIndex = 0;
		}

		_start();
	};

	jQuery.fancybox.showActivity = function() {
		clearInterval(loadingTimer);

		loading.show();
		loadingTimer = setInterval(_animate_loading, 66);
	};

	jQuery.fancybox.hideActivity = function() {
		loading.hide();
	};

	jQuery.fancybox.next = function() {
		return jQuery.fancybox.pos( currentIndex + 1);
	};

	jQuery.fancybox.prev = function() {
		return jQuery.fancybox.pos( currentIndex - 1);
	};

	jQuery.fancybox.pos = function(pos) {
		if (busy) {
			return;
		}

		pos = parseInt(pos);

		selectedArray = currentArray;

		if (pos > -1 && pos < currentArray.length) {
			selectedIndex = pos;
			_start();

		} else if (currentOpts.cyclic && currentArray.length > 1) {
			selectedIndex = pos >= currentArray.length ? 0 : currentArray.length - 1;
			_start();
		}

		return;
	};

	jQuery.fancybox.cancel = function() {
		if (busy) {
			return;
		}

		busy = true;

		jQuery.event.trigger('fancybox-cancel');

		_abort();

		selectedOpts.onCancel(selectedArray, selectedIndex, selectedOpts);

		busy = false;
	};

	// Note: within an iframe use - parent.jQuery.fancybox.close();
	jQuery.fancybox.close = function() {
		if (busy || wrap.is(':hidden')) {
			return;
		}

		busy = true;

		if (currentOpts && false === currentOpts.onCleanup(currentArray, currentIndex, currentOpts)) {
			busy = false;
			return;
		}

		_abort();

		jQuery(close.add( nav_left ).add( nav_right )).hide();

		jQuery(content.add( overlay )).unbind();

		jQuery(window).unbind("resize.fb scroll.fb");
		jQuery(document).unbind('keydown.fb');

		content.find('iframe').attr('src', isIE6 && /^https/i.test(window.location.href || '') ? 'javascript:void(false)' : 'about:blank');

		if (currentOpts.titlePosition !== 'inside') {
			title.empty();
		}

		wrap.stop();

		function _cleanup() {
			overlay.fadeOut('fast');

			title.empty().hide();
			wrap.hide();

			jQuery.event.trigger('fancybox-cleanup');

			content.empty();

			currentOpts.onClosed(currentArray, currentIndex, currentOpts);

			currentArray = selectedOpts	= [];
			currentIndex = selectedIndex = 0;
			currentOpts = selectedOpts	= {};

			busy = false;
		}

		if (currentOpts.transitionOut == 'elastic') {
			start_pos = _get_zoom_from();

			var pos = wrap.position();

			final_pos = {
				top	 : pos.top ,
				left : pos.left,
				width :	wrap.width(),
				height : wrap.height()
			};

			if (currentOpts.opacity) {
				final_pos.opacity = 1;
			}

			title.empty().hide();

			fx.prop = 1;

			jQuery(fx).animate({ prop: 0 }, {
				 duration : currentOpts.speedOut,
				 easing : currentOpts.easingOut,
				 step : _draw,
				 complete : _cleanup
			});

		} else {
			wrap.fadeOut( currentOpts.transitionOut == 'none' ? 0 : currentOpts.speedOut, _cleanup);
		}
	};

	jQuery.fancybox.resize = function() {
		if (overlay.is(':visible')) {
			overlay.css('height', jQuery(document).height());
		}

		jQuery.fancybox.center(true);
	};

	jQuery.fancybox.center = function() {
		var view, align;

		if (busy) {
			return;	
		}

		align = arguments[0] === true ? 1 : 0;
		view = _get_viewport();

		if (!align && (wrap.width() > view[0] || wrap.height() > view[1])) {
			return;	
		}

		wrap
			.stop()
			.animate({
				'top' : parseInt(Math.max(view[3] - 20, view[3] + ((view[1] - content.height() - 40) * 0.5) - currentOpts.padding)),
				'left' : parseInt(Math.max(view[2] - 20, view[2] + ((view[0] - content.width() - 40) * 0.5) - currentOpts.padding))
			}, typeof arguments[0] == 'number' ? arguments[0] : 200);
	};

	jQuery.fancybox.init = function() {
		if (jQuery("#fancybox-wrap").length) {
			return;
		}

		jQuery('body').append(
			tmp	= jQuery('<div id="fancybox-tmp"></div>'),
			loading	= jQuery('<div id="fancybox-loading"><div></div></div>'),
			overlay	= jQuery('<div id="fancybox-overlay"></div>'),
			wrap = jQuery('<div id="fancybox-wrap"></div>')
		);

		outer = jQuery('<div id="fancybox-outer"></div>')
			.append('<div class="fancybox-bg" id="fancybox-bg-n"></div><div class="fancybox-bg" id="fancybox-bg-ne"></div><div class="fancybox-bg" id="fancybox-bg-e"></div><div class="fancybox-bg" id="fancybox-bg-se"></div><div class="fancybox-bg" id="fancybox-bg-s"></div><div class="fancybox-bg" id="fancybox-bg-sw"></div><div class="fancybox-bg" id="fancybox-bg-w"></div><div class="fancybox-bg" id="fancybox-bg-nw"></div>')
			.appendTo( wrap );

		outer.append(
			content = jQuery('<div id="fancybox-content"></div>'),
			close = jQuery('<a id="fancybox-close"></a>'),
			title = jQuery('<div id="fancybox-title"></div>'),

			nav_left = jQuery('<a href="javascript:;" id="fancybox-left"><span class="fancy-ico" id="fancybox-left-ico"></span></a>'),
			nav_right = jQuery('<a href="javascript:;" id="fancybox-right"><span class="fancy-ico" id="fancybox-right-ico"></span></a>')
		);

		close.click(jQuery.fancybox.close);
		loading.click(jQuery.fancybox.cancel);

		nav_left.click(function(e) {
			e.preventDefault();
			jQuery.fancybox.prev();
		});

		nav_right.click(function(e) {
			e.preventDefault();
			jQuery.fancybox.next();
		});

		if (jQuery.fn.mousewheel) {
			wrap.bind('mousewheel.fb', function(e, delta) {
				if (busy) {
					e.preventDefault();

				} else if (jQuery(e.target).get(0).clientHeight == 0 || jQuery(e.target).get(0).scrollHeight === jQuery(e.target).get(0).clientHeight) {
					e.preventDefault();
					jQuery.fancybox[ delta > 0 ? 'prev' : 'next']();
				}
			});
		}

		if (!jQuery.support.opacity) {
			wrap.addClass('fancybox-ie');
		}

		if (isIE6) {
			loading.addClass('fancybox-ie6');
			wrap.addClass('fancybox-ie6');

			jQuery('<iframe id="fancybox-hide-sel-frame" src="' + (/^https/i.test(window.location.href || '') ? 'javascript:void(false)' : 'about:blank' ) + '" scrolling="no" border="0" frameborder="0" tabindex="-1"></iframe>').prependTo(outer);
		}
	};

	jQuery.fn.fancybox.defaults = {
		padding : 10,
		margin : 40,
		opacity : false,
		modal : false,
		cyclic : false,
		scrolling : 'auto',	// 'auto', 'yes' or 'no'

		width : 560,
		height : 340,

		autoScale : true,
		autoDimensions : true,
		centerOnScroll : false,

		ajax : {},
		swf : { wmode: 'transparent' },

		hideOnOverlayClick : true,
		hideOnContentClick : false,

		overlayShow : true,
		overlayOpacity : 0.7,
		overlayColor : '#777',

		titleShow : true,
		titlePosition : 'float', // 'float', 'outside', 'inside' or 'over'
		titleFormat : null,
		titleFromAlt : false,

		transitionIn : 'fade', // 'elastic', 'fade' or 'none'
		transitionOut : 'fade', // 'elastic', 'fade' or 'none'

		speedIn : 300,
		speedOut : 300,

		changeSpeed : 300,
		changeFade : 'fast',

		easingIn : 'swing',
		easingOut : 'swing',

		showCloseButton	 : true,
		showNavArrows : true,
		enableEscapeButton : true,
		enableKeyboardNav : true,

		onStart : function(){},
		onCancel : function(){},
		onComplete : function(){},
		onCleanup : function(){},
		onClosed : function(){},
		onError : function(){},
		onLoad : function(){}
	};

	jQuery(document).ready(function() {
		jQuery.fancybox.init();
	});

})(jQuery);