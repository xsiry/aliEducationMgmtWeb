/*
 * ajax 菜单跳转
 * by xsiry
 */
define(function(require, exports, module) {
	$.root_ = $('#wrapper');

	$.navAsAjax = true;
	var debugState = false,
		menu_speed = 235,
		menu_accordion = true,
		enableJarvisWidgets = true,
		ignore_key_elms = ["#wrapper, .pace"],
		bread_crumb = $("#ribbon ol.breadcrumb")


	function leftNav() {
		topmenu || $("nav ul").jarvismenu({
			"accordion": menu_accordion || !0,
			"speed": menu_speed || !0,
			"closedSign": '<em class="fa fa-plus-square-o"></em>',
			"openedSign": '<em class="fa fa-minus-square-o"></em>'
		})
	}

	$.fn.extend({
		"jarvismenu": function(a) {
			var b = {
					"accordion": "true",
					"speed": 200,
					"closedSign": "[+]",
					"openedSign": "[-]"
				},
				c = $.extend(b, a),
				d = $(this);
			d.find("li").each(function() {
					0 !== $(this).find("ul").size() && ($(this).find("a:first").append("<b class='collapse-sign'>" + c.closedSign + "</b>"),
						"#" == $(this).find("a:first").attr("href") && $(this).find("a:first").click(function() {
							return !1
						}))
				}),
				d.find("li.active").each(function() {
					$(this).parents("ul").slideDown(c.speed),
						$(this).parents("ul").parent("li").find("b:first").html(c.openedSign),
						$(this).parents("ul").parent("li").addClass("open")
				}),
				d.find("li a").click(function() {
					0 !== $(this).parent().find("ul").size() && (c.accordion && ($(this).parent().find("ul").is(":visible") || (parents = $(this).parent().parents("ul"),
							visible = d.find("ul:visible"),
							visible.each(function(a) {
								var b = !0;
								parents.each(function(c) {
										return parents[c] == visible[a] ? (b = !1, !1) : void 0
									}),
									b && $(this).parent().find("ul") != visible[a] && $(visible[a]).slideUp(c.speed, function() {
										$(this).parent("li").find("b:first").html(c.closedSign),
											$(this).parent("li").removeClass("open")
									})
							}))),
						$(this).parent().find("ul:first").is(":visible") && !$(this).parent().find("ul:first").hasClass("active") ? $(this).parent().find("ul:first").slideUp(c.speed, function() {
							$(this).parent("li").removeClass("open"),
								$(this).parent("li").find("b:first").delay(c.speed).html(c.closedSign)
						}) : $(this).parent().find("ul:first").slideDown(c.speed, function() {
							$(this).parent("li").addClass("open"),
								$(this).parent("li").find("b:first").delay(c.speed).html(c.openedSign)
						}))
				})
		}
	})

	function checkURL() {
		var a = location.href.split("#").splice(1).join("#");
		if (!a)
			try {
				var b = window.document.URL;
				b && b.indexOf("#", 0) > 0 && b.indexOf("#", 0) < b.length + 1 && (a = b.substring(b.indexOf("#", 0) + 1))
			} catch (c) {}
		if ($("#content") && a && a != "undefined") {
			container = $("#content");
			$("nav li.active").removeClass("active");
			$('nav li:has(a[href="#' + a + '"])').filter(':not(.nav-header)').addClass("active");
			var d = $('nav a[href="' + a + '"]').attr("title");
			document.title = d || document.title,
				debugState && console.log("Page title: %c " + document.title),
				loadURL(a + location.search, container)
		} else {
			var e = $('nav > ul > li:nth-child(2) > a[href!="#"]');
			window.location.hash = e.attr("href"),
				e = null
		}
	}

	function loadURL(a, b) {
		debugState && console.log("Loading URL: %c" + a),
			$.ajax({
				"type": "GET",
				"url": a,
				"dataType": "html",
				"cache": !0,
				"beforeSend": function() {
					b.removeData().html(""),
						b.html('<h1 class="ajax-loading-animation"><i class="fa fa-cog fa-spin"></i> 页面加载中...</h1>'),
						b[0] == $("#content")[0] && ($("body").find("> *").filter(":not(" + ignore_key_elms + ")").empty().remove(),
							drawBreadCrumb(),
							$("html").animate({
								"scrollTop": 0
							}, "fast"))
				},
				"success": function(a) {
					b.css({
							"opacity": "0.0"
						}).html(a).delay(50).animate({
							"opacity": "1.0"
						}, 300),
						a = null,
						b = null
				},
				"error": function(c, d, e) {
					b.html('<h4 class="ajax-loading-error"><i class="fa fa-warning txt-color-orangeDark"></i> Error requesting <span class="txt-color-red">' + a + "</span>: " + c.status + ' <span style="text-transform: capitalize;">' + e + "</span></h4>")
				},
				"async": !0
			})
	}

	function drawBreadCrumb(a) {
		var b = $("nav li.active > a"),
			c = b.length;
		bread_crumb.empty(),
			bread_crumb.append($("<li>首页</li>")),
			b.each(function() {
				bread_crumb.append($("<li></li>").html($.trim($(this).clone().children(".badge").remove().end().text()))),
					--c || (document.title = bread_crumb.find("li:last-child").text())
			}),
			void 0 != a && $.each(a, function(a, b) {
				bread_crumb.append($("<li></li>").html(b)),
					document.title = bread_crumb.find("li:last-child").text()
			})
	}

	function resetWidgets(a) {
		swal({
			title: "<i class='fa fa-refresh' style='color:green'></i> Clear Local Storage",
			text: a.data("reset-msg") || "Would you like to RESET all your saved widgets and clear LocalStorage?1",
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: '确定',
			cancelButtonText: '取消'
		}).then(function() {
			location.reload()
		}).catch(swal.noop);
	}

	$.intervalArr = [];

	$.navAsAjax && ($("nav").length && checkURL(),

		$(window).on("hashchange", function() {
			checkURL()
		}))

	$.root_.on("click", '[data-action="resetWidgets"]', function(b) {
		var c = $(this);
		resetWidgets(c),
			b.preventDefault(),
			c = null
	});
});