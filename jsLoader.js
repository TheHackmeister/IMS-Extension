var addToPage = function (loc) {
	var s = document.createElement("script");
	s.src = chrome.extension.getURL(loc);
	(document.head||document.documentElement).appendChild(s);
}

addToPage("Javascript\\SetupIMS.js");
addToPage("Javascript\\General.js");
addToPage("Javascript\\Assets.js");
addToPage("Javascript\\Returns.js");
addToPage("Javascript\\Count-In-Location.js");

chrome.storage.sync.get("SautoAddToSO", function (retVal) {
    if(retVal.SautoAddToSO == true) {
		addToPage("Javascript\\Shipping.js");		
	}
});
//addToPage("Javascript\\.js");
//addToPage("Javascript\\.js");
//addToPage("Javascript\\.js");
//addToPage("Javascript\\.js");
//addToPage("Javascript\.js");


