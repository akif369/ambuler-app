require("dotenv").config();
const express = require("express");
const { userModel, driverModel } = require("./db/model");
const mongodb = require("./db/db");
const app = express();
const db = mongodb.connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  console.log("connected");
  res.end("ok done");
});

app.get("/api/driver", async function requestHandler(req, res) {
  const value = await driverModel.find({ isActive: true });
  res.status(200).json({
    error: false,
    driver: value,
  });
});

app.post("/api/driver/register", async function requestHandler(req, res) {
  const name = req.body.name;
  const number = req.body.number;
  const password = req.body.password;
  const email = req.body.email;
  const isEmail = await driverModel.exists({ email: email }).then((e) => e);
  if (isNaN(number)) {
    res.status(404).json({ error: true, message: "incorrect field" });
    return;
  }
  if (isEmail === null) {
    const data = new driverModel({
      name,
      number,
      password,
      email,
      isActive: false,
      customer: "",
    });
    data.save();
    res.status(200).json({ error: false, message: "sucess user Created" });
  } else {
    res.status(401).json({ error: true, message: "email address existed" });
  }
});

app.post("/api/driver/login", async function requestHandler(req, res) {
  const password = req.body.password;
  const email = req.body.email;

  const value = await driverModel.findOne({ email });
  if (value != null && value.password === password) {
    res.status(200).json({ error: false, message: "Login successfull" });
  } else {
    res
      .status(401)
      .json({ error: true, message: "Username or password is incorrect" });
  }
});

app.post("/api/driver/loc", async function requestHandler(req, res) {
  const email = req.body.email;
  const lat = req.body.latitude;
  const lng = req.body.longitude;

  console.log(req.body);
  const doc = await driverModel.findOne({ email });
  const update = { lat, lng };
  if (doc) await doc.updateOne(update);
  res.end("200");
});

app.post("/api/loc", async function requestHandler(req, res) {
  const email = req.body.email;
  const lat = req.body.latitude;
  const lng = req.body.longitude;

  console.log(req.body);
  const doc = await userModel.findOne({ email });
  const update = { lat, lng };
  if (doc) await doc.updateOne(update);
  res.end("200");
});

app.post("/api/driver/setActive", async function requestHandler(req, res) {
  console.log("clicked active  " + req.body.email);
  const isActive = req.body.isActive;
  const email = req.body.email;
  const doc = await driverModel.findOne({ email });
  const update = { isActive };
  if (doc) await doc.updateOne(update);

  res.end("200");
});

app.post("/api/register", async function requestHandler(req, res) {
  const name = req.body.name;
  const number = req.body.number;
  const password = req.body.password;
  const email = req.body.email;

  const isEmail = await userModel.exists({ email: email }).then((e) => e);
  if (isNaN(number)) {
    res.status(404).json({ error: true, message: "incorrect field" });
    return;
  }
  if (isEmail == null) {
    const data = new userModel({
      name,
      number,
      password,
      email,
      isEmergency: false,
    });
    data.save();
    res.status(200).json({ error: false, message: "sucess user Created" });
  } else {
    res.status(401).json({ error: true, message: "email address existed" });
  }
});

app.post("/api/login", async function requestHandler(req, res) {
  const password = req.body.password;
  const email = req.body.email;

  const value = await userModel.findOne({ email });
  if (value != null && value.password === password) {
    res.status(200).json({ error: false, message: "Login successfull" });
  } else {
    res
      .status(401)
      .json({ error: true, message: "Username or password is incorrect" });
  }
});

app.post("/api/setCustomer", async function requestHandler(req, res) {
  const customer = req.body.customer;
  const email = req.body.email;
  const doc = await driverModel.findOne({ email });
  const update = { customer };
  if (doc) await doc.updateOne(update);

  res.end("200");
});

app.post("/api/findCustomer", async function requestHandler(req, res) {
  const customer = req.body.customer;
  const email = req.body.email;
  const doc = await driverModel.findOne({ email });
  const update = { customer };
  if (doc) await doc.updateOne(update);

  res.end("200");
});

app.get("/api/getEmergency", async function requestHandler(req, res) {
  const doc = await userModel.find({ isEmergency: true });
  if (doc !== []) {
    console.log(doc);
    res.status(200).json({ driver: doc });
  } else res.end(301);
});
app.get("/api/driver/findme", async function requestHandler(req, res) {
  const { email } = req.query;
  const doc = await userModel.findOne({ customer: email });
  if (doc !== null) res.status(200).json(doc);
  else {
    res.status(302).json({});
  }
});
//for fetcting drever
app.get("/api/findme", async function requestHandler(req, res) {
  const { email } = req.query;
  const doc = await driverModel.findOne({ customer: email });
  if (doc !== null) {
    res.status(200).json([doc]);
    console.log(doc);
  } else {
    res.status(302).json({});
  }
});

app.post("/api/setEmergency", async function requestHandler(req, res) {
  console.log(req.body);
  const isEmergency = req.body.isEmergency;
  const email = req.body.email;
  const doc = await userModel.findOne({ email });
  const update = { isEmergency };
  if (doc) await doc.updateOne(update);

  res.end("200");
});

const server = app.listen(3000);
