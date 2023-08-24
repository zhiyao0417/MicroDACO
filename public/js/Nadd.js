var Ncount = 1
var Nnum = 2
var Nform;
var NformList;
var NformBox;
function addNode() {
    if((Ncount%3 == 1)){
        Nform = document.getElementById("formNode");
        NformList = document.createElement("div");
        NformList.className = ("container px-4 px-lg-5");
        NformList.id = "Nformlist" + Nnum;
        Nform.appendChild(NformList);
        var br = document.createElement("br");
        Nform.appendChild(br);
        NformBox = document.createElement("div");
        NformBox.className = ("row gx-4 gx-lg-5");
        NformBox.id = "Nformbox" + Nnum;
        Nnum +=1;
    }
    NformBox.innerHTML += "<div class=\"col-md-4 mb-3 mb-md-0\">" + "\n\t" +"<div class=\"card py-4 h-100\">" + "\n\t\t" + "<div class=\"card-body text-center\">" + "\n\t\t\t" + "<form action=\"POST\" name=\"node\" enctype=\"multipart/form-data\">" + "\n\t\t\t\t" + "<label for=\"fname\">Node name:</label><br>" + "\n\t\t\t\t" +"<input type=\"text\" id=\"Sname\" name=\"Sname\"><br>" + "\n\t\t\t\t" + "<label for=\"lname\">CPU cores:</label><br>" + "\n\t\t\t\t" + "<input type=\"text\" id=\"cpu\" name=\"cpu\"><br>" + "\n\t\t\t\t" + "<label for=\"lname\">Memory:</label><br>" + "\n\t\t\t\t" + "<input type=\"text\" id=\"memory\" name=\"memory\">" + "\n\t\t\t" + "</form>" + "\n\t\t" + "</div>" + "\n\t" + "</div>" + "\n" + "</div>";
    NformList.appendChild(NformBox);
    Ncount +=1;
}

