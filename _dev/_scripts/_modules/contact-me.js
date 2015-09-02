"use strict";

var contactMe = (function(){

	// инициализирует модуль
	var init = function(){
		_setupListeners();
	};

	// следит за событиями
	var _setupListeners = function(){
		$('#contactMe').on('submit', _submitForm)
	};

	var _submitForm = function(e){
		// console.log('отправка формы');
		e.preventDefault();
		var form = $(this),
			url = 'contactMe.php',
			defObj = _ajaxForm(form, url);
	};

	var _ajaxForm = function(form, url){
		// console.log('аякс запрос');
		if(!validation.validateForm(form)) return false;
	};

		// добавляем placeholder для отображения в ИЕ8
		$('input, textarea').placeholder();

	return {
		init: init
	}

})();

contactMe.init();