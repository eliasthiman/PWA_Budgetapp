/**
 * 
 * @classdesc Denna klass representerar ett utgifts objekt.
 * Klassen behandlar skapandet av en utgift och lägger in 
 * datan i databasen (indexedDB).
 *  
 * @method setObjectStore behandlar insättningen av data
 * till indexedDB.
 * 
 * 
 */



class Expense {

/**
 * 
 * @param {String} title 
 * @param {Number} sum 
 * @param {String} budget 
 * @param {Number} budgetID 
 */

constructor(title, sum, budget, budgetID){
    this.title = title;
    this.sum = sum;
    this.budget = budget;
    this.foreignKey = Number(budgetID);
    this.toast = new Toast();
    this.date = new Date();
    if(title && sum){
    this.setObjectStore(this.title, this.sum, this.budget, this.date.toLocaleDateString(), this.foreignKey);
    }
}

/**
 * 
 * @param {String} title 
 * @param {Number} sum 
 * @param {String} budget 
 * @param {String} date 
 * @param {Number} budgetID 
 */
setObjectStore(title, sum, budget, date, budgetID) {

    const request = window.indexedDB.open("Budgetdb", 1);
        
    request.onerror = (e) => {
        console.error("An error occured with the database: ", e);
        this.toast.loadToast("An error occurred with the database!", "error");

        // låter också Vibrate API köra i en halv sekund.
        if (navigator.vibrate) {
            navigator.vibrate(500); 
        }
    };

    request.onsuccess = () => {
        const db = request.result;
        const expTrans = db.transaction("Expense", "readwrite");
        const store = expTrans.objectStore("Expense"); 
       
        expTrans.onerror = (e) => {
            console.error("Transaction error:", e.target.error);
            this.toast.loadToast("Error, Failed to add expense!", "error");

            // låter också Vibrate API köra i en halv sekund.
            if (navigator.vibrate) {
                navigator.vibrate(500); 
            }
        };
        store.add({Title: title, Sum: sum, Budget: budget, Date: date, BudgetID: budgetID});
        expTrans.oncomplete = () => {
            this.toast.loadToast("Expense successfully added! Updating...", "success");

                // låter också Vibrate API köra i en halv sekund.
                if (navigator.vibrate) {
                    navigator.vibrate(500); 
                }

                setTimeout(() => {
                    location.reload();
                }, 1000);
            }
        }
    }
}