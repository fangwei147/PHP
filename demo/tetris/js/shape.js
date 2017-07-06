//定义Cell类型描述一个格子: r,c,src
class Cell{
  constructor(r,c,src){
    "use strict";
    this.r=r;
    this.c=c;
    this.src=src;
  }
}
//定义所有图形类型的父类型Shape，只有一个属性: cells保存4个新创建的cell类型格子对象
class Shape{
  constructor(
    r0,c0,r1,c1,r2,c2,r3,c3,src,states,orgi){
    "use strict";
    this.cells=[
      new Cell(r0,c0,src),
      new Cell(r1,c1,src),
      new Cell(r2,c2,src),
      new Cell(r3,c3,src)
    ];
    //保存每种图形的旋转状态数组
    this.states=states;
    //获得参照格对象
    this.orgCell=this.cells[orgi];
    //保存当前处在第几个状态
    this.statei=0;
  }
  moveDown(){
    "use strict";
    //遍历当前图形的cells数组中每个cell
    for(var cell of this.cells)
      cell.r++;//将每个cell的r+1
  }
  moveLeft(){
    "use strict";
    //将当前图形的cells数组中每个cell的c-1
    for(var cell of this.cells)
      cell.c--;
  }
  moveRight(){
    "use strict";
    //将当前图形的cells数组中每个cell的c+1
    for(var cell of this.cells)
      cell.c++;
  }
  rotateR(){
    "use strict";
    //将当前图形的statei+1
    this.statei++;
    //如果statei等于states数组的长度
    if(this.statei
        ==this.states.length)
      //将statei改为0
      this.statei=0;
    //旋转
    this.rotate();
  }
  rotate(){
    "use strict";
    //获得states数组中statei位置的状态对象state
    var state=
      this.states[this.statei];
    //第0个cell的r=orgCell的r+state的r0
    this.cells[0].r=
      this.orgCell.r+state.r0;
    //第0个cell的c=orgCell的c+state的c0
    this.cells[0].c=
      this.orgCell.c+state.c0;
    //第1个cell的r=orgCell的r+state的r1
    this.cells[1].r=
      this.orgCell.r+ state.r1;
    //第1个cell的c=orgCell的c+state的c1
    this.cells[1].c=
      this.orgCell.c+state.c1;
    //第2个cell的r=orgCell的r+state的r2
    this.cells[2].r=
      this.orgCell.r+state.r2;
    //第2个cell的c=orgCell的c+state的c2
    this.cells[2].c=
      this.orgCell.c+state.c2;
    //第3个cell的r=orgCell的r+state的r3
    this.cells[3].r=
        this.orgCell.r+state.r3;
    //第3个cell的c=orgCell的c+state的c3
    this.cells[3].c=
      this.orgCell.c+state.c3;
  }
  rotateL(){
    "use strict";
    //将当前图形的statei-1
    this.statei--;
    //如果statei等于-1
    if(this.statei==-1)
      //将statei改为states的长度-1
      this.statei=
        this.states.length-1
    //旋转
    this.rotate();
  }
}
//定义State类型来描述每种状态
class State{
  constructor(
    r0,c0,r1,c1,r2,c2,r3,c3){
    "use strict";
    this.r0=r0;this.c0=c0;
    this.r1=r1;this.c1=c1;
    this.r2=r2;this.c2=c2;
    this.r3=r3;this.c3=c3;
  }
}
//定义具体图形类型: T,O,I
class T extends Shape{
  constructor(){
    "use strict";
    super(
      0,3,0,4,0,5,1,4,
      "img/T.png",
      [
        new State(
          0,-1, 0,0, 0,+1, +1,0),
        new State(
          -1,0, 0,0, +1,0, 0,-1),
        new State(
          0,+1, 0,0, 0,-1, -1,0),
        new State(
          +1,0, 0,0, -1,0, 0,+1)
      ],
      1 //orgi
    );
  }
}
class O extends Shape{
  constructor(){
    "use strict";
    super(
      0,4,0,5,1,4,1,5,
      "img/O.png",
      [
        new State(
          0,-1, 0,0, +1,-1, +1,0)
      ],
      1
    );
  }
}
class I extends Shape{
  constructor(){
    "use strict";
    super(
      0,3,0,4,0,5,0,6,
      "img/I.png",
      [
        new State(
          0,-1, 0,0, 0,+1, 0,+2),
        new State(
          -1,0, 0,0, +1,0, +2,0)
      ],
      1
    );
  }
}