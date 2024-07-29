const Rover = require("../rover.js");
const Message = require("../message.js");
const Command = require("../command.js");

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.

describe("Rover class", function () {
  test("constructor sets position and default values for mode and generatorWatts", function () {
    let rover = new Rover(98382);
    expect(rover.position).toEqual(98382);
    expect(rover.mode).toEqual("NORMAL");
    expect(rover.generatorWatts).toEqual(110);
  });
  test("response returned by receiveMessage contains the name of the message", function () {
    let rover = new Rover(98382);
    let message = new Message("Test message");
    let response = rover.receiveMessage(message).message;
    expect(response).toEqual(message.name);
  });
  test("response returned by receiveMessage includes two results if two commands are sent in the message", function () {
    let rover = new Rover(98382);
    let commands = [
      new Command("MODE_CHANGE", "LOW_POWER"),
      new Command("STATUS_CHECK"),
    ];
    let message = new Message("Test message with two commands", commands);
    let response = rover.receiveMessage(message).results.length;
    expect(response).toEqual(2);
  });
  test("responds correctly to the status check command", function () {
    let rover = new Rover(87382098);
    let commands = [new Command("STATUS_CHECK")];
    let message = new Message("Test STATUS_CHECK", commands);
    let response = rover.receiveMessage(message).results[0];
    let roverStatus = {
      completed: true,
      roverStatus: {
        mode: 'NORMAL',
        generatorWatts: 110,
        position: 87382098,
      },
    };
    expect(response).toEqual(roverStatus);
  });
  test("responds correctly to the mode change command", function () {
    let rover = new Rover(98382);
    let commands = [new Command("MODE_CHANGE", "LOW_POWER")];
    let message = new Message("Test MODE_CHANGE and completed property", commands);
    let response = rover.receiveMessage(message);
    expect(rover.mode).toEqual("LOW_POWER");
    expect(response.results[0].completed).toBeTruthy();
  });
  test("responds with a false completed value when attempting to move in LOW_POWER mode", function () {
    let rover = new Rover(98382);
    let commands = [
      new Command("MODE_CHANGE", "LOW_POWER"),
      new Command("MOVE", 5),
    ];
    let message = new Message("Test LOW_POWER mode to see if it responds with false when trying to move", commands);
    let response = rover.receiveMessage(message);
    expect(rover.mode).toEqual("LOW_POWER");
    expect(response.results[0].completed).toBeTruthy();
    expect(rover.position).toEqual(98382);
    expect(response.results[1].completed).toBeFalsy();
  });
  test("responds with the position for the move command", function () {
    let rover = new Rover(98382);
    let commands = [new Command("MOVE", 15)];
    let message = new Message("Test move command", commands);
    let response = rover.receiveMessage(message);
    expect(rover.position).toEqual(15);
  });
});
