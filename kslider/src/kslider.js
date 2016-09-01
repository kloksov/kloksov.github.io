/*
KSlider jQuery

https://github.com/kloksov/kslider/
*/

(function( $ ) {
	
	// methods
	var methods = {
		// init
		init: function (options) {
			
			// default settings
			settings = $.extend({
				width: 700,
				height: 200,
				count_img: 3,
				margin_item: 15,
				time_animate: 500,
				size_img: 'original'
			}, options);
			
			return this.each(function () {
				
				// style slider
				$(this).css({
					width: settings.width,
					height: settings.height,
				});
				
				// find images and wrap
				var image_all = 0;
				$(this).find('img').each(function () {
					image_all++;
					$(this).wrap('<div class="one_item"></div>');
				});
				
				// insert prev, next
				$(this).prepend('<div class="prev"></div>');
				$(this).append('<div class="next"></div>');
				var w_arrow = parseInt($(this).find('.next').css('width'));
				// handler next
				$(this).find('.next').click(function () {
					$(this).kslider('next');
				});
				// handler prev
				$(this).find('.prev').click(function () {
					$(this).kslider('prev');
				});
				
				// wrap body slider
				$(this).find('.one_item').wrapAll('<div class="body_slider"></div>');
				var width_body = settings.width - w_arrow * 2;
				var height_body = settings.height;
				$(this).find('.body_slider').css({ width: '100%', height: height_body, left: w_arrow })
				
				// style one item
				var border_size = parseInt($(this).find('.one_item').css('border-top-width'));
				var margin_item = settings.margin_item;
				var w_item = parseInt(width_body / settings.count_img) - margin_item - border_size * 2;
				var h_item = height_body - margin_item * 2 - border_size * 2;
				$(this).find('.one_item').css({
					width: w_item,
					height: h_item,
				});
				
				// size image
				if (jQuery.type(settings.size_img) === 'string') {
					if (settings.size_img == 'stretch') {
						$(this).find('.one_item').find('img').css({
							width: '100%',
							height: '100%'
						});
					}
				} else if (jQuery.type(settings.size_img) === 'object') {
					if (settings.size_img.width && settings.size_img.height) {
						$(this).find('.one_item').find('img').css({
							width: settings.size_img.width,
							height: settings.size_img.height
						});
					}
				}
				
				// position one item
				$(this).find('.one_item').each(function (i) {
					var cur_left = (i * w_item) + ((i+1) * margin_item) + border_size * i * 2;
					$(this).css({
						top: margin_item,
						left: cur_left
					});
					var img = $(this).find('img');
					$(img).css({ display: 'inline-block', opacity: 0 });
					$(img).load(function () {
						$(this).animate({
							opacity: 1
						}, 700, 'linear');
					}).each(function () { // image cache or already upload
						if (this.complete) {
							$(this).load();
						}
					});
					
				});
				
				// fixed center
				var new_mleft = (-1) * Math.round(margin_item / 2);
				$(this).find('.body_slider').css({ marginLeft: new_mleft });
				
				var $this = $(this);
				var data = $this.data('kslider');
				
				var kslider = {
					count_img: settings.count_img,
					w_item: w_item,
					margin_item: margin_item,
					border_size: border_size,
					cur_mleft: new_mleft,
					time_animate: settings.time_animate,
					image_all: image_all
				};
				
				// save variables
				$(this).data('kslider', {
					target: $this,
					kslider: kslider
				});
				
			});
		},
		// next 
		next: function () {
			var $this = $(this).hasClass('kslider') ? $(this) : $(this).parent() ;
			var data = $this.data('kslider');
			
			$(data.target).kslider('animate_move', 'next');
		},
		// prev 
		prev: function () {
			var $this = $(this).hasClass('kslider') ? $(this) : $(this).parent() ;
			var data = $this.data('kslider');
			
			$(data.target).kslider('animate_move', 'prev');
		},
		// animate move
		animate_move: function (way) {
			var $this = $(this).hasClass('kslider') ? $(this) : $(this).parent() ;
			var data = $this.data('kslider');
			data.kslider.cur_mleft = data.kslider.cur_mleft || 0;
			
			if (data.kslider.cur_animate) { // current animate
				return;
			}
			data.kslider.cur_animate = true;
			
			var tmp_size = (-1) * (data.kslider.w_item + Math.round(data.kslider.margin_item / 1) + data.kslider.border_size * 2);
			var new_mleft;
			if (way == 'next') {
				new_mleft = data.kslider.cur_mleft + tmp_size;
			} else {
				new_mleft = data.kslider.cur_mleft - tmp_size;
			}
			// max left and right
			var max_left = data.kslider.image_all * tmp_size - data.kslider.count_img * tmp_size + (-1) * Math.round(data.kslider.margin_item / 2);
			if (new_mleft > 0) {
				new_mleft = max_left;
			} else if (new_mleft < (max_left - 1)) {
				new_mleft = (-1) * Math.round(data.kslider.margin_item / 2);
			}
			
			$this.find('.body_slider').animate({
				marginLeft: new_mleft
			}, {
				duration: data.kslider.time_animate,
				easing: 'swing',
				queue: false,
				complete: function () {
					data.kslider.cur_animate = false;
				}
			});
			
			data.kslider.cur_mleft = new_mleft;
		}
	};
	
	$.fn.kslider = function (method) {
		
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Метода '+ method +' не существует');
		}
		
	};
})(jQuery);