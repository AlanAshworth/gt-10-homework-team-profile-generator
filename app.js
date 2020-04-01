const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const render = require("./lib/htmlRenderer");
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
var team = [];
var hasManager = false;

const getTeam = () => {
  return inquirer
    .prompt([
      {
        name: "role",
        type: "list",
        message: "Enter the person's role:",
        choices: () => {
          if (!hasManager) {
            hasManager = !hasManager;
            return ["Manager"];
          } else {
            return ["Engineer", "Intern"];
          }
        }
      },
      {
        name: "name",
        type: "input",
        message: "Enter the person's name:"
      },
      {
        name: "id",
        type: "input",
        message: "Enter the person's ID:"
      },
      {
        name: "email",
        type: "input",
        message: "Enter the person's email address:"
      },
      {
        name: "officeNumber",
        type: "input",
        message: "Enter the person's office number:",
        when: data => data.role === "Manager"
      },
      {
        name: "github",
        type: "input",
        message: "Enter the person's github username:",
        when: data => data.role === "Engineer"
      },
      {
        name: "school",
        type: "input",
        message: "Enter the person's school:",
        when: data => data.role === "Intern"
      }
    ])
    .then(data => {
      switch (data.role) {
        case "Manager":
          team.push(new Manager(data.name, data.id, data.email, data.officeNumber));
          break;
        case "Engineer":
          team.push(new Engineer(data.name, data.id, data.email, data.github));
          break;
        case "Intern":
          team.push(new Intern(data.name, data.id, data.email, data.school));
          break;
        default:
          throw new Error("Invalid selection");
      }
      getMember();
    })
    .catch(error => {
      console.log(error);
    });
};

const getMember = () => {
  return inquirer
    .prompt([
      {
        name: "select",
        type: "confirm",
        message: "Enter another person?"
      }
    ])
    .then(data => {
      if (data.select) {
        getTeam();
      } else {
        writeToHTML();
      }
    });
};

const writeToHTML = () => {
  var directory = "./output";
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  fs.writeFile(outputPath, render(team), error => {
    if (error) throw error;
    console.log("Created successfully");
  });
};

getTeam();
