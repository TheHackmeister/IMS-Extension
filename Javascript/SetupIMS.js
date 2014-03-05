	//Stops backspace from going back. Needed because AHK removes shortcut text with a backspace.
	window.addEventListener('keydown',function(e){if(e.keyIdentifier=='U+0008'||e.keyIdentifier=='Backspace'){if(e.target==document.body||e.target.type=="radio"){ e.preventDefault();}}},true);
	//Needed, otherwise ajax calls a non existent function and raises an error.
	$.prototype.chosen = function (){return "Bad";};
	String.prototype.change = function(){};
	
	var CDiv = document.createElement('div');
	var txtarea = document.createElement('textarea');
	txtarea.id = 'ScriptSearchTextArea'
	var txt = document.createTextNode('ScriptSearch');
//	var butt = document.createElement('button');

	txtarea.id = "ScriptSearchTextArea"
//	butt.innerHTML = "Enter";
//	butt.setAttribute("onClick", "ScriptSearchRunJS()");

	CDiv.appendChild(txt);
	CDiv.appendChild(txtarea);
//	CDiv.appendChild(butt);
	//StyleText In Percentage signs.
	CDiv.style.zIndex = "-1";
	CDiv.style.position = "fixed";
	CDiv.style.top = "1em";
	document.getElementsByTagName("body")[0].insertBefore(CDiv,document.getElementsByTagName("body")[0].getElementsByTagName('div')[0]);


	var runjs=document.createElement('script');
//Can do this better with Chrome extension API. 
	runjs.setAttribute('type','text/javascript');
	runjs.innerHTML = "document.title = 'IMS'; \
function ScriptSearchRunJS() { \
    var runjs=document.createElement('script'); \
    runjs.setAttribute('type','text/javascript'); \
    runjs.innerHTML = document.getElementById('ScriptSearchTextArea').value; \
    document.getElementsByTagName('body')[0].appendChild(runjs);}"
	document.getElementsByTagName('body')[0].appendChild(runjs);

$(window).keydown(function(event) {
  if(event.shiftKey && event.ctrlKey && event.keyCode == 89) {
		ScriptSearchRunJS()
		event.preventDefault(); 
		return;
  }
  if(event.ctrlKey && event.keyCode == 89) { 
    document.getElementById("ScriptSearchTextArea").focus()
    event.preventDefault(); 
  }
 });
document.title = 'IMS';