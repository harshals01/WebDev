//let

let text ="js basics"

console.log(text);
text = "yolo"

let messagge;
messagge = "mool is away";

console.log(typeof messagge);
console.log(text)

//reassign
const number = 10;
number==15;
console.log(number); 

//bool

let isProductInCart=true;

if (isProductInCart) {
  console.log("Product is in the cart.");
} else {
  console.log("Product is not in the cart.");
}

//null
let user = null;
console.log(user); // Outputs: null
console.log(typeof user); // Outputs: object

//object
const person = {
    name: "Prakash",
    age: 25,
    education: "Engineer"
};
console.log(person);

//array
const arr = [1,2,3,4,5,6,7];
console.log(arr);

//concatenation
let name= "prakash";
const age = 25;
let concat= `my name is ${name} and my age is ${age}`;

console.log("my name is " + name + " and i am " + age + " yo ");
console.log(concat);
