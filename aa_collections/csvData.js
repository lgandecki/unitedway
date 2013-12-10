CsvData = new Meteor.Collection("csvData");
//
Meteor.methods({
    "clearCsvData": function() {
        CsvData.remove({});
    }
});

//    'uploadFile': function (file) {
//
//        Future = Npm.require('fibers/future');
//        var csv = Meteor.require('CSV');
//
//
////        console.log(file.name+ '\' +file.type+'\'+file.size);
//
//        file.save('/tmp/tmp',{});
//        var buffer = new Buffer(file.data);
//
//
//        // Set up the Future
//        var fut = new Future();
//
//        // Convert buffer (a CSV file) to an array
//        CSV().from(
//            buffer.toString(),
//            {comment: '#', delimiter: ',', quote: '"'}
//        )
//            .to.array( function(data){
//
//                var newRecords=[];
//
//                for(var row=0; row<data.length; row++) {
//                    console.log(data[row]);
//                    newRecord = {
//                        'AccountNumber': data[row][0],
//                        'AccountName': data[row][1],
//                        'FormName': data[row][2],
//                        'FormHeaderKey': data[row][3],
//                        'Item': data[row][4],
//                        'Label': data[row][5],
//                        'ValueNumber': data[row][6],
//                        'ValueDollar': data[row][7],
//                        'ValueBoolean': data[row][8],
//                        'ValueText': data[row][9],
//                        'ValueTable': data[row][10],
//                        'ValueTotal': data[row][11]
//                    };
//
//                    //console.log(newRecord);
//                    newRecords.push(newRecord);
//                }
//
//                // at the end of the CSV callback
//                // return newRecords via the Future
//                fut['return'](newRecords);
//            } );
//
//
//        // Wait for the results of the conversion
//        results = fut.wait();
//        console.log('results================');
//        console.log(results);
//
//        // now insert the new records from the file into our collectiion
//        if (results.length) {
//            for(i in results) {
//                csvData.insert(results[i]);
//            }
//        }
//
//        console.log('reas now looks like =====================');
//        console.log(csvData.find({}).fetch());
//
//    } // uploadFile
//});