var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database:"TopSongsDB"
});

connection.connect(function(err) {
    if (err) throw err;
    runSearch();
});


var runSearch = function () {
    inquirer.prompt({
        name:"action",
        type: "rawlist",
        message: "What would you like to do?",
        choices:[
            "Find Song by artist?",
            "Find all artists who appear more than once?",
            "Find data with a specific range?",
            "Search for a specific song?",
            "Find artists with a top song and top album in the same year?"

        ]
    }).then(function (answer) {

        switch (answer.action){
            case "Find Song by artist?":
                artistSearch();
            break;

            case "Find all artists who appear more than once?":
                multiSearch();
            break;

            case "Find data with a specific range?":
                rangeSearch();
            break;

            case "Search for a specific song?":
                songSearch();
            break;

            case "Find artists with a top song and top album in the same year?":
                songAndAlbumSearch();
            break;
        }
    })
};

var artistSearch = function () {
    inquirer.prompt({
        name:"artist",
        type: "input",
        message: "What artist would you like to search for?",
    }).then(function (answer) {
        var query = "SELECT position, song, year FROM top5000 WHERE ?";
        connection.query(query,{artist:answer.artist}, function (err,res) {
            for (var i = 0 ; i < res.length; i++){
                console.log("Position: " + res[i].position+"\nSong: " + res[i].song+"\nYear: "+res[i].year+"\n=====================\n");
            }
            runSearch();
        })
    })
};

var multiSearch = function () {
    inquirer.prompt({
        name:"number",
        type:"input",
        message:"How many songs must the artist have on the list?"
    }).then(function (answer) {
        query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > "+answer.number;
        connection.query(query,function (err,res) {
            for (var i = 0 ; i < res.length; i++){
                console.log(res[i].artist);
            }
            runSearch();
        })
    })

};

var rangeSearch = function() {
    inquirer.prompt([{
        name    : "start",
        type    : "input",
        message : "Enter starting position: ",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }, {
        name    : "end",
        type    : "input",
        message : "Enter ending position: ",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }

    }]).then (function (answer) {
        var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
        connection.query(query, [answer.start, answer.end], function(err, res) {
            for (var i = 0; i < res.length; i ++) {
                console.log(
                    "Position: " + res[i].position + "\nSong: " + res[i].song + "\nArtist: " + res[i].artist + "\nYear: " + res[i].year+"\n=====================\n");
            }
            runSearch();
        })
    })
};

var songSearch = function() {
    inquirer.prompt({
        name   : "song",
        type   : "input",
        message: "What song would you like to look for?"
    }).then(function(answer) {
        console.log(answer.song);
        var query = "SELECT * FROM top5000 WHERE ?";
        connection.query(query,{song: answer.song}, function (err,res) {
            for(i = 0; i < res.length; i++){
                console.log(
                    "Position: " + res[i].position + "\nSong: " + res[i].song + "\nArtist: " + res[i].artist + "\nYear: " + res[i].year+"\n=====================\n");
            }
            runSearch();
        })
    })
};

var songAndAlbumSearch = function() {
    inquirer.prompt({
        name: "artist",
        type: "input",
        message: "What artist would you like to search for?"
    }).then(function(answer) {
        var query = "SELECT TopAlbums.year, TopAlbums.album, TopAlbums.position, top5000.song, top5000.artist ";
        query += "FROM TopAlbums INNER JOIN top5000 ON (TopAlbums.artist = top5000.artist AND TopAlbums.year ";
        query += "= top5000.year) WHERE (TopAlbums.artist = ? AND top5000.artist = ?) ORDER BY TopAlbums.year ";

        connection.query(query, [answer.artist, answer.artist], function(err, res) {
            console.log(res.length + " matches found!");
            for (var i = 0; i < res.length; i++) {
                console.log("Album Position: " + res[i].position + " || Artist: " + res[i].artist + " || Song: "
                    + res[i].song + " || Album: " + res[i].album + " || Year: " + res[i].year);
            }

            runSearch();
        });
    });
};

