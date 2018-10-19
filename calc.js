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
    this.value = ui.item.label; 
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
      this.value = ui.item.label; 
      return false;
    },
    minLength:2
});

//Add abilities
function updateAbilities(pokemonInfo) {
    if(pokemonInfo == null) {
        return;
    }
    $(".stats.extraOptions.ability").find("option").remove();
    $(".stats.extraOptions.ability").append($.map(pokemonInfo["Ability"],function(item) {
        return $("<option/>",{
            value:item,
            text:item
        });
    })) ;  
}
$(".ability-trigger").change(function() {
    var currPokemon1ID = $("#pokemon1").find($(".pokemonSelect"))[0].getAttribute("selectedPokemon");
    var currPokemon = pokemon[currPokemon1ID];
    updateAbilities(currPokemon) 
});

//Calc trigger event
$(".calc-trigger").change(function() {
    console.log("Hey Hey Hey Start Dash!");
    //update pokemon stats
    var currPokemon1ID = $("#pokemon1").find($(".pokemonSelect"))[0].getAttribute("selectedPokemon");
    var currPokemon = pokemon[currPokemon1ID];
    refreshPokemon1(currPokemon);
});

function refreshPokemon1(pokemonInfo) {
    if(pokemonInfo == null) {
        return;
    }
    //Change base stats
    var hp = $("#pokemon1").find($(".stats.hp"))[0];
    $(hp).find($(".stats.baseStat")).text(pokemonInfo["BaseStats"][0]);
    var atk = $("#pokemon1").find($(".stats.atk"))[0];
    $(atk).find($(".stats.baseStat")).text(pokemonInfo["BaseStats"][1]);
    var def = $("#pokemon1").find($(".stats.def"))[0];
    $(def).find($(".stats.baseStat")).text(pokemonInfo["BaseStats"][2]);
    var spa = $("#pokemon1").find($(".stats.spa"))[0];
    $(spa).find($(".stats.baseStat")).text(pokemonInfo["BaseStats"][3]);
    var spd = $("#pokemon1").find($(".stats.spd"))[0];
    $(spd).find($(".stats.baseStat")).text(pokemonInfo["BaseStats"][4]);
    var spe = $("#pokemon1").find($(".stats.spe"))[0];
    $(spe).find($(".stats.baseStat")).text(pokemonInfo["BaseStats"][5]);
    //make spreadInfo
    var spreadInfo = {};
    spreadInfo["HP"] = {};
    spreadInfo["HP"]["IV"] = $(hp).find($(".stats.ivs")).val();
    spreadInfo["HP"]["EV"] = $(hp).find($(".stats.evs")).val();

}