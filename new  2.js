



//This moves around the elements.
$('h6:contains(Location Key)').insertBefore('h6:contains(Asset ID)');
$('#addReturnlineLocation').insertBefore('h6:contains(Asset ID)');
$('<textarea id="returnTextarea" rows="15">').insertAfter('#addReturnlineAssetTag');
$('#addReturnlineAssetTag').hide();














var element = document.getElementById('addReturnlineAssetTag');

var new_element = document.createElement('textarea'),
    old_attributes = element.attributes,
    new_attributes = new_element.attributes,
    child = element.firstChild;

for (var i = 0, len = old_attributes.length; i < len; i++) {
    new_attributes.setNamedItem(old_attributes.item(i).cloneNode());
}

new_element.setAttribute("rows","30");
element.parentNode.replaceChild(new_element, element);










var attrs = { };

$.each($('#addReturnlineAssetTag').attributes, function(idx, attr) {
    attrs[attr.nodeName] = attr.nodeValue;
});


$('#addReturnlineAssetTag').replaceWith(function () {
    return $("<textarea />", attrs).append($(this).contents());
});




$('#addReturnlineAssetTag')

$.each($("b")[0].attributes, function(idx, attr) {
    attrs[attr.nodeName] = attr.nodeValue;
});


$('#addReturnlineAssetTag').replaceWith( function () {
    return $("<textarea />", attrs).append($(this).children());
});

$("b").replaceWith(function () {
    return $("<textarea />", attrs).append($(this).children());
});



