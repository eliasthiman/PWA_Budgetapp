/**
 * @classdesc 
 * Denna klass skapar och hanterar databasen med flertalet metoder
 * för olika quires och operationer
 */

class DB {

    /** 
     *  @constructor 
     *  Budgetdb är det namn databasen kommmer att ha när den skapas
     *  dbVersion bestämmer vilken version databasen ska ha. 
     *  I detta fall är den alltid 1.
     *  
     *  @var dbname databasnamn
     *  @var dbVersion databasversion
     *  
     */
    constructor() {
        this.dbname = "Budgetdb";
        this.dbVersion = 1;
}


    /**
     * @method createDatabase skapar databasen genom att först kolla om 
     * den aktuella webbläsaren stödjer någon form av version
     * av indexedDB. Vissa webbläsares indexedDB heter olika.
     * 
     * @constant request Öppnar en anslutning till databasen
     * @constant budgetStore Skapar en tabell för att lagra budgetar
     *                       samt lägger till olika indexering som 
     *                       kan komma till användning.
     * 
     * @constant expenseStore Skapar en tabell för utgifterna med
     *                        indexering som senare används för hämta
     *                        totala summan i utgifter och skapar även 
     *                        här en simulering av "foreign key".
     * 
     * Samtliga tabeller har även auto increment på så att det ska 
     * få sina unika id nummer!
     * 
     */

    createDatabase() {
        const indexedDB =
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB; 

        if (!indexedDB) {
        console.log("IndexedDB could not be found in this browser.");
        }

        ///////////////////////Ordnar anslutning till indexedDB databasen////////////////////////////
        const request = window.indexedDB.open(this.dbname, this.dbVersion);
            
        request.onerror = (e) => {
            console.error("An error occured with the database: ", e);
        }

        request.onupgradeneeded = () => { 
        const db = request.result;
        const budgetStore = db.createObjectStore('Budget', { keyPath: 'id', autoIncrement: true });
        budgetStore.createIndex("budTitle", ["Title"]);
        budgetStore.createIndex("budSum", ["Sum"]);
        budgetStore.createIndex("budId", ["id"]);
        const expenseStore = db.createObjectStore('Expense', {keyPath: 'id', autoIncrement: true }); 
        expenseStore.createIndex("expSum", ["Sum"]);
        expenseStore.createIndex("corrolated_exp", ["BudgetID"]); 
        }

        request.onsuccess = () => {

        console.log("database created! ");
    }
}



///////////////////////////////Hämtar data och skapar mina objekt med tillhörande data///////////////////////////////////


/**
 * 
 * @method fetchBudgetData hämtar all data från tabellen "Budget"
 * @returns en promise från query
 * 
 */

fetchBudgetData(){

    return new Promise((resolve, reject) => {

    const request = window.indexedDB.open(this.dbname, this.dbVersion);

    request.onsuccess = () =>{

        const db = request.result;
        const budTrans = db.transaction("Budget", "readwrite");
        const budStore = budTrans.objectStore("Budget");
        const budAllQuery = budStore.getAll();

        budAllQuery.onsuccess = () =>{
         const data = budAllQuery.result;
         resolve(data);
         db.close();
        };
    

        budAllQuery.onerror = (e) =>{
            console.error("error: ", e , budAllQuery.result);
            reject(e); 
            db.close();
        
        };
    };

        request.onerror = (e) => {
            reject(e);
        };
    });
}

/**
 * 
 * @method fetchBudgetData hämtar all data från tabellen "Expense"
 * 
 * @returns en promise från query
 */

fetchExpenseData(){

    return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(this.dbname, this.dbVersion);

    request.onsuccess = () =>{

        const db = request.result;
        const expTrans = db.transaction("Expense", "readwrite");
        const expStore = expTrans.objectStore("Expense");
        const expAllQuery = expStore.getAll();

        expAllQuery.onsuccess = () =>{
            const data = expAllQuery.result;
            resolve(data);
            db.close();
           };
       
   
           expAllQuery.onerror = (e) =>{
               console.error("error: ", e , expAllQuery.result);
               reject(e);
               db.close(); 
           
           };
        };
   
        request.onerror = (e) => {
            reject(e);
        };
    });
} 


/**
 * 
 * @method fetchExpensesTotal Hämtar alla utgifter som är relaterade 
 * med budgeten, budgetens nummer är den FK utgiften lagrar
 *
 * @param {Number} budgetID budgetens id nummer.
 * @returns en promise från query, alltså exakt alla utgifter 
 * som stämmer överens med indexet. 
 */
// hämtar den totala summan utgifter kopplade till en budget 

fetchExpensesTotal(budgetID){

    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(this.dbname, this.dbVersion);
        let total = 0;

        request.onsuccess = () => {
            const db = request.result;
            const expTrans = db.transaction("Expense", "readwrite");
            const expStore = expTrans.objectStore("Expense");
            const corrExpIndex = expStore.index("corrolated_exp");
            const expAllQuery = corrExpIndex.getAll([budgetID]);

            expAllQuery.onsuccess = () => {
                const data = expAllQuery.result;
            //    console.log("fetchExpenses: ", data);
                for(let i = 0; i < data.length; i++){
                    total += data[i].Sum;
                }
                resolve(total);
                db.close();
            };

            expAllQuery.onerror = (e) => {
                reject(e);
                db.close();
            };
        };

        request.onerror = (e) => {
            reject(e);
        };
    });
}




/**
 * Hämtar all data om den budget genom ett specifikt tillhörande id.
 * @method fetchSpecificBudget 
 * 
 * 
 * @param {Number} budgetID  tillhörande budget id.
 * @returns en promise från query,
 */

fetchSpecificBudget(budgetID){

    
    return new Promise((resolve, reject) => {

        const request = window.indexedDB.open(this.dbname, this.dbVersion);
    
        request.onsuccess = () =>{
    
            const db = request.result;
            const budTrans = db.transaction("Budget", "readwrite");
            const budStore = budTrans.objectStore("Budget");
            const budgetIndex = budStore.index("budId")
            const budAllQuery = budgetIndex.getAll([budgetID]);
    
            budAllQuery.onsuccess = () =>{
             const data = budAllQuery.result; 
             resolve(data);
             db.close();
            };
        
    
            budAllQuery.onerror = (e) =>{
                console.error("error: ", e , budAllQuery.result);
                reject(e);
                db.close(); 
            
            };
        };
    
            request.onerror = (e) => {
                reject(e);
            };
    });
}





/**
 * Hämtar alla utgifter kopplade till en viss budget via dess id.
 * @method fetchRelatedExpense 
 * @param {Number} budgetID Budgetens unika id
 * @returns returnerar ett promise object från query
 */

fetchRelatedExpense(budgetID){

    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(this.dbname, this.dbVersion);
        let total = 0;

        request.onsuccess = () => {
            const db = request.result;
            const expTrans = db.transaction("Expense", "readwrite");
            const expStore = expTrans.objectStore("Expense");
            const corrExpIndex = expStore.index("corrolated_exp");
            const expAllQuery = corrExpIndex.getAll([budgetID]);

            expAllQuery.onsuccess = () => {
                const data = expAllQuery.result;
                resolve(data);
                db.close();
            };

            expAllQuery.onerror = (e) => {
                reject(e);
                db.close();
            };
        };

        request.onerror = (e) => {
            reject(e);
            
        };
    });

}




/**
 * Raderar en specifikt utgift genom dess id-nummer
 * @method deleteExpense 
 * 
 * @param {Number} elementID utgiftens id-nummer
 * @returns returnerar ett promise object från query
 */

deleteExpense(elementID){

    return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("Budgetdb", 1);
    
    request.onsuccess = () => {
        const db = request.result;
        const expTrans = db.transaction("Expense", "readwrite");
        const store = expTrans.objectStore("Expense");
        const deleteRequest = store.delete(elementID);

        deleteRequest.onsuccess = () => {
            console.log("Expense deleted successfully");
            const tableRow = document.querySelector(`button[data-id="${elementID}"]`);
            if (tableRow) {
              tableRow.remove();
              console.log("Table row removed from DOM");
              expTrans.oncomplete = () =>{
                db.close();
        
                resolve();
            }
              
            } else {
                console.log("Table row not found in DOM");
                reject(new Error("Table row not found in DOM"));
            }
        }
    
        deleteRequest.onerror = (e) => {
            console.error("Error deleting expense: ", e);
            reject(e);
        }
    } 

    request.onerror = (e) => {
        console.log("Error opening database: ", e);
        reject(e);
    };

});

}


/**
 * Raderar en budget
 * @method deleteBudget
 * 
 *
 * @param {Number} budgetID budgetens id-nummer
 * @returns returnerar ett promise object från query
 */

deleteBudget(budgetID){

    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("Budgetdb", 1);
        
        request.onsuccess = () => {
            const db = request.result;
            const budTrans = db.transaction("Budget", "readwrite");
            const store = budTrans.objectStore("Budget");
            const deleteRequest = store.delete(Number(budgetID));
    
            deleteRequest.onsuccess = () => {
                console.log("Budget deleted successfully");
                budTrans.oncomplete = () =>{
                db.close();
                resolve();
            }
            deleteRequest.onerror = (e) => {
                console.error("Error deleting expense: ", e);
                reject(e);
            }
        } 
    
        request.onerror = (e) => {
            console.log("Error opening database: ", e);
            reject(e);
        };
    
    }});
    
}


}