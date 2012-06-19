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
		_link.click(function(){
			//setTimeout(function(){
					jQuery('#fancybox-overlay').trigger('click');
					//restURL replacement
					var resturl = "http://127.0.0.1:8084/recipe/submit";			    
				    recipeText = jQuery('#recipe-text').val();
				    recipeText = encodeURIComponent(recipeText);				
				    formVars = "recipe-data="+recipeText;

					jQuery.ajax({
						type: 'POST',
						url: resturl,
						crossDomain: true,
						dataType: 'text',
						data: formVars,
						success: function(data){

							jQuery("#recipeData").val(data);
            				jQuery("#super_form").submit();

						},
						error: function(jqXHR, jqerror){
	              			alert(jqerror);
	           			}
					});				
				//},2000)
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