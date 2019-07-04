var request = require("request-promise");

module.exports = async function (context, eventHubMessage) {
    var options = {
        uri: "<your scoring api url>",
        method: "POST",
        json: true,
        headers: {
            "Content-Type": "application/json"
        },
        body: { "data" : eventHubMessage.data }
    };
    var results = await request(options);
    var prediction = JSON.parse(results).result;
    var document = {
        batchid: eventHubMessage.batchId,
        inputData: eventHubMessage.data,
        prediction: prediction
    };
    context.log(document)
    context.bindings.predictionResultDocument = JSON.stringify(document);
    context.done();
};