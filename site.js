// Set the location of your CSV file
var csvLocation = "https://testf1saacc.blob.core.windows.net/csv/test.csv";


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
    // Sort by most to least points
    csvObjects.sort( ComparePoints );

    // Iterate through Drivers
    for (let i = 0; i < csvObjects.length; i++) {
        // Add Driver
        AddDriver(i+1, csvObjects[i].Name, csvObjects[i].Team, csvObjects[i].Points)
    }
}

// Add A Driver
function AddDriver(pos, name, team, pts) {
    // Create Driver Standing DIV

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

    // Append Driver Standing DIV to Standings Container
    document.getElementById("standings-container").appendChild(containerDiv);
}

// Compare Values
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