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
 * @classdesc Denna klass representarar applikationens "home-page"
 * eller "landing-page". I denna klass skapas en instans av databasen 
 * så att den kan användas för att hämta data från den. Sedan skapas 
 * databasen genom createDatabase(); så att vi har en databas att jobba
 * med. 
 * 
 * Tanken är att databasen ska få instanseras här och skapa sin databas
 * eftersom det är denna klass som ska representara huvudsidan. Sedan 
 * behövs även instansen av databasen användas i resten av i koden i 
 * denna klass. 
 * 
 * @method fetcData hämtar all data från budget och expense tabellerna
 * och lägger sedan in datan i varsin array. dessa arrayer är budgetArray
 * och expenseArray. Arrayerna skapas i Home konstruktorn.
 *
 * @method createContent denna metod använder nu all den data
 * som behövs när den skapar Window objekt vilket i sin tur skapar 
 * DOM elementen när den tar denna data som argument i sin konstruktor 
 * och metoder. Det är även här i denna metod där jag räknar ut hur 
 * pass mycket den total summan är för alla de utgifter som tillhör sin 
 * budget. Det är via metoden @method fetchExpensesTotal som detta görs.
 * 
 * 
 * 
 */

class Home {

  constructor() {
    this.budgetArray = [];
    this.expenseArray = [];
    this.expenseTotals = []; 
    this.db = new DB();
    this.db.createDatabase();
    this.fetchData();
    const col = new CostOfLiving(); 
    }


  async fetchData() {
    try {
        const budgetData = await this.db.fetchBudgetData();
        this.budgetArray = budgetData;
    } catch (error) {
        console.error("Error fetching budget data:", error);
    }

    try {
        const expenseData = await this.db.fetchExpenseData();
        this.expenseArray = expenseData;
    } catch (error) {
        console.error("Error fetching expense data:", error);
    }

    this.createContent(); 
}

  async createContent(){
   
  /*
    Användbara console loggar för att hålla koll på vad som finns
    inom det två arrayerna, "budgetArray" och "expenseArray" 
    under körning.

    console.log("BudgetArray", this.budgetArray); 
    console.log("ExpenseArray", this.expenseArray);

  */

  const budgetData = this.budgetArray; 
  const expenseData = this.expenseArray;

  try {
    for(let i = 0; i < this.budgetArray.length; i++){
      try{
        var expense = await this.db.fetchExpensesTotal(this.budgetArray[i].id);
        this.expenseTotals.push(expense);
      }
      catch (error){
        console.error("Error fetching expensesTotal data:", error);
      }

    } 

    for(let i = 0; i < budgetData.length; i++){
      
      let budget = new Window(budgetData[i].Title, (budgetData[i].Sum - this.expenseTotals[i]));
      budget.createBudgetWindow(budgetData[i].id, budgetData[i].Sum, budgetData[i].Date);

      ////////////////////skapar mina options//////////////////////////
      const bugdetDatalist = document.getElementById("budgetPick"); 
      const option = document.createElement("option");
      option.value = budgetData[i].Title; 
      option.innerHTML =  budgetData[i].Title; 
      option.dataset.id = budgetData[i].id;
      bugdetDatalist.appendChild(option); 
    }
    
    for(let i = 0; i < expenseData.length; i++){
      let expense = new Window(expenseData[i].Title, expenseData[i].Sum);
      expense.createExpenseElement(expenseData[i].Budget, expenseData[i].id);
    }
  }catch(error){
    console.log("failed to create elements: ", error);
  }
}

}