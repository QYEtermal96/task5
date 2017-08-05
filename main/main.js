const dat = require('../main/datbase');
var loadAllItems = dat.loadAllItems;
var loadPromotions = dat.loadPromotions;
function getRideOf(inputs) {
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].includes("-")) {
            var result = inputs[i].split("-");
            inputs.splice(i, 1);
            for (var j = 0; j < result[1]; j++) {
                inputs.splice(i,0,result[0]);
            }
        }
    }
    return inputs;
}
function countAllItems(tags) {
    var allItems = loadAllItems();
    var freeItems = loadPromotions();
    for (var value of allItems) {
        var number = tags.filter((e) => {
            return e === value.barcode;
        })
        value.number = number.length;
        if(value.number >= 2&&freeItems[0].barcodes.includes(value.barcode)){
            value.sumPrice = ( value.number -1 ) * value.price;
        }else {
            value.sumPrice = value.number * value.price;
        }
    }

    for (var i = 0; i < allItems.length; i++) {
      if (allItems[i].number == 0){
          allItems.splice(i,1);
      }
    }

    return allItems;
}
function countFreeItems(sumAllItems) {
    var freeGoods = loadPromotions();
    var freeItems = [];
    for (var value of sumAllItems) {
        if (freeGoods[0].barcodes.includes(value.barcode)) {
            var object = {
                name: value.name,
                unit: value.unit,
                price: value.price
            }
            if (value.number >= 2) {
                object.number = 1;
            }
            if (object != null) {
                freeItems.push(object);
            }
        }
    }
    return freeItems;
}
module.exports = function main(inputs) {

    var tags = getRideOf(inputs);

    var sumAllItems = countAllItems(tags);

    var freeItems = countFreeItems(sumAllItems);

    var string = "";

    string +="***<没钱赚商店>购物清单***\n";
    var sumMoney = 0;
     for (var value of sumAllItems){
        string += "名称：" + value.name +"，数量：" + value.number + value.unit +"，单价：" + value.price.toFixed(2) + "(元)，小计：" + value.sumPrice.toFixed(2) + "(元)\n";
        sumMoney += value.sumPrice;
     }
     string +="----------------------\n" + "挥泪赠送商品：\n";

    var saveMoney = 0;
     for (var value of freeItems){
        string +="名称：" + value.name + "，数量：" + value.number + value.unit + "\n";
        saveMoney += value.price;
      }

      string +="----------------------\n";

    string +="总计："+ sumMoney.toFixed(2)+"(元)\n";
    string+="节省："+ saveMoney.toFixed(2)+"(元)\n";
    string +="**********************";
     console.log(string);
};