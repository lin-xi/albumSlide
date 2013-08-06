KISSY.add('xh/galleryslide/base', function(S, Node, Event, Anim) {
	var $=Node.all;
	var MARGIN, BORDER_WIDTH;
	/**
	 * @class gallerySlide
	 * AlbumSlide 图片滚动组件
	 */
	function GallerySlide(config, imageId){
		var _CONFIG = {
			node: '',
			data: [],
			ratio: 1.3,          //图片宽高比例
			scroll: 'vertical',  //滚动方向
			imageMargin: 8,      //图片总边距，左右或是上下为4
			borderWidth: 8       //当前选中图片的边框
		};
		this.cfg = S.merge(_CONFIG, config);

		MARGIN = this.cfg.imageMargin;
		BORDER_WIDTH = this.cfg.borderWidth;

		this.cache = {};
		var cache = this.cache; //缓存
		cache.current = 0; //当前显示的图片index
		cache.total = 0;  //图片总数
		
		var nstr = this.cfg.node;
		this.node = S.isString(nstr) ? $(nstr) : nstr;

		//初始化
		this._init(imageId);
	}

	S.augment(GallerySlide, Event.Target, {
		//初始化
		_init: function(imgId){
			var v_template = '<div class="ui-gallerySlide"><div class="gs-vertical"><div class="prev"><div class="prev-arrow"></div></div><div class="content-wraper"><div class="gsContent"><div class="img-border"></div></div></div><div class="next"><div class="next-arrow"></div></div></div></div>',
				h_template = '<div class="ui-gallerySlide"><div class="gs-horizontal"><span class="prev"><span class="prev-arrow"></span></span><span class="content-wraper"><span class="gsContent"><span class="img-border"></span></span></span><span class="next"><span class="next-arrow"></span></span></div></div>';
			var self = this, node = self.node, cfg = self.cfg, cache = self.cache, data = cfg.data;
			
			var gs, sc, cnt, ib, prev, next,
				vw = node.width(), vh = node.height(),
				pw, ph, nw, nh, imgW, imgH;
			
			//垂直模式
			if(cfg.scroll == 'vertical'){

				gs = $(v_template);
				gs.appendTo(node);
				sc = $('.content-wraper', gs);
				cnt = $('.gsContent', gs);  
				ib = $('.img-border', gs); //边框
				prev = $('.prev', gs);     //上一个
				next = $('.next', gs);     //下一个
				pw = prev.outerWidth();    
				ph = prev.outerHeight();
				nw = next.outerWidth();
				nh = next.outerHeight();
				gs.width(vw);
				gs.height(vh);

				sc.css({top: ph, left: 0});
				sc.width(vw);
				var tw = vw, th = vh-ph-nh;
				cnt.width(tw);
				imgW = tw;                         //缩略图片外围宽度
				imgH = Math.round(imgW/cfg.ratio); //缩略图片外围高度
				cnt.height(data.total*imgH);

				cache.totalCount = Math.floor(th/imgH);  //页面中显示缩略图的总数
				var totalHeight = cache.totalCount*imgH; //总高度
				sc.height(totalHeight);
				sc.css('top', ph+(th-totalHeight)/2);

			}else{

				gs = $(h_template);
				gs.appendTo(node);
				sc = $('.content-wraper', gs);
				cnt = $('.gsContent', gs);
				ib = $('.img-border', gs);
				prev = $('.prev', gs);
				next = $('.next', gs);
				pw = prev.outerWidth();
				ph = prev.outerHeight();
				nw = next.outerWidth();
				nh = next.outerHeight();
				gs.width(vw);
				gs.height(vh);

				sc.css({left: pw, top: 0});
				sc.height(vh);
				var tw = vw-pw-nw, th = vh;
				cnt.height(th);
				imgH = th;                         //缩略图片外围高度
				imgW = Math.round(imgH*cfg.ratio); //缩略图片外围宽度
				cnt.width(data.total*imgW);

				cache.totalCount = Math.floor(tw/imgW);  //页面中显示缩略图的总数
				var totalWidth = cache.totalCount*imgW;  //总宽度
				sc.width(totalWidth);
				sc.css('left', pw+(tw-totalWidth)/2);
			}

			ib.width(imgW-BORDER_WIDTH-MARGIN);   //边框宽度
			ib.height(imgH-BORDER_WIDTH-MARGIN);  //边框高度

			ib.css({left:MARGIN/2, top:MARGIN/2});

			cache.current = 0; //当前图片 索引
			cache.currentId = data.list[0].id;   //当前图片Id
			cache.center = Math.ceil(cache.totalCount/2)-1;  //左半部分的个数 或者  上半部分的个数
			cache.half = cache.totalCount-cache.center-1;    //右半部分的个数 或者  下半部分的个数
			cache.imgW = imgW;
			cache.imgH = imgH;
			
			//self.render();
			cache.initFlag = false;

			//前一个
			prev.on('click', function(){
				self.prev();
			});
			//后一个
			next.on('click', function(){
				self.next();
			});
		},

		//contentNode '.gsContent'
		/*
		 *初始化缩略图
		 */
		_initPhotos: function(){
			var template = '<span class="gsImageWraper"><img class="gsImage" id="{id}" src="{thumbnails}"/></span>';
			var frag = document.createDocumentFragment();

			var self = this, node = self.node, cfg = self.cfg, cache = self.cache, data = cfg.data;
			for (var i=0, ii=data.list.length; i<ii; i++) {
				var obj = data.list[i];
				var imgWrap = $(S.substitute(template, obj));
				imgWrap.width(cache.imgW);
				imgWrap.height(cache.imgH);
				imgWrap.attr('dataIndex', i);

				var img = $('.gsImage', imgWrap);
				img.attr('width', cache.imgW-MARGIN);
				img.attr('height', cache.imgH-MARGIN);
				imgWrap.appendTo(frag);
			}
			var contentNode = $('.gsContent', node);
			contentNode.append(frag);
			//分发loaded事件
			self.fire('loaded');
			
			//缩略图点击事件
			contentNode.on('click', function(e){
				var tar = $(e.target), par = tar.parent();
				if(par.hasClass('.gsImageWraper')){
					if(!cache.processing){
						var index = tar.parent().attr('dataIndex');
						cache.current = index-0;
						cache.currentId = tar.attr('id');
						self.render();
					}
				}
			});
		},

		//渲染
		render: function(){
			var self = this, cfg = self.cfg, g = self.cache, data = cfg.data,
				gc = g.current, o = data.list[gc];
			
			if(!g.initFlag){
				g.initFlag = true;
				//初始化缩略图区
				self._initPhotos();
			}

			if(gc>data.total-1){
				return;
			}
			//分发 切换之前的事件
			self.fire('beforeChange');
			
			if(o.storeFileM){
				//加载图片
				self._preLoadImage(o.id, o.storeFileM, function(id, url, width, height){
					var ot = S.clone(data.list[gc]);
					if(ot.id == id){
						ot.url = url;
						ot.width = width;
						ot.height = height;
						ot.total = data.total;
						ot.index = gc+1;
						//分发 切换事件
						self.fire('change', ot);
					}
				});
			}else{
				var ot = S.clone(data.list[gc]);
				//分发 切换事件
				self.fire('change', ot);
			}
			self._scrollToCenter();
		},
		
		//图片滚动至中心位置
		_scrollToCenter: function (){
			var self = this, node = self.node, g = self.cache, cfg = self.cfg, data=cfg.data,
				border = Node.one('.img-border', node), ele = $('.gsContent', node);

			var el, et, newl, newt;
			g.processing = true;

			if(cfg.scroll == 'vertical'){ //垂直方向滚动

				//边框移动
				var btop = g.current*g.imgH+MARGIN/2;
				new Anim(border, {top: btop}, .5, 'easeBothStrong', function(){
				}).run();

				et = ele.css("top").slice(0, -2)-0; //缩略图容器的top值
				if(g.current < g.center){
					//当前点击图片在 中心图片 的上部的场合
					var dis = g.center-g.current, rdis, diff=g.center-g.totalCount+g.half+1;
					if(diff < 0){
						rdis=0;
					}else{
						rdis=diff<dis ? diff:dis;
						g.center = g.center-rdis;
					}
					newt = et + rdis*g.imgH;
					//缩略图容器移动
					new Anim(ele, {top: newt}, .3, 'swing', function(){
						g.processing = false;
					}).run();

				}else{
					//当前点击图片在 中心图片 的下部的场合
					var dis = g.current-g.center, rdis, diff=g.center+g.half;
					if(diff >= data.total-1){
						rdis = 0;
					}else{
						var tc = data.total-1-diff;
						rdis=tc<dis ? tc:dis;
						g.center = g.center+rdis;
					}
					newt = et - rdis*g.imgH;
					//缩略图容器移动
					new Anim(ele, {top: newt}, .3, 'swing', function(){
						g.processing = false;
					}).run();
				}
				
			} else { //水平方向滚动

				//边框移动
				var bleft = g.current*g.imgW+MARGIN/2;
				new Anim(border, {left: bleft}, .5, 'easeBothStrong', function(){
				}).run();

				et = ele.css("left").slice(0, -2)-0;  //缩略图容器的left值
				if(g.current < g.center){
					//当前点击图片在 中心图片 的左部的场合
					var dis = g.center-g.current, rdis, diff=g.center-g.totalCount+g.half+1;
					if(diff < 0){
						rdis=0;
					}else{
						rdis=diff<dis ? diff:dis;
						g.center = g.center-rdis;
						//只有移动了才设置中心图片的索引
					}
					newt = et + rdis*g.imgW;
					//缩略图容器移动
					new Anim(ele, {left: newt}, .3, 'swing', function(){
						g.processing = false;
					}).run();
				}else{
					//当前点击图片在 中心图片 的右部的场合
					var dis = g.current-g.center, rdis, diff=g.center+g.half;
					if(diff >= data.total-1){
						rdis = 0;
					}else{
						var tc = data.total-1-diff;
						rdis=tc<dis ? tc:dis;
						g.center = g.center+rdis;
						//只有移动了才设置中心图片的索引
					}
					newt = et - rdis*g.imgW;
					//缩略图容器移动
					new Anim(ele, {left: newt}, .3, 'swing', function(){
						g.processing = false;
					}).run();
				}
				
			}
		},

		//图片预加载
		_preLoadImage: function(id, url, callback){
			var img = new Image();
			img.src = url;
			if (img.complete) {
					callback(id, url, img.width, img.height);
			} else {
				img.onload = function () {
					callback(id, url, img.width, img.height);
					img.onload = null;
				};
			}
		},

		//下一个图片
		next: function(){
			var self = this, cache = self.cache, data=self.cfg.data;
			if(!cache.processing){
				if(cache.current < data.total-1){
					cache.current++;
					cache.currentId = data.list[cache.current].id;
					self.render();
				}
			}
		},
		
		//上一个图片
		prev: function(){
			var self = this, cache = self.cache, data=self.cfg.data;
			if(!cache.processing){
				if(cache.current > 0){
					cache.current--;
					cache.currentId = data.list[cache.current].id;
					self.render();
				}
			}
		}
	});

	return GallerySlide;

},{requires:['node', 'event', 'anim', '../../../../css/galleryslide.css']});