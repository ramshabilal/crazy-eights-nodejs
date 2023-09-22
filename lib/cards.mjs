// cards.mjs
const suits = {SPADES: '♠️', HEARTS: '❤️', CLUBS: '♣️', DIAMONDS: '♦️'};
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']; 

const range = (...args) => {
    let start = 0, end, inc = 1;
    const argNum = args.length; 
    if (argNum === 1)
    {
        //only end is given 
        end = args[0]; 
    } else if (argNum === 2){
        start = args[0];
        end = args[1];
    } else if (argNum === 3){
        start = args[0];
        end = args[1];
        inc = args[2]; 
    }
    const numbers = []; 
    for (let i = start; i < end; i+=inc) {
        numbers.push(i);
    }
   return numbers; 
};

const generateDeck = () => {
    const cardArray = [];
    for (const key in suits){
        for (let j = 0; j < ranks.length; j++){
            cardArray.push({"suit": suits[key], "rank": ranks[j]});
        }
    }
    return cardArray; 
};

//reference: https://www.programiz.com/javascript/examples/shuffle-card
const shuffle = (deck) => {
    const shuffledDeck = [...deck];

    for (let i = shuffledDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = shuffledDeck[i];
        shuffledDeck[i] = shuffledDeck[j];
        shuffledDeck[j] = temp;
    }
    return shuffledDeck; 
}; 

const draw = (cardsArray, n = 1) => {
    const updatedCardsArray = [];
    const drawnCardsArray = []; 
    const retArray = []; 
    for (let i = 0; i < cardsArray.length - n; i++)
    {
        updatedCardsArray.push(cardsArray[i]);
    }
    for (let i = cardsArray.length - n; i < cardsArray.length; i++)
    {
        drawnCardsArray.push(cardsArray[i]); 
    }
    retArray.push(updatedCardsArray); 
    retArray.push(drawnCardsArray);

    return retArray; 
};

const deal = (cardsArray, numHands = 2, cardsPerHand = 5) => {
    const deck = [];
    const hands = []; 
    for (let i = 0; i < cardsArray.length - (numHands*cardsPerHand); i++){
        deck.push(cardsArray[i]); 
    }
    let c = numHands*cardsPerHand; 
    for (let i = 0; i < numHands; i++){
        const arr = [];
        for (let j = 0; j < cardsPerHand; j++){
            arr.push(cardsArray[c--]); 
        }
        hands.push(arr); 
    }
    return {"deck": deck, "hands": hands};

};

const handToString = (hand, sep = "  ", numbers = false) => {
    let retString = ""; 
    for (let i = 0; i < hand.length; i++)
    {
        if (numbers === true){
            retString += (i+1 + ": "); 
        }
        if(i === (hand.length - 1))
        {
            retString += hand[i]["rank"] + hand[i]["suit"]; 
        }else
        {
            retString += (hand[i]["rank"] + hand[i]["suit"] + sep); 
        }
    }
    
    return retString; 
};

const matchesAnyProperty = (obj, matchObj) => {
    for (const i in obj) {
        for (const j in matchObj) {
            if (i === j) { 
                if (obj[i] === matchObj[j]) {
                    return true;
                }
            }
        }
    }
    return false; 
};

const drawUntilPlayable = (deck, matchObject) =>{
    const newDeck = [...deck];
    const drawnCards = [];
    const retArray = []; 
    for (let i = deck.length - 1; i >= 0 ; i--){
        if((deck[i]["suit"]=== matchObject["suit"]) || (deck[i]["rank"]=== matchObject["rank"]) || deck[i]["rank"] === '8')
        {
            drawnCards.push(newDeck.pop()); 
            break;
        } else{
            drawnCards.push(newDeck.pop()); 
        }
    }
    retArray.push(newDeck, drawnCards);
    return retArray; 
};

export {
    range,
    generateDeck,
    shuffle,
    draw,
    deal,
    handToString,
    matchesAnyProperty,
    drawUntilPlayable
}; 

