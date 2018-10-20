//Add pokemon autocomplete
$( ".pokemonSelect" ).autocomplete({
  source: $.map(pokemon,function(item,key) {
      return { label:item["Name"], value:key};
  }),
  select: function(event,ui) {
    this.value = ui.item.label; 
    $(this).attr("selectedPokemon",ui.item.value); 
    $(this).trigger("change"); 
    return false;
  },
  focus: function(event,ui) {
    //this.value = ui.item.label; 
    return false;
  }
});

//Add items dropdown
// $(".stats.extraOptions.items").append($.map(items,function(item,key) {
//     return $('<option/>',{
//         value:key,
//         text:item["Name"]
//     });
// }));
//Add items autocomplete
$( ".itemSelect" ).autocomplete({
    source: $.map(items,function(item,key) {
        return { label:item["Name"], value:key};
    }),
    select: function(event,ui) {
      this.value = ui.item.label; 
      $(this).attr("selectedItem",ui.item.value); 
      $(this).trigger("change"); 
      return false;
    },
    focus: function(event,ui) {
      //this.value = ui.item.label; 
      return false;
    },
    minLength:2
});

//Add abilities
function updateAbilities(pokemonInfo, sourcePokemon) {
    if(pokemonInfo == null) {
        return;
    }
    sourcePokemon.find($(".stats.extraOptions.ability")).find("option").remove();
    sourcePokemon.find($(".stats.extraOptions.ability")).append($.map(pokemonInfo["Ability"],function(item) {
        return $("<option/>",{
            value:item,
            text:item
        });
    })) ;  
}
$(".ability-trigger").change(function() {
    var currPokemon1ID = $("#pokemon1").find($(".pokemonSelect"))[0].getAttribute("selectedPokemon");
    var currPokemon1 = pokemon[currPokemon1ID];
    updateAbilities(currPokemon1,$("#pokemon1"));
    var currPokemon2ID = $("#pokemon2").find($(".pokemonSelect"))[0].getAttribute("selectedPokemon");
    var currPokemon2 = pokemon[currPokemon2ID];
    updateAbilities(currPokemon2,$("#pokemon2"));
});

//add moves
function updateMoves(pokemonInfo, sourcePokemon) {
    if(pokemonInfo == null) {
        return;
    }
    if(sourcePokemon == null) {
        return;
    }
    //clear move slot
    sourcePokemon.find($(".moveSelect")).val("");
    sourcePokemon.find($(".moveOutput")).text("0% - 0%");
    sourcePokemon.find($(".moveSelect")).attr("selectedMove","");
    //change source
    sourcePokemon.find($(".moveSelect")).autocomplete({
        source: $.map(pokemonInfo["Moves"],function(item) {
            return { label:moves[item]["Name"], value:item};
        }),
        select: function(event,ui) {
            this.value = ui.item.label; 
            $(this).attr("selectedMove",ui.item.value); 
            $(this).trigger("change"); 
            return false;
        },
        focus: function(event,ui) {
            //this.value = ui.item.label; 
            return false;
        }
    });
}
$(".moves1-trigger").change(function(){
    var currPokemon1ID = $("#pokemon1").find($(".pokemonSelect"))[0].getAttribute("selectedPokemon");
    var currPokemon1 = pokemon[currPokemon1ID];
    updateMoves(currPokemon1,$("#pokemon1"));
})
$(".moves2-trigger").change(function(){
    var currPokemon2ID = $("#pokemon2").find($(".pokemonSelect"))[0].getAttribute("selectedPokemon");
    var currPokemon2 = pokemon[currPokemon2ID];
    updateMoves(currPokemon2,$("#pokemon2"));
})

//Calc trigger event
$(".calc-trigger").change(function() {
    console.log("Hey Hey Hey Start Dash!");
    //update pokemon stats
    var currPokemon1ID = $("#pokemon1").find($(".pokemonSelect"))[0].getAttribute("selectedPokemon");
    var currPokemon1 = pokemon[currPokemon1ID];
    var currPokemon1Spread = refreshPokemon(currPokemon1,$("#pokemon1"));
    var currPokemon2ID = $("#pokemon2").find($(".pokemonSelect"))[0].getAttribute("selectedPokemon");
    var currPokemon2 = pokemon[currPokemon2ID];
    var currPokemon2Spread = refreshPokemon(currPokemon2,$("#pokemon2"));
    refreshMoves($("#pokemon1"),currPokemon1,currPokemon2,currPokemon1Spread,currPokemon2Spread);
    refreshMoves($("#pokemon2"),currPokemon1,currPokemon2,currPokemon1Spread,currPokemon2Spread);
});

function refreshPokemon(pokemonInfo,target) {
    if(pokemonInfo == null) {
        return;
    }
    if(target == null) {
        return;
    }
    //Change base stats
    var hp = target.find($(".stats.hp"))[0];
    $(hp).find($(".stats.baseStat")).text(pokemonInfo["BaseStats"][0]);
    var atk = target.find($(".stats.atk"))[0];
    $(atk).find($(".stats.baseStat")).text(pokemonInfo["BaseStats"][1]);
    var def = target.find($(".stats.def"))[0];
    $(def).find($(".stats.baseStat")).text(pokemonInfo["BaseStats"][2]);
    var spa = target.find($(".stats.spa"))[0];
    $(spa).find($(".stats.baseStat")).text(pokemonInfo["BaseStats"][3]);
    var spd = target.find($(".stats.spd"))[0];
    $(spd).find($(".stats.baseStat")).text(pokemonInfo["BaseStats"][4]);
    var spe = target.find($(".stats.spe"))[0];
    $(spe).find($(".stats.baseStat")).text(pokemonInfo["BaseStats"][5]);
    //make spreadInfo
    var spreadInfo = {};
    spreadInfo["ID"] = pokemonInfo[""]
    spreadInfo["Level"] = 50;
    spreadInfo["Status"] = target.find($(".stats.extraOptions.status")).val();
    spreadInfo["Nature"] = target.find($(".stats.extraOptions.nature")).val();
    spreadInfo["Item"] = target.find($(".itemSelect"))[0].getAttribute("selectedItem");
    spreadInfo["Ability"] = target.find($(".stats.extraOptions.ability"))[0].value;
    spreadInfo["HP"] = {};
    spreadInfo["HP"]["IV"] = $(hp).find($(".stats.ivs")).val();
    spreadInfo["HP"]["EV"] = $(hp).find($(".stats.evs")).val();
    spreadInfo["Atk"] = {};
    spreadInfo["Atk"]["IV"] = $(atk).find($(".stats.ivs")).val();
    spreadInfo["Atk"]["EV"] = $(atk).find($(".stats.evs")).val();
    spreadInfo["Atk"]["boost"] = $(atk).find($(".stats.boost")).val();
    spreadInfo["Def"] = {};
    spreadInfo["Def"]["IV"] = $(def).find($(".stats.ivs")).val();
    spreadInfo["Def"]["EV"] = $(def).find($(".stats.evs")).val();
    spreadInfo["Def"]["boost"] = $(def).find($(".stats.boost")).val();
    spreadInfo["SpA"] = {};
    spreadInfo["SpA"]["IV"] = $(spa).find($(".stats.ivs")).val();
    spreadInfo["SpA"]["EV"] = $(spa).find($(".stats.evs")).val();
    spreadInfo["SpA"]["boost"] = $(spa).find($(".stats.boost")).val();
    spreadInfo["SpD"] = {};
    spreadInfo["SpD"]["IV"] = $(spd).find($(".stats.ivs")).val();
    spreadInfo["SpD"]["EV"] = $(spd).find($(".stats.evs")).val();
    spreadInfo["SpD"]["boost"] = $(spd).find($(".stats.boost")).val();
    spreadInfo["Spe"] = {};
    spreadInfo["Spe"]["IV"] = $(spe).find($(".stats.ivs")).val();
    spreadInfo["Spe"]["EV"] = $(spe).find($(".stats.evs")).val();
    spreadInfo["Spe"]["boost"] = $(spe).find($(".stats.boost")).val();
    //calculate actual stats
    var hpActualStat = calculateHPStat(pokemonInfo,spreadInfo);
    var atkActualStat = calculateAttackStat(pokemonInfo,spreadInfo);
    var defActualStat = calculateDefenseStat(pokemonInfo,spreadInfo);
    var spaActualStat = calculateSpecialAttackStat(pokemonInfo,spreadInfo);
    var spdActualStat = calculateSpecialDefenseStat(pokemonInfo,spreadInfo);
    var speActualStat = calculateSpeedStat(pokemonInfo,spreadInfo);
    $(hp).find($(".stats.actualStat")).text(hpActualStat);
    $(atk).find($(".stats.actualStat")).text(atkActualStat);
    $(def).find($(".stats.actualStat")).text(defActualStat);
    $(spa).find($(".stats.actualStat")).text(spaActualStat);
    $(spd).find($(".stats.actualStat")).text(spdActualStat);
    $(spe).find($(".stats.actualStat")).text(speActualStat);
    return spreadInfo;
}

function refreshMoves(target,pokemon1,pokemon2,pokemon1Spread,pokemon2Spread) {
    if(pokemon1 == null || pokemon2 == null) {
        return;
    }
    var opponentPokemonHP = 0;
    var atkPokemonRawInfo = {};
    var defPokemonRawInfo = {};
    var atkPokemonSpread = {};
    var defPokemonSpread = {};
    if(target.attr("id") == "pokemon1") {
        opponentPokemonHP = calculateHPStat(pokemon2,pokemon2Spread);
        atkPokemonRawInfo = pokemon1;
        defPokemonRawInfo = pokemon2;
        atkPokemonSpread = pokemon1Spread;
        defPokemonSpread = pokemon2Spread;
    } else {
        opponentPokemonHP =  calculateHPStat(pokemon1,pokemon1Spread);
        atkPokemonRawInfo = pokemon2;
        defPokemonRawInfo = pokemon1;
        atkPokemonSpread = pokemon2Spread;
        defPokemonSpread = pokemon1Spread;
    }
    target.find($(".moveSelect")).each(function(i,item) {
        var targetMoveOutID = item.id + "-output";
        if($(item).attr("selectedMove") != null && $(item).attr("selectedMove") != "") {
            var currMoveID = $(item).attr("selectedMove");
            //get field info
            var fieldInfo = {};
            fieldInfo["isCrit"] = $("#" + item.id+"-crit").is(":checked");
            var damageArr = calculate(currMoveID,atkPokemonRawInfo,defPokemonRawInfo,atkPokemonSpread,defPokemonSpread,fieldInfo);
            var lowPercent = parseFloat(parseFloat(damageArr[0] / opponentPokemonHP * 100).toFixed(2));
            var highPercent = parseFloat(parseFloat(damageArr[1] / opponentPokemonHP * 100).toFixed(2));
            var outString = "" + lowPercent + "% - " + highPercent + "% (" 
                    + damageArr[0] + " - " + damageArr[1] + ")";
            $("#" + targetMoveOutID).text(outString);
        } else{
            $("#" + targetMoveOutID).text("0% - 0%");
        }
    });
}