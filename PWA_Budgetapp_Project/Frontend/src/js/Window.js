/**
 * createDOMElement är en "helper function" för att skapa DOM element lättare
 * @param {String} tagName bestämmer vad för typ av dom element som ska skapas
 * @param {String} innerHTMLContent bestämmer vad som kan eventuellt stå i innerHTML
 * @param {String} classname Namnet på den klass 
 * @param {String} idName 
 * @returns 
 */


function createDOMElement(tagName, innerHTMLContent, classname, idName) {
  const element = document.createElement(tagName);
  if(innerHTMLContent){
    element.innerHTML = innerHTMLContent; 
  }
  if(classname){
    element.className = classname;
  }
  else if(idName){
    element.id = idName;
  }
  return element;
}


/**
 * @classdesc Denna klass skapar precis alla objekt för DOM element
 * Genom denna klass kan applikationen skapa ett Window objekt med 
 * DOM element var som helst. 
 * Klassen konstruktor taremot en titel och en summa för antingen 
 * en budget eller utgift. Sedan har självase metoderna specifika 
 * parametrar som fyller sitt egna syfte beronde på situation. 
 * Konstruktorn skapar även en instans av databas objektet så att 
 * man kan använda dess metoder var som helst klassens metoder.
 * 
 * Klassen används främst för klasserna Home, Suggestion och SelectedBudget
 * för att skapa objekten, DOM element och fylla i information i de DOM element 
 * som redan existerar som templates i html filerna. 
 * 
 *  
 * @method createSelectedWindow Kanske verkar ett rörigt namn, men vad denna metod
 * gör är att den fyller DOM elementen med den information vi ger den i SelectedBuget klassen.
 * Samt styr den lite över grafiken i progressbar. Metoden har fyra parametrar 
 * en för budgetens id den originala budgetens summa och två datum, när den skapades och när 
 * månaden slutar. Denna metod används i klassen SelectedBudget.
 * 
 * @method createExpElemWindow Även lite rörigt namn här. Denna metod har 3 parametrar
 * utgiftens datum när den skapades, dess id och den relaterade budgetens id (FK).
 * 
 * 
 * @method createBudgetWindow sköter skapandet av budgetelement i Home klassen 
 * (huvudsidan).
 * 
 * @method createExpenseElement skapar alla utgifts element i Home klassen 
 * (huvudsidan).
 * 
 * @method createColElement används i Suggestion klassen och skapar de DOM 
 * element som behövs och populerar dem med den information som behövs 
 * för att visa information till användaren om förslag på budgetstorlek. 
 * 
 */



class Window {

/**
 * 
 * @param {String} title 
 * @param {Number} sum 
 */

constructor(title, sum) {
  this.title = title;
  this.sum = sum;
  this.db = new DB();
}


createSelectedWindow(id, ogBudgetSum, dateStart, dateEnd){


  const deleteTitle = document.getElementById("delete-title");
  deleteTitle.dataset.id = id; 

  const deleteButton = document.querySelector(".budget-delete-button");
  deleteButton.dataset.id = id;

  let budgetHeader = document.getElementsByClassName("budget-header-title")[0];
  budgetHeader.innerHTML = this.title;

  let budgetBody = document.getElementsByClassName("budget-container-selected")[0];
  budgetBody.dataset.id = id;

  let budgetDateStart = document.getElementById("budget-date-start");
  budgetDateStart.innerHTML = dateStart;

  let budgetDateEnd = document.getElementById("budget-date-end");
  budgetDateEnd.innerHTML = dateEnd;

  let progressAmount = document.getElementsByClassName("progess-amount")[0];
  let progressFiller = document.getElementsByClassName("progress-bar-filler")[0];

  let percent = Math.floor(100 - ((this.sum / ogBudgetSum) * 100));


  if(percent === Infinity){
    percent = 0;
  }
  else if(percent >= 100){
    percent = 100;
    progressFiller.style.backgroundColor = `rgb(194, 25, 25)`;
  }
  else if (percent >= 70){
    percent = percent;
    progressFiller.style.backgroundColor = `rgb(255, 200, 47)`;
  }

  progressFiller.style.width = `${percent}%`;
  progressAmount.innerHTML = `${percent}%`;

  let budgetSum = document.getElementById("sum-ogsum");
  budgetSum.innerHTML = `${this.sum} remaing of ${ogBudgetSum}`; 
} 


createExpElemWindow(date, id, budgetID){

  const budgetBody = document.getElementsByClassName("budget-container-selected")[0];
  const expenseElement = createDOMElement("div", null, "expense-element-selected", null);
  expenseElement.dataset.fk = budgetID;
  const expenseTitle = createDOMElement("p", this.title, null, null);
  const expenseSum = createDOMElement("p", this.sum, null, null);
  const expenseDate = createDOMElement("p", date, null, null);

  const deleteButton = createDOMElement("button", "&#10006;", null, "expense-delete-button"); 
  deleteButton.dataset.id = id;
  deleteButton

  expenseElement.appendChild(expenseTitle);
  expenseElement.appendChild(expenseSum);
  expenseElement.appendChild(expenseDate);
  expenseElement.appendChild(deleteButton);
  budgetBody.appendChild(expenseElement);


}




createBudgetWindow(id, ogBudgetSum, date){

  const mainBody = document.getElementsByClassName("container budget")[0];
  const objectElement = createDOMElement("div", null, "budget-window", null);
  objectElement.dataset.id = id;
  objectElement.addEventListener("click", () =>{
    location.href = objectLink;
  });
  const objectTitle = createDOMElement("h3", `${this.title} | ${date}`, null, null);
  const objectText = createDOMElement("p", `${this.sum} / ${ogBudgetSum}`, null, null);
  const objectBtn = createDOMElement("Button", "&#9998;", null, "bugdet-button-home");
  const objectLink = createDOMElement("a", null, "budget-link", null);
  objectLink.href = `budget.html?id=${id}`;

  objectLink.appendChild(objectBtn);
  objectElement.appendChild(objectTitle);
  objectElement.appendChild(objectText);
  objectElement.appendChild(objectLink);
  mainBody.appendChild(objectElement); 
}


createExpenseElement(budget, id){
  const expenseBody = document.getElementsByClassName("container expense-container")[0];
  const tableRow = createDOMElement("div", null, "expense-spec-list", null);
  tableRow.dataset.id = id;
  const tableItemTitle = createDOMElement("p", this.title, null, null);
  const tableItemSum = createDOMElement("p", this.sum, null, null);
  const tableItemBudget = createDOMElement("p", budget, null, null);

  expenseBody.appendChild(tableRow);
  tableRow.appendChild(tableItemTitle); 
  tableRow.appendChild(tableItemSum);
  tableRow.appendChild(tableItemBudget); 
  }


createColElement(budgetSum, size, category){

  const parentBox = document.getElementsByClassName("col-output")[0];
  const suggestionBox = createDOMElement("div", null, "suggestion-box", null);
  const loader = createDOMElement("div", null, "loader", null);

  
  suggestionBox.appendChild(loader);
  parentBox.appendChild(suggestionBox);

  
  setTimeout(() => {
     
      loader.classList.add("loader--hidden");

      const grammar = size > 1 ? "people" : "person";
      const title = createDOMElement("h3", `Average monthly ${category} budget for ${size} ${grammar}.`, null, "title");
      title.value = title;

      const suggestionBudget = createDOMElement("h3", `${budgetSum} SEK`, null, "budget");
      suggestionBudget.value = budgetSum;
      const answerBox = createDOMElement("div", null, "answer-box", null);
      const prompTitle = createDOMElement("h4", "Would you like to create this budget?", null, null);

      const yesBtn = createDOMElement("button", "Yes", null, "answer-Btn Yes");
      yesBtn.addEventListener("click", () => {
          let budget = new Budget(`${category} for ${size} ${grammar}`, budgetSum);
      });

      const noBtn = createDOMElement("button", "No", null, "answer-Btn No");
      noBtn.addEventListener("click", () => {
          location.reload();
      });

      suggestionBox.removeChild(loader);
      answerBox.appendChild(yesBtn);
      answerBox.appendChild(noBtn);
      suggestionBox.appendChild(title);
      suggestionBox.appendChild(suggestionBudget);
      suggestionBox.appendChild(prompTitle);
      suggestionBox.appendChild(answerBox);
  }, 2000); 
}
  
}