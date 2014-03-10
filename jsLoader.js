var addToPage = function (loc) {
	var s = document.createElement("script");
	s.src = chrome.extension.getURL(loc);
	(document.head||document.documentElement).appendChild(s);
}

addToPage("Javascript\\SetupIMS.js");
addToPage("Javascript\\General.js");
addToPage("Javascript\\Returns.js");
//addToPage("Javascript\\.js");
//addToPage("Javascript\\.js");
//addToPage("Javascript\\.js");
//addToPage("Javascript\\.js");
//addToPage("Javascript\.js");


