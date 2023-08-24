var Scount = 1
var Snum = 2
var Sform;
var SformList;
var SformBox;
function addService() {
    if((Scount%3 == 1)){
        Sform = document.getElementById("formService");
        SformList = document.createElement("div");
        SformList.className = ("container px-4 px-lg-5");
        SformList.id = "Sformlist" + Snum;
        Sform.appendChild(SformList);
        var br = document.createElement("br");
        Sform.appendChild(br);
        SformBox = document.createElement("div");
        SformBox.className = ("row gx-4 gx-lg-5");
        SformBox.id = "Sformbox" + Snum;
        Snum +=1;
    }
    SformBox.innerHTML += "<div class=\"col-md-4 mb-3 mb-md-0\">" + "\n\t" +"<div class=\"card py-4 h-100\">" + "\n\t\t" + "<div class=\"card-body text-center\">" + "\n\t\t\t" + "<form action=\"POST\" name=\"service\" enctype=\"multipart/form-data\">" + "\n\t\t\t\t" + "<label for=\"fname\">Service name:</label><br>" + "\n\t\t\t\t" +"<input type=\"text\" id=\"Sname\" name=\"Sname\"><br>" + "\n\t\t\t\t" + "<label for=\"lname\">CPU cores:</label><br>" + "\n\t\t\t\t" + "<input type=\"text\" id=\"cpu\" name=\"cpu\"><br>" + "\n\t\t\t\t" + "<label for=\"lname\">Memory:</label><br>" + "\n\t\t\t\t" + "<input type=\"text\" id=\"memory\" name=\"memory\">" + "\n\t\t\t" + "</form>" + "\n\t\t" + "</div>" + "\n\t" + "</div>" + "\n" + "</div>";
    SformList.appendChild(SformBox);
    Scount +=1;
}
