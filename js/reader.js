console.log("PokemonDamageCalculator is Running...");

//intercept console.log to read console
var insertScript = 'console.stdlog = console.log.bind(console); \
console.logs = []; \
console.log = function() { \
    console.logs.push(Array.from(arguments)); \
    console.stdlog.apply(console,arguments); \
    console.stdlog("ey"); \
}'
var script = document.createElement("script");
script.textContent = insertScript;
document.body.append(script);
console.log("hey");


// function read() {
//     console.log("hey hey hey start dash");
//     var battleRoom = document.getElementsByClassName("ps-room ps-room-opaque");
//     if(battleRoom.length > 0) { // if there is an active battle

//     }
// }

// var readInterval = setInterval(read,1000);

