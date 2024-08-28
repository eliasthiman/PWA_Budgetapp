/**
 * @classdesc Klassen skapar det som användaren får när
 * de har gått igenom cost of living formuläret. Denna klass
 * generar ett förslag på en budgetstorlek till användaren
 * beronde på vald stad, kategori och storlek på hushållet.
 * 
 * För att ge användaren lite mer realistiska förslag så 
 * har sifforna justerats lite efter de har hämtats in från
 * REST-API. 
 * 
 * @method generateSuggestion instanserar ett objekt från
 * API klassen och kör sedan dess metoder för att hämta datan.
 * 
 * Sedan beronde på vad för kategori användaren har valt 
 * körs en passande metod från API och en till metod
 * för att generara aktuellt innehåll. 
 * 
 * @method getGroBudget Denna metod skapar ett nytt
 * window objekt och skriver ut den data som har behandlats
 * i uträkningen. Datan som behandlas är om livsmedelskostnader.
 * 
 * @method getTranBudget Denna metod skapar ett nytt
 * window objekt och skriver ut den data som har behandlats
 * i uträkningen. Datan som behandlas är om transportskostnader.
 * 
 * @method getClothBudget Denna metod skapar ett nytt
 * window objekt och skriver ut den data som har behandlats
 * i uträkningen. Datan som behandlas är om klädnaskostnader.
 * 
 * @method emptyApiCall Körs ifall result är tom. 
 * Tillhör klassens felhantering
 * 
 * 
 * 
 */


class Suggestion{


    /**
     * 
     * @param {String} city 
     * @param {String} category 
     * @param {Number} size 
     */

    constructor(city, category, size){
        this.city = city
        console.log("Suggestion, this city:", this.city);
        this.category = category;
        this.size = size;

        this.result = null;
        this.generateSuggestion();
    }


    async generateSuggestion(){

       
        const api = new Api(this.city);
        let response = await api.apiCall();

        //console.log("apiCall() respone", response);

        if(!response){
            this.emptyApiCall();
        }
        else{
            switch (this.category) {
                case "Groceries": 
                    this.result = api.getCostOfGro(response);
                    this.getGroBudget(this.result);
                    break;
                case "Private Transportation (by car)":
                    this.result = api.getCostOfTran(response);
                    this.getTranBudget(this.result, "private");
                    break;
                case "Public Transportation (by buss)":
                    this.result = api.getCostOfTran(response);
                    this.getTranBudget(this.result, "public");
                    break;
                case "Affordable Clothing":
                    this.result = api.getCostOfCloth(response); 
                    this.getClothBudget(this.result); 
                    break;
                default:
                    break;
            }
            console.log("Suggestion result! ", this.result); 
        }

    }


    getGroBudget(result){

        let avgBudget = 0;

        for(let i = 0; i < result.length; i++){
            avgBudget += result[i].monthly_expense;
        }

        // Representation av en månads budget
        avgBudget = ((Math.floor(avgBudget / 100) * 100) * 2) * this.size;

        let suggestionWindow = new Window();
        suggestionWindow.createColElement(avgBudget, this.size, this.category);
    }


    getTranBudget(result, spec){

        let avgBudget = 0;

        if(spec === "private"){
            for(let i = 0; i < result.length; i++){ 

                if(result[i].car){
                    avgBudget += result[i].price;
                }
                this.category = "Private Tran."; 
            }

            if(this.size >= 3){
                this.size = 3;
                avgBudget = (Math.floor(avgBudget * 100)) * this.size;
            }
            else{
                avgBudget = (Math.floor(avgBudget * 100)) * this.size;
            }
        }
        else{
            for(let i = 0; i < result.length; i++){

                if(result[i].public_tran){
                    avgBudget += result[i].price;
                }
                this.category = "Public Tran."                
            }

            avgBudget = ((Math.floor(avgBudget / 100) * 100) * 2) * this.size;

        }

        let suggestionWindow = new Window();
        suggestionWindow.createColElement(avgBudget, this.size, this.category);
    }


    getClothBudget(result){

        let avgBudget = 0;

        for(let i = 0; i < result.length; i++){
       
                avgBudget += result[i].affordable_item;

                this.category = "Clothing";                
        }

        avgBudget = ((Math.floor(avgBudget / 100) * 100)) * this.size; 

        let suggestionWindow = new Window();
        suggestionWindow.createColElement(avgBudget, this.size, this.category);
    }

    emptyApiCall(){
        let suggestionWindow = new Window();
        suggestionWindow.createErrorElement("Oops! Something went wrong, please check your internet connection and try again later.");
    }
}