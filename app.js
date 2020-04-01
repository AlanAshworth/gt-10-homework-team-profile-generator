const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const render = require("./lib/htmlRenderer");
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
var isManaged = false;
var team = [];

const getTeam = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "role",
        message: "Enter the person's role:",
        choices: () => {
          if (isManaged === false) {
            isManaged = true;
            return ["Manager"];} else {return ["Engineer", "Intern"];}
        }
      },
      {
        type: "input",
        name: "name",
        message: "Enter the person's name:"
      },
      {
        type: "input",
        name: "id",
        message: "Enter the person's ID:"
      },
      {
        type: "input",
        name: "email",
        message: "Enter the person's email address:"
      },
      {
        when: data => data.role === "Manager",
        type: "input",
        name: "officeNumber",
        message: "Enter the person's office number:"
      },
      {
        when: data => data.role === "Engineer",
        type: "input",
        name: "github",
        message: "Enter the person's github username:"
      },
      {
        when: data => data.role === "Intern",
        type: "input",
        name: "school",
        message: "Enter the person's school:"
      }
    ])
    .then(data => {
      if(data.role === "Manager") {
        team.push(new Manager(data.name, data.id, data.email, data.officeNumber));
      } else if(data.role === "Engineer") {
        team.push(new Engineer(data.name, data.id, data.email, data.github));
      } else {
        team.push(new Intern(data.name, data.id, data.email, data.school));
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
        type: "list",
        name: "decision",
        message: "Enter another person?",
        choices: ["yes", "no"]
      }
    ])
    .then(data => {
      if (data.decision === "yes") {
        getTeam();
      } else {
        writeToHTML();
      }
    });
};

const writeToHTML = () => {
  if (!fs.existsSync("./output")) {
    fs.mkdirSync("./output");
  }
  fs.writeFile(outputPath, render(team), error => {
    if (error) throw error;
    console.log("Created successfully");
  });
};

getTeam();
