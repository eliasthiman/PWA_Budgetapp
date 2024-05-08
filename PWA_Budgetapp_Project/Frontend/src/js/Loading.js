/**
 * @classdesc Skapar ett laddnings element, denna klass
 * används dock ej. Men är kvar som ett verktyg ifall jag behöver debugga 
 * något relaterad till den.
 */
class Loading{
    constructor(){
        this.createLoadingElement();
    }
    
    createLoadingElement(){
        window.addEventListener("load", function() {
            
            setTimeout(function() {
                const loader = document.getElementById("loader2");
                loader.classList.add("loader2--hidden");
                
                
                setTimeout(function() {
                    loader.remove();
                }, 500); 
            }, 2000); 
        });
    }
}