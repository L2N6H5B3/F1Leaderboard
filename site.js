// Set the location of your CSV file
var csvLocation = "<url-to-csv>";

// Set Global variables
var addedRounds = [];
var addedDrivers = [];
var addedPositions = [];

// Get CSV file
function GetCsv() {
    $.ajax({
        type: "GET",
        url: csvLocation,
        dataType: "text",
        success: function (data) { ProcessData(data); }
    });
}

// Process Data from CSV Request
function ProcessData(data) {
    // Convert to Objects
    var csvObjects = $.csv.toObjects(data);
    // Sort by Rounds
    csvObjects.sort(CompareRounds);

    // Iterate through Objects to add Rounds
    for (let i = 0; i < csvObjects.length; i++) {
        if (!addedRounds.includes(csvObjects[i].Round)) {
            // Add Round
            AddRound(csvObjects[i].Round);
            // Add the Round to the Array
            addedRounds.push(csvObjects[i].Round);
        }
    }

    // Sort by most to least points
    csvObjects.sort(ComparePoints);

    // Iterate through Drivers
    for (let i = 0; i < csvObjects.length; i++) {
        // Get the Index of the Driver
        var addedDriverIndex = addedDrivers.findIndex(function (value) { return value.DriverName == csvObjects[i].Name; });
        console.log(addedDriverIndex);
        // If the Driver Doesn't Exist
        if (addedDriverIndex == -1) {
            // Add the Driver to the Array
            addedDrivers.push({ DriverName: csvObjects[i].Name, DriverTeam: csvObjects[i].Team, DriverPoints: csvObjects[i].Points });
        } else {
            console.log("Adding Points to "+csvObjects[i].Name+": "+csvObjects[i].Points);
            // Add the Driver Points to the Array
            addedDrivers[addedDriverIndex].DriverPoints = parseInt(addedDrivers[addedDriverIndex].DriverPoints) + parseInt(csvObjects[i].Points);
        }

        // Get the Index of the Position Counter for this Round
        var addedPositionIndex = addedPositions.findIndex(function (value) { return value.Round == csvObjects[i].Round; });
        // If the Round Doesn't Exist
        if (addedPositionIndex == -1) {
            // Add the Position to the Array
            addedPositions.push({ Round: csvObjects[i].Round, Position: 1 });
            // Get the Position Index
            addedPositionIndex = addedPositions.findIndex(function (value) { return value.Round == csvObjects[i].Round; });
        } else {
            // Add to Position
            addedPositions[addedPositionIndex].Position++;
        }
        // Add Driver
        AddDriver(csvObjects[i].Round, addedPositions[addedPositionIndex].Position, csvObjects[i].Name, csvObjects[i].Team, csvObjects[i].Points);
    }

    // Add the Total Standings Container
    AddTotal();

    // Iterate through AddedDrivers
    for (let i = 0; i < addedDrivers.length; i++) {
        // Add Driver
        AddDriver(0, i + 1, addedDrivers[i].DriverName, addedDrivers[i].DriverTeam, addedDrivers[i].DriverPoints)
    }
}

// Add Round Container
function AddRound(number) {
    var titleDiv = document.createElement('div');
    titleDiv.innerHTML = "Round " + number;
    titleDiv.className = "round-number";

    var roundDiv = document.createElement('div');
    roundDiv.className = "standing-round";
    roundDiv.id = "standing-round-" + number;

    // Append Round Standing DIV to Standings Container
    document.getElementById("standings-container").appendChild(titleDiv);
    document.getElementById("standings-container").appendChild(roundDiv);
}

// Add A Driver
function AddDriver(round, pos, name, team, pts) {
    var posDiv = document.createElement('div');
    posDiv.innerHTML = pos;
    posDiv.className = "driver-pos";

    var nameDiv = document.createElement('div');
    nameDiv.innerHTML = name;
    nameDiv.className = "driver-name";

    var teamDiv = document.createElement('div');
    teamDiv.innerHTML = team;
    teamDiv.className = "driver-team";

    var ptsDiv = document.createElement('div');
    ptsDiv.innerHTML = pts;
    ptsDiv.className = "driver-pts";

    var containerDiv = document.createElement('div');
    containerDiv.className = "standing-row";
    containerDiv.appendChild(posDiv);
    containerDiv.appendChild(nameDiv);
    containerDiv.appendChild(teamDiv);
    containerDiv.appendChild(ptsDiv);

    if (round > 0) {
        // Append Driver Standing DIV to Round Standing Container
        document.getElementById("standing-round-" + round).appendChild(containerDiv);
    } else {
        // Append Driver Standing DIV to Total Standing Container
        document.getElementById("standing-total").appendChild(containerDiv);
    }
}

function AddTotal() {
    var titleDiv = document.createElement('div');
    titleDiv.innerHTML = "Total";
    titleDiv.className = "round-total";

    var roundDiv = document.createElement('div');
    roundDiv.className = "standing-total";
    roundDiv.id = "standing-total";

    // Append Round Standing DIV to Standings Container
    document.getElementById("standings-container").prepend(roundDiv);
    document.getElementById("standings-container").prepend(titleDiv);

}

// Compare Rounds
function CompareRounds(a, b) {
    if (parseInt(a.Round) < parseInt(b.Round)) {
        return 1;
    }
    if (parseInt(a.Round) > parseInt(b.Round)) {
        return -1;
    }
    return 0;
}

// Compare Points
function ComparePoints(a, b) {
    if (parseInt(a.Points) < parseInt(b.Points)) {
        return 1;
    }
    if (parseInt(a.Points) > parseInt(b.Points)) {
        return -1;
    }
    return 0;
}

// Initialise Page
function InitialisePage() {
    // Get CSV
    GetCsv();
}

// On Page Ready
$(document).ready(function () {
    InitialisePage();
});