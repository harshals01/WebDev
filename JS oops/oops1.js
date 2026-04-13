class college{
    constructor(degree, branch){

    this.degree = degree;
    this.branch = branch;
    }

    showDetails(){

        console.log(`I study in ${this.degree} ${this.branch}.`)
    }
}

    const college1= new college("btech", "cse");
    const college2= new college("bba", "consulting");

    college1.showDetails();
    college2.showDetails();

