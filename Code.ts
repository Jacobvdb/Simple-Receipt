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

