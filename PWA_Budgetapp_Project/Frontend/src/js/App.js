/**
 * @classdesc är en av huvudklasserna som kör två klasser under den 
 * denna klass instanseras sedan i klassen Main, vilket är huvudklassen
 * för hela applikationen. 
 *
 */

class App{
    constructor(){
        var formHandler = new Form();
        var homePage = new Home();
    }
}