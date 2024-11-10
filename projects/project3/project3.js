/**
 * moveToTx and lineToTx functions are from Week4's demo0
 * 
 * arcToTx is based on moveToTx and lineToTx
 */

function setup() {
    var canvas = document.getElementById('myCanvas');
    var pos = document.getElementById('position');
    var angle = document.getElementById('handle');
    pos.value = 0;
    angle.value = 0;
      
    function draw() {
      var context = canvas.getContext('2d');
      canvas.width = canvas.width;
      
      // use the sliders to get the angles
      var posWagon = pos.value*0.005*Math.PI;
      var handleAngle = angle.value*0.005*Math.PI;

      function moveToTx(x,y,Tx)
	      {var res=vec2.create(); vec2.transformMat3(res,[x,y],Tx); context.moveTo(res[0],res[1]);}

	  function lineToTx(x,y,Tx)
	      {var res=vec2.create(); vec2.transformMat3(res,[x,y],Tx); context.lineTo(res[0],res[1]);}

      function arcToTx(x,y,radius,startAngle,endAngle,Tx)
          {var res=vec2.create(); vec2.transformMat3(res,[x,y],Tx); context.arc(res[0],res[1],radius, startAngle, endAngle);}

      function wagon(Tx) {    
        context.beginPath();
        context.fillStyle = "red";
        moveToTx(0,200,Tx);
        lineToTx(100,200,Tx);
        lineToTx(100,250,Tx);
        lineToTx(0,250,Tx);
        context.closePath();
        context.fill();
      }

      function handle(Tx) {
        context.beginPath();
        context.fillStyle = "black";
        moveToTx(0,0,Tx);
        lineToTx(100,-50,Tx);
        context.lineWidth = 4;
        context.stroke();
      }

      function wheel(Tx) {
        context.beginPath();
        var x = 0;
        var y = 0;
        var radius = 15;
        let startAngle = 0;
        let endAngle = 2*Math.PI;
        arcToTx(x, y, radius, startAngle, endAngle, Tx);
        context.lineWidth = 4;
        context.stroke();

        context.beginPath();
        moveToTx(-15,0, Tx)
        lineToTx(15,0, Tx)
        context.stroke();

        context.beginPath();
        moveToTx(0,-15,Tx)
        lineToTx(0,15,Tx)
        context.stroke();

      }
      /**context.translate(pos.value, 0);
      wagon("red");
      context.save();**/
      var wagon_to_canvas = mat3.create();
      mat3.fromTranslation(wagon_to_canvas, [pos.value, 0]);
      wagon(wagon_to_canvas);

      var handle_to_wagon = mat3.create();
      mat3.fromTranslation(handle_to_wagon, [98,202]);
      mat3.rotate(handle_to_wagon, handle_to_wagon, handleAngle);
      var handle_to_canvas = mat3.create();
      mat3.multiply(handle_to_canvas, wagon_to_canvas, handle_to_wagon);
      handle(handle_to_canvas);

      var Lwheel_to_wagon = mat3.create();
      mat3.fromTranslation(Lwheel_to_wagon, [15,270]);
      mat3.rotate(Lwheel_to_wagon, Lwheel_to_wagon, posWagon);
      var Lwheel_to_canvas = mat3.create();
      mat3.multiply(Lwheel_to_canvas, wagon_to_canvas, Lwheel_to_wagon);
      wheel(Lwheel_to_canvas);

      var Rwheel_to_wagon = mat3.create();
      mat3.fromTranslation(Rwheel_to_wagon, [85,270]);
      mat3.rotate(Rwheel_to_wagon, Rwheel_to_wagon, posWagon);
      var Rwheel_to_canvas = mat3.create();
      mat3.multiply(Rwheel_to_canvas, wagon_to_canvas, Rwheel_to_wagon);
      wheel(Rwheel_to_canvas);

    }
  
    position.addEventListener("input",draw);
    handle.addEventListener("input",draw);
    draw();
  }
  window.onload = setup;
  
  