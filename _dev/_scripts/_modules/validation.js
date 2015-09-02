"use strict";

var validation = (function(){
	// инициализирует модуль
	var init = function(){
		_setupListeners();
	};

	// следит за событиями
	var _setupListeners = function(){
		$('form').on('keydown', '.has-error', _removeError);
		$('form').on('reset', _clearForm);
	};

	var _removeError = function(){
		$(this).removeClass('has-error');
	};

	var _clearForm= function(form){
		var form = $(this);
		form.find('.input, .textarea, .has-error').trigger('hideTooltip').removeClass('has-error');
	};



	// создает тултипы
	var _createQtip = function(element, position){
		// позиция тултипа
		if (position === 'right'){
			position = {
				my: 'left center',
				at: 'right center'
			}
		}else{
			position = {
					my: 'right center',
					at: 'left center',
				adjust: {
					method: 'shift none'
				}
			}
		};
		// инициализация тултипа
		element.qtip({
			content: {
				text: function(){
					return $(this).attr('qtip-content')
					}
			},
			show: {
				event: 'show'
			},
			hide: {
				event: 'keydown hideTooltip'
			},
			position: position,
			style: {
				classes: 'qtip-red qtip-rounded qtip-white-text',
				tip: {
					height: 10,
					width: 16
				}
			}
		}).trigger('show');
	};

	// проверяет форму
	var validateForm = function(form){
		var elements = $('form').find('input, textarea').not('input[type="file"], input[type="hidden"]'),
			valid = true;
		// console.log('в модуле валидации проверяю форму');

		$.each(elements, function(index, val){
			// console.log(index);
			// console.log(val);
			var element = $(val),
				val = element.val(),
				pos = element.attr('qtip-position');
			if (val.length === 0){
				_createQtip(element, pos);
				element.addClass('has-error');
				valid = false;
			};
		});
		return valid;
	};

	return {
	init: init,
	validateForm: validateForm
	};
})();

validation.init();