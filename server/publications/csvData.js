Meteor.publish("csvData", function(id) {
    return CsvData.find();
})