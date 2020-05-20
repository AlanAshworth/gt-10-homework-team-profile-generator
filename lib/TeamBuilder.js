const inquirer = require("inquirer");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const OUTPUT_DIR = path.resolve(__dirname, "../output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const Manager = require("./Manager");
const Engineer = require("./Engineer");
const Intern = require("./Intern");
const render = require("./htmlRenderer");

class TeamBuilder {
  constructor() {
    this.team = [];
    this.hasManager = false;
  }

  static isValidEmail = (email) => {
    return /^([a-z0-9_\.\+-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(email);
  };

  start() {
    this.getEmployee();
  }

  getEmployee = async () => {
    try {
      const {
        role,
        name,
        id,
        email,
        officeNumber,
        github,
        school,
      } = await inquirer.prompt([
        {
          name: "role",
          type: "list",
          message: "Enter role:",
          choices: () => {
            if (!this.hasManager) {
              this.hasManager = !this.hasManager;
              return ["Manager"];
            } else {
              return ["Engineer", "Intern"];
            }
          },
        },
        {
          name: "name",
          type: "input",
          message: "Enter name:",
        },
        {
          name: "id",
          type: "input",
          message: "Enter ID:",
        },
        {
          name: "email",
          type: "input",
          message: "Enter email address:",
          transformer: (input, answer) =>
            TeamBuilder.isValidEmail(input)
              ? chalk.green(input)
              : chalk.red(input),
          validate: (val) =>
            TeamBuilder.isValidEmail(val) || "Invalid email address.",
        },
        {
          name: "officeNumber",
          type: "input",
          message: "Enter Manager's office number:",
          when: ({ role }) => role === "Manager",
        },
        {
          name: "github",
          type: "input",
          message: "Enter Engineer's github username:",
          when: ({ role }) => role === "Engineer",
        },
        {
          name: "school",
          type: "input",
          message: "Enter Intern's school:",
          when: ({ role }) => role === "Intern",
        },
      ]);
      switch (role) {
        case "Manager":
          this.team.push(new Manager(name, id, email, officeNumber));
          break;
        case "Engineer":
          this.team.push(new Engineer(name, id, email, github));
          break;
        case "Intern":
          this.team.push(new Intern(name, id, email, school));
          break;
        default:
          console.log("Invalid role.");
          break;
      }
      console.log(`Team: `, this.team);
      this.askForNewMember();
    } catch (error) {
      console.log(error);
    }
  };

  askForNewMember = async () => {
    const { choice } = await inquirer.prompt([
      {
        name: "choice",
        type: "confirm",
        message: "Enter another member?",
        default: true,
      },
    ]);
    if (choice) {
      this.getEmployee();
    } else {
      this.endTeamBuilder();
    }
  };

  endTeamBuilder = () => {
    TeamBuilder.writeToHTML(render(this.team));
  };

  static writeToHTML = (html) => {
    if (!fs.existsSync("../output")) {
      fs.mkdirSync("../output");
    }
    fs.writeFile(outputPath, html, (error) => {
      if (error) throw error;
      console.log(`${outputPath} written.`);
    });
  };
}

module.exports = TeamBuilder;
