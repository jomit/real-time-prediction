require("dotenv").load();

const { EventHubClient } = require("@azure/event-hubs");
const WebSocket = require("ws");
//var sqlserverdb = require("./sqlserverdb");
var tempdb = require("./tempdb");
var logger = require("./logger");

const connectionString = process.env.eventHubConnectionString;
const eventHubsName = process.env.eventHubName;
const pullInterval = process.env.pullIntervalInMilliSeconds;

async function sendSensorData() {

  // Use this to connect to actual SQL DB
  //var sensorData = await sqlserverdb.getUpdatedSensorData();
  
  // Use in memory temp db for testing
  var sensorData = await tempdb.getUpdatedSensorData();
  var batchId = 'Batch' + Math.floor((Math.random() * 100) + 1);

  messageResult = await sendEventHubMessage(batchId, sensorData);
}

async function sendEventHubMessage(batchId, sensorData) {
  const client = EventHubClient.createFromConnectionString(connectionString, eventHubsName, {webSocket: WebSocket});
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