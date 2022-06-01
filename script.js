"use strict";

let rlSync = require("readline-sync");

function prompt(message) {
  console.log(`=> ${message}`);
}

let cards = [
  ["H", "2"],
  ["H", "3"],
  ["H", "4"],
  ["H", "5"],
  ["H", "6"],
  ["H", "7"],
  ["H", "8"],
  ["H", "9"],
  ["H", "10"],
  ["H", "J"],
  ["H", "Q"],
  ["H", "K"],
  ["H", "A"],
  ["D", "2"],
  ["D", "3"],
  ["D", "4"],
  ["D", "5"],
  ["D", "6"],
  ["D", "7"],
  ["D", "8"],
  ["D", "9"],
  ["D", "10"],
  ["D", "J"],
  ["D", "Q"],
  ["D", "K"],
  ["D", "A"],
  ["C", "2"],
  ["C", "3"],
  ["C", "4"],
  ["C", "5"],
  ["C", "6"],
  ["C", "7"],
  ["C", "8"],
  ["C", "9"],
  ["C", "10"],
  ["C", "J"],
  ["C", "Q"],
  ["C", "K"],
  ["C", "A"],
  ["S", "2"],
  ["S", "3"],
  ["S", "4"],
  ["S", "5"],
  ["S", "6"],
  ["S", "7"],
  ["S", "8"],
  ["S", "9"],
  ["S", "10"],
  ["S", "J"],
  ["S", "Q"],
  ["S", "K"],
  ["S", "A"],
];
//--------------------------------- Total -------------------------

function total(array) {
  let values = array.map((card) => card[1]);

  let sum = 0;
  values.forEach((value) => {
    if (value === "A") {
      sum += 11;
    } else if (["J", "Q", "K"].includes(value)) {
      sum += 10;
    } else {
      sum += Number(value);
    }
  });

  values
    .filter((value) => value === "A")
    .forEach((_) => {
      if (sum > winningNum) sum -= 10;
    });

  return sum;
}

//--------------------------------- bust function -------------------------

let bust = function () {
  return total(playerCards) > winningNum;
};

//--------------------------------- hit or stay repeat -------------------------
let playerTurn;

let playerChoosing = function () {
  while (true) {
    prompt("Would you like to (h)it or (s)tay?");
    playerTurn = rlSync.question().toLowerCase();
    if (["h", "s"].includes(playerTurn)) {
      break;
    }
    prompt("Sorry, must enter 'h' or 's'.");
  }
};

//--------------------------------- Hit or stay function -------------------------

let hitOrStay = function () {
  while (true) {
    playerChoosing();

    if (playerTurn === "h") {
      playerCards.push(cards.pop());
      prompt("You chose to hit!");
      prompt(`Your cards are now: ${hand(playerCards)}`);
      prompt(`Your total is now: ${total(playerCards)}`);
    }

    if (playerTurn === "s") {
      console.log("You stayed");
      break;
    } else if (bust(playerCards)) {
      detectResults(dealerCards, playerCards);
      break;
    }
  }
};
//--------------------------------- shuffle -------------------------

function shuffle(array) {
  for (let index = array.length - 1; index > 0; index--) {
    let otherIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[otherIndex]] = [array[otherIndex], array[index]];
  }

  return array;
}

//--------------------------------- Find results function -------------------------

let detectResults = function (dealerCards, playerCards) {
  let playerTotal = total(playerCards);
  let dealerTotal = total(dealerCards);

  if (playerTotal > winningNum) {
    prompt("You busted, the dealer wins :(");
  } else if (dealerTotal > winningNum) {
    prompt("The dealer busted, you win!");
  } else if (dealerTotal < playerTotal) {
    prompt("You won!");
  } else if (dealerTotal > playerTotal) {
    prompt("The dealer won...");
  } else {
    prompt("Tie");
  }
};

//--------------------------------- play again function -------------------------

let playAgain = function () {
  console.log("----------------");
  prompt("Do you want to play again? (y or n)");
  let answer = rlSync.question().toLowerCase();

  while (answer !== "n" && answer !== "y") {
    prompt('Please enter "y" or "n".');
    answer = rlSync.question().toLowerCase();
  }

  if (answer === "y") {
    playerCards = [];
    dealerCards = [];
    shuffle(cards);
    return true;
  } else if (answer === "n") {
    console.log("The game is now over!");
  }
};

//--------------------------------- Give two function -------------------------

let giveTwo = function () {
  return [cards.pop(), cards.pop()];
};

//---------------------------------show hand-------------------------

function hand(arr) {
  return arr.map((card) => `${card[0]}${card[1]}`).join(" ");
}

//---------------------------------Dealer will hit-------------------------

let dealerHit = function () {
  while (total(dealerCards) < dealerStaysNum) {
    prompt("The dealer will now hit");
    dealerCards.push(cards.pop());
    prompt(
      `The dealer now has ${hand(dealerCards)} for a total of ${total(
        dealerCards
      )}`
    );
  }
};

//---------------------------------Important numbers-------------------------

let winningNum = 21;
let dealerStaysNum = 17;

//---------------------------------final score-------------------------

let finalScore = function () {
  console.log("==============");
  prompt(
    `Dealer has ${hand(dealerCards)}, for a total of: ${total(dealerCards)}`
  );
  prompt(
    `Player has ${hand(playerCards)}, for a total of: ${total(playerCards)}`
  );
  console.log("==============");

  detectResults(dealerCards, playerCards);
};

//---------------------------------game logic---------------------------

let startOfGame = function () {
  prompt("Welcome to the game of 21! let's get started!");

  shuffle(cards);

  playerCards.push(...giveTwo());
  dealerCards.push(...giveTwo());

  prompt(`Dealer has ${hand(dealerCards)[0] + hand(dealerCards)[1]} and ?`);
  prompt(
    `You have: ${hand(playerCards)}, for a total of ${total(playerCards)}.`
  );
};

//---------------------------------game logic---------------------------

let playerCards = [];
let dealerCards = [];

while (true) {
  startOfGame();

  hitOrStay();

  if (!bust()) {
    prompt("The dealer will now play!");

    dealerHit();

    if (total(dealerCards) > winningNum) {
      prompt(`Dealer total is now: ${total(dealerCards)}`);
      detectResults(dealerCards, playerCards);
      if (playAgain()) {
        continue;
      } else {
        break;
      }
    } else {
      prompt(`Dealer stays at ${total(dealerCards)}`);
    }

    finalScore();
  }

  if (!playAgain()) break;
}
