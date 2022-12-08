const socket = io();

socket.on("update ui", (moves) => {
    console.log("Received moves");
    console.log(moves);
    updateUi(moves);
});

socket.on("initialise", (cells) => {
    console.log("initialising game on client side");
    initialise(cells);
});

function piece(colour) {
    const piece = document.createElement("div");
    piece.classList.add("piece", colour);
    return piece;
}

function handleClick(event) {
    console.log(`${event.target.id} was clicked`);
    socket.emit("move", event.target.id);
}

function initialise(cells) {
    for(let i = 0; i < cells.length; i++) {
        const cell = document.querySelector(`#${cells[i].location}`);
        cell.insertAdjacentElement("afterbegin", piece(cells[i].colour));
    }

    document.querySelectorAll(".cell").forEach(cell => {
        if(cell.childElementCount == 0) {
            cell.addEventListener("click", handleClick);
        }
    });
}

function updateUi(moves) {
    const cell = document.querySelector(`#${moves.location}`)
    cell.insertAdjacentElement("afterbegin", piece(moves.newColour));
    for(let i = 0; i < moves.turnPieces.length; i++) {
        document.querySelector(`#${moves.turnPieces[i]}`).firstElementChild.classList.replace(moves.currentColour, moves.newColour);
    }    
}
