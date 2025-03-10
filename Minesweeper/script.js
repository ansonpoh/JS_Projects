import { createBoard, markTile, tile_statuses, revealTile, checkWin, checkLose } from "./ms.js";

const boardSize = 10
const mines = 20

const board = createBoard(boardSize, mines)
const boardElement = document.querySelector(".board")

boardElement.style.setProperty("--size", boardSize)

const minesLeft = document.querySelector("[mineCount]")
minesLeft.textContent = mines

const messageText = document.querySelector(".subtext")


//Creating layout
board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element) //Sets the default element of each tile.

        //Left click
        tile.element.addEventListener("click", () => {
            revealTile(board, tile)
            checkGame()
        })

        //Right click
        tile.element.addEventListener("contextmenu", e => {
            e.preventDefault()
            markTile(tile)
            listMinesLeft()
        })
    })
})


function listMinesLeft() {
    const markedTilesCount = board.reduce((count,row) => {
        return count + row.filter(tile => tile.status === tile_statuses.marked).length
    }, 0)

    minesLeft.textContent = mines - markedTilesCount
}

function checkGame() {
    const win = checkWin(board)
    const lose = checkLose(board)

    if (win || lose) {
        boardElement.addEventListener("click", stopPropagation, {capture: true})
        boardElement.addEventListener("contextmenu",stopPropagation, {capture: true})
    }

    if (win) {
        messageText.textContent = "You win"
    } else if (lose) {
        messageText.textContent = "You lose"
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.status === tile_statuses.marked) markTile(tile)
                if (tile.mine) revealTile(board, tile)
            })
        })
    }
}

function stopPropagation(e) {
    e.stopImmediatePropagation()
}