//Check pokemon.js for pokemon json
//Check moves.js for moves json
//Check typechart.js for type chart json
var typeDict = {
    1 : "Normal",
    2 : "Fighting",
    3 : "Flying",
    4 : "Poison",
    5 : "Ground",
    6 : "Rock",
    7 : "Bug",
    8 : "Ghost",
    9 : "Steel",
    10 : "Fire",
    11 : "Water",
    12 : "Grass",
    13 : "Electric",
    14 : "Psychic",
    15 : "Ice",
    16 : "Dragon",
    17 : "Dark",
    18 : "Fairy"
}

/**
 * Calculates the A/D ratio of a damage calculation
 * @param {*} attackInfo The JSON object of an attack
 * @param {*} atkPokemonInfo The JSON object of the attacking pokemon
 * @param {*} defPokemonInfo The JSON object of the defending pokemon
 * @returns {*} The ratio of A/D
 */
function calculateDefenseRatio(attackInfo,atkPokemonInfo,defPokemonInfo) {
    var ratio = 1;
    var atkPokemonRawInfo = pokemon[atkPokemonInfo["ID"]];
    var defPokemonRawInfo = pokemon[defPokemonInfo["ID"]];
    var atkPokemonAtk = calculateAttackStat(atkPokemonRawInfo,atkPokemonInfo);
    var atkPokemonSpa = calculateSpecialAttackStat(atkPokemonRawInfo,atkPokemonInfo);
    var defPokemonDef = calculateDefenseStat(defPokemonRawInfo,defPokemonInfo);
    var defPokemonSpd = calculateSpecialDefenseStat(defPokemonRawInfo,defPokemonInfo);
    if(attackInfo["Name"] == "Secret Sword" || attackInfo["Name"] == "Psyshock" || attackInfo["Name"] == "Psystrike") {
        ratio = atkPokemonSpa/defPokemonDef;
    } else if(attackInfo["Category"] == "Physical") {
        ratio = atkPokemonAtk/defPokemonDef;
    } else if(attackInfo["Category"] == "Special") {
        ratio = atkPokemonSpa/defPokemonSpd;
    }
    return ratio;
}

/**
 * Calculates super-effectiveness of an attack on a pokemon
 * @param {*} attackInfo 
 * @param {*} defPokemonRawInfo 
 * @returns {*} the modifier due to type of attack and type of pokemon
 */
function typeCheck(attackInfo,defPokemonRawInfo) {
    var modifier = 1;
    for(var typeID in defPokemonRawInfo["Type"]) {
        actualTypeID = defPokemonRawInfo["Type"][typeID];
        var attackType = attackInfo["Type"];
        var defendType = typeDict[actualTypeID];
        modifier = modifier * typechart[attackType][defendType];
    }
    return modifier;
}

/**
 * Calculates the HP stat based on the pokemon's base stats
 * @param {JSON} pokemonRawInfo the information that applies to all pokemon of that species
 * @param {JSON} pokemonInfo the IV/EV/Nature information
 * @returns {Int32Array} the integer value for HP
 */
function calculateHPStat(pokemonRawInfo,pokemonInfo) {
    if(pokemonRawInfo["Name"] == "Shedinja") { //the shedinja case
        return 1;
    }
    var hpBase = pokemonRawInfo["BaseStats"][0];
    var ivBase = pokemonInfo["iv"]["hp"];
    var evBase = pokemonInfo["ev"]["hp"];
    var level = pokemonInfo["Level"];
    //return (2 * hpBase + ivBase + Math.floor(evBase / 4)) * (level / 100) + level + 10;
    return ((((ivBase + 2 * hpBase + (evBase/4)+100) * level)/100) + 10);
}

/**
 * Calculates the HP stat based on the pokemon's base stats
 * @param {JSON} pokemonRawInfo the information that applies to all pokemon of that species
 * @param {JSON} pokemonInfo the IV/EV/Nature information
 * @returns {Int32Array} the integer value for Attack
 */
function calculateAttackStat(pokemonRawInfo,pokemonInfo) {
    return calculateOtherStat(pokemonRawInfo,pokemonInfo,1);
}

/**
 * Calculates the HP stat based on the pokemon's base stats
 * @param {JSON} pokemonRawInfo the information that applies to all pokemon of that species
 * @param {JSON} pokemonInfo the IV/EV/Nature information
 * @returns {Int32Array} the integer value for Defense
 */
function calculateDefenseStat(pokemonRawInfo,pokemonInfo) {
    return calculateOtherStat(pokemonRawInfo,pokemonInfo,2);
}

/**
 * Calculates the HP stat based on the pokemon's base stats
 * @param {JSON} pokemonRawInfo the information that applies to all pokemon of that species
 * @param {JSON} pokemonInfo the IV/EV/Nature information
 * @returns {Int32Array} the integer value for Special Attack
 */
function calculateSpecialAttackStat(pokemonRawInfo,pokemonInfo) {
    return calculateOtherStat(pokemonRawInfo,pokemonInfo,3);
}

/**
 * Calculates the HP stat based on the pokemon's base stats
 * @param {JSON} pokemonRawInfo the information that applies to all pokemon of that species
 * @param {JSON} pokemonInfo the IV/EV/Nature information
 * @returns {Int32Array} the integer value for SpecialDefense
 */
function calculateSpecialDefenseStat(pokemonRawInfo,pokemonInfo) {
    return calculateOtherStat(pokemonRawInfo,pokemonInfo,4);
}

/**
 * Calculates the HP stat based on the pokemon's base stats
 * @param {JSON} pokemonRawInfo the information that applies to all pokemon of that species
 * @param {JSON} pokemonInfo the IV/EV/Nature information
 * @returns {Int32Array} the integer value for Speed
 */
function calculateSpeedStat(pokemonRawInfo,pokemonInfo) {
    return calculateOtherStat(pokemonRawInfo,pokemonInfo,5);
}

/**
 * Calculates a stat based on the pokemon's base stats
 * https://bulbapedia.bulbagarden.net/wiki/Statistic#Base_stat_values
 * @param {JSON} pokemonRawInfo the information that applies to all pokemon of that species
 * @param {JSON} pokemonInfo the IV/EV/Nature information
 * @returns {Int32Array} the integer value for the stat
 */
function calculateOtherStat(pokemonRawInfo,pokemonInfo,statType) {
    //figure out nature
    natureModifier = 1;
    switch(pokemonInfo["Nature"]) {
        case "Lonely":
            if(statType == 1) { natureModifier = 1.1; }
            if(statType == 2) { natureModifier = 0.9; }
            break; 
        case "Brave":
            if(statType == 1) { natureModifier = 1.1; }
            if(statType == 5) { natureModifier = 0.9; } 
            break; 
        case "Adamant":
            if(statType == 1) { natureModifier = 1.1; }
            if(statType == 3) { natureModifier = 0.9; } 
            break; 
        case "Naughty":
            if(statType == 1) { natureModifier = 1.1; }
            if(statType == 4) { natureModifier = 0.9; } 
            break; 
        case "Bold":
            if(statType == 2) { natureModifier = 1.1; }
            if(statType == 1) { natureModifier = 0.9; } 
            break; 
        case "Relaxed":
            if(statType == 2) { natureModifier = 1.1; }
            if(statType == 5) { natureModifier = 0.9; } 
            break; 
        case "Impish":
            if(statType == 2) { natureModifier = 1.1; }
            if(statType == 3) { natureModifier = 0.9; } 
            break; 
        case "Lax":
            if(statType == 2) { natureModifier = 1.1; }
            if(statType == 4) { natureModifier = 0.9; } 
            break; 
        case "Timid":
            if(statType == 5) { natureModifier = 1.1; }
            if(statType == 1) { natureModifier = 0.9; } 
            break; 
        case "Hasty":
            if(statType == 5) { natureModifier = 1.1; }
            if(statType == 2) { natureModifier = 0.9; } 
            break; 
        case "Jolly":
            if(statType == 5) { natureModifier = 1.1; }
            if(statType == 3) { natureModifier = 0.9; } 
            break; 
        case "Naive":
            if(statType == 5) { natureModifier = 1.1; }
            if(statType == 4) { natureModifier = 0.9; } 
            break; 
        case "Modest":
            if(statType == 3) { natureModifier = 1.1; }
            if(statType == 1) { natureModifier = 0.9; } 
            break; 
        case "Mild":
            if(statType == 3) { natureModifier = 1.1; }
            if(statType == 2) { natureModifier = 0.9; } 
            break; 
        case "Quiet":
            if(statType == 3) { natureModifier = 1.1; }
            if(statType == 5) { natureModifier = 0.9; } 
            break; 
        case "Rash":
            if(statType == 3) { natureModifier = 1.1; }
            if(statType == 4) { natureModifier = 0.9; } 
            break; 
        case "Calm":
            if(statType == 4) { natureModifier = 1.1; }
            if(statType == 1) { natureModifier = 0.9; } 
            break; 
        case "Gentle":
            if(statType == 4) { natureModifier = 1.1; }
            if(statType == 2) { natureModifier = 0.9; } 
            break; 
        case "Sassy":
            if(statType == 4) { natureModifier = 1.1; }
            if(statType == 5) { natureModifier = 0.9; } 
            break; 
        case "Careful":
            if(statType == 4) { natureModifier = 1.1; }
            if(statType == 3) { natureModifier = 0.9; } 
            break; 
        default:
            natureModifier = 1;
            break;
    }
    var statBase = pokemonRawInfo["BaseStats"][statType]
    var ivBase = pokemonInfo["iv"]["hp"];
    var evBase = pokemonInfo["ev"]["hp"];
    var level = pokemonInfo["Level"];
    return Math.floor((Math.floor((2 * statBase + ivBase + Math.floor(evBase)) * level / 100) + 5) * natureModifier)
}

/**
 * Does a damage calculation 
 * @param {*} attackMove the ID of the attack
 * @param {*} atkPokemonInfo a JSON object of the attacking pokemon's EV/IV/Nature data
 * @param {*} defPokemonInfo a JSON object of the defending pokemon's EV/IV/Nature data
 * @param {*} fieldInfo a JSON object of the field
 * @returns {number} The damage value of the attack
 */
function calculate(attackMove,atkPokemonInfo,defPokemonInfo,fieldInfo) {
    var attackInfo = moves[attackMove];
    var atkPokemonRawInfo = pokemon[atkPokemonInfo["ID"]];
    var defPokemonRawInfo = pokemon[defPokemonInfo["ID"]];
    //calculate base damage
    var power = attackInfo["Power"]
    var levelCalc = 2 * atkPokemonInfo["Level"] / 5 + 2
    var defenseRatio = calculateDefenseRatio(attackInfo,atkPokemonInfo,defPokemonInfo);
    var baseDamage = levelCalc * power * defenseRatio / 50 + 2
    //calculate modifier
    var modifier = 1;
    if(fieldInfo.hasOwnProperty("isSingles")) { //target
        var targetModifier = fieldInfo["isSingles"] ? 1 : 0.75
        modifier = modifier * targetModifier;
    }
    if(fieldInfo.hasOwnProperty("Weather")) { //weather
        var weatherModifier = 1;
        if(fieldInfo["Weather"] == "Rain") {
            if(attackInfo["Type"] == "Water") {
                weatherModifier = 1.5;
            } else if(attackInfo["Type"] == "Fire") {
                weatherModifier = 0.5
            }
        } else if(fieldInfo["Weather"] == "Sun") {
            if(attackInfo["Type"] == "Fire") {
                weatherModifier = 1.5;
            } else if(attackInfo["Type"] == "Water") {
                weatherModifier = 0.5
            }
        }
        modifier = modifier * weatherModifier;
    }
    if(fieldInfo.hasOwnProperty("isCritical")) { //crit
        var critModifier = fieldInfo["isCritical"] ? 1.5 : 1;
        modifier = modifier * critModifier;
    }
    for(var typeID in atkPokemonRawInfo["Type"]) { //STAB
        actualTypeID = atkPokemonRawInfo["Type"][typeID];
        if(typeDict[actualTypeID] == attackInfo["Type"] && atkPokemonRawInfo["Ability"] == "Adaptability") {
            modifier = modifier * 2;
        } else if(typeDict[actualTypeID] == attackInfo["Type"]) {
            modifier = modifier * 1.5;
        }
    }
    modifier = modifier * typeCheck(attackInfo,defPokemonRawInfo); //type checking
    if(atkPokemonInfo.hasOwnProperty("isBurned")) { //burn
        var burnModifier = 1;
        if(atkPokemonInfo["isBurned"] && atkPokemonInfo["Ability"] != "Guts" && attackInfo["Type"] == "Physical") {
            burnModifier = 0.5;
        }
        modifier = modifier * burnModifier;
    }
    //TODO: other factors.

    //get damage before randomness
    var damageNoRandom = baseDamage * modifier
    return Math.floor(damageNoRandom);
}

/**
 * Calculates the damage ratio percentage an attack does
 * @param {number} damage: the damage calculation
 * @param {Int32Array} the integer value for HP
 * @return {string} Lower and Upper bound of damage
 */
function damageRatioPercentage(damage, hp) {
    var ratioUpper = damage/hp;
    var percentageUpper = ratioUpper * 100;

    var lowerBound = Math.floor(damage * 0.85);
    var ratioLower = lowerBound/hp;
    var percentageLower = ratioLower * 100;

    return (Math.round(100*percentageLower)/100) + "% - " + (Math.round(100*percentageUpper)/100) + "%";
}


var pokemon1 = {
    "ID" : "1",
    "Level" : 100,
    "Ability" : "Overgrow",
    "iv" : {
        "hp" : 31,
        "atk" : 31,
        "def" : 31,
        "spa" : 31,
        "spd" : 31,
        "spe" : 31
    },
    "ev" : {
        "hp" : 0,
        "atk" : 252,
        "def" : 0,
        "spa" : 0,
        "spd" : 4,
        "spe" : 252
    }
}

var pokemon2 = {
    "ID" : "1",
    "Level" : 100,
    "Ability" : "Overgrow",
    "iv" : {
        "hp" : 31,
        "atk" : 31,
        "def" : 31,
        "spa" : 31,
        "spd" : 31,
        "spe" : 31
    },
    "ev" : {
        "hp" : 0,
        "atk" : 0,
        "def" : 252,
        "spa" : 0,
        "spd" : 4,
        "spe" : 252
    }
}