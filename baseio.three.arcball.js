var BASE_THREE_ARCBALL = {

	create: function( domElement, threeObject ){

		// Settings
		this.kSensitivity = 0.02;    	// drag sensitivity
		this.kFriction = 0.03;       	// throw friction
		this.kAutorotationSpeed = 0;	// 0.005;
		this.dSensitivityFactor = 1.0;	// decrease to lower kSensitivity

		// Make sure the Three Object is using Quaternions, not the usual Rotation
		this.threeObject = threeObject;
		//this.threeObject.useQuaternion = true;
		this.threeObject.quaternion = new THREE.Quaternion();

		// Private
		this.bMousePressed 	= false;
		this.deltaMousePos 	= {x:0,y:0};
		this.prevMousePos  	= {x:0,y:0};
		this.container     	= domElement;

		// R13
		this.delta 			= 0.0;
		this.useclamp		= true;
		this.clamp_y		= { min: -0.5, max: 1.3 }; // $min reveals south-pole
		this.clamp_y_obj 	= { x:0, y:0 };

		this.toString = function(){
			// Return socket-friendly string representation
			var Q = this.threeObject.quaternion;
			var msg = 'R_'+ (Q.x * -1) +','+ (Q.y * -1) +','+ Q.z +','+ Q.w;
			return msg;
		}

		this.getDelta = function(){
			// Return difference from last frame as float
			var Q = this.threeObject.quaternion;
			var curr = (0.0 + Q.x + Q.y + Q.z + Q.w).toFixed(4);
			var diff = Math.abs(this.delta - curr).toFixed(4);
			this.delta = curr;
			return diff;
		}

		this.update = function(){
			var UP 		 = {x:0, y:1, z:0};
			var RIGHT    = {x:1, y:0, z:0};

			var xRotation = new THREE.Quaternion();
			var yRotation = new THREE.Quaternion();
			
			this.deltaMousePos.x *= 1 - this.kFriction;
			this.deltaMousePos.y *= 1 - this.kFriction;
			this.deltaMousePos.x -= this.kAutorotationSpeed;

			
			// Clamp dev
			
			if( this.useclamp ){

		        this.clamp_y_obj.x += this.deltaMousePos.x * this.kSensitivity;
		        this.clamp_y_obj.y += this.deltaMousePos.y * this.kSensitivity;
		        this.clamp_y_obj.y  = THREE.Math.clamp(this.clamp_y_obj.y, this.clamp_y.min, this.clamp_y.max);

		        xRotation.setFromAxisAngle(UP, this.clamp_y_obj.x);
		        yRotation.setFromAxisAngle(RIGHT, this.clamp_y_obj.y);
		        this.threeObject.quaternion.multiplyQuaternions( yRotation, xRotation);
		    
		    }else{
			
				xRotation.setFromAxisAngle(UP, this.deltaMousePos.x * (this.kSensitivity * this.dSensitivityFactor) );
				yRotation.setFromAxisAngle(RIGHT, this.deltaMousePos.y * (this.kSensitivity * this.dSensitivityFactor) );

				var rotation = new THREE.Quaternion();
				rotation.multiplyQuaternions(xRotation, yRotation); //r56
				this.threeObject.quaternion.multiplyQuaternions( rotation, this.threeObject.quaternion);
			}

			
		}

		this.OnMouseWheel = function( event ){
			//console.log("Arcball OnMouseWheel");
			var delta = Math.max(-1, Math.min(1, event.wheelDelta ));

			try{ // Delegate
				OnMouseWheel( delta );
			}catch(e){};
		}

		this.OnKeyDown = function( event ){
			//console.log( event.keyCode +", "+ event.metaKey +", "+ event.altKey);

			if( event.altKey && event.keyCode == 83 ){
				// opt + s
			}

			try{ // Delegate
				OnKeyDown( event );
			}catch(e){};
		}

		this.OnTouchStart = function( event ) {
			if ( event.touches.length == 1 ) {
				event.preventDefault();
				this.OnMouseDown({clientX:event.pageX, clientY:event.pageY, preventDefault:function(){} });
			}
		}

		this.OnTouchMove = function( event ) {
			if ( event.touches.length == 1 ) {
				event.preventDefault();
				this.OnMouseMove({clientX:event.pageX, clientY:event.pageY});
			}
		}

		this.OnMouseUp = function(event){
			this.bMousePressed = false
			event.preventDefault();
			return false;
		}

		this.OnMouseMove = function( event ){
			if( !this.bMousePressed ) return;
			
			var mx = event.clientX;
			var my = event.clientY;

			this.deltaMousePos = {x: mx - this.prevMousePos.x, y: my - this.prevMousePos.y };
			this.prevMousePos  = {x: mx, y: my};
		}

		this.OnMouseDown = function( event ){
			event.preventDefault();
			this.bMousePressed = true;
			this.prevMousePos  = {x: event.clientX, y: event.clientY};
		}


		// Add Event Listeneres to domElement
		this.container.addEventListener('mouseover', 	this.OnMouseUp.bind(this), false);
		this.container.addEventListener('mouseout',  	this.OnMouseUp.bind(this), false);
		this.container.addEventListener('mouseup',   	this.OnMouseUp.bind(this), false);
		this.container.addEventListener('mousedown', 	this.OnMouseDown.bind(this), false);
		this.container.addEventListener('mousemove', 	this.OnMouseMove.bind(this), false);
		this.container.addEventListener("mousewheel",	this.OnMouseWheel.bind(this), false);

		this.container.addEventListener("touchstart",  	this.OnTouchStart.bind(this), false);
		this.container.addEventListener("touchend", 	this.OnMouseUp.bind(this), false);
		this.container.addEventListener("touchcancel", 	this.OnMouseUp.bind(this), false);
		this.container.addEventListener("touchleave",  	this.OnMouseUp.bind(this), false);
		this.container.addEventListener("touchmove",   	this.OnTouchMove.bind(this), false);

		//document.addEventListener("keydown",   			this.OnKeyDown.bind(this), false);

	}
}
