Template.home.rendered = function() {

    if(isAPIAvailable()) {
        $('#files').bind('change', handleFileSelect);
    }

    Meteor.subscribe("csvData", 1);
}


function isAPIAvailable() {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
        return true;
    } else {
        // source: File API availability - http://caniuse.com/#feat=fileapi
        // source: <output> availability - http://html5doctor.com/the-output-element/
        document.writeln('The HTML5 APIs used in this form are only available in the following browsers:<br />');
        // 6.0 File API & 13.0 <output>
        document.writeln(' - Google Chrome: 13.0 or later<br />');
        // 3.6 File API & 6.0 <output>
        document.writeln(' - Mozilla Firefox: 6.0 or later<br />');
        // 10.0 File API & 10.0 <output>
        document.writeln(' - Internet Explorer: Not supported (partial support expected in 10.0)<br />');
        // ? File API & 5.1 <output>
        document.writeln(' - Safari: Not supported<br />');
        // ? File API & 9.2 <output>
        document.writeln(' - Opera: Not supported');
        return false;
    }
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];

    // read the file metadata
    var output = ''
    output += '<span style="font-weight:bold;">' + escape(file.name) + '</span><br />\n';
    output += ' - FileType: ' + (file.type || 'n/a') + '<br />\n';
    output += ' - FileSize: ' + file.size + ' bytes<br />\n';
    output += ' - LastModified: ' + (file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a') + '<br />\n';

    // read the file contents
    printTable(file);

    generateDoc();

    // post the results
    $('#list').append(output);
}

function printTable(file) {
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event){
        var csv = event.target.result;
        var data = $.csv.toObjects(csv);
//        console.log("data", data);
//        CsvData.remove({});
        Meteor.call("clearCsvData");
        data.forEach(function(object) {
            CsvData.insert(object);
        })
//        var html = '';
//        for(var row in data) {
//            html += '<tr>\r\n';
//            for(var item in data[row]) {
//                html += '<td>' + data[row][item] + '</td>\r\n';
//            }
//            html += '</tr>\r\n';
//        }
//        $('#contents').html(html);
    };
    reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
}

function generateDoc() {
//    var docXData = [];

    DocUtils.loadDoc("fullApp.docx");
    var _docData = docXData["fullApp.docx"];
    var _doc = new DocxGen(_docData);

    console.log("csvData", CsvData.find().count());
    var _csvDatas = CsvData.find().fetch();
    var templateVars = {};
    _csvDatas.forEach(function(csvData) {
        console.log("fh", csvData.FormHeaderKey);
        var _tag = csvData.FormHeaderKey + ":" + csvData.Item;
        templateVars[_tag] = "";
        if (csvData[" ValueText"] && csvData[" ValueText"] !== "") {
            templateVars[_tag] = csvData[" ValueText"];
        }
        else if (csvData[" ValueBoolean"] && csvData[" ValueBoolean"] !== "") {
            templateVars[_tag] = csvData[" ValueBoolean"];
        }
        else if (csvData[" ValueDollar"] && csvData[" ValueDollar"] !== 0 && csvData[" ValueDollar"] !== "") {
            templateVars[_tag] = csvData[" ValueDollar"];
        }
        else if (csvData[" ValueNumber"] && csvData[" ValueNumber"] !== 0 && csvData[" ValueNumber"] !== "") {
            templateVars[_tag] = csvData[" ValueNumber"];
        }
        else if (csvData[" ValueNumber"] === 0 && csvData[" ValueDollar"] === 0) {
            templateVars[_tag] = 0;
        }
        templateVars[_tag] = templateVars[_tag].replace("{", "");
        templateVars[_tag] = templateVars[_tag].replace("}", "");

    })

//    console.log();

    _doc.setTemplateVars(
        templateVars);

    _doc.applyTemplateVars();
    _doc.output();
}