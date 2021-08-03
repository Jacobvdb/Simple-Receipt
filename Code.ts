function doGet(e) {
    var bookId = e.parameter.bookId;
    //Logger.log(bookId)
    //var book = BkperApp.openById(bookId);
    //var bookName = book.getName();
    //Logger.log("name " + bookName)

    var bookName ="test App";

    
      

       var template = HtmlService.createTemplateFromFile('Dialog'); 
       return template.evaluate();
      

      
}


function initialize(){
  return "test "

}



//https://script.google.com/a/macros/bkper.com/s/AKfycbyZbzuMQ1t45o8zgFBuwfXz12CfVLKFam51n1Kfrp-NrUTfCcv7fbbimlBhNFlZIGK5/exec?bookId=${book.id}&query=${query}
//https://script.google.com/a/macros/bkper.com/s/AKfycbzgp90cQNf_SrqqkuilQ3lSu9NZ6sUcoEqQA7u_r4A/dev?bookId=${book.id}&query=${query}
//https://script.google.com/macros/s/AKfycbyT-UplFZeTyhhJA8dPgceN9kOkYIbuZeiA2FFfjF1Y2uyc6A/exec?query=account%3A%27ZAHORI+MAGO%27+&bookId=agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAoLjtwuoKDA

//https://script.google.com/a/macros/bkper.com/s/AKfycbzgp90cQNf_SrqqkuilQ3lSu9NZ6sUcoEqQA7u_r4A/dev?bookId=agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAoITsoaMJDA