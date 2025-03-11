const options = [
    {
        name: "rock",
        emoji: "✊",
        wins: "scissors"
    },
    {
        name: "paper",
        emoji: "✋",
        wins: "rock"
    },
    {
        name: "scissors",
        emoji: "✌️",
        wins: "paper"
    }
]

const optionButtons = document.querySelectorAll("[data-option]")
const resultsColumn = document.querySelector("[data-resultsColumn]")
const playerScore = document.querySelector("[data-playerScore]")
const computerScore = document.querySelector("[data-computerScore]")

optionButtons.forEach(optionButtons => {
    optionButtons.addEventListener("click", e => {
        const optionName = optionButtons.dataset.option
        // Looping through possiblities to find the name that matches choice made
        const option = options.find(option => option.name === optionName)
        playerOption(option)
    })
})

function playerOption(option) {
    const computerOption = computer()
    //If player did not win, winner() returns false. Same for computer. Eg if player loses, const playerWon = false
    const playerWon = winner(option, computerOption)
    const computerWon = winner(computerOption ,option)

    addResults(computerOption, computerWon)
    addResults(option, playerWon)

    //Hence linked to winner(), if() will only execute when winner() is true
    if (playerWon) incrementScore(playerScore)
    if (computerWon) incrementScore(computerScore)
}

function computer() {
    //Gives random number between 0-2 instead of 2.99... due to math.floor which is suitable as there as 3 possibilities
    const randomIndex = Math.floor(Math.random() * options.length)
    return options[randomIndex]
}

function winner(option, computerOption) {
    //Returns true or false
    return option.wins === computerOption.name
}

//Adding a div to showcase the results, ensuring that it is below the names
function addResults(option, winner) {
    const div = document.createElement("div")
    div.innerText = option.emoji
    div.classList.add("resultSelection")
    if (winner) div.classList.add("Winner")
    resultsColumn.after(div)
}

function incrementScore(score) {
    score.innerText = parseInt(score.innerText) + 1
}