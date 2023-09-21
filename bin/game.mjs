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
        let hands = [], starter = {}; 

        //generate a deck and shuffle the deck
        deck = shuffle(generateDeck());
        
        //deal to initialize player hand, computer hand, and update deck
        ({deck, hands} = deal(deck)); //deal will deal 2 hands of 5 cards by default
        ([playerHand, computerHand] = hands); 

        discardPile = []; 

        do { 

            let drawnCards;
            ([deck, drawnCards] = draw(deck)); //draws one card by default. Returns updated deck and array of cards drawn
           
            starter = drawnCards[0];

            if (starter["rank"] === EIGHT) {
                discardPile.push(starter); 
            }
        } while(starter["rank"] === EIGHT); 

        nextPlay = starter; 

        playGame(deck, playerHand, computerHand, discardPile, nextPlay); 
    }
}

const displayState = (nextPlay, discardPile, deck) => {
    let text = "CR🤪ZY 8's"; 
    const screenWidth = process.stdout.columns;
    const padding = Math.floor((screenWidth/2 - text.length) / 2);
  
    // Create a string with padding spaces on both sides
    const centeredText = ' '.repeat(padding) + text + ' '.repeat(padding);
  
    // Log the centered text to the console
    console.log(`\n${centeredText}\n${LINE_SEP}`);
    console.log(`Next suit/rank to play: ➡️  ${nextPlay["rank"]}${nextPlay["suit"]}  ⬅️\n${LINE_SEP}`); 
    let top = 
    console.log(`Top of discard pile: ${discardPile.length > 0 ? (discardPile[discardPile.length - 1]["rank"] + discardPile[discardPile.length - 1]["suit"]): "empty"}\nNumber of cards left in deck: ${deck.length}\n${LINE_SEP}`); 
}

const playGame = (deck, playerHand, computerHand, discardPile, nextPlay) => {
     //([deck, playerHand, computerHand, discardPile, nextPlay] = initializeBeforePlay()); 
     console.log(nextPlay);
     displayState(nextPlay, discardPile, deck);
}

initializeBeforePlay(); 


