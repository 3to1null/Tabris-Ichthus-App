var colors = {
	"transparant": "rgba(0,0,0,0)",
	"black": "rgba(0, 0, 0, 0.87)",
	"light_black": "rgba(0, 0, 0, 0.54)",
	"white_bg": "#FAFAFA",
	"white_light_bg": "rgba(255, 255, 255, 0.6)",
	"white_grey_bg": "#E1E1E1",
	"white_white_grey_bg": "#EFEFEF",
	"UI_bg_light": "#3F51B5",
	"UI_bg": "#3949AB",
	"black_grey": "rgba(0, 0, 0, 0.5)",
	"divider": "#BDBDBD",
	"divider_2": "rgba(0,0,0, 0.12)",
	"accent_pink": "#FF4081",
	"accent_pink_light": "#F48FB1",
	"accent_purple": "#E040FB",
	"accent_purple_light": "#CE93D8",
	"accent_teal": "#009688",
	"accent_teal_light": "#80CBC4",
	"accent_deepOrange": "#FF5722",
	"accent_deepOrange_light": "#FFAB91",
	"accent": "#FF4081",
	"accent_light": "#F48FB1",
	"accent_name": "teal",
	"cijfer_onvoldoende": "#FF4081"
}
colors.accent = colors.accent_teal
colors.accent_light = colors.accent_teal_light
colors.cijfer_onvoldoende = colors.accent_deepOrange

if(localStorage.getItem('-s-accentKleur') !== null){
	if(localStorage.getItem('-s-accentKleur') === "1"){
		colors.accent = colors.accent_teal
		colors.accent_light = colors.accent_teal_light
		colors.accent_name = 'teal'
	}else if(localStorage.getItem('-s-accentKleur') === "0"){
		colors.accent = colors.accent_deepOrange
		colors.accent_light = colors.accent_deepOrange_light
		colors.accent_name = 'deepOrange'
	}else if(localStorage.getItem('-s-accentKleur') === "2"){
		colors.accent = colors.accent_pink
		colors.accent_light = colors.accent_pink_light
		colors.accent_name = 'pink'
	} if(localStorage.getItem('-s-accentKleur') === "3"){
		colors.accent = colors.accent_purple
		colors.accent_light = colors.accent_purple_light
		colors.accent_name = 'purple'
	}
}else{
	localStorage.setItem('-s-accentKleur', 1)
}
if(localStorage.getItem('-s-onvoldoendeKleur') !== null){
	if(localStorage.getItem('-s-onvoldoendeKleur') === "0"){
		colors.cijfer_onvoldoende = colors.accent_teal
	}else if(localStorage.getItem('-s-onvoldoendeKleur') === "1"){
		colors.cijfer_onvoldoende = colors.accent_deepOrange
	}else if(localStorage.getItem('-s-onvoldoendeKleur') === "2"){
		colors.cijfer_onvoldoende = colors.accent_pink
	} if(localStorage.getItem('-s-onvoldoendeKleur') === "3"){
		colors.cijfer_onvoldoende = colors.accent_purple
	}
}else{
	localStorage.setItem('-s-onvoldoendeKleur', 1)
}
if(localStorage.getItem('-s-ColorFileIcon') === 'false'){
	colors.accent_name = 'grey'
}
module.exports = colors