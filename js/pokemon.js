function clearItems(inputField) {
    var container = document.getElementById(inputField.parentNode.id + "-autocomplete-container");
    // for(var i=0;i<container.childNodes.length;i++) {
    //     container.removeChild(container.childNodes[i]);
    // }
    container.innerHTML = "";
}

function doCalculation() {
    var atkPokemonInputField = document.getElementById("pokemonInputField-0");
    var defPokemonInputField = document.getElementById("pokemonInputField-1");
    if(atkPokemonInputField.getAttribute("value") != null
            && defPokemonInputField.getAttribute("value") != null) {
        var atkPokemonInfo = {};
        var defPokemonInfo = {};
        //get pokemon id
        atkPokemonInfo["ID"] = atkPokemonInputField.getAttribute("value");
        defPokemonInfo["ID"] = defPokemonInputField.getAttribute("value");
        //get level
        atkPokemonInfo["Level"] = document.getElementById("levelL0").value;
        defPokemonInfo["Level"] = document.getElementById("levelL1").value;
        //get evs
        //get ivs
        //get ability
        atkPokemonInfo["Ability"] = document.getElementById("ability-0").value;
        defPokemonInfo["Ability"] = document.getElementById("ability-1").value;
        //get nature
        atkPokemonInfo["Nature"] = document.getElementById("nature-0").value;
        defPokemonInfo["Nature"] = document.getElementById("nature-1").value;
        //get burn
        atkPokemonInfo["isBurned"] = document.getElementById("statusL1").value == "Burned";
        //get environment?
        var environment = {};
        //get move

        var maxDamage = calculate(33,atkPokemonInfo,defPokemonInfo,environment);
    }
}

function moveAutocomplete(pokemonNum,moveNum) {
    var inputField = document.getElementById("pokemon" + pokemonNum + "-move" + moveNum + "-input");
    var listContainer = document.createElement("div");
    listContainer.setAttribute("currSelected",0);
    listContainer.setAttribute("pokemonNum",pokemonNum);
    listContainer.setAttribute("moveNum",moveNum);
    listContainer.className = "autocomplete-container";
    listContainer.id = inputField.parentNode.id + "-autocomplete-container";
    inputField.parentNode.appendChild(listContainer);
    document.getElementById("pokemon" + pokemonNum + "-move" + moveNum + "-input").addEventListener("input",function() {
        clearItems(this);
        var currPokemonNum = listContainer.getAttribute("pokemonNum");
        var currMoveNum = listContainer.getAttribute("moveNum");
        var currPokemonID = document.getElementById("pokemon" + currPokemonNum + "-selector").getAttribute("value");
        var currPokemon = pokemon[currPokemonID];
        var container = this.parentElement.lastElementChild;
        container.setAttribute("currSelected",0);
        if(this.value != "") {
            for(move in currPokemon["Moves"]) {
                var currMove = currPokemon["Moves"][move];
                if(moves[currMove.toString()]["Name"].toLowerCase().indexOf(this.value.toLowerCase()) != -1) {
                    var toAdd = document.createElement("div");
                    toAdd.setAttribute("move-id",move);
                    toAdd.innerText = moves[currMove.toString()]["Name"];
                    toAdd.className = "autocomplete-item";
                    container.appendChild(toAdd);
                    toAdd.addEventListener("click",function() {
                        //just add it to text box and clear the list
                        var inputField = this.parentElement.parentElement.firstElementChild;
                        inputField.value = this.innerText;
                        clearItems(this.parentElement.parentElement.firstElementChild);
                    })
                }
            }
            if(container.children.length > 0) {
                container.children[container.getAttribute("currSelected")].classList.add("autocomplete-item-hover"); 
            }
        }
    });
}

var pokemonAutocompleteFields = document.getElementsByClassName("autocomplete-pokemon-field");
for(var i=0;i<pokemonAutocompleteFields.length;i++) {
    //make text field and child div to store buttons
    var inputField = pokemonAutocompleteFields[i];
    inputField.id = "pokemonInputField-" + i;
    inputField.setAttribute("inputField",i);
    inputField.parentNode.id = "pokemonField-" + i;
    var listContainer = document.createElement("div");
    listContainer.setAttribute("currSelected",0);
    listContainer.className = "autocomplete-container";
    //listContainer.id = inputField.parentNode.id + "-autocomplete-container";
    listContainer.id = inputField.parentNode.id + "-autocomplete-container"
    inputField.parentNode.appendChild(listContainer);
    document.getElementById(pokemonAutocompleteFields[i].id).addEventListener("input",function() {
        clearItems(this);
        var currInputField = this.getAttribute("inputField");
        var container = document.getElementById(this.parentNode.id + "-autocomplete-container");
        container.setAttribute("currSelected",0);
        if(this.value != "") {
            for(key in pokemon) {
                currPokemon = pokemon[key];
                if(currPokemon["Name"].toLowerCase().indexOf(this.value.toLowerCase()) != -1) {
                    var toAdd = document.createElement("div");
                    toAdd.setAttribute("value",key);
                    toAdd.innerText = currPokemon["Name"];
                    toAdd.className = "autocomplete-item";
                    container.appendChild(toAdd);
                    toAdd.addEventListener("click",function() {
                        console.log(this.getAttribute("value") + " in " + currInputField);
                        this.parentElement.parentElement.parentElement.setAttribute("value",this.getAttribute("value"));
                        this.parentElement.parentElement.firstElementChild.value = this.innerText;
                        var currSelectedPokemon = pokemon[this.getAttribute("value")];
                        //update base info
                        document.getElementById("baseHP-" + currInputField).value = currSelectedPokemon["BaseStats"][0];
                        document.getElementById("baseAtk-" + currInputField).value = currSelectedPokemon["BaseStats"][1];
                        document.getElementById("baseDef-" + currInputField).value = currSelectedPokemon["BaseStats"][2];
                        document.getElementById("baseSpa-" + currInputField).value = currSelectedPokemon["BaseStats"][3];
                        document.getElementById("baseSpd-" + currInputField).value = currSelectedPokemon["BaseStats"][4];
                        document.getElementById("baseSpe-" + currInputField).value = currSelectedPokemon["BaseStats"][5];  
                        //update abilities
                        var pokemonAbility = document.getElementById("ability-" + currInputField);
                        pokemonAbility.innerHTML = ""; //clear
                        for(var i=0;i<currSelectedPokemon["Ability"].length;i++) {
                            var abilityName = currSelectedPokemon["Ability"][i];
                            pokemonAbility.innerHTML += "<option value=" + abilityName + ">" + abilityName + "</option>";
                        }
                        //update moves
                        for(var i=1;i<=4;i++) {
                            moveAutocomplete(currInputField,i);
                        }
                        //clear autocomplete
                        clearItems(this.parentElement.parentElement.firstElementChild);
                    })
                } 
            }  
            if(container.children.length > 0) {
                container.children[container.getAttribute("currSelected")].classList.add("autocomplete-item-hover"); 
            }
        }
    });
    document.getElementById(pokemonAutocompleteFields[i].id).addEventListener("keydown",function(e) {
        var container = document.getElementById(this.parentNode.id + "-autocomplete-container");
        if(e.keyCode == 38) { //up arrow
            if(container.getAttribute("currSelected") > 0) {
                var currSelected = container.getAttribute("currSelected");
                container.children[currSelected].classList.remove("autocomplete-item-hover");
                currSelected--;
                container.children[currSelected].classList.add("autocomplete-item-hover");
                container.setAttribute("currSelected",currSelected);
            } 
        } else if(e.keyCode == 40) { //down arrow
            if(container.getAttribute("currSelected") < container.children.length) {
                var currSelected = container.getAttribute("currSelected");
                container.children[currSelected].classList.remove("autocomplete-item-hover");
                currSelected++;
                container.children[currSelected].classList.add("autocomplete-item-hover");
                container.setAttribute("currSelected",currSelected);
            }
        } else if(e.keyCode == 13) { //enter
            container.children[container.getAttribute("currSelected")].click();
            clearItems(this);
        }
    });
}

var calcComponents = document.getElementsByClassName("calc-trigger");
console.log(calcComponents.length);
for(var i=0;i<calcComponents.length;i++) {
    var currComponent = calcComponents[i];
    currComponent.addEventListener("change",function() {
        console.log(this);
    })
}
