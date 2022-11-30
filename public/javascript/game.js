//Create a change player function because now being used in two locations

const socket = io();

socket.on("update ui", (moves) => {
    updateUi(moves);
})

let currentPlayer = "black";
let opposingPlayer = "white";
const rows = ['1', '2', '3', '4', '5', '6', '7','8'];
const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let validMoves = [];

const moves = [];

function createPiece(colour, location) {
    const piece = document.createElement("div");
    piece.classList.add("piece", colour);

    moves.push(new Piece(colour, location, document.querySelector(`#${location}`)));

    return piece;
}

function Piece(colour, location, cell, surroundings) {
    this.colour = colour;
    this.location = location;
    this.cell = cell;
}

function checkSurroundings(column, row, cinc, rinc) {
    const id = `${columns[column]}${rows[row]}`;
    let opposingPiecesFound = [];
    const validMove = {}

    column += cinc;
    row += rinc;   
    if(column < 0 || column > 7) {
        return;
    }
    if(row < 0 || row > 7) {
        return;
    }//cinc = column increment, rinc = row increment
    
    
    do {
        const currentId = `#${columns[column]}${rows[row]}`;
        const cell = document.querySelector(currentId);        

        if(cell.childElementCount == 0) {
            opposingPiecesFound = [];
            return;
        }
        if(cell.firstElementChild.className.includes(currentPlayer) && opposingPiecesFound.length == 0) {
            return;
        }
        if(cell.firstElementChild.className.includes(opposingPlayer)) {
            opposingPiecesFound.push(cell.id);
        }
        if(cell.firstElementChild.className.includes(currentPlayer) && opposingPiecesFound.length > 0) {
            for(let i = 0; i < validMoves.length; i++) {
                if(validMoves[i].location == id) {
                    validMoves[i].turnPieces = validMoves[i].turnPieces.concat(opposingPiecesFound);
                    return;
                }
            }
            validMove.location = id;
            validMove.turnPieces = opposingPiecesFound;
            validMoves.push(validMove);
            return;
        }
        column += cinc;
        row += rinc;
    } while(column >= 0 && column <= 7 && row >= 0 && row <= 7); 
    
}

function getValidMoves() {
    validMoves = [];
    for(let i = 0; i < columns.length; i++) {
        for(let j = 0; j < rows.length; j++) {
            const id = `#${columns[i]}${rows[j]}`;
            const cell = document.querySelector(id);
            if(cell.childElementCount == 0) {
                // (column, row, columnInc, rowInc)
                checkSurroundings(i, j, 0, -1); //Checking North
                checkSurroundings(i, j, 1, -1); //Checking North-East
                checkSurroundings(i, j, 1, 0); //Checking East
                checkSurroundings(i, j, 1, 1); //Checking South-East
                checkSurroundings(i, j, 0, 1); //Checking South
                checkSurroundings(i, j, -1, 1); //Checking South-West
                checkSurroundings(i, j, -1, 0); //Checking West
                checkSurroundings(i, j, -1, -1); //Checking North-West
            }
        }
    }
    if(validMoves.length == 0) {
        const temp = currentPlayer;
        currentPlayer = opposingPlayer;
        opposingPlayer = temp;
        getValidMoves();
    }
}

function initializeGame() {
    const cells = document.querySelectorAll(".cell");
    document.querySelector("#D4").insertAdjacentElement("afterbegin", createPiece("white", "D4"));
    document.querySelector("#E4").insertAdjacentElement("afterbegin", createPiece("black", "E4"));
    document.querySelector("#D5").insertAdjacentElement("afterbegin", createPiece("black", "D5"));
    document.querySelector("#E5").insertAdjacentElement("afterbegin", createPiece("white", "E5"));
    cells.forEach(cell => {
        if(cell.childElementCount == 0) {
            cell.addEventListener("click", handleClick);
        }
    });
    getValidMoves();
}

function handleClick(event) {
    const cell = event.target;
    for(let i = 0; i < validMoves.length; i++) {
        if(validMoves[i].location == cell.id) {
            const moves = [];
            moves.push(cell.id);
            
            validMoves[i].turnPieces.forEach(piece => {
                moves.push(piece);
                // piece.classList.replace(opposingPlayer, currentPlayer);
            });
            socket.emit("move", moves);
        }
    }
}

function updateUi(moves) {
    console.log("The moves to make are ", moves);
    for(let i = 0; i < moves.length; i++) {
        const cell = document.querySelector(`#${moves[i]}`)
        if(i == 0) {
            cell.insertAdjacentElement("afterbegin", createPiece(currentPlayer, moves[i]))
        } else {
            cell.firstElementChild.classList.replace(opposingPlayer, currentPlayer);
        }
    }
    const temp = currentPlayer;
    currentPlayer = opposingPlayer;
    opposingPlayer = temp;
    console.log("Current player is ", currentPlayer);
    getValidMoves();
}


window.addEventListener("load", (event) => {
    initializeGame();
});