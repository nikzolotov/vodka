/**
 * Скролл по иллюстрациям
 */
var coverScroll = (function(){
	var SETTINGS = {
		coverSelector: '#projects .item',
		headerSelector: '#header',
		topButtonSelector: '#top-button',
		animationTime: 600,
		animationEasing: 'easeOutCubic'
	};
	
	var _window, _document, _header,
		_windowHeight, _documentHeight, _headerHeight,
		_covers, _coverNumber, _topButton,
		_isScrolling, _distance, _isFooterScrolled;
	
	function initScroll(){
		var currentDistanceToScroll = 0,
			previousDistanceToScroll = 0;
		
		for( var i = 0; i < _covers.length - 1; i++ ){
			distanceToScroll = _window.scrollTop() + _headerHeight - _covers.eq(i).offset().top;
			
			if( distanceToScroll <= 0 ){
				if( previousDistanceToScroll < distanceToScroll * -1 ){
					i--;
				}
				break;
			}
			
			previousDistanceToScroll = distanceToScroll;
		}
		
		_coverNumber = i;
		_distance = _covers.eq(_coverNumber).offset().top - _headerHeight;
		
		scrollToDistance();
	}
	
	function assignEvents(){
		_window.bind('mousewheel', function(event, delta) {
			
			if( delta < 0 && _isScrolling === false ){
				scroll('down');
			}
			else if( delta > 0 && _isScrolling === false ){
				scroll('up');
			}
			
			event.preventDefault();
		});
		
		_topButton.click(function(event){
			_isScrolling = true;
			_coverNumber = 0;
			_distance = 0;
			
			scrollToDistance();
			
			event.preventDefault();
		});
		
		_window.resize(function() {
			_windowHeight = _window.height();
			_documentHeight = _document.height();
		});
	}
	
	function scroll( direction ){
		_isScrolling = true;
		
		if( direction === 'down' ){
			if( _coverNumber < _covers.length - 1 ){
				_coverNumber++;
				_distance = _covers.eq(_coverNumber).offset().top - _headerHeight;
			}
			else if( _documentHeight - _window.scrollTop() > _windowHeight ){
				_distance = _documentHeight - _windowHeight;
				_isFooterScrolled = true;
			}
		}
		else if( direction === 'up' && _coverNumber > 0 ){
			if( !_isFooterScrolled ){
				_coverNumber--;
			}
			else {
				_isFooterScrolled = false;
			}
			_distance = _covers.eq(_coverNumber).offset().top - _headerHeight;
		}
		
		if( _distance < 0 ){
			_distance = 0;
		}
		
		scrollToDistance();
	}
	
	function scrollToDistance(){
		$.scrollTo(_distance, SETTINGS.animationTime, {easing: SETTINGS.animationEasing, onAfter: function(){
			_isScrolling = false;
		}});
	}
	
	return {
		init: function( userSettings ){
			_window = $(window);
			_document = $(document);
			_header = $(SETTINGS.headerSelector);
			
			_windowHeight = _window.height();
			_documentHeight = _document.height();
			_headerHeight = _header.height() + parseInt(_header.css("padding-top"), 10) + parseInt(_header.css("padding-bottom"), 10);
			
			_covers = $(SETTINGS.coverSelector);
			_coverNumber = 0;
			_topButton = $(SETTINGS.topButtonSelector);
			
			_isScrolling = false;
			_distance = 0;
			_isFooterScrolled = false;
			
			if( _covers.length ){
				initScroll();
				assignEvents();
			}
		}
	};
})();