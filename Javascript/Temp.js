/*
var editOrderlineGood = editOrderline;
var editOrderline = function () {
	if($('#editOrderlineDetail').length == 0) {
		$('#4').parent().append('<div id="editOrderlineDetail" \>');
		$('#editOrderlineDetail').addClass('section small-12 xlarge-8 xxlarge-6 columns fifth');
	}
	console.log(arguments);
	editOrderlineGood.apply(this, arguments);
}


function showBreadcrumbNavIcon(icon, target){
	$('#viewSelector').removeClass('hide');
	var element = $('#dashboardNavWrapper #'+target);
	$(element).nextAll('a').remove();
	$(element).remove();

	$('#dashboardNavWrapper').append("<a id='"+target+"' href='javascript: scrollWindow(\""+target+"\")' class='icon-"+icon+"'></a>");	
	
	clearDownStreamViews(target);
	
	$('.' + target).removeClass('hide');
	
	scrollWindowAuto(target);
} 

function clearDownStreamViews(target){
	$('#slideContainer .' + target).nextAll('.section').html('');
	$('#slideContainer .' + target).nextAll('.section').addClass('hide');
} 
*/