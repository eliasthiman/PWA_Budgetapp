/**
 * @classdesc Klassen skapar och hanterar toast notifikationen 
 * som syns när en användare lyckas med en interaktion,
 * såsom skapandet av en budget eller radering av en utgift,
 * 
 * denna klass ingår i applikationes mikrointeraktion för feedback
 * 
 * 
 */


class Toast{
    constructor(){
        this.hideTimeout = null;
        this.toastElement = document.createElement("div");
        this.toastElement.className = "toast";
        document.body.appendChild(this.toastElement);
    }

    /**
     * 
     * Tar emot ett sträng värde för vad meddelandet till
     * användaren ska vara och vad för "state" som ske ses
     * success eller error. Toasten får då helt enkelt
     * en stilsättning beronde på "state" strängens värde.
     * 
     * @param {String} message 
     * @param {String} state 
     */
    loadToast(message, state){

        clearTimeout(this.hideTimeout);

        this.toastElement.textContent = message;
        this.toastElement.className = "toast toast--visible";
    
        if (state) {
          this.toastElement.classList.add(`toast--${state}`);
        }
    
        this.hideTimeout = setTimeout(() => {
          this.toastElement.classList.remove("toast--visible");
        }, 3000);
    }
}