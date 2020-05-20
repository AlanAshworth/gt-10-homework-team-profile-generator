const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const Manager = require("./Manager");
const Engineer = require("./Engineer");
const Intern = require("./Intern");
const render = require("./htmlRenderer");
const OUTPUT_DIR = path.resolve(__dirname, "../output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

class TeamBuilder {
  constructor() {
    this.team = [];
    this.hasManager = false;
  }

  start() {
    this.getEmployee();
  }

  getEmployee = () => {
    return inquirer
      .prompt([
        {
          name: "role",
          type: "list",
          message: "Enter the person's role:",
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
          message: "Enter the person's name:",
        },
        {
          name: "id",
          type: "input",
          message: "Enter the person's ID:",
        },
        {
          name: "email",
          type: "input",
          message: "Enter the person's email address:",
        },
        {
          name: "officeNumber",
          type: "input",
          message: "Enter the person's office number:",
          when: ({ role }) => role === "Manager",
        },
        {
          name: "github",
          type: "input",
          message: "Enter the person's github username:",
          when: ({ role }) => role === "Engineer",
        },
        {
          name: "school",
          type: "input",
          message: "Enter the person's school:",
          when: ({ role }) => role === "Intern",
        },
      ])
      .then(({ role, name, id, email, officeNumber, github, school }) => {
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
            // throw new Error("Invalid role.");
            break;
        }
        console.log(`Team: `, this.team);
        this.askForNewMember();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  askForNewMember = () => {
    return inquirer
      .prompt([
        {
          name: "choice",
          type: "confirm",
          message: "Enter another person?",
          default: true,
        },
      ])
      .then(({ choice }) => {
        if (choice) {
          this.getEmployee();
        } else {
          this.writeToHTML();
        }
      });
  };

  writeToHTML = () => {
    if (!fs.existsSync("../output")) {
      fs.mkdirSync("../output");
    }
    fs.writeFile(outputPath, render(this.team), (error) => {
      if (error) throw error;
      console.log("Created successfully");
    });
  };
}

// class TeamBuilder {
//   constructor() {
//     this.team = [];
//     this.hasManager = false;
//   }

//   start() {
//     this.getEmployee();
//   }

//   getEmployee = async () => {
//     try {
//       const {
//         role,
//         name,
//         id,
//         email,
//         officeNumber,
//         github,
//         school,
//       } = await inquirer.prompt([
//         {
//           name: "role",
//           type: "list",
//           message: "Enter the person's role:",
//           choices: () => {
//             if (!this.hasManager) {
//               this.hasManager = !this.hasManager;
//               return ["Manager"];
//             } else {
//               return ["Engineer", "Intern"];
//             }
//           },
//         },
//         {
//           name: "name",
//           type: "input",
//           message: "Enter the person's name:",
//         },
//         {
//           name: "id",
//           type: "input",
//           message: "Enter the person's ID:",
//         },
//         {
//           name: "email",
//           type: "input",
//           message: "Enter the person's email address:",
//         },
//         {
//           name: "officeNumber",
//           type: "input",
//           message: "Enter the person's office number:",
//           when: ({ role }) => role === "Manager",
//         },
//         {
//           name: "github",
//           type: "input",
//           message: "Enter the person's github username:",
//           when: ({ role }) => role === "Engineer",
//         },
//         {
//           name: "school",
//           type: "input",
//           message: "Enter the person's school:",
//           when: ({ role }) => role === "Intern",
//         },
//       ]);
//       switch ({ role }) {
//         case "Manager":
//           this.team.push(new Manager({ name, id, email, officeNumber }));
//           break;
//         case "Engineer":
//           this.team.push(new Engineer({ name, id, email, github }));
//           break;
//         case "Intern":
//           this.team.push(new Intern({ name, id, email, school }));
//           break;
//         default:
//           throw new Error("Invalid role.");
//       }
//       this.askForNewMember();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   askForNewMember = async () => {
//     const { choice } = await inquirer.prompt([
//       {
//         name: "choice",
//         type: "confirm",
//         message: "Enter another person?",
//         default: false,
//       },
//     ]);
//     if ({ choice }) {
//       this.getEmployee();
//     } else {
//       this.writeToHTML();
//     }
//   };

//   writeToHTML = () => {
//     if (!fs.existsSync("../output")) {
//       fs.mkdirSync("../output");
//     }
//     fs.writeFile(outputPath, render(this.team), (error) => {
//       if (error) throw error;
//       console.log("Created successfully");
//     });
//   };
// }

module.exports = TeamBuilder;
