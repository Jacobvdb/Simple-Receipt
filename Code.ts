function doGet(e) {
    var bookId = e.parameter.bookId;
    var transactionIds = e.parameter.transactionIds;
    var templateUrl = e.parameter.templateUrl;
    

    
    
    var htmlTemplate = HtmlService.createTemplateFromFile('Dialog');
    htmlTemplate.dataFromServerTemplate = { bookid: bookId, transactionIds: transactionIds, templateUrl : templateUrl };
    var htmlOutput = htmlTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .setTitle('Test App');
    return htmlOutput;
    
}


function initialize(bookId, transactionIds, templateUrl){
  var book = BkperApp.openById(bookId)
  var bookName = book.getName();

  const txIds = transactionIds.split(" ");
  Logger.log("txids:" + txIds)

  for (var i = 0; i < txIds.length - 1; i++) {
    let txId = txIds[i];

    Logger.log("txid:" + txId);
    let tx = book.getTransaction(txId)
    Logger.log("quantity:" + tx.getAmount())


  } 


  
  return {bookName, bookId,   transactionIds, templateUrl}

}



function generateModel(book, customerName, afterDate, beforeDate) {
  // Book Properties
  //var book = BkperApp.openById(bookId);
  var model = {
      book: __assign(__assign({}, book.getProperties()), { name: book.getName() })
  };
  // Account properties
  var account = book.getAccount(customerName);
  model.customer = __assign(__assign({}, account.getProperties()), { name: account.getName(), balance: account.getBalance() });
      
  Logger.log( "account:'"+ customerName + "' after:" + afterDate + " before:"+beforeDate)
  // transactions
  model.transactions = [];
  var transactionIterator = book.getTransactions("account:'"+ customerName + "' after:" + afterDate + " before:"+beforeDate );
  while (transactionIterator.hasNext()) {
      var transaction = transactionIterator.next();
      model.transactions.push({
          date: transaction.getInformedDateText(),
          description: transaction.getDescription(),
          account: transaction.getCreditAccount().getName(),
          amount: transaction.getAmount()
      });
  }
  return model;
}


function merge(model) {
  var params = {   
      'template': "https://docs.google.com/document/d/16FBd36RzL3Xqk9tDL5pcTRadT043baJ_JfgY-6F0HiE/edit",
      'model': model,
      'format': 'pdf'
  };
  var options = {
      'contentType': "application/json",
      'method': 'post',
      'payload': JSON.stringify(params),
      'muteHttpExceptions': false
  };
  Logger.log("ok");
  var response = UrlFetchApp.fetch('https://api.doxey.io/merge', options);
  var document = response.getBlob();
  document.setName("Bkper Doxey GS sample.pdf");
  var file =DriveApp.getFolderById("128bwrjur-8tgb2HxWmXFIC2WH_1xODsY").createFile(document);
  var invoiceURL = file.getUrl();
  return invoiceURL
}




//${book.id} - the current book id
//${book.properties.xxxxx} - any property value from the current book
//${transactions.query} - the current query being executed on transactions list
//${transactions.ids} - the ids of selected transactions, splitted by comma
//${account.id} - the current account being filterd
//${account.properties.xxxxx} - any property value from the current account being filtered