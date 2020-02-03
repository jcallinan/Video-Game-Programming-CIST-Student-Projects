using UnityEngine;
using System.Collections;

[RequireComponent (typeof (CharacterController))]
public class Player : MonoBehaviour {
	//Handling
	public float rotationSpeed = 450;
	public float walkSpeed = 5;
	public float runSpeed = 8;
	private Camera cam;
	public Gun gun;
	//System
	private Quaternion targetRotation;
	//Components
	private CharacterController controller;
	// Use this for initialization
	void Start () {
		controller = GetComponent<CharacterController> ();
		cam = Camera.main;
	}
	
	// Update is called once per frame
	void Update () {
		ControlMouse ();
		//ControlWASD ();
		if (Input.GetButtonDown("Shoot")) {
			gun.Shoot();
		}
	}
	void ControlMouse() {
		Vector3 mousePos = Input.mousePosition;
		mousePos = cam.ScreenToWorldPoint(new Vector3(mousePos.x,mousePos.y,cam.transform.position.y - transform.position.y));
		targetRotation = Quaternion.LookRotation(mousePos - new Vector3(transform.position.x,0,transform.position.z));
		transform.eulerAngles = Vector3.up * Mathf.MoveTowardsAngle(transform.eulerAngles.y,targetRotation.eulerAngles.y,rotationSpeed * Time.deltaTime);
		
		Vector3 input = new Vector3(Input.GetAxisRaw("Horizontal"),0,Input.GetAxisRaw("Vertical"));
		Vector3 motion = input;
		motion *= (Mathf.Abs(input.x) == 1 && Mathf.Abs(input.z) == 1)?.7f:1;
		motion *= (Input.GetButton("Run"))?runSpeed:walkSpeed;
		motion += Vector3.up * -8;
		
		controller.Move(motion * Time.deltaTime);	}

	void ControlWASD() {
		Vector3 input = new Vector3(Input.GetAxisRaw("Horizontal"),0, Input.GetAxisRaw("Vertical"));

		transform.rotation = Quaternion.LookRotation (input);

		if(input != Vector3.zero) {
			targetRotation = Quaternion.LookRotation(input);
			transform.eulerAngles = Vector3.up * Mathf.MoveTowardsAngle(transform.eulerAngles.y, targetRotation.eulerAngles.y,rotationSpeed * Time.deltaTime);
		}
		Vector3 motion = input;
		motion += Vector3.up * -8;
		motion *= (Mathf.Abs (input.x) == 1 && Mathf.Abs (input.z) == 1) ? .7f : 1;
		motion *= (Input.GetButton ("Run")) ? runSpeed : walkSpeed;

		controller.Move (motion * Time.deltaTime);
	}
}
