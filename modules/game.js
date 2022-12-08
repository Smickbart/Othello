//Create a change player function because now being used in two locations

let currentPlayer = "black";
let opposingPlayer = "white";
const rows = ['1', '2', '3', '4', '5', '6', '7','8'];
const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let pastMoves = [];
let validMoves = [];
let move;

function validMove(location) {
    for(let i = 0; i < validMoves.length; i++) {
        if(validMoves[i].location == location) {
            move = validMoves[i];
            move.newColour = currentPlayer;
            move.currentColour = opposingPlayer;
            setBoard(location, validMoves[i].turnPieces);
            const temp = currentPlayer;
            currentPlayer = opposingPlayer;
            opposingPlayer = temp;            
            setValidMoves();
            return true;
        }
    }
}

function getMove() {
    return move;
}

function checkSurroundings(column, row, cinc, rinc) {   //cinc = column increment, rinc = row increment
    const currentBoard = pastMoves[pastMoves.length - 1];
    const originalCell = currentBoard[column][row];
    let opposingPiecesFound = [];
    const validMove = {}

    column += cinc;
    row += rinc;   
    if(column < 0 || column > 7) {
        return;
    }
    if(row < 0 || row > 7) {
        return;
    }    
    
    do {
        const cell = currentBoard[column][row]
        if(cell.colour == "") {
            return;
        }
        if(cell.colour == currentPlayer && opposingPiecesFound.length == 0) {
            return;
        }
        if(cell.colour == opposingPlayer) {
            opposingPiecesFound.push(cell.location);
        }
        if(cell.colour == currentPlayer && opposingPiecesFound.length > 0) {
            for(let i = 0; i < validMoves.length; i++) {
                if(validMoves[i].location == originalCell.location) {
                    validMoves[i].turnPieces = validMoves[i].turnPieces.concat(opposingPiecesFound);
                    return;
                }
            }
            validMove.location = originalCell.location;
            validMove.turnPieces = opposingPiecesFound;
            validMoves.push(validMove);
            return;
        }
        column += cinc;
        row += rinc;
    } while(column >= 0 && column <= 7 && row >= 0 && row <= 7);
}

function setValidMoves() {
    validMoves = [];
    const currentBoard = pastMoves[pastMoves.length - 1];
    for(let i = 0; i < columns.length; i++) {
        for(let j = 0; j < rows.length; j++) {
            
            if(currentBoard[i][j].colour == "") { //If the current cell is blank check the surrounding directions for a valid move.
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
        setValidMoves();
    }
    console.log("Game initialised!");
    console.log(validMoves);
    console.log("current player is ", currentPlayer);
}

function setBoard(move, turnPieces) {
    turnPieces.unshift(move);   //Doing this so that all cells that need colours updating are in one array.
    const currentBoard = pastMoves[pastMoves.length - 1];
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            for(let k = 0; k< turnPieces.length; k++) {
                if(currentBoard[i][j].location == turnPieces[k]) {
                    currentBoard[i][j].colour = currentPlayer;
                }
            }            
        }
    }
    pastMoves.push(currentBoard);
}

function initializeGame() {
    currentPlayer = "black";
    opposingPlayer = "white";
    pastMoves = [];
    let row = [];
    const board = [];
    const cells = [];
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            const location = `${columns[i]}${rows[j]}`;
            if(location == "D4" || location == "E5") {
                row.push({ location: location, colour: "white" });
                cells.push({ location: location, colour: "white" });
            } else if(location == "E4" || location == "D5") {
                row.push({ location: location, colour: "black" });
                cells.push({ location: location, colour: "black" });
            } else {
                row.push({ location: location, colour: "" });
            }
        }
        board.push(row);
        row = [];
    }
    pastMoves.push(board);
    setValidMoves();
    return cells;
}

module.exports = { validMove, initializeGame, getMove }