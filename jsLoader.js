

var addToPage = function (loc) {
	var s = document.createElement("script");
	s.src = chrome.extension.getURL(loc);
	(document.head||document.documentElement).appendChild(s);
}
//Setup stuff.
addToPage("Javascript\\md5.js");
addToPage("Javascript\\SetupIMS.js");

//General Use.
addToPage("Javascript\\InputForm.js");
addToPage("Javascript\\General.js");
addToPage("Javascript\\PO.js");
addToPage("Javascript\\Listeners.js");
addToPage("Javascript\\Count-In-Location.js");
addToPage("Javascript\\SalesOrder.js");
addToPage("Javascript\\AHK.js");


// Depends on Input Form.
addToPage("Javascript\\Assets.js");
//addToPage("Javascript\\Returns.js"); // Brad replaced.
addToPage("Javascript\\AssetCheck.js"); //Depends on AssetController.
addToPage("Javascript\\ImprovedEditAsset.js"); //Depends on AssetCheck.
addToPage("Javascript\\IEABuild.js");
addToPage("Javascript\\IEACheck.js");
addToPage("Javascript\\IEASet.js");


//addToPage("Javascript\\Boxing-CreateLoc.js");
//addToPage("Javascript\\Boxing-CurrentBox.js");
//addToPage("Javascript\\Boxing-CurrentLoc.js");
//addToPage("Javascript\\Boxing-Init.js");

chrome.storage.sync.get("SautoAddToSO", function (retVal) {
    if(retVal.SautoAddToSO == true) {
		addToPage("Javascript\\Shipping.js");		
	}
});
/*
chrome.storage.sync.get("SunsetReturns", function (retVal) {
    if(retVal.SunsetReturns == false) {
		addToPage("Javascript\\Return-Option.js");		
	}
});
*/
//addToPage("Javascript\\.js");
//addToPage("Javascript\\.js");
//addToPage("Javascript\\.js");
//addToPage("Javascript\\.js");
//addToPage("Javascript\.js");


