/**
 * @classdesc 
 * Denna Klass skapar levnadskostnadens form innehåll och styr över
 * hur den ska fungera när användaren interagerar med den 
 * De övriga elementen i form är "gömda" tills användaren har
 * påbörjat interaktionen.
 * 
 * @method cityContent populerar fältet med alternativ och 
 * visar sedan nästa fält efter interkation med den första. 
 * 
 * @method categoryContent populerar fältet med alternativ och 
 * visar sedan nästa fält efter interkation med den första. 
 * 
 * @method householdContent populerar fältet med alternativ och 
 * visar sedan nästa fält efter interkation med den första.
 * Denna sista metod visar sedan knappen för att skicka formuläret
 * när formuläret skickas laddas sedan resultatet från REST-API in.
 * 
 */

class CostOfLiving{
    constructor(){

        this.cities = [
            { id: 1, city: "Stockholm, Sweden", value: "Stockholm"},
            { id: 2, city: "Växjö, Sweden", value: "Växjö"},
            { id: 3, city: "Göteborg, Sweden", value: "Gothenburg"},
            { id: 4, city: "Umeå, Sweden", value: "Umeå"},
            { id: 5, city: "Visby, Sweden", value: "Visby"}
        ];

        this.categories = [
            { id: 1, category: "Groceries" },
            { id: 2, category: "Private Transportation (by car)" },
            { id: 3, category: "Public Transportation (by buss)" },
            { id: 4, category: "Affordable Clothing" }
        ];

        this.cityContent();
        this.categoryContent();
        this.householdContent(); 
    }

    cityContent(){

        const cityPick = document.getElementById("cityPick");
        cityPick.addEventListener("change", (e) =>{
            const selectedOption = e.target.value;
            if(selectedOption !== ''){

            const category = document.getElementsByClassName("form-group category")[0];
            category.style.display = "block";
                
            }
            console.log(selectedOption);
        });

        for(let i = 0; i < this.cities.length; i++){
          
          const cityOption = document.createElement("option");
          cityOption.dataset.id = this.cities[i].id;
          cityOption.value = this.cities[i].value; 
          cityOption.innerHTML = this.cities[i].city;
          cityPick.appendChild(cityOption);
        }
    
    }


    categoryContent(){

        const catPick = document.getElementById("categoryPick");
        catPick.addEventListener("change", (e) => {
            const selectedOption = e.target.value;
            if(selectedOption !== ''){
                const household = document.getElementsByClassName("form-group household")[0];
                household.style.display = "block";

            }
            console.log(selectedOption);
        });


        for(let i = 0; i < this.categories.length; i++){
            const catOption = document.createElement("option");
            catOption.dataset.id = this.categories[i].id;
            catOption.value = this.categories[i].category; 
            catOption.innerHTML = this.categories[i].category;
            catPick.appendChild(catOption);
        }
    }


    householdContent(){

        const sizePick = document.getElementById("householdPick"); 
        sizePick.addEventListener("change", (e) => {
            const selectedOption = e.target.value;
            if(selectedOption !== ''){

                const btn = document.getElementsByClassName("addBtn colBtn")[0];
                btn.style.display = "block";
                
            }
        });

        for(let i = 1; i < 11; i++){
            const sizeOption = document.createElement("option");
            sizeOption.dataset.id = i;
            sizeOption.value = i;
            sizeOption.innerHTML = i;
            sizePick.appendChild(sizeOption);
        }
    }
}
