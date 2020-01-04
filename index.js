var axios = require("axios");
var inquirer = require("inquirer");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var fs = require("fs");

inquirer
  .prompt([
    {
      type: "list",
      name: "main",
      choices: ["Spotify", "OMDB", "Bands in Town", "Random", "EXIT"],
      message: "What API would you like to search?"
    }
  ])
  .then(answers => {
    if (answers.main === "Spotify") {
      var spotify = new Spotify({
        id: "c7578beca0c04be6a6bcf16e565d2155",
        secret: "5afa56d76840464ba89ba07bf7ac8166"
      });
      inquirer
        .prompt([
          {
            type: "input",
            message: "Enter a song:",
            name: "songName"
          }
        ])
        .then(answers => {
          spotify.search({ type: "track", query: answers.songName }, function(
            err,
            data
          ) {
            if (err) {
              return console.log("Error occurred: " + err);
            }
            console.log("=-=-=-=");
            console.log("Song: " + data.tracks.items[0].name);
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Link: " + data.tracks.items[0].external_urls.spotify);
            console.log("=-=-=-=");
          });
        });
    }
    if (answers.main === "Bands in Town") {
      inquirer
        .prompt([
          {
            type: "input",
            message: "Enter an artist/group to search for their next event:",
            name: "artistName"
          }
        ])
        .then(answers => {
          axios
            .get(
              "https://rest.bandsintown.com/artists/" +
                answers.artistName +
                "/events?app_id=codingbootcamp"
            )
            .then(function(response) {
              if (response.data.length >= 1) {
                console.log(response.data);
                console.log("=-=-=-=");
                console.log(response.data[0].venue.name);
                console.log(response.data[0].venue.city);
                date = response.data[0].datetime.split("T");
                date = date[0];
                date = moment(date).format("DD/MM/YYYY");
                console.log(date);
                console.log("=-=-=-=");
              } else {
                console.log("=-=-=-=");
                console.log(answers.artistName + " has no scheduled events");
                console.log("=-=-=-=");
              }
            });
        });
    }
    if (answers.main === "OMDB") {
      inquirer
        .prompt([
          {
            type: "input",
            message: "Enter a movie:",
            name: "movieName"
          }
        ])
        .then(answers => {
          axios
            .get(
              "http://www.omdbapi.com/?apikey=trilogy&plot=full&t=" +
                answers.movieName
            )
            .then(function(response) {
              console.log("=-=-=-=");
              console.log("Title: " + response.data.Title);
              console.log("Year: " + response.data.Year);
              console.log("IMDB: " + response.data.Ratings[0].Value);
              rt =
                response.data.Ratings.length > 1
                  ? "Rotten Tomatoes: " + response.data.Ratings[1].Value
                  : "Rotten Tomatoes: N/A";
              console.log(rt);
              console.log("Country: " + response.data.Country);
              console.log("Language: " + response.data.Language);
              console.log("=-=-=-=");
              console.log("Plot: " + response.data.Plot);
              console.log("=-=-=-=");
              console.log("Actors: " + response.data.Actors);
              console.log("=-=-=-=");
            });
        });
    }
  });
