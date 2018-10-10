// var items = document.getElementsByClassName("example");
// items.forEach(addEventListener("click", myFunction));

// function myFunction() {
//     console.log("test")
// }


// var testDropDown = document.getElementById("pokemonField");
// var testDiv =  document.createElement("div");
// testDiv.setAttribute("id", this.id + "autocomplete-list");
// testDiv.setAttribute("class", "autocomplete-items");
// testDropDown.parentNode.appendChild(testDiv);
// for(var i=0;i<15;i++) {
//     var testlevel = document.createElement("div");
//     testlevel.innerText = "hey hey hey start dash";
//     testlevel.className += "autocomplete-active"
//     testDiv.appendChild(testlevel);
// }
// console.log("hey");

//make text field and child div to store buttons
var inputField = document.getElementById("pokemonField");
var listContainer = document.createElement("div");
var currSelected = 0;
listContainer.className = "autocomplete-container";
listContainer.id = inputField.parentNode.id + "-autocomplete-container";
inputField.parentNode.appendChild(listContainer);
inputField.addEventListener("input",function() {
    clearItems(this);
    currSelected = 0;
    if(this.value != "") {
        for(key in pokemon) {
            currPokemon = pokemon[key];
            if(currPokemon["Name"].toLowerCase().indexOf(this.value.toLowerCase()) != -1) {
                var toAdd = document.createElement("div");
                toAdd.setAttribute("value",key);
                toAdd.innerText = currPokemon["Name"];
                toAdd.className = "autocomplete-item";
                toAdd.addEventListener("click",function() {
                    console.log(this.getAttribute("value"));
                })
                listContainer.appendChild(toAdd);
            }
        }   
    }
});
inputField.addEventListener("keydown",function(e) {
    var container = document.getElementById(this.parentNode.id + "-autocomplete-container");
    if(e.keyCode == 38) { //up arrow
        if(currSelected > 0) {
            container.children[currSelected].classList.remove("autocomplete-item-hover");
            currSelected--;
            container.children[currSelected].classList.add("autocomplete-item-hover");
        } 
    } else if(e.keyCode == 40) { //down arrow
        if(currSelected < container.children.length) {
            container.children[currSelected].classList.remove("autocomplete-item-hover");
            currSelected++;
            container.children[currSelected].classList.add("autocomplete-item-hover");
        }
    } else if(e.keyCode == 13) { //enter
        container.children[currSelected].click();
        clearItems(this);
    }
})

function clearItems(inputField) {
    var container = document.getElementById(inputField.parentNode.id + "-autocomplete-container");
    // for(var i=0;i<container.childNodes.length;i++) {
    //     container.removeChild(container.childNodes[i]);
    // }
    container.innerHTML = "";
}
