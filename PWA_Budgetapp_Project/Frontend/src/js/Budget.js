
/**
 * @classdesc Denna klass representerar ett budget objekt.
 * Klassen behandlar skapandet av en budget och lägger in 
 * datan i databasen (indexedDB).
 * 
 * @method endOfMonth tar emot ett Date object och
 * returnerar datument i ett annat format. 
 * 
 * @method setObjectStore behandlar insättningen av data
 * till indexedDB.
 * 
 */

class Budget {

   
    constructor(title, sum){
        this.title = title;
        this.sum = sum;
        this.toast = new Toast();
        this.date = new Date();
        this.endDate = new Date();
        if(title && sum){
        this.setObjectStore(this.title, this.sum, this.date.toLocaleDateString(),  this.endOfMonth(this.endDate));
        }
    }


    /**
     * 
     * @param {Object} date 
     * @returns ett passande format som sträng. 
     */


    endOfMonth(date){

        let lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        let year = lastDayOfMonth.getFullYear();
        let month = String(lastDayOfMonth.getMonth() + 1).padStart(2, '0');
        let day = String(lastDayOfMonth.getDate()).padStart(2, '0'); 

        return `${year}-${month}-${day}`;  // Returnerar i formatet yyyy-mm-dd
    }



   /**
    * Samtliga parametrar är argument från From klassen
    * @param {String} title Budgetens titel 
    * @param {Number} sum Budgetens summa
    * @param {String} date Datumet budgeten lades till
    * @param {String} dateEnd Sista datumet på månaden
    */
    setObjectStore(title, sum, date, dateEnd) {

        const request = window.indexedDB.open("Budgetdb", 1);
        let budgetTitle = document.getElementsByClassName("budgetTitle");
         
        request.onerror = (e) => {
          console.error("An error occured with the database: ", e);
            this.toast.loadToast(`An error occurred with the database! Message: ${e}`, "error");
            if (navigator.vibrate) {
                navigator.vibrate(500); 
            }
        };

        request.onsuccess = () => {
            const db = request.result;
            const budTrans = db.transaction("Budget", "readwrite");
            const store = budTrans.objectStore("Budget");

            budTrans.onerror = (e) =>{
            console.error("Transaction error:", e.target.error);
            // Toast notifikation till användaren
            this.toast.loadToast("Error, Failed to add budget!", "error");

            // låter också Vibrate API köra i en halv sekund.
            if (navigator.vibrate) {
                navigator.vibrate(500); 
            }
            };

            store.add({Title: title, Sum: sum, Date: date, Datend: dateEnd});
            budTrans.oncomplete = () => {

                // Toast notifikation till användaren
                this.toast.loadToast("Budget successfully added! Updating...", "success");

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

