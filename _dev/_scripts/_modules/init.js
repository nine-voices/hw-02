// plugins init

$(document).ready(function(){
	if($('.slider__list').length) {
		$('.slider__list').bxSlider({
			pager: false,
			nextText: 'След.',
			prevText: 'Пред.'

		});
	};

	if($('.feedback__row-select').length) {
		$('.feedback__row-select').simleSelect();
	}

	if($('.selectbox__dropdown').length) {
		$('.selectbox__dropdown').ScrollPane();
	}

}); // -> ready_end