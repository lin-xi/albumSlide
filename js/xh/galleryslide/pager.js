/** 
 * 分页.
 * @module pager
 */
 KISSY.add('xh/galleryslide/pager', function(S, Node, Event, Anim) {
 	var $ = Node.all;
 	/**
     * @constructor
     * @alias xh:pager
     * @exports xh/pager
     */
	function Pager(config){
		var _CONFIG = {
			node: '',
			total: 30,
			direction: 'vertical'
		};
		this.cfg = S.merge(_CONFIG, config);
		this.cache = {};
		var nodestr = this.cfg.node;
		this.node = S.isString(nodestr) ? $(nodestr) : nodestr;

		this._init();
	}

	S.augment(Pager, Event.Target, {
		_init: function(){
			var self = this, cfg = self.cfg, node = self.node, cache = self.cache;

			var ul = $('<ul class="pageContainer"></ul>');
			//当前页
			cache.current = 1;
			node.empty().append(ul);

			self.render();
			
			//页码点击事件
			ul.on('click', function(e){
				var tar = $(e.target);
				if(tar.nodeName() == 'a'){
					e.halt();

					var pi = tar.text();
					if(/^\d+$/.test(pi)){
						cache.current = parseInt(pi);
						self.render();
						//分发页码点击事件
						self.fire('pageChange', {index: cache.current});
					}
				}
			});
			
			//页码鼠标enter事件
			S.Event.delegate(ul, 'mouseenter', '.pageNo', function(e){
				var tar = $(e.target);
				if(tar.text() != '...'){
					var off = tar.offset(), w = tar.width(), h = tar.height();
					//分发页码点击事件
					self.fire('pageOver', {index: cache.current, pageX: off.left+w, pageY: off.top+h/2});
				}
			});
			//页码鼠标leave事件
			S.Event.delegate(ul, 'mouseleave', '.pageNo', function(e){
				var tar = $(e.target);
				if(tar.text() != '...'){
					//分发页码点击事件
					self.fire('pageOut');
				}
			});

		},
		//渲染
		render: function(){
			var self = this, cfg = self.cfg, node = self.node, cache = self.cache;
			var ul = $('.pageContainer', node);
			ul.empty();
			
			//模板
			var template = '<li class="page"><a class="pageNo">{no}</a></li>', reg = /\{[^{}]+\}/;
			var cur = cache.current;

			var first = $(template.replace(reg, 1));
			cur==1 && first.addClass('pageSelected');
			ul.append(first); // 第一页

			if(cfg.direction == 'vertical'){
				//垂直模式
				
				//根据父节点的高度，计算能显示多少个页码
				var vh = node.height()-100, h = $('.page', node).outerHeight(), totalPage = cfg.total;
				//计算上半部分显示页码的个数，下半部分显示页码的个数
				var pageSize = Math.floor(vh/h), leftHalf = Math.ceil(pageSize/2), rightHalf = pageSize-leftHalf;
				if(pageSize > 1){
					if(pageSize >= totalPage){
						//页码在一页中能全部显示的场合
						for(var i=1; i<pageSize; i++){
							var pageli = $(template.replace(reg, i+1));
							ul.append(pageli);
						}
					}else{
						var sn = cur-leftHalf, //开始页码
							en=cur+rightHalf-1,  //结束页码
							lsign=false, rsign=false;

						if(sn<1){
							sn = 2;
							en=pageSize;
						}else{
							lsign=true;
							sn+=2;
						}
						if(en>=totalPage){
							en = totalPage;
							sn = totalPage-pageSize+3;
						}else{
							rsign=true;
							en-=2;
						}

						if(lsign){
							//如果有左边的省略号
							var pageli = $(template.replace(reg, '...'));
							ul.append(pageli);
						}
						for(var i=sn; i<=en; i++){
							var pageli = $(template.replace(reg, i));
							cur==i && pageli.addClass('pageSelected');
							ul.append(pageli);
						}
						if(rsign){
							//如果有右边的省略号
							var pageli = $(template.replace(reg, '...'));
							ul.append(pageli);
							pageli = $(template.replace(reg, totalPage));
							cur==totalPage && pageli.addClass('pageSelected');
							ul.append(pageli);
						}
					}
				}

			} else {

			}
		},
		
		//下一个
		next: function(){
			var self = this, cfg = self.cfg, cache = self.cache;
			if(cache.current < cfg.total){
				cache.current++;
				self.render();
				self.fire('pageChange', {index: cache.current});
			}
		},
		//上一个
		prev: function(){
			var self = this, cfg = self.cfg, cache = self.cache;
			if(cache.current > 1){
				cache.current--;
				self.render();
				self.fire('pageChange', {index: cache.current});
			}
		}

	});

	return Pager;
	
}, {requires:['node', 'event', 'anim']});