function clearItems(inputField) {
    var container = document.getElementById(inputField.parentNode.id + "-autocomplete-container");
    // for(var i=0;i<container.childNodes.length;i++) {
    //     container.removeChild(container.childNodes[i]);
    // }
    container.innerHTML = "";
}

function removeType(inputField) {
    for(var i=0;i<inputField.classList.length;i++) {
        var className = inputField.classList[i];
        if(className.startsWith("type")) {
            inputField.classList.remove(className);
        }
    }
}

function changeTypeColor(inputField,currMoveType) {
    //var inputField = container.parentElement.firstElementChild;
    removeType(inputField);
    switch(currMoveType) {
        case "Normal":
            inputField.classList.add("typeNormal");
            break;
        case "Fighting":
            inputField.classList.add("typeFighting");
            break;
        case "Flying":
            inputField.classList.add("typeFlying");
            break;
        case "Poison":
            inputField.classList.add("typePoison");
            break;
        case "Ground":
            inputField.classList.add("typeGround");
            break;
        case "Rock":
            inputField.classList.add("typeRock");
            break;
        case "Bug":
            inputField.classList.add("typeBug");
            break;
        case "Ghost":
            inputField.classList.add("typeGhost");
            break;
        case "Steel":
            inputField.classList.add("typeSteel");
            break;
        case "Fire":
            inputField.classList.add("typeFire");
            break;
        case "Water":
            inputField.classList.add("typeWater");
            break;
        case "Grass":
            inputField.classList.add("typeGrass");
            break;
        case "Electric":
            inputField.classList.add("typeElectric");
            break;
        case "Psychic":
            inputField.classList.add("typePsychic");
            break;
        case "Ice":
            inputField.classList.add("typeIce");
            break;
        case "Dragon":
            inputField.classList.add("typeDragon");
            break;
        case "Dark":
            inputField.classList.add("typeDark");
            break;
        case "Fairy":
            inputField.classList.add("typeFairy");
            break;
    }
}

function doCalculation() {
    var defPokemonInputField = document.getElementById("pokemonInputField-0");
    var atkPokemonInputField = document.getElementById("pokemonInputField-1");
    if(atkPokemonInputField.parentElement.parentElement.getAttribute("value") != null
            && defPokemonInputField.parentElement.parentElement.getAttribute("value") != null) {
        var atkPokemonInfo = {};
        var defPokemonInfo = {};

        //get pokemon id
        atkPokemonInfo["ID"] = atkPokemonInputField.parentElement.parentElement.getAttribute("value");
        defPokemonInfo["ID"] = defPokemonInputField.parentElement.parentElement.getAttribute("value");
        var atkPokemonRawInfo = pokemon[atkPokemonInfo["ID"]];
        var defPokemonRawInfo = pokemon[defPokemonInfo["ID"]]; 
        //get level
        atkPokemonInfo["Level"] = document.getElementById("level-1").value;
        defPokemonInfo["Level"] = document.getElementById("level-0").value;

        //get defender ivs
        atkPokemonInfo["HP"] = {};
        atkPokemonInfo["Atk"] = {};
        atkPokemonInfo["Def"] = {};
        atkPokemonInfo["Spa"] = {};
        atkPokemonInfo["Spd"] = {};
        atkPokemonInfo["Spe"] = {};
        defPokemonInfo["HP"] = {};
        defPokemonInfo["Atk"] = {};
        defPokemonInfo["Def"] = {};
        defPokemonInfo["Spa"] = {};
        defPokemonInfo["Spd"] = {};
        defPokemonInfo["Spe"] = {};
        
        defPokemonInfo["HP"]["IV"] = document.getElementById("ivHP-0").value;
        defPokemonInfo["HP"]["EV"] = document.getElementById("evHP-0").value;
        defPokemonInfo["Atk"]["IV"] = document.getElementById("ivAtk-0").value;
        defPokemonInfo["Atk"]["EV"] = document.getElementById("evAtk-0").value;
        defPokemonInfo["Atk"]["boost"] = document.getElementById("boostAtk-0").value;
        defPokemonInfo["Def"]["IV"] = document.getElementById("ivDef-0").value;
        defPokemonInfo["Def"]["EV"] = document.getElementById("evDef-0").value;
        defPokemonInfo["Def"]["boost"] = document.getElementById("boostDef-0").value;
        defPokemonInfo["Spa"]["IV"] = document.getElementById("ivSpa-0").value;
        defPokemonInfo["Spa"]["EV"] = document.getElementById("evSpa-0").value;
        defPokemonInfo["Spa"]["boost"] = document.getElementById("boostSpa-0").value;
        defPokemonInfo["Spd"]["IV"] = document.getElementById("ivSpd-0").value;
        defPokemonInfo["Spd"]["EV"] = document.getElementById("evSpd-0").value;
        defPokemonInfo["Spd"]["boost"] = document.getElementById("boostSpd-0").value;
        defPokemonInfo["Spe"]["IV"] = document.getElementById("ivSpe-0").value;
        defPokemonInfo["Spe"]["EV"] = document.getElementById("evSpe-0").value;
        defPokemonInfo["Spe"]["boost"] = document.getElementById("boostSpe-0").value;

        atkPokemonInfo["HP"]["IV"] = document.getElementById("ivHP-1").value;
        atkPokemonInfo["HP"]["EV"] = document.getElementById("evHP-1").value;
        atkPokemonInfo["Atk"]["IV"] = document.getElementById("ivAtk-1").value;
        atkPokemonInfo["Atk"]["EV"] = document.getElementById("evAtk-1").value;
        atkPokemonInfo["Atk"]["boost"] = document.getElementById("boostAtk-1").value;
        atkPokemonInfo["Def"]["IV"] = document.getElementById("ivDef-1").value;
        atkPokemonInfo["Def"]["EV"] = document.getElementById("evDef-1").value;
        atkPokemonInfo["Def"]["boost"] = document.getElementById("boostDef-1").value;
        atkPokemonInfo["Spa"]["IV"] = document.getElementById("ivSpa-1").value;
        atkPokemonInfo["Spa"]["EV"] = document.getElementById("evSpa-1").value;
        atkPokemonInfo["Spa"]["boost"] = document.getElementById("boostSpa-1").value;
        atkPokemonInfo["Spd"]["IV"] = document.getElementById("ivSpd-1").value;
        atkPokemonInfo["Spd"]["EV"] = document.getElementById("evSpd-1").value;
        atkPokemonInfo["Spd"]["boost"] = document.getElementById("boostSpd-1").value;
        atkPokemonInfo["Spe"]["IV"] = document.getElementById("ivAtk-1").value;
        atkPokemonInfo["Spe"]["EV"] = document.getElementById("evAtk-1").value;
        atkPokemonInfo["Spe"]["boost"] = document.getElementById("boostAtk-1").value;

        //get ability
        atkPokemonInfo["Ability"] = document.getElementById("ability-1").value;
        defPokemonInfo["Ability"] = document.getElementById("ability-0").value;
        //get nature
        atkPokemonInfo["Nature"] = document.getElementById("nature-1").value;
        defPokemonInfo["Nature"] = document.getElementById("nature-0").value;
        //item
        atkPokemonInfo["Item"] = document.getElementById("item-1").value;
        defPokemonInfo["Item"] = document.getElementById("item-0").value;
        //get burn
        atkPokemonInfo["isBurned"] = document.getElementById("statusL1").value == "Burned";

        //get environment
        var environment = {};

        //update totals
        document.getElementById("totalHP-1").innerText = calculateHPStat(atkPokemonRawInfo,atkPokemonInfo);
        document.getElementById("totalAtk-1").innerText = calculateAttackStat(atkPokemonRawInfo,atkPokemonInfo);
        document.getElementById("totalDef-1").innerText = calculateDefenseStat(atkPokemonRawInfo,atkPokemonInfo);
        document.getElementById("totalSpa-1").innerText = calculateSpecialAttackStat(atkPokemonRawInfo,atkPokemonInfo);
        document.getElementById("totalSpd-1").innerText = calculateSpecialDefenseStat(atkPokemonRawInfo,atkPokemonInfo);
        document.getElementById("totalSpe-1").innerText = calculateSpeedStat(atkPokemonRawInfo,atkPokemonInfo);
        var enemyHP = calculateHPStat(defPokemonRawInfo,defPokemonInfo);
        document.getElementById("totalHP-0").innerText = enemyHP;
        document.getElementById("totalAtk-0").innerText = calculateAttackStat(defPokemonRawInfo,defPokemonInfo);
        document.getElementById("totalDef-0").innerText = calculateDefenseStat(defPokemonRawInfo,defPokemonInfo);
        document.getElementById("totalSpa-0").innerText = calculateSpecialAttackStat(defPokemonRawInfo,defPokemonInfo);
        document.getElementById("totalSpd-0").innerText = calculateSpecialDefenseStat(defPokemonRawInfo,defPokemonInfo);
        document.getElementById("totalSpe-0").innerText = calculateSpeedStat(defPokemonRawInfo,defPokemonInfo);

        //get move
        for(var i=1;i<=4;i++) {
            var moveID = document.getElementById("pokemon1-move" + i+"-input").getAttribute("move-id");
            if(moveID != null) {
                var maxDamage = calculate(moveID,atkPokemonInfo,defPokemonInfo,environment);
                console.log(maxDamage);
                document.getElementById("calc" + i).innerText = damageRatioPercentage(maxDamage,enemyHP);    
            }
        }
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
    clearItems(inputField);
    inputField.value = "";
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
                    toAdd.setAttribute("move-id",currMove);
                    toAdd.innerText = moves[currMove.toString()]["Name"];
                    toAdd.setAttribute("type",moves[currMove.toString()]["Type"]);
                    toAdd.className = "autocomplete-item";
                    container.appendChild(toAdd);
                    toAdd.addEventListener("click",function() {
                        //just add it to text box and clear the list
                        var inputField = this.parentElement.parentElement.firstElementChild;
                        inputField.value = this.innerText;
                        inputField.setAttribute("move-id", this.getAttribute("move-id"));
                        changeTypeColor(inputField,this.getAttribute("type"));
                        clearItems(this.parentElement.parentElement.firstElementChild);
                    })
                }
            }
            if(container.children.length > 0) {
                container.children[container.getAttribute("currSelected")].classList.add("autocomplete-item-hover");
            }
        }
    });
    document.getElementById("pokemon" + pokemonNum + "-move" + moveNum + "-input").addEventListener("keydown",function(e) {
        var container = this.parentElement.lastElementChild;
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
                        // for(var i=1;i<=4;i++) {
                        //     if(currInputField == 1) {
                        //         moveAutocomplete(currInputField,i);
                        //     }
                        // }
                        //clear move autocomplete
                        for(var i=1;i<=4;i++) {
                            if(currInputField == 1) {
                                var moveInputField = document.getElementById("pokemon" + currInputField + "-move" + i + "-input");
                                clearItems(moveInputField);
                                moveInputField.value = "";
                                document.getElementById("calc" + i).innerText = "0% - 0%";
                                moveInputField.removeAttribute("move-id");
                            }
                        }
                        //clear autocomplete
                        clearItems(this.parentElement.parentElement.firstElementChild);
                        //
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
        //console.log(this);
        doCalculation();
    })
}



//default pokemon
var atkPokemonInputField = document.getElementById("pokemonInputField-1");
var defPokemonInputField = document.getElementById("pokemonInputField-0");
atkPokemonInputField.parentElement.parentElement.setAttribute("value",151);
defPokemonInputField.parentElement.parentElement.setAttribute("value",151);
atkPokemonInputField.value = "Mew";
defPokemonInputField.value = "Mew";
console.log(atkPokemonInputField);
var currSelectedPokemon = pokemon[151];
console.log(currSelectedPokemon);
//update base info
document.getElementById("baseHP-0").value = currSelectedPokemon["BaseStats"][0];
document.getElementById("baseAtk-0").value = currSelectedPokemon["BaseStats"][1];
document.getElementById("baseDef-0").value = currSelectedPokemon["BaseStats"][2];
document.getElementById("baseSpa-0").value = currSelectedPokemon["BaseStats"][3];
document.getElementById("baseSpd-0").value = currSelectedPokemon["BaseStats"][4];
document.getElementById("baseSpe-0").value = currSelectedPokemon["BaseStats"][5];  
document.getElementById("baseHP-1").value = currSelectedPokemon["BaseStats"][0];
document.getElementById("baseAtk-1").value = currSelectedPokemon["BaseStats"][1];
document.getElementById("baseDef-1").value = currSelectedPokemon["BaseStats"][2];
document.getElementById("baseSpa-1").value = currSelectedPokemon["BaseStats"][3];
document.getElementById("baseSpd-1").value = currSelectedPokemon["BaseStats"][4];
document.getElementById("baseSpe-1").value = currSelectedPokemon["BaseStats"][5]; 
//update abilities
var pokemonAbilityDef = document.getElementById("ability-0");
pokemonAbilityDef.innerHTML = ""; //clear
var pokemonAbilityAtk = document.getElementById("ability-1");
pokemonAbilityAtk.innerHTML = ""; //clear
for(var i=0;i<currSelectedPokemon["Ability"].length;i++) {
    var abilityName = currSelectedPokemon["Ability"][i];
    pokemonAbilityAtk.innerHTML += "<option value=" + abilityName + ">" + abilityName + "</option>";
    pokemonAbilityDef.innerHTML += "<option value=" + abilityName + ">" + abilityName + "</option>";   
}
//update moves
for(var i=1;i<=4;i++) {
    moveAutocomplete(1,i);
    var moveInputField = document.getElementById("pokemon" + 1 + "-move" + i + "-input");
    clearItems(moveInputField);
    moveInputField.value = "";
    document.getElementById("calc" + i).innerText = "0% - 0%";
    moveInputField.removeAttribute("move-id");
}
//Add items
for(var i=0;i<2;i++) {
    var currSelect = document.getElementById("item-" + i);
    for(item in items) {
        var currItem = items[item];
        currSelect.innerHTML += "<option value=" +  currItem["Name"]  + ">" + currItem["Name"] + "</option>";
    }
}