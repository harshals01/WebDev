//anonymous function

let anonymousfunction = function(){

    console.log("anonymousfunctcall");
}
anonymousfunction();


let greet = function greetText(){

    console.log("hola amigo");
}

greet();

//recursive func

let factorial = function fact(n){

    if (n <=1) {
        return 1;
    }
    return n * fact(n-1);
}

console.log("Factorial is " + factorial(5));

//setTimeout func

let delay = setTimeout(function(){
    console.log("msg is delayed by 1 second");
    }, 1000);

    clearTimeout(delay);

//arrow function

//sum
let sum = (x,y) =>  x+y;
console.log("sum is " + sum(12,4));


//square
let square = (a) => a*a;
console.log(square(5));

//using ternary op

let calculateSumOrDifference = (x,y) => x > y ? x+y : x-y;

console.log("sum will be " + calculateSumOrDifference(31, 12)); 
console.log("difference will be " + calculateSumOrDifference(11, 12)); 

//array methods

let numbers = [1, 2, 3, 4, 5];
let squarearray = numbers.map(x => x * x);

console.log("square of array will be " + squarearray); 
