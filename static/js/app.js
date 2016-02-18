$(function() {
	//表单异步提交
	$(".post").on('click', function() {
		ajaxform($(this));
	});
	//表单验证
	$(".validate input").blur(function() {
		var self = $(this);
		var validate = self.closest('.validate');
		if (!self.val()) {
			validate.addClass('has-error');
			validate.find('.form-alert').show();
		}
	});
	$(".validate input").focus(function() {
		var self = $(this);
		var validate = self.closest('.validate');
		if (validate.hasClass('has-error')) {
			validate.removeClass('has-error');
			validate.find('.form-alert').hide();
		}
	});
	//邮件发送
	$("#send").on('click', function() {
		var self = $(this);
		var value = $(self.data('for')).val();
		if (self.data('send') == 'sms') {
			var reg = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i;
			if (!reg.test(value)) {
				var msg = $.zui.messager.show("请输入有效的手机号码！", {
					placement: "center",
					type: "danger"
				});
				return false;
			} else {
				var data = {
					mobile: value
				};
			}
		} else if (self.data('send') == 'email') {
			var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
			if (!reg.test(value)) {
				var msg = $.zui.messager.show("请输入有效的邮箱地址！", {
					placement: "center",
					type: "danger"
				});
				return false;
			} else {
				var data = {
					email: value
				};
			}
		}
		$.post(self.data('url'), data, function(rs) {
			self.attr("disabled", "disabled");
			var time = 60;
			var timer = setInterval(function() { //添加定时器
				time--;
				self.html(time + "秒后重新发送");
				if (time == 0) {
					self.html('发送验证码');
					self.removeAttr("disabled");
					clearInterval(timer); //清除定时器
				}
			}, 1000);
			var option = {
				placement: "center"
			};
			option.type = (rs.status == 1) ? "success" : "danger";
			var msg = $.zui.messager.show(rs.msg, option);
		}, 'json')
	});
});

function login(select) {
	ajaxform($(select));
}

function ajaxform(self) {
	var url = $(self.data('from')).attr('action');
	var data = {};
	$(self.data('from')).find('input').each(function() {
		if ($(this).attr('name')) {
			data[$(this).attr('name')] = $(this).val();
		}
		if ($(this).closest('.validate') && !$(this).val()) {
			$(this).closest('.validate').addClass('has-error');
		}
	});
	$(self.data('from')).find('textarea').each(function() {
		if ($(this).attr('name')) {
			data[$(this).attr('name')] = $(this).val();
		}
	});
	self.button('loading');
	$.post(url, data, function(rs) {
		if (rs.status == 1) {
			if(rs.url==""){rs.url=window.location.href;}
			window.location.href=rs.url;
		} else {
			var msg = $.zui.messager.show(rs.msg, option = {
				placement: "center",
				type:"danger"
			});			
			self.button('reset');
		}
	}, 'json')
}