enum RotationAxes { MouseXAndY = 0, MouseX = 1, MouseY = 2 }
	var axes:RotationAxes = RotationAxes.MouseXAndY;
	var sensitivityX = 15.0;
	var sensitivityY = 15.0;

	var minimumX = -360.0;
	var maximumX = 360.0;

	var minimumY = -60.0;
	var maximumY = 60.0;

	private var rotationY = 0.0;

	function Update () {

	if (!gameControl.ActivateGUI){
		if (axes == RotationAxes.MouseXAndY){
			var rotationX = transform.localEulerAngles.y + Input.GetAxis("Mouse X") * sensitivityX;
			
			rotationY += Input.GetAxis("Mouse Y") * sensitivityY;
			rotationY = Mathf.Clamp (rotationY, minimumY, maximumY);
			
			transform.localEulerAngles = new Vector3(-rotationY, rotationX, 0);
		}
		else if (axes == RotationAxes.MouseX)
		{
			transform.Rotate(0, Input.GetAxis("Mouse X") * sensitivityX, 0);
		}
		else{
			rotationY += Input.GetAxis("Mouse Y") * sensitivityY;
			rotationY = Mathf.Clamp (rotationY, minimumY, maximumY);
			
			transform.localEulerAngles = new Vector3(-rotationY, transform.localEulerAngles.y,transform.localEulerAngles.z);
			}
		}
	}

	function Start () {
		// Make the rigid body not change rotation
		if (rigidbody)
			rigidbody.freezeRotation = true;
	}
