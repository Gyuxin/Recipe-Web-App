var json;
var array;
const ROOT = "./public_html";
xhr = new XMLHttpRequest();
var url = "/recipes";
xhr.open("GET", url, true);
xhr.setRequestHeader("Content-type", "application/json");
xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        array = JSON.parse(xhr.responseText);
        name_array = array.jsonfile;
        select = document.getElementById('array');
        for(i in name_array ){
          select.add(new Option(name_array[i].name,name_array[i].name));
        }
    }
  }
xhr.send();


function viewRequest(){
var myObj;
var recipe_data;

var url = "/recipes/?search="+array.filename[select.selectedIndex+1];
xhr.open("GET", url, true);
xhr.setRequestHeader("Content-type", "application/json");
xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        recipe_data = JSON.parse(xhr.responseText);
        document.getElementById("ingredients").value=null;
        document.getElementById("Steps").value=null;

        document.getElementById("duration").value=recipe_data["duration"];
        document.getElementById("ingredients").value+=recipe_data["ingredients"]+"\n";
        document.getElementById("Steps").value+=recipe_data["directions"]+"\n";
        document.getElementById("Notes").value=recipe_data["notes"];
    }
  }

xhr.send();
}

function submitRequest(){

var xhr = new XMLHttpRequest();

var url;
var data;
var url = "/recipes/"+array.filename[select.selectedIndex+1];
var recipe_data = array.jsonfile;
xhr.open("POST", url, true);
xhr.setRequestHeader("Content-type", "application/json");
  xhr.onreadystatechange = function(){
    if (xhr.readyState == 4&&xhr.status==200){
          console.log(data);
    }
}

var arrIngredients = document.getElementById("ingredients").value.split("\n");
var arrStep =  document.getElementById("Steps").value.split("\n");
      data = {name: recipe_data[select.selectedIndex].name,
                  duration: document.getElementById("duration").value,
                      ingredients: arrIngredients,
              directions: arrStep,
              notes: document.getElementById("Notes").value};

    xhr.send(JSON.stringify(data));

    document.getElementById("greenCheck").style="display:inline";

    setTimeout(function hide(){
    document.getElementById("greenCheck").style="display:none";
    },3000);
}
