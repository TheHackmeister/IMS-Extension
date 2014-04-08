var addToPage = function (loc) {
	var s = document.createElement("script");
	s.src = chrome.extension.getURL(loc);
	(document.head||document.documentElement).appendChild(s);
}

addToPage("Javascript\\md5.js");


addToPage("Javascript\\SetupIMS.js");
addToPage("Javascript\\General.js");
addToPage("Javascript\\Assets.js");
addToPage("Javascript\\Returns.js");
addToPage("Javascript\\SalesOrder.js");
addToPage("Javascript\\Count-In-Location.js");
addToPage("Javascript\\HD-Page.js");
addToPage("Javascript\\Build.js");
//addToPage("Javascript\\Boxing-CreateLoc.js");
//addToPage("Javascript\\Boxing-CurrentBox.js");
//addToPage("Javascript\\Boxing-CurrentLoc.js");
//addToPage("Javascript\\Boxing-Init.js");


chrome.storage.sync.get("SautoAddToSO", function (retVal) {
    if(retVal.SautoAddToSO == true) {
		addToPage("Javascript\\Shipping.js");		
	}
});

chrome.storage.sync.get("SunsetReturns", function (retVal) {
    if(retVal.SunsetReturns == false) {
		addToPage("Javascript\\Return-Option.js");		
	}
});
//addToPage("Javascript\\.js");
//addToPage("Javascript\\.js");
//addToPage("Javascript\\.js");
//addToPage("Javascript\\.js");
//addToPage("Javascript\.js");


