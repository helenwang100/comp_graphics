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

      function wagon(color) {    
        context.beginPath();
        context.fillStyle = color;
        context.moveTo(0,200);
        context.lineTo(100,200);
        context.lineTo(100,250);
        context.lineTo(0,250);
        context.closePath();
        context.fill();
      }

      function handle() {
        context.beginPath();
        context.fillStyle = "black";
        context.moveTo(0,0);
        context.lineTo(100, -50);
        context.lineWidth = 4;
        context.stroke();
      }

      function wheel() {
        context.beginPath();
        var x1 = 0;
        var y1 = 0;
        var radius = 15;
        let startAngle = 0;
        let endAngle = 2*Math.PI;

        context.arc(1, 1, radius, startAngle, endAngle);
        context.lineWidth = 4;
        context.stroke();

        context.beginPath();
        context.moveTo(-15, 1)
        context.lineTo(15, 1)
        context.stroke();

        context.beginPath();
        context.moveTo(1, -15)
        context.lineTo(1, 15)
        context.stroke();

      }
      context.translate(pos.value, 0);
      wagon("red");
      context.save();

      context.translate(98,202);
      context.rotate(handleAngle);
      handle();
      context.restore();
      context.save();

      // L wheel
      context.translate(15, 270);
      context.rotate(posWagon);
      wheel();
      context.restore();
      context.save();

      // R wheel
      context.translate(85, 270);
      context.rotate(posWagon);
      wheel();
    }
  
    position.addEventListener("input",draw);
    handle.addEventListener("input",draw);
    draw();
  }
  window.onload = setup;
  
  