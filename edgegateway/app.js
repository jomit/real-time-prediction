require("dotenv").load();

const { EventHubClient } = require("@azure/event-hubs");
//var sqlserverdb = require("./sqlserverdb");
var logger = require("./logger");

const connectionString = process.env.eventHubConnectionString;
const eventHubsName = process.env.eventHubName;
const pullInterval = process.env.pullIntervalInMilliSeconds;

async function sendSensorData() {

  // Use this to connect to actual SQL DB
  //var sensorData = await sqlserverdb.getUpdatedSensorData();
  //var features = ['S1','S2','S3','S5','S6','S7','S8','S9','S10','S11','S12','S13','S14','S15','S16','S17','S18','S19','S20','S21','S22','S23','S24','S25','S26','S27','S28','S29','S30','S31','S32','S33','S34','S35','S36','S37','S38','S39','S40','S41'];
  //var featureData = [];
  //for(var i =0; i< features.length; i++){
  //  featureData[i] = sensorData[features[i]];
  //}

  // Using sample static data for testing
  var sensorData = [4.996352,41.68612,41.79799,4.998839,5.051471,27.01976,28.5,36,39.6,22.7,921.2494,2081.41,2170.84,1017.489,24.68081,29.16544,29.65642,29.15765,21.35513,140.4473,133.4049,4.998026,63.68074,25.13597,32.08001,5.075305,27.029,7.516817,54.95351,4.998026,60,40,13,4.933381,11,5.000257,5.001157,28283.33,26892.26,18333.06641];
  var batchId = 'Batch' + Math.floor((Math.random() * 100) + 1);

  messageResult = await sendEventHubMessage(batchId, sensorData);
}

async function sendEventHubMessage(batchId, sensorData) {
  const client = EventHubClient.createFromConnectionString(connectionString, eventHubsName);
  var eventData = {
    "body": { data: sensorData, batchId: batchId }
  }
  logger.log(eventData.body.batchId + ' => ' + eventData.body.data);
  await client.send(eventData);
  await client.close();
}

setInterval(function () {
  sendSensorData().catch(err => {
    console.log("Error: ", err);
  });
}, pullInterval);