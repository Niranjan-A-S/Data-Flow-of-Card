let formCard = document.querySelector("#cardForm")
let cardName = document.querySelector("#cardName")
let cardDetails = document.querySelector("#cardDescription")
let cardPriority = document.querySelector("#cardPriority")
let cardType = document.querySelector("#cardType")
let requestedCardContainer = document.querySelector("#requestedCardContainer")
let inProgressCardContainer = document.querySelector("#inProgressCardContainer")
let completedCardContainer = document.querySelector("#completedCardContainer")
let sortCardElement = document.querySelector("#sortCards")
let cards = [];
let count = 0;
let draggedItem;


formCard.addEventListener("submit", (event) => {
    event.preventDefault();
    renderCard();
})


function renderCard() {
    let cardData = {
        id: count,
        name: cardName.value,
        description: cardDetails.value,
        priority: cardPriority.value,
        type: cardType.value,
        status: "requested",
    }
    count++;
    cards.push(cardData) && sortCardElement.value ? sortCards() : createCard(cardData)
}


//creating card
function createCard(data) {
    let newCard = document.createElement("div");
    let newCardHeading = document.createElement("h2")
    let newCardDescription = document.createElement("p")
    let newCardLeftButton = document.createElement("button");
    let newCardRightButton = document.createElement("button");
    newCard.dataset.id = data.id;
    newCardHeading.innerHTML = data.name;
    newCardDescription.innerHTML = data.description;
    newCardLeftButton.innerHTML = "<i class=\"fa-solid fa-arrow-left-long\">"
    newCardRightButton.innerHTML = "<i class=\"fa-solid fa-arrow-right-long\">"
    newCard.classList.add("display-card");
    newCard.setAttribute("draggable", "true")
    newCard.append(newCardHeading, newCardDescription, newCardLeftButton, newCardRightButton);
    displayCards(newCard, data.status)
    categorizeCards(newCard, data.type)
    newCard.addEventListener("dragstart", (e) => {
        draggedItem = e.target;
        draggedItem.classList.add("dragging")
    })
    newCard.addEventListener("dragend", (e) => {
        draggedItem = e.target;
        draggedItem.classList.remove("dragging")
    })
    //navigating the card according to button  clicks
    newCardRightButton.addEventListener("click", (e) => {
        let card = e.target.parentElement.parentElement;
        let id = card.dataset.id
        let cardStatus;
        cards.map(value => {
            if (value.id === +id) {
                cardStatus = value.status;
                switch (cardStatus) {
                    case "requested": {
                        value.status = "in-progress"
                        cardStatus = value.status;
                        displayCards(card, cardStatus)
                        break;
                    }
                    case "in-progress": {
                        value.status = "completed"
                        cardStatus = value.status
                        displayCards(card, cardStatus)
                        break;
                    }
                }
            }
        })
    });
    newCardLeftButton.addEventListener("click", (e) => {
        let card = e.target.parentElement.parentElement;
        let id = card.dataset.id
        let cardStatus;
        cards.map(value => {
            if (value.id === +id) {
                value.status = "requested"
                cardStatus = value.status;
                displayCards(card, cardStatus)
            }
        })
    })
}


//displaying the cards
function displayCards(card, status) {
    switch (status) {
        case "requested": {
            card.remove();
            requestedCardContainer.append(card);
            card.childNodes[2].style.display = "none"
            card.childNodes[3].style.display = "block"
            break;
        }
        case "in-progress": {
            card.remove();
            inProgressCardContainer.append(card);
            card.childNodes[2].style.display = "block"
            card.childNodes[3].style.display = "block"
            break;
        }
        case "completed": {
            card.remove();
            completedCardContainer.append(card)
            card.childNodes[2].style.display = "none"
            card.childNodes[3].innerHTML = "<i class=\"fa-solid fa-check\"></i>"
        }
    }
}


// differentiating the card according to type
function categorizeCards(card, type) {
    switch (type) {
        case "Feature": {
            card.classList.add("display-requested-card-type");
            break;
        }
        case "Enhancement": {
            card.classList.add("display-in-progress-card-type");
            break;
        }
        case "Bug": {
            card.classList.add("display-completed-card-type");
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
        cards.map(card => createCard(card))
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
            if (value.status === "requested" && e.target === inProgressCardContainer) {
                draggedItem.remove();
                value.status = "in-progress";
                sortCardElement.value ? sortCards() : createCard(value);
            }
            else if (value.status === "in-progress" && e.target === completedCardContainer) {
                draggedItem.remove();
                value.status = "completed";
                sortCardElement.value ? sortCards() : createCard(value);
            }
            if (value.status === "in-progress" && e.target === requestedCardContainer) {
                draggedItem.remove();
                value.status = "requested";
                sortCardElement.value ? sortCards() : createCard(value);
            }
        }
    })
}



