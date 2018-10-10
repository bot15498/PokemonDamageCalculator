var items = document.getElementsByClassName("calc-trigger");
items.forEach(addEventListener("change", updateCalculations));
updateCalculations();

function updateCalculations() {
    console.log("test");
}
