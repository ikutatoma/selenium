var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var Data = require('./model/data_model')
var logger = require('morgan');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


var mongoDB = process.env.MONGODB_URI || "mongodb+srv://kuunankuu:Kupei115@cluster0.tgcyw.mongodb.net/sele?retryWrites=true&w=majority";
const option = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  writeConcern: {
    j: true,
  },
}
mongoose.connect(mongoDB, option);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//ここからselenium
const fs = require('fs');
const {
  promisify
} = require('util');
const webdriver = require('selenium-webdriver');
const {
  title
} = require('process');
const {
  EOL
} = require('os');
const {
  Builder,
  By,
  until
} = webdriver;

const capabilities = webdriver.Capabilities.chrome();
capabilities.set('chromeOptions', {
  args: [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    `--window-size=1980,1200`
  ]
});

// awaitを使うので、asyncで囲む
(async () => {

  // ブラウザ立ち上げ
  const driver = await new Builder().withCapabilities(capabilities).build();

  //indeedへ移動
  function data_create(inner, key_model) {
    let result = new Object();
    //sele_key  ------> 正社員、新卒など　in inner  取得したData
    //inner[sele_key]-> 数字 in inner 取得したData
    //key_model[i]-----> 正社員、新卒など　in スキーマにあるkey
    for (var i = 0; i < key_model.length; i++) {
      loop1: for (let sele_key in inner) {
        if (sele_key == key_model[i]) {
          result[key_model[i]] = inner[sele_key];
          break;
        } else {
          result[key_model[i]] = null;
        }
      }
    }
    var put_data = new Data(result);
    put_data.save(function (err) {
      if (err) {
        console.log("エラーだってよ");
        console.log(err, null);
        return
      }
    });
  }
 

  var code_lang = ["Java", "Ruby", "Javascript", "TypeScript"]
  for (var ni = 0; ni < 4; ni++) {
    await driver.get(`https://jp.indeed.com/%E6%B1%82%E4%BA%BA?q=${code_lang[ni]}`);
    var key_data = [
      "新卒",
      "正社員",
      "派遣社員",
      "契約社員",
      "嘱託社員",
      "業務委託",
      "請負",
      "アルバイト･パート",
      "ボランティア",
      "インターン",
      "総件数",
      "900万円",
      "800万円",
      "700万円",
      "600万円",
      "500万円",
      "400万円",
      "300万円",
      "200万円",
      "1200万円",
      "1100万円",
      "1000万円"
    ]
    let el0 = await driver.findElement({
      id: 'filter-job-type-menu'
    });
    let el1 = await el0.findElements({
      className: 'rbLabel'
    });
    let data = new Object();
    for (var i = 0; i < el1.length; i++) {
      if (i % 2 == 0) {
        var el1_txt = await el1[i].getAttribute('innerHTML');
        data[el1_txt] = null;
      } else {
        let el1_b = await el1[i].getAttribute('innerHTML');
        let el1_num = el1_b.replace(/[^0-9]/g, '');
        data[el1_txt] = el1_num;
      }
    }
    let el2 = await driver.findElement({
      id: 'filter-salary-estimate-menu'
    });
    let el3 = await el2.findElements({
      className: 'rbLabel'
    });
    for (var i = 0; i < el3.length; i++) {
      if (i % 2 == 0) {
        var el3_txt_b = await el3[i].getAttribute('innerHTML');
        var el3_txt = el3_txt_b.replace("+", '');
        data[el3_txt] = null;
      } else {
        let el3_b = await el3[i].getAttribute('innerHTML');
        let el3_num = el3_b.replace(/[^0-9]/g, '');
        data[el3_txt] = el3_num;
      }
    }
    data_create(data, key_data);
  }
})();

module.exports = app;