KISSY.add('xh/galleryslide/newsgallery', function(S, Node, Event, Anim, GallerySlide) {
	var $=Node.all;

	/**
	 * @class newsgallery
	 * NewsGallery 新闻集滚动组件
	 */
	function NewsGallery(node, data){

		this.cache = {};
		var cache = this.cache; //缓存
		this.node = S.isString(node) ? $(node) : node;
		this.data = data;

		//初始化
		this.render();
	}

	S.augment(NewsGallery, Event.Target, {
		//初始化
		render: function(){
			var template = '<div class="ui-newsGallery"></div>';
			var self = this, node = self.node, cache = self.cache, data = self.data;
			var initFlag = false;
			
			node.empty();

			var pg = $(template);
			node.append(pg);

			pg.hide();

			var gs = new GallerySlide({
                node: pg,
                data: data,
                scroll: 'horizontal'
            });

			var list = data.list;
            $('.gsImageWraper', node).each(function(item, index){
            	var par = $(item);
            	$('<div class="album-title">'+ list[index].name +'</div>').appendTo(par);
            	$('<span class="album-corner"></span>').appendTo(par);
            	$('<span class="album-count">'+ list[index].totalCount +'</span>').appendTo(par);
            });
            pg.show();

            gs.on('change', function(e){
            	if(!initFlag){
            		initFlag = true;
            	}else{
            		self.fire('change', {id: e.id});
            	}
            });

        	gs.render();
		}

	});

	return NewsGallery;

},{requires:['node', 'event', 'anim', './base', '../../../../css/galleryslide.css']});