// game.mjs
import {
    generateDeck,
    shuffle,
    draw,
    deal,
    handToString,
    matchesAnyProperty,
    drawUntilPlayable} from "../lib/cards.mjs";
import * as os from 'os';
import {question} from 'readline-sync';
import clear from 'clear';
import {readFile} from 'fs';

const EIGHT = '8'; 
const LINE_SEP = "-----------------------------------------------------------------------------------"; 

const initializeBeforePlay = () => {
    let args = process.argv; 
    let deck, playerHand, computerHand, discardPile, nextPlay;
    
    if (args.length === 3) //filename provided
    {

        let filename = process.argv[2]; 
        readFile(filename, 'utf8', (err, data) => {

            if(err){
                console.error("Error reading the file: ", err); 
                return; 
            }
        
        //parse the json data and destructure the object returned to get deck, playerHand...etc. 
        ({deck, playerHand, computerHand, discardPile, nextPlay} = JSON.parse(data));

        //playGame() as callback function of readfile to ensure file data is loaded before game begins
        playGame(deck, playerHand, computerHand, discardPile, nextPlay);  
        })

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
}

const displayState = (deck, playerHand, computerHand, discardPile, nextPlay) => {
    let text = "CR🤪ZY 8's"; 
    const screenWidth = process.stdout.columns;
    const padding = Math.floor((screenWidth/2 - text.length) / 2);
  
    // Create a string with padding spaces on both sides
    const centeredText = ' '.repeat(padding) + text + ' '.repeat(padding);
  
    // Log the centered text to the console
    console.log(`\n${centeredText}\n${LINE_SEP}`);
    console.log(`Next suit/rank to play: ➡️  ${nextPlay["rank"]}${nextPlay["suit"]}  ⬅️\n${LINE_SEP}`); 

    console.log(`Top of discard pile: ${discardPile.length > 0 ? (discardPile[discardPile.length - 1]["rank"] + discardPile[discardPile.length - 1]["suit"]): "empty"}\nNumber of cards left in deck: ${deck.length}\n${LINE_SEP}`); 

    console.log(`🤖 ✋ (computer hand): ${handToString(computerHand)}`); 
    console.log(`😊 ✋ (player hand): ${handToString(playerHand)}`); 
    console.log(LINE_SEP); 
}

const playerTurn = (playerHand, nextPlay, deck, discardPile) => { //IS DECK PASSED BY REF?
    console.log("😊 Player's turn...");  
    let match = false; 
    for (let i = 0; i < playerHand.length; i++)
    {
        if (matchesAnyProperty(nextPlay, playerHand[i]) === true){
            console.log("Enter the number of the card you would like to play:"); 
            match = true;  
            break; 
        }
    }
    if (match === true)
    {
        console.log(handToString(playerHand, '\n', true));
        //get input from user
    } else{
        console.log(`😔 You have no playable cards\nPress ENTER to draw cards until matching: ${nextPlay["rank"]}, ${nextPlay["suit"]}, ${EIGHT}`);
        /* 
        //
        //
        //
        //  GET USER'S INPUT - SHOULD PRESS ENTER HERE
        //
        //
        //
        */
        //IF USER INPUTS ENTER - IF statement HERE
        {
            let removed;
            ([deck, removed] = drawUntilPlayable(deck, nextPlay)); 

            console.log(`Cards drawn: ${handToString(removed)}`); 
            console.log(`Card played: ${removed[removed.length-1]["rank"]}${removed[removed.length-1]["suit"]}`); 
            
            //update discard pile CHECK IF AUTO UPDATES
            discardPile.push(...removed); 

             /* 
            //
            //
            //
            //  GET USER'S INPUT - SHOULD PRESS ENTER HERE to continue
            //
            //  make function eightPlayed(); if easy 
            //
            */
        }

    }
    //MAYBE SHOULD RETURN DECK IF DECK ISNT AUTO UPDATED OUTSIDE THIS FUNCTION
    //either return removed and push to discard pile or update discardpile and return
}

const playGame = (deck, playerHand, computerHand, discardPile, nextPlay) => {
    displayState(deck, playerHand, computerHand, discardPile, nextPlay);
    playerTurn(playerHand, nextPlay, deck, discardPile); 
}

initializeBeforePlay(); 


//3
/*{"suit": "❤️", "rank": "2"}, //3
        {"suit": "❤️", "rank": "4"},
        {"suit": "♠️", "rank": "3"} */