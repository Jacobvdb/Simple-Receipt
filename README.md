## Simple Receipt App for Bkper 

Generates a simple pdf receipt based on selected transactions on your Bkper book. 


![Simple Receipt example](https://storage.googleapis.com/bkper-public/images/Help/bkper-simple-receipt.gif)

- Select the transaction(s) to generate a receipt for. 
- Open the **More** menu and select **Generate Receipt** in your book. 
- Based on the information of the selected transactions it will open a **pdf file** in another browser tab.




## Configuration

### Receipt Template
The Simple Receipt App uses this Google Doc as a default template:  [Simple Receipt Template](https://docs.google.com/document/d/1MMENpgkJu24RqHDtVvn9jEJRcEgBo_KtND123VFNTnk/edit?usp=sharing).  It's recomended to copy the default template and adjust it to your own personalized receipt with your own brand logo, address etc.

Copy the default template from here: https://docs.google.com/document/d/1MMENpgkJu24RqHDtVvn9jEJRcEgBo_KtND123VFNTnk/edit

Your template needs to have view access by anyone on the web, so it can be used by the script.


### Receipt Template Expressions
The App merges data from your Bkper Book with the use of Expressions on the template to generate your receipt.    
The expression ```$[transactions.amount]``` on the template will be substituted with the amount on the transaction you selected on your book.

The following expressions are available to use on your template. 

Receipt expresions
-```${receipt.date}``` : The date and time when the receipt is generated.   
-```${receipt.total}``` : The sum of the line items on the receipt. 

Book expresssions   
-```${book.property}``` : A book property.  

Transaction expresions   
-```$[transactions.date]``` : The post date of the line item.   
-```$[transactions.description]``` : The description of the line item.    
-```$[transactions.fromAccount]``` : The credit account of the line item.    
-```$[transactions.toAccount]``` : The debit account of the line item.    
-```$[transactions.amount]``` : The line item amount.     
-```$[transactions.property]``` : A line item property.     

**Note**: $[] refers to an iterator (one, or more than one). Use these expressions in a table as in the default template.   
In case you need to address a specific item from the iterator outside of a table, use ```${transactions[0].description}```

Account expressions    
-```${fomAccount.property}``` : A credit account property.     
-```${toAccount.property}``` : A debit account property.    


You can access the proprties of your Book, Accounts used in the transactions, and the transaction itself.    
The Expression ```${fomAccount.customer_name}``` on the template will be substituted with the value of the property customer_name set on the From Account. 


### Book Properties Configuration

The App interacts with these properties on your book:
- ```receipt_template_url```: Optional - The Url of your personalized Template used to generate receipts. 
- ```doxey_api_key```: Optional - Remove the Doxey watermark of your receipts by adding your Doxey API key to your book.





### Third Party Service Doxey
Simple Receipt App uses [doxey.io](https://www.doxey.io/) to merge the transaction data from your book into the Google Docs Tempate in order to generate the pdf receipt.
You can use the free version that comes with a watermark or either remove the watermark by using the paid version adding your Doxey API Key to the book properties.    
Learn more about the use of Template expression the [Doxey Help Center](https://help.doxey.io/en/templates/overview.html)





