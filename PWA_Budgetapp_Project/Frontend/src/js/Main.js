
/**
 * @classdesc detta är huvudklassen för hela applikationen 
 * klassen registrear applikationens service worker init.
 * Klassen instanseras när sidan har laddats.
 * @method init registrerar service worker och instanserar 
 * klassen App. Det kanske ser konstigt ut men jag antar 
 * att jag har omedvetet tagit inspiration för hur det 
 * brukar se ut i ett React projekt...
 * 
 */

class Main{
    constructor(){
        this.init();
    }

    init(){
        if('serviceWorker' in navigator){
            navigator.serviceWorker.register('/sw.js')
            .then((reg) => console.log('service worker registered', reg))
            .catch((err) => console.log('service worker not registered', err)) 
        }
       var application = new App(); 
    }

}

window.addEventListener("load", () => new Main());