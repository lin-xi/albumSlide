KISSY.add('xh/galleryslide/videogallery', function(S, Node, Event, Anim, SWF, GallerySlide) {
	var $=Node.all;

	/**
	 * @class videogallery
	 * AlbumSlide 图片滚动组件
	 */
	function VideoGallery(node, data){

		this.cache = {};
		var cache = this.cache; //缓存
		this.node = S.isString(node) ? $(node) : node;
		this.data = data;

		//初始化
		this._init();
	}

	S.augment(VideoGallery, Event.Target, {
		//初始化
		_init: function(){
			var template = '<div class="ui-videoGallery"><div class="left-tool"><span class="icon full"></span><span class="icon cloud"></span><span class="icon star"></span><span class="icon share"></span></div><div class="right-slide"></div><div class="center-content"><div class="flash-container"></div></div></div>';
			var self = this, node = self.node, cache = self.cache, data = self.data;
			
			var pg = $(template);
			node.append(pg);

			var count = 0;

			var holder = $('.right-slide', node);
			var fc = $('.flash-container', node);
			var swf;
			if(SWF.fpv()){
				swf = new SWF({
					src:'/photo/flvPlayer2.swf',
					attrs:{
						width: 545,
						height: 402,
						allowScriptAccess: '*',
						wmode: 'transparent',
						allowFullScreen: 'true'
					},
					params:{
						flashVars:{
						}
					},
					render: fc
				});
			}

			var gs = new GallerySlide({
                node: holder,
                data: data,
                scroll: 'vertical'
            });

            gs.on('loaded', function(){
            	console.log('loaded');

            	$('.gsImageWraper', node).each(function(item, index){
	            	var par = $(item);
	            	var play = $('<img width="36" height="36" class="play-icon" src="../images/play-icon.png"/>');
	            	play.appendTo($(item));
	            });
            });

            gs.on('beforeChange', function(e){
            });

            gs.on('change', function(e){
            	if(count == 0){
            		swf.callSWF('play', ['/photo/testFlv1.flv', 'name', 'description', '/photo/29.jpg']);
            		swf.callSWF('autoPause', [false]);
            	}else{
            		swf.callSWF('play', ['/photo/testFlv1.flv', 'name', 'description', '/photo/29.jpg']);
            	}
            	count++
            });

            gs.render();
		}
	});

	return VideoGallery;

},{requires:['node', 'event', 'anim', 'swf', 'xh/galleryslide/base', '/css/galleryslide.css']});