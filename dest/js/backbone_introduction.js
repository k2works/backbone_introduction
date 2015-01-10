/*! some copyright information here */// 連絡先を表すモデルの定義
var Contact = Backbone.Model.extend({
  defaults: {
    firstName:'',
    lastName:'',
    email:''
  }
});
// モデルの初期化
var contact = new Contact({
  firstName:'Alice',
  lastName:'Henderson',
  email:'alice@example.com'
});

console.log(JSON.stringify(contact,null,2));

// 初期値を指定しないモデルの初期化
var emptyContact = new Contact();
console.log(JSON.stringify(emptyContact,null,2));

// 初期化処理
var Contact = Backbone.Model.extend({
  initialize:function() {
    console.log('Contactが初期化されました。');
  }
});

var contact = new Contact();
