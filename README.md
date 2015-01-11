Backbone.jsで学ぶMVCフレームワーク入門
===
# 目的
# 前提
| ソフトウェア     | バージョン    | 備考         |
|:---------------|:-------------|:------------|
| OS X           |10.8.5        |             |
| Backbone.js  　|1.1.2         |             |
| Underscore.js  |1.7.0         |             |
| jQuery         |1.11.2         |             |


+ [Grunt入門](https://github.com/k2works/grunt_introduction)

# 構成
+ [セットアップ](#1)
+ [モデル実装入門](#2)
+ [複数モデル管理と永続化のしくみ](#3)
+ [ビュー、コントローラの実装](#4)
+ [URLと処理を紐つけるルーティングの基本](#5)

# 詳細
## <a name="1">セットアップ</a>
```bash
$ npm install
$ grunt
```

## <a name="2">モデル実装入門</a>
### Backbone.Modelとは
#### Backbone.Modelオブジェクトの定義
```javascript
// 連絡先を表すモデルの定義
var Contact = Backbone.Model.extend({
  defaults: {
    firstName:'',
    lastName:'',
    email:''
  }
});
```

```javascript
// モデルの初期化
var contact = new Contact({
  firstName:'Alice',
  lastName:'Henderson',
  email:'alice@example.com'
});
```

### データ構造の確認
#### 初期化の実装
```javascript
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
```
#### 初期化処理の実装
```javascript
// 初期化処理
var Contact = Backbone.Model.extend({
  initialize:function() {
    console.log('Contactが初期化されました。');
  }
});

var contact = new Contact();
```

### 属性値の設定と取得
```javascript
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
```

### イベント
#### イベントの監視
```javascript
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
```

#### イベントの監視
##### イベントの監視の解除
```javascript
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
```

#### 独自のイベントの発生
```javascript
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
```

#### 他のインスタンスに対するイベントの監視
```javascript
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
```

#### 独自処理の実装
```javascript
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
```

#### 属性値の検証
```javascript
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
```

## <a name="3">複数モデル管理と永続化のしくみ</a>
### Backbone.Collectionとは
#### Backbone.Collectionオブジェクトの定義
```javascript
// 連絡先モデルのコレクションの定義
var Contact = Backbone.Model.extend({
  defaults: {
    firstName:'',
    lastName:'',
    email:''
  }
});

var ContactCollection = Backbone.Collection.extend({
  // modelプロパティにどのモデルを管理するかを宣言する
  // この宣言によって、コレクションが保持するモデルは
  // Contactのインスタンスとなる

  model: Contact,

  // initialize()メソッドを定義できる点はBackbone.Modelと同じ
  initialize: function() {
    console.log('ContactCollectionが初期化されました。');
  }
});
```
### モデルの追加
```javascript
// モデルの追加方法１
var contactCollection = new ContactCollection();

var alice = new Contact({
  firstName:'Alice',
  lastName:'Henderson',
  email:'alice@example.com'
});

var bob = new Contact({
  firstName:'Bob',
  lastName:'Sanders',
  email:'bob@example.com'
});

contactCollection.add(alice);
contactCollection.add(bob);

console.log(JSON.stringify(contactCollection,null,2));
console.log(contactCollection.length);
contactCollection.add([alice,bob]);

// 同じモデルを追加した場合
var contactCollection = new ContactCollection();
contactCollection.add(alice);
contactCollection.add(alice);

console.log(contactCollection.length);
// => 1

// モデルの追加方法２
contactCollection.add({
  firstName:'Alice',
  lastName:'Henderson',
  email:'alice@example.com'
});

// モデルの一括追加
contactCollection.add([
  {
    firstName:'Alice',
    lastName:'Henderson',
    email:'alice@example.com'
  },{
    firstName:'Bob',
    lastName:'Sanders',
    email:'bob@example.com'
  }
]);

// モデルの一括追加
contactCollection.add([
  {
    firstName:'Alice',
    lastName:'Henderson',
    email:'alice@example.com'
  },{
    firstName:'Bob',
    lastName:'Sanders',
    email:'bob@example.com'
  }
]);

var contactCollection = new ContactCollection([alice,bob]);
```
#### モデルの削除
```javascript
// モデルの削除
// コレクションからaliceモデルを削除
contactCollection.remove(alice);
console.log(JSON.stringify(contactCollection,null,2));
```
#### モデルのリセット
```javascript
// モデルのリセット
var john = new Contact({
  firstName:'John',
  lastName:'Doe',
  email:'john@example.com'
});

var jane = new Contact({
  firstName:'Jane',
  lastName:'Doe',
  email:'jane@example.com'
});

contactCollection.reset([john,jane]);

console.log(JSON.stringify(contactCollection,null,2));
```
### イベント
```javascript
// addイベントの監視
contactCollection.on('add',function(contact) {
  // コールバック関数の引数から追加されたモデルを参照できる
  console.log('モデルが追加されました。',
  contact.get('firstName'));
});

//
contactCollection.add([
  {
    firstName:'John',
    lastName:'Smith',
    email:'johnesmith@example.com'
  },{
    firstName:'Jane',
    lastName:'Smith',
    email:'janesmith@example.com'
  }
]);
```
### Underscore.jsの機能
```javascript
// Unserscore.jsのメソッドの呼び出し
contactCollection.each(function(contact) {
  //
});

// filter()メソッド
var filtered = contactCollection.filter(function(contact) {
  // Contactモデルがage(年齢)属性を持っていたとして
  // その年齢が３０以上のモデルだけを抽出した配列を返す
  return contact.get('age') >= 30;
});
```
### データの永続化
#### データの取得
```javascript
// urlプロパティの定義
var ContactCollection = Backbone.Collection.extend({
  url:'/contacts',
  model:Contact
});

// fetch()メソッドによるデータの取得
var contactCollection = new ContactCollection();
contactCollection.fetch();

// コールバック関数の指定１
// successオプションにコールバック関数を渡して
// コレクションのfetch()が完了後に次の処理を行う例
contactCollection.fetch({
  success:function(collection) {
    showContact(Collection);
  }
});

// コールバック関数の指定２
// jQuery Deferredが返すPromiseオブジェクトを利用して
// コレクションのfetch()が完了後に次の処理を行う例
contactCollection.fetch().then(function(collection) {
  showContact(Collection);
});
  
// コールバック関数の指定３
// 複数のモデルとコレクションによるfetch()が完了した後
// 次の処理を行う例
var fetchingContactCollection = contactCollection.fetch();
var fetchingOtherData = otherData.fetch();

$.when(fetchingContactCollection, fetchingOtherData)
    .then(function(collection,otherData){
      //
    });
```
#### データの保存
```javascript
// リソースの新規作成(POSTリクエスト)
var ContactCollection = Backbone.Collection.extend({
  url:'/contacts',
  model: Contact
});

contactCollection.create({
  firstName:'Alice',
  lastName:'Henderson',
  email:'alice@example.com'
});
// クライアント側で新しいデータが作られた
// (idをまだ持たない）のでPOSTリクエストになる
// 例：POST http://localhost:9000/contacts

// リソースの更新(PUTリクエスト)
var contact = contactCollection.get(1233);

// save()に直接オブジェクトを渡して更新可能
contact.save({
  lastName:'Sanders'
});

// id属性を持つ、サーバ側のリソースが作成済みなので
// そのURLへの更新のためのPUTリクエストが行われる
// 例：PUT http://localhost:9000/contacts/123
```
#### データの削除

## <a name="4">ビュー、コントローラの実装</a>
### Backbone.Viewとは
#### Backbone.Viewオブジェクトの定義
```javascript
// ビューの定義
var ContactView = Backbone.View.extend({
  initialize: function() {
    console.log('ContacViewが初期化されました。');
  }
});
```
### モデルのデータの表示
```javascript
// ビューの定義
var ContactView = Backbone.View.extend({

  render:function() {
    // HTMLテンプレートを取得する
    var template = $('#contact-template').html();

    // HTMLテンプレートにモデルのデータを適用する
    // モデルのtoJSON()メソッドを使って属性を
    // オブジェクトの形式で書き出す
    // var html = _.template(template,this.model.toJSON());
    var template = $('#contact-template').html();
    var compiled = _.template(template);
    var html = compiled(this.model.attributes);

    // 自身が保持しているDOM要素を更新する
    this.$el.html(html);

    return this;
  }
});                            

// モデルとビューの生成
var contact = new Contact({
  firstName:'Alice',
  lastName:'Henderson',
  email:'alice@example.com'
});

// 初期化時のmodelオプションに生成したモデルの参照を渡す
// Backbone.Viewは自動的にその定義内でその参照を
// this.modelに保持する
var contactView = new ContactView({
  model:contact
});

$(function() {
  // render()メソッドで生成したビュー自身を返すので
  // メソッドチェーンでビューが持つメソッドを続けて
  // 記述することができる
  contactView.render().$el.appendTo($(document.body))
});
```
### elプロパティについて
```javascript
// elプロパティの設定
var ContactView = Backbone.View.extend({
  el: '#contactView-container'
});
```
#### タグ名の指定
```javascript
// タグ名の指定
var Paragraph = Backbone.View.extend({
  tagName:'p'
});

var p = new Paragraph();
console.log(p.el.tagName);
// => 'P'
```
#### 属性の指定
```javascript
// 属性の指定
var ContactView = Backbone.View.extend({
  attributes: {
    'data-attribute':'someData',
    'data-other-attribute':'otherData'
  }
});
```
#### クラス名の指定
```javascript
// クラス名の指定
var ContactView = Backbone.View.extend({
  className:'contact'
});

// 複数のクラス名の指定
var ContactView = Backbone.View.extend({
  className:'box box-contact'
});
```
#### ID名の指定
```javascript
// ID名の指定
var ContactView = Backbone.View.extend({
  id: function() {
    // 評価の戻り値がid属性の値となる
    return 'contact-' + this.model.get('id');
  }
});
```
### DOMイベント
```javascript
// Todoモデルの定義
var Todo = Backbone.Model.extend({
  defaults: {
    title:'',
    completed:false
  }
});

// TodoViewビューの定義
var TodoView = Backbone.View.extend({

  template:'<label>'+
      '<input class="toggle" type="checkbox">'+
      '<span><%= title %></span>'+
      '</label>',

  events: {
    // '.toggle'セレクタで特定できる要素のクリックイベントを
    // 監視してtoggleCompleted()メソッドを呼び出す
    //
    // 内部ではthis.$el.on()が実行されている
    'click. toggle':'toggleCompleted'
  },

  render: function() {
    var compiled = _.template(this.template);
    var html = compiled(this.model.toJSON());
    this.$el.html(html);
    return this;
  },
  toggleCompleted: function(e) {
    // jQueryのしくみで動いているのでは引数eは
    // jQueryのイベントオブジェクトを参照している
    console.log('チェックボックスがクリックされました。');

    // コールバック関数のthisは現在のビューインスタンスを指す
    console.log(this instanceof TodoView);
    // => true
  }
});

// モデルをDOMツリーへ挿入
var todo = new Todo({ title:'牛乳を買う'});

var todoView = new TodoView({
  model: todo
});

$(function() {
  todoView.render().$el.appendTo($(document.body));
});
```

## <a name="5">URLと処理を紐つけるルーティングの基本</a>
### Backbone.Routerとは
#### Backbone.Routerオブジェクトの定義
```javascript
// ルータの定義
var Router = Backbone.Router.extend({
  initialize: function() {
    console.log('初期化されました。');
  },

  // 例；http://example.com/#state1
  //     http://example.com/#state2
  routes:{
    'state1':'state1',
    'state2':'state2'
  },

  // http://example.com/#state1に
  // アクセスした場合に呼び出される
  state1: function() {
    console.log('state1');
  },

  // http://example.com/#state2に
  // アクセスした場合に呼び出される
  state2: function() {
    console.log('state2');
  }
});

// ルータの利用
var router = new Router();

// Backbone.historyの初期化
Backbone.history.start();
```
### さまざまなルーティング
```javascript
// ルーティングの例１
var Router = Backbone.Router.extend({
  routes:{
    'contacts/:id':'showContact'
  },

  showContact: function(id) {
    // contacts/123にアクセスすると
    // 123というログが残る
    console.log(id);
  }
});

// ルーティングの例２
var Router = Backbone.Router.extend({
  routes: {
    'contacts/:id/edit':'editContact'
  },

  editContact: function(id) {
    //
  }
});

// ルーティングの例３
var Router = Backbone.Router.extend({
  routes:{
    '/search/:query/page:page':'showSearchResult'
  },
  showSearchResult: function(query,page) {
    //
  }
});
```

# 参照
+ [JavaScriptエンジニア養成読本](http://gihyo.jp/book/2014/978-4-7741-6797-8)
+ [JavaScriptエンジニア養成読本Backbone.js特集の訂正](http://text.ykhs.org/2014/10/22/javascript_engineer_training_book_fix.html)
+ [BACKBONE.JS](http://backbonejs.org/)
+ [UNDERSCORE.JS](http://underscorejs.org/)
+ [jQuery](http://jquery.com/)
+ [[grunt] ファイル保存したタイミングで、ブラウザを自動的にリロードして、確認作業をスピードアップさせよう](http://www.yoheim.net/blog.php?q=20130409)
