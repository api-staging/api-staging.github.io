const cf = window.config?.visitorRegister || {
    strings: {
        anon_name: "Anonymous"
    }
};
const overlay = document.createElement('div');
overlay.id = 'popupOverlay';
overlay.classList.add("hidden");
const popupBox = document.createElement('form');
popupBox.id = 'popupBox';
popupBox.action = "https://api.web3forms.com/submit";
popupBox.method = "POST";
popupBox.className = 'bcon light huge';
// const title = document.createElement("p");
// title.classList.add("t3", "mono-thick");
// title.textContent = "Like what you see?";
// popupBox.appendChild(title);
const accessKey = document.createElement('input');
accessKey.type = "hidden";
accessKey.name = "access_key";
accessKey.value = "8c2a64c4-19d3-4b9b-8146-67def846696d";
const nameGroup = document.createElement('div');
nameGroup.className = 'input-group';
const nameLabel = document.createElement('p');
nameLabel.className = 'input-label';
nameLabel.textContent = 'name';
const nameInput = document.createElement('input');
nameInput.type = 'text';
nameInput.name = "name";
nameInput.classList.add('input-field', 'caseless');
nameGroup.appendChild(nameLabel);
nameGroup.appendChild(nameInput);
const companyGroup = document.createElement('div');
companyGroup.className = 'input-group';
const companyLabel = document.createElement('p');
companyLabel.className = 'input-label';
companyLabel.textContent = 'company';
const companyInput = document.createElement('input');
companyInput.type = 'text';
companyInput.name = "company";
companyInput.classList.add('input-field', 'caseless');
companyGroup.appendChild(companyLabel);
companyGroup.appendChild(companyInput);
const buttonGroup = document.createElement('div');
buttonGroup.className = 'button-group';
const confirmButton = document.createElement('input');
confirmButton.type = 'submit';
confirmButton.className = 'bcon btn light minimal';
confirmButton.textContent = 'confirm details';
const closeButton = document.createElement('button');
closeButton.type = 'button';
closeButton.className = 'bcon btn light minimal';
closeButton.textContent = 'abstain for now';
buttonGroup.appendChild(confirmButton);
buttonGroup.appendChild(closeButton);
popupBox.appendChild(accessKey);
popupBox.appendChild(nameGroup);
popupBox.appendChild(companyGroup);
popupBox.appendChild(buttonGroup);
overlay.appendChild(popupBox);
document.body.appendChild(overlay);

if ((!sessionStorage.getItem("visitor")) || (!sessionStorage.getItem("company"))) overlay.classList.remove("hidden");

function registerVisitor(anonymousCheckBoolean) {
    sessionStorage.setItem("visitor", anonymousCheckBoolean ? cf.strings.anon_name : nameInput.value);
    sessionStorage.setItem("company", anonymousCheckBoolean ? cf.strings.anon_name : companyInput.value);
}
function checkIsResponseDelivered(response) {
    response.json();
}
popupBox.addEventListener('submit', function(event) {
    event.preventDefault();
    registerVisitor(false);
    overlay.classList.add("hidden");
    const formData = new FormData(event.target);
    fetch(event.target.action, {
        method: event.target.method,
        body: formData
    }).then(checkIsResponseDelivered);
});

closeButton.addEventListener('click', function(event) {
    event.preventDefault();
    registerVisitor(true);
    overlay.classList.add("hidden");
    const formData = new FormData(event.target);
    fetch(event.target.action, {
        method: event.target.method,
        body: formData
    }).then(checkIsResponseDelivered);
});