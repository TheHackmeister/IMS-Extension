
//HTML for boxing page.
document.getElementById("dashboardBody").innerHTML = 'Create box<br/> \
	<div style="height:330px;"> \
		<div class="divCell" style="padding-right:75px;"> \
			<div> \
				Box Location: <input type="text" id="currentLocationLocation" value="" > \
				<input type="button" id="currentLocationRunReport" value="Run Report"><br> \
			</div> \
			<div class="divCell"> \
				Create Location<br><br>  \
				<form> \
					Description<br> \
					<input type="text" id="createLocationDescription" placeholder="Description"><br> \
					Type<br> \
					<select id="createLocationlocation_type"> \
						<option value="16">BOX</option> \
						<option value="15">PALLET</option> \
						<option value="4">STORAGE</option> \
						<option value="1">WORK STATION</option> \
					</select><br> \
					Max Asset QTY<br> \
					<input type="text" id="createLocationMaxAssetQty" placeholder="Max Asset QTY" value="40"><br> \
					<input type="hidden" id="createLocationProductTypeid" value=""> \
					<input type="text" id="createLocationProductTypeText" hidden> \
					<input type="hidden" id="createLocationProductConditionid"> \
					<input type="text" id="createLocationProductConditionText" hidden> \
					<input type="button" id="createLocationButton" value="create"> \
				</form> \
				<div id="createLocationResponse"> \
				</div> \
			</div> \
			<div id="createLocationEditLocationSearch" class="divCell"> \
				<select id="createLocationField" hidden="true"> \
					<option selected="" value="location"></option> \
				</select> \
				<input type="checkbox" id="createLocationFilter" hidden="true"> \
				<div id="createLocationSearchResults" style="height:240px; overflow:auto; width:200px;" FIXTHIS> \
					&nbsp; \
				</div> \
			</div> \
		</div> \
		<div class="divCell"> \
			<div id="currentLocationLocationForm" class="divCell"> \
			</div> \
			<div id="currentLocationResponse"></div> \
			<div id="currentLocationTransferResponse"></div> \
		</div> \
	</div> \
	<div> \
		<div class="divCell currentBox" style="padding-right:75px;"> \
			Transfer Assets to box<br> \
			<select id="currentBoxSimpleCheck"> \
				<option value="false">Hard Drive and Laptops </option> \
				<option value="true"> Simple </option> \
				<option value="off">No check</option> \
			</select> <br> \
			Asset Tags<br> \
			<div id="currentBoxProductName"></div> \
			<textarea rows="20" cols="30" id="currentBoxAssets"></textarea><br> \
			<input type="button" id="currentBoxButton" value="Transfer"><span id="currentBoxCount"></span><br> \
			<div id="currentBoxResults"></div> \
			<div id="currentBoxEditDiv" style="visibility:hidden; width:1px; height:1px;"></div> \
		</div> \
		<div class="divCell otherTransfer"> \
			Transfer Assets to <input type="text" value="" id="otherTransferLocation"><br> \
			<select id="otherTransferSimpleCheck"> \
				<option value="off">No check</option> \
				<option value="false">Hard Drive and Laptops </option> \
				<option value="true"> Simple </option> \
			</select> <br> \
			Asset Tags<br> \
			<div id="otherTransferProductName"></div> \
			<textarea rows="20" cols="30" id="otherTransferAssets"></textarea><br> \
			<input type="button" id="otherTransferButton" value="Transfer"><span id="otherTransferCount"></span><br> \
			<div id="otherTransferResults"></div> \
			<div id="otherTransferEditDiv" style="visibility:hidden; width:1px; height:1px;"></div> \
		</div> \
	</div> ';


var beepAlert = new SoundAlert();
//This loads the objects above. 
var loca = $('#currentLocationLocation');
var currentLocation = new CurrentLocation("currentLocation"); //On change
loca.attr('id', 'createLocationLocation');
var createLoc = new CreateLocation("createLocation");  //Sets the location
loca.attr('id', 'currentBoxLocation');
var currentBox = new TransferAssetsForm("currentBox", beepAlert); //Gets location
loca.attr('id', 'currentLocationLocation');
var otherTransfer = new TransferAssetsForm("otherTransfer", beepAlert);
