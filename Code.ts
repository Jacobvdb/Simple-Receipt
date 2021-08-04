function doGet(e) {
    var bookId = e.parameter.bookId;
    var query = e.parameter.query;
    var dselect = e.parameter.dselect;
    var transactionId = e.parameter.transactionId;

    var htmlTemplate = HtmlService.createTemplateFromFile('Dialog');
    htmlTemplate.dataFromServerTemplate = { bookid: bookId, query: query,dselect: dselect ,transactionId: transactionId };
    var htmlOutput = htmlTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .setTitle('Test App');
    return htmlOutput;
    
}


function initialize(bookId){
  var book = BkperApp.openById(bookId,query, dselect, transactionid)
  var bookName = book.getName();
  return bookName

}

