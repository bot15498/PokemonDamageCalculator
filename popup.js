
//When DOM is completely loaded, get the showdown div and wait for click to open showdown
document.addEventListener('DOMContentLoaded', function () {

    document.getElementById("showdown").addEventListener('click', function () {
        var url = "https://play.pokemonshowdown.com/";
        window.open(url);
    });
});