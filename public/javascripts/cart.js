//This file handles the shopping cart and is required on every html page

var pizzas = [
    {type: "Pepperoni", price: "13.99", img: "./resources/assets/pizza.jpg"},
    {type: "Sausage", price: "13.99", img: "./resources/assets/pizza.jpg"},
    {type: "Cheese Pizza", price: "11.99", img: "./resources/assets/pizza.jpg"},
    {type: "Ultimate Meat", price: "16.99", img: "./resources/assets/pizza.jpg"},
    {type: "Spicy Italian", price: "15.99", img: "./resources/assets/pizza.jpg"},
    {type: "The Works", price: "18.99", img: "./resources/assets/pizza.jpg"},
];

//Class to hold shopping cart items. 
class Cart {
    constructor(pizza, quantity){
        this.pizza = pizza; //Pizza object matching the objects in pizzas array
        this.quantity = quantity; //integer value matching the quantity of this item in the array
    }
}

//Load shopping cart array from localStorage if exists. Otherwise create empty cart array.
var cartItems = JSON.parse(localStorage.getItem("cart"));
if (typeof cartItems == 'undefined' || cartItems == null) cartItems = [];

//Removes item from cart if it's quantity is 1. Otherwise it decrements this.quantity by 1.
function removeItem(element){
    var type = element.name.split("_")[1];
    var i = cartItems.findIndex(x => x.pizza.type == type);
    if(cartItems[i].quantity == 1){
        cartItems.splice(i,1);
    } else {
        cartItems[i].quantity--;
    }
    updateCart();
}

//Adds up the quantity of items in shopping cart
function sumCart(obj) {
    var sum = 0;
    for(var p of obj){
        sum += p.quantity;
    }
    return sum;
}

//Adds up total price of all items in shopping cart
function sumCartCost(){
    var sum = 0;
    for(var p of cartItems){
        sum += (p.pizza.price * p.quantity);
    }
    return parseFloat(Math.round(sum * 100) / 100);
}

//Adds pizza item to the cart array.
//If it's new, add it to the array. Otherwise, increment this.quantity by 1.
function addCartItem(item){
    var i = cartItems.findIndex(x => x.pizza.type == item.type);
    if(i > -1){    
        cartItems[i].quantity += 1;
    } else {
        cartItems.push(new Cart(item, 1));
    }

    updateCart();
}

//Updates localStorage record for shopping cart array and calls two friend functions
function updateCart(){
    localStorage.setItem("cart", JSON.stringify(cartItems));
    updateCartBody();
    updateCartDisplay();
}

//Updates the shopping cart button display
function updateCartDisplay(){
    $("#cartQuantity").html(`${sumCart(cartItems)} items | $${sumCartCost()}`);
}

//Updates the content within the shopping cart modal
function updateCartBody(){
    var body = $("#cartBody");
    body.html(``);
    var total = 0;
    for(var item of cartItems){
        total += (item.pizza.price*item.quantity);
        body.append(`
            <tr>
                <td>${item.pizza.type}</td>
                <td>${item.quantity}</td>
                <td>$${item.pizza.price * item.quantity}</td>
                <td class="removeItem"><a class="input-group-addon" name="removeItem_${item.pizza.type}" onclick="removeItem(this);" href="#"><span class="glyphicon glyphicon-remove"></span></a></td>
            </tr>
        `);
    }

    $("#cartOrderTotal").html(`<strong>$${sumCartCost()}</strong>`);
}