

function setup() {
    var observerCanvas = document.getElementById('observerCanvas');
    var cameraCanvas = document.getElementById('cameraCanvas');
    var observerContext = observerCanvas.getContext('2d');
    var cameraContext = cameraCanvas.getContext('2d');

    var slider1 = document.getElementById('slider1');
    slider1.value = 0;

    var slider2 = document.getElementById('slider2');
    slider2.value = 0;

    var slider3 = document.getElementById('slider3');
    slider3.value = 0;

    var context = cameraContext; // default to drawing in the camera window

    function draw() {
      
    // clear both canvas instances
	observerCanvas.width = observerCanvas.width;
	cameraCanvas.width = cameraCanvas.width;

	// use the sliders to get the angles
	var tParam = slider1.value*0.01;
    var viewAngle = slider2.value*0.02*Math.PI;
    var handleAngle = slider3.value*0.02*Math.PI;
     
    function arcToTx(x,y,radius,startAngle,endAngle,Tx)
    {var res=vec3.create(); vec3.transformMat3(res,[x,y,z],Tx); context.arc(res[0],res[1],radius, startAngle, endAngle);}
    
	function moveToTx(loc,Tx)
	{var res=vec3.create(); vec3.transformMat4(res,loc,Tx); context.moveTo(res[0],res[1]);}

	function lineToTx(loc,Tx)
	{var res=vec3.create(); vec3.transformMat4(res,loc,Tx); context.lineTo(res[0],res[1]);}
	
    var Hermite = function(t) {
	    return [
		2*t*t*t-3*t*t+1,
		t*t*t-2*t*t+t,
		-2*t*t*t+3*t*t,
		t*t*t-t*t
	    ];
	}

    var HermiteDerivative = function(t) {
        return [
        6*t*t-6*t,
        3*t*t-4*t+1,
        -6*t*t+6*t,
        3*t*t-2*t
        ];
    }

	function Cubic(basis,P,t){
	    var b = basis(t);
	    var result=vec3.create();
	    vec3.scale(result,P[0],b[0]);
	    vec3.scaleAndAdd(result,result,P[1],b[1]);
	    vec3.scaleAndAdd(result,result,P[2],b[2]);
	    vec3.scaleAndAdd(result,result,P[3],b[3]);
	    return result;
	}
	
	var p0=[0,0,234];
	var d0=[143,242,143];
	var p1=[85,340,35];
	var d1=[-100,320,0];
	var p2=[200,200,294];
	var d2=[200,300,62];
    //var p3=[0,0,234];
    //var d3=[-400,700,142];

	var P0 = [p0,d0,p1,d1];
	var P1 = [p1,d1,p2,d2];
    //var P2 = [p2,d2,p3,d3];

	var C0 = function(t_) {return Cubic(Hermite,P0,t_);};
	var C1 = function(t_) {return Cubic(Hermite,P1,t_);};
    //var C2 = function(t_) {return Cubic(Hermite,P2,t_);};

    var C0prime = function(t_) {return Cubic(HermiteDerivative,P0,t_);};
	var C1prime = function(t_) {return Cubic(HermiteDerivative,P1,t_);};
    //var C2prime = function(t_) {return Cubic(HermiteDerivative,P2,t_);};

    var Ccomp = function(t) {
        if (t<1){
            var u = t;
            return C0(u);
        } else if (t>=1 && t<2) {
            var u = t-1.0;
            return C1(u);
        } else {
            var u = t-2.0;
            return C2(u);
        }       
	}

    var Ccomp_tangent = function(t) {
        if (t<1){
            var u = t;
            return C0prime(u);
        } else if (t>=1 && t<2) {
            var u = t-1.0;
            return C1prime(u);
        } else {
            var u = t-2.0;
            return C2prime(u);
        }          
	}
/**
    var CameraCurve = function(angle) {
        var distance = 120.0;
        var eye = vec3.create();
        eye[0] = distance*Math.sin(viewAngle);
        eye[1] = 100;
        eye[2] = distance*Math.cos(viewAngle);  
        return [eye[0],eye[1],eye[2]];
    }*/

    function drawTrajectory(t_begin,t_end,intervals,C,Tx,color) {
	    context.strokeStyle=color;
	    context.beginPath();
        moveToTx(C(t_begin),Tx);
        for(var i=1;i<=intervals;i++){
            var t=((intervals-i)/intervals)*t_begin+(i/intervals)*t_end;
            lineToTx(C(t),Tx);
        }
        context.stroke();
	}
    function wagon(TxU,scale) {  
        var Tx = mat4.clone(TxU);
        mat4.scale(Tx,Tx,[scale,scale,scale]);
        context.beginPath();  
        context.fillStyle = "red";
        moveToTx([-.15,-.15,0],Tx);
	    lineToTx([-.15,.15,0],Tx);
        lineToTx([.15,.15,0],Tx);
      	lineToTx([.15,-.15,0],Tx);
        context.fill();
      }

      function handle(TxU,scale) {
        var Tx = mat4.clone(TxU);
        mat4.scale(Tx,Tx,[scale,scale,scale]);

        context.beginPath();
        context.fillStyle = "black";
        moveToTx([0,0,0],Tx);
        lineToTx([100,-50,0],Tx);
        context.lineWidth = 4;
        context.stroke();
      }
/**
      function wheel(TxU,scale) {
        var Tx = mat4.clone(TxU);
        mat4.scale(Tx,Tx,[scale,scale,scale]);
        context.beginPath();
        var x = 0;
        var y = 0;
        var radius = 1.5;
        let startAngle = 0;
        let endAngle = 2*Math.PI;
        arcToTx(x, y, radius, startAngle, endAngle, Tx);
        context.lineWidth = 4;
        context.stroke();

        context.beginPath();
        moveToTx([-1,0,0], Tx)
        lineToTx([1,0,0], Tx)
        context.stroke();

        context.beginPath();
        moveToTx([0,-1,0],Tx)
        lineToTx([0,1,0],Tx)
        context.stroke();

      }
      */

    // create two lookAt transforms; one for the camera
    // and one for the "external observer"

    // Create Camera (lookAt) transform
    var eyeCamera = CameraCurve(viewAngle);
    var targetCamera = vec3.fromValues(0,0,0); // Aim at the origin of the world coords
    var upCamera = vec3.fromValues(0,100,0); // Y-axis of world coords to be vertical
	var TlookAtCamera = mat4.create();
    mat4.lookAt(TlookAtCamera, eyeCamera, targetCamera, upCamera);
      
    // Create Camera (lookAt) transform
    var eyeObserver = vec3.fromValues(500,300,500);
    var targetObserver = vec3.fromValues(0,50,0); // Observer still looks at origin
    var upObserver = vec3.fromValues(0,1,0); // Y-axis of world coords to be vertical
	var TlookAtObserver = mat4.create();
    mat4.lookAt(TlookAtObserver, eyeObserver, targetObserver, upObserver);
      
    // Create ViewPort transform (assumed the same for both canvas instances)
    var Tviewport = mat4.create();
	mat4.fromTranslation(Tviewport,[200,300,0]);  // Move the center of the
                                                  // "lookAt" transform (where
                                                  // the camera points) to the
                                                  // canvas coordinates (200,300)
	mat4.scale(Tviewport,Tviewport,[100,-100,1]); // Flip the Y-axis,
                                                  // scale everything by 100x
    // make sure you understand these    

    context = cameraContext;

    // Create Camera projection transform
    // (orthographic for now)
    var TprojectionCamera = mat4.create();
    mat4.ortho(TprojectionCamera,-100,100,-100,100,-1,1);
    //mat4.perspective(TprojectionCamera,Math.PI/4,1,-1,1); // Use for perspective teaser!

    // Create Observer projection transform
    // (orthographic for now)
    var TprojectionObserver = mat4.create();
    mat4.ortho(TprojectionObserver,-120,120,-120,120,-1,1);
     
    // Create transform t_VP_PROJ_CAM that incorporates
    // Viewport, projection and camera transforms
    var tVP_PROJ_VIEW_Camera = mat4.create();
    mat4.multiply(tVP_PROJ_VIEW_Camera,Tviewport,TprojectionCamera);
    mat4.multiply(tVP_PROJ_VIEW_Camera,tVP_PROJ_VIEW_Camera,TlookAtCamera);
    var tVP_PROJ_VIEW_Observer = mat4.create();
    mat4.multiply(tVP_PROJ_VIEW_Observer,Tviewport,TprojectionObserver);
    mat4.multiply(tVP_PROJ_VIEW_Observer,tVP_PROJ_VIEW_Observer,TlookAtObserver);
      
	// Create model(ing) transform
    // (from moving object to world)
    var Tmodel = mat4.create();
	mat4.fromTranslation(Tmodel,Ccomp(tParam));
    var tangent = Ccomp_tangent(tParam);
    var angle = Math.atan2(tangent[1],tangent[0]);
	mat4.rotateZ(Tmodel,Tmodel,angle);

    // Create transform t_VP_PROJ_VIEW_MOD that incorporates
    // Viewport, projection, camera, and modeling transform
    var tVP_PROJ_VIEW_MOD_Camera = mat4.create();
	mat4.multiply(tVP_PROJ_VIEW_MOD_Camera, tVP_PROJ_VIEW_Camera, Tmodel);
    var tVP_PROJ_VIEW_MOD1_Observer = mat4.create();
	mat4.multiply(tVP_PROJ_VIEW_MOD1_Observer, tVP_PROJ_VIEW_Observer, Tmodel);
    var tVP_PROJ_VIEW_MOD2_Observer = mat4.create();
    mat4.translate(tVP_PROJ_VIEW_MOD2_Observer, tVP_PROJ_VIEW_Observer, eyeCamera);
	var TlookFromCamera = mat4.create();
    mat4.invert(TlookFromCamera,TlookAtCamera);
    mat4.multiply(tVP_PROJ_VIEW_MOD2_Observer, tVP_PROJ_VIEW_MOD2_Observer, TlookFromCamera);

	drawTrajectory(0.0,1.0,100,C0,tVP_PROJ_VIEW_Camera,"red");
    drawTrajectory(0.0,1.0,100,C1,tVP_PROJ_VIEW_Camera,"blue");
    
    wagon(tVP_PROJ_VIEW_MOD_Camera,100.0);
    var handleToWagon = mat4.create();
    mat4.fromTranslation(handleToWagon, [8, 10, 0]); 
    mat4.rotateZ(handleToWagon, handleToWagon, handleAngle); 
   
    var tVP_PROJ_VIEW_MOD_Handle = mat4.create();
    mat4.multiply(tVP_PROJ_VIEW_MOD_Handle, tVP_PROJ_VIEW_MOD_Camera, handleToWagon);
    handle(tVP_PROJ_VIEW_MOD_Handle, 1.0);
    }
    
  
    slider1.addEventListener("input",draw);
    slider2.addEventListener("input",draw);
    slider3.addEventListener("input",draw);
    draw();
}
window.onload = setup;
