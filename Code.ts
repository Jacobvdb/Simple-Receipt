function doGet(e) {
    var bookId = e.parameter.bookId;
    var query = e.parameter.query;
    var htmlTemplate = HtmlService.createTemplateFromFile('Dialog');
    htmlTemplate.dataFromServerTemplate = { bookid: bookId, query: query };
    var htmlOutput = htmlTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .setTitle('Test App');
    return htmlOutput;
    
}


function initialize(bookId){
  var book = BkperApp.openById(bookId)
  var bookName = book.getName();
  return bookName

}


//https://hhttps//script.google.com/a/macros/bkper.com/s/AKfycbyyrcFbtar7ilGVY1LZo3behV1k816FpWPsqt0yit81-Mfx_0LMSDzTh8AGdYKJTdia/exec?bookId=agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAoITsoaMJDA
//https://script.google.com/a/macros/bkper.com/s/AKfycbyZbzuMQ1t45o8zgFBuwfXz12CfVLKFam51n1Kfrp-NrUTfCcv7fbbimlBhNFlZIGK5/exec?bookId=${book.id}&query=${query}
//https://script.google.com/a/macros/bkper.com/s/AKfycbzgp90cQNf_SrqqkuilQ3lSu9NZ6sUcoEqQA7u_r4A/dev?bookId=${book.id}&query=${query}
//https://script.google.com/macros/s/AKfycbyT-UplFZeTyhhJA8dPgceN9kOkYIbuZeiA2FFfjF1Y2uyc6A/exec?query=account%3A%27ZAHORI+MAGO%27+&bookId=agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAoLjtwuoKDA

//https://script.google.com/a/macros/bkper.com/s/AKfycbzgp90cQNf_SrqqkuilQ3lSu9NZ6sUcoEqQA7u_r4A/dev?bookId=agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAoITsoaMJDA