// game.mjs
import {
    generateDeck,
    shuffle,
    draw,
    deal,
    handToString,
    matchesAnyProperty,
    drawUntilPlayable} from "../lib/cards.mjs";
import {question} from 'readline-sync';
import {readFile} from 'fs';

const EIGHT = '8'; 
const LINE_SEP = "-----------------------------------------------------------------------------------"; 

//function to display state of game
const displayState = (deck, playerHand, computerHand, discardPile, nextPlay) => {
    const text = "CR🤪ZY 8's"; 

    //center title toward the middle of the screen (not exactly middle)
    const screenWidth = process.stdout.columns;
    const padding = Math.floor((screenWidth/2 - text.length) / 2);
  
    // create a string with padding spaces on both sides
    const centeredText = ' '.repeat(padding) + text + ' '.repeat(padding);
  
    // log the centered text to the console
    console.log(`\n${centeredText}\n${LINE_SEP}`);
    console.log(`Next suit/rank to play: ➡️  ${nextPlay["rank"]}${nextPlay["suit"]}  ⬅️\n${LINE_SEP}`); 
    console.log(`Top of discard pile: ${discardPile.length > 0 ? (discardPile[discardPile.length - 1]["rank"] + discardPile[discardPile.length - 1]["suit"]): nextPlay["rank"]+nextPlay["suit"]}\nNumber of cards left in deck: ${deck.length}\n${LINE_SEP}`); 
    console.log(`🤖 ✋ (computer hand): ${handToString(computerHand)}`); 
    console.log(`😊 ✋ (player hand): ${handToString(playerHand)}`); 
    console.log(LINE_SEP); 
};

//function for the player's turn
const playerTurn = (playerHand, nextPlay, deck, discardPile) => { 
    console.log("😊 Player's turn...");  

    //check if any card's rank/suit in the player's hand matches the rank/suit of nextPlay or if player has an 8
    let match = false; 
    for (let i = 0; i < playerHand.length; i++)
    {
        if (matchesAnyProperty(nextPlay, playerHand[i]) === true || playerHand[i]["rank"]===EIGHT){
            match = true;  //if a card matches, turn match flag true
            break; 
        }
    }

    let cardPlayed; //to store the card the player plays
    //if a card matches, give player option to choose the card they want to play
    if (match === true)
    {
        //get input from user and update hand, discardPile, etc... accordingly
        const num = question(`Enter the number of the card you would like to play:\n${handToString(playerHand, '\n', true)}\n`);

        cardPlayed = playerHand[num-1];

        console.log(`Card played: ${cardPlayed["rank"]}${cardPlayed["suit"]}`); 

        discardPile.push(cardPlayed); //add to discard pile 
        playerHand.splice(num - 1, 1); //remove the played card from player hand
        nextPlay = cardPlayed; //the card played becomes next card to be played i.e. starter

        question("Press ENTER to continue");

    } else {
        //if no playable cards, draw until playable card found
        const string = `😔 You have no playable cards\nPress ENTER to draw cards until matching: ${nextPlay["rank"]}, ${nextPlay["suit"]}, ${EIGHT}`;
        question(string); 
        
        let removed;
        ([deck, removed] = drawUntilPlayable(deck, nextPlay)); //should cards drawn go to discard pile or playerHand??????

        console.log(`Cards drawn: ${handToString(removed)}`); 
        console.log(`Card played: ${removed[removed.length-1]["rank"]}${removed[removed.length-1]["suit"]}`); 
        
        cardPlayed = removed[removed.length-1];
        nextPlay = cardPlayed;

        //add the card played to the discard pile
        discardPile.push(cardPlayed); 

        //add the drawn cards (other than the card played) to player's hand
        removed.pop(); //remove cardPlayed first 
        playerHand.push(...removed); //then add to playerHand
        //console.log(discardPile);
         
        question("Press ENTER to continue"); 
    }
    //if player plays an eight, give option to choose new suit and assign accordingly to nextPlay
    const suits = ['♠️', '❤️', '♣️', '♦️'];
    if (cardPlayed["rank"] === EIGHT){
        const suit = question(`CRAZY EIGHTS! You played an 8 - choose a suit\n1: ${suits[0]}\n2: ${suits[1]}\n3: ${suits[2]}\n4: ${suits[3]}\n `);
        
        nextPlay = {...nextPlay, "suit":suits[suit-1]}; //creating new nextPlay and reassigning to ensure that top of discard pile does not change 
       
        console.log(`You chose to set the suit to ${suits[suit-1]}`);
        question("Press ENTER to continue");
    }

    //return updated data to the main game
    const retArray = [];
    retArray.push(playerHand);
    retArray.push(nextPlay);
    retArray.push(deck);
    retArray.push(discardPile); 

    return retArray; 
};

//similar process as playerTurn
const computerTurn = (computerHand, nextPlay, deck, discardPile) => {

    console.log("🤖 Computer's turn..."); 
    let match = false; 
    let cardPlayed; 

    //logic similar to playerTurn except that 
    //first matching card (matching rank/suit or eight) found is played
    for (let i = 0; i < computerHand.length; i++)
    {
        if (matchesAnyProperty(nextPlay, computerHand[i]) === true || computerHand[i]["rank"]===EIGHT){
            match = true;  
            cardPlayed = computerHand[i]; //play the first card that matched
            nextPlay = cardPlayed; 
            console.log(`Card played: ${cardPlayed["rank"]}${cardPlayed["suit"]}`); 
            computerHand.splice(i, 1); 
            discardPile.push(cardPlayed); 
            break; 
        }
    }
    if (match===false)
    {
        let removed;
        ([deck, removed] = drawUntilPlayable(deck, nextPlay)); 
       
        console.log(`Cards drawn: ${handToString(removed)}`); 
        console.log(`Card played: ${removed[removed.length-1]["rank"]}${removed[removed.length-1]["suit"]}`); 
        
        //update accordingly - similar to playerTurn
        cardPlayed = removed[removed.length-1];
        nextPlay = cardPlayed; 
        discardPile.push(cardPlayed); 
        removed.pop();
        computerHand.push(...removed);
    }

    const suits = ['♠️', '❤️', '♣️', '♦️'];
    if (cardPlayed["rank"] === EIGHT){
        //logic used: computer will always pick heart as suit
        console.log(`CRAZY EIGHTS! Computer played an 8 and chose the suit ${suits[1]}`);
        nextPlay = {...nextPlay, "suit":suits[1]}; 
    }
    const retArray = [];
    retArray.push(computerHand);
    retArray.push(nextPlay);
    retArray.push(deck);
    retArray.push(discardPile); 

    return retArray; 
};

const playGame = (deck, playerHand, computerHand, discardPile, nextPlay) => {

    //display current state of game
    //player turn then computer turn
    displayState(deck, playerHand, computerHand, discardPile, nextPlay);

    ([playerHand, nextPlay, deck, discardPile] = playerTurn(playerHand, nextPlay, deck, discardPile)); 
    console.log("Computer turn complete. Press ENTER to continue");

    console.clear(); 
    displayState(deck, playerHand, computerHand, discardPile, nextPlay);
    question("Press ENTER to continue"); 

    ([computerHand, nextPlay, deck, discardPile] = computerTurn(computerHand, nextPlay, deck, discardPile)); 
    question("Computer turn complete. Press ENTER to continue"); 
    console.clear(); 
    
    //display final state before end of program
    displayState(deck, playerHand, computerHand, discardPile, nextPlay);
    
};

//function that checks if command has filename 
//if yes, open the file
//if file opens, play game by calling playGame() as callback
//if no file fiven, use predefined cards
const beginPlay = () => {
    const args = process.argv; 
    let deck, playerHand, computerHand, discardPile, nextPlay;
    
    if (args.length === 3) //filename provided
    {
        const filename = process.argv[2]; 
        readFile(filename, 'utf8', (err, data) => {

            if(err){
                console.error("Error reading the file: ", err); 
                return; 
            }
        
        //parse the json data and destructure the object returned to get deck, playerHand...etc. 
        ({deck, playerHand, computerHand, discardPile, nextPlay} = JSON.parse(data));

        //playGame() as callback function of readfile to ensure file data is loaded before game begins
        playGame(deck, playerHand, computerHand, discardPile, nextPlay);  
        });

    } else { 
        //if filename not provided 
        let hands = []; 

        //generate a deck and shuffle the deck
        deck = shuffle(generateDeck());
        
        //deal to initialize player hand, computer hand, and update deck
        ({deck, hands} = deal(deck)); //deal will deal 2 hands of 5 cards by default
        ([playerHand, computerHand] = hands); 

        discardPile = []; 

        do { 

            let drawnCards;
            ([deck, drawnCards] = draw(deck)); //draws one card by default. Returns updated deck and array of cards drawn
           
            nextPlay = drawnCards[0];

            if (nextPlay["rank"] === EIGHT) {
                discardPile.push(nextPlay); 
            }
        } while(nextPlay["rank"] === EIGHT); 

        playGame(deck, playerHand, computerHand, discardPile, nextPlay); 
    }
};

//call begin play to open file/get predefined cards and start playing game
beginPlay(); 