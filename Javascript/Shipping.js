var beep = new SoundAlert();
$('#dashboardContent').on('keyup', "#addSalesOrderlineAssets" , function(event){
	if (event.keyCode == 13 || event.keyCode == 10) {
		var str = $('#addSalesOrderlineAssets').val().replace(/\n$/g,"");
		str = str.substring(0,str.length);
		$('#addSalesOrderlineAssets').val(str);
		$('[value="transfer"]').click();
	}
});

var addSalesOrderLineOld = addSalesOrderLine;
var addSalesOrderLine = function (id) {
	addSalesOrderLineOld(id);
	$('#addSalesOrderlineAssets').val("");
	beep.play(100,"Good");
}



