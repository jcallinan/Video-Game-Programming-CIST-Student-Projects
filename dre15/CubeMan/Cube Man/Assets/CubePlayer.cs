using UnityEngine;
using System.Collections;

public class CubePlayer : MonoBehaviour {
	float rotationResetSpeed = 1.0f;
	public Transform originalRotationValue;
	public float speed = 10000;
	bool grounded;
	public Rigidbody rb;
	bool JumpWall;
	bool jumpfromWall;
	// Use this for initialization
	Vector3 startingPosition;
	Vector3 checkPoint;
	float deathCount =0;


	public GUIText deathCounter;
	void Start () {
		startingPosition = transform.position;
		checkPoint = new Vector3 (230f, .5f, 0);
		rb = GetComponent<Rigidbody> ();
		jumpfromWall = false;
		originalRotationValue = gameObject.transform;
	}
	
	// Update is called once per frame
	void FixedUpdate () {
		if (transform.position.y < -40 && transform.position.x > 230) {
			transform.position = checkPoint;
			deathCount ++;
			deathCounter.text = "Falls: " + deathCount;
		}
		if (transform.position.y < -50 && transform.position.x <220)
		{

			transform.position = startingPosition;
			deathCount ++;
			deathCounter.text = "Falls: " + deathCount;
		}


		if (transform.position.y > 330)
		{
			
			transform.position = startingPosition;
			deathCount ++;
			deathCounter.text = "Falls: " + deathCount;
		}

		float xAxis = Input.GetAxis ("Horizontal"); // makes the character move
		float yAxis = Input.GetAxis ("Vertical");
		Vector3 pos = transform.position;
		pos.x += xAxis * 4 * Time.deltaTime;
		

		transform.position = pos; //this makes the character move ^^^
		if (Input.GetKeyDown ("space")) {
			GameObject go = GameObject.Find("Player");
			// go.GetComponent<Rigidbody>().velocity = Vector3.zero;
			// go.GetComponent<Rigidbody>().velocity= Vector3.zero; 
			transform.rotation = Quaternion.Euler(new Vector3(0,0,0));
		}
		if (Input.GetAxis ("Jump") > 0 && (grounded)) {
			//	pos.z = 0;
			//	Vector3 JumpSpot = new Vector3();
			//	JumpSpot.x = 0;
			//	JumpSpot.y = speed * 30 ;

			//	rb.AddForce(JumpSpot);
			if (GetComponent<Collider>().bounds.size.x > GetComponent<Collider>().bounds.size.y) {
				horizontalJump (ref pos,xAxis,yAxis);

			//} else if (transform.rotation.y > 90 && transform.rotation.y < 180) {
			//	verticalJump (ref pos);
				
			} else {
				verticalJump (ref pos,xAxis,yAxis);
			}
		}
		if(!grounded && Input.GetAxis ("Horizontal") !=0 ){
			pos.z=0;
			Vector3 curPosition = transform.position;
			curPosition.x = Input.GetAxis ("Horizontal") *25;
			curPosition.y = -speed * 2;
			rb.AddForce (curPosition);
		}
	




		if (Input.GetKey (KeyCode.Z) || (Input.GetKeyDown (KeyCode.J))) {
			transform.Rotate (Vector3.left * 4);
		}
		if (Input.GetKey (KeyCode.C) || (Input.GetKeyDown (KeyCode.L))) {
			transform.Rotate (Vector3.right * 4);
		}
		if (Input.GetKey (KeyCode.S) || (Input.GetKeyDown (KeyCode.I))) {
			transform.Rotate (Vector3.up * 4);
		}
		if (Input.GetKey (KeyCode.X) || (Input.GetKeyDown (KeyCode.K))) {
			transform.Rotate (Vector3.down * 4);
		}
		if (Input.GetKey (KeyCode.Space)) {
			transform.rotation = Quaternion.Slerp(transform.rotation, originalRotationValue.rotation, Time.time * rotationResetSpeed);
		}
		}


void OnCollisionEnter(Collision Collision2D) {
	if (Collision2D.gameObject.tag == "Ground")
		grounded = true;
		if (Collision2D.gameObject.tag == "DeadWall") 
			grounded = false;
			if (Collision2D.gameObject.tag == "jumpWall"){
				grounded = true;
			jumpfromWall = true;

		}
	
		if (Collision2D.gameObject.tag == "Girl") {
			
			Application.LoadLevel ("Scene_0");
		}
}


void OnCollisionExit(Collision Collision2D) {
	if (Collision2D.gameObject.tag == "Ground")
		grounded = false;

}
	void OnCollision(Collision Collision2D) {
		if (Collision2D.gameObject.tag == "Girl")
			Application.LoadLevel ("Scene_0");
	}
	void horizontalJump (ref Vector3 pos, float xAxis, float yAxis)

	{
		
	
			pos.z = 0;
			Vector3 JumpSpot = new Vector3();
			JumpSpot.x = xAxis * speed * 25	;
			JumpSpot.y = speed * 22 ;
		if (jumpfromWall) {
		
		//	Vector3 JumpsPot = new Vector3();
			JumpSpot.x =xAxis * speed * 10;
			JumpSpot.y = yAxis * speed * 10;
		
		
		}
			rb.AddForce(JumpSpot);

	}


	void verticalJump (ref Vector3 pos, float xAxis, float yAxis )
		
	{
		
		
		pos.z = 0;
		Vector3 JumpSpot = new Vector3 ();
		JumpSpot.x = 0;
		JumpSpot.y = speed * 32;
		if (jumpfromWall) {
			pos.z = 0;
		//Vector3 JumpsPot = new Vector3 ();
			JumpSpot.x = xAxis * speed * 20;
			JumpSpot.y = yAxis * speed * 20;
		
		
		}
		rb.AddForce (JumpSpot);

	}
}
