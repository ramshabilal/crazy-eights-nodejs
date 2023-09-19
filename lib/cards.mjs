// cards.mjs
const suits = {SPADES: '♠️', HEARTS: '❤️', CLUBS: '♣️', DIAMONDS: '♦️'};
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']; 

let range = (...args) => {
    let start = 0, end, inc = 1, argNum = args.length; 
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
    let numbers = []; 
    for (let i = start; i < end; i+=inc) {
        numbers.push(i);
    }
   return numbers; 
}

const generateDeck = () => {
    const cardArray = [];
    
    for (const key in suits){
        for (let j = 0; j < ranks.length; j++){
            cardArray.push({"suit": suits[key], "rank": ranks[j]});
        }
    }
    console.log(cardArray);
    return cardArray; 
}

export {
    range,
    generateDeck
}; 