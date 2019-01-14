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

    //find base move power
    var power = parseInt(attackInfo["Power"]);

    //Change type of judgement if needed
    attackInfo = applyPlateToJudgement(attackInfo,atkPokemonRawInfo,atkPokemonInfo);

    //Apply type enhancing items and plates.
    power = applyTypeEnhancingItem(attackInfo,power,atkPokemonRawInfo,atkPokemonInfo);

    //calculate base damage
    var levelCalc = 2 * parseFloat(atkPokemonInfo["Level"]) / 5 + 2;
    var defenseRatio = calculateDefenseRatio(attackInfo,atkPokemonRawInfo,defPokemonRawInfo,atkPokemonInfo,defPokemonInfo,fieldInfo);
    var baseDamage = Math.floor(levelCalc * power * defenseRatio / 50) + 2
    //calculate modifier
    var modifier = 1;
    var actualDamage = baseDamage;

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
 * Applies power boost from certain items.
 * https://bulbapedia.bulbagarden.net/wiki/Type-enhancing_item
 * Also includes boost from plates and relevant incenses
 * 
 * @param {JSON} attackInfo The attack JSON from the moves list
 * @param {number} power The base attack power of the move used
 * @param {JSON} atkPokemonRawInfo The JSON base for the attacking pokemon
 * @param {JSON} atkPokemonInfo The JSON for the attack pokemon's spread
 * @returns {number} the new power of the attack.
 */
function applyTypeEnhancingItem(attackInfo,power,atkPokemonRawInfo,atkPokemonInfo) {
    var newPower = power;
    //Type enchancing items
    var atkItemName = items[atkPokemonInfo["Item"].toString()]["Name"];
    switch(atkItemName) {
        case "Soul-dew":
            if((atkPokemonRawInfo["Name"]=="Latias" || atkPokemonRawInfo["Name"]=="Latios")
                    && (attackInfo["Type"] == "Psychic" || attackInfo["Type"] == "Dragon")) {
                newPower = Math.floor(newPower * 1.2);
            }
            break;
        case "Adamant-orb":
            if(atkPokemonRawInfo["Name"] == "Dialga"
                    && (attackInfo["Type"] == "Steel" || attackInfo["Type"] == "Dragon")) {
                newPower = Math.floor(newPower * 1.2);
            }
            break;
        case "Lustrous-orb":
            if(atkPokemonRawInfo["Name"] == "Palkia"
                    && (attackInfo["Type"] == "Water" || attackInfo["Type"] == "Dragon")) {
                newPower = Math.floor(newPower * 1.2);
            }
            break;
        case "Griseous-orb":
            if((atkPokemonRawInfo["Name"]=="Giratina-origin" || atkPokemonRawInfo["Name"]=="Giratina-altered")
                    && (attackInfo["Type"] == "Ghost" || attackInfo["Type"] == "Dragon")) {
                newPower = Math.floor(newPower * 1.2);
            }
            break;
        case "Fist-plate":
        case "Black-belt":
            if(attackInfo["Type"] == "Fighting") {
                newPower = Math.floor(newPower * 1.2);
            }
            break;
        case "Dread-plate":
        case "Black-glasses":
            if(attackInfo["Type"] == "Dark") {
                newPower = Math.floor(newPower * 1.2);
            }
            break;
        case "Flame-plate":
        case "Charcoal":
            if(attackInfo["Type"] == "Fire") {
                newPower = Math.floor(newPower * 1.2);
            }
            break;
        case "Draco-plate":
        case "Dragon-fang":
            if(attackInfo["Type"] == "Dragon") {
                newPower = Math.floor(newPower * 1.2);
            }
            break;
        case "Stone-plate":
        case "Rock-incense":
        case "Hard-stone":
            if(attackInfo["Type"] == "Rock") {
                newPower = Math.floor(newPower * 1.2);
            }
            break;
        case "Zap-plate":
        case "Magnet":
            if(attackInfo["Type"] == "Electric") {
                newPower = Math.floor(newPower * 1.2);
            }
            break;
        case "Iron-plate":
        case "Metal-coat":
            if(attackInfo["Type"] == "Steel") {
                newPower = Math.floor(newPower * 1.2);
            }
            break;
        case "Meadow-plate":
        case "Rose-incense":
        case "Miracle-seed":
            if(attackInfo["Type"] == "Grass") {
                newPower = Math.floor(newPower * 1.2);
            }
            break;
        case "Splash-plate":
        case "Sea-incense":
        case "Wave-incense":
        case "Mystic-water":
            if(attackInfo["Type"] == "Water") {
                newPower = Math.floor(newPower * 1.2);
            }
            break;
        case "Icicle-plate":
        case "Never-melt-ice":
            if(attackInfo["Type"] == "Ice") {
                newPower = Math.floor(newPower * 1.2);
            }
            break;
        case "Toxic-plate":
        case "Poison-barb":
            if(attackInfo["Type"] == "Poison") {
                newPower = Math.floor(newPower * 1.2);
            }
            break;
        case "Sky-plate":
        case "Sharp-beak":
            if(attackInfo["Type"] == "Flying") {
                newPower = Math.floor(newPower * 1.2);
            }
            break;
        case "Silk-scarf":
            if(attackInfo["Type"] == "Normal") {
                newPower = Math.floor(newPower * 1.2);
            }
            break;
        case "Insect-plate":
        case "Silver-powder":
            if(attackInfo["Type"] == "Bug") {
                newPower = Math.floor(newPower * 1.2);
            }
            break;
        case "Earth-plate":
        case "Soft-sand":
            if(attackInfo["Type"] == "Ground") {
                newPower = Math.floor(newPower * 1.2);
            }
            break;
        case "Spooky-plate":
        case "Spell-tag":
            if(attackInfo["Type"] == "Ghost") {
                newPower = Math.floor(newPower * 1.2);
            }
            break;
        case "Mind-plate":
        case "Odd-incense":
        case "Twisted-spoon":
            if(attackInfo["Type"] == "Psychic") {
                newPower = Math.floor(newPower * 1.2);
            }
            break;
        case "Pixie-plate":
            if(attackInfo["Type"] == "Fairy") {
                newPower = Math.floor(newPower * 1.2);
            }
            break;
    }
    return newPower;
}

/**
 * Changes the type of judgement to the correct type.
 * @param {JSON} attackInfo the attackInfo JSON of the 
 * @param {JSON} atkPokemonRawInfo The JSON base for the attacking pokemon
 * @param {JSON} atkPokemonInfo The JSON for the attack pokemon's spread
 * @returns {JSON} the modified attackInfo if there is a type change to judgement
 */
function applyPlateToJudgement(attackInfo,atkPokemonRawInfo,atkPokemonInfo) {
    var newAttackInfo = attackInfo;
    var atkItemName = items[atkPokemonInfo["Item"].toString()]["Name"];
    if(attackInfo["Name"] == "Judgment" 
            && atkPokemonRawInfo["Name"] == "Arceus"
            && atkPokemonInfo["Ability"] == "Multitype") {
        switch(atkItemName) {
            case "Draco-plate":
                newAttackInfo["Type"] = "Dragon";
                break;
            case "Dread-plate":
                newAttackInfo["Type"] = "Dark";
                break;
            case "Earth-plate":
                newAttackInfo["Type"] = "Ground";
                break;
            case "Fist-plate":
                newAttackInfo["Type"] = "Fighting";
                break;
            case "Flame-plate":
                newAttackInfo["Type"] = "Fire";
                break;
            case "Icicle-plate":
                newAttackInfo["Type"] = "Ice";
                break;
            case "Insect-plate":
                newAttackInfo["Type"] = "Bug";
                break;
            case "Iron-plate":
                newAttackInfo["Type"] = "Steel";
                break;
            case "Meadow-plate":
                newAttackInfo["Type"] = "Grass";
                break;
            case "Mind-plate":
                newAttackInfo["Type"] = "Psychic";
                break;
            case "Pixie-plate":
                newAttackInfo["Type"] = "Fairy";
                break;
            case "Sky-plate":
                newAttackInfo["Type"] = "Flying";
                break;
            case "Splash-plate":
                newAttackInfo["Type"] = "Water";
                break;
            case "Spooky-plate":
                newAttackInfo["Type"] = "Ghost";
                break;
            case "Stone-plate":
                newAttackInfo["Type"] = "Rock";
                break;
            case "Toxic-plate":
                newAttackInfo["Type"] = "Poison";
                break;
            case "Zap-plate":
                newAttackInfo["Type"] = "Electric";
                break;
        }
    }
    return newAttackInfo;
}