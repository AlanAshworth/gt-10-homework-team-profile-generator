const logo = require("asciiart-logo");
const config = require("./package.json");
const TeamBuilder = require("./lib/TeamBuilder");

const longText =
  "A Node CLI that takes in information about employees and generates an HTML webpage that displays summaries for each person.";

console.log(
  logo({
    name: "Team Profile Generator",
    font: "Small Slant",
    lineChars: 10,
    padding: 2,
    margin: 3,
    borderColor: "white",
    logoColor: "bold-red",
    textColor: "red",
  })
    .emptyLine()
    .right("version 1.0.0")
    .emptyLine()
    .center(longText)
    .render()
);

const teamBuilder = new TeamBuilder();
teamBuilder.start();
