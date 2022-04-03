
//id属性で指定した要素を取得する
let result = document.getElementById('p5page');


//urlからパラメータを取得 http://127.0.0.1:5500/?p=dW5pdGU=
let answer = atob(getParam('p'));;

//解答を取得
let textbox= document.getElementById("textbox");
let userAnswer="";

const speed=0.5;
const dsize=0.7;
let letterNum=5;

let cGroup=[];


let x,y;

function setup() {
    let canvasSize = Math.min(windowWidth,windowHeight*0.8)
    let canvas= createCanvas(canvasSize,canvasSize);
    canvas.parent(result);


    console.log(answer);
    setAnswer(answer);
    
    textSize(30*windowHeight/600)
    textAlign(CENTER,CENTER);
    colorMode(HSB, 100);
    angleMode(DEGREES); 
    background(50,0,0);
    noStroke();
    for(let i=0;i<letterNum;i++){
        d = width*dsize/2; 
        cGroup.push(new Dot(i,d,speed));
    }
    //console.log(cGroup)

    //デバッグ用
    //init();
}

  
  
  
    //a=97,z=122
  
function draw() {

    background(50,0,0,20);
    //background(0,10);
    
    push();

        translate(width/2,height*0.4)
        //光の球
        cGroup.forEach((item)=>{
                item.statusUpdate();
                item.drawMe();
            }
        );
        //外側の円
        noFill();
        stroke(0,0,100,10);
        circle(0,0,width*dsize);

    
    pop();

        //下の単語欄
        for(let i=0;i<letterNum;i++){
            let size = width/letterNum*0.6;
            let gap = (width-size*letterNum)/(letterNum+1);
            let x = gap+size/2+(size+gap)*i;
            let y = height*0.87

            noFill();
            stroke(90/letterNum*i,20,80);
            rect(x-size/2,y-size/2,size,size);
            noStroke();
            fill(0,0,100);

            if(userAnswer[i]){
                text(userAnswer[i],x,y)
            }else{
                text("?",x,y)
            }
        }

        //クリア判定
        clearFlg=true;
        cGroup.forEach((item)=>{
            if(item.r!==0){
                clearFlg=false;
            }
        });
        if(clearFlg){
            text("clear",width/2,height/2);
        }

    
}

function init(){
    cGroup=[];
    for(let i=0;i<letterNum;i++){
        let d= answer.charCodeAt(i)-userAnswer.charCodeAt(i);
        let s=0;
        if((d+26)%26 < (-d+26)%26){
            //左回り
            s=1
        }else if((d+26)%26 > (-d+26)%26){
            //右回り
            s=-1
        }else{
            //反対側
            s=0;
        }
        d = Math.min((d+26)%26,(-d+26)%26)/26;
        let r = d*height*dsize;
        s = s*(1+d)*speed;
        cGroup.push(new Dot(i,r,s));
        //console.log(i,answer[i]+"<->"+userAnswer[i],"d:"+d,"r:"+r,"s:"+s);  
    }
    //console.log(cGroup);
}


class Dot{
    constructor(index,rNumber,sNumber,deg){
        this.i=index;
        this.c=color(90/letterNum*index,80,80);
        this.x=0;
        this.y=0;
        this.angle=360*index/letterNum;
        this.size=10;
        this.r=rNumber;
        this.speed=sNumber;
        this.time=0;
        this.particles=[];
    }

    drawMe(){
        //blendMode(BLEND);
        drawingContext.shadowBlur = this.size*3;
        drawingContext.shadowColor = this.c;
        //background(0,35);
        blendMode(SCREEN);
        fill(this.c);
        circle(this.x,this.y,this.size);
        
        if(this.time%2===0){
            this.particles.push(new particle(this.x,this.y,this.angle,this.speed,this.c))
        }
        for(let i=0;i<this.particles.length;i++){
            this.particles[i].update()
            this.particles[i].drawMe();
            if(this.particles[i].isDead()){
                this.particles.splice(i, 1);
            }
        };
        // if(userAnswer[this.i]){
        //     text(userAnswer[this.i],this.x,this.y)
        // }else{
        //     text("?",this.x,this.y)
        // }
        
    }

    statusUpdate(){
        this.time++;
        this.angle += this.speed;
        this.x = this.r*Math.cos(this.angle/180*Math.PI);
        this.y = this.r*Math.sin(this.angle/180*Math.PI);
    }
}

class particle{
    constructor(px,py,pangle,pspeed,pcolor){
        this.size=5*getRandom(0.5,1);
        this.x = px * getRandom(0.97,1.03);
        this.y = py * getRandom(0.97,1.03);
        this.ax =  pspeed * getRandom(1,2) * Math.sin((pangle + getRandom(-15,15)) * ( Math.PI / 180 ));
        this.ay = -pspeed * getRandom(1,2) * Math.cos((pangle + getRandom(-15,15)) * ( Math.PI / 180 ));
        this.angle=pangle;
        this.color=pcolor;
        this.life=60;
    }
    update(){
        this.life--;
        this.size += -0.01
        this.x+=this.ax;
        this.y+=this.ay;
        this.color.setAlpha(this.life/30*100);
    }
    drawMe(){
        drawingContext.shadowBlur = this.size*3;
        drawingContext.shadowColor = this.color;
        blendMode(SCREEN);
        fill(this.color);
        circle(this.x,this.y,this.size);
    }
    isDead(){
        return this.life<0;
    }

    

    
    
}

//answerをセット、もし不適ならデフォルトの表示に変更
function setAnswer(ans){
    ans = String(ans);
    const regex = /^[a-z]+?$/g;
    const found = ans?.match(regex);
    if(3<=ans?.length && ans?.length<=7){
        if(found && found[0]?.length===ans?.length){
            console.log("true");
            letterNum=ans.length;
            return true;
        }else{
            alert("urlが正しくありません。デフォルトの問題を表示します。")
            answer="unite";
            letterNum=5;
            return false;
        }
    }else{
        alert("urlが正しくありません。デフォルトの問題を表示します。")
        answer="unite";
        letterNum=5;
        return false;
    }
}



function OnButtonClick(){
    let tmpAns = textbox?.value;
    let found = checkAlpha(tmpAns)

    if(found && found.length===answer.length){
        userAnswer = tmpAns;
        //console.log(userAnswer);
        init();
    }else{
        alert("小文字アルファベット"+letterNum+"文字で入力してください");
    }
}

let mondaiText = document.getElementById('mondaiText');
let mondaiInput = document.getElementById('mondaiInput');

function createProblem(){
    const url="https://gawa4423.github.io/circle/";
    //"http://127.0.0.1:5500/"
    //"https://gawa4423.github.io/circle/";

    let mondaiAnswer = mondaiInput?.value;
    let found = checkAlpha(mondaiAnswer);

    //console.log(found);
    if(!found){
        alert("小文字アルファベット3〜7文字で入力してください");
    }else if(found?.length<=2 || found?.length >= 8){
        alert("小文字アルファベット3〜7文字で入力してください");
    }else if(found?.length===mondaiAnswer?.length){
        mondaiText.innerText = url + "?p=" + btoa(found);
    }else{
        alert("小文字アルファベット3〜7文字で入力してください");
    }
}

//アルファベットからなる文字列か判定
function checkAlpha(moji){
    if(!moji){
        return false;
    }
    let t = String(moji);
    t = t.trim();
    t =t.toLowerCase();
    const regex = /^[a-z]+?$/g;
    const found = t.match(regex);
    if(found){
        return found[0];
    }else{
        return false;
    }
}

 /**
 * Get the URL parameter value
 *
 * @param  name {string} パラメータのキー文字列
 * @return  url {url} 対象のURL文字列（任意）
 */
function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

 
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }
