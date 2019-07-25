function execute(pdict) {

    var OrderMgr = require('dw/order/OrderMgr');
    var Order = require('dw/order/Order');

    var XMLStreamWriter = require('dw/io/XMLStreamWriter');
    var FileWriter = require('dw/io/FileWriter');
    var File = require('dw/io/File');

    var queryString = 'exportStatus = {0} OR exportStatus = {1}';
    var orderItr = OrderMgr.queryOrders(queryString, 'orderNo ASC', Order.EXPORT_STATUS_READY, Order.EXPORT_STATUS_NOTEXPORTED).asList();

    var file = new File(File.IMPEX + File.SEPARATOR + 'src'  + File.SEPARATOR + pdict.folder + File.SEPARATOR + 'ordersExport.xml');
    var fileWriter = FileWriter(file);
    var xsw        = new XMLStreamWriter(fileWriter);

    xsw.writeStartDocument();
        xsw.writeStartElement("orders");
            xsw.writeAttribute("xmlns", "http://www.demandware.com/xml/impex/catalog/2006-10-31");

            for (var i = 0; i < orderItr.length; i++) {
                var order = orderItr[i];

                xsw.writeStartElement("order");
                    xsw.writeAttribute("order-no", order.orderNo);

                    xsw.writeStartElement("customer-name");
                        xsw.writeCharacters(order.customerName);
                    xsw.writeEndElement();

                    xsw.writeStartElement("customer-no");
                        xsw.writeCharacters(order.customerNo);
                    xsw.writeEndElement();

                    xsw.writeStartElement("customer-email");
                        xsw.writeCharacters(order.customerEmail);
                    xsw.writeEndElement();

                    xsw.writeStartElement("total-amount");
                        xsw.writeCharacters(order.totalGrossPrice);
                    xsw.writeEndElement();

                    xsw.writeStartElement("card-holder");
                        xsw.writeCharacters(order.paymentTransaction.paymentInstrument.creditCardHolder);
                    xsw.writeEndElement();

                    xsw.writeStartElement("card-number");
                        xsw.writeCharacters(order.paymentTransaction.paymentInstrument.creditCardNumber);
                    xsw.writeEndElement();

                    for (var j = 0; j < order.allProductLineItems; j++) {
                        var product = order.allProductLineItems[j];

                        xsw.writeStartElement("product-id");
                            xsw.writeCharacters(product.productID);
                        xsw.writeEndElement();

                    }

                xsw.writeEndElement();
            }
        xsw.writeEndElement();
    xsw.writeEndDocument();

    xsw.close();
    fileWriter.close();

    var t = 0;
}

module.exports.execute = execute; 