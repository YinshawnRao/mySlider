function MySlider(container, options) {
	var option = {
		content: ".slider_content",
		slide: ".single_slide",
		ctrls: ".tag_ctrl",
		title: ".tag_title",
		timing: ".3s"
	};
	this.option = $.extend(option, options);
	this.$container = $(container);
	this.$content = $(container).find(option.content);
	this.$slides = $(container).find(option.slide);
	this.$ctrls = $(container).find(option.ctrls);
	this.$title = $(container).find(option.title);
	this.cw = $(container).width();
	this.minInterval = $(container).width() / 5;
	this.startX = 0;
	this.curIndex = 0;
	this.isTouchStart = true;
	this.timing = option.timing;
	this.onTouchStart = option.onTouchStart || new Function();
	this.onTouchMove = option.onTouchMove || new Function();
	this.onTouchEnd = option.onTouchEnd || new Function();
	this.onTransitionEnd = option.onTransitionEnd || new Function();
	return this.init();
}
MySlider.prototype = {
	constructor: MySlider,
	init: function() {
		this.renderDom();
		this.startTouch();
	},
	renderDom: function() {
		this.$slides.width(this.cw);
		this.$content.width(this.cw * this.$slides.length);
		var htmls = [];
		for (var i = 0, j = this.$slides.length; i < j; i++) {
			if (i === 0) {
				htmls.push("<span class='active'></span>");
			} else {
				htmls.push("<span></span>");
			}
		}
		this.$ctrls.html(htmls.join(""));
		this.$ctrls = this.$ctrls.find("span");
		this.$title.html(this.$slides.first().data("title"));
	},
	startTouch: function() {
		var that = this;
		var $con = this.$content;
		var cw = this.cw;
		$con.on("touchstart", function(e) {
			var touches = e.originalEvent.changedTouches;
			if (touches.length == 1) {
				that.setTransition($con, "none");
				that.startX = touches[0].pageX + cw * that.curIndex;
				that.isTouchStart = true;
				that.onTouchStart(that);
			}
		}).on("touchmove", function(e) {
			e.preventDefault();
			var touches = e.originalEvent.changedTouches;
			if (touches.length == 1 && that.isTouchStart) {
				var moveX = touches[0].pageX - that.startX;
				that.setTransform($con, moveX);
				that.onTouchMove(that);
			}
		}).on("touchend", function(e) {
			var touches = e.originalEvent.changedTouches;
			if (touches.length == 1 && that.isTouchStart) {
				that.isTouchStart = false;
				that.setTransition($con, "ease", that.timing);
				var endX = touches[0].pageX + cw * that.curIndex;
				var disX = endX - that.startX;
				if (Math.abs(disX) > that.minInterval) {
					if (disX < 0) {
						that.nextSlide();
					} else if (disX > 0) {
						that.prevSlide();
					}
					that.$ctrls.removeClass("active");
					that.$ctrls.eq(that.curIndex).addClass("active");
					that.$title.html($con.children(that.option.slide).eq(that.curIndex).data("title"));
				}
				that.setTransform($con, -that.curIndex * cw);
			}
			that.onTouchEnd(that);
		}).on("transitionend webkitTransitionEnd", function() {
			that.onTransitionEnd(that);
		});
	},
	nextSlide: function() {
		this.curIndex++;
		if (this.curIndex > this.$slides.length - 1) {
			this.curIndex = this.$slides.length - 1;
			this.setTransition(this.$content, "cubic-bezier(0.19, 1, 0.22, 1)", this.timing);
		}
	},
	prevSlide: function() {
		this.curIndex--;
		if (this.curIndex < 0) {
			this.curIndex = 0;
			this.setTransition(this.$content, "cubic-bezier(0.19, 1, 0.22, 1)", ".3s");
		}
	},
	setTransition: function(obj, prop, time) {
		var tr = "transform " + time + " " + prop + " 0s";
		if (prop === "none") {
			tr = "none";
		}
		obj.css({
			"-webkit-transition": tr,
			"-moz-transition": tr,
			"transition": tr
		});
	},
	setTransform: function(obj, prop) {
		obj.css({
			"transform": "translate3d(" + prop + "px,0,0)",
			"-webkit-transform": "translate3d(" + prop + "px,0,0)",
			"-moz-transform": "translate3d(" + prop + "px,0,0)"
		});
	}
};