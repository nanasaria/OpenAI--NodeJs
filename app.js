const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const handlebars = require("express-handlebars");

app.use(express.static(__dirname + "/public"));
app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.render("home");
});

app.post("/find", async (req, res) => {
  const produto = req.body.produto;
  const marca = req.body.marca;
  const modelo = req.body.modelo;

  const desc = `Write in brazilian portuguese a creative ad for the following product to be displayed on social media
  Product: ¨${produto}
  Brand: ${marca}
  Model: ${modelo}
  and generate 100 keywords from that description`;

  await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: desc }],
    })
    .then((response) => {
      const result = [
        {
          Result: response.data.choices[0].message.content,
          desc,
        },
      ];

      res.render("find", result[0]);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(8080, function () {});
