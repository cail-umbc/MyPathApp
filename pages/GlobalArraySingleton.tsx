import EventEmitter from 'eventemitter3';

class GlobalArraySingleton {
  static myArray = [];
  static eventEmitter = new EventEmitter();

  static labels = []
  static lData = []

  static getItems() {
    //console.log(this.myArray.reverse())
    console.log("GlobalArraySingleton getItems")
    return this.myArray;
  }

  static generateDataLabel()
  {

    console.log("<==== Cur Test 0====>")

    const monthDic = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    }

    const numMonthDic = {
      1: "Jan",
      2: "Feb",
      3: "Mar",
      4: "Apr",
      5: "May",
      6: "Jun",
      7: "Jul",
      8: "Aug",
      9: "Sep",
      10: "Oct",
      11: "Nov",
      12: "Dec",
    }
    
    this.labels = []
    this.lData = []
    
    if (this.myArray.length == 0)
    {
      this.labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
      this.lData = [0,0,0,0,0,0]
      return
    }
    //console.log("<==== Cur Test ====>")
    
    const date = new Date(parseInt(this.myArray[0].st));
    const monthName = date.toLocaleString('default', { month: 'long' });
    var monThNum = monthDic[monthName]
    var year = date.getFullYear();

    //console.log(monthName + "----" + monThNum)
    
    const monthYearDic = []
    for (let i = 0; i < 6; i++) {
      monthYearDic.push({month: numMonthDic[monThNum], year: year, count: 0})
      monThNum -= 1
      if (monThNum <= 0){
        monThNum = 12
        year -= 1
      }
    }
    
    // console.log("<=======================>")
    // console.log(this.myArray.length)
    // console.log(monthYearDic)
    // console.log("<=======================>")

    for (i = 0; i < this.myArray.length; i++){
      var curDate = new Date(parseInt(this.myArray[i].st))
      var curYear = curDate.getFullYear();
      var curMonth = curDate.toLocaleString('default', { month: 'short' });

      // console.log("Cur Year")
      // console.log(curYear)
      // console.log("Cur Month")
      // console.log(curMonth)

      const myObj = monthYearDic.find(m=> m.year == curYear && m.month == curMonth)
      if (myObj == null){
        //console.log("Not found")
      }else{
        myObj.count += 1
        //console.log("Counter")
      }
    }
    // console.log("Month Year Dic")
    // console.log(monthYearDic)
    for (i = 0; i < monthYearDic.length; i++)
    {
      this.labels.push(monthYearDic[i].month)
      this.lData.push(monthYearDic[i].count)
    }

    // console.log("L data, l label")
    // console.log(this.labels)
    // console.log(this.lData)
  }

  static getLabels()
  {
    return this.labels;
  }

  static getLData(){
    return this.lData;
  }

  static addIntoArray(startTime, endTime, sbStatus){
    console.log("=================> Array is updated")

    this.myArray = [ {lid: this.myArray.length.toString(), st: startTime.toString(), et: endTime.toString(), sbt: sbStatus.toString()} , ...this.myArray];
    this.generateDataLabel();
    console.log("Generate Data Label END")
    this.eventEmitter.emit('myArrayUpdated');
  }

  static getTotalEvents(){
    return this.myArray.length
  }

  static setArray(newArray) {
    //console.log("==> Set array")
    this.myArray = newArray.reverse();
    this.generateDataLabel()
    this.eventEmitter.emit('myArrayUpdated');
  }
}

export default GlobalArraySingleton;
