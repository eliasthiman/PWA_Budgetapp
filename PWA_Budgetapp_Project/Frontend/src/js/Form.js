/**
 * @classdesc Behandlar all formData och skapar sedan 
 * instans av Budget eller Expense eller Suggestion beroende
 * på vad för formdata som kommer in. Formdatan kommer först
 * in till @method handleForms 
 * 
 * Sedan används @method submitForms för att skapa en instans
 * av passande objekt och skickar även här med de argument 
 * som de olika objekten ska ha. Till exempel titel och 
 * summa. 
 * 
 */
class Form {

    constructor(){
        this.onViewRender();
    }
    
    
  /**
   * 
   * @param {Object} budgetFormData 
   * @param {Object} expenseFormData 
   * @param {Object} colFormData 
   */

   async submitForms(budgetFormData, expenseFormData, colFormData) {
      
    ////////////////////Budget///////////////////////////

    if (budgetFormData && budgetFormData.get("budgetTitle")) {
    let budgetTitle = budgetFormData.get("budgetTitle");
    let budgetSum = parseFloat(budgetFormData.get("budgetAmount"));
    let budget = new Budget(budgetTitle, budgetSum);

    /*  Denna konsol log kan användas för att kolla varje key value par 
        i budgetFormData. För felsökning.

      for (let [key, value] of budgetFormData.entries()) {
        console.log(`${key}: ${value}`); 
    }*/
  }
    //--------------------------------------------------------

    ////////////////////Expense///////////////////////////
    else if (expenseFormData && expenseFormData.get("expenseTitle")) {
    let expenseTitle = expenseFormData.get("expenseTitle");
    let expenseSum = parseFloat(expenseFormData.get("expenseAmount"));
    let expenseBudget = expenseFormData.get("budgetPick");
    let budgetList = document.getElementById("budgetPick");

    let selectedOption = budgetList.querySelector(`option[value="${expenseBudget}"]`);
    let budgetID = selectedOption.getAttribute('data-id');  
    
    let expense = new Expense(expenseTitle, expenseSum, expenseBudget, budgetID);

    /*  Denna konsol log kan användas för att kolla varje key value par 
        i expenseFormData. För felsökning.

      for (let [key, value] of expenseFormData.entries()) {    
        console.log(`Key value pair: ${key}: ${value}`);
    }*/
  }
  else if(colFormData && colFormData.get("cityPick")) {
    let city = colFormData.get("cityPick");
    let category = colFormData.get("categoryPick");
    let size = colFormData.get("householdPick");
    let suggestion = new Suggestion(city,category,size);
  }
}

  async handleForms() {

    ////////////////////Budget///////////////////////////
    const budgetForm = document.getElementById('budgetForm');
    budgetForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const budgetFormData = new FormData(budgetForm);
        await this.submitForms(budgetFormData, null);
        budgetForm.reset();

    });
    //--------------------------------------------------------

    ////////////////////Expense///////////////////////////
    const expenseForm = document.getElementById('expenseForm');
    expenseForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const expenseFormData = new FormData(expenseForm);
        await this.submitForms(null, expenseFormData);
        expenseForm.reset();
    }); 


    const costOfLivingForm = document.getElementById('col');
    costOfLivingForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const title = document.getElementsByClassName("col-title")[0];
      title.style.display = "none";

      const city = document.getElementsByClassName("form-group city")[0];
      city.style.display = "none";

      const category = document.getElementsByClassName("form-group category")[0];
      category.style.display = "none";
      
      const household = document.getElementsByClassName("form-group household")[0];
      household.style.display = "none";

      const btn = document.getElementsByClassName("addBtn colBtn")[0];
      btn.style.display = "none";

      const formData = new FormData(costOfLivingForm);
      await this.submitForms(null, null, formData);
  }); 


}

    async onViewRender() {
        await this.handleForms();
    }  

}