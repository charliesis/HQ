const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient({
    keyFilename: './gCloudKey.json'
  });

const parameter = 'https://timedotcom.files.wordpress.com/2017/11/171116-trivia-game-win-money-hq-2.png';
function getText(parameter, cb){
    if(parameter == undefined) return undefined;
    client
        .textDetection(parameter)
        .then(results => {
            try {
                const detections = results[0].textAnnotations;
                const args = detections[0].description.split('\n');
                var question = '';
                var answers = [];
                var startQuestion = false;
                var startAnswer = false;
                var nAnswers = 0;
                args.forEach(element => {
                    //console.log(element);
                    if(startAnswer && nAnswers < 3){
                        answers.push(element);
                        nAnswers++;
                    }
                    if(startQuestion){
                        question += element;
                        if(element.includes('?')){
                            startQuestion = false;
                            startAnswer = true;
                            answers.push(question);
                        }
                    }
                    if(element == 'HO' && !startQuestion){ //Add better detection
                        startQuestion = true;
                    }   
                });
                answers.forEach(answer =>{
                    console.log(answer);
                });
                cb(answers);
            } catch (error) {
                console.log(error);
            }
        });
}

function getSearch(question){
    var number = [0, 0 ,0];
    var request = unirest('GET', 'https://www.googleapis.com/customsearch/v1?key=AIzaSyBb-99K_jEttIhwmRg3qXdUfe2rNA7r6Qg&cx=015138063024239997121:qljuy5-7-cg&q=' + question[0]);
    request.end(function (result){
        var string = JSON.parse(result.raw_body);
        string.items.forEach(element => {
            for(var i = 1; i < 4; i++){
                if(element.snippet.includes(question[i])){
                    number[i-1]++;
                }
            }
            console.log('-------------------------');   
            console.log(question[1] + ": " + number[0]);
            console.log(question[2] + ": " + number[1]);
            console.log(question[3] + ": " + number[2]);
        });
    });
}


'use strict';

let https = require('https');
let subscriptionKey = '9a78d9b1d1da49bea52e22e2eea22974';
let host = 'api.cognitive.microsoft.com';
let path = '/bing/v7.0/search';

let response_handler = function (response) {
    let body = '';
    response.on('data', function (d) {
        body += d;
    });
    response.on('end', function () {
        console.log('\nRelevant Headers:\n');
        for (var header in response.headers)
            // header keys are lower-cased by Node.js
            if (header.startsWith("bingapis-") || header.startsWith("x-msedge-"))
                 console.log(header + ": " + response.headers[header]);
        body = JSON.stringify(JSON.parse(body), null, '  ');
        console.log('\nJSON Response:\n');
        var string = JSON.parse(body);
        console.log(body);
        var number = [0, 0, 0];
        string.webPages.value.forEach(element => {
            
            for(var i = 1; i < 4; i++){
                if(element.snippet.includes(gQuestion[i]) || element.snippet.includes(gQuestion[i].toLowerCase())){
                    number[i-1]++;
                }
            }
            console.log('-------------------------');   
            console.log(gQuestion[1] + ": " + number[0]);
            console.log(gQuestion[2] + ": " + number[1]);
            console.log(gQuestion[3] + ": " + number[2]);
        })
    });
    response.on('error', function (e) {
        console.log('Error: ' + e.message);
    });
};

let bing_web_search = function (search) {
  let request_params = {
        method : 'GET',
        hostname : host,
        path : path + '?q=' + encodeURIComponent(search),
        headers : {
            'Ocp-Apim-Subscription-Key' : subscriptionKey,
        }
    };

    let req = https.request(request_params, response_handler);
    req.end();
}


var gQuestion;


getText(parameter, (question) => {
    //getSearch(question);
    gQuestion = question;
    if (subscriptionKey.length === 32) {
        bing_web_search(question[0]);
    } else {
        console.log('Invalid Bing Search API subscription key!');
        console.log('Please paste yours into the source code.');
    }
});
