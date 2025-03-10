
export const tile_statuses = {
    hidden: "hidden",
    mine: "mine",
    number: "number",
    marked: "marked"
}

//Creates the game board
export function createBoard(boardSize, numberOfMines) {
    const board = []
    const minePositions = getMinePositions(boardSize, numberOfMines)

    for(let x = 0; x < boardSize; x++) {
        const row = []
        for(let y = 0; y < boardSize; y++) {
            const element = document.createElement("div") //Property of the tile
            element.dataset.status = tile_statuses.hidden //Default property of the tile is hidden

            const tile = {element,x,y,
                //Checks whether current tile is found in the list of mine positions. 
                //If yes, set mine to true, else false.
                mine: minePositions.some(positionMatch.bind(null, {x,y})),
                get status() {return this.element.dataset.status},
                set status(value) {return this.element.dataset.status = value}
            }

            row.push(tile)

        }
        board.push(row)
    }
    return board   
}

//Marks tile on right click
export function markTile(tile) {
    if(tile.status === tile_statuses.marked) {
        tile.status = tile_statuses.hidden
    } else if (tile.status === tile_statuses.hidden) {
        tile.status = tile_statuses.marked
    } 
}

//Reveals tile on left click
export function revealTile(board, tile) {
    if(tile.status !== tile_statuses.hidden) {return}

    if(tile.mine) {
        tile.status = tile_statuses.mine
        return
    }

    tile.status = tile_statuses.number
    const adjTiles = nearbyTiles(board, tile)
    const mines = adjTiles.filter(tile => tile.mine)
    if(mines.length === 0) {
        adjTiles.forEach(revealTile.bind(null, board))
    } else {
        tile.element.textContent = mines.length
    }
}

//Checks whether game is won
export function checkWin(board) {
    return board.every(row => {
        return row.every(tile => {
            return tile.status === tile_statuses.number || (tile.mine && (tile.status === tile_statuses.hidden || tile.status === tile_statuses.marked))
        })
    })
}

//Checks whether game is lost
export function checkLose(board) {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === tile_statuses.mine
        })
    })
}


function getMinePositions(boardSize, numberOfMines) {
    const positions = []

    while (positions.length < numberOfMines) {
        const position = {x: randomNumber(boardSize), y: randomNumber(boardSize)}
        
        //If positions is not a duplicate, add it to list of mine positions.
        if(!positions.some(positionMatch.bind(null, position))) {
            positions.push(position)
        }

    }

    return positions
}

//Checks whether there are duplicate mine positions.
function positionMatch(a,b) {
    return a.x === b.x && a.y === b.y
}

function randomNumber(size) {
    return Math.floor(Math.random() * size)
}

//Checks adjaceny of nearby tiles in a 3x3 grid 
function nearbyTiles(board, {x, y}) {
    const tiles = []

    for (let a = -1; a <= 1; a++) {
        for (let b = -1; b <= 1; b++) {
            const tile = board[x + a]?.[y + b]
            if(tile) tiles.push(tile)
        }
    }
    return tiles
}