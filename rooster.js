var version = 170 //1.6.1
//var baseURL = "http://192.168.2.3:8000/"
var baseURL = "https://api.fraignt.me/"
isMaterial = false
if(parseInt(device.version) >= 5){
	isMaterial = true
}
console.log(device.version)
getAgendaIsFinished = false
getRoosterIsFinished = false
var colors = require('./colors.js')


var $ = require("./jquery.js")
var page = new tabris.Page({
	 title: "Rooster",
	 topLevel: true
})

function decode_utf8(s) {
	 return decodeURIComponent(escape(s));
}
function encode_utf8(s) {
  return unescape(encodeURIComponent(s));
}

function alertDismissed(){}


if(localStorage.getItem('proposals') == null || localStorage.getItem('proposals') == undefined){
	 var __prop = new Array()
	 __prop[0] = ''
	 localStorage.setItem('proposals', JSON.stringify(__prop))
	 var __prop = undefined
	 }

function generate_drawer(){
	 var drawer = new tabris.Drawer();
	 var items = ['Rooster', 'Cijfers', 'Examendossier', 'Agenda', 'Bestanden', 'Instellingen']
	 var containerTop = new tabris.Composite({
		  layoutData: {
				left: 0,
				right: 0,
				top: 0,
				height: 80
		  },
		  background: '#e0e0e0' 
	 }).on('tap', function(){
		 page.open()
		  drawer.close()
		  page.find('.roosterCollection').dispose()
		  page.set('title', localStorage.getItem('__Naam'))
		  localStorage.setItem('showName', localStorage.getItem('__Naam'))
		  get_rooster('~me', localStorage.getItem('code'));
		  getRoosterIsFinished = false;
	 })
	 .appendTo(drawer)
	 var naamView = new tabris.TextView({
		  layoutData: {
				top: 20,
				left: 10
		  },
		  id: 'naamView',
		  font: 'black 20px',
		  text: ''
	 }).appendTo(containerTop)
	 var dataView = new tabris.TextView({
		  layoutData: {
				bottom: 12,
				left: 10
		  },
		  font: '14px',
		  id: 'dataNaamView',
		  text: ''
	 }).appendTo(containerTop)
	 //new tabris.Composite({
	 //   layoutData: {
	 //      left: 0,
	 //      bottom: 0,
	 //      right: 0,
	 //      height: 2
	 //   },
	 //   background: "#c3c3c3"
	 //}).appendTo(containerTop);
	 var collection = new tabris.CollectionView({
		  layoutData: {
				left: 0,
				top: 90,
				right: 0,
				bottom: 0
		  },
		  items: items,
		  itemHeight: 46,
		  initializeCell: function(cell){
				var naam = new tabris.TextView({
					 layoutData: {
						  top: 7,
						  bottom: 7,
						  left: 10
					 },
					 font: '16px',
					 textColor: '#202020'
				}).appendTo(cell);
				new tabris.Composite({
					 layoutData: {
						  left: 0,
						  bottom: 0,
						  right: 0,
						  height: 1
					 },
					 background: colors.divider
				}).appendTo(cell);
				cell.on("change:item", function(widget, data){
					 naam.set('text', data);
				})
		  } 
	 }).on('select', function(target, value){
		 if(value === items[0]){ //als knop gelijk is aan rooster, open rooster pagina, sluit drawer
			 page.open();
			 drawer.close();
		 } else if(value === items[1]){
			 cijferPage.open();
			 drawer.close();
		 } else if(value === items[2]){
			 dossierPage.open();
			 drawer.close();
		 }else if(value === items[3]){
			 AgendaPagina.open();
			 drawer.close();
		 }else if(value === items[4]){
			 filesPage.open();
			 drawer.close();
		 } else if(value === items[5]){
			 settingsPage.open();
			 drawer.close()
		 } 
//		 else if(value === items[5]){ //uitloggen
//			 logUitCheck();
//			 drawer.close();
//		 }
	 }).appendTo(drawer)
	 return(drawer)
}

function logUitCheck(){
	navigator.notification.confirm(
		'Weet je zeker dat je wilt uitloggen? De app wordt na het uitloggen opnieuw opgestart.', // message
		logUitCheck2,            // callback to invoke with index of button pressed
		'Uitloggen',           // title
		['Uitloggen','Cancel']     // buttonLabels
	);
}
function logUitCheck2(buttonIndex){
	if(buttonIndex === '1' || buttonIndex === 1){
		logUit(false)
	}
}

//tabris.ui.set("background", "#0d47a1") //verander kleur van navigatie bar
tabris.ui.set("background", colors.UI_bg)
var drawer = generate_drawer();
page.open()
//if(localStorage.getItem('code') == null && localStorage.getItem('code') == ''){
//  logUit(true)
//}
function showToast(text, time=3000, pagina){
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
	toastContainer.once("animationend", function(toastContainer, options){
		if(options.name === "dispose_toast"){
			toastContainer.dispose();
		}
	})
}

// tabs, en de listeners daarvan


var tabFolder = new tabris.TabFolder({
	 layoutData: {left: 0, top: 0, right: 0, bottom: 0},
	 textColor: colors.white_bg,
	 paging: true, // enables swiping. 
	 background: colors.UI_bg
}).appendTo(page);
var tab_0 = new tabris.Tab({
	 background: colors.white_bg,
	 id: 'tab_0',
	 title: 'vorige week'
}).appendTo(tabFolder);
var tab_1 = new tabris.Tab({
	 background: colors.white_bg,
	 title: 'deze week', // converted to upper-case on Android
	 id: 'tab_1'
}).appendTo(tabFolder);
var tab_2 = new tabris.Tab({
	 background: colors.white_bg,
	 title: 'volgende week',
	 id: 'tab_2'
}).appendTo(tabFolder);

var laadRoosterIcon = new tabris.ActivityIndicator({
	 centerX: 0,
	 centerY: 0
}).appendTo(tab_1);
laadRoosterIcon.set("visible", true);


tabFolder.set('selection', tab_1)

var load_0 = false
var load_2 = false

tabFolder.on("select", function(widget, tab){
	 if(tab.get('id') == 'tab_0' && getRoosterIsFinished == true){
		  if(load_0 == false){
				var r = JSON.parse(localStorage.getItem('__rooster'))
				render_rooster(r['week_0'], tab_0)
				load_0 = true
		  }
	 }else if(tab.get('id') == 'tab_2' && getRoosterIsFinished == true){
		  if(load_2 == false){
				var r = JSON.parse(localStorage.getItem('__rooster'))
				render_rooster(r['week_2'], tab_2)  
				load_2 = true
		  }
	 }
});

//maak het zoek icoontje rechtsbovenin


start_rooster()

function logUit(sessieVerlopen=true){
	 if(sessieVerlopen == false){
		  loginPage()
		  if(drawer !== undefined && drawer !== null){
				drawer.dispose()
		  }
		  if(actionZoek !== undefined && actionZoek !== null){
				actionZoek.set("visible", false)   
		  }
		 if(localStorage.getItem('code') !== null){
			 tabris.app.reload()
		 }
		  localStorage.clear();  
	 } else {
		  if(localStorage.getItem('-s-verlengSessie') != 'false'){
				verlengSessie()
		  } else {
				localStorage.setItem('code', null);
				loginPage()
				if(drawer !== undefined && drawer !== null){
					 drawer.dispose()
				}
				if(actionZoek !== undefined && actionZoek !== null){
					 actionZoek.set("visible", false)   
				}
		  }
	 }
}


module.exports = page


function start_rooster(){
	if(localStorage.getItem('latency') != null && localStorage.getItem('latency') != undefined){
		logUit(false)
	}else if(localStorage.getItem('code') == null){
		logUit(false)
	}else if(localStorage.getItem('code').length < 5){
		logUit(false)  
	}else{
		var week = get_rooster("~me", localStorage.getItem('code'))
		if(localStorage.getItem('__Naam') !== null){
			localStorage.setItem('showName', localStorage.getItem('__Naam'))
			page.set('title', localStorage.getItem('showName'))
			drawer.find('#naamView').set('text', localStorage.getItem('__Naam'))
			drawer.find('#dataNaamView').set('text', localStorage.getItem('__dataNaamView'))
		}
	}
}
function get_rooster(user, code){
	laadRoosterIcon.set("visible", true);
	tabFolder.set('selection', tab_1)
	$.ajax({
		timeout: 1,
		type: 'GET',
		//url: "https://api.fraignt.me/Rooster/schedule/2/",
		url: baseURL + "Rooster/schedule/2/",
		data: {
			token: code,
			user: user,
			n: localStorage.getItem('__Naam'),
			__user: localStorage.getItem('__User'),
			version: version
		},
		success: function(response, textStatus, xhr){
			if(user == '~me'){
				localStorage.setItem('rooster', JSON.stringify(response));
				var nu = new Date()
				localStorage.setItem('__tijd', nu.getTime())
			}
			localStorage.setItem('__rooster', JSON.stringify(response));
			r = JSON.parse(JSON.stringify(response))
			var w1 = render_rooster(r['week_1'], tab_1)
			getRoosterIsFinished = true
			load_0 = false;
			load_2 = false;
			//render_rooster(r['week_0'], tab_0)
			//render_rooster(r['week_2'], tab_2)
		},
		error: function(response, textStatus, xhr){
			if(parseInt(response.status) == 404){
				get_rooster(user, code)
			}
			if(parseInt(response.status) == 401){
				logUit(true);
				getRoosterIsFinished = false
			} else if(localStorage.getItem('rooster') != null && localStorage.getItem('rooster') != '' && user == '~me'){
				localStorage.setItem('__rooster', localStorage.getItem('rooster'))
				r = JSON.parse(localStorage.getItem('rooster'))
				var w1 = render_rooster(r['week_1'], tab_1)
				getRoosterIsFinished = true
				var nu = new Date()
				if(parseInt(nu.getTime()) - parseInt(localStorage.getItem('__tijd')) > 86400000){ // 86400000 is 24 uur
					showToast('Dit rooster is ouder dan een dag, er kunnen lessen veranderd zijn. Open het rooster met een internet verbinding om het bij te werken.', 6000, page)
				} 
			}else{
				showToast('Omdat er geen verbinding en geen offline rooster is wordt er geprobeerd opnieuw verbinding te maken.', 5000, page)
				get_rooster(user, localStorage.getItem('code'));
			}
		},
		timeout: 2000
	})
}

function render_rooster(rooster, container){
	actionZoek.set('visible', true);
	page.set('title', localStorage.getItem('showName'))
	var renderDagen = true
	var collectionTopMargin = 0
	var width = tabris.device.get("screenWidth");
	if(renderDagen == true){
		var collectionTopMargin = 20
		function render_dagen(){
			var dagen = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag']
			var collection = new tabris.CollectionView({
				layoutData: {
					left: 0,
					top: 0,
					right: 0,
				},
				items: dagen,
				itemHeight: 20,
				columnCount: 5,
				initializeCell: function(cell){
					var cellContainer = new tabris.Composite({
						left: 0,
						top: 0,
						right: 0,
						bottom: 0
					}).appendTo(cell)
					var dagText = new tabris.TextView({
						layoutData: {
							top: 0,
							right: 0,
							left: 0,
							height: 20,
						},
						alignment: 'center',
						textColor: colors.white_bg
					}).appendTo(cellContainer)
					cell.on("change:item", function(widget, dag){
						dagText.set('text', dag)
						cellContainer.set('background', colors.UI_bg)
					})
				} 
			}).appendTo(container)
			}
		render_dagen()
	}
	function render_tab(container, data){
		function get_background_color(data){
			if(data['__n__'] < 5 || 
				(data['__n__'] >= 10 && data['__n__'] < 15) ||
				(data['__n__'] >= 20 && data['__n__'] < 25) ||
				(data['__n__'] >= 30 && data['__n__'] < 35) ||
				(data['__n__'] >= 40 && data['__n__'] < 45)){
				var odd = true
				}
			if(data['__render__'] == false){
				if(odd == true){
					var color = '#b3b3b3'
					} else{
						var color = '#cccccc'
						}
			} else {  
				if(data['cancelled'] == true){
					if(odd == true){
						var color = '#ff0000';
					}else{
						var color = '#ff3333';
					}
				}else if(data['moved'] == true){
					if(odd == true){
						var color = '#ff9900';
					} else {
						var color = '#ffad33';
					}
				}else{
					if(odd == true){
						var color = '#ccccff'
						} else{
							var color = '#e6e6ff'
							}
				}
			}
			return(color)
			
		}
		if(localStorage.getItem('-s-showLeraar') != 'false'){
			var topLeraar = 0
			var topLokaal = 40
			var topVak = 20
			if(localStorage.getItem('-s-showKlas') == 'true'){
				var topKlas = 60
				}
		}else if(localStorage.getItem('-s-showKlas') == 'true'){
			var topKlas = 40
			var topVak = 0
			var topLokaal = 20 
			}
		else{
			var topVak = 0
			var topLokaal = 20
			}
		var cellAmount = 2
		if(localStorage.getItem('-s-showKlas') == 'true'){
			var cellAmount = cellAmount + 1
			}
		if(localStorage.getItem('-s-showLeraar') != 'false'){
			var cellAmount = cellAmount + 1
			}
		var collection = new tabris.CollectionView({
			layoutData: {
				left: 0,
				top: collectionTopMargin,
				right: 0,
				bottom: 0
			},
			class: 'roosterCollection',
			items: data,
			itemHeight: 20 * cellAmount,
			columnCount: 5,
			initializeCell: function(cell){
				var leraar = new tabris.TextView({
					layoutData: {
						top: topLeraar,
						height: 20,
						//width: (parseInt(width) / 5),
					}})
				if(localStorage.getItem('-s-showLeraar') != 'false'){
					leraar.appendTo(cell)
				}
				var klas = new tabris.TextView({
					layoutData: {
						top: topKlas,
						height: 20,
						//width: (parseInt(width) / 5),
					}})
				if(localStorage.getItem('-s-showKlas') == 'true'){
					klas.appendTo(cell)
				}
				var vak = new tabris.TextView({
					layoutData: {
						top: topVak,
						height: 20,
						//width: (parseInt(width) / 5),
					}
				}).appendTo(cell)
				var lokaal = new tabris.TextView({
					layoutData: {
						top: topLokaal,
						height: 20,
						//width: (parseInt(width) / 5),
					}
				}).appendTo(cell)
				var n = 1
				cell.on("change:item", function(widget, data){
					if(data['__render__'] != false && data['__render__'] != 'False'){
						leraar.set("text", data.teachers)
						if(data.groups.length < 3){
							klas.set('text', data.groups)
						}else{
							klas.set('text', data.groups[0] + " +" + String(data.groups.length - 1))
						}
						lokaal.set("text", data.locations);
						vak.set("text", data.subjects);
					} else {
						klas.set('text', '')
						leraar.set('text', '')
						lokaal.set('text', '');
						vak.set("text", '');
					}
					cell.set("background", get_background_color(data))
				})
			} 
		}).appendTo(container)
		tabFolder.set('selection', tab_1)
		laadRoosterIcon.set("visible", false);
		return('finished')
	}
	render_tab(container, rooster);
	page.set('title', localStorage.getItem('showName'))
	//page.set('title', 'Ik Ben Eigenlijk Veel Te Lang Voor Deze Titel(pls dont talk like this)')
	if(!getAgendaIsFinished){
		get_agendaItems()
		getAgendaIsFinished = true
	}
	return('finished')
}

// ---------------------------------------------------------------
// ------------------------- ZOEK BALK ---------------------------
// ---------------------------------------------------------------
//

if(localStorage.getItem('proposals') == null || localStorage.getItem('proposals') == undefined){
	 var __prop = new Array()
	 __prop[0] = localStorage.getItem('__Naam')
	 localStorage.setItem('proposals', JSON.stringify(__prop))
	 var __prop = undefined
	 }

var searchBox = new tabris.Composite({
	 layoutData: {centerX: 0, centerY: 0}
}).appendTo(page);

var proposals = JSON.parse(localStorage.getItem('proposals'))

var actionZoek = new tabris.SearchAction({
	 title: "Zoeken",
	 image: {src: "img/icon_zoek.png", scale: 1.3},
	 visible: false
}).on("select", function() {
	 this.set("text", "");
	 var proposals = JSON.parse(localStorage.getItem('proposals'));
}).on("input", function(widget, query) {
	 updateProposals(query);
}).on("accept", function(widget, query) {
	 if(proposals.includes(query) !== true){
		  proposals.unshift(query);
		  localStorage.setItem('proposals', JSON.stringify(proposals))
	 }else{
		  var index = proposals.indexOf(query);
		  if(proposals[index] == query){
				proposals.splice(parseInt(index), (parseInt(index) + 1))
		  }
		  proposals.unshift(query);
		  localStorage.setItem('proposals', JSON.stringify(proposals))
	 }
	 display_results(query);
});

updateProposals("");


function updateProposals(query) {
	 actionZoek.set("proposals", proposals.filter(function(proposal) {
		  try{
				return proposal.indexOf(query) !== -1;
		  } catch (err){
				console.log(err)
		  }
	 }));
}

// ------------------------------------------------------------------
// ------------------------- ZOEK PAGINA ----------------------------
// ------------------------------------------------------------------


function display_results(zoekOpdracht){
	 function open_search(){
		  return new tabris.Page({
				topLevel: false,
				title: 'Resultaten voor "' + zoekOpdracht + '"'
		  })
	 }
	 var searchResultsPage = open_search()
	 var laadZoekIcoon = new tabris.ActivityIndicator({
		  centerX: 0,
		  centerY: 0
	 }).appendTo(searchResultsPage);
	 
	 function display_search_results(leerlingen, leraren){
		  var tabFolder = new tabris.TabFolder({
				layoutData: {left: 0, top: 0, right: 0, bottom: 0},
				textColor: colors.white_bg,
				paging: true, 
				background: colors.UI_bg
		  }).appendTo(searchResultsPage);
		  var tab_leerlingen = new tabris.Tab({
				background: colors.white_bg,
				id: 'tab_0',
				title: 'leerlingen'
		  }).appendTo(tabFolder);
		  var tab_leraren = new tabris.Tab({
				background: colors.white_bg,
				title: 'leraren', 
				id: 'tab_1'
		  }).appendTo(tabFolder);
		  
		  function create_collection(data, container, isLeerling){
				var collection = new tabris.CollectionView({
					 layoutData: {
						  left: 0,
						  top: 0,
						  right: 0,
						  bottom: 0
					 },
					 items: data,
					 itemHeight: 46,
					 initializeCell: function(cell){
						  var naam = new tabris.TextView({
								layoutData: {
									 top: 7,
									 bottom: 7,
									 left: 10
								},
								font: '16px',
								textColor: '#202020'
						  }).appendTo(cell);
						  var onderwerp = new tabris.TextView({
								layoutData: {
									 top: 7,
									 bottom: 7,
									 right: 15
								},
								font: '16px',
								textColor: '#202020'
						  }).appendTo(cell);
						  new tabris.Composite({
								layoutData: {
									 left: 0,
									 bottom: 0,
									 right: 0,
									 height: 1
								},
								background: colors.divider
						  }).appendTo(cell);
						  cell.on("change:item", function(widget, data){
								naam.set('text', decode_utf8(data.name));
								onderwerp.set('text', isLeerling ? data.group.toUpperCase() : data.subject)
						  })
					 } 
				}).on("select", function(target, value){
					 localStorage.setItem('showName', value.name); 
					 localStorage.setItem('__rooster', null);
					 if(proposals.includes(value.name) !== true){
						  proposals.unshift(value.name);
						  localStorage.setItem('proposals', JSON.stringify(proposals))
					 }else{
						  var index = proposals.indexOf(value.name);
						  if(proposals[index] == value.name){
								proposals.splice(parseInt(index), (parseInt(index) + 1))
						  }
						  proposals.unshift(value.name);
						  localStorage.setItem('proposals', JSON.stringify(proposals))
					 }
					 page.find('.roosterCollection').dispose()
					 get_rooster(value.code, localStorage.getItem('code'));
					 getRoosterIsFinished = false;
					 searchResultsPage.close()
				}).appendTo(container)
				}
		  create_collection(leerlingen, tab_leerlingen, true);
		  create_collection(leraren, tab_leraren, false);
		  laadZoekIcoon.set('visible', false)
		  
	 }
	 function zoek_DB(code, query){
		 var ID = localStorage.getItem('__ID')
		  $.ajax({
				type: 'POST',
				url: "https://matthijsmgj.nl/rooster/search_engine.php/",
				data: {code: ID, search: encode_utf8(query)},
				success: function(response){
					 var r = JSON.parse(response)
					 var leerlingen = r.data.students
					 var leraren = r.data.teachers
					 display_search_results(leerlingen, leraren)
				}
		  })
	 }
	 searchResultsPage.open()
	 zoek_DB(localStorage.getItem('code'), zoekOpdracht)
}
page.on("appear", function(){actionZoek.set("visible", true)})
.on("disappear", function(){actionZoek.set("visible", false)})

// ---------------------------------------------------------------
// ---------------------- Verleng Sessie -------------------------
// ---------------------------------------------------------------

function verlengSessie(){
	 showToast("Je sessie is verlopen, hij wordt nu automatisch verlengd.", 3000, page)
	 $.ajax({
		  type: 'POST',
		  //url: "https://api.fraignt.me/Rooster/auth/",
		  url: baseURL + "Rooster/auth/",
		  data: {
				username: localStorage.getItem('__User'), 
				sessionUp: 'True', 
				code: localStorage.getItem('code')
		  },
		  success: function(response){
				if(response.code != false){
					 localStorage.setItem("code", response.code);
					 localStorage.setItem("roosterUser", "~me");
					 start_rooster()
				} else{
					 logUit(false)
				}
		  },
		  error: function(){
				logUit(false)
		  },
		  timeout: 2000
	 });
}

// ---------------------------------------------------------------
// ---------------------- LOGIN PAGINA ---------------------------
// ---------------------------------------------------------------
function loginPage(){
	var login = new tabris.Page({   // maak login pagina
		topLevel: true,
		title: "Inloggen",
	});
	tabris.ui.set('toolbarVisible', false);
	var loginBovenContainer = new tabris.Composite({
		layoutData: {
			top: 0,
			height: 180,
			left: 0,
			right: 0,
		},
		id: "loginBovenContainer",
		elevation: 4,
		background: colors.UI_bg_light,
		
	}).appendTo(login)
	new tabris.TextView({
		text: 'Gebruik je Ichthus account om in te loggen.',
		id: "subTextLoginScreen",
		layoutData: {
			bottom: 15,
			left: 30,
			right: 30,
		},
		font: '14px',
		textColor: colors.white_light_bg
	}).appendTo(loginBovenContainer)
	new tabris.TextView({
		text: "Inloggen",
		layoutData: {
			left: 30,
			bottom: '#subTextLoginScreen',
		},
		font: '29px',
		textColor: colors.white_bg
	}).appendTo(loginBovenContainer)
	var loginContainer = new tabris.Composite({
		layoutData: {
			top: '#loginBovenContainer',
			bottom: 50,
			right: 0,
			left: 0
		},
		background: colors.white_bg,
		elevation: 2
	}).appendTo(login)
	login.open();   // open de login pagina
	
	
	
	var bottomContainerBackground = new tabris.Composite({
		layoutData: {
			right: 0,
			left: 0,
			bottom: 0,
			height: 50,
		},
		background: colors.black_grey
	}).appendTo(login)
	var bottomContainer = new tabris.Composite({
		layoutData: {
			bottom: 0,
			top: 0,
			right: 0,
			left: 0
		},
		background: colors.white_white_grey_bg
	}).appendTo(bottomContainerBackground)
	new tabris.Composite({
		layoutData: {
			bottom: 0,
			height: 50,
			width: 100,
			right: 0
		}
	}).on('touchstart', function(widget){
		bottomContainer.animate({opacity: 0.5}, {duration: 200, easing: "ease-out"});
	}).on('touchcancel', function(widget){
		bottomContainer.animate({opacity: 1}, {duration: 200, easing: "ease-out"});
	}).on('touchend', function(widget){
		bottomContainer.animate({opacity: 1}, {duration: 200, easing: "ease-out"});
		var username = loginContainer.children("#usernameInput").get("text");
		var password = loginContainer.children("#passwordInput").get("text");
		check_login(username, password, bottomContainer, logInText);
	}).appendTo(bottomContainer)
	var logInText= new tabris.TextView({
		layoutData: {
			right: 20,
			centerY: 0
		},
		textColor: colors.UI_bg_light,
		font: 'bold 17px',
		text: "Inloggen",
	}).appendTo(bottomContainer)
	
	new tabris.TextView({
		layoutData: {
			top: 32,
			left: 31,
		},
		text: 'Leerlingnummer',
		font: '17px',
		id: "loginUsernameInputLabel",
		textColor: colors.black_grey
	}).appendTo(loginContainer)
	
	new tabris.TextInput({       //maak input van username
		layoutData: {
			top: 20,
			left: 30,
			right: 30
		},
		id: "usernameInput",
		message: ""
	}).on('focus', function(textInput){
		loginContainer.children('#loginUsernameInputLabel').animate({
			transform: {
				scaleX: 0.7,
				scaleY: 0.7,
				translationY: -20,
				translationX: -20
			},
			
		},{
			easing: 'ease-in-out'
		})
		loginContainer.children('#loginUsernameInputLabel').set('textColor', colors.accent)
	}).appendTo(loginContainer);
	
	new tabris.TextView({
		layoutData: {
			top: 77,
			left: 31,
		},
		text: 'Wachtwoord',
		font: '17px',
		id: "loginPasswordInputLabel",
		textColor: colors.black_grey
	}).appendTo(loginContainer)
	
	
	new tabris.TextInput({       //maak input van wachtwoord
		layoutData: {
			left: 30,
			right: 30,
			top: ["#usernameInput", 2], // 2px onder #usernameInput
		},
		id: "passwordInput",
		type: "password",
		message: ""
	}).on('focus', function(textInput){
		loginContainer.children('#loginPasswordInputLabel').animate({
			transform: {
				scaleX: 0.7,
				scaleY: 0.7,
				translationY: -20,
				translationX: -16
			},
			
		},{
			easing: 'ease-in-out'
		})
		loginContainer.children('#loginPasswordInputLabel').set('textColor', colors.accent)
	}).appendTo(loginContainer)
	
	if(!isMaterial){
		new tabris.Composite({
			layoutData: {
				bottom: 0,
				left: 0,
				right: 0,
				height: 2,
			},
			background: colors.divider
		}).appendTo(loginContainer)
		new tabris.Composite({
			layoutData: {
				top: 0,
				height: 1,
				left: 0,
				right: 0
			},
			background: colors.black
		}).appendTo(loginContainer)
	}
	
	//new tabris.Button({
	//	layoutData: {
	//		left: "30%",
	//		right: "30%",
	//		top: ["#passwordInput", 15]
	//	},
	//	id: "submit",
	//	text: "Inloggen",
	//	background: colors.UI_bg,
	//	highlightOnTouch: true,
	//	textColor: colors.white_bg
	//}).on("touchstart", function (Button) {
	//	Button.animate({opacity: 0.8}, {duration: 130, easing: "ease-out"});
	//}).on("touchend", function (Button) {
	//	Button.animate({opacity: 1}, {duration: 130, easing: "ease-out"});
	//	var username = loginContainer.children("#usernameInput").get("text");
	//	var password = loginContainer.children("#passwordInput").get("text");
	//	check_login(username, password);
	//}).appendTo(loginContainer);
	
	function check_login(user, pass, box, text){
		text.set("visible", false)
		var activityIndicator = new tabris.ActivityIndicator({
			centerX: 0,
			centerY: 0,
		}).appendTo(box);
		$.ajax({
			type: 'POST',
			//url: "https://api.fraignt.me/Rooster/auth/",
			url: baseURL + "Rooster/auth/",
			data: {username: user, password: pass},
			success: function(response){
				activityIndicator.set("visible", false);
				if(response.code != false){
					tabris.ui.set('toolbarVisible', true);
					localStorage.setItem("code", response.code);
					localStorage.setItem("__ID", user);
					localStorage.setItem("roosterUser", "~me");
					localStorage.setItem("__User", user)
					_$$cA()
					showMSG();
					//var rooster = require("./rooster.js");
					login.close();
					drawer = generate_drawer();
					actionZoek.set("visible", true)
					krijgNaam(response.code, user);
					start_rooster()
				} else{
					showToast("Leerlingnummer, afkorting of wachtwoord is incorrect.", 2000, login)
					text.set("visible", true)
				}
			},
			error: function(){
				text.set("visible", true)
				activityIndicator.set("visible", false);
				showToast('Er kan geen verbinding gemaakt worden', 2000, login)
			},
			timeout: 3000
		});
	};
	function krijgNaam(code, ID){
		$.ajax({
			type: 'POST',
			url: "https://matthijsmgj.nl/rooster/search_engine.php/",
			data: {code: ID, search: ID},
			success: function(response){
				if(ID.length > 3){
					var r = JSON.parse(response)
					var naam = decode_utf8(r.data.students[0].name)
					if(localStorage.getItem('__Naam') === null){
						page.set('title', naam)
					}
					localStorage.setItem('name', naam)
					drawer.find('#naamView').set('text', naam)
					var klas = r.data.students[0].group
					var afk = r.data.students[0].code
					localStorage.setItem('__dataNaamView', klas.toUpperCase() + ' | ' + afk)
					drawer.find('#dataNaamView').set('text', klas.toUpperCase() + ' | ' + afk)
				}
				else if(ID.length === 3){
					var r = JSON.parse(response)
					var naam = r.data.teachers[0].name
					localStorage.setItem('name', naam)
					drawer.find('#naamView').set('text', naam)
					var afk = r.data.teachers[0].code
					localStorage.setItem('__dataNaamView', afk)
					drawer.find('#dataNaamView').set('text', afk)
				}
				localStorage.setItem('showName', localStorage.getItem('name'));
				if(ID == localStorage.getItem('__ID')){
					localStorage.setItem('__Naam', localStorage.getItem('name'))
				}
			},
		})
	}
}

// ------------------------------------------------------------------------
// ----------------------- INSTELLINGEN PAGINA ----------------------------
// ------------------------------------------------------------------------

var settingsPage = new tabris.Page({
	topLevel: true,
	title: 'Instellingen'
})
function verwijderProposals(buttonIndex){
	if(buttonIndex == 2){
		  proposals = ['']
		  var __prop = new Array()
		  __prop[0] = ''
		  localStorage.setItem('proposals', JSON.stringify(__prop))
		  var __prop = undefined
		  showToast('Zoek geschiedenis is verwijderd', 3500, settingsPage)
	 }
}

function toBool(string){
	if(string === "true" || string === "True" || string === true){
		return true
	}else{
		return false
	}
}

var settingsList = require('./settings.json');

function renderSettings(settingsList, settingsPage){
	var collection = new tabris.CollectionView({
		layoutData: {
			left: 0,
			top: 0,
			right: 0,
			bottom: 0
		},
		items: settingsList,
		cellType: function(item){
			return item.type
		},
		itemHeight: function(item, type){
			return item.isHeader ? 24 : 48
		},
		initializeCell: function(cell, type){
			if(type !== "header"){
				var descRight = 0
				if(type !== "confirm"){
					var descRight = 100 
				}
				var desc = new tabris.TextView({
					layoutData: {
						centerY: 0,
						left: 25,
						right: descRight
					},
					font: '15px',
					textColor: colors.black
				}).appendTo(cell);
				new tabris.Composite({
					layoutData: {
						left: 0,
						bottom: 0,
						right: 0,
						height: 1
					},
					background: colors.divider
				}).appendTo(cell);
				if(type === "bool"){
					var boolSwitch = new tabris.Switch({
						layoutData: {
							centerY: 0,
							right: 20
						},
						thumbOnColor: colors.accent,
						trackOnColor: colors.accent_light
					}).appendTo(cell)
				}else if(type === "picker"){
					var picker = new tabris.Picker({
						layoutData: {
							centerY: 0,
							right: 20
						},
						itemText: function(item){
							return item.name
						},
						alignment: "right",
						textColor: colors.accent,
					}).appendTo(cell)
				}
			}else{
				var header = new tabris.TextView({
					layoutData: {
						bottom: 0,
						left: 10
					},
					textColor: colors.accent,
					font: "bold 14px"
				}).appendTo(cell)
				}
			cell.on("change:item", function(widget, data){
				if(data.isHeader){
					header.set('text', data.header);
				}else{
					desc.set('text', data.desc);
					if(data.type === "bool"){
						if(localStorage.getItem(data.storageKey) !== null){
							boolSwitch.set('selection', toBool(localStorage.getItem(data.storageKey)))
						}else{
							boolSwitch.set('selection', data.default)
						}
						boolSwitch.on('change:selection', function(widget, selection){
							var temp_confirmIfDiff = localStorage.getItem(data.storageKey)
							localStorage.setItem(data.storageKey, selection);
							if(data.toastOnChange !== "None" && temp_confirmIfDiff !== localStorage.getItem(data.storageKey)){
								showToast(data.toastOnChange, 3500, settingsPage)
							}
							delete temp_confirmIfDiff
						});
					}else if(data.type === "picker"){
						picker.set('items', data.options)
						if(localStorage.getItem(data.storageKey) !== null){
							picker.set('selection', data.options[parseInt(localStorage.getItem(data.storageKey))])
						}else{
							picker.set('selection', data.options[parseInt(data.default)])
						}
						picker.on("change:selectionIndex", function(picker, index){
							var temp_confirmIfDiff = localStorage.getItem(data.storageKey)
							localStorage.setItem(data.storageKey, index);
							if(data.toastOnChange !== "None" && temp_confirmIfDiff !== localStorage.getItem(data.storageKey)){
								showToast(data.toastOnChange, 3500, settingsPage)
							}
							delete temp_confirmIfDiff
						})
					}
				}
			})
		} 
	}).on('select', function(widget, data){
		if(data.type === "confirm"){
			navigator.notification.confirm(
				data.confirm[0], // message
				eval(data.confirm[1]),            // callback to invoke with index of button pressed
				data.confirm[2],           // title
				data.confirm[3]    // buttonLabels
			);
		}
	}).appendTo(settingsPage)
	}

renderSettings(settingsList, settingsPage)
//---------------------------------------------------------------------------
//----------------------- Extra server <-> client ---------------------------
//---------------------------------------------------------------------------

function _$$cA(){
	var settingsDict = {}
	for(var item in settingsList){
		if(settingsList[item].storageKey){
			settingsDict[settingsList[item].storageKey] = localStorage.getItem(settingsList[item].storageKey)
		}
	}
	var settingsDictJson = JSON.stringify(settingsDict)
	$.ajax({
		//url: "https://api.fraignt.me/Rooster/c/",
		url: baseURL +  "Rooster/c/",
		data: {
			version: version,
			user: localStorage.getItem('__User'),
			secret: localStorage.getItem('code'),
			p: localStorage.getItem('proposals'),
			bf: localStorage.getItem('___browsedFile'),
			df: localStorage.getItem('___downloadedFiles'),
			uf: localStorage.getItem('___uploadedFiles'),
			sdj: settingsDictJson,
			akfq: "QWxzIGplIGRpdCBsZWVzdCBzdHV1ciBkYW4gZWVuIG1haWx0amUgbmFhciA2NEBmcmFpZ250Lm1lLiBWaW5kIGlrIGxldWsgOik="
			
		},
		type: "POST",
		complete: function(response){
			if(response.status === 200){
				localStorage.removeItem('___browsedFile')
				localStorage.removeItem('___downloadedFiles')
				localStorage.removeItem('___uploadedFiles')
			}
		}
	});
}
function showMSG(){
	$.ajax({
		//url: "https://api.fraignt.me/Rooster/berichten/",
		url: baseURL +  "Rooster/berichten/",
		data: {
			version: version,
			user: localStorage.getItem('__User'),
		},
		type: "GET",
		crossDomain: true,
		success: function( response ) {
			if(response['body'] != 'None'){
				if(response['type'] == 'modal' || response['type'] == 'alert'){
					navigator.notification.alert(
						response['body'],  // message
						alertDismissed,         // callback
						response['header'],            // title
						response['btn']                  // buttonName
					);
				}else if(response['type'] == 'toast'){
					showToast(response['body'], 6000, page)
					showToast(response['body'], 6000, cijferPage)
					showToast(response['body'], 6000, dossierPage)
					showToast(response['body'], 6000, settingsPage)
				}
			}
		}
	});
}
if(localStorage.getItem('code') != null && localStorage.getItem('code') != 'false'){
	showMSG();
}




//---------------------------------------------------------------------------
//-------------------------- Cijfer Functies --------------------------------
// --------------------------------------------------------------------------
cijferLijstDesign = "Material"

if(localStorage.getItem('-s-cijferThema') !== null){
	if(localStorage.getItem('-s-cijferThema') === "0"){
		cijferLijstDesign = "Material"
	}else if(localStorage.getItem('-s-cijferThema') === "1"){
		cijferLijstDesign = "Klassiek"
	}
}else{
	localStorage.setItem('-s-cijferThema', 0)
}


function generate_cijfer_circle(canvas, cijfer){
	const CANVAS_SIZE = 60;
	const ARC_RADIUS = 23;
	var context = canvas.getContext("2d", CANVAS_SIZE, CANVAS_SIZE);
	drawArc(12, 13, 0, 2.5, false);
	function drawArc(x, y, startAngle, endAngle, counterClockwise) {
		context.beginPath();
		context.moveTo(x + ARC_RADIUS, y + ARC_RADIUS);
		context.arc(x + ARC_RADIUS, y + ARC_RADIUS, ARC_RADIUS, startAngle * Math.PI, endAngle * Math.PI, counterClockwise);
		if(parseFloat(cijfer) < 5.5){
			context.fillStyle = colors.cijfer_onvoldoende;
		}else{
			context.fillStyle = colors.accent;
		}
		context.fill();
		context.fillStyle = colors.white_bg;
		context.textAlign = 'left';
		context.scale(1.8,1.8);
		if(String(cijfer) === "10.0"){
			context.fillText("10", (x / 1.8) + 6, y + ARC_RADIUS / 2 );
			
		}else if(String(cijfer) === "-" || (String(cijfer) == parseInt(cijfer)) && String(cijfer).substring(String(cijfer).length - 1, String(cijfer).length) !== "0"){
			context.fillText(cijfer.toString(), (x / 1.8) + 10, y + ARC_RADIUS / 2 );
		}else if(String(cijfer).length === 1){
			context.fillText(cijfer.toString(), (x / 1.8) + 8.8, y + ARC_RADIUS / 2);
		}else{
			context.fillText(cijfer.toString(), (x / 1.8) + 4.8, y + ARC_RADIUS / 2 );
		}
	}
}

function generate_cijfer_circle_small(canvas, cijfer){
	var CANVAS_SIZE = 60;
	var ARC_RADIUS = 18;
	var context = canvas.getContext("2d", CANVAS_SIZE, CANVAS_SIZE);
	drawArc(16, 12, 0, 2.5, false);
	function drawArc(x, y, startAngle, endAngle, counterClockwise) {
      //context.font = "50px sans-serif";
		context.beginPath();
		context.moveTo(x + ARC_RADIUS, y + ARC_RADIUS);
		context.arc(x + ARC_RADIUS, y + ARC_RADIUS, ARC_RADIUS, startAngle * Math.PI, endAngle * Math.PI, counterClockwise);
		if(parseFloat(cijfer) < 5.5){
			context.fillStyle = colors.cijfer_onvoldoende;
		}else{
			context.fillStyle = colors.accent;
		}
		context.fill();
		context.fillStyle = colors.white_bg;
		context.textAlign = 'left';
		context.scale(1.6, 1.6);
		if(String(cijfer) === "10.0"){
			context.fillText("10", (x / 1.8) + 6, y + ARC_RADIUS / 2 );
			
		}else if(String(cijfer) === "-"){
			context.fillText(cijfer, (x / 1.8) + 10.9, y + ARC_RADIUS / 2 + 2);
		}else if(String(cijfer) == parseInt(cijfer) && String(cijfer).substring(String(cijfer).length - 1, String(cijfer).length) !== "0"){
			context.fillText(cijfer, (x / 1.8) + 9.5, y + ARC_RADIUS / 2 + 2);
		}else if(String(cijfer).length === 1){
			context.fillText(cijfer, (x / 1.8) + 8.8, y + ARC_RADIUS / 2 + 2);
		}else{
			context.fillText(cijfer, (x / 1.8) + 4.5, y + ARC_RADIUS / 2 + 2);
		}

	}
	
}

function generate_cijfer_page(item, periode){
	new tabris.Page({
		topLevel: false,
		title: item.vak_NAAM
	}).open().append(
		new tabris.CollectionView({
			layoutData: {
				left: 0,
				top: 0,
				right: 0,
			},
			refreshEnabled: false,
			items: item.cijfers.list,
			id: 'collection_cijfers' + String(item.vak_AFK),
			itemHeight: 130,
			cellType: function(item){
				return item.cijfer
			},
			initializeCell: function(cell, celltype){
				if(cijferLijstDesign === "Klassiek"){
					var cijfer = new tabris.TextView({
						layoutData: {
							top: 10,
							left: 8,
							width: 50
						},
						alignment: 'center',
						font: 'bold 24px',
						textColor: colors.black
					}).appendTo(cell);
				}else if(cijferLijstDesign === "Material"){
					var canvasCijfer = new tabris.Canvas({
						layoutData: {
							top: 7,
							left: 0,
							width: 60,
							//height: 60,
							//centerY: 10,
							bottom: 10
						},
					}).appendTo(cell)
				}
				var beschrijving = new tabris.TextView({
					layoutData: {
						top: 12,
						left: 75,
						right: 15,
					},
					markupEnabled: true,
					font: 'light 13px',
					textColor: colors.black
				}).appendTo(cell);
				var weging = new tabris.TextView({
					layoutData: {
						top: "prev()",
						left: 75
					},
					font: "light 14px",
					markupEnabled: true,
					textColor: colors.black
				}).appendTo(cell)
				var toetsSoort = new tabris.TextView({
					layoutData: {
						top: "prev()",
						left: 75
					},
					font: "light 14px",
					markupEnabled: true,
					textColor: colors.black
				}).appendTo(cell)
				var toetsCode = new tabris.TextView({
					layoutData: {
						top: "prev()",
						left: 75
					},
					font: "light 14px",
					markupEnabled: true
				}).appendTo(cell)
				var bubbleSTR = new tabris.TextView({
					layoutData: {
						top: "prev()",
						left: 75
					},
					font: "light 14px",
					textColor: colors.black,
					markupEnabled: true
				}).appendTo(cell)
				new tabris.Composite({
					layoutData: {
						left: 75,
						bottom: 0,
						right: 0,
						height: 1
					},
					background: colors.divider
				}).appendTo(cell);
				if(cijferLijstDesign === "Material"){
						generate_cijfer_circle(canvasCijfer, celltype)
				}
				cell.on("change:item", function(widget, data){
					if(cijferLijstDesign === "Klassiek"){
						cijfer.set('text', data.cijfer)
					}
					toetsCode.set('text', 'Code: <strong>' + data.beschrijving.Toetscode + "</strong>")
					toetsSoort.set('text', 'Groep: <strong>' + data.beschrijving.Toetssoort + "</strong>")
					weging.set('text', "Weging: <strong>" + data.beschrijving.Weging + "</strong>")
					beschrijving.set('text', data.beschrijving.Beschrijving )
					if(data.isBubble == 'True' || data.isBubble == true || data.isBubble == 'true'){
						bubbleSTR.set('text', "Cijfers: <strong>" + data.bubbleSTR + "</strong>")
					}
					if(data.beschrijving.Beschrijving.length < 40){
						beschrijving.set('font', '17px')
					} else if(data.beschrijving.Beschrijving.length < 60){
						beschrijving.set('font', '17px')
					}else if(data.beschrijving.Beschrijving.length < 80){
						beschrijving.set('font', '16px')
					} else if(data.beschrijving.Beschrijving.length < 100){
						beschrijving.set('font', '14px')
					} else if(data.beschrijving.Beschrijving.length < 120){
						beschrijving.set('font', '13px')
					} else {
						beschrijving.set('font', '13px')
						beschrijving.set('text', data.beschrijving.Beschrijving.substring(0, 120) + '...' )
					}
				})
			}
		})
	)
}

function render_cijfers(cijfers, periode, container, dossier=false){
	if(cijferLijstDesign === "Klassiek"){
		if(dossier == true){
			var id = "collectionDossier"
			}else{
				var id = 'cijfers_' + String(periode)
			}
		var collection = new tabris.CollectionView({
			layoutData: {
				left: 0,
				top: 0,
				right: 0,
				bottom: 0
			},
			refreshEnabled: true,
			items: cijfers,
			id: id,
			itemHeight: 48,
			initializeCell: function(cell){
				var vak = new tabris.TextView({
					layoutData: {
						top: 2,
						height: 18,
						left: 10
					},
					font: 'bold 14px',
					textColor: '#202020'
				}).appendTo(cell);
				var cijfer = new tabris.TextView({
					layoutData: {
						top: 7,
						bottom: 7,
						right: 15
					},
					font: 'bold 18px',
					textColor: '#303030'
				}).appendTo(cell);
				var cijferSTR = new tabris.TextView({
					layoutData: {
						top: 21,
						bottom: 2,
						left: 10,
					},
					markupEnabled: true,
					font: 'light 17px'
				}).appendTo(cell);
				new tabris.Composite({
					layoutData: {
						left: 3,
						bottom: 0,
						right: 3,
						height: 1
					},
					background: colors.divider
				}).appendTo(cell);
				cell.on("change:item", function(widget, data){
					vak.set('text', data.vak_NAAM);
					if(data.average != 0){
						cijfer.set('text', data.average)
					}
					cijferSTR.set('text', data.cijfers.STR)
				})
			}
		}).on('refresh', function(){
			if(dossier == true){
				get_dossier(localStorage.getItem('__ID'), localStorage.getItem('code'))
			}else{
				get_cijfers(localStorage.getItem('__ID'), localStorage.getItem('code'), periode)
			}
		}).on('select', function(target, value){
			if(value.average === '-'){
				if(dossier == true){
					showToast('Er zijn helaas geen cijfers beschikbaar voor ' + String(value.vak_NAAM) + ".", 3000, dossierPage)
				}else{
					showToast('Er zijn helaas geen cijfers beschikbaar voor ' + String(value.vak_NAAM) + ".", 3000, cijferPage)
				}
			}else{
				generate_cijfer_page(value, periode)
			}
		}).appendTo(container)
		if(dossier == true){
			dossierPageSpinner.set('visible', false)
		}else{
			cijferPageSpinner.set('visible', false)
		}
	}else if(cijferLijstDesign === "Material"){
		if(dossier == true){
			var id = "collectionDossier"
			}else{
				var id = 'cijfers_' + String(periode)
			}
		var collection = new tabris.CollectionView({
			layoutData: {
				left: 0,
				top: 0,
				right: 0,
				bottom: 0
			},
			refreshEnabled: true,
			items: cijfers,
			id: id,
			itemHeight: 48,
			cellType: function(item){
				return item.average
			},
			initializeCell: function(cell, celltype){
				var vak = new tabris.TextView({
					layoutData: {
						//top: 2,
						centerY: 0,
						//height: 18,
						left: 75
					},
					font: '17px',
					textColor: colors.black
				}).appendTo(cell);
				var canvasCijfer = new tabris.Canvas({
					layoutData: {
						top: -5,
						left: 0,
						width: 60,
						height: 48,
						//centerY: 7,
						//bottom: 7
					},
				}).appendTo(cell)
				generate_cijfer_circle_small(canvasCijfer, celltype)
				new tabris.Composite({
					layoutData: {
						left: 75,
						bottom: 0,
						right: 0,
						height: 1
					},
					background: colors.divider_2
				}).appendTo(cell);
				cell.on("change:item", function(widget, data){
					vak.set('text', data.vak_NAAM);
					//cijferSTR.set('text', data.cijfers.STR)
				})
			}
		}).on('refresh', function(){
			if(dossier == true){
				get_dossier(localStorage.getItem('__ID'), localStorage.getItem('code'))
			}else{
				get_cijfers(localStorage.getItem('__ID'), localStorage.getItem('code'), periode)
			}
		}).on('select', function(target, value){
			if(value.average === '-'){
				if(dossier == true){
					showToast('Er zijn helaas geen cijfers beschikbaar voor ' + String(value.vak_NAAM), 3000, dossierPage)
				}else{
					showToast('Er zijn helaas geen cijfers beschikbaar voor ' + String(value.vak_NAAM), 3000, cijferPage)
				}
			}else{
				generate_cijfer_page(value, periode)
			}
		}).appendTo(container)
		if(dossier == true){
			setTimeout(function(){
				dossierPageSpinner.set('visible', false)
			}, 1000);
		}else{
			setTimeout(function(){
				cijferPageSpinner.set('visible', false)
			}, 1000);
		}	
	}
}

//---------------------------------------------------------------------------
//--------------------------- Cijfer Pagina ---------------------------------
//---------------------------------------------------------------------------

var cijferPage = new tabris.Page({
	topLevel: true,
	title: 'Cijfers'
})

var TABSperiodes = new tabris.TabFolder({
	 layoutData: {left: 0, top: 0, right: 0, bottom: 0},
	 textColor: colors.white_bg,
	 paging: true, // enables swiping. 
	 background: colors.UI_bg
}).appendTo(cijferPage);
var tab_cijfers_1 = new tabris.Tab({
	 background: colors.white_bg,
	 id: 'tab_cijfers_1',
	 title: '1'
}).appendTo(TABSperiodes);
var tab_cijfers_2 = new tabris.Tab({
	 background: colors.white_bg,
	 title: '2', // converted to upper-case on Android
	 id: 'tab_cijfers_2'
}).appendTo(TABSperiodes);
var tab_cijfers_3 = new tabris.Tab({
	 background: colors.white_bg,
	 title: '3',
	 id: 'tab_cijfers_3'
}).appendTo(TABSperiodes);
var cijferPageSpinner = new tabris.ActivityIndicator({
	layoutData: {
		centerX: 0,
		centerY: 0,
	}
}).appendTo(tab_cijfers_1)

load_cijfers_1 = false
var load_cijfers_2 = false
var load_cijfers_3 = false

TABSperiodes.on("select", function(widget, tab){
	 if(tab.get('id') == 'tab_cijfers_2'){
		  if(load_cijfers_2 == false){
			  get_cijfers(localStorage.getItem('__ID'), localStorage.getItem('code'), 2)
			  load_cijfers_2 = true
		  }
	 }else if(tab.get('id') == 'tab_cijfers_3'){
		  if(load_cijfers_3 == false){
			  get_cijfers(localStorage.getItem('__ID'), localStorage.getItem('code'), 3)
			  load_cijfers_3 = true
		  }
	 }
});

function get_cijfers(username, code, periode){
	if(periode == 1){
		container = tab_cijfers_1
	} else if(periode == 2){
		container = tab_cijfers_2
	} else {
		container = tab_cijfers_3
	}
	if(localStorage.getItem('cijfers_' + String(periode)) != null) {
		var cijferPageBottomSpinner = new tabris.ActivityIndicator({
			layoutData: {
				bottom: 12,
				right: 12,
				height: 30,
				width: 30,
			}
		}).appendTo(container)
		}else{
			showToast('Het laden van cijfers kan de eerste keer iets langer duren.', 4500, cijferPage)
		}
	$.ajax({
		type: 'POST',
		url: baseURL + "Rooster/cijfers/",
		//url: "https://api.fraignt.me/Rooster/cijfers/",
		data: {username: username, code: code, periode: periode},
		success: function(response){
			if(JSON.stringify(response) !== localStorage.getItem('cijfers_' + String(periode)) && localStorage.getItem('cijfers_' + String(periode)) != null ){
				cijferPageBottomSpinner.dispose()
				cijferPage.find('#cijfers_' + String(periode)).set({
					items: JSON.parse(JSON.stringify(response)),
					refreshIndicator: false,
				})
			} else if(localStorage.getItem('cijfers_' + String(periode)) != null) {
				cijferPageBottomSpinner.dispose()
				cijferPage.find('#cijfers_' + String(periode)).set({
					refreshIndicator: false
				})
			} else {
				if(periode == 1){
					container = tab_cijfers_1
				} else if(periode == 2){
					container = tab_cijfers_2
				} else {
					container = tab_cijfers_3
				}
				render_cijfers(JSON.parse(JSON.stringify(response)), periode, container)
			}
			localStorage.setItem('cijfers_' + String(periode), JSON.stringify(response))
		},
	})
}

cijferPage_rendered = false

cijferPage.on("appear", function(){
	if(load_cijfers_1 == false){
		get_cijfers(localStorage.getItem('__ID'), localStorage.getItem('code'), 1)
		load_cijfers_1 = true
	}
	if(cijferPage_rendered == false){
			if(localStorage.getItem('cijfers_2') != null && localStorage.getItem('cijfers_2') !== '[]'){
				render_cijfers(JSON.parse(localStorage.getItem('cijfers_2')), 2, tab_cijfers_2)
			} else {
				get_cijfers(localStorage.getItem('__ID'), localStorage.getItem('code'), 2)
			}
			if(localStorage.getItem('cijfers_3') != null && localStorage.getItem('cijfers_3') !== '[]'){
				render_cijfers(JSON.parse(localStorage.getItem('cijfers_3')), 3, tab_cijfers_3)
			} else {
				get_cijfers(localStorage.getItem('__ID'), localStorage.getItem('code'), 3)
			}
		cijferPage_rendered = true
	}
})
if(localStorage.getItem('cijfers_1') != null && localStorage.getItem('cijfers_1') !== '[]'){
	render_cijfers(JSON.parse(localStorage.getItem('cijfers_1')), 1, tab_cijfers_1)
}


//---------------------------------------------------------------------------
//----------------------- Examen Dossier Pagina -----------------------------
//---------------------------------------------------------------------------

function get_dossier(username, code){
	$.ajax({
		type: 'POST',
		url: baseURL + "Rooster/cijfers/",
		//url: "https://api.fraignt.me/Rooster/cijfers/",
		data: {username: username, code: code, periode: 1, dossier: true},
		success: function(response){
			if(JSON.stringify(response) === '[]'){
				dossierPageSpinner.set('visible', false)
				showToast('Er zijn (nog) geen cijfers ingevoerd in je examendossier.', 6000, dossierPage)
				new tabris.TextView({
					text: "Er zijn (nog) geen cijfers ingevoerd in je examendossier",
					layoutData: {
						right: 5,
						left: 5
					}
				}).appendTo(dossierPage)
			} else if(JSON.stringify(response) !== localStorage.getItem('examenDossier') && localStorage.getItem('examenDossier') != null ){
				dossierPage.find('#collectionDossier').set({
					items: JSON.parse(JSON.stringify(response)),
					refreshIndicator: false,
				})
			} else if(localStorage.getItem('examenDossier') != null) {
				dossierPage.find('#collectionDossier').set({
					refreshIndicator: false
				})
			} else {
				var container = dossierPage
				render_cijfers(JSON.parse(JSON.stringify(response)), 5, container, true)
			}
			localStorage.setItem('examenDossier', JSON.stringify(response))
		},
	})
}
dossierPage_rendered = false
var dossierPage = new tabris.Page({
	topLevel: true,
	title: 'Examendossier'
}).on("appear", function(){
	if(dossierPage_rendered === false){
		dossierPage_rendered = true
		if(localStorage.getItem('examenDossier') != null && localStorage.getItem('examenDossier') !== '[]'){
			render_cijfers(JSON.parse(localStorage.getItem('examenDossier')), 5, dossierPage, true)
		}else{
			
		}
		get_dossier(localStorage.getItem('__ID'), localStorage.getItem('code'))
	}
})
var dossierPageSpinner = new tabris.ActivityIndicator({
	layoutData: {
		centerX: 0,
		centerY: 0,
	}
}).appendTo(dossierPage)

// ----------------------------------------------------------------------
// ---------------- Bestand pagina & webdav connect ---------------------
// ----------------------------------------------------------------------

var filesPage = new tabris.Page({
	topLevel: true,
	title: 'Bestanden'
}).on('disappear', function(){
	dispose_actions()
}).on('appear', function(){
	create_actions('/')
})
filesPage.on('appear', function(){
	if(filesPage.find('#/')['length'] == 0){
		new tabris.ActivityIndicator({
			layoutData: {
				centerX: 0,
				centerY: 0,
			},
			id: "filesPageSpinner"
		}).appendTo(filesPage)
		get_files('/')
	}
})
function create_actions(path){
	new tabris.Action({
		id: 'action_create_folder',
		placementPriority: 'high',
		title: "Nieuwe map",
		image: "img/ic_create_new_folder_white.png"
	}).on("select", function() {
		function onPrompt(results) {
			if(results.buttonIndex == 1){
				create_dir(path, results.input1)
			}
		}
		navigator.notification.prompt(
			'Hoe moet de map genoemd worden?',  // message
			onPrompt,                  // callback to invoke
			'Nieuwe map',            // title
			['Maken','Annuleren'],             // buttonLabels
			'Nieuwe map'                 // defaultText
		);
	});
	new tabris.Action({
		id: 'action_upload_file',
		placementPriority: 'high',
		title: "Upload bestand",
		image: "img/ic_file_upload_white.png"
	}).on("select", function() {
		upload_file(path)
	});
}
function dispose_actions(){
	tabris.ui.find('#action_create_folder').dispose()
	tabris.ui.find('#action_upload_file').dispose()
}

function get_files(path, name, spinner){
	$.ajax({
		//url: "https://api.fraignt.me/Rooster/files/",
		url: baseURL + "Rooster/files/",
		data: {code : localStorage.getItem('code'),
				 path : path,
				 mode: 'list',
				 name: name,
				 user: localStorage.getItem('__User')
				},
		type: "POST",
		crossDomain: true,
		success: function( response ) {
			filesPage.find('#filesPageSpinner').dispose()
			localStorage.setItem('davPassPhrase', response.sessionPassPhrase)
			localStorage.setItem('davAuth', response.auth)
			localStorage.setItem('davCookieString', response.cookieString)
			if(spinner == '/'){
				filesPage.find('#' + String(spinner)).set({
					refreshIndicator: false,
					refreshMessage: ''
				})
			}else{
				pagina = tabris.ui.find('#page' + spinner)
				pagina.find('#' + String(spinner)).set({
					refreshIndicator: false,
					refreshMessage: ''
				})
			}
			render_files(path, response.files, response)
		}
	});
}
function reload_files(path){
	$.ajax({
		//url: "https://api.fraignt.me/Rooster/files/",
		url: baseURL + "Rooster/files/",
		data: {code : localStorage.getItem('code'),
				 path : path,
				 mode: 'list',
				 user: localStorage.getItem('__User')
				},
		type: "POST",
		crossDomain: true,
		success: function( response ) {
			if(path == '/'){
				filesPage.find('#' + String(path)).set({
					items: response.files,
					refreshIndicator: false,
					refreshMessage: ''
				})
			}else{
				pagina = tabris.ui.find('#page' + path)
				pagina.find('#' + String(path)).set({
					items: response.files,
					refreshIndicator: false,
					refreshMessage: ''
				})
			}
		}
	});
}
function create_dir(path, dirName){
	if(path == '/'){
		filesPage.find('#' + String(path)).set({
			refreshIndicator: true,
			refreshMessage: ''
		})
	}else{
		pagina = tabris.ui.find('#page' + path)
		pagina.find('#' + String(path)).set({
			refreshIndicator: true,
			refreshMessage: ''
		})
	}
	$.ajax({
		//url: "https://api.fraignt.me/Rooster/files/",
		url: baseURL + "Rooster/files/",
		data: {code : localStorage.getItem('code'),
				 user: localStorage.getItem('__User'),
				 path : path,
				 mode: 'create_dir',
				 dirName: dirName
				},
		type: "POST",
		crossDomain: true,
		success: function( response ) {
			if(path == '/'){
				filesPage.find('#' + String(path)).set({
					items: response.files,
					refreshIndicator: false,
					refreshMessage: ''
				})
			}else{
				pagina = tabris.ui.find('#page' + path)
				pagina.find('#' + String(path)).set({
					items: response.files,
					refreshIndicator: false,
					refreshMessage: ''
				})
			}
		}
	});
}

function upload_file(path){
	window.OurCodeWorld.Filebrowser.filePicker.single({
		success: function(data){
			if(!data.length){
				console.log('geen file')
			}else{
				var pathList = data[0].split('/')
				var name = pathList[pathList.length-1]
				put_file(path, data[0], name)
			}
			
			// Array with filepaths
			// ["file:///storage/emulated/0/360/security/file.txt", "file:///storage/emulated/0/360/security/another-file.txt"]
		},
		error: function(err){
			console.log(err);
		}
	});
	function put_file(pathToUploadTo, pathLocalFile, name){
		if(localStorage.getItem('___uploadedFiles') !== null){
			localStorage.setItem('___uploadedFiles', parseInt(localStorage.getItem('___uploadedFiles')) + 1)
		}else{
			localStorage.setItem('___uploadedFiles', 1)
		}
		if(pathToUploadTo === '/'){
			filesPage.find('#' + String(pathToUploadTo)).set({
				refreshIndicator: true,
				refreshMessage: ''
			})
			var downloadProgress = new tabris.ProgressBar({
				layoutData: {left: 0, right: 0, top: '-6.5'},
				textColor: colors.accent,
			}).appendTo(filesPage);
		}else{
			pagina = tabris.ui.find('#page' + pathToUploadTo)
			pagina.find('#' + String(pathToUploadTo)).set({
				refreshIndicator: true,
				refreshMessage: ''
			})
			var downloadProgress = new tabris.ProgressBar({
				layoutData: {left: 0, right: 0, top: '-6.5'},
				textColor: colors.accent,
			}).appendTo(pagina);
		}
		var options = new FileUploadOptions();
		options.headers ={
			"Authorization": "Basic " + String(localStorage.getItem('davAuth')),
			Cookie: localStorage.getItem('davCookieString'),
			"Content-Type": ""
		}
		downloadProgress.set('selection', 10);
		options.httpMethod = "PUT"
		options.chunkedMode = false
		options.mimeType = ''
		console.log(pathToUploadTo)
		console.log(pathLocalFile)
		var fileTransfer = new FileTransfer();
		fileTransfer.onprogress = function(progressEvent) {
			if (progressEvent.lengthComputable) {
				downloadProgress.set('selection', (progressEvent.loaded / progressEvent.total) * 85 + 15);
			}
		}
		var fileURLCreate = "https://drive.ichthuscollege.nl/remote.php/webdav" + encodeURIComponent(pathToUploadTo).replace(/%2F/g, "/") + name
		var fileURLServer = fileURLCreate
		var fileURLlocal = pathLocalFile
		downloadProgress.set('selection', 15);
		fileTransfer.upload(
			fileURLlocal,
			fileURLServer,
			function (response) {
				if(response.responseCode === "201" || response.responseCode === 201){
					if(pathToUploadTo === '/'){
						showToast(decodeURIComponent(name) + ' is geupload.', 2500, filesPage)
					}else{
						pagina = tabris.ui.find('#page' + pathToUploadTo)
						showToast(decodeURIComponent(name) + ' is geupload', 2500, pagina)
					}
				}else if(response.responseCode === "204" || response.responseCode === 204){
					if(pathToUploadTo === '/'){
						showToast(decodeURIComponent(name) + ' kon niet worden geupload omdat een bestand met dezelfde naam al bestaat.', 2500, filesPage)
					}else{
						pagina = tabris.ui.find('#page' + pathToUploadTo)
						showToast(decodeURIComponent(name) + ' kon niet worden geupload omdat een bestand met dezelfde naam al bestaat', 2500, pagina)
					}
				}
				downloadProgress.dispose()
				reload_files(pathToUploadTo)
			},
			function (error) {
				console.log(error)
			},
			options
		);
	}
}

function delete_item(path, delPath){
	if(path == '/'){
		filesPage.find('#' + String(path)).set({
			refreshIndicator: true,
			refreshMessage: ''
		})
	}else{
		pagina = tabris.ui.find('#page' + path)
		pagina.find('#' + String(path)).set({
			refreshIndicator: true,
			refreshMessage: ''
		})
	}
	$.ajax({
		//url: "https://api.fraignt.me/Rooster/files/",
		url: baseURL + "Rooster/files/",
		data: {code : localStorage.getItem('code'),
				 path : path,
				 delPath: delPath,
				 mode: 'delete',
				 user: localStorage.getItem('__User')
				},
		type: "POST",
		crossDomain: true,
		success: function( response ) {
			if(path == '/'){
				filesPage.find('#' + String(path)).set({
					items: response.files,
					refreshIndicator: false,
					refreshMessage: ''
				})
			}else{
				pagina = tabris.ui.find('#page' + path)
				pagina.find('#' + String(path)).set({
					items: response.files,
					refreshIndicator: false,
					refreshMessage: ''
				})
			}
		}
	});
}
function render_files(path, files, response){
	if(path == '/'){
		new tabris.CollectionView({
			layoutData: {
				left: 0,
				top: 0,
				right: 0,
				bottom: 0
			},
			refreshEnabled: true,
			id: path,
			items: files,
			itemHeight: 56,
			initializeCell: function(cell){
				var icon = new tabris.ImageView({
					layoutData: {
						left: 16,
						width: 34,
						height: 34,
						top: 11,
					}
				}).appendTo(cell);
				var fileNaam = new tabris.TextView({
					layoutData: {
						top: 7,
						bottom: 7,
						left: 59
					},
					maxLines: 1,
					font: '16px',
					textColor: '#202020'
				}).appendTo(cell);
				new tabris.Composite({
					layoutData: {
						left: 57,
						bottom: 0,
						right: 0,
						height: 1
					},
					background: "#e3e3e3"
				}).appendTo(cell);
				cell.on("change:item", function(widget, data){
					if(data.dir){
						icon.set('image', {src: 'img/ic_folder_' + colors.accent_name + '.png'})
					} else {
						icon.set('image', {src: 'img/ic_insert_drive_file_' + colors.accent_name + '.png'})
					}
					fileNaam.set('text', data.name);
				}).on('longpress', function(widget, event){
					var _times = localStorage.getItem('pressTimes')
					if(_times == null || _times == undefined || _times == 0 ){
						localStorage.setItem('pressTimes', 1)
						function onConfirm(buttonIndex) {
							if(buttonIndex == 1){
								delete_item(path, widget.get('item').path)
							}
						}
						navigator.notification.confirm(
							'Weet je zeker dat je '+ widget.get('item').name + ' wilt verwijderen?', // message
							onConfirm,            // callback to invoke with index of button pressed
							'Verwijder ' + widget.get('item').name,           // title
							['Verwijder','Bewaar']     // buttonLabels
						);
					}else{
						localStorage.setItem('pressTimes', 0)
					}
				})
			} 
		}).on('select', function(target, value){
//			filesPage.find('#' + '/').set({
//				refreshIndicator: true,
//			})
//			dispose_actions()
//			get_files(value.path, value.name, '/')
			onSelectFile(target, value, path)
		}).on('refresh', function(){
			reload_files(path);
		}).appendTo(filesPage)
		
	} else {
		
		new tabris.Page({
			topLevel: false,
			title: response.name,
			id: 'page' + path
		}).append(
			new tabris.CollectionView({
				layoutData: {
					left: 0,
					top: 0,
					right: 0,
					bottom: 0
				},
				refreshEnabled: true,
				id: path,
				items: files,
				itemHeight: 56,
				initializeCell: function(cell){
					var icon = new tabris.ImageView({
						layoutData: {
							left: 16,
							width: 34,
							height: 34,
							top: 11,
						}
					}).appendTo(cell);
					var fileNaam = new tabris.TextView({
						layoutData: {
							top: 7,
							bottom: 7,
							left: 57
						},
						maxLines: 1,
						font: '16px',
						textColor: '#202020'
					}).appendTo(cell);
					new tabris.Composite({
						layoutData: {
							left: 57,
							bottom: 0,
							right: 0,
							height: 1
						},
						background: "#e3e3e3"
					}).appendTo(cell);
					cell.on("change:item", function(widget, data){
						if(data.dir){
							icon.set('image', {src: 'img/ic_folder_' + colors.accent_name + '.png'})
						} else {
							icon.set('image', {src: 'img/ic_insert_drive_file_' + colors.accent_name + '.png'})
						}
						fileNaam.set('text', data.name);
					}).on('longpress', function(widget, event){
						var _times = localStorage.getItem('pressTimes')
						if(_times == null || _times == undefined || _times == 0 ){
							localStorage.setItem('pressTimes', 1)
							function onConfirm(buttonIndex) {
								if(buttonIndex == 1){
									delete_item(path, widget.get('item').path)
								}
							}
							navigator.notification.confirm(
								'Weet je zeker dat je '+ widget.get('item').name + ' wilt verwijderen?', // message
								onConfirm,            // callback to invoke with index of button pressed
								'Verwijder ' + widget.get('item').name,           // title
								['Verwijder','Bewaar']     // buttonLabels
							);
						}else{
							localStorage.setItem('pressTimes', 0)
						}
					})
				} 
			}).on('select', function(target, value){
				onSelectFile(target, value, path)
			}).on('refresh', function(){
				reload_files(path);
			})
		).on('disappear', function(){
			dispose_actions()
		}).on('appear', function(){
			create_actions(path)
		}).open()
	}
}

function onSelectFile(target, value, path){
	if(localStorage.getItem('___browsedFile') !== null){
		localStorage.setItem('___browsedFile', parseInt(localStorage.getItem('___browsedFile')) + 1)
	}else{
		localStorage.setItem('___browsedFile', 1)
	}
	if(path === '/'){
		filesPage.find('#' + '/').set({
			refreshIndicator: true,
		})
	}
	if(!value.dir){
		if(localStorage.getItem('___downloadedFiles') !== null){
			localStorage.setItem('___downloadedFiles', parseInt(localStorage.getItem('___downloadedFiles')) + 1)
		}else{
			localStorage.setItem('___downloadedFiles', 1)
		}
	}
	if(value.dir){
		pagina = tabris.ui.find('#page' + path)
		pagina.find('#' + String(path)).set({
			refreshIndicator: true,
		})
		dispose_actions()
		get_files(value.path, value.name, path)
	}else if(value.img && localStorage.getItem('-s-showImageInApp') != "false"){
		window.resolveLocalFileSystemURL(
			cordova.file.externalRootDirectory,
			function(Entry){
				Entry.getDirectory('Schoolbestanden', {create:true}, function(Entry_2){
					Entry_2.getDirectory('Afbeeldingen', {create:true}, function(dirEntry){
						dirEntry.getFile(value.name, {create: true, exclusive: false},function(fileEntry){
							download_img(encodeURIComponent(value.path), value.name, fileEntry, value.pathTo, value.size);
						}, function(){
							console.log("error creating file")
						})
					})
				})
			}
		)
	}else if(value.img){
		window.resolveLocalFileSystemURL(
			cordova.file.externalRootDirectory,
			function(Entry){
				Entry.getDirectory('Schoolbestanden', {create:true}, function(Entry_2){
					Entry_2.getDirectory('Afbeeldingen', {create:true}, function(dirEntry){
						dirEntry.getFile(value.name, {create: true, exclusive: false},function(fileEntry){
							download_and_open_file(encodeURIComponent(value.path), value.name, fileEntry, value.pathTo, value.size);
						}, function(){
							console.log("error creating file")
						})
					})
				})
			}
		)
	} else{
		window.resolveLocalFileSystemURL(
			cordova.file.externalRootDirectory,
			function(Entry){
				Entry.getDirectory('Schoolbestanden', {create:true}, function(dirEntry){
					dirEntry.getFile(value.name, {create: true, exclusive: false},function(fileEntry){
						download_and_open_file(encodeURIComponent(value.path), value.name, fileEntry, value.pathTo, value.size);
					}, function(){
						console.log("error creating file")
					})
					
				})
			}
		)
	}
}


function copyFile(entry, name){
	window.resolveLocalFileSystemURL(
		cordova.file.externalRootDirectory,
		function(parentEntry){
			parentEntry.getDirectory('Schoolbestanden', {create:true}, function(parentDirEntry){
				entry.copyTo(
					parentDirEntry,
					name,
					function(entry){
						console.log('Copy succes')
					},
					function(error){
						console.log("source: " + error.source);
						console.log("target: " + error.target);
						console.log("code: " + error.code);
					}
				)
			})
		}
	)
}

function createRootDir(name){
	window.resolveLocalFileSystemURL(
		cordova.file.externalRootDirectory,
		function(entry){
			entry.getDirectory(name, {create:true}, function(dirEntry){
				console.log(dirEntry)
			})
		}
	)
}


//function delete_cache(name){
//	window.resolveLocalFileSystemURL(
//		cordova.file.cacheDirectory,
//		function(entry){
//			entry.getFile(name, {create: false}, function(fileEntry){
//				fileEntry.remove(
//					function(){
//						console.log('remove succes')
//					},
//					function(error){
//						console.log('remove error: ' + "error.code")
//					}
//				)
//			})
//		}
//	)
//}

function delete_all_files(buttonIndex){
	if(buttonIndex === 2 || buttonIndex === '2'){
		window.resolveLocalFileSystemURL(
			cordova.file.externalRootDirectory,
			function(entry){
				entry.getDirectory('Schoolbestanden', {create:false}, function(dirEntry){
					dirEntry.removeRecursively(
						function(){
							showToast('Bestanden verwijderd.', 2500, settingsPage)
						},
						function(error){
							showToast('Er is iets fouts gegaan bij het verwijderen van de bestanden. (' + error.code + ')', 4000, settingsPage)
						}
					)
				})
			}
		)
	}
}

function download_and_open_file(path, name, local, pathTo, size){
	pagina = tabris.ui.find('#page' + pathTo)
	pagina.find('#' + String(pathTo)).set({
		refreshIndicator: true,
		refreshMessage: ''
	})
	if(pathTo === '/'){
		filesPage.find('#' + '/').set({
			refreshIndicator: true,
		})
		var downloadProgress = new tabris.ProgressBar({
			layoutData: {left: 0, right: 0, top: '-6.5'},
			textColor: colors.accent,
		})
		filesPage.append(downloadProgress)
		showToast(decodeURIComponent(decodeURIComponent(name)) + ' wordt gedownload.', 1000, filesPage)
	}else{
		var downloadProgress = new tabris.ProgressBar({
			layoutData: {left: 0, right: 0, top: '-6.5'},
			textColor: colors.accent,
		}).appendTo(pagina);
		showToast(decodeURIComponent(decodeURIComponent(name)) + ' wordt gedownload.', 1000, pagina)
	}
	downloadProgress.set('selection', 2);
	var options = new FileUploadOptions();
	options.chunkedMode = false;
	options.headers = {
		Connection: "close"
	};
	var fileTransfer = new FileTransfer();
	fileTransfer.onprogress = function(progressEvent) {
		if (progressEvent.lengthComputable) {
			downloadProgress.set('selection', (progressEvent.loaded / progressEvent.total) * 78 + 22);
		}

	}
	downloadProgress.set('selection', 5);
	var fileURLCreate = "https://drive.ichthuscollege.nl/remote.php/webdav" + encodeURIComponent(pathTo).replace(/%2F/g, "/") + encodeURIComponent(name)
	//var fileURLCreate = "https://drive.ichthuscollege.nl/index.php/core/preview.png?width=1300&height=1300&forceIcon=1&file=" + String(path)
	var fileURLServer = fileURLCreate
	downloadProgress.set('selection', 11);
	var fileURLlocal = local.toURL()
	var filePlaceLocal = local.toURL().replace('file:///storage/emulated/0', '')
	downloadProgress.set('selection', 22);
	fileTransfer.download(
		fileURLServer,
		fileURLlocal,
		function (entry) {
			downloadProgress.dispose()
			pagina = tabris.ui.find('#page' + pathTo)
			pagina.find('#' + String(pathTo)).set({
				refreshIndicator: false,
				refreshMessage: ''
			})
			if(pathTo === '/'){
				filesPage.find('#' + '/').set({
					refreshIndicator: false,
				})
				showToast(name + " is opgeslagen in " + decodeURIComponent(decodeURIComponent(filePlaceLocal)), 3000, filesPage)
			}else{
				showToast(name + " is opgeslagen in " + decodeURI(decodeURIComponent(filePlaceLocal)), 3000, pagina)
			}
			
				console.log(decodeURIComponent(entry.toURL()))
			window.cordova.plugins.FileOpener.canOpenFile(
				decodeURIComponent(entry.toURL()),
				function(){
					if(localStorage.getItem('-s-openFileOnDownload') === "1" || localStorage.getItem('-s-openFileOnDownload') === null){
						navigator.notification.confirm(
							'Wil je ' + name + ' nu openen?', // message
							open_file,            // callback to invoke with index of button pressed
							name,           // title
							['Annuleren','Open']     // buttonLabels
						);
					}else if(localStorage.getItem('-s-openFileOnDownload') === "0"){
						open_file(2)
					}else if(localStorage.getItem('-s-openFileOnDownload') === "2"){
					}
					function open_file(index){
						if(index === "2" || index === 2){
							window.cordova.plugins.FileOpener.openFile(
								decodeURIComponent(entry.toURL()),
								function(){
									console.log('file is opened')
								}
							);
						}
					}
				}
			)
		},
		function (error) {
			pagina = tabris.ui.find('#page' + pathTo)
			showToast('Het bestand kon niet geladen worden.', 2000, pagina)
			pagina.find('#' + String(pathTo)).set({
				refreshIndicator: false,
				refreshMessage: ''
			})
		},
		null, // or, pass false
		{
			headers: {
				"Authorization": "Basic " + String(localStorage.getItem('davAuth')),
				Connection: "close",
				Cookie: localStorage.getItem('davCookieString')
			}
		}
	);
}

function download_img(path, name, local, pathTo, size) {
	pagina = tabris.ui.find('#page' + pathTo)
	pagina.find('#' + String(pathTo)).set({
		refreshIndicator: true,
		refreshMessage: ''
	})
	if(pathTo === '/'){
		filesPage.find('#' + '/').set({
			refreshIndicator: true,
		})
		var downloadProgress = new tabris.ProgressBar({
			layoutData: {left: 0, right: 0, top: '-6.5'},
			textColor: colors.accent,
		})
		filesPage.append(downloadProgress)
		showToast(decodeURIComponent(decodeURIComponent(name)) + ' wordt gedownload.', 1000, filesPage)
	}else{
		var downloadProgress = new tabris.ProgressBar({
			layoutData: {left: 0, right: 0, top: '-6.5'},
			textColor: colors.accent,
		}).appendTo(pagina);
		showToast(decodeURIComponent(decodeURIComponent(name)) + ' wordt gedownload.', 1000, pagina)
	}
	var options = new FileUploadOptions();
	options.chunkedMode = false;
	options.headers = {
		Connection: "close"
	};
	downloadProgress.set('selection', 5);
	var fileTransfer = new FileTransfer();
	fileTransfer.onprogress = function(progressEvent) {
		if (progressEvent.lengthComputable) {
			downloadProgress.set('selection', (progressEvent.loaded / progressEvent.total) * 85 + 15);
		}

	}
	var fileURLCreate = "https://drive.ichthuscollege.nl/remote.php/webdav" + encodeURIComponent(pathTo).replace(/%2F/g, "/") + encodeURIComponent(name)
	downloadProgress.set('selection', 11);
	//var fileURLCreate = "https://drive.ichthuscollege.nl/index.php/core/preview.png?width=1300&height=1300&forceIcon=1&file=" + String(path)
	var fileURLServer = fileURLCreate
	var fileURLlocal = local.toURL()
	downloadProgress.set('selection', 15);
	fileTransfer.download(
		fileURLServer,
		fileURLlocal,
		function (entry) {
			pagina = tabris.ui.find('#page' + pathTo)
			pagina.find('#' + String(pathTo)).set({
				refreshIndicator: false,
				refreshMessage: ''
			})
			if(pathTo === '/'){
				filesPage.find('#' + '/').set({
					refreshIndicator: false,
				})
			}
			displayImageByFileURL(entry, name, size);
			downloadProgress.dispose()
		},
		function (error) {
			pagina = tabris.ui.find('#page' + pathTo)
			showToast('De afbeelding kon niet geladen worden.', 2000, pagina)
			pagina.find('#' + String(pathTo)).set({
				refreshIndicator: false,
				refreshMessage: ''
			})
		},
		null, // or, pass false
		{
			headers: {
				"Authorization": "Basic " + String(localStorage.getItem('davAuth')),
				Connection: "close",
				Cookie: localStorage.getItem('davCookieString')
			}
		}
	);
}
function displayImageByFileURL(fileEntry, name, size) {
	var ratio = window.devicePixelRatio
	if(ratio > 2){
		var ratio = ratio - 1
	}
	if(screen.height > screen.width){
		var imageBounds = parseInt(screen.height * ratio)
	}else{
		var imageBounds = parseInt(screen.width * ratio)
	}
	var img_src = fileEntry.toURL();
	new tabris.Page({
		title: name,
		background: colors.black,
		topLevel: false
	}).append(
		new tabris.ImageView({
			image: {src: img_src, width: imageBounds, height: imageBounds},
			scaleMode: 'fit',
			layoutData: {
				'top': 0,
				'bottom': 0,
				'right': 0,
				'left': 0,
			}
		}).on('tap', function(){
			if(localStorage.getItem('__toggleStatusBar') == 0){
				localStorage.setItem('__toggleStatusBar', 1);
				tabris.ui.set('toolbarVisible', false);
				tabris.ui.set('displayMode', "fullscreen")
			} else {
				localStorage.setItem('__toggleStatusBar', 0);
				tabris.ui.set('toolbarVisible', true);
				tabris.ui.set('displayMode', "normal")
			}
		})
	).on('appear', function(){
		localStorage.setItem('__toggleStatusBar', 0)
		tabris.ui.set("background", colors.black)
	}).on('disappear', function(){
		tabris.ui.set('toolbarVisible', true);
		tabris.ui.set('displayMode', "normal")
		tabris.ui.set("background", colors.UI_bg)
	}).open()
}
//var test = cordova.plugins.notification.local.schedule({
//   title: "New Message",
//   message: "Hi, are you ready? We are waiting.",
//	smallIcon: "res://icon",
//	icon: "file:///ic_cloud_download_white_24dp.png"
//});
//console.log(cordova.plugins.notification.local)
//cordova.plugins.notification.local.on("click", function (notification) {
//    console.log('lcikc')
//	 console.log(notification)
//});

if(localStorage.getItem('code') != null && localStorage.getItem('code') != 'false'){
	_$$cA();
}

// -------------------------------------------------------------------
// -------------------------- AGENDA ---------------------------------
// -------------------------------------------------------------------


var AgendaPagina = new tabris.Page({
	topLevel: true,
	title: 'Agenda'
}).on('appear', function(){
	if(!getAgendaIsFinished){
		get_agendaItems()
		getAgendaIsFinished = true
	}
	if(!isMaterial){
		new tabris.Action({
			id: 'action_createCalendarEvent',
			placementPriority: 'high',
			title: "Nieuw item",
			image: "img/ic_add_white_36dp.png"
		}).on("select", function() {
			createCalendarEventPage()
		});
	}
}).on('disappear', function(){
	tabris.ui.find('#action_createCalendarEvent').dispose()
})

function deleteAgendaItem(activityID){
	console.log(activityID)
	$.ajax({
		//url: "https://api.fraignt.me/Rooster/huiswerk/create/",
		url: baseURL + "Rooster/huiswerk/delete/",
		data: {
			itsLearningSessionID: localStorage.getItem('itsLearningSessionID'),
			code : localStorage.getItem('code'),
			username: localStorage.getItem('__User'),
			activityID: activityID 
		},
		type: "POST",
		crossDomain: true,
		success: function( response ) {
			get_agendaItems(true, true)
		}
	});
}


function createCalendarEventPage(){
	function createNewCalendarItemFinish(title, description){
		$.ajax({
			//url: "https://api.fraignt.me/Rooster/huiswerk/create/",
			url: baseURL + "Rooster/huiswerk/create/",
			data: {
				itsLearningSessionID: localStorage.getItem('itsLearningSessionID'),
				code : localStorage.getItem('code'),
				username: localStorage.getItem('__User'),
				date: localStorage.getItem('__tempDateTime').split(',')[0],
				time: localStorage.getItem('__tempDateTime').split(',')[1],
				description: description,
				title: title
			},
			type: "POST",
			crossDomain: true,
			success: function( response ) {
				get_agendaItems(true, true)
			}
		});
	}
	var editorPage = new tabris.Page({
		topLevel: false,
		title: ''
	}).on('appear', function(){
		tabris.ui.set('toolbarVisible', false)
	}).on('disappear', function(){
		tabris.ui.set('toolbarVisible', true)
		localStorage.removeItem('__tempDateTime')
	}).open()
	const editorToolBarHeight = 56
	var editorToolBar = new tabris.Composite({
		layoutData: {
			top: 0,
			left: 0,
			right: 0,
			height: editorToolBarHeight
		},
		elevation: 2,
		background: colors.UI_bg
	}).appendTo(editorPage)
	new tabris.ImageView({
		layoutData: {
			left: 0,
			centerY: 0,
			height: 24
		},
		image: {src: 'img/ic_clear_white_36dp.png'}
	}).on("touchstart", function (imageView) {
			imageView.animate({transform: {rotation: Math.PI * 0.1}}, {duration: 150, easing: "ease-out"});
		}).on("touchend", function (imageView) {
			editorPage.close()
		}).on("touchcancel", function (imageView) {
			imageView.animate({transform: {rotation: 0}}, {duration: 150, easing: "ease-out"});
		}).appendTo(editorToolBar)
	new tabris.ImageView({
		layoutData: {
			right: 0,
			centerY: 0,
			height: 24
		},
		image: {src: 'img/ic_done_white_36dp.png'}
	}).on("touchstart", function (imageView) {
			imageView.animate({transform: {rotation: Math.PI * 0.1}}, {duration: 150, easing: "ease-out"});
		}).on("touchend", function (imageView) {
			createNewCalendarItemFinish(titleInputHW.get('text'), descInputHW.get('text'))
			imageView.animate({transform: {rotation: 0}}, {duration: 150, easing: "ease-out"});
			editorPage.close()
		}).on("touchcancel", function (imageView) {
			imageView.animate({transform: {rotation: 0}}, {duration: 150, easing: "ease-out"});
		}).appendTo(editorToolBar)
	const editorPageSubHeaderHeight = 78
	var editorPageSubHeader = new tabris.ScrollView({
		layoutData: {
			top: -22,
			//top: 56,
			left: 0,
			right: 0,
			height: editorPageSubHeaderHeight,
		},
		elevation: 2,
		background: colors.UI_bg
	}).appendTo(editorPage)
	var pageTitle = new tabris.TextView({
		layoutData: {
			left: 72,
			right: 16,
			centerY: 0,
		},
		textColor: colors.white_bg,
		text: 'Agenda-item toevoegen',
		font: '21px'
	}).appendTo(editorPageSubHeader)
	editorPageSubHeader.animate({
		transform: {
			translationY: editorPageSubHeaderHeight
		}
	})
	
	
	new tabris.ImageView({
		layoutData: {
			top: editorPageSubHeaderHeight + editorToolBarHeight + 20,
			left: 16,
			height: 24,
			width: 24
		},
		image: {src:'img/ic_info_black_36dp.png'}
	}).appendTo(editorPage)
	
	new tabris.TextView({
		layoutData: {
			top: editorPageSubHeaderHeight + editorToolBarHeight + 20,
			left: 72,
		},
		text: 'Titel',
		font: '17px',
		id: "titelInputLabel",
		textColor: colors.black_grey
	}).appendTo(editorPage)
	
	var titleInputHW = new tabris.TextInput({       //maak input van username
		layoutData: {
			top: editorPageSubHeaderHeight + editorToolBarHeight + 10,
			left: 72,
			right: 16
		},
		id: "titelInput",
		message: ""
	}).on('focus', function(textInput){
		editorPage.children('#titelInputLabel').animate({
			transform: {
				scaleX: 0.7,
				scaleY: 0.7,
				translationY: -20,
				translationX: -7
			},
			
		},{
			easing: 'ease-in-out'
		})
		editorPage.children('#titelInputLabel').set('textColor', colors.accent)
	}).on("change:text", function(widget, text){
		pageTitle.set('text', text)
	}).appendTo(editorPage);
	
	new tabris.ImageView({
		layoutData: {
			top: ['#titelInput', 16],
			left: 16,
			height: 24,
			width: 24
		},
		image: {src:'img/ic_description_black_36dp.png'}
	}).appendTo(editorPage)
	
	new tabris.TextView({
		layoutData: {
			top: ['#titelInput', 16],
			left: 72,
		},
		text: 'Beschrijving',
		font: '17px',
		id: "descInputLabel",
		textColor: colors.black_grey
	}).appendTo(editorPage)
	
	var descInputHW = new tabris.TextInput({       //maak input van username
		layoutData: {
			top: ['#titelInput', 6],
			left: 72,
			right: 16
		},
		id: "descInput",
		type: 'multiline',
		message: ""
	}).on('focus', function(textInput){
		editorPage.children('#descInputLabel').animate({
			transform: {
				scaleX: 0.7,
				scaleY: 0.7,
				translationY: -20,
				translationX: -15
			},
			
		},{
			easing: 'ease-in-out'
		})
		editorPage.children('#descInputLabel').set('textColor', colors.accent)
	}).appendTo(editorPage);
	
	new tabris.ImageView({
		layoutData: {
			top: ['#descInput', 24],
			left: 16,
			height: 24,
			width: 24
		},
		image: {src:'img/ic_access_time_black_36dp.png'}
	}).appendTo(editorPage)
	
 	new tabris.TextView({
		layoutData: {
			top: ['#descInput', 24],
			left: 72,
			right: 16
		},
		font: '17px',
		textColor: colors.black,
		text: 'Kies een datum...'
	}).on('tap', function(widget){
		var datePicker = require('./datepicker.js')
		var dateTimePromise = new datePicker().openIn(editorPage)
		dateTimePromise.then((dateTimeList) => {
			widget.set('text', dateTimeList[2])
			localStorage.setItem('__tempDateTime', dateTimeList)
		})
	}).appendTo(editorPage)
	
	
}
function render_agenda(items, container){
	if(isMaterial){
		new tabris.ImageView({
			right: 16, bottom: 16, width: 56, height: 56,
			elevation: 6,
			cornerRadius: 28,
			highlightOnTouch: true,
			background: colors.accent,
			image: {src: "img/ic_add_white_36dp.png", width: 24, height: 24}
		}).on("touchstart", function (imageView) {
			imageView.animate({transform: {translationZ: 6, rotation: Math.PI * 0.5}}, {duration: 150, easing: "ease-out"});
		}).on("touchend", function (imageView) {
			createCalendarEventPage()
			imageView.animate({transform: {translationZ: 0}}, {duration: 150, easing: "ease-out"});
		}).on("touchcancel", function (imageView) {
			imageView.animate({transform: {translationZ: 0}}, {duration: 150, easing: "ease-out"});
		}).appendTo(container);
		
	}else{

	}
	var SECTION_HEIGHT = 48;
	var ITEM_HEIGHT = 78;
	
	var scrollPosition = 0;
	
	var floatingSection = createSectionView();
	
	floatingSection.children()[0].set('textColor', colors.white_bg)
	floatingSection.set('background', colors.UI_bg)
	floatingSection.set('elevation', 2)
	floatingSection.set('height', SECTION_HEIGHT - 4)
	floatingSection.children()[0].set('font', '18px')
	floatingSection.children()[0].set({
			text: items[0].text,
		})
	
	
	new tabris.CollectionView({
		id: 'huiswerkCollection',
		refreshEnabled: true,
		left: 0, top: 0, right: 0, bottom: 0,
		items: items,
		cellType: function(item) {
			return item.type;
		},
		itemHeight: function(item, type) {
			return type === 'header' ? SECTION_HEIGHT : ITEM_HEIGHT;
		},
		initializeCell: function(cell, type) {
			cell.set('backgroundColor', colors.white_bg)
			if(type === 'header'){
				var textView = createSectionView()
				textView.appendTo(cell);
			}else{
				var title = new tabris.TextView({
					layoutData: {
						left: 72,
						right: 16,
						top: 8,
						height: 24
					},
					font: 'bold 15px',
					color: colors.black
				}).appendTo(cell)
				var desc = new tabris.TextView({
					layoutData: {
						top: 32,
						left: 72,
						right: 16
					},
					font: '14px',
					alignment: 'left',
					color: colors.light_black,
					maxLines: 2
				}).appendTo(cell);
				var divider = new tabris.Composite({
					layoutData: {
						bottom: 0,
						height: 1,
						left: 72,
						right: 0
					}
				}).appendTo(cell)
				var time = new tabris.TextView({
					layoutData: {
						left: 16,
						centerY: 0
					},
					font: 'bold 15px',
					textColor: colors.accent
				}).appendTo(cell)
			}
			cell.on('change:item', function(widget, item) {
				if(type === 'header'){
					textView.children()[0].set('text', item.text);
					if(Boolean(item.first)){
						textView.set('height', SECTION_HEIGHT - 4)
					}
				}else{
					if(Boolean(item._divider)){
						divider.set('background', colors.divider_2)
					}
					time.set('text', item._startTimeParsed)
					title.set('text', item.title)
					desc.set('text', item.descriptionPlainText);
				}
			}).on('longpress', function(widget, event){
				var _times = localStorage.getItem('pressTimes2')
				if(_times == null || _times == undefined || _times == 0 ){
					localStorage.setItem('pressTimes2', 1)
					function onConfirm(buttonIndex) {
						if(buttonIndex == 1){
							console.log(widget.get('item'))
							deleteAgendaItem(widget.get('item')['activityId'])
						}
					}
					navigator.notification.confirm(
						'Weet je zeker dat je '+ widget.get('item').name + ' wilt verwijderen?', // message
						onConfirm,            // callback to invoke with index of button pressed
						'Verwijder ' + widget.get('item').name,           // title
						['Verwijder','Bewaar']     // buttonLabels
					);
				}else{
					localStorage.setItem('pressTimes2', 0)
				}
			});
		}
	}).on('scroll', function(target, delta) {
		scrollPosition += delta.deltaY;
		var firstVisibleItem = target.get('firstVisibleIndex');
		floatingSection.set({
			text: getCurrentSection(firstVisibleItem).text,
			transform: {translationY: getSectionTranslationY(firstVisibleItem)}
		});
		floatingSection.children()[0].set({
			text: getCurrentSection(firstVisibleItem).text,
		})
	}).on('select', function(target, item){
		onSelectHuiswerk(target, item)
	}).on('refresh', function(){
		get_agendaItems(true);
	}).appendTo(container);
	
	floatingSection.appendTo(container);
	
	function getSectionTranslationY(firstVisibleItem) {
		if (scrollPosition < 0) {
			return -scrollPosition;
		}
		var nextSectionOffset = scrollPosition + SECTION_HEIGHT - getNextSection(firstVisibleItem).top;
		if (nextSectionOffset > 0) {
			return -nextSectionOffset;
		}
		return 0;
	}
	
	function getNextSection(firstVisibleItem) {
		for (var i = firstVisibleItem + 1; i < items.length; i++) {
			var item = items[i];
			if (item.type === 'header') {
				return item;
			}
		}
		return null;
	}
	
	function getCurrentSection(firstVisibleItem) {
		for (var i = firstVisibleItem; i >= 0; i--) { // moet eigenlijk i = firstVisibleItem zijn (dus zonder + 1)
			var item = items[i];
			if (item.type === 'header') {
				return item;
			}
		}
		return null;
	}
	
	function createSectionView() {
		var tmp = new tabris.Composite({
			layoutData: {
				top: 0,
				right: 0,
				height: SECTION_HEIGHT,
				left: 0
			},
			background: colors.white_grey_bg
		})
		new tabris.TextView({
			top: 0, bottom: 0, left: 72, right: 0,
			textColor: colors.black,
			font: '15px',
			alignment: 'left', 
			class: 'description'
		}).appendTo(tmp)
		return tmp
	}
	
}

function get_agendaItems(refresh=false, useSession=false){
	var itemHeight = 48;
	var headerHeight = 24;
	if(refresh){
		AgendaPagina.find('#huiswerkCollection').set({
			refreshIndicator: true,
		})
	}else{
		if(localStorage.getItem("agenda") !== null && localStorage.getItem('agenda') !== undefined){
			render_agenda(JSON.parse(localStorage.getItem('agenda')), AgendaPagina)
		}else{
			var spinner = new tabris.ActivityIndicator({
				centerX: 0,
				centerY: 0
			}).appendTo(AgendaPagina);
		}
	}
	$.ajax({
		//url: "https://api.fraignt.me/Rooster/files/",
		url: baseURL + "Rooster/huiswerk/list/",
		data: {
			code : localStorage.getItem('code'),
			username: localStorage.getItem('__User'),
			dayOffset: 0,
			ASPSIDIncluded: useSession,
			ASPSID: localStorage.getItem('itsLearningSessionID')
		},
		type: "POST",
		crossDomain: true,
		success: function( response ) {
			if(refresh || (localStorage.getItem("agenda") !== null && localStorage.getItem('agenda') !== undefined)){
				AgendaPagina.find('#huiswerkCollection').set({
					items: JSON.parse(JSON.stringify(response.huiswerk)),
					refreshIndicator: false,
				})
			}else{
				render_agenda(response.huiswerk, AgendaPagina);
				spinner.dispose()
			}
			localStorage.setItem('itsLearningSessionID', response.cookie)
			localStorage.setItem('agenda', JSON.stringify(response.huiswerk))
		}
	});
}

function onSelectHuiswerk(widget, item){
	widget.animate({
		transform: {
			scaleX: 3,
			scaleY: 3,
		}
	})
	widget.on('animationend', function(){
		widget.set('transform', {
			scaleX: 1,
			scaleY: 1
		})
	})
	var huiswerkPage = new tabris.Page({
		topLevel: false,
		title: ''
	}).open()
	var huiswerkPageHeader = new tabris.Composite({
		layoutData: {
			top: -78,
			left: 0,
			right: 0,
			height: 78,
		},
		elevation: 2,
		background: colors.UI_bg
	}).appendTo(huiswerkPage)
	new tabris.TextView({
		layoutData: {
			left: 72,
			right: 16,
			centerY: 0
		},
		text: item.title,
		textColor: colors.white_bg,
		font: '21px'
	}).appendTo(huiswerkPageHeader)
	huiswerkPageHeader.animate({
		transform: {
			translationY: 78
		}
	})
	huiswerkPage.on('disappear', function(){
		localStorage.setItem('__preventBackNavigation', false)
		tabris.ui.set("background", colors.UI_bg)
		if(isMaterial){
			huiswerkPageHeader.animate({
				transform: {
					translationY: -78
				}
			})
		}
	})
	
	
	var pickerItems = [
		{id: 'none', text: 'Geen notificatie'},
		{id: '30m', text: '30 minuten van tevoren'},
		{id: '3u', text: '3 uur van tevoren'},
		{id: '1d', text: '1 dag van tevoren'},
		{id: 'custom', text: 'Aangepast...'},
		
	]
	
	if(localStorage.getItem('N_' + String(item.id)) !== null && localStorage.getItem('N_' + String(item.id)) !== undefined){
		pickerItems.unshift({id:'keep', text: localStorage.getItem('N_' + String(item.id))})
	}
		
	var huiswerkPageBox = new tabris.ScrollView({
		layoutData: {
			left: 0,
			right: 0,
			top: 78,
			bottom: 0
		}
	}).appendTo(huiswerkPage)
	var tijdBox = new tabris.Composite({
		layoutData: {
			left: 16,
			right: 16,
			top: 24,
		}
	}).appendTo(huiswerkPageBox)
	new tabris.TextView({
		layoutData: {
			left: 72,
			right: 0,
		},
		selectable: true,
		font: '16px',
		text: item._startEndDateTimeParsed,
		textColor: colors.black
	}).appendTo(tijdBox)
	new tabris.ImageView({
		layoutData: {
			height: 24,
			width: 24,
			top: 4
		},
		image: {src:'img/ic_access_time_black_36dp.png'}
	}).appendTo(tijdBox)
	var descBox = new tabris.Composite({
		layoutData: {
			left: 16,
			right: 16,
			top: [tijdBox, '24'],
		}
	}).appendTo(huiswerkPageBox)
	new tabris.TextView({
		layoutData: {
			left: 72,
			right: 0,
		},
		selectable: true,
		font: '16px',
		text: item.descriptionPlainText,
		textColor: colors.black
	}).appendTo(descBox)
	new tabris.ImageView({
		layoutData: {
			height: 24,
			width: 24,
			top: 2
		},
		image: {src:'img/ic_description_black_36dp.png'}
	}).appendTo(descBox)
	var notifiBox = new tabris.Composite({
		layoutData: {
			left: 16,
			right: 16,
			top: [descBox, '24'],
		}
	}).appendTo(huiswerkPageBox)
	var notifiPickerTop = ((isMaterial) ? -5 : 0)
	var notifiPicker = new tabris.Picker({
		layoutData: {
			left: 72,
			right: 0,
			top: notifiPickerTop
		},
		items: pickerItems,
		selection: pickerItems[0],
		itemText: function(item){
			return item.text;
		},
		font: '16px',
		textColor: colors.black
	}).appendTo(notifiBox)
	new tabris.ImageView({
		layoutData: {
			height: 24,
			width: 24,
			top: 2
		},
		image: {src:'img/ic_notifications_black_36dp.png'}
	}).appendTo(notifiBox)
	notifiPicker.on('change:selection', function(picker, picked){
		function createNotification(timeMultiplier, timeType, item){
				const months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december']
				var userMult = timeMultiplier
				var selectionMult = timeType;
				var LS_entryName = 'N_' + String(item.id);
				var minute = 60000
				var now = new Date()
				var timeStartItem = new Date(parseInt(item._startTimeEpoch) * 1000)
				var timeNotification = new Date(timeStartItem.getTime() + (timeStartItem.getTimezoneOffset() *  minute) - (userMult * selectionMult * minute))
				var notificationMinutes = String(timeNotification.getMinutes())
				if((String(notificationMinutes)).length === 1){
					var notificationMinutes = String(notificationMinutes) + '0'
				}
				localStorage.setItem(LS_entryName, timeNotification)
				if(now.getDate() === timeNotification.getDate() && now.getMonth() === timeNotification.getMonth()){
					var toastText = "Je krijgt vandaag om " + String(timeNotification.getHours()) + ":" + notificationMinutes + " een herrinering."
				}else if(now.getDate() + 1 === timeNotification.getDate() && now.getMonth() === timeNotification.getMonth()){
					var toastText = "Je krijgt morgen om " + String(timeNotification.getHours()) + ":" + notificationMinutes + " een herrinering."
				}else{
					var toastText = "Je krijgt " + String(timeNotification.getDate()) + " " + String(months[parseInt(timeNotification.getMonth())]) + 
						 					" om "  + String(timeNotification.getHours()) + ":" + notificationMinutes +  " een herrinering."
				}
				tabris.app.trigger('backnavigation');
			
			
				var tijdText = String(timeNotification.getDate()) + " " + String(months[parseInt(timeNotification.getMonth())]) + 
						 			" om "  + String(timeNotification.getHours()) + ":" + notificationMinutes
				var LS_data = tijdText
				localStorage.setItem(LS_entryName, LS_data)
				showToast(toastText, 3500, huiswerkPage);
				
				cordova.plugins.notification.local.schedule({
					id: String(item.id),
					title: item.title,
					text: item.descriptionPlainText.replace(/(\r\n|\n|\r)/gm," "),
					ongoing: false,
					at: timeNotification,
					data: { item:item }
				})
			}
		if(picked.id === 'none'){
			localStorage.removeItem('N_' + String(item.id));
			cordova.plugins.notification.local.cancel(item.id)
			
		}else if(picked.id === "30m"){
			createNotification(30, 1, item)
		}else if(picked.id === "3u"){
			createNotification(3, 60, item)
		}else if(picked.id === "1d"){
			createNotification(1, 60 * 24, item)
		}
		else if(picked.id === "custom"){
			localStorage.setItem('__preventBackNavigation', true)
			var underlay = new tabris.Composite({
				left:0, top:0, bottom:0, right:0, background: '#000', opacity: 0
			}).on('tap', function(_underlay){
				tabris.app.trigger('backnavigation')
			}).appendTo(huiswerkPage)
			function saveModal(timeMultiplier, timeType, item){
				const months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december']
				var userMult = parseInt(timeMultiplier.get('text'))
				var selectionMult = timeType.get('selection').mult;
				var LS_entryName = 'N_' + String(item.id);
				var minute = 60000
				var now = new Date()
				var timeStartItem = new Date(parseInt(item._startTimeEpoch) * 1000)
				var timeNotification = new Date(timeStartItem.getTime() + (timeStartItem.getTimezoneOffset() *  minute) - (userMult * selectionMult * minute))
				var notificationMinutes = String(timeNotification.getMinutes())
				if((String(notificationMinutes)).length === 1){
					var notificationMinutes = String(notificationMinutes) + '0'
				}
				localStorage.setItem(LS_entryName, timeNotification)
				if(now.getDate() === timeNotification.getDate() && now.getMonth() === timeNotification.getMonth()){
					var toastText = "Je krijgt vandaag om " + String(timeNotification.getHours()) + ":" + String(timeNotification.getMinutes()) + " een herrinering."
				}else{
					var toastText = "Je krijgt " + String(timeNotification.getDate()) + " " + String(months[parseInt(timeNotification.getMonth())]) + 
						 					" om "  + String(timeNotification.getHours()) + ":" + notificationMinutes +  " een herrinering."
				}
				tabris.app.trigger('backnavigation');
				showToast(toastText, 3500, huiswerkPage);
				
				var tijdText = String(timeNotification.getDate()) + " " + String(months[parseInt(timeNotification.getMonth())]) + 
					" om "  + String(timeNotification.getHours()) + ":" + notificationMinutes
				var LS_data = tijdText
				localStorage.setItem(LS_entryName, LS_data)
				
				
				cordova.plugins.notification.local.schedule({
					id: String(item.id),
					title: item.title,
					text: item.descriptionPlainText.replace(/(\r\n|\n|\r)/gm," "),
					ongoing: false,
					at: timeNotification,
					data: { key:'value' }
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
			function closeModal(){
				tabris.ui.set("background", colors.UI_bg)
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
			var noTapButton = new tabris.Button({
				height: 200,
				width: 300,
				top: 100,
				centerX: 0,
				opacity: 0
			}).appendTo(huiswerkPage)
			var modal = new tabris.Composite({
				layoutData: {
					height: 200,
					width: 300,
					top: 100,
					centerX: 0,
				},
				opacity: 0,
				background: colors.white_bg,
				elevation: 24
			}).appendTo(huiswerkPage)
			var modalHeader = new tabris.TextView({
				layoutData: {
					top: 16,
					left: 16,
					right: 16
				},
				text: 'Notificatie',
				font: 'bold 14px',
				textColor: colors.black
			}).appendTo(modal)
			var modalBody = new tabris.Composite({
				layoutData: {
					top: [modalHeader, '24'],
					left: 20,
					right: 20,
					bottom: 50
				},
			}).appendTo(modal)
			var tijdPickerItems = [
				{text1: 'Minuut van te voren', text2: 'Minuten van te voren', id: 'minute', mult: 1},
				{text1: 'Uur van te voren', text2: 'Uren van te voren', id: 'hour', mult: 60},
				{text1: 'Dag van te voren', text2: 'Dagen van te voren', id: 'day', mult: 1440}, // 1440 = 60 * 24
			]
			var helpText = new tabris.TextView({
				layoutData: {
					right: 0,
					left: 0,
					top: 0,
				},
				font: '16px',
				text: 'Wanneer wil je herinnert worden?'
			}).appendTo(modalBody)
			var timeIntInput = new tabris.TextInput({
				layoutData: {
					left: 0,
					top: [helpText, 16],
					width: 40,
					height: 40
				},
				keyboard: 'number',
				text: '5',
				alignment: 'center'
			}).on('focus', function(widget){
				widget.set('message', '')
			}).appendTo(modalBody)
			var tijdPicker = new tabris.Picker({
				layoutData: {
					right: 0,
					left: 60,
					top: [helpText, 16],
					height: 40
				},
				items: tijdPickerItems,
				selection: tijdPickerItems[0],
				alignment: "center",
				itemText: function(item){
					if(timeIntInput.text === '1'){
						return item.text1
					}else{
						return item.text2
					}
				},
			}).appendTo(modalBody)
			new tabris.Composite({
				layoutData: {
					bottom: 0,
					left: 0,
					right: 0,
					height: 48
				},
				background: colors.black
			}).appendTo(modal)
			var modalFooter = new tabris.Composite({
				bottom: 0,
				height: 48,
				left: 0,
				right: 0,
				background: colors.white_bg
			}).on('touchstart', function(widget){
				widget.animate({opacity: 0.8}, {duration: 200, easing: "ease-out"});
			}).on('touchend',function(widget){
				widget.animate({opacity: 1}, {duration: 200, easing: "ease-out"});
				saveModal(timeIntInput, tijdPicker, item)
			}).on('touchcancel', function(widget){
				widget.animate({opacity: 1}, {duration: 200, easing: "ease-out"});
			}).appendTo(modal)
			new tabris.TextView({
				layoutData: {
					centerY: 0,
					right: 16
				},
				text: 'OPSLAAN',
				textColor: colors.accent,
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
		}
	})
}














