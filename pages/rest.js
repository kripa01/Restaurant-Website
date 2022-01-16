const http = require('http');

function init() {
    const categoryButton = document.getElementById("categoryButton");
    categoryButton.onclick = handleCategoryButton;

    const itemButton = document.getElementById("itemButton");
    itemButton.onclick = handleItemButton;
    
    const saveButton = document.getElementById("save");
    saveButton.onclick = handleSaveButton;
}

function handleCategoryButton(){
    const newCategoryName = document.getElementById("newCategory").value;
    const menu = document.getElementById('menu');
    const dropdown = document.getElementById("dropdown");
    let found = false;
    menu.childNodes.forEach(category =>{
        if(category.id === newCategoryName){
            found = true;
        }
    });
    if(!found){
        const newCategory = document.createElement("div");
        const catName = document.createElement("h4");
        catName.innerHTML = newCategoryName;
        newCategory.id = newCategoryName;
        newCategory.appendChild(catName);
        menu.appendChild(newCategory);
        dropdown.options[dropdown.options.length] = new Option(newCategoryName, newCategoryName);
    }
}

function handleItemButton() {
    const dropdown = document.getElementById("dropdown");
    const selection = dropdown.options[dropdown.selectedIndex].value;
    console.log(selection);
    const newItemName = document.getElementById("itemName").value;
    const newItemDescription = document.getElementById("itemDescription").value;
    const newItemPrice = document.getElementById("itemPrice").value;

    const newItem = document.createElement("div");
    newItem.id = newItemName;
    const name = document.createElement("h5");
    const id = document.createElement("p");
    const description = document.createElement("p");
    const price = document.createElement("p");

    name.innerHTML = newItemName;
    id.innerHTML = newItem.id;
    description.innerHTML = newItemDescription;
    price.innerHTML = newItemPrice;

    newItem.appendChild(name);
    newItem.appendChild(description);
    newItem.appendChild(price);

    const category = document.getElementById(selection);
    category.appendChild(newItem);
    
}

function handleSaveButton() {
    const name = document.getElementById('newName').value;
    const minOrder = document.getElementById('newMinOrder').value;
    const delivery = document.getElementById('newDelivery').value;

    let req = new XMLHttpRequest;

    req.onreadystatechange  = function () {
        if(this.status === 200 && this.readyState === 4){
            alert("Save Successful")
        }

    };


    req.open("POST", "http://localhost:3000/updaterestaurant");
    req.send(JSON.stringify({
        name: name,
        min_order: minOrder,
        delivery_fee: delivery,
    }));
}

