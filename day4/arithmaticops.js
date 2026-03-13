const x=6;
const y=3;

console.log("basicops");
console.log(x % y);
console.log(x / y);
console.log(x ** y);


console.log("string and nos. a and b");

const a= 2;
const b= "32";
console.log(a+b);
console.log(a-b);
console.log(a*b);
console.log(a/b);

console.log("string cant be converted");

const c= "one";
const d= "two";
console.log(c+d);
console.log(c-d);
console.log(c*d);
console.log(c/d);


console.log("string conversion");

const e= "2";
const e_number = Number(e);

if (!isNaN(e)) {

    console.log(e_number + 8);       
}
else {
    console.log("invalid input");

}


console.log("type conversion");

const g= "2";
const h = Number(e);
const i = "";
const j = String(i);
const k= (Boolean(i));

console.log(typeof g);
console.log(typeof h);
console.log(typeof i);
console.log(typeof j);
console.log(k);











