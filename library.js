function serverGet(url, data, doFunction) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if(this.readyState == 4) {
            doFunction(this.responseText);
        }
    }
    
    var dataString = "";
    for(var key in data) {
        dataString += key + "=" + data[key] + "&";
    }
    request.open("GET", url + "?" + dataString);
    request.send();
}

function serverPost(url, data, doFunction) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if(this.readyState == 4) {
            doFunction(this.responseText);
        }
    }

    var dataString = "";
    for(var key in data) {
        dataString += key + "=" + data[key] + "&";
    }

    request.open("POST", url);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send(dataString);
}

function getId(id) {
    return document.getElementById(id);
}

function getClass(className) {
    var array = document.getElementsByClassName(className);
    var newArray = [];

    for(var element of array) {
        newArray.push(element);
    }
    return newArray;
}

function createScript(src) {
    var script = document.createElement("script");
    script.src = src;
    document.body.appendChild(script);
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isStringEmpty(string) {
    for(var i = 0; i < string.length; i++) {
        if(string.charAt(i) != "") return false;
    }
    return true;
}