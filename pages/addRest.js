const http = require('http');

function init() {
    console.log("in init function");
    const addRestButton = document.getElementById("addButton");
    addRestButton.onclick = handleAddButton;
}

function handleAddButton() {

    const name = document.getElementById("name").value;
    const minOrder = document.getElementById("minOrder").value;
    const delivery = document.getElementById("delivery").value;

    let newRest = {
        "name": name,
        "min_order": minOrder,
        "delivery_fee": delivery,
    };

    let req = new XMLHttpRequest;

    req.onreadystatechange  = function () {
        if(this.status === 200 && this.readyState === 4){}
        console.log(req.responseText);
    };


    req.open("POST", "http://localhost:3000/restaurants");
    req.send(JSON.stringify(newRest));

}
