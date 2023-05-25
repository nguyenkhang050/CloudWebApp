// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const chalk = require("chalk");
const exsession = require("express-session");
const sharedsession = require("express-socket.io-session");
const sql = require('mssql');
const { MessageSecurityMode, SecurityPolicy, AttributeIds, OPCUAClient, TimestampsToReturn } = require("node-opcua");
const hostname = require("os").hostname().toLowerCase();
const endpointUrl = "opc.tcp://192.168.0.105:4840/";
const moment = require('moment-timezone');

// const io = require('socket.io')(server);
// New
var io = require('socket.io')(server);
const port = process.env.PORT || 3000;
async function createOPCUAClient(io, data, socket) {
  client = OPCUAClient.create({
      endpointMustExist: false,
      securityMode: MessageSecurityMode.NONE,
      securityPolicy: SecurityPolicy.None,
      serverCertificate: null,
  });
  client.on("backoff", (retry, delay) => {
    console.log("Retrying to connect to ", endpointUrl, " attempt ", retry);
  });
      console.log(" connecting to ", chalk.cyan(endpointUrl));
        try {
          socket.emit("logging ...");
            await client.connect(endpointUrl);
            console.log("Connected to OPC UA server.");
            const userIdentity = {
                userName: data.username,
                password: data.password
            };
            session = await client.createSession(userIdentity);
            // Save the user's session ID in the Socket.IO session
            //socket.request.session.opcSessionId = session.sessionId.toString();
            socket.emit("login-response", { success: true });
            login_successful = true;
        }
        catch (err) {
            console.error("Failed to connect to OPC UA server:", err);
            socket.emit("login-response", { success: false, message: "Failed to authenticate user." });
            login_successful = false;
        }    
      console.log(" session created".yellow);

//   subscription = await session.createSubscription2({
//     requestedPublishingInterval: 250,
//     requestedMaxKeepAliveCount: 50,
//     requestedLifetimeCount: 6000,
//     maxNotificationsPerPublish: 1000,
//     publishingEnabled: true,
//     priority: 10,
//   });

//   subscription
//     .on("keepalive", function () {
//       console.log("keepalive");
//     })
//     .on("terminated", function () {
//       console.log(" TERMINATED ------------------------------>");
//     });

//   const itemToMonitor = {
//     nodeId: nodeIdToMonitor,
//     attributeId: AttributeIds.Value,
//   };
//   const item1ToMonitor = {
//     nodeId: node1IdToMonitor,
//     attributeId: AttributeIds.Value,
// };
// /* ------------------------------------- */
// const itemRobot1ToMonitor = [
// {
//     nodeId: nodeRobot1[0],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[1],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[2],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[3],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[4],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[5],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[6],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[7],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[8],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[9],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[10],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[11],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[12],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[13],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[14],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[15],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[16],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot1[17],
//     attributeId: AttributeIds.Value,
// },
// ];
// const itemRobot2ToMonitor = [
// {
//     nodeId: nodeRobot2[0],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[1],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[2],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[3],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[4],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[5],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[6],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[7],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[8],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[9],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[10],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[11],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[12],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[13],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[14],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[15],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[16],
//     attributeId: AttributeIds.Value,
// },
// {
//     nodeId: nodeRobot2[17],
//     attributeId: AttributeIds.Value,
// },
// ];
// /* ------------------------------------- */
// const parameters = {
//   samplingInterval: 100,
//   discardOldest: true,
//   queueSize: 100,
// };
// const monitoredItem = await subscription.monitor(
//   itemToMonitor,
//   parameters,
//   TimestampsToReturn.Both
// );
// const monitoredItem1 = await subscription.monitor(
//   item1ToMonitor,
//   parameters,
//   TimestampsToReturn.Both
// );
// const monitoredItemRobot1 = [
//   await subscription.monitor(
//       itemRobot1ToMonitor[0],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[1],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[2],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[3],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[4],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[5],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[6],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[7],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[8],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[9],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[10],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[11],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[12],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[13],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[14],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[15],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[16],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot1ToMonitor[17],
//       parameters,
//       TimestampsToReturn.Both
//   ),
// ];
// const monitoredItemRobot2 = [
//   await subscription.monitor(
//       itemRobot2ToMonitor[0],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[1],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[2],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[3],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[4],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[5],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[6],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[7],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[8],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[9],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[10],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[11],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[12],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[13],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[14],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[15],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[16],
//       parameters,
//       TimestampsToReturn.Both
//   ),
//   await subscription.monitor(
//       itemRobot2ToMonitor[17],
//       parameters,
//       TimestampsToReturn.Both
//   ),
// ];

// monitoredItem.on("changed", (dataValue) => {
//   console.log(dataValue.value.toString());
//   //console.log(dataValue.attributeid.toString());
// io.sockets.emit("temp", {
//   value: dataValue.value.value,
//   timestamp: dataValue.serverTimestamp,
//   nodeId: nodeIdToMonitor,
//   browseName: "Temperature",
// });
// });
// monitoredItem1.on("changed", (dataValue) => {
//   console.log("Position: " + dataValue.value.toString());
//   io.sockets.emit("pos", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Position",
//   });
// });
// monitoredItemRobot1[0].on("changed", (dataValue) => {
//   console.log("Robot1/ToolNumber: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/ToolNumber", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/ToolNumber",
//   });
// });
// monitoredItemRobot1[1].on("changed", (dataValue) => {
//   console.log("Robot1/JogSpeed: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/JogSpeed", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/JogSpeed",
//   });
// });
// monitoredItemRobot1[2].on("changed", (dataValue) => {
//   console.log("Robot1/Coordinate: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/Coordinate", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/Coordinate",
//   });
// });
// monitoredItemRobot1[3].on("changed", (dataValue) => {
//   console.log("Robot1/ServoStt: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/ServoStt", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/ServoStt",
//   });
// });
// monitoredItemRobot1[4].on("changed", (dataValue) => {
//   console.log("Robot1/SystemStt: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/SystemStt", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/SystemStt",
//   });
// });
// monitoredItemRobot1[5].on("changed", (dataValue) => {
//   console.log("Robot1/LockRBC: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/LockRBC", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/LockRBC",
//   });
// });
// monitoredItemRobot1[6].on("changed", (dataValue) => {
//   console.log("Robot1/Mode: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/Mode", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/Mode",
//   });
// });
// monitoredItemRobot1[7].on("changed", (dataValue) => {
//   console.log("Robot1/SecLevel: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/SecLevel", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/SecLevel",
//   });
// });
// monitoredItemRobot1[8].on("changed", (dataValue) => {
//   console.log("Robot1/theta1: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/theta1", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/theta1",
//   });
// });
// monitoredItemRobot1[9].on("changed", (dataValue) => {
//   console.log("Robot1/theta2: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/theta2", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/theta2",
//   });
// });
// monitoredItemRobot1[10].on("changed", (dataValue) => {
//   console.log("Robot1/theta3: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/theta3", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/theta3",
//   });
// });
// monitoredItemRobot1[11].on("changed", (dataValue) => {
//   console.log("Robot1/theta4: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/theta4", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/theta4",
//   });
// });
// monitoredItemRobot1[12].on("changed", (dataValue) => {
//   console.log("Robot1/XYZ1: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/XYZ1", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/XYZ1",
//   });
// });
// monitoredItemRobot1[13].on("changed", (dataValue) => {
//   console.log("Robot1/XYZ2: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/XYZ2", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/XYZ2",
//   });
// });
// monitoredItemRobot1[14].on("changed", (dataValue) => {
//   console.log("Robot1/XYZ3: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/XYZ3", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/XYZ3",
//   });
// });
// monitoredItemRobot1[15].on("changed", (dataValue) => {
//   console.log("Robot1/XYZ4: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/XYZ4", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/XYZ4",
//   });
// });
// monitoredItemRobot1[16].on("changed", (dataValue) => {
//   console.log("Robot1/XYZ5: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/XYZ5", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/XYZ5",
//   });
// });
// monitoredItemRobot1[17].on("changed", (dataValue) => {
//   console.log("Robot1/XYZ6: " + dataValue.value.toString());
//   io.sockets.emit("Robot1/XYZ6", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot1/XYZ6",
//   });
// });
// //-----------------------------
// monitoredItemRobot2[0].on("changed", (dataValue) => {
//   console.log("Robot2/ToolNumber: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/ToolNumber", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/ToolNumber",
//   });
// });
// monitoredItemRobot2[1].on("changed", (dataValue) => {
//   console.log("Robot2/JogSpeed: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/JogSpeed", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/JogSpeed",
//   });
// });
// monitoredItemRobot2[2].on("changed", (dataValue) => {
//   console.log("Robot2/Coordinate: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/Coordinate", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/Coordinate",
//   });
// });
// monitoredItemRobot2[3].on("changed", (dataValue) => {
//   console.log("Robot2/ServoStt: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/ServoStt", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/ServoStt",
//   });
// });
// monitoredItemRobot2[4].on("changed", (dataValue) => {
//   console.log("Robot2/SystemStt: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/SystemStt", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/SystemStt",
//   });
// });
// monitoredItemRobot2[5].on("changed", (dataValue) => {
//   console.log("Robot2/LockRBC: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/LockRBC", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/LockRBC",
//   });
// });
// monitoredItemRobot2[6].on("changed", (dataValue) => {
//   console.log("Robot2/Mode: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/Mode", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/Mode",
//   });
// });
// monitoredItemRobot2[7].on("changed", (dataValue) => {
//   console.log("Robot2/SecLevel: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/SecLevel", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/SecLevel",
//   });
// });
// monitoredItemRobot2[8].on("changed", (dataValue) => {
//   console.log("Robot2/theta1: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/theta1", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/theta1",
//   });
// });
// monitoredItemRobot2[9].on("changed", (dataValue) => {
//   console.log("Robot2/theta2: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/theta2", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/theta2",
//   });
// });
// monitoredItemRobot2[10].on("changed", (dataValue) => {
//   console.log("Robot2/theta3: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/theta3", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/theta3",
//   });
// });
// monitoredItemRobot2[11].on("changed", (dataValue) => {
//   console.log("Robot2/theta4: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/theta4", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/theta4",
//   });
// });
// monitoredItemRobot2[12].on("changed", (dataValue) => {
//   console.log("Robot2/XYZ1: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/XYZ1", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/XYZ1",
//   });
// });
// monitoredItemRobot2[13].on("changed", (dataValue) => {
//   console.log("Robot2/XYZ2: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/XYZ2", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/XYZ2",
//   });
// });
// monitoredItemRobot2[14].on("changed", (dataValue) => {
//   console.log("Robot2/XYZ3: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/XYZ3", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/XYZ3",
//   });
// });
// monitoredItemRobot2[15].on("changed", (dataValue) => {
//   console.log("Robot2/XYZ4: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/XYZ4", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/XYZ4",
//   });
// });
// monitoredItemRobot2[16].on("changed", (dataValue) => {
//   console.log("Robot2/XYZ5: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/XYZ5", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/XYZ5",
//   });
// });
// monitoredItemRobot2[17].on("changed", (dataValue) => {
//   console.log("Robot2/XYZ6: " + dataValue.value.toString());
//   io.sockets.emit("Robot2/XYZ6", {
//       value: dataValue.value.value,
//       timestamp: dataValue.serverTimestamp,
//       nodeId: node1IdToMonitor,
//       browseName: "Robot2/XYZ6",
//   });
// });
//   AttriId_value = AttributeIds.Value;
}
// const config = {
//   user: 'khang123',
//   password: 'DNKhang112@',
//   server: 'sql-server-tak1.database.windows.net',
//   database: 'sql-database-tak2',
//   authentication: {
//     type: 'default'
//   },
//   options: {
//     encrypt: true
//   }
// };
let login_successful = false;
const config = {
  user: 'khang123',
  password: '1234',
  server: 'LAPTOP-1PBL42UK\\SQLEXPRESS',
  database: 'RobotManageDB',
  options: {
    trustServerCertificate: true
  }
};

async function connectAndQuery(socket) {
  try {
    var poolConnection = await sql.connect(config);

    // console.log("Reading rows from the Table...");
    // var resultSet = await poolConnection.request().query(`SELECT *
    // FROM Robot1_tbl
    // ORDER BY [TimeStamp] DESC
    // OFFSET 0 ROWS
    // FETCH NEXT 1 ROWS ONLY;`);

    var resultSet = await poolConnection.request().query(`SELECT * FROM Robot_Management ORDER BY TimeStamp DESC OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY;`);
    
    console.log(resultSet.recordset);
    // console.log('request')
    socket.emit("database", resultSet.recordset);
    poolConnection.close();
  } catch (err) {
    console.error(err.message);
  } 
}
async function insertJobSchedule(data) {
  try {
    // Connect to the database
    const pool = await sql.connect(config);
    const sqlDatetime_start = moment.utc(data.time_start).format('YYYY-MM-DD HH:mm:ss');
    const sqlDatetime_end   = moment.utc(data.time_end).format('YYYY-MM-DD HH:mm:ss');

    // const datetime = moment(data.time).add(utcOffsetInHours, 'hours').format('YYYY-MM-DD HH:mm:ss');
    // const sqlDatetime = new Date(datetime).toISOString().slice(0, 19).replace('T', ' ');  
    // Define the SQL query to insert data into the table
    const query = `INSERT INTO Job_Schedule (Robot, Program, Time_Start, Time_End) VALUES ('${data.robot}', '${data.program}', '${sqlDatetime_start}', '${sqlDatetime_end}')`;
    console.log(sqlDatetime_start);
    console.log(sqlDatetime_end);
    // Execute the query
    await pool.request().query(query);

    // Close the connection
    await pool.close();
  } catch (err) {
    console.error(err.message);
  }
}

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));
app.get("/dashboard", function (req, res, next) {
  if (!login_successful) {
    res.redirect('..');
  } else {
    next();
    res.render('dashboard')
  }
});
app.get("/dashboard.html", function (req, res, next) {
  if (!login_successful) {
    res.redirect('..');
  } else {
    next();
    res.render('dashboard')
  }
});
// Chatroom

let numUsers = 0;

io.on('connection', (socket, io) => {
  let addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });


  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;

    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
  setInterval(() => {
    connectAndQuery(socket);
  }, 1000);

  socket.on("JobSchedule", data => {
    console.log(data);
    insertJobSchedule(data);
  })
  socket.on("login", data => {
    console.log(data);
    if (data.username == 'khang123' && data.password == '1234') {
      socket.emit("login-response", { success: true });
      login_successful = true;
    }
    else {
      login_successful = false;
      socket.emit("login-response", { success: false });
    }
    
    // socket.emit("login-response", { success: true });
    // createOPCUAClient(io,data,socket);
  });
});
