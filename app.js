let formCard = document.querySelector("#cardForm")
let cardName = document.querySelector("#cardName")
let cardDetails = document.querySelector("#cardDescription")
let cardPriority = document.querySelector("#cardPriority")
let cardType = document.querySelector("#cardType");
let requestedCardContainer = document.querySelector("#requestedCardContainer")
let inProgressCardContainer = document.querySelector("#inProgressCardContainer")
let completedCardContainer = document.querySelector("#completedCardContainer")
let sortCardElement = document.querySelector("#sortCards")
let cancelButton = document.querySelector("#cancelButton")
let taskButton = document.querySelector("#taskButton")
let formContainer = document.querySelector("#formContainer")
let overLayContainer = document.querySelector("#overlay")
let cards = [];
let count = 5;
let draggedItem;


// creating default cards on  load using an API
(function createRandomCards() {
    fetch("https://627a01494a5ef80e2c11f7e9.mockapi.io/cards")
        .then(cardData => cardData.json())
        .then(cardData => {
            cardData.map(card => {
                cards.push(card) && sortCardElement.value ? sortCards() : createCard(card);
            });
        })
})();


formCard.addEventListener("submit", (event) => {
    event.preventDefault();
    formContainer.style.animation = "moveInRight 1s";
    formContainer.classList.remove("show");
    setTimeout(() => {
        overLayContainer.classList.remove("overlay");
        renderCard();
    }, 500);
})


function renderCard() {
    let cardData = {
        id: count,
        name: cardName.value,
        description: cardDetails.value,
        priority: cardPriority.value,
        cardType: cardType.value,
        cardStatus: "requested",
    }
    count++;
    cards.push(cardData) && sortCardElement.value ? sortCards() : createCard(cardData)
}


//creating card
function createCard(data) {
    let newCard = document.createElement("div");
    let newCardHeading = document.createElement("p")
    let newCardDescription = document.createElement("p")
    let newCardPriority = document.createElement("p")
    let newCardAvatarIcon = document.createElement("img");
    let cardHeader = document.createElement("div")
    let cardMain = document.createElement("div")
    cardHeader.append(newCardAvatarIcon, newCardHeading)
    cardHeader.classList.add("card-header")
    cardMain.append(newCardDescription, newCardPriority)
    cardMain.classList.add("card-main")
    newCard.dataset.id = data.id;
    newCardHeading.innerHTML = data.name;
    newCardHeading.classList.add("card-heading")
    newCardDescription.classList.add("card-description")
    newCardDescription.innerHTML = data.description;
    newCardPriority.innerHTML = `Priority : ${data.priority}`;
    newCardPriority.classList.add("priority");
    newCardAvatarIcon.src = "https://cdn-icons-png.flaticon.com/512/1177/1177568.png"
    newCardAvatarIcon.classList.add("avatar-icon")
    newCard.classList.add("display-card");
    newCard.setAttribute("draggable", "true")
    newCard.append(cardHeader, cardMain);
    displayCards(newCard, data.cardStatus)
    categorizeCards(newCard, data.cardType)
    highlightContainers(newCard)
}



//highlighting the card containers when dragging
function highlightContainers(newCard) {
    newCard.addEventListener("dragstart", (e) => {
        draggedItem = e.target;
        switch (draggedItem.parentElement) {
            case requestedCardContainer:
                inProgressCardContainer.style.border = "dotted 3px"
                break
            case inProgressCardContainer:
                requestedCardContainer.style.border = "dotted 3px"
                completedCardContainer.style.border = "dotted 3px"
                break
            default:
                break
        }
    })
    newCard.addEventListener("dragend", () => {
        requestedCardContainer.style.border = "none"
        completedCardContainer.style.border = "none"
        inProgressCardContainer.style.border = "none"

    })
}


//displaying the cards
function displayCards(card, cardStatus) {
    switch (cardStatus) {
        case "requested": {
            requestedCardContainer.append(card);
            break;
        }
        case "in-progress": {
            inProgressCardContainer.append(card);
            break;
        }
        case "completed": {
            completedCardContainer.append(card)
        }
    }
}


// differentiating the card according to type
function categorizeCards(card, cardType) {
    switch (cardType) {
        case "Feature": {
            card.classList.add("display-requested-card-type");
            card.childNodes[1].childNodes[1].style.color = "#06ff00";
            break;
        }
        case "Enhancement": {
            card.classList.add("display-in-progress-card-type");
            card.childNodes[1].childNodes[1].style.color = "#4b7be5";
            break;
        }
        case "Bug": {
            card.classList.add("display-completed-card-type");
            card.childNodes[1].childNodes[1].style.color = "#ff1818";
            break;
        }
    }
}


// sorting the cards according to type
function sortCards() {

    if (sortCardElement.value === "Low to High") {
        requestedCardContainer.innerHTML = ""
        inProgressCardContainer.innerHTML = ""
        completedCardContainer.innerHTML = ""
        cards.sort((a, b) => {
            return a.priority - b.priority;
        })
        cards.map(card => {
            createCard(card)
        })
    }
    else if (sortCardElement.value === "High to Low") {
        requestedCardContainer.innerHTML = ""
        inProgressCardContainer.innerHTML = ""
        completedCardContainer.innerHTML = ""
        cards.sort((a, b) => {
            return b.priority - a.priority;
        })
        cards.map(card => createCard(card))
    }
}
sortCardElement.addEventListener("input", sortCards)




// adding drag and drop functionality to cards
requestedCardContainer.addEventListener("drop", dropCard);
inProgressCardContainer.addEventListener("drop", dropCard);
completedCardContainer.addEventListener("drop", dropCard);


requestedCardContainer.addEventListener("dragover", e => {
    draggedItem.parentElement === inProgressCardContainer && e.preventDefault();
})
inProgressCardContainer.addEventListener("dragover", e => {
    draggedItem.parentElement === requestedCardContainer && e.preventDefault();
})
completedCardContainer.addEventListener("dragover", e => {
    draggedItem.parentElement === inProgressCardContainer && e.preventDefault();
})


function dropCard(e) {
    cards.map(value => {
        if (value.id === +draggedItem.dataset.id) {
            if (value.cardStatus === "requested" && e.target === inProgressCardContainer) {
                draggedItem.remove();
                value.cardStatus = "in-progress";
                createCard(value);
                sortCards();
            }
            else if (value.cardStatus === "in-progress" && e.target === completedCardContainer) {
                draggedItem.remove();
                value.cardStatus = "completed";
                createCard(value);
                sortCards();
            }
            else if (value.cardStatus === "in-progress" && e.target === requestedCardContainer) {
                draggedItem.remove();
                value.cardStatus = "requested";
                createCard(value);
                sortCards();
            }
        }
    })
}


//displaying the form on click;
taskButton.addEventListener("click", (e) => {
    formContainer.classList.add("show")
    formContainer.style.animation = "moveInLeft .5s "
    overLayContainer.classList.add("overlay")
})


//hiding the form
cancelButton.addEventListener("click", function (e) {
    e.preventDefault();
    formContainer.style.animation = "moveInRight 1s"
    formContainer.classList.remove("show");
    setTimeout(() => {
        overLayContainer.classList.remove("overlay");
    }, 500);
})
