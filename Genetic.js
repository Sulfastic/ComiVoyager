
/***********************/
/*       GLOBALS       */
/***********************/

var edges = {};
var nodes = [];
var nrOfCities = 50;
var nrOfMutations = 10000;

/***********************/

var Edge = function (node1, node2, weight) {
    this.node1 = node1;
    this.node2 = node2;
    this.weight = weight;
};

var Node = function (name) {
    this.name = name;
};

var addEdge = function (node1, node2, weight) {
    if (!edges[node1]) edges[node1] = [];
    if (!edges[node2]) edges[node2] = [];

    edges[node1].push(new Edge(node1, node2, weight));
    edges[node2].push(new Edge(node2, node1, weight));
};

var addNode = function (name) {
    nodes.push(new Node(name));
};

var getRandomDistance = function () {
    return Math.floor((Math.random() * 1000) + 1);
};

var getRandomIndex = function () {
    return Math.floor((Math.random() * nrOfCities));
};

var getRandomIndexes = function () {
    var indexA = getRandomIndex();
    var indexB = getRandomIndex();

    while (indexA === indexB) {
        indexB = getRandomIndex();
    }

    return [indexA, indexB];
};

var addCities = function () {
    for (var i = 0; i < nrOfCities; i++) {
        addNode("m" + i);
    }

    for (i = 0; i < nrOfCities; i++) {
        for (var j = i; j < nrOfCities; j++) {
            if (i !== j) {
                addEdge("m" + i, "m" + j, getRandomDistance());
            }
        }
    }
};

/***********************/
/*  Shuffle Algorythm  */
/***********************/

var shuffle = function (a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
};

/***********************/

var prepareInitialCitiesOrder = function () {
    var newOrder = JSON.parse(JSON.stringify(nodes));
    shuffle(newOrder);

    return newOrder;
};

var getEdge = function (name, nextNode) {
    var nodeEdges = edges[name];
    for (var i = 0; i < nodeEdges.length; i++) {
        if (nodeEdges[i].node2 === nextNode) {
            return nodeEdges[i];
        }
    }
};

var calculateDistance = function (citiesOrder) {
    var distance = 0;
    for (var i = 0; i < nrOfCities - 1; i++) {
        var edge = getEdge(citiesOrder[i].name, citiesOrder[i + 1].name);
        distance += edge.weight;
    }

    return distance;
};

var inverse = function (cities, indexes) {
    var city = JSON.parse(JSON.stringify(cities[indexes[0]]));
    cities[indexes[0]] = cities[indexes[1]];
    cities[indexes[1]] = city;
};

var printCitiesOrder = function (name, cities, way) {
    var output = "";
    for (var i = 0; i < nrOfCities; i++) {
        output += cities[i].name;
        if(i !== (nrOfCities - 1)) {
            output += "->";
        }
    }

    var cityName = document.createElement("h2");
    cityName.appendChild(document.createTextNode(name));

    var order = document.createElement("p");
    order.appendChild(document.createTextNode(output));

    var distance = document.createElement("p");
    distance.appendChild(document.createTextNode("distance: " + way));

    var element = document.getElementById("attach");
    element.appendChild(cityName);
    element.appendChild(order);
    element.appendChild(distance);

    console.log(name, cities, edges, way);
};

/*****************************/
/*  THE ACTUAL CALCULATIONS  */
/*****************************/

var twoElementGeneticStrategy = function () {
    var parent = prepareInitialCitiesOrder();
    var parentDistance = calculateDistance(parent);

    printCitiesOrder("parent", parent, parentDistance);

    var child = JSON.parse(JSON.stringify(parent));
    var childDistance = 0;

    for (var i = 0; i < nrOfMutations; i++) {

        var indexes = getRandomIndexes();
        inverse(child, indexes);

        parentDistance = calculateDistance(parent);
        childDistance = calculateDistance(child);

        if (childDistance < parentDistance) {
            parent = JSON.parse(JSON.stringify(child));
            child = JSON.parse(JSON.stringify(parent));
        } else {
            inverse(child, indexes);
        }
    }

    printCitiesOrder("last mutation", parent, parentDistance);
};

/*****************************/

//methods invoke
addCities();
twoElementGeneticStrategy();

