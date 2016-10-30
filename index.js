// Requires
var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser')


console.log(process.env.LIFX)
// Setup
// setup template engine
app.set('view engine', 'ejs');
app.use(express.static('./public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// State Variables
var options = {
    url: undefined,
    headers: {
        'Authorization': 'Bearer ' + process.env.LIFX
    }
};
var isBuzzing = false;

// API Endpoints

app.get('/', function(req, res) {
    options.url = "https://api.lifx.com/v1/lights/all/state";
    options.method = "PUT"
    options.json = {
        power: "on",
        color: "white",
    }

    request.put(options, function(error, response, body) {
        if (error) {
            console.log("ERROR");
            return;
        }
        const status = body.results[0].status;
        if (status === "ok") {
            console.log('SUCCESS');
            res.render('index');
        }
    });
});

app.post('/buzz', function(req, res) {
    if (isBuzzing) {
        return;
    }
    isBuzzing = true;
    buzz(req, res);
    setTimeout(function() {
        isBuzzing = false;
    }, 1500);
});

function buzz(req, res) {
    options.url = 'https://api.lifx.com/v1/lights/all/effects/pulse';
    const rgbColor = req.body.color;
    const colorArray = rgbColor.match(/\d+/g);
    const requestColorString = 'rgb:' + colorArray[0] + ',' + colorArray[1] + ',' + colorArray[2];

    body = {
        color: requestColorString,
        cycles: 2,
        period: .5,
        power_on: true
    }
    var pulseOptions = {
        method: 'post',
        body: body,
        json: true,
        url: options.url,
        headers: options.headers
    }
    request.post(pulseOptions, function(error, response, body) {
        if (error) {
            console.log("ERROR");
            res.sendStatus(500)
        }
        console.log('success');
        // @todo, respond to the client that the timer happened
        res.sendStatus(200)

    });
}




// Listen
app.listen(3000);
console.log('Buzzer Running!')
