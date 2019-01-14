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
var statChangeDict = {
    "6" : 4,
    "5" : 3.5,
    "4" : 3,
    "3" : 2.5,
    "2" : 2,
    "1" : 1.5,
    "0" : 1,
    "-1" : 2/3,
    "-2" : 2/4,
    "-3" : 2/5,
    "-4" : 2/6,
    "-5" : 2/7,
    "-6" : 2/8
}
var statDict = {
    0 : "HP",
    1 : "Atk",
    2 : "Def",
    3 : "SpA",
    4 : "SpD",
    5 : "Spe"
}

/**
 * Calculates the A/D ratio of a damage calculation
 * @param {*} attackInfo The JSON object of an attack
 * @param {*} atkPokemonInfo The JSON object of the attacking pokemon
 * @param {*} defPokemonInfo The JSON object of the defending pokemon
 * @returns {*} The ratio of A/D
 */
function calculateDefenseRatio(attackInfo,atkPokemonRawInfo,defPokemonRawInfo,atkPokemonInfo,defPokemonInfo,fieldInfo) {
    var ratio = 1;
    // var atkPokemonRawInfo = pokemon[atkPokemonInfo["ID"]];
    // var defPokemonRawInfo = pokemon[defPokemonInfo["ID"]];
    var atkBoost = statChangeDict[atkPokemonInfo["Atk"]["boost"]];
    var spaBoost = statChangeDict[atkPokemonInfo["SpA"]["boost"]];
    var defBoost = statChangeDict[defPokemonInfo["Def"]["boost"]];
    var spdBoost = statChangeDict[defPokemonInfo["SpD"]["boost"]];
    // console.log(defPokemonInfo);
    if(fieldInfo["isCrit"]) {
        if(atkBoost < 1) {
            atkBoost = 1;
        }
        if(spaBoost < 1) {
            spaBoost = 1;
        }
        if(defBoost > 1) {
            defBoost = 1;
        }
        if(spdBoost > 1) {
            spdBoost = 1;
        }
    }
    var atkPokemonAtk = Math.floor(calculateAttackStat(atkPokemonRawInfo,atkPokemonInfo) * atkBoost);
    var atkPokemonSpa = Math.floor(calculateSpecialAttackStat(atkPokemonRawInfo,atkPokemonInfo) * spaBoost);
    var defPokemonDef = Math.floor(calculateDefenseStat(defPokemonRawInfo,defPokemonInfo) * defBoost);
    var defPokemonSpd = Math.floor(calculateSpecialDefenseStat(defPokemonRawInfo,defPokemonInfo) * spdBoost);
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
    var hpBase = parseInt(pokemonRawInfo["BaseStats"][0]);
    var ivBase = parseInt(pokemonInfo["HP"]["IV"]);
    var evBase = parseInt(pokemonInfo["HP"]["EV"]);
    var level = parseInt(pokemonInfo["Level"]);
    //return (2 * hpBase + ivBase + Math.floor(evBase / 4)) * (level / 100) + level + 10;
    return Math.floor((((ivBase + 2 * hpBase + (evBase/4)+100) * level)/100) + 10);
}

/**
 * Calculates the HP stat based on the pokemon's base stats
 * @param {JSON} pokemonRawInfo the information that applies to all pokemon of that species
 * @param {JSON} pokemonInfo the IV/EV/Nature information
 * @returns {Int32Array} the integer value for Attack
 */
function calculateAttackStat(pokemonRawInfo,pokemonInfo) {
    var modifier = 1;
    if(items[pokemonInfo["Item"].toString()]["Name"] == "Choice-band"){
        modifier = 1.5;
    }
    return Math.floor(calculateOtherStat(pokemonRawInfo,pokemonInfo,1) * modifier);
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
    var modifier = 1;
    if(items[pokemonInfo["Item"].toString()]["Name"] == "Choice-specs"){
        modifier = 1.5;
    }
    return Math.floor(calculateOtherStat(pokemonRawInfo,pokemonInfo,3) * modifier);
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
    var statBase = parseInt(pokemonRawInfo["BaseStats"][statType]);
    var ivBase = parseInt(pokemonInfo[statDict[statType]]["IV"]);
    var evBase = parseInt(pokemonInfo[statDict[statType]]["EV"]);
    var level = parseInt(pokemonInfo["Level"]);
    return Math.floor((Math.floor((2 * statBase + ivBase + Math.floor(evBase/4)) * level / 100) + 5) * natureModifier)
}

/**
 * Does a damage calculation 
 * https://www.smogon.com/bw/articles/bw_complete_damage_formula#chain-mod
 * @param {*} attackMove the ID of the attack
 * @param {*} atkPokemonInfo a JSON object of the attacking pokemon's EV/IV/Nature data
 * @param {*} defPokemonInfo a JSON object of the defending pokemon's EV/IV/Nature data
 * @param {*} fieldInfo a JSON object of the field
 * @returns {number} The damage value of the attack
 */
function calculate(attackMove,atkPokemonRawInfo,defPokemonRawInfo,atkPokemonInfo,defPokemonInfo,fieldInfo) {
    var attackInfo = moves[attackMove];
    // var atkPokemonRawInfo = pokemon[atkPokemonInfo["ID"]];
    // var defPokemonRawInfo = pokemon[defPokemonInfo["ID"]];
    //calculate base damage
    var power = parseInt(attackInfo["Power"]);

    //Apply type enhancing items
    power = applyTypeEnhancingItem(attackInfo,power,atkPokemonRawInfo,defPokemonRawInfo,atkPokemonInfo,defPokemonInfo);

    var levelCalc = 2 * parseFloat(atkPokemonInfo["Level"]) / 5 + 2;
    var defenseRatio = calculateDefenseRatio(attackInfo,atkPokemonRawInfo,defPokemonRawInfo,atkPokemonInfo,defPokemonInfo,fieldInfo);
    var baseDamage = Math.floor(levelCalc * power * defenseRatio / 50) + 2
    //calculate modifier
    var modifier = 1;
    var actualDamage = baseDamage;

    //ITEMS

    //Target
    if(attackInfo["Target"] == "Multi-Target") {
        actualDamage = Math.floor(actualDamage * 0.75);
    }
    //critical
    if(fieldInfo["isCrit"]) {
        actualDamage = Math.floor(actualDamage * 1.5);
    }
    //Random factor split
    var actualMaxDamage = actualDamage;
    var actualMinDamage = Math.floor(actualMaxDamage * 0.85);
    //STAB
    for(var typeID in atkPokemonRawInfo["Type"]) {
        var actualTypeID = atkPokemonRawInfo["Type"][typeID];
        if(typeDict[actualTypeID] == attackInfo["Type"] && atkPokemonInfo["Ability"] == "Adaptability") {
            modifier = 2;
        } else if(typeDict[actualTypeID] == attackInfo["Type"]) {
            modifier = 1.5;
        }
    }
    actualMaxDamage = Math.floor(actualMaxDamage * modifier);
    actualMinDamage = Math.floor(actualMinDamage * modifier);
    modifier = 1;
    //type checking
    modifier = typeCheck(attackInfo,defPokemonRawInfo); 
    actualMaxDamage = Math.floor(actualMaxDamage * modifier);
    actualMinDamage = Math.floor(actualMinDamage * modifier);
    modifier = 1;
    //burn
    if(atkPokemonInfo["Status"] == 1 && attackInfo["Category"] == "Physical" && atkPokemonInfo["Ability"] != "Guts") {
        modifier = 0.5;
    }
    actualMaxDamage = Math.floor(actualMaxDamage * modifier);
    actualMinDamage = Math.floor(actualMinDamage * modifier);
    modifier = 1;
    //TODO: Weather,Reflect/Lightscreen,

    //get damage before randomness
    return [Math.floor(actualMinDamage),Math.floor(actualMaxDamage)];
}

/**
 * Calculates the damage ratio percentage an attack does
 * @param {number} damage: the damage calculation
 * @param {Int32Array} hp: the integer value for HP
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

/**
 * Applies power boost from certain items
 * https://bulbapedia.bulbagarden.net/wiki/Type-enhancing_item
 * 
 * @param {JSON} attackInfo The attack JSON from the moves list
 * @param {JSON} atkPokemonRawInfo The JSON base for the attacking pokemon
 * @param {JSON} defPokemonRawInfo The JSON base for the defending pokemon
 * @param {JSON} atkPokemonInfo The JSON for the attack pokemon's spread
 * @param {JSON} defPokemonInfo The JSON for the defense pokemon's spread
 * @returns {number} the new power of the attack.
 */
function applyTypeEnhancingItem(attackInfo,power,atkPokemonRawInfo,defPokemonRawInfo,atkPokemonInfo,defPokemonInfo) {
    var newPower = power;
    //Type enchancing items
    var atkItemName = items[atkPokemonInfo["Item"].toString()]["Name"];
    var defItemName = items[defPokemonInfo["Item"].toString()]["Name"];
    console.log(attackInfo);
    console.log(atkItemName);
    if((atkItemName == "Black-belt" && attackInfo["Type"] == "Fighting")
            || (atkItemName == "Black-glasses" && attackInfo["Type"] == "Dark")
            || (atkItemName == "Charcoal" && attackInfo["Type"] == "Fire")
            || (atkItemName == "Dragon-fang" && attackInfo["Type"] == "Dragon")
            || (atkItemName == "Hard-stone" && attackInfo["Type"] == "Rock")
            || (atkItemName == "Magnet" && attackInfo["Type"] == "Electric")
            || (atkItemName == "Metal-coat" && attackInfo["Type"] == "Steel")
            || (atkItemName == "Miracle-seed" && attackInfo["Type"] == "Grass")
            || (atkItemName == "Mystic-water" && attackInfo["Type"] == "Water")
            || (atkItemName == "Never-melt-ice" && attackInfo["Type"] == "Ice")
            || (atkItemName == "Poison-barb" && attackInfo["Type"] == "Poison")
            || (atkItemName == "Sharp-beak" && attackInfo["Type"] == "Flying")
            || (atkItemName == "Silk-scarf" && attackInfo["Type"] == "Normal")
            || (atkItemName == "Silver-powder" && attackInfo["Type"] == "Bug")
            || (atkItemName == "Soft-sand" && attackInfo["Type"] == "Ground")
            || (atkItemName == "Spell-tag" && attackInfo["Type"] == "Ghost")
            || (atkItemName == "Twisted-spoon" && attackInfo["Type"] == "Psychic")) {
        newPower = Math.floor(newPower * 1.2);
    } 
    else if(atkItemName == "Soul-dew" && (atkPokemonRawInfo["Name"]=="Latias" || atkPokemonRawInfo["Name"]=="Latios")) {
        if(attackInfo["Type"] == "Psychic" || attackInfo["Type"] == "Dragon") {
            newPower = Math.floor(newPower * 1.2);
        }
    } else if(atkItemName == "Adamant-orb" && atkPokemonRawInfo["Name"] == "Dialga") {
        if(attackInfo["Type"] == "Steel" || attackInfo["Type"] == "Dragon") {
            newPower = Math.floor(newPower * 1.2);
        }
    } else if(atkItemName == "Lustrous-orb" && atkPokemonRawInfo["Name"] == "Palkia") {
        if(attackInfo["Type"] == "Water" || attackInfo["Type"] == "Dragon") {
            newPower = Math.floor(newPower * 1.2);
        }
    } else if(atkItemName == "Griseous-orb" && atkPokemonRawInfo["Name"] == "Giratina") {
        if(attackInfo["Type"] == "Ghost" || attackInfo["Type"] == "Dragon") {
            newPower = Math.floor(newPower * 1.2);
        }
    }
    return newPower;
}