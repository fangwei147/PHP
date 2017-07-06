var game={
  //游戏主界面div
  pg:document.querySelector(
    ".playground"
  ),
  //每个格子大小和游戏容器的内边距
  CSIZE:26, OFFSET:15,
  shape:null,//保存主角图形
  nextShape:null,//保存备胎图形
  interval:200,//下落速度
  timer:null,//保存定时器序号
  RN:20,CN:10,//保存总行数,列数
  //保存所有停止下落的方块的墙
  wall:null,
  //保存游戏的得分和行数
  score:0,lines:0,
  SCORES:[0,10,30,60,100],
        //0 1  2  3  4
  status:0,//保存游戏状态
  GAMEOVER:0,//游戏结束
  RUNNING:1,//运行中
  PAUSE:2,//暂停
  //ES6: 对象直接量中的方法可省略":function"
  //启动游戏
  start(){//this->game
    "use strict";
    //将游戏状态重置为运行中
    this.status=this.RUNNING;
    //将分数和行数归0
    this.score=0; this.lines=0;
    //创建空数组保存在wall中
    this.wall=[];
    //r从0~<RN
    for(var r=0;r<this.RN;r++)
    //向wall中压入一个CN个空元素的数组
      this.wall.push(
        new Array(this.CN));

    //随机生成主角和备胎
    this.shape=this.randomShape();
    this.nextShape=
      this.randomShape();
    this.paint();//重绘一切
    //启动周期性定时器，每隔interval，自动调用一次moveDown，将序号保存在timer
    this.timer=setInterval(
      this.moveDown.bind(this),
      this.interval
    );
    //为网页绑定键盘按下事件
    document.onkeydown=function(e){
      //this->document->game
      //判断按键号
      switch(e.keyCode){
        case 37:
          if(this.status
            ==this.RUNNING)
            this.moveLeft();
          break;
        case 39:
          if(this.status
            ==this.RUNNING)
            this.moveRight();
          break;
        case 40:
          if(this.status
            ==this.RUNNING)
            this.moveDown();
          break;
        case 32:
          if(this.status
            ==this.RUNNING)
            this.hardDrop();
          break;
        case 38:
          if(this.status
            ==this.RUNNING)
            this.rotateR();
          break;
        case 90://Z
          if(this.status
            ==this.RUNNING)
            this.rotateL();
          break;
        case 80://P
          if(this.status
            ==this.RUNNING)
            this.pause();
          break;
        case 81://Q
          if(this.status
            !=this.GAMEOVER)
            this.quit();
          break;
        case 83://S
          if(this.status
              ==this.GAMEOVER)
            this.start();
          break;
        case 67://C
          if(this.status
              ==this.PAUSE)
            this.myContinue();
          break;
      }
    }.bind(this);
  },
  myContinue(){
    "use strict";
    //修改状态为运行中
    this.status=this.RUNNING;
    //启动定时器
    this.timer=setInterval(
      this.moveDown.bind(this),
      this.interval
    );
    this.paint();//重绘一切
  },
  //暂停游戏
  pause(){
    "use strict";
    //修改游戏状态为暂停
    this.status=this.PAUSE;
    //停止定时器
    clearInterval(this.timer);
    this.timer=null;
    this.paint();//重绘一切
  },
  //放弃游戏
  quit(){
    "use strict";
    //修改游戏状态为暂停
    this.status=this.GAMEOVER;
    //停止定时器
    clearInterval(this.timer);
    this.timer=null;
    this.paint();//重绘一切
  },
  //根据状态添加状态图片
  paintStatus(){
    "use strict";
    //如果游戏状态不是RUNNING
    if(this.status!=this.RUNNING){
      //创建图片
      var img=new Image();
      //如果状态为暂停，就设置图片的src为暂停图片
      if(this.status==this.PAUSE)
        img.src="img/pause.png";
      else if(
        this.status==this.GAMEOVER)
      //否则如果状态为游戏结束，就设置图片的src为游戏结束图片
        img.src="img/game-over.png";
      //将图片追加到pg中
      this.pg.appendChild(img);
    }
  },
  //随机生成一个图形
  randomShape(){
    "use strict";
    //在0~2之间生成一个随机数
    var r=parseInt(Math.random()*3)
    //判断r
    switch(r){
      case 0:
        return new O();
      case 1:
        return new I();
      case 2:
        return new T();
    }
  },
  rotateR(){
    "use strict";
    this.shape.rotateR();
    //如果可以旋转
    if(this.canRotate())
      this.paint();
    else//否则
      this.shape.rotateL();
  },
  //判断旋转后的图形是否有撞墙或越界
  canRotate(){
    "use strict";
    //遍历shape的cells中每个cell
    for(
      var cell of this.shape.cells){
      //如果cell的r或c越界
      if(cell.r<0||cell.r>=this.RN        ||cell.c<0||cell.c>=this.CN)
        return false;//就不能旋转
      //如果wall中和cell相同位置有格
      if(this.wall[cell.r][cell.c])
        return false;//就不能旋转
    }
    return true;
  },
  rotateL(){
    "use strict";
    this.shape.rotateL();
    //如果可以旋转
    if(this.canRotate())
      this.paint();
    else//否则
      this.shape.rotateR();
  },
  //硬着陆
  hardDrop(){
    "use strict";
  //只要还可以下落，就反复调用moveDown
    while(this.canDown())
      this.moveDown();
  },
  //判断能否左移
  canLeft(){
    "use strict";
    //遍历shape中cells中每个格
    for(
      var cell of this.shape.cells){
      //如果当前格的c等于0
      if(cell.c==0)
        return false;//就返回false
      //否则，如果wall中当前格左侧不是undefined
      else if(
        this.wall[cell.r][cell.c-1])
        return false;//就返回false
    }
    return true;//返回true
  },
  //左移一格
  moveLeft(){
    "use strict";
    //如果可以左移
    if(this.canLeft()){
      this.shape.moveLeft();
      this.paint();
    }
  },
  //能够右移
  canRight(){
    "use strict";
    //遍历shape中cells中每个格
    for(
      var cell of this.shape.cells){
      //如果当前格的c等于CN-1
      if(cell.c==this.CN-1)
        return false;//就返回false
      //否则，如果wall中当前格右侧不是undefined
      else if(
        this.wall[cell.r][cell.c+1])
        return false;//就返回false
    }
    return true;//返回true
  },
  //右移一格
  moveRight(){
    "use strict";
    if(this.canRight()){
      this.shape.moveRight();
      this.paint();
    }
  },
  //绘制主角图形:
  paintShape(){
    "use strict";
    //创建文档片段frag
    var frag=document
          .createDocumentFragment();
    //遍历shape图形中cells数组的每个格子
    for(
      var cell of this.shape.cells){
      //绘制一个cell
      this.paintCell(cell,frag);
    }
    //将frag追加到pg中
    this.pg.appendChild(frag);
  },
  paintNext(){
    "use strict";
    //创建文档片段frag
    var frag=document
      .createDocumentFragment();
    //遍历shape图形中cells数组的每个格子
    for(
      var cell of this.nextShape.cells){
      //绘制一个cell
      var img=
        this.paintCell(cell,frag);
      //设置img的left为
      img.style.left=
        (cell.c+10)*this.CSIZE
        +this.OFFSET
        +"px";
      //设置img的top为(cell.r+1)*CSIZE+OFFSET
      img.style.top=
        (cell.r+1)*this.CSIZE
        +this.OFFSET
        +"px";
    }
    //将frag追加到pg中
    this.pg.appendChild(frag);
  },
  //绘制一个格
  paintCell(cell,frag){
    "use strict";
    //创建一个img元素
    var img=new Image();
    //设置img的width为CSIZE
    //设置img的top为CSIZE*cell的r+OFFSET
    //设置img的left为CSIZE*cell的c+OFFSET
    img.style.cssText=`width:${this.CSIZE}px;top:${this.CSIZE*cell.r+this.OFFSET}px;left:${this.CSIZE*cell.c+this.OFFSET}px`;
    //设置img的src为cell的src
    img.src=cell.src;
    //将img追加到frag中
    frag.appendChild(img);
    return img;
  },
  //重绘一切
  paint(){
    "use strict";
    //清除pg下所有img元素
    this.pg.innerHTML=
      this.pg.innerHTML
        .replace(/<img .*>/g,"");
    this.paintShape();//重绘主角
    this.paintWall();//重绘墙
    this.paintScore();//重绘得分
    this.paintNext();//重绘备胎
    this.paintStatus();//重绘状态
  },
  //下落一格
  moveDown(){
    "use strict";
    //如果可以下落
    if(this.canDown()){
      //让shape下落一步
      this.shape.moveDown();
    }else{//否则
      //将shape中的格落入墙中
      this.landIntoWall();
      //删除满格行
      var ln=this.deleteRows();
      //将ln累加到lines
      this.lines+=ln;
      //从SCORES数组获得ln对应的得分，累加到score上
      this.score+=this.SCORES[ln];
      //如果游戏没有结束
      if(!this.isGameOver()){
        //备胎转正
        this.shape=this.nextShape;
        //生成新的备胎
        this.nextShape=
          this.randomShape();
      }else{//否则
        this.quit();//调用quit()
      }
    }

    this.paint();//重绘一切
  },
  //判断游戏结束
  isGameOver(){//练习10分钟
    "use strict";
    //遍历备胎图形的cells数组中每个cell
    for(
      var cell of this.nextShape.cells)
      //如果wall中和cell相同位置有格
      if(this.wall[cell.r][cell.c])
        return true;//返回true

    return false;//返回false
  },
  //绘制得分
  paintScore(){
    "use strict";
    //在pg下查找所有span保存在spans中
    var spans=
      this.pg.querySelectorAll(
        "span"
      );
    //设置spans中第一个span的内容为score
    spans[0].innerHTML=this.score;
    //设置spans中第二个span的内容为lines
    spans[1].innerHTML=this.lines;
  },
  //删除所有满格行
  deleteRows(){
    "use strict";
    //自底向上遍历wall中所有行
    for(var r=this.RN-1,ln=0;
        r>=0;r--){
      //如果第r行是满格行
      if(this.isFullRow(r)){
        //就删除第r行
        this.deleteRow(r);
        ln++;
        r++;//r留在原地
      }
      //如果r-1行是空行，则退出循环
      if(
        r>0&&this.wall[r-1].join("")=="")
        break;
      //如果ln等于4，就退出循环
      if(ln==4) break;
    }
    return ln;//返回本次删除的总行数
  },
  //删除第r行
  deleteRow(dr){
    "use strict";
    //r从dr开始，反向遍历wall中剩余行
    for(var r=dr;r>=0;r--){
      //将wall中r-1行代替r行
      this.wall[r]=this.wall[r-1];
      //将r-1行置为CN个空元素的数组
      this.wall[r-1]=
        new Array(this.CN);
      //遍历新的r行中每个格
      for(var cell of this.wall[r])
        //如果cell不是undefined
        if(cell)
          //将当前格的r+1
          cell.r++;

      //如果r-2行是空行，就退出循环
      if(
        this.wall[r-2].join("")=="")
        break;
    }
  },
  //判断第r行是否满格
  isFullRow(r){
    "use strict";
    //定义正则查找开头一个逗号或中间连续两个逗号或结尾一个逗号
    var reg=/^,|,,|,$/;
    //将r行转为字符串
    var str=String(this.wall[r]);
    //如果找到符合条件的逗号，说明不满
    if(reg.test(str))
      return false
    else
      return true;
  },
  //判断shape能否继续下落
  canDown(){
    "use strict";
    //遍历shape中cells数组中每个cell
    for(
      var cell of this.shape.cells){
      //如果cell的r等于RN-1
      if(cell.r==this.RN-1)
        return false;//返回false
      //否则,如果wall中cell位置下方不等于undefined
      else if(
        this.wall[cell.r+1][cell.c])
        return false;//返回false
    }
    return true;//返回true
  },
  //将shape中每个格子保存到wall中相同位置
  landIntoWall(){
    "use strict";
    //遍历shape的cells中每个格子
    for(
      var cell of this.shape.cells){
      //将当前cell保存到wall中相同位置
      this.wall[cell.r][cell.c]
                            =cell;
    }
  },
  //绘制墙
  paintWall(){
    "use strict";
    //创建frag
    var frag=
      document.createDocumentFragment();
    //遍历wall中每个格
    for(var r=this.RN-1;r>=0;r--){
      //如果当前行是空行，就退出循环
      if(this.wall[r].join("")=="")
        break;
      else{//否则
        for(
          var cell of this.wall[r]){
        //如果当前格不是undefined
          if(cell)
            //绘制一个cell
            this.paintCell(cell,frag);
        }
      }
    }

    //将frag追加到pg中
    this.pg.appendChild(frag);
  }
}
game.start();