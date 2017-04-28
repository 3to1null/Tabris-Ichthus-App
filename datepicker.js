function showToast(text, time=3000, pagina){
	var colors = require('./colors.js')
	var toastContainer = new tabris.Composite({
		background: "#323232",
		layoutData: {
			bottom: "-60",
			left: 0,
			right: 0,
			height: 60,
		},
		elevation: 99
	}).appendTo(pagina);
	new tabris.TextView({
		id: "Toast",
		text: text,
		textColor: colors.white_bg,
		font: '15px',
		layoutData: {
			bottom: 0,
			left: '6%',
			right: '6%',
			height: 60
		}
	}).appendTo(toastContainer);
	toastContainer.animate({transform: {translationY: "-60"}}, {delay: 0, duration: 300, easing: "ease-out"});
	toastContainer.animate({transform: {translationY: "60"}}, {delay: time, duration: 400, easing: "ease-in", name: "dispose_toast"});
	toastContainer.on("animationend", function(toastContainer, options){
		if(options.name === "dispose_toast"){
			toastContainer.dispose();
		}
	})
}

module.exports = class DatePicker {
	constructor(startDate, showTimePicker){
		this.colors = require('./colors.js')
		this.date = {}
		this.months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
		this.text = [
			{header: 'Kies datum', button: 'Opslaan'},
			{header: 'Kies starttijd', button: 'Opslaan'},
			{header: 'Kies eindtijd', button: 'Opslaan'}
		]
		//zet de standaard vars goed
		if(startDate === undefined || startDate === 'today'){
			let today = new Date();
			this.date['day'] = today.getDate();
			this.date['month'] = today.getMonth();
		}
		if(showTimePicker === undefined || Boolean(showTimePicker) === true){
			this.showTimePicker = true
		}else{
			this.showTimePicker = false
		}
	}
	
	openIn(_widgetContainer){
		return new Promise((resolve, reject) => {
			var parentScope = this
			function isValid(dayNum, tijd){
				if(parseInt(dayNum) > 31){
					return false
				}else if(parseInt(tijd.split(':')[0]) > 24){
					return false
				}else if(parseInt(tijd.split(':')[1]) > 60){
					return false
				}
				return true
			}
			//creëert het widget en voegt het toe aan de container, naam is gekozen om hetzelfde te zijn.
			function saveModal(dayInput, monthInput, uurInput, MinuteInput){
				let dagNum = dayInput.get('text')
				let monthNum = parseInt(parentScope.months.indexOf(monthInput.get('selection'))) + 1
				let tijd = String(uurInput.get('text')) + ":" + String(MinuteInput.get('text'))
				let dateStringWords = String(dagNum) + ' ' + String(monthInput.get('selection') + ', ' + tijd)
				let dateStringNum = String(monthNum) + '-' + String(dagNum)
				if(!isValid(dagNum, tijd)){
					showToast('De datum en tijd klopt niet.', 3000, _widgetContainer)
					tabris.app.trigger('backnavigation');
					reject('Invalid dateTime')
				}else{
					tabris.app.trigger('backnavigation');
					resolve([dateStringNum, tijd, dateStringWords])
				}
			}
			function closeModal(){
				tabris.ui.set("background", parentScope.colors.UI_bg)
				localStorage.setItem('__preventBackNavigation', false)
				underlay.animate({
					opacity: '0'
				}, {
					duration: 150
				})
				modal.animate({
					opacity: '0'
				}, {
					duration: 170
				})
				modal.on('animationend', function(){
					modal.dispose();
					underlay.dispose();
					noTapButton.dispose()
				})
			}
			
			tabris.app.once('backnavigation', function(_app, event){
				if(localStorage.getItem('__preventBackNavigation') === 'true'){
					if(event !== undefined){
						event.preventDefault();
					}
					closeModal();
				}
			});
			
			localStorage.setItem('__preventBackNavigation', true)
			
			
			var underlay = new tabris.Composite({
				left:0, top:0, bottom:0, right:0, background: '#000', opacity: 0
			}).on('tap', function(_underlay){
				tabris.app.trigger('backnavigation')
			}).appendTo(_widgetContainer)
			
			
			var noTapButton = new tabris.Button({
				height: 200,
				width: 300,
				top: 100,
				centerX: 0,
				opacity: 0
			}).appendTo(_widgetContainer)
			var modal = new tabris.Composite({
				layoutData: {
					height: 200,
					width: 300,
					top: 100,
					centerX: 0,
				},
				opacity: 0,
				background: this.colors.white_bg,
				elevation: 24
			}).appendTo(_widgetContainer)
			
			new tabris.TextView({
				layoutData: {
					top: 16,
					left: 16,
					right: 16
				},
				text: this.text[0].header,
				font: 'bold 14px',
				textColor: this.colors.black
			}).appendTo(modal)
			
			var modalBody = new tabris.Composite({
				layoutData: {
					top: ['prev()', '4'],
					left: 20,
					right: 20,
				},
			}).appendTo(modal)
			var dayInput = new tabris.TextInput({
				layoutData: {
					left: 12,
					top: 0,
					width: 40,
					height: 40
				},
				keyboard: 'number',
				text: this.date.day,
				alignment: 'center'
			}).on('focus', function(widget){
				widget.set('text', '')
			}).appendTo(modalBody)
			var monthPicker = new tabris.Picker({
				layoutData: {
					right: 0,
					left: 72,
					top: 0,
					height: 40
				},
				items: this.months,
				selection: this.months[this.date.month],
				alignment: "center",
				itemText: function(item){
					return item
				},
			}).appendTo(modalBody)
			
			new tabris.TextView({
				layoutData: {
					top: [modalBody, '6'],
					left: 16,
					right: 16
				},
				text: this.text[1].header,
				font: 'bold 14px',
				textColor: this.colors.black
			}).appendTo(modal)
			
			var modalBody2 = new tabris.Composite({
				layoutData: {
					top: ['prev()', '4'],
					left: 20,
					right: 20,
				},
			}).appendTo(modal)
			
			new tabris.TextView({
				layoutData: {
					left: 52,
					top: 5,
					width: 20
				},
				text: ':',
				font: '16px',
				alignment: 'center'
			}).appendTo(modalBody2)
			
			var timeUurInput = new tabris.TextInput({
				layoutData: {
					left: 12,
					top: 0,
					width: 40,
					height: 40
				},
				keyboard: 'number',
				text: '9',
				alignment: 'center'
			}).on('focus', function(widget){
				widget.set('text', '')
			}).appendTo(modalBody2)
			var timeMinuutInput = new tabris.TextInput({
				layoutData: {
					left: 72,
					top: 0,
					width: 40,
					height: 40
				},
				keyboard: 'number',
				text: '00',
				alignment: 'center'
			}).on('focus', function(widget){
				widget.set('text', '')
			}).appendTo(modalBody2)
			
			
			new tabris.Composite({
				layoutData: {
					bottom: 0,
					left: 0,
					right: 0,
					height: 48
				},
				background: this.colors.black
			}).appendTo(modal)
			var modalFooter = new tabris.Composite({
				bottom: 0,
				height: 48,
				left: 0,
				right: 0,
				background: this.colors.white_bg
			}).on('touchstart', function(widget){
				widget.animate({opacity: 0.8}, {duration: 200, easing: "ease-out"});
			}).on('touchend',function(widget){
				widget.animate({opacity: 1}, {duration: 200, easing: "ease-out"});
				saveModal(dayInput, monthPicker, timeUurInput, timeMinuutInput)
			}).on('touchcancel', function(widget){
				widget.animate({opacity: 1}, {duration: 200, easing: "ease-out"});
			}).appendTo(modal)
			new tabris.TextView({
				layoutData: {
					centerY: 0,
					right: 16
				},
				text: this.text[0].button.toUpperCase(),
				textColor: this.colors.accent,
				font: 'bold 14px'
			}).appendTo(modalFooter)
			modal.animate({
				opacity: '1'
			}, {
				duration: 170
			})
			underlay.animate({
				opacity: '0.5'
			}, {
				duration: 150
			})
			if(!isMaterial){
				tabris.ui.set("background", 'rgb(29,37,85)')
			}
			return 'test'
		})
	}
}