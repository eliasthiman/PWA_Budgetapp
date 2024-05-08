/**
 * 
 * @classdesc Denna klass representarar den sida med samtliga 
 * tillhörande element som visas när användaren klickar på en budget.
 * Klassen körs på sidan budget.html som ska vara en template för 
 * en utvald budget från huvudsidan. 
 * 
 * Med denna klass kan en användaren se mer information såsom 
 * namnet på budgeten, när den skapades, hur mycket som är kvar 
 * av budgeten jämfört med originalsumman, detta visualiseras
 * också med inte bara siffror men även grafisk och i antal procent.
 * 
 * Här kan användaren också se mer informatin om utgifterna och 
 * radera enskilda utgifter till budgeten. Användaren kan även
 * radera hela budgeten och dessa samtliga tillhörande utgifter
 * i ett knapptryck. 
 * 
 * 
 * @method setTimeout Denna metod sätter en lite timout så 
 * att sidan kan få sin inladdningsanimation. Applikationen är 
 * relativt snabb, och speciellt när service-workern har cachat datan.
 * 
 * 
 * @method fetchData Precis som i klassen Home hämtar denna klass även 
 * in data från databasen. Denna gången hämtar jag in den specifika 
 * budgeten, alltså den vi klickade på och sedan alla de relaterade 
 * utgifterna.
 * 
 * 
 * @method createContent Skapar precis som i klassen Home 
 * alla DOM element. Samt kopplar vi på händelsehanterare till
 * alla knappar.
 * 
 * @method deleteBudget Denna metod raderar budgeten och samtliga 
 * relaterade utgifter. Tar emot ett argument vilket är budgetens id.
 * 
 * @method deleteExpense Raderar vald utgift. Denna metod tar även
 * emot förutom id till utgiftens FK, en boolean för att
 * kolla om jag vill ha confirm prompten eller ej. 
 * På detta vis behöver jag bara ha en metod istället
 * för två olika deleteExpense metoder. 
 * 
 */

class SelectedBudget{
  constructor(){


    try {
     
      this.urlParams = new URLSearchParams(window.location.search);
      this.budgetID = this.urlParams.get('id');

  } catch (error) {

      console.error("An error occurred while parsing query parameters:", error);
      window.location.href = "/404.html";
  }

      this.db = new DB();
      this.toast = new Toast();
      this.budgetArray = [];
      this.expenseArray = [];
      this.expenseTotals = [];

      setTimeout(function() {
        
        const loader = document.getElementById("loader2");
        loader.classList.add("loader2--hidden"); 
    
        setTimeout(function() {
          loader.remove();
        }, 600); 
    }, 1000);   
    this.fetchData();
  }


  async fetchData() {

    try {
        const budgetData = await this.db.fetchSpecificBudget(Number(this.budgetID));
        this.budgetArray = budgetData;
        
    } catch (error) {
        console.error("Error fetching budget data:", error);
    }

    try {
        const expenseData = await this.db.fetchRelatedExpense(Number(this.budgetID));
        this.expenseArray = expenseData;
        
    } catch (error) {
        console.error("Error fetching expense data:", error);
    }

    this.createContent(); 
}

  async createContent(){

    const budgetData = this.budgetArray; 
    const expenseData = this.expenseArray;
      
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
      budget.createSelectedWindow(budgetData[i].id, budgetData[i].Sum, budgetData[i].Date, budgetData[i].Datend);
    }
    
    for(let i = 0; i < expenseData.length; i++){
      let expense = new Window(expenseData[i].Title, expenseData[i].Sum);
      expense.createExpElemWindow(expenseData[i].Date, expenseData[i].id, expenseData[i].BudgetID);
    }


    
/*

Lägger på händelsehanterare för utgiftenas raderingsknapp, kopplar deleteExpense.

*/
  const expDelBtns = document.querySelectorAll("#expense-delete-button");
  if (expDelBtns.length > 0) {
      expDelBtns.forEach(expDelBtn => {
          expDelBtn.addEventListener("click", (e) => {
              this.deleteExpense(e.target.dataset.id, true);
          });
      });
  } else {
      console.log("No expenses created yet.");
  }


/*

Lägger på händelsehanterare för budgetens raderingsknapp

*/

  const budDelBtn = document.querySelector(".budget-delete-button");  
  if(budDelBtn){
     budDelBtn.addEventListener("click", (e) => {
        this.deleteBudget(e.target.dataset.id);
    })
  }
  else{
    console.log("this budget does not exist!");
  }

/*

Lägger på händelsehanterare för tillbakaknappen.

*/

  const backBtn = document.querySelector(".backBtn");
  backBtn.addEventListener("click", () => {
    location.href = "/index.html";
  })
}


  async deleteBudget(budgetID){
    const confirmed = window.confirm("Are you sure you want to delete this budget? (Notice! this will also delete all of the related expenses to this budget!)");

    if (confirmed) {
        try {
          // raderar alla utgifter genom att loopa igenom expenseArray
          for (let i = 0; i < this.expenseArray.length; i++) {
              await this.deleteExpense(this.expenseArray[i].id, false);
          }

          // efteråt raderas budgeten
          console.log("budget id for deletion: ", budgetID);
          await this.db.deleteBudget(Number(budgetID));
          console.log("Budget and its related expenses deleted successfully.");
          
          this.toast.loadToast("Successfully Deleted!, updating...", "success");

          if (navigator.vibrate) {
              navigator.vibrate(500); 
          }
          setTimeout(() => {
            location.href = "/index.html";
          }, 1000);


      } catch(error) {
          console.log("Failed to delete budget and related expenses: ", error);
          this.toast.loadToast("Failed to delete budget and related expenses!", "error");

          if (navigator.vibrate) {
              navigator.vibrate(500); 
          }
      }
    } else {
        console.log("Deletion canceled");
    }
}
 


  async deleteExpense(elementID, confirmation){

    if(confirmation === false){
      try{
        await this.db.deleteExpense(Number(elementID));
        console.log("Expenses deleted successfully");
        
        }
        catch(error){
        console.log("Failed to delete expenses: ", error);
        this.toast.loadToast("Failed to delete related expenses!", "error");

        if (navigator.vibrate) {
            navigator.vibrate(500); 
        }
        }
    }
    else{
      const confirmed = window.confirm("Are you sure you want to delete this expense?");
  
      if (confirmed) {
        
        try{
        await this.db.deleteExpense(Number(elementID));
        console.log("Expense deleted successfully");
        this.toast.loadToast("Successfully Deleted!, updating...", "success");

        if (navigator.vibrate) {
            navigator.vibrate(500); 
        }
        setTimeout(() => {
          location.reload();
        }, 1000);
        }
        catch(error){
        console.log("Failes to delete expense: ", error);
        this.toast.loadToast("Failed to Delete!", "error");

        if (navigator.vibrate) {
            navigator.vibrate(500); 
        }

        }
      } else {
    
        console.log("Deletion canceled"); 
    
      }
    }
  }  
}

window.addEventListener("load", () => new SelectedBudget());  