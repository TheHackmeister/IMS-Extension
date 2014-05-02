//Stops backspace from going back. Needed because AHK removes shortcut text with a backspace.
window.addEventListener('keydown',function(e){if(e.keyIdentifier=='U+0008'||e.keyIdentifier=='Backspace'){if(e.target==document.body||e.target.type=="radio"){ e.preventDefault();}}},true);

var setupIMS = function () {
	if($('div:contains(Improved Pages)').length == 0) {
				
		var CDiv = document.createElement('div');
		var txtarea = document.createElement('textarea');
		txtarea.id = 'ScriptSearchTextArea'
		var txt = document.createTextNode('ScriptSearch');

		txtarea.id = "ScriptSearchTextArea"
		CDiv.appendChild(txt);
		CDiv.appendChild(txtarea);
		CDiv.style.zIndex = "-1";
		CDiv.style.position = "fixed";
		CDiv.style.top = "1em";
		
		var runjs=document.createElement('script');
		runjs.setAttribute('type','text/javascript');
		runjs.innerHTML = "document.title = 'IMS'; \
		function ScriptSearchRunJS() { \
		var runjs=document.createElement('script'); \
		runjs.setAttribute('type','text/javascript'); \
		runjs.innerHTML = document.getElementById('ScriptSearchTextArea').value; \
		document.getElementsByTagName('body')[0].appendChild(runjs);}"
		document.getElementsByTagName('body')[0].appendChild(runjs);

		document.getElementsByTagName("body")[0].insertBefore(CDiv,document.getElementsByTagName("body")[0].getElementsByTagName('div')[0]);
	
		$('<li class="folder root closed"> \
			<a href="#" onclick="showMenu(this); return false;"> \
				<div>Improved Pages</div> \
			</a> \
			<ul class="hide"> \
				<li class="contents"> \
					<a href="javascript: loadImprovedEditAsset();"> \
						<div>Improved Edit Asset</div> \
					</a> \
				</li> \
			</ul> \
		</li>').insertAfter('.leftMenu > .folder.root.closed:last');
	}
}

setupIMS();

$(window).keydown(function(event) {
  if(event.shiftKey && event.ctrlKey && event.keyCode == 89) {
		ScriptSearchRunJS()
		event.preventDefault(); 
		window.lastFocused = "";
		return;
  }
  if(event.ctrlKey && event.keyCode == 89) { 
	window.lastFocused = $(document.activeElement);
    document.getElementById("ScriptSearchTextArea").focus()
    event.preventDefault(); 
  }
 });


document.title = 'IMS';

