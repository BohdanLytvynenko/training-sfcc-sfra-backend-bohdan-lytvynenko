function execute(pdict) {
    var XMLStreamWriter = require('dw/io/XMLStreamWriter');
    var FileWriter = require('dw/io/FileWriter');
    var File = require('dw/io/File');
    var ProductSearchModel = require('dw/catalog/ProductSearchModel');
    var PagingModel = require('dw/web/PagingModel');

    var file = new File(File.IMPEX + File.SEPARATOR + 'src'  + File.SEPARATOR + 'instance' + File.SEPARATOR + 'jobfile.xml');
    var fileWriter = FileWriter(file);
    var xsw        = new XMLStreamWriter(fileWriter);

    var apiProductSearch = new ProductSearchModel();
    apiProductSearch.setRefinementValues('brand', pdict.brand);
    apiProductSearch.setCategoryID('electronics');
    apiProductSearch.search();

    var searchHits = apiProductSearch.getProductSearchHits();

    xsw.writeStartDocument();
        xsw.writeStartElement("catalog");
            xsw.writeAttribute("xmlns", "http://www.demandware.com/xml/impex/catalog/2006-10-31");
            xsw.writeAttribute("catalog-id", "apparel-m-catalog");
                
            while(searchHits.hasNext()) {
                var product = searchHits.next().getProduct();
        
                xsw.writeStartElement("category-assignment");
                    xsw.writeAttribute("category-id", "mens-clothing-outerwear");
                    xsw.writeAttribute("product-id", product.ID);
        
                    xsw.writeStartElement("primary-flag");
                        xsw.writeCharacters('true');
                    xsw.writeEndElement();
                xsw.writeEndElement();
            }

        xsw.writeEndElement();
    xsw.writeEndDocument();

    xsw.close();
    fileWriter.close();
}
    
module.exports.execute = execute;