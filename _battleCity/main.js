//为了尽量消除全局变量，将共享数据封装到一个对象
var battleCity = new Object();
battleCity.gameContainer = document.getElementById('gameContainer');
battleCity.keyDownOrder = new Array();
battleCity.keyDownOrder.j = false;
battleCity.oldTime = 0 ; //记录两个按键之间的时间间隔
//自定义的功能函数
function addLoadEvent(func){//添加函数到Window.onload事件
  var oldonload=window.onload;
  if(typeof oldonload != 'function'){
    window.onload=func;
  }else{
    window.onload=function(){
      oldonload();
      func();
    }
  }
 }
function removeNode(node){//移除某个元素节点
  if(node){
    var parent = node.parentNode;
    if(parent)
    {parent.removeChild(node);}
  }
  }
function addClassName(el,name){//为某个元素添加类名
  var oldName=el.className;
  if(!oldName){el.className=name;}
  else{el.className=oldName+' '+name;}
  }
 //添加索引
function randomInt(min,max){//在一定范围内产生随机整数
  var number=parseInt(Math.random()*(max + 1 - min) + min);
  return number;
 }
function transformId(left,top){//根据位置，获得砖块Id
  var id;
  if(left<10){
    left='0'+left;
  }else{
    left = left.toString();
  }
  if(top<10){
    top = '0' + top;
  }else{
    top = top.toString();
  }
  id = 'brick' + left + top;
  return id;
 }
function transformBoolean(leftA,topA,leftB,topB){//根据位置，判断是否具有砖块
  var brickA = transformBrick(leftA,topA);
  var brickB = transformBrick(leftB,topB);
  if(brickA&&brickB){
  var booleanA = !brickA.style.backgroundImage||brickA.style.backgroundImage=='none';
  var booleanB = !brickB.style.backgroundImage||brickB.style.backgroundImage=='none';
  var boolean  = booleanA&&booleanB;
  return boolean;
  }
 }
function transformBrick(left,top){//根据位置，获得砖块
  var id = transformId(left,top);
  var brick = document.getElementById(id);
  return brick;
 }
function ifFaceBrick(leftA,topA,leftB,topB){//根据传入的位置，判断这个位置是否有砖
  var facing = new Object();
  var brickA = transformBrick(leftA,topA);
  var brickB = transformBrick(leftB,topB);
  if(brickA&&brickB){
    facing.brickA = brickA;
  facing.brickB = brickB;
  if(brickA.style.backgroundImage&&brickA.style.backgroundImage!='none'){
    facing.brickABac = true;
    if(brickA.gold){facing.brickAG=true;}
  }
  if(brickB.style.backgroundImage&&brickB.style.backgroundImage!='none'){
    facing.brickBBac = true;
    if(brickB.gold){facing.brickBG=true;}
  }
  return facing;
  }
 }
//以上的判断算法，均为其中一个方块不动时的简单判断逻辑
//对于更加复杂的动态碰撞，引入碰撞算法
function ifCollision(blockA,styleA,blockB){
  //传入两个矩形，判断是否碰撞
  var collision = false;
  var leftA = blockA.offsetLeft;
  var topA  = blockA.offsetTop;
  var leftB = blockB.offsetLeft;
  var topB  = blockB.offsetTop;
  var styleB = window.getComputedStyle(blockB);
  var widthA  = parseInt(styleA.width);
  var heightA = parseInt(styleA.height);
  var widthB  = parseInt(styleB.width);
  var heightB = parseInt(styleB.height);
  if(leftA<=leftB){
    if(topA<=topB){//情况一
                  if(leftB-leftA<widthA&&topB-topA<heightA){
                  collision = true;
                  }
    }else{//情况二
          if(leftB-leftA<widthA&&topA-topB<heightB){
            collision = true;
          }
    }
  }else{
    if(topA<=topB){//情况三
                  if(leftA-leftB<widthB&&topB-topA<heightA){
                  collision = true;
                  }
    }else{//情况四
          if(leftA-leftB<widthB&&topA-topB<heightB){
            collision = true;
          }
    }
  }
  return collision;
 }
function keydownJ(){//J按键按下时调用的函数
  document.removeEventListener('jDown',keydownJ);
  var player1Tank = document.getElementById('player1Tank');
  shot(player1Tank);
 }
function shot(tank){//从坦克（小方块）射出子弹,根据坦克的方向发射子弹
  if(tank){
    if(tank.bullet){
      createBullet(tank,true);
    }
  }
 }
function enemyShot(tank){
  var random = randomInt(0,1500);
  tank.stoShot=setTimeout(function(){
    shot(tank);
  },random);
  }
function createBullet(tank,circulatory){
  if(tank){
    var bullet = document.createElement('span');
    battleCity.map.appendChild(bullet);
    bullet.virtue = tank.virtue;
    bullet.bulletSpeed = tank.bulletSpeed;
    bullet.HP = 1;
    bullet.direction = tank.direction;
    bullet.circulatory = circulatory;
    tank.bullet = false;
    bullet.father = tank.id;
    bullet.block = 'bullet';
    var left;var top;
    if(bullet.virtue==0){
      bullet.id = battleCity.unCreatedBullet.pop();
    }else{bullet.id = tank.id +'Bullet';}
    if(tank.direction==1){
       left = parseInt(tank.style.left);
       top  = parseInt(tank.style.top) - 4;
       bullet.style.left = left + 'px';
       bullet.style.top  = top  + 'px';
       addClassName(bullet,'bulletT');
       bulletUpSpeed(bullet);
    }
    else if(tank.direction==-2){
       left = parseInt(tank.style.left) - 4;
       top  = parseInt(tank.style.top);
       bullet.style.left = left + 'px';
       bullet.style.top  = top  + 'px';
       addClassName(bullet,'bulletL');
       bulletLeftSpeed(bullet);
    }
    else if(tank.direction==-1){
      left = parseInt(tank.style.left);
      top  = parseInt(tank.style.top) + 40;
      bullet.style.left = left + 'px';
      bullet.style.top  = top  + 'px';
      addClassName(bullet,'bulletB');
      bulletDownSpeed(bullet);
    }
    else if(tank.direction==2){
      left = parseInt(tank.style.left) + 40;
      top  = parseInt(tank.style.top);
      bullet.style.left = left + 'px';
      bullet.style.top  = top  + 'px';
      addClassName(bullet,'bulletR');
      bulletRightSpeed(bullet);
    }
 }}
function bulletFaceSituation(bullet,leftIdA,topIdA,leftIdB,topIdB){//根据子弹的位置获得子弹面对的处境
 //一系列准备工作
  var facing = new Object();
  var collisionArray = new Array();//记录遇到的方块
  var allBlock = new Array;//存储所有的方块
  if(bullet.virtue==1){
    for(let i = 0 ;i<4;i++){
    allBlock.push(document.getElementById('enemyTank'+i));
      }
    for(let i = 0;i<8;i++){
    allBlock.push(document.getElementById('enemyBullet'+i));
      }
  }else{
    allBlock.push(document.getElementById('player1Tank'));
    allBlock.push(document.getElementById('player1TankBullet'));
  }
      allBlock.push(battleCity.base);
  var bulletStyle   = window.getComputedStyle(bullet);
  var facingBrick   = ifFaceBrick(leftIdA,topIdA,leftIdB,topIdB);//是否碰到砖
  for(let v of allBlock){
        if(v&&v!=bullet){
          v.collision = ifCollision(bullet,bulletStyle,v);
          if(v.collision){collisionArray.push(v);}
        }
      }
 //将准备工作中得到的所有信息，整合到一个对象中
 if(facingBrick){
  facing.brickA = facingBrick.brickA;
  facing.brickB = facingBrick.brickB;
  facing.brickABac = facingBrick.brickABac;
  facing.brickBBac = facingBrick.brickBBac;
  facing.brickAG = facingBrick.brickAG;
  facing.brickBG = facingBrick.brickBG;
 }
  facing.collisionArray = collisionArray;
  return facing;
 }
function handleNonEdgeE(obj,bullet){//处理子弹，不处于边缘的情况
  var length = obj.collisionArray.length;
  if(obj.brickABac||obj.brickBBac){//碰到砖
    if(!obj.brickAG){obj.brickA.style.backgroundImage='none';}
    if(!obj.brickBG){obj.brickB.style.backgroundImage='none';}
      removeBullet(bullet);
  }else if(length>0){//碰到其他子弹或坦克
    for(let v of obj.collisionArray){
      if(v == battleCity.base){gameOver();}
      /*   判断坦克的生命值，以及是否是红坦克*/
      if(v.HP){
          if(v.HP==1){
            if(v.block == 'tank'){
              if(v.virtue==0){
                  if(v.sto){clearTimeout(v.sto);}
                  if(v.stoShot){clearTimeout(v.stoShot);}
                  if(v.stoAct){clearTimeout(v.stoAct);}
                  battleCity.unCreatedTank.push(v.id);
                  removeNode(v);
                  removeBullet(bullet);
                  if(battleCity.tankNumber<=0&&battleCity.unCreatedTank.length==4){
                  setTimeout(passStage,2000);
                  }
              }else{
                removeNode(v);
                removeBullet(bullet);
                battleCity.life--;
                if(battleCity.life<=0){gameOver();}
                else{
                  createPlayer1Tank();
                }
              }
            }else{
              if(v.direction+bullet.direction==0){
                if(v.offsetTop==bullet.offsetTop||v.offsetLeft==bullet.offsetLeft){
                removeBullet(v);
                removeBullet(bullet);
              }else{//子弹可以继续前进,这样做子弹会加速。
                bulletMove(v);
                bulletMove(bullet);
              }
            }else{
                removeBullet(v);
                removeBullet(bullet);
            }
            }
          }
          else{
            v.HP--;
            if(v.HP==2){
          if(v.direction==1){v.style.backgroundImage='url(img/hugeTankYT.png)';}
     else if(v.direction==-2){v.style.backgroundImage='url(img/hugeTankYL.png)';}
     else if(v.direction==-1){v.style.backgroundImage='url(img/hugeTankYB.png)';}
     else if(v.direction==2){v.style.backgroundImage='url(img/hugeTankYR.png)';}
            }
       else if(v.HP==1){
          if(v.direction==1){v.style.backgroundImage='url(img/hugeTankT.png)';}
     else if(v.direction==-2){v.style.backgroundImage='url(img/hugeTankL.png)';}
     else if(v.direction==-1){v.style.backgroundImage='url(img/hugeTankB.png)';}
     else if(v.direction==2){v.style.backgroundImage='url(img/hugeTankR.png)';}
            }
          removeBullet(bullet);
          }
          }
        }
  }else{//子弹无阻碍
    bulletMove(bullet);
  }
 }
function bulletMove(bullet) {
  var top  = bullet.offsetTop;
  var left = bullet.offsetLeft;
  if(bullet.direction==2){
       left = left + 3;
       bullet.style.left = left + 'px';
        setTimeout(function(){
        bulletRightSpeed(bullet);
        },10/bullet.bulletSpeed);
      }
    else if(bullet.direction==1){
      top = top -3;
      bullet.style.top = top + 'px';
      setTimeout(function(){
      bulletUpSpeed(bullet);
        },10/bullet.bulletSpeed);
    }
    else if(bullet.direction==-2){
       left = left - 3;
      bullet.style.left = left + 'px';
      setTimeout(function(){
      bulletLeftSpeed(bullet);
      },10/bullet.bulletSpeed);
    }
    else if(bullet.direction==-1){
      top = top + 3 ;
      bullet.style.top = top + 'px';
      setTimeout(function(){
      bulletDownSpeed(bullet);
      },10/bullet.bulletSpeed);
    }
 }
function bulletUpSpeed(bullet){//根据子弹的位置决定将要进行的动作
  var top  = bullet.offsetTop;
  var left = bullet.offsetLeft;
  var topId = parseInt(top/20);
  var leftIdL = left/20;
  var leftIdR = leftIdL+1;
  if(top>=0){
  var facing = bulletFaceSituation(bullet,leftIdL,topId,leftIdR,topId);
    handleNonEdgeE(facing,bullet);
  }else{//边缘
    removeBullet(bullet);
    }
 }
function removeBullet(bullet){
      if(bullet.virtue==0){
        battleCity.unCreatedBullet.push(bullet.id);
          }
        var circulatory = bullet.circulatory;
      var tank = document.getElementById(bullet.father);
      removeNode(bullet);
      if(tank){
      tank.bullet = true;
      if(tank.virtue==1){
      document.addEventListener('jDown',keydownJ);
      }
      else{
      if(circulatory){
        enemyShot(tank);
      }
      }
      }
        }
function bulletLeftSpeed(bullet){
  var top  = bullet.offsetTop;
  var left = bullet.offsetLeft;
  var topIdT = top/20;
  var topIdB = topIdT + 1;
  var leftId = parseInt(left/20);
  if(left>=0){
  var facing = bulletFaceSituation(bullet,leftId,topIdT,leftId,topIdB);
  handleNonEdgeE(facing,bullet);
  }else{//边缘
    removeBullet(bullet);
  }
 }
function bulletDownSpeed(bullet){
  var top  = bullet.offsetTop + 4;
  var left = bullet.offsetLeft;
  var topId = parseInt(top/20);
  var leftIdL = left/20;
  var leftIdR = leftIdL+1;
  var circulatory = bullet.circulatory;
    if(top<520){
      var facing = bulletFaceSituation(bullet,leftIdL,topId,leftIdR,topId);
      handleNonEdgeE(facing,bullet);
    }else{//边缘
    removeBullet(bullet);
    }
 }
function bulletRightSpeed(bullet){
  var top  = bullet.offsetTop;
  var left = bullet.offsetLeft + 4;
  var topIdT = top/20;
  var topIdB = topIdT + 1;
  var leftId = parseInt(left/20);
  if(left<520){
  var facing = bulletFaceSituation(bullet,leftId,topIdT,leftId,topIdB);
  handleNonEdgeE(facing,bullet);
  }else{//边缘
    removeBullet(bullet);
  }
 }
function addIndex(){
  var index=document.createElement('p');
  var commandTutorial=document.createElement('span');
  var startButton=document.createElement('span');
  startButton.id='startButton';
  var shuoming=document.createTextNode('说明');
  var kaishi=document.createTextNode('开始');
  commandTutorial.appendChild(shuoming);
  startButton.appendChild(kaishi);
  index.appendChild(commandTutorial);
  index.appendChild(startButton);
  battleCity.gameContainer.appendChild(index);
  index.className='index';
  commandTutorial.className='commandTutorial';
  startButton.className='startButton';
  commandTutorial.onmouseover=function(){
    commandTutorial.style.backgroundColor='white';
    createTutorial();
  }
  startButton.onmouseover=function(){
    startButton.style.backgroundColor='white';
  }
  commandTutorial.onmouseout=function(){
    commandTutorial.style.backgroundColor='transparent';
    var player1Tutorial = document.getElementById('player1Tutorial');
    if(player1Tutorial){
      removeNode(player1Tutorial);
    }
  }
  startButton.onmouseout=function(){
    startButton.style.backgroundColor='transparent';
  }
 //点击开始按钮
 startButton.onclick=function(){
    battleCity.gameContainer.style.backgroundColor='#838582'
    removeNode(index);
    removeNode(document.getElementById('author'));
    startGame();
      }
    }
 //创建作者信息
function createAuthor(){
  var author = document.createElement('p');
  author.id="author";
  var by = document .createTextNode('by');
  battleCity.gameContainer.appendChild(author);
  author.appendChild(by);
 }
 //创建操作教程
function createTutorial(){
  var player1Tutorial = document.createElement('div');
      player1Tutorial.id='player1Tutorial';
      player1Tutorial.className="player1Tutorial";
      var commands = new Array();
  for(let i=0;i<6;i++){
    commands.push(document.createElement('p'));
    commands[i].className="commands";
  }
  var player1 = document.createElement('span');
      player1.className='player1';
  var activityTutorial = new Array();
  for(let i=0;i<5;i++){
    activityTutorial.push(document.createElement('span'));
    activityTutorial[i].className="activityTutorial";
  }
  var keyTutorial = new Array();
  for(let i=0;i<5;i++){
  keyTutorial.push(document.createElement('span'));
  keyTutorial[i].className='keyTutorial';
  }
  var wanjia1 = document.createTextNode('玩家一');
  var shangyi = document.createTextNode('上移');
  var xiayi   = document.createTextNode('下移');
  var zuoyi   = document.createTextNode('左移');
  var youyi   = document.createTextNode('右移');
  var kaihuo  = document.createTextNode('开火');
  var w       = document.createTextNode('w');
  var s       = document.createTextNode('s');
  var a       = document.createTextNode('a');
  var d       = document.createTextNode('d');
  var j       = document.createTextNode('j');
  battleCity.gameContainer.appendChild(player1Tutorial);
  for(let i=0;i<6;i++){
    player1Tutorial.appendChild(commands[i]);
    if(i<5){
      commands[i+1].appendChild(activityTutorial[i]);
      commands[i+1].appendChild(keyTutorial[i]);
    }
  }
  commands[0].appendChild(player1);
  player1.appendChild(wanjia1);
  activityTutorial[0].appendChild(shangyi);
  activityTutorial[1].appendChild(xiayi);
  activityTutorial[2].appendChild(zuoyi);
  activityTutorial[3].appendChild(youyi);
  activityTutorial[4].appendChild(kaihuo);
  keyTutorial[0].appendChild(w);
  keyTutorial[1].appendChild(s);
  keyTutorial[2].appendChild(a);
  keyTutorial[3].appendChild(d);
  keyTutorial[4].appendChild(j);
 }
function startGame(){//开始游戏
  createMap();//创建地图
  createPlayer1Tank();//创建玩家坦克
  battleCity.life = 4;
  createEnemy();
  addKeyListener();//设置监听器
  }
battleCity.unCreatedTank = new Array();
battleCity.unCreatedBullet = new Array();
function createEnemy() {
  battleCity.tankNumber = 17;
  for(let i = 0 ;i<4;i++){
    battleCity.unCreatedTank.push('enemyTank'+i);
  }
  for(let i = 0 ;i<5;i++){
    battleCity.unCreatedBullet.push('enemyBullet'+i);
  }
  createTankA();
  createTankB();
  createTankC();
  //设置监听器
  var event = new CustomEvent('supplyTank',{});
  battleCity.dispatchEnemy = setInterval(function(){
    if(battleCity.tankNumber>0&&battleCity.unCreatedTank.length>0){
      document.dispatchEvent(event);
    }
  },2000);
  document.addEventListener('supplyTank',supplyTank);
 }
function supplyTank(){
    var random = randomInt(1,3);
    if(random==1){createTankA();}
    else if(random==2){createTankB();}
    else {createTankC();}
        }
function createTankA(){
  var tank = createEnemyTank();
  tank.style.left = '0px';
  tank.position = tank.style.left + tank.style.top;
  enemyAction(tank);
 }
function createTankB(){
  var tank = createEnemyTank();
  tank.style.left = '240px';
  tank.position = tank.style.left + tank.style.top;
  enemyAction(tank);
 }
function createTankC(){
  var tank = createEnemyTank();
  tank.style.left = '480px';
  tank.position = tank.style.left + tank.style.top;
  enemyAction(tank);
 }
function enemyAction(tank){
  if(tank.step>=tank.maxStep){
        tank.step = 0;
        var dir;
  if(tank.kind=='fastTank'){
          dir = fTankAction(tank);
          if(dir==-2){
          tank.style.backgroundImage = 'url(img/fastTankL.png)';
          }else if(dir==-1){
            tank.style.backgroundImage = 'url(img/fastTankB.png)';
          }else if(dir==1){
            tank.style.backgroundImage = 'url(img/fastTankT.png)';
          }else{
            tank.style.backgroundImage = 'url(img/fastTankR.png)';
            }
      }
  if(tank.kind=='smallTank'){
        dir = sTankAction(tank);
        if(dir==-2){
          tank.style.backgroundImage = 'url(img/smallTankL.png)';
      }
      else if(dir==-1){
        tank.style.backgroundImage = 'url(img/smallTankB.png)';
      }
      else if(dir==1){
       tank.style.backgroundImage = 'url(img/smallTankT.png)';
      }
      else if(dir==2){
        tank.style.backgroundImage = 'url(img/smallTankR.png)';
          }
    }
    if(tank.kind=='largeTank'){
        dir = lTankAction(tank);
        if(dir==-2){
          tank.style.backgroundImage = 'url(img/largeTankL.png)';
      }
      else if(dir==-1){
        tank.style.backgroundImage = 'url(img/largeTankB.png)';
      }
      else if(dir==1){
       tank.style.backgroundImage = 'url(img/largeTankT.png)';
      }
      else if(dir==2){
        tank.style.backgroundImage = 'url(img/largeTankR.png)';
          }
    }
    if(tank.kind=='hugeTank'){
        dir = hTankAction(tank);
        if(dir == -2){
      if(tank.HP==3) {tank.style.backgroundImage = 'url(img/hugeTankGL.png)';}
      else if (tank.HP == 2){tank.style.backgroundImage = 'url(img/hugeTankYL.png)';}
      else{tank.style.backgroundImage = 'url(img/hugeTankL.png)';}
    }else if(dir == -1){
      if(tank.HP==3) {tank.style.backgroundImage = 'url(img/hugeTankGB.png)';}
      else if (tank.HP == 2){tank.style.backgroundImage = 'url(img/hugeTankYB.png)';}
      else{tank.style.backgroundImage = 'url(img/hugeTankB.png)';}
    }else if(dir == 1){
      if(tank.HP==3) {tank.style.backgroundImage = 'url(img/hugeTankGT.png)';}
      else if (tank.HP == 2){tank.style.backgroundImage = 'url(img/hugeTankYT.png)';}
      else{tank.style.backgroundImage = 'url(img/hugeTankT.png)';}
    }else {
      if(tank.HP==3) {tank.style.backgroundImage = 'url(img/hugeTankGR.png)';}
      else if (tank.HP == 2){tank.style.backgroundImage = 'url(img/hugeTankYR.png)';}
      else{tank.style.backgroundImage = 'url(img/hugeTankR.png)';}
    }
      }
  }
  move(tank);
 }
function sTankAction(tank){//smallTank的移动AI
    tank.direction = randomSpecifiedN(-2,-1,1,2);
    tank.maxStep = randomInt(0,24);
    return tank.direction;
                          }
function hTankAction(tank){//hugeTank根据其与玩家坦克或者基地的距离选择进攻路线。
    tank.maxStep = randomInt(5,15);
    var player1Tank = document.getElementById('player1Tank'),
    lengthBase,lengthPlayer1Tank,ori;
    lengthBase = measure(tank,battleCity.base);
    var newDir;
    if(player1Tank){
      lengthPlayer1Tank = measure(tank,player1Tank);
      if(lengthPlayer1Tank<lengthBase){
      newDir = attackBlock(tank,player1Tank);
      }
      else{newDir = attackBlock(tank,battleCity.base);}
      }
    else{
      newDir = attackBlock(tank,battleCity.base);
      }
    tank.direction = newDir;
    tank.position = tank.style.left+tank.style.top;
    return newDir;
        }
function fTankAction(tank){//fastTank
  tank.maxStep = randomInt(0,5);
  var player = document.getElementById('player1Tank');
  var dir;
  var leftA=tank.offsetLeft,leftBase=battleCity.base.offsetLeft;
  var topA=tank.offsetTop,topBase=battleCity.base.offsetTop;
  if(leftA==leftBase||topA==topBase){
    dir = randomSpecifiedN(-2,-1,1,2);
  }
  else if(player){//尽量避开玩家的坦克
    var leftB=player.offsetLeft,
        topB=player.offsetTop;
    if(leftA==leftB){dir=randomSpecifiedN(-2,2);}
    else if(topA==topB){dir=randomSpecifiedN(-1,1);}
    else{dir=attackBlock(tank,battleCity.base);}
  }
  else{dir = attackBlock(tank,battleCity.base);}
  tank.direction = dir;
  tank.position = tank.style.left+tank.style.top;
  return dir;
  }
function lTankAction(tank){//largeTank
  var allTank = new Array();
  var oldLength = 1000,newLength,kind,dir;
  for(let i = 0 ;i<4; i++){
    allTank.push(document.getElementById('enemyTank'+i));
  }
  for(let v of allTank){
    if(v&&v!=tank&&v.kind!='largeTank'){
      newLength = measure(tank,v);
      if(newLength<oldLength){
        oldLength=newLength;
        if(v){kind = v.kind;}
        else{kind = 'largeTank';}
      }
    }
  }
  if(kind=='smallTank'||kind=='largeTank'){
    dir = sTankAction(tank);

  }else if(kind=='hugeTank'){
    dir = hTankAction(tank);

  }else if(kind=='fastTank'){
    dir = fTankAction(tank);
  }
  return dir;
        }
function attackBlock(tank,block){//根据相对位置改变进攻方向
  var newDir,oldDir = tank.direction,
  ori=orientation(tank,block);
    if(tank.position==tank.style.left+tank.style.top){//遇到墙体阻碍的情况。
      if(Math.abs(oldDir)==1){
        newDir=randomSpecifiedN(-2,2);
      }
      else{
        newDir=randomSpecifiedN(-1,1);
      }
    }else{
      if(ori == 1){
      newDir = randomSpecifiedN(-2,-1);
    }else if(ori == 2){
      newDir = -2;
    }else if(ori == 3){
      newDir = randomSpecifiedN(-2,1)
    }else if(ori == 4){
      newDir = -1;
    }else if(ori == 5){
      newDir = 1;
    }else if(ori == 6){
      newDir = randomSpecifiedN(-1,2);
    }else if(ori == 7){
      newDir = 2;
    }else{
      newDir = randomSpecifiedN(1,2);
    }
    }
    return newDir;
  }
function measure(tankA,tankB){//测量两个坦克中心点之间的距离
  var topA = tankA.offsetTop,topB = tankB.offsetTop,
  leftA = tankA.offsetLeft,leftB = tankB.offsetLeft,
  sideA = Math.abs(leftA-leftB),sideB=Math.abs(topA-topB),
  sideC = triangleSideC(sideA,sideB);
  return sideC;
  }
function orientation(tankA,tankB){//判断坦克A相对于坦克B的位置
  var topA = tankA.offsetTop,topB = tankB.offsetTop,
  leftA = tankA.offsetLeft,leftB = tankB.offsetLeft,
  ori;
  if(leftA>leftB){
    if(topA<topB){ori=1;}
    else if(topA==topB){ori=2;}
    else{ori=3;}
  }else if(leftA==leftB){
    if(topA<topB){ori=4;}
    else if(topA>topB){ori=5;}
  }else if(leftA<leftB){
    if(topA<topB){ori=6;}
    else if(topA==topB){ori=7;}
    else{ori=8;}
  }
  return ori;
 }
function randomSpecifiedN() {//在指定的自然数中，随机选取一个。
  var random = randomInt(0,arguments.length-1);
  return arguments[random];
  }
function createEnemyTank(){
  var random = randomInt(1,5);
  var tank = document.createElement('span');
      addClassName(tank,'tank');
      tank.id = battleCity.unCreatedTank.pop();
      tank.direction=-1;
      tank.virtue = 0;
      tank.bullet = true;
      tank.style.top = '0px';
      battleCity.map.appendChild(tank);
      tank.bulletSpeed = 1;
      tank.step = 0;
      tank.maxStep = randomInt(0,24);
      tank.block = 'tank';
      battleCity.tankNumber--;
      if(random == 1){
        tank.kind = 'smallTank';
        tank.style.backgroundImage = 'url(img/smallTankB.png)';
        tank. HP = 1;
        tank.tankSpeed = 1;
        }
      if(random == 2 || random ==3){
        tank.kind = 'hugeTank';
        tank.style.backgroundImage = 'url(img/hugeTankGB.png)';
        tank. HP = 3;
        tank.tankSpeed = 1;
        }
      if(random == 4){
        tank.kind = 'largeTank';
        tank.style.backgroundImage = 'url(img/largeTankB.png)';
        tank. HP = 1;
        tank.tankSpeed = 1;
      }
      if(random == 5){
        tank.kind = 'fastTank';
        tank.style.backgroundImage = 'url(img/fastTankB.png)';
        tank. HP = 1;
        tank.tankSpeed = 2;
      }
  enemyShot(tank);
  return tank;
 }
function createTank(tankId,tankTop,tankLeft){//创建坦克
 var tank = document.createElement('span');
     addClassName(tank,'tank');
     tank.id=tankId;
  battleCity.map.appendChild(tank);
  tank.style.top=tankTop;
  tank.style.left=tankLeft;
  tank.bullet = true;//记录坦克是否可以创建子弹
  tank.HP=1;
  tank.block = 'tank';
  return tank;
  }
function createPlayer1Tank(){//玩家的坦克
  var tank = createTank('player1Tank','480px','160px');
  tank.style.backgroundImage ='url(img/greenTankT.png)';
  tank.direction=1;//记录坦克朝向
  tank.virtue = 1; //区分敌友坦克
  tank.tankSpeed = 1;//记录坦克的速度
  tank.bulletSpeed = 1 ;//记录坦克的子弹速度
 }
function createMap(){//地图模板
  battleCity.map = document.createElement('div');
  battleCity.map.id = 'map';
  var brickAmount = 26*26;
  var brickLength=20;
  var brick=new Array();
  battleCity.gameContainer.appendChild(battleCity.map);
  for(let i=0;i<brickAmount;i++){//>创建每一个砖块
    brick.push(document.createElement('span'));
    brick[i].className='brick';
    battleCity.map.appendChild(brick[i]);
    var left = brick[i].offsetLeft;
    var top  = brick[i].offsetTop;
    var widthNum=left/brickLength;
    var heightNum=top/brickLength;
    var brickId = transformId(widthNum,heightNum);
        brick[i].id = brickId; //为每一个砖块设置好id
  }//<创建每一个砖块
  battleCity.base = document.createElement('span');//基地
      battleCity.base.id='base';
      battleCity.base.direction = -1;
  battleCity.map.appendChild(battleCity.base);
  //{}判断绘制哪个地图
  drawMap1(brick);//特定的地图
  }
 //绘制特定的地图
function drawMap1(brick){//第一关的地图
  for(let i=0;i<brick.length;i++){//>for
    var left = brick[i].offsetLeft;
    var top  = brick[i].offsetTop;
      if(left>=0&&left<40){//第一列
        if(top>=260&&top<280)
          brick[i].style.backgroundImage='url(img/redBrick.png)';
    else  if(top>=280&&top<300)
          {
            brick[i].style.backgroundImage='url(img/goldBrick.png)';
            brick[i].gold=true;
          }
  }//第一列结束
  else  if(left<80){//第二列
        if((top>=40&&top<220)||(top>=340&&top<480))
          brick[i].style.backgroundImage='url(img/redBrick.png)';
  }//第二列结束
  else  if(left<120){//第三列
        if(top>=260&&top<300)
          brick[i].style.backgroundImage='url(img/redBrick.png)';
  }//第三列结束
  else  if(left<160){//第四列
        if((top>=40&&top<220)||(top>=260&&top<300)||(top>=340&&top<480))
          brick[i].style.backgroundImage='url(img/redBrick.png)';
  }//第四列结束
  else  if(left<200){//第五列
        //空
  }//第五列结束
  else  if(left<240){//第六列
      if((top>=40&&top<180)||(top>=220&&top<260)||(top>=300&&top<420))
          brick[i].style.backgroundImage='url(img/redBrick.png)';
    else  if(top>=460&&top<520){
          if(left>=220)
            brick[i].style.backgroundImage='url(img/redBrick.png)';
       }
   }//第六列结束
  else  if(left<280){//第七列
        if(top>=120&&top<160)
          {
            brick[i].style.backgroundImage='url(img/goldBrick.png)';
            brick[i].gold = true;
          }
    else  if((top>=320&&top<360)||(top>=460&&top<480))
           brick[i].style.backgroundImage='url(img/redBrick.png)';
   }//第七列结束
  else  if(left<320){//第八列
         if((top>=40&&top<180)||(top>=220&&top<260)||(top>=300&&top<420))
          brick[i].style.backgroundImage='url(img/redBrick.png)';
    else  if(top>=460&&top<520){
            if(left<300)
              brick[i].style.backgroundImage='url(img/redBrick.png)';
    }
     }//第八列结束
  else  if(left<360){//第九列
          //空
  }//第九列结束
  else  if(left<400){//第十列
        if((top>=40&&top<220)||(top>=260&&top<300)||(top>=340&&top<480))
          brick[i].style.backgroundImage='url(img/redBrick.png)';
  }//第十列结束
  else  if(left<440){//第十一列
        if(top>=260&&top<300)
          brick[i].style.backgroundImage='url(img/redBrick.png)';
  }//第十一列结束
  else  if(left<480){//第十二列
        if((top>=40&&top<220)||(top>=340&&top<480))
          brick[i].style.backgroundImage='url(img/redBrick.png)';
  }//第十二列结束
  else  if(left<520){//第十三列
        if(top>=250&&top<280)
          brick[i].style.backgroundImage='url(img/redBrick.png)';
  else  if(top>=280&&top<300)
          {
            brick[i].style.backgroundImage='url(img/goldBrick.png)';
            brick[i].gold=true;
          }
    }//第十三列结束
  }//<for
  }//第一关地图绘制完成
function ifMoveUp(tank){
  var boolean;
  var facing = new Object();
  var top  = parseInt(tank.style.top);
  var left = parseInt(tank.style.left);
  var topId  = (top/20)-1;
  var leftIdL = left/20;
  var leftIdR = leftIdL+1;
  if(topId>=0){
    boolean = transformBoolean(leftIdL,topId,leftIdR,topId);
  if(boolean){
    facing = tankFaceSituation(tank);
    boolean = facing.boolean;
  }
  }else{
    boolean = false;
  }
  facing.boolean = boolean;
  return facing;
                }
function ifMoveDown(tank){
  var boolean;
  var facing = new Object();
  var top     = parseInt(tank.style.top);
  var left    = parseInt(tank.style.left);
  var topId   = top/20+2;
  var leftIdL = left/20;
  var leftIdR = leftIdL+1;
  if(topId<=25){
    boolean = transformBoolean(leftIdL,topId,leftIdR,topId);
    if(boolean){
      facing = tankFaceSituation(tank);
      boolean = facing.boolean;
    }
  }else{
    boolean = false;
  }
  facing.boolean = boolean;
  return facing;
                }
function ifMoveLeft(tank){
    var boolean;
    var facing = new Object();
    var top  = parseInt(tank.style.top);
    var left = parseInt(tank.style.left);
    var topIdT  = top/20;
    var topIdB  = topIdT+1;
    var leftId  =left/20-1;
    if(leftId>=0){
      boolean = transformBoolean(leftId,topIdT,leftId,topIdB);
      if(boolean){
        facing = tankFaceSituation(tank);
        boolean = facing.boolean;
      }
    }else{
      boolean = false;
    }
    facing.boolean = boolean;
   return facing;
                  }
function ifMoveRight(tank) {
    var boolean;
    var facing = new Object();
    var top  = parseInt(tank.style.top);
    var left = parseInt(tank.style.left);
    var topIdT  = top/20;
    var topIdB  = topIdT+1;
    var leftId  = left/20+2;
    if(leftId<=25){
      boolean = transformBoolean(leftId,topIdT,leftId,topIdB);
      if(boolean){
       facing  = tankFaceSituation(tank);
       boolean = facing.boolean;
      }
    }else{
      boolean = false;
    }
    facing.boolean = boolean;
    return facing;
                  }
function tankFaceSituation(tank){
    var boolean = true;
    var allBlock = new Array();//存储所有可能遇到的方块
    if(tank.virtue==0){
        allBlock.push(document.getElementById('player1Tank'));
              }else{
                  for(let i = 0 ;i<4;i++){
                    allBlock.push(document.getElementById('enemyTank'+i));
                        }}
      allBlock.push(battleCity.base);
          for(let v of allBlock){
            if(v&&v!=tank){
              boolean = !ifCollisionTank(tank,v);
              if(!boolean){
                if(v==document.getElementById('player1Tank')||v==battleCity.base){
                  allBlock.faceOppsition = true;
                }
                break;
              }
                      }
          }
    allBlock.boolean = boolean;
    return allBlock;
                      }
function ifCollisionTank(tankA,tankB){//判断两个坦克是否相撞或者即将相撞
  var collision = false;
  var leftA = tankA.offsetLeft;
  var topA  = tankA.offsetTop;
  var leftB = tankB.offsetLeft;
  var topB  = tankB.offsetTop;
  var sideA = Math.abs(leftA-leftB);
  var sideB = Math.abs(topA-topB);
  var longestSideC = triangleSideC(60,20);
  var sideC = triangleSideC(sideA,sideB);
  var dirA = tankA.direction;
  var dirB = tankB.direction;
  var dir  = dirA + dirB;
  if(sideC<=longestSideC){//两坦克进入危险距离
    if(dir==0&&Math.abs(dirA)==1){//Y相向而行
      if(sideA<40){//两坦克在同一“Y轴”上
        if(topA>topB&&dirA!=-1){//排除相互逃离的情况
            if(sideB==40){collision = true;}
            else if(tankA.virtue==0){collision=true;}
        }
        else if(topA<topB&&dirA!=1){
            if(sideB==40){collision = true;}
            else if(tankA.virtue==0){collision=true;}
        }
        }
    }else if(dir==0&&Math.abs(dirA)==2){//X相向而行
      if(sideB<40){
        if(leftA>leftB&&dirA!=2){
          if(sideA==40){collision =true;}
            else if(tankA.virtue==0){collision=true;}
        }
        else if(leftA<leftB&&dirA!=-2){
          if(sideA==40){collision =true;}
          else if(tankA.virtue==0){collision=true;}
        }
      }
    }
    else{//还有4种大体情况
      if(dirA==1){
        if(topA-topB==40){//大体情况中的三种详细情况
          if(sideA<40) {collision = true;}
          else if(sideA==40){
                if(dirB==2&&leftA>leftB&&tankA.virtue==0){collision = true;}
                else if(dirB==-2&&leftA<leftB&&tankA.virtue==0){collision = true;}
          }
        }
      }else if(dirA==-1){
        if(topB - topA==40){
          if(sideA<40){collision = true;}
          else if(sideA==40){
                if(dirB==2&&leftA>leftB&&tankA.virtue==0){collision = true;}
                else if(dirB==-2&&leftA<leftB&&tankA.virtue==0){collision = true;}
          }
        }
      }else if(dirA==2){
        if(leftB - leftA==40){
          if(sideB<40){collision = true;}
          else if(sideB==40){
                if(dirB==1&&topA<topB&&tankA.virtue==0){collision = true;}
                else if(dirB==-1&&topA>topB&&tankA.virtue==0){collision = true;}
          }
        }
      }else if (dirA==-2){
        if(leftA-leftB==40){
          if(sideB<40){collision = true;}
          else if(sideB==40){
            if(dirB==1&&topA<topB&&tankA.virtue==0){collision = true;}
            else if(dirB==-1&&topA>topB&&tankA.virtue==0){collision = true;}
          }
        }
      }
    }
 }
 return collision;
 }
function triangleSideC(sideA,sideB){//已知两直角边，求三角形斜边。
  var sideC = Math.sqrt(sideA*sideA+sideB*sideB);
  return sideC;
 }
function move(tank){
  if(tank){
    var boolean,facing;
    if(tank.direction==1){
      facing=ifMoveUp(tank);
      boolean =facing.boolean;
  }
  else if(tank.direction==-2){
      facing=ifMoveLeft(tank);
      boolean =facing.boolean;
  }
  else if(tank.direction==-1){
      facing=ifMoveDown(tank);
      boolean =facing.boolean;
    }
  else if(tank.direction==2){
    facing=ifMoveRight(tank);
    boolean =facing.boolean;
    }
  if(boolean){
        for(let i=0;i<20;i++){
          tank.sto = setTimeout(function() {
          tankMoveSpeed(tank,i);
      },(i*10)/tank.tankSpeed);
    }}else
  if(boolean==false){
          if(tank.virtue==1){document.addEventListener('keydownLength',action);}
          else{
            if(tank.kind=='smallTank'){//smallTank遇立马开火
              createBullet(tank,false);
            }else{
              if(facing.faceOppsition){createBullet(tank,false);}
            }
        tank.maxStep=0;
        tank.stoAct=setTimeout(function() {
          enemyAction(tank);
        },150);
    }}
 }}
function tankMoveSpeed(tank,distance) {
  if(tank){
      var top = parseInt(tank.style.top);
      var left = parseInt(tank.style.left);
    if(tank.direction==1){
       top--;
    }else
    if(tank.direction==-2){
      left--;
    }else
    if(tank.direction==-1){
      top++;
    }else
    if(tank.direction==2){
      left++;
    }
    tank.style.top=top+'px';
    tank.style.left=left+'px';
    if(distance==19){
    if(tank.virtue==1){document.addEventListener('keydownLength',action);}
    else {
      tank.step++;
      enemyAction(tank);
    }
  }
  }}
function keydown(e){//按下按键
  var date = new Date();
  var newTime = date.getTime();
  var keyCharacter = e.key;
      keyCharacter = keyCharacter.toUpperCase();
  if(keyCharacter=='W'||keyCharacter=='A'||keyCharacter=='S'||keyCharacter=='D'){
    if(newTime - battleCity.oldTime > 10){
      battleCity.oldTime = newTime;
      var lastKeyCharacter;
     if(battleCity.keyDownOrder.length>0){
      lastKeyCharacter = battleCity.keyDownOrder[battleCity.keyDownOrder.length-1];
      lastKeyCharacter=lastKeyCharacter.toUpperCase();
      }
     if(keyCharacter!=lastKeyCharacter){
        battleCity.keyDownOrder.push(keyCharacter);
    }}
  }else if(keyCharacter=='J'){
        battleCity.keyDownOrder.j = true;
    }
 }
function keyup(e){//松开按键
  var keyCharacter=e.key;
      keyCharacter=keyCharacter.toUpperCase();
  if(keyCharacter=='W'||keyCharacter=='A'||keyCharacter=='S'||keyCharacter=='D'){
    for(let i = 0;i<battleCity.keyDownOrder.length;i++){
      removeCharacter = battleCity.keyDownOrder[i].toUpperCase();
      if(keyCharacter==removeCharacter){
        battleCity.keyDownOrder.splice(i,1);
      }
    }
  }else if(keyCharacter=='J'){
    battleCity.keyDownOrder.j = false;
  }
  }
function addKeyListener(){
  document.addEventListener('keydown',keydown);
  document.addEventListener('keyup',keyup);
  var keydownLength = new CustomEvent('keydownLength',{});//W,A,S,D中是否至少有一个键被按下
  var jDown = new CustomEvent('jDown',{});
  battleCity.IntervalDispatch = setInterval(dispatch,10);//定期检测是否发布事件
  document.addEventListener('keydownLength',action);
  document.addEventListener('jDown',keydownJ);
  function dispatch(){
  if(battleCity.keyDownOrder.length>0){
    document.dispatchEvent(keydownLength);
  }
  if(battleCity.keyDownOrder.j){
    document.dispatchEvent(jDown);
  }
 }
 }
function action(){
  document.removeEventListener('keydownLength',action);
  var tank = document.getElementById('player1Tank');
  var lastKeyCharacter = battleCity.keyDownOrder[battleCity.keyDownOrder.length-1];
  if(tank){
        if(lastKeyCharacter=='W'){
        tank.style.backgroundImage='url(img/greenTankT.png)';
        tank.direction=1;
      }
        else if(lastKeyCharacter=='A'){
        tank.style.backgroundImage='url(img/greenTankL.png)';
        tank.direction=-2;
      }
        else if(lastKeyCharacter=='S'){
        tank.style.backgroundImage='url(img/greenTankB.png)';
        tank.direction=-1;
      }
        else if(lastKeyCharacter=='D'){
        tank.style.backgroundImage='url(img/greenTankR.png)';
        tank.direction=2;
      }
      move(tank);
       }
 }
function gameOver(){
  removeMap();
  var node = endGame();
  node.style.backgroundImage = 'url(img/defeat.png)';
  node.style.backgroundColor = '#CCC';
  node.style.top = '520px';
    for(let i = 0 ;i<=330;i++){
      setTimeout(function () {
        node.style.top = (node.offsetTop - 1) + 'px';
      },i*20);
    }
      }
function passStage() {
  removeMap();
  var node = endGame();
  node.style.backgroundImage = 'url(img/victory.png)';
  node.style.backgroundColor = '#039';
  node.style.top = '-140px';
  for(let i =0;i<=330;i++){
    setTimeout(function () {
      node.style.top = (node.offsetTop + 1) + 'px';
    },i*10);
  }
      }
function endGame() {
  battleCity.gameContainer.style.backgroundColor = '#000';
  var node = document.createElement('span');
      addClassName(node,'endGame');
  battleCity.gameContainer.appendChild(node);
  node.style.left = '190px';
  return node;
  }
function removeMap() {
  document.removeEventListener('keydown',keydown);
  document.removeEventListener('keyup',keyup);
  document.removeEventListener('keydownLength',action);
  document.removeEventListener('jDown',keydownJ);
  document.removeEventListener('supplyTank',supplyTank);
  clearInterval(battleCity.IntervalDispatch);
  clearInterval(battleCity.dispatchEnemy);
  removeNode(battleCity.map);
      }
addLoadEvent(addIndex);
addLoadEvent(createAuthor);