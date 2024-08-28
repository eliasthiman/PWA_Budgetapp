/**
 * 
 * @classdesc Denna klass hanterar all kommunikation till REST-API
 * Det är denna klass som används sedan för levnadskostnads funktionen.
 *
 */
class Api{
	

	/**
	 * @constructor Skapar anslutning till REST-API
	 *
	 * @param {String} city Den stad som blir vald 
	 * 
	 * 
	 */

	constructor(city){
	this.url = `https://cost-of-living-and-prices.p.rapidapi.com/prices?city_name=${city}&country_name=sweden`;
	this.options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': 'get-your-own-api-key-at-rapidapi',
			'X-RapidAPI-Host': 'cost-of-living-and-prices.p.rapidapi.com'
		}
	};

	this.attempt = 0; 

	}

	/**
	 * 
	 * @method apiCall behandlar svar från REST-API 
	 * innehåller även den del felhantering.
	 * 
	 * @returns json
	 * 
	 */
	async apiCall(){
		try {
			const response = await fetch(this.url, this.options);
			if(response.status === 429 || response.status === 500 || response.status === 400 || response.status === 401){
				console.log("Something went wrong with the API call, please check your API key and other settings!", response.status);
				return null;
			}
			const result = await response.json(); 
			if(result){
			//	const object = JSON.parse(result);
				this.attempt = 0;
				console.log("RESULT FROM API CALL!", result);
				console.log(response.status);
				return result;
			}
		} catch (error) {
			console.error("There was an error with fetching data from the server", error);
			console.log(`Trying to establish connection, attempt: ${this.attempt++}`);
			if(this.attempt < 5) {
				return this.apiCall();
			}
			else{
				this.printRespones(`Could not connect to server after ${this.attempt} attempts!`, false);
				return null;
			}
		}
	}


	/**
	 * @method getCostOfGro Hämtar kostnaden av alla livsmedel
	 * 
	 * @param {Object} result resultatet från REST-API
	 * @returns en Array innehållande object  
	 */

	getCostOfGro(result){

	if(result){
		console.log("RESULT IN GROCERIES", result);
		var prices = result.prices;
		console.log("PRICES", prices);
		var items = [];

		for(let i = 0; i < prices.length; i++){

			if(prices[i].category_name === "Markets" && prices[i].item_name !== "Pack of Cigarettes") {
				items.push(
					{
					item_name: prices[i].item_name,
					price: (prices[i].avg + prices[i].max) / 2,
					monthly_expense: ((prices[i].avg + prices[i].max) / 2),
					avg_item: ((prices[i].avg + prices[i].max) / 2 ) < 100 
					});
			}
		}	
		console.log("THE ITEMS GROCERIES!", items);
		return items;
	}
	else{
			console.log("Api call is empty, check you internet connection and try again!");
			return [];
		}
	}


	/**
	 * @method getCostOfTran Hämtar all kostnad för transport 
	 * 
	 * 
	 * @param {Object} result resultatet från REST-API 
	 * @returns en array med object 
	 */


	getCostOfTran(result){
		
	if(result){
		console.log(result);
		var prices = result.prices;
		var items = [];

		for(let i = 0; i < prices.length; i++){

			if(prices[i].category_name === "Transportation"){
				items.push(
					{
					item_name: prices[i].item_name,
					price: (prices[i].avg + prices[i].max) / 2, 
					public_tran: prices[i].item_name.includes("Local Transport") || prices[i].item_name.includes("Monthly Pass"),
					car: prices[i].item_name.includes("Gasoline")
					});
			}
		}
		console.log(items);
		return items;
	}
	else{
		console.log("Api call is empty, check you internet connection and try again!");
		return [];
	}
}


	/**
	 * @method getCostOfCloth  Hämtar all kostnad för kläder
	 * 
	 * 
	 * 
	 * @param {Object} result resultatet från REST-API 
	 * @returns en array med object 
	 */

	getCostOfCloth(result){

	if(result){
		console.log(result);
		var prices = result.prices;
		var items = [];

		for(let i = 0; i < prices.length; i++){

			if(prices[i].category_name === "Clothing And Shoes"){
				items.push(
					{
					item_name: prices[i].item_name,
					price_avgMax: (prices[i].avg + prices[i].max) / 2,
					price_avg: prices[i].avg < 1000 ? prices[i].avg : prices[i].min, 
					affordable_item: prices[i].min < 600 ? prices[i].min : 0
					}); 
			}
		}
		console.log(items);
		return items;
	}
	else{
		console.log("Api call is empty, check you internet connection and try again!");
		return [];
	}
}

} 
