const defaultConfigObject = {
  titleClasses: ['upper', 'mono-thick', 't1'],
  navId: 'navigation',
  buttonClasses: ['navbutton', 'bcon', 'light', 'minimal', 'btn'],
  highlightedClasses: ['nav-button-highlight'],
};

class MyHeader extends HTMLElement {
  connectedCallback() {
    const contentString = this.textContent.trim();
    const linesArray = contentString.split('\n').map(lineString => lineString.trim()).filter(lineString => lineString);
    const highlightedIndex = parseInt(this.attributes.highlightedindex?.value.trim() || 1/0);
    
    if (linesArray.length === 0) return;
    
    const titleString = linesArray[0];
    const buttonLinesArray = linesArray.slice(1);
    
    this.textContent = '';
    const titleAttribute = this.attributes.title?.value;
    const buttonAttribute = this.attributes.button?.value;
    this.navbuttons = [];
    this.render(titleString, buttonLinesArray, highlightedIndex, {"title": (titleAttribute != undefined ? titleAttribute : "true") === "true", "button": (buttonAttribute != undefined ? buttonAttribute : "true") === "true"});
  }

  parseButtonLine(lineString) {
    const lastSpaceIndex = lineString.lastIndexOf(' ');
    
    if (lastSpaceIndex === -1) {
      return { text: lineString, href: null };
    }
    
    const textString = lineString.substring(0, lastSpaceIndex);
    const hrefString = lineString.substring(lastSpaceIndex + 1);
    
    return { text: textString, href: hrefString };
  }
  createTitle(titleString) {
    const titleElement = document.createElement('h1');
    titleElement.classList.add(...defaultConfigObject.titleClasses);
    titleElement.textContent = titleString;
    return titleElement
  }
  Button(buttonDataObject, highlighted) {
    const buttonElement = document.createElement('button');
    buttonElement.classList.add(...defaultConfigObject.buttonClasses);
    console.log(highlighted);
    if (highlighted) buttonElement.classList.add(...defaultConfigObject.highlightedClasses);
    buttonElement.textContent = buttonDataObject.text;
    return buttonElement;
  }
  alignButtonOnClick(buttonElement, buttonDataObject) {
    buttonElement.onclick = () => window.location.href = buttonDataObject.href;
  }
  createButtons(navElement, buttonLinesArray, highlightedIndex) {
    buttonLinesArray.forEach((lineString, index) => {
        const buttonDataObject = this.parseButtonLine(lineString);
        const buttonElement = this.Button(buttonDataObject, highlightedIndex === index);
        this.alignButtonOnClick(buttonElement, buttonDataObject);
        this.navbuttons.push({"data": buttonDataObject, "btn": buttonElement});
        navElement.appendChild(buttonElement);
    })
  }
  renderButtons(buttonLinesArray, highlightedIndex) {
    const navElement = document.createElement('div');
    navElement.id = defaultConfigObject.navId;

    this.createButtons(navElement, buttonLinesArray, highlightedIndex);
    return navElement;
  }
  render(titleString, buttonLinesArray, highlightedIndex, toRender) {
    const headerElement = document.createElement('header');
    let titleElement;
    let navElement;
    if (toRender.title) {
      titleElement = this.createTitle(titleString);
      headerElement.appendChild(titleElement);
    }
    if (toRender.button) {
      navElement = this.renderButtons(buttonLinesArray, highlightedIndex);
      headerElement.appendChild(navElement);
    }
    this.appendChild(headerElement);
  }
}
 
customElements.define('my-header', MyHeader);