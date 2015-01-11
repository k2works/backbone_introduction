// 連絡先を表すモデルの定義
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

// 属性値の設定
var contact = new Contact();

// firstNam属性に'Alice'を設定する
contact.set('firstName','Alice');

// オブジェクトで複数の属性を設定する
contact.set({
  firstName:'Alice',
  lastName:'Henderson'
})

// 属性値の取得
contact.get('firstName');
// => 'Alice'
contact.get('lastName');
// => 'Henderson'

// 属性値の有無の確認
contact.has('firstName');
// => true
contact.has('email');
// => false

// attributesへの直接アクセス
// attributesに直接設定した属性値もget()で取得できる
contact.attributes.email = 'alice@example.com';
contact.get('email');
// => 'alice@example.com'

// set()された値をattributesから直接取得できる
contact.set('lastName','Sanders');
contact.attributes.lastName;
// => 'Sanders'

// changeイベントの監視
var contact = new Contact({
  firstName: 'Alice',
  lastName: 'Hendersion',
  email: 'alice@example.com'
});

// changeイベントですべての属性の変化を監視する
contact.on('change',function() {
  console.log('属性が変更されました。');
});

// change:属性名と記述することで
// 特定の属性値の変化に絞って監視できる
contact.on('change:email', function() {
  console.log('email属性が変更されました。');
});

contact.set('email','henderson@example.com');
           
// イベントの監視の解除
contact.off();

// イベント名の指定
contact.off('change');

// コールバック関数を特定して解除
var onChange = function() {
  console.log('属性が変更されました。');
};

var onChangeEmail = function() {
  console.log('email属性が変更されました。');
}

contact.on('chnage',onChange);
contact.on('change:email',onChangeEmail);

// 'change'イベントに対してonChange()メソッドを
// 紐付けた監視だけを解除する
contact.off('change',onChange);

// この属性値の変更に反応するのはonChangeEmail()
// メソッドのみとなる
contact.set('email','henderson@example.com');

// 独自のイベントの発生
var Contact = Backbone.Model.extend({

  initialize: function() {
    // selectイベントの発生を監視する
    this.on('select',function(selected) {
      console.log('selectイベントが発生しました。');
    });
  },

  select: function() {
    // 選択中のフラグを立てる。連絡先のデータではないので
    // 属性ではなく単なるプロパティとして扱う
    this.selected = true;

    // 独自イベントのselectを発生させる
    // trigger()メソッドの第２引数以降の指定は
    // コールバック関数が受け取れるパラメータとなる
    this.trigger('select',this.selected);   
  }
});

// Contactインスタンスを生成してselect()メソッドを呼び出す
var contact = new Contact();
contact.select();

// listenTo()メソッド
var ContactView = Backbone.View.extend({
  initialize: function() {
    // 引数のon()メソッドと似ているが
    // 第1引数で監視対象を指定する
    //
    // listenTo(監視対象、イベント名、コールバック関数)
    //
    this.listenTo(this.model,'change',function() {
      console.log('モデルの属性が変更されました。');
    });
  }
});

// 独自処理の実装
var Contact = Backbone.Model.extend({
  defaults: {
    firstName:'',
    lastName:'',
    email:''
  },

  fullName: function() {
    return this.get('firstName') + '' + this.get('lastName');    
  }
});

var contact = new Contact({
  firstName:'Alice',
  lastName:'Henderson'
});

contact.fullName();
// => 'AliceHenderson'

// validate()による検証とinvalidイベントによる監視
var Contact = Backbone.Model.extend({
  defaults: {
    firstNam:'',
    lastName:'',
    email:''
  },

  initialize: function() {
    // 検証中に発生したエラーを監視する
    this.on('invalid',function(model,err) {

      // invalidイベントに紐付くコールバック関数は
      // validate()メソッドが返すエラーメッセージを
      // 受け取ることができる
      //
      // あるいはモデルのvalidationErrorプロパティを
      // 参照してもよい
      console.log(err);
      // => 'frstName属性とlastName属性の両方が必要です。'            
    });
  },

  validate: function(attrs) {
    if(!attrs.firstName || !attrs.lastName) {
      return 'firstName属性とlastName属性の両方が必要です。';
    }
  }
});


var contact = new Contact({
  firstName:'Alice',
  lastName:'Henderson',
  email:'alice@example.com'
});

// validate()メソッドによる検証を通過しない変更を
// {validate:true}オプションを付けてわざと行う
contact.set({
  lastName:''
},{
  validate:true
});

// モデルの属性が変化していないことを確認できる
console.log(JSON.stringify(contact,null,2));

