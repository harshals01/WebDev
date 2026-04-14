class Car {
  constructor(brand, model) {
    this.brand = brand; 
    this.model = model; 
  }

  
  showDetails() {
    console.log(`i have a ${this.brand} ${this.model}.`);
  }
}

const car1 = new Car("Toyota", "Corolla");
const car2 = new Car("Honda", "Civic");

car1.showDetails(); 
car2.showDetails();
