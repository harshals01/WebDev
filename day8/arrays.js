let student = ["mohan", "bagan", "prakash", "dhoni"];
console.log(student);

for (let index in student) {
console.log(student[index]);
}

student.push("nancy");
console.log(student);


student.splice(1,1);
console.log(student);


let longNames = student.filter(name => name.length >= 5);
console.log(longNames); 


const helpersum= (acc, curr) => acc+curr
sum = student.reduce(helpersum, 0);
console.log(sum);


//arrayops

let arr1 = [1, 2, 3];
let arr2 = arr1; 

console.log('ARR1:', arr1); 
console.log('ARR2:', arr2); 

arr2.push(4);

console.log('Updated ARR2:', arr2);
console.log('Updated ARR1:', arr1);
