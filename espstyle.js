    
if(typeof $ == 'undefined') alert("网络连接失败, 请重新启动!");

function resetDebugInfo()
{
    $("table#GameObject tr").remove();
    $("table#Component tr").remove();
    $("#GameObjectTotalCount").html("0");
    $("#GameObjectCount").html("valid:0");
    $("#ComponentCount").html("types:0");
    
}

$(document).ready(function(){
    //alert();
    //绑定菜单点击切换子页面
    $("div.menubox").click(function(){
        $("div.menubox").removeClass("current");
        $("div.menuview").removeClass("current");
        $(this).addClass("current");
        
        let menuid = $(this).attr("menu");
        $("div#"+menuid).addClass("current");
    });
    
    /*禁止文本Option和拖动*/
    document.body.onselectstart = document.body.ondrag =function(){
        return false;
    }
    
    $("input").blur(function(){
        window.scroll(0,0); //文本框等输入完毕后页面自动滚动到顶部
    });
    
    //激活webkit的button:active
    document.body.addEventListener('touchstart', function () {});

    if(typeof h5gg!='undefined') {

        setWindowRect(0,0,window.screen.height,window.screen.width);

        setButtonAction(function(){
               
               let menu = document.querySelector("#console");
               if(menu.style.display=='none') {
                   menu.style.display='block';
                   //隐藏菜单之后, 设置触控穿透悬浮窗口
                   setWindowTouch(true);
               } else {
                   menu.style.display='none';
                   //显示菜单之后, 设置触控不可穿透悬浮窗口
                   setWindowTouch(false);
               }
           
          });

        resetDebugInfo();
        $("#MainComponentFilter").text("");
        $("td[filter=SubComponentFilter]").closest("tr").remove();
    }

    // for(let i=0; i<8000; i++) //显示过多列表疯狂上拉刷新会爆内存崩溃
    //         $("table#GameObject tbody").append("<tr><td>[0x13d84afc0] Character 214200107</td><td style=\"width:20px\" onclick=\"alert('count of Components in this GameObject')\">(5)</td></tr>");


    //获取画布
    let canvas = document.querySelector("#cav");
    //设置按照屏幕像素尺寸绘图(高清模式)
    let scale = window.devicePixelRatio;

    canvas.width = window.screen.height * scale;
    canvas.height = window.screen.width * scale;

        //获取绘图
    let ctx = canvas.getContext("2d", {alpha: false, desynchronized: false});

    //添加圆角矩形功能
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.beginPath();
        this.moveTo(x+r, y);
        this.arcTo(x+w, y, x+w, y+h, r);
        this.arcTo(x+w, y+h, x, y+h, r);
        this.arcTo(x, y+h, x, y, r);
        this.arcTo(x, y, x+w, y, r);
        this.closePath();
        return this;
    }

    window.gRoles = [];
let skippedLineCnt=-1;
   function isSkipLine(i){
     if (gRoles[i].isDead == 1 || gRoles[i].camp == 1) {
        skippedLineCnt++;
        return 1;
      } else {
       return 0;
      }
   }

function isSkipLine1(i){
     if (gRoles[i].isDead == 1 || gRoles[i].camp > 1) {
        skippedLineCnt++;
        return 1;
      } else {
       return 0;
      }
   }
    function getLineOrigin(type){
      let lineOri={
          x:(canvas.width)/2,y:(canvas.height)/2,pos:1000,lv:100
   };
  if (type == "self"){
       for(let i=0; i<gRoles.length; i++) {
          if (gRoles[i].isSelf == 1){
           lineOri={
             x:gRoles[i].x*window.devicePixelRatio,y:gRoles[i].y*window.devicePixelRatio,pos:gRoles[i].pos,lv:gRoles[i].lv
          }          
break;
        }
        }
     } else {   
   lineOri={
          x:(canvas.width)/2,y:(canvas.height)/2,pos:1000,lv:100
      }
     }
      return lineOri;
   }
  function getDistance(pos1,pos2){
   let distance = Math.sqrt(Math.pow(pos1.x-pos2.x,2)+Math.pow(pos1.y-pos2.y,2));
 distance = Math.sqrt(Math.pow(distance,2)+Math.pow(pos1.z-pos2.z,2));
return Math.round(distance);
   }


    function startdraw()
    {

        //清理画布开始新一轮绘图
        skippedLineCnt=0;
        let lineOri = getLineOrigin("self");
ctx.clearRect(0,0,canvas.width,canvas.height);

        if(window.draw_state==0) return;
        
        //画个圆圈
ctx.beginPath();
       ctx.lineWidth = 2;
ctx.textBaseline="top";
      ctx.textAlign="center";
     ctx.font='40px Tahoma';
        ctx.fillStyle="transparent";
        
        for(let i=0; i<gRoles.length; i++)
        {


            let x = gRoles[i].x*window.devicePixelRatio;
            let y = gRoles[i].y*window.devicePixelRatio;

            //ctx.fillText(gRoles[i].id, x, y);
            let distance=getDistance(lineOri.pos,gRoles[i].pos);
          ctx.fillText(distance, x, y);

            if(window.drawRayline) {
if (isSkipLine(i)) continue;
if(window.box) {
 ctx.lineWidth=2; //线宽
            ctx.strokeStyle="white";
ctx.strokeRect(x-100, y-150, 150, 150);}
                ctx.beginPath();
                ctx.lineWidth=2; //线宽

if (distance < 300){
ctx.strokeStyle="red";
} else if (distance < 500){
ctx.strokeStyle="yellow";
} 
else {
ctx.strokeStyle="transparent";
} //綠  色  
  if(window.xoaline){
ctx.strokeStyle="transparent";
}              
ctx.moveTo(lineOri.x, lineOri.y);
ctx.lineTo(x, y-10); //结  束  点
                ctx.stroke(); //射线
            }
if(window.drawRayline1) {
if (isSkipLine1(i)) continue;
ctx.lineWidth=2; //线宽
            ctx.strokeStyle="white";
ctx.strokeRect(x-100, y-150, 150, 150);
                ctx.beginPath();
                ctx.lineWidth=2; //线宽
if (distance < 300){
ctx.strokeStyle="red";
} else if (distance < 500){
ctx.strokeStyle="yellow";
} 
else {
ctx.strokeStyle="transparent";
} //綠  色  
 if(window.xoaline){
ctx.strokeStyle="transparent";
}                   
ctx.moveTo(lineOri.x, lineOri.y);
ctx.lineTo(x, y-10); //结  束  点
                ctx.stroke(); //射线
            }
       
        }



        
        ctx.lineWidth=0;
        ctx.fillStyle="transparent";
       ctx.strokeStyle="transparent";
       ctx.roundRect((canvas.width-200)/2, 30, 200, 60, 15).fill();
ctx.textBaseline="top";
    ctx.textAlign="center";
    ctx.fillStyle="red";
    ctx.font='40px "Arial, sans-serif"';
    ctx.fillText(gRoles.length-skippedLineCnt, canvas.width/2,25);

        //计算FPS
        ctx.beginPath();
ctx.fillStyle="red";
  ctx.fillText("Kkk",120,120);

    }
    
    //默认关闭绘图
    window.draw_state = 1;
    
    //* 定时器绘图, 在JS线程, 不影响APP帧率, 不要使用requestAnimationFrame会导致APP卡顿
    setInterval(function(){
        startdraw();
    }, 33);//*/

    document.addEventListener("touchmove", function(e) {
        const excludeEl = document.querySelectorAll(".scrollbar");
        const isExclude = Array.prototype.some.call(excludeEl, function(el) {
            return el.contains(e.target) && el.clientHeight<el.scrollHeight;
        });
        //console.log(isExclude, e.target);
        if (isExclude) {
            return true;
        }
        e.preventDefault();
    }, { passive: false } );
});
function anniu3() {
    var menu = document.querySelector("#console");
    menu.style.display='none';
    
    //隐藏菜单之后, 设置触控穿透悬浮窗口
    setWindowTouch(false);
                  }
      
