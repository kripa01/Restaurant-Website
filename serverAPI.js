const express = require('express');
const pug = require('pug');
const {uuid} = require('uuidv4');
const fs = require('fs');
let app = express();

app.set("view engine", "pug");
app.set("views",  "./pages");

app.use(express.static("public"));

app.get("/restaurants", logger, getRest);
app.get("/addrestaurant", logger, addRest);
app.get("/restaurants/:restID", logger, getRestByID);
app.get("/addrest", logger, serveAddRest);
app.get("/rest", logger, serveRest);
app.post("/restaurants", logger , newRest);
app.put("/restaurants/:restID", logger, updateRest);
app.post("/updaterestaurant", logger, update);


function logger(req, res, next) {
    console.log("method: " + req.method);
    console.log("URL: " + req.url);
    console.log(req.query);
    next();
}

function serveAddRest(req,res,next) {
    fs.readFile('./pages/addRest.js',function(err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write('Error 404: Resource not found.');
            res.end();
        } else {
            res.writeHead(200, {'Content-Type': 'application/javascript'});
            res.end(data);
        }
    });
}
function serveRest(req,res,next) {
    fs.readFile('./pages/rest.js',function(err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write('Error 404: Resource not found.');
            res.end();
        } else {
            res.writeHead(200, {'Content-Type': 'application/javascript'});
            res.end(data);
        }
    });
}

function newRest(req,res,next) {
    let body = "";
    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', () =>{
        console.log(body);
        const newRest = JSON.parse(body);

        if(newRest.name !== null && newRest.min_order !== null && newRest.delivery_fee !== null){

            let tempRest = {
                "id": uuid(),
                "name": newRest.name,
                "min_order": newRest.min_order,
                "delivery_fee": newRest.delivery_fee,
                "menu": {}
            };
            fs.writeFileSync("./restaurants/"+ newRest.name +".json", JSON.stringify(tempRest));

            res.status(200);
            res.write(JSON.stringify(tempRest));
            res.end();

        }

    });

}

function getRest(req, res, next){
    const restaurants = fs.readdirSync("./restaurants"); //get list of restaurants
    let restaurantData = [];
    restaurants.forEach( rest =>{
        const restaurant = fs.readFileSync("./restaurants/"+ rest, "utf8" );
        restaurantData.push(JSON.parse(restaurant));
    });

    res.format({
        "text/html": () =>{
            res.render("getRest.pug", {restaurantData});
            res.end();
        },
        "application/json": () =>{
            let ids = [];
            restaurantData.forEach( rest =>{
                ids.push(rest.id);
            });
            res.write(JSON.stringify({"restaurants": ids}));
            res.end();
        }
    });

}

function getRestByID(req,res,next) {
    const id = req.url.split("/")[2];
    console.log(id);
    const restaurants = fs.readdirSync("./restaurants");
    let restaurantData = [];
    restaurants.forEach( restName =>{
        const restaurant = fs.readFileSync("./restaurants/"+ restName, "utf8" );
        restaurantData.push(JSON.parse(restaurant));
    });


    restaurantData.forEach(rest =>{
        console.log(rest.id);
        if(rest.id.toString() === id){
            console.log("found rest");
            res.format({
                "text/html": () =>{
                    res.render("rest.pug", {rest});
                    res.end();
                },
                "application/json": () =>{
                    res.write(JSON.stringify(rest));
                    res.end();
                }
            })
        }
    })


}
function updateRest(req,res,next) {
    const id = req.url.split("/")[2];
    const restaurants = fs.readdirSync("./restaurants");
    let body = "";

    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', () => {

        const data = JSON.parse(body);
        restaurants.forEach( restName =>{
            const restaurant = fs.readFileSync("./restaurants/"+ restName, "utf8" );
            if (restaurant.id.toString() === id){
                fs.writeFileSync("/restaurants/" + restName, JSON.stringify(data));
                res.status(200);
                res.end();
            }
        });
        res.status(404);
        res.end();
    });

}

function update(req, res, next) {
    res.status(200);
    res.end();
}

function addRest(req,res,next){
    res.render("addRest.pug", {});
    res.end();
}



//-----------Server Start------------

app.listen(3000);
console.log("server is listening at http://localhost:3000");

