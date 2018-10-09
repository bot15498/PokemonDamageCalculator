//Check pokemon.js for pokemon json
//Check moves.js for moves json
typeDict = {
    "1" : "Normal",
    "2" : "Fighting",
    "3" : "Flying",
    "4" : "Poison",
    "5" : "Ground",
    "6" : "Rock",
    "7" : "Bug",
    "8" : "Ghost",
    "9" : "Steel",
    "10" : "Fire",
    "11" : "Water",
    "12" : "Grass",
    "13" : "Electric",
    "14" : "Psychic",
    "15" : "Ice",
    "16" : "Dragon",
    "17" : "Dark",
    "18" : "Fairy"
}

function calculateTypeEffect(atkType,defType1,defType2) {

}

/**
 * Calculates the A/D ratio of a damage calculation
 * @param {*} attackInfo The JSON object of an attack
 * @param {*} atkPokemonRawInfo The JSON object of the attacking pokemon
 * @param {*} defPokemonRawInfo The JSON object of the defending pokemon
 * @returns {*} The ratio of A/D
 */
function calculateDefenseRatio(attackInfo,atkPokemonRawInfo,defPokemonRawInfo) {
    ratio = 0;
    if(attackInfo["Name"] == "Secret Sword" || attackInfo["Name"] == "Psyshock" || attackInfo["Name"] == "Psystrike") {
        ratio = atkPokemonRawInfo["BaseStats"][4] / defPokemonRawInfo["BaseStats"][2];
    } else if(attackInfo["Category"] == "Physical") {
        ratio = atkPokemonRawInfo["BaseStats"][1] / defPokemonRawInfo["BaseStats"][2];
    } else if(attackInfo["Category"] == "Special") {
        ratio = atkPokemonRawInfo["BaseStats"][3] / defPokemonRawInfo["BaseStats"][4];
    }
    return ratio;
}

/**
 * Does a damage calculation 
 * @param {*} attackMove the ID of the attack
 * @param {*} atkPokemonInfo a JSON object of the attacking pokemon's EV/IV/Nature data
 * @param {*} defPokemonInfo a JSON object of the defending pokemon's EV/IV/Nature data
 * @param {*} fieldInfo a JSON object of the field
 * @returns {string} The percent damage a move is predicted to do.
 */
function calculate(attackMove,atkPokemonInfo,defPokemonInfo,fieldInfo) {
    attackInfo = moves[attackMove];
    atkPokemonRawInfo = pokemon[atkPokemonInfo["ID"]];
    defPokemonRawInfo = pokemon[defPokemonInfo["ID"]];
    //calculate base damage
    power = attackInfo["Power"]
    levelCalc = 2 * attkPokemonInfo["Level"] / 5 + 2
    defenseRatio = calculateDefenseRatio(attackInfo,atkPokemonRawInfo,defPokemonRawInfo);
    baseDamage = levelCalc * power * defenseRatio / 50 + 2
    //calculate modifier
    modifier = 1;
    if(fieldInfo.hasOwnProperty("isSingles")) { //target
        targetModifier = fieldInfo["isSingles"] ? 1 : 0.75
        modifier = modifier * targetModifier;
    }
    if(fieldInfo.hasOwnProperty("Weather")) { //weather
        weatherModifier = 1;
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
    if() // STAB

    //get damage before randomness
    damageNoRandom = baseDamage * modifier
}