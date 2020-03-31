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
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!
// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.
// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.
// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work!```
buildTeam();

function buildTeam() {
  getManager();
  getTeam();
}

function getManager() {
  return inquirer
    .prompt([
      {
        name: "role",
        type: "input",
        message: "Plase add a team manager. What is the manager's name?"
      },
      {
        name: "id",
        type: "input",
        message: "What is the manager's ID?"
      },
      {
        name: "email",
        type: "input",
        message: "What is the manager's email address?"
      },
      {
        name: "officeNumber",
        type: "input",
        message: "What is the manager's office number?"
      }
    ])
    .then(data => {
      team.push(new Manager(data.name, data.id, data.email, data.officeNumber));
    })
    .catch(error => {
      console.log(error);
    });
}

function getTeam() {
  return inquirer
    .prompt([
      {
        name: "role",
        type: "list",
        message: "Plase add a team role. What role would you like to add?",
        choices: ["Engineer", "Intern"]
      },
      {
        name: "id",
        type: "input",
        message: "What is the team member's ID?"
      },
      {
        name: "email",
        type: "input",
        message: "What is the team member's email address?"
      },
      {
        name: "github",
        type: "input",
        message: "What is the engineer's github username?",
        when: data => data.role === "Engineer"
      },
      {
        name: "school",
        type: "input",
        message: "What is the interns's school?",
        when: data => data.role === "Intern"
      }
    ])
    .then(data => {
      if (data.role === "Engineer") {
        team.push(new Engineer(data.name, data.id, data.email, data.github));
      } else {
        team.push(new Intern(data.name, data.id, data.email, data.school));
      }
      addMember();
    })
    .catch(error => {
      console.log(error);
    });
}

function addMember() {
  inquirer
    .prompt([
      {
        name: "addMember",
        type: "list",
        message: "Would you like to add another member?",
        choices: ["yes", "no"]
      }
    ])
    .then(data => {
      if (data.addMember === "yes") {
        this.getTeam();
      } else {
        fs.writeFile(outputPath, render(team), error => {
          if (error) {
            throw error;
          } else {
            console.log("Successfully created ", outputPath);
          }
        });
      }
    });
}
