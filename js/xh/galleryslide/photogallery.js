KISSY.add('xh/galleryslide/photogallery', function(S, Node, Event, Anim, UA, GallerySlide) {
	var $=Node.all;

	/**
	 * @class gallerySlide
	 * AlbumSlide 图片滚动组件
	 */
	function PhotoGallery(node, data){

		this.cache = {};
		var cache = this.cache; //缓存
		this.node = S.isString(node) ? $(node) : node;
		this.data = data;

		//初始化
		this._init();
	}

	S.augment(PhotoGallery, Event.Target, {
		//初始化
		_init: function(){
			var template = '<div class="ui-photoGallery"><div class="left-tool"><span class="icon full"></span><span class="icon cloud"></span><span class="icon star"></span><span class="icon share"></span></div><div class="right-slide"></div><div class="center-content"><img class="pgImage" src="images/loading.gif" alt="" title=""/><div class="image-info"><span class="left-info"><p class="photo-title"></p><p class="photo-description"></p></span><span class="right-info"><span class="left-arrow"></span><span class="page"></span><span class="right-arrow"></span></span></div></div></div>';
			var self = this, node = self.node, cache = self.cache, data = self.data;
			
			var pg = $(template);
			node.append(pg);

			var holder = $('.right-slide', pg), img = $('.pgImage', pg), imgParent = img.parent(),
				prev = $('.left-arrow', pg), next = $('.right-arrow', pg), cc = $('.center-content', pg),
				pw = imgParent.width(), ph = imgParent.height();

			img.css({left:(pw-58)/2, top:(ph-10)/2});

			var gs = new GallerySlide({
                node: holder,
                data: data,
                scroll: 'vertical'
            });

            gs.on('beforeChange', function(e){
            	if(UA.ie){
	            	Anim.stop(img);
	            	new Anim(img, {opacity: 0.4}, .3, 'easeBothStrong', function(){
					}).run();
            	}
            });

            var stack = [], prcessing = false;

            gs.on('change', function(e){
            	if(UA.ie){
            		doProcessIe(e);
            	}else{
            		if(!prcessing){
						prcessing = true;
						doProcess(e);
	            	}else{
	            		stack.unshift(e);
	            	}
            	}
            });

            gs.render();

			function doProcess(e){
				var size = self._scalePhoto(pw, ph, e.width, e.height);
            	var imgOld = img.clone(false), lhalfImg = img.clone(false);
            	var rhalf = $('<div class="right-half"></div>'), lhalf = $('<div class="left-half"></div>');
            	imgOld.appendTo(cc);
            	lhalfImg.appendTo(lhalf);

        		img.attr('src', e.url);
        		img.attr('alt', e.name);
            	img.width(size.width);
            	img.height(size.height);
            	img.css({left:(pw-size.width)/2, top:(ph-size.height)/2});

            	var imgNew = img.clone(false), rhalfImg = img.clone(false);
            	imgNew.css('-webkit-transform', 'rotateY(-270deg )');
            	imgNew.css('-moz-transform', 'rotateY(-270deg )');
            	imgNew.hide();
            	rhalfImg.appendTo(rhalf);
            	
				setTimeout(function(){
					imgOld.addClass('image-rotate');
					lhalf.appendTo(cc);
					setTimeout(function(){
						imgOld.remove();
						rhalf.appendTo(cc);
						lhalf.css('z-index', 0);
						imgNew.appendTo(cc);
						imgNew.show();
						imgNew.css('-webkit-transition', 'All 1s ease-in-out');
						imgNew.css('-moz-transition', 'All 1s ease-in-out');
						imgNew.css('-webkit-transform', 'rotateY(-360deg )');
						imgNew.css('-moz-transform', 'rotateY(-360deg )');
						setTimeout(function(){
							lhalf.remove();
							rhalf.remove();
							imgNew.remove();
							prcessing = false;
							if(stack.length > 0){
								var ev = stack.shift();
								stack.length = 0;
								doProcess(ev);
							}
						}, 500);
					}, 500);
					
				}, 100);
            	
            	var title = $('.photo-title', pg),
            		desc = $('.photo-description', pg),
            		page = $('.page', pg);

            	title.text(e.name);
            	desc.text(e.description);
            	page.html('<b>'+e.index+'</b>/'+e.total);
			}

			function doProcessIe(e){
				var size = self._scalePhoto(pw, ph, e.width, e.height);
				img.attr('src', e.url);
        		img.attr('alt', e.name);
            	img.width(size.width);
            	img.height(size.height);
            	img.css({left:(pw-size.width)/2, top:(ph-size.height)/2});

            	Anim.stop(img);
            	new Anim(img, {opacity: 1}, .4, 'easeBothStrong', function(){
				}).run();

            	var title = $('.photo-title', pg),
            		desc = $('.photo-description', pg),
            		page = $('.page', pg);

            	title.text(e.name);
            	desc.text(e.description);
            	page.html('<b>'+e.index+'</b>/'+e.total);
			}

            prev.on('click', function(e){
            	gs.prev();
            	e.halt();
            });
            next.on('click', function(e){
            	gs.next();
            	e.halt();
            });
		},

		_scalePhoto: function(w, h, iw, ih){
			var size={}, scale;
			if(iw > w){
				size.width = w;
				scale = w/iw;
				size.height = ih*scale;
			}else{
				size.width = iw;
				size.height = ih;
			}
			if(size.height > h){
				size.height = h;
				scale = h/ih;
				size.width = iw*scale;
			}
			return size;
		}
	});

	return PhotoGallery;

},{requires:['node', 'event', 'anim', 'ua', './base', '../../../../css/galleryslide.css']});