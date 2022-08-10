let formCard = document.querySelector("#cardForm")
let cardName = document.querySelector("#cardName")
let cardDetails = document.querySelector("#cardDescription")
let cardPriority = document.querySelector("#cardPriority")
let cardType = document.querySelector("#cardType");
let requestedCardContainer = document.querySelector("#requestedCardContainer")
let requestedContainerNode = document.getElementById("requestedCardContainer")
let inProgressCardContainer = document.querySelector("#inProgressCardContainer")
let inprogressContainerNode = document.getElementById("inprogressCardContainer")
let completedCardContainer = document.querySelector("#completedCardContainer")
let completedContainerNode = document.getElementById("completedCardContainer")
let sortCardElement = document.querySelector("#sortCards")
let cancelButton = document.querySelector("#cancelButton")
let taskButton = document.querySelector("#taskButton")
let formContainer = document.querySelector("#formContainer")
let overLayContainer = document.querySelector("#overlay")
let cards = [];
let count = 5; //Recheck the Logic
let draggedItem;
let cardParameters = {
    cardStatus: {
        requested: "requested",
        inProgress: "in-progress",
        completed: "completed"
    },
    cardType: {
        feature: "Feature",
        bug: "Bug",
        enhancement: "Enhancement"
    },
    sortValue: {
        ascending: "Low to High",
        descending: "High to Low"
    }
}

// creating default cards on  load using an API
function createRandomCards() {
    fetch("https://627a01494a5ef80e2c11f7e9.mockapi.io/cards")
        .then(cardData => cardData.json())
        .then(cardData => {
            cardData.map(card => {
                cards.push(card) && sortCardElement.value ? sortCards() : createCard(card);
            });
        })
};
window.addEventListener("load", () => {
    createRandomCards();
})

//displaying the form on click;
taskButton.addEventListener("click", () => {
    formContainer.classList.add("show")
    overLayContainer.classList.add("overlay")
})

//hiding the form
cancelButton.addEventListener("click", () => {
    formContainer.classList.remove("show");
    formContainer.classList.add("hide");
    setTimeout(() => {
        overLayContainer.classList.remove("overlay");
    }, 500);
})



formCard.addEventListener("submit", (event) => {
    event.preventDefault();
    formContainer.classList.add("hide"); //bug
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
    return newCard
}

//displaying the cards on respective containers
function displayCards(card, cardStatus) {
    switch (cardStatus) {
        case cardParameters.cardStatus.requested: {
            requestedCardContainer.append(card);
            break;
        }
        case cardParameters.cardStatus.inProgress: {
            inProgressCardContainer.append(card);
            break;
        }
        case cardParameters.cardStatus.completed: {
            completedCardContainer.append(card)
        }
    }
}


// differentiating the card according to type
function categorizeCards(card, cardType) {
    switch (cardType) {
        case cardParameters.cardType.feature: {
            card.classList.add("display-requested-card-type");
            card.childNodes[1].childNodes[1].classList.add("feature")
            break;
        }
        case cardParameters.cardType.enhancement: {
            card.classList.add("display-in-progress-card-type");
            card.childNodes[1].childNodes[1].classList.add("enhancement")
            break;
        }
        case cardParameters.cardType.bug: {
            card.classList.add("display-completed-card-type");
            card.childNodes[1].childNodes[1].classList.add("bug")
            break;
        }
    }
}


// sorting the cards according to type
function sortCards() {

    emptyContainers(requestedContainerNode)
    emptyContainers(inProgressCardContainer)
    emptyContainers(completedContainerNode)

    sortCardElement.value === cardParameters.sortValue.ascending ? cards.sort((a, b) => {
        return a.priority - b.priority
    }) : cards.sort((a, b) => {
        return b.priority - a.priority;
    })

    cards.map(card => {
        createCard(card)
    })
}

function emptyContainers(cardContainers) {
    while (cardContainers.hasChildNodes()) {
        cardContainers.removeChild(cardContainers.firstChild)
    }
}
sortCardElement.addEventListener("input", sortCards)


// adding drag and drop functionality to cards

//highlighting the card containers when dragging
function highlightContainers(newCard) {
    newCard.addEventListener("dragstart", (e) => {
        draggedItem = e.target;
        switch (draggedItem.parentElement) {
            case requestedCardContainer:
                inProgressCardContainer.classList.add("dotted-border")
                break
            case inProgressCardContainer:
                requestedCardContainer.classList.add("dotted-border")
                completedCardContainer.classList.add("dotted-border")
                break
            default:
                break
        }
    })
    newCard.addEventListener("dragend", () => {
        requestedCardContainer.classList.remove("dotted-border")
        completedCardContainer.classList.remove("dotted-border")
        inProgressCardContainer.classList.remove("dotted-border")
    })
}

//Checking the authentication of the card while dragging over
requestedCardContainer.addEventListener("dragover", e => {
    draggedItem.parentElement === inProgressCardContainer && e.preventDefault();
})
inProgressCardContainer.addEventListener("dragover", e => {
    draggedItem.parentElement === requestedCardContainer && e.preventDefault();
})
completedCardContainer.addEventListener("dragover", e => {
    draggedItem.parentElement === inProgressCardContainer && e.preventDefault();
})

//dropping the card
requestedCardContainer.addEventListener("drop", dropCard);
inProgressCardContainer.addEventListener("drop", dropCard);
completedCardContainer.addEventListener("drop", dropCard);

function dropCard(e) {
    cards.map(value => {
        if (+value.id === +draggedItem.dataset.id) {
            debugger;
            draggedItem.remove();
            switch (value.cardStatus && e.target) {
                case cardParameters.cardStatus.requested && inProgressCardContainer:
                    value.cardStatus = cardParameters.cardStatus.inProgress
                    break;
                case cardParameters.cardStatus.inProgress && completedCardContainer:
                    value.cardStatus = cardParameters.cardStatus.completed
                    break;
                case cardParameters.cardStatus.inProgress && requestedCardContainer:
                    value.cardStatus = cardParameters.cardStatus.requested
                    break;
                default:
                    return 0;
            }
            createCard(value);
            sortCards();
        }
    })
}

