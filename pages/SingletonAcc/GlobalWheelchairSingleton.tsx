
class GlobalWheelchairSingleton {
  static wheelchairs = [];

  static wc = [];

  static getItems() {
    console.log("GlobalArraySingleton getItems")
    return this.wheelchairs;
  }


//   static addIntoArray(startTime, endTime, sbStatus){
//     this.wheelchairs = [ {lid: this.wheelchairs.length.toString(), st: startTime.toString(), et: endTime.toString(), sbt: sbStatus.toString()} , ...this.myArray];
//     console.log("Generate Data Label END")
//   }


  static setArray(wheelchairs) {
    this.wheelchairs = wheelchairs;
    this.wc = []
    this.wc = wheelchairs.map(item => ({
      label: item.wc_identify,
      value: item.id,
    }));

    console.log("Set wc array")
    console.log(this.wc)
    console.log("Printed wc array")
  }
}

export default GlobalWheelchairSingleton;
