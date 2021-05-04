var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DataSchema = new Schema(
  {
    "新卒":{type:Number},
    "正社員":{type: Number},
    "派遣社員":{type: Number},
    "契約社員":{type: Number}	,
    "嘱託社員":{type: Number}	,
    "業務委託":{type: Number},
    "請負":{type: Number},
    "アルバイト･パート":{type: Number},
    "ボランティア":{type: Number},
    "インターン":{type: Number},
    "総件数":{type: Number},
    "900万円":{type: Number},
  	"800万円":{type: Number},
    "700万円":{type: Number},
    "600万円":{type: Number},
    "500万円":{type: Number},
    "400万円":{type: Number},
    "300万円":{type: Number},
    "200万円":{type: Number},
    "1200万円":{type: Number},
    "1100万円":{type: Number},
    "1000万円":{type: Number}
  }
);
module.exports = mongoose.model('Data', DataSchema);