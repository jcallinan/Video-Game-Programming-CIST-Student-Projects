using UnityEngine;
using System.Collections;

public class Jump : AbstractBehavior {

	public float jumpSpeed = 200f;

	//Time between jumps
	public float jumpDelay = .1f;
	public int jumpCount = 2;

	protected float lastJumpTime = 0;
	protected int jumpsRemaining = 0;

	// Use this for initialization
	void Start () {

	
	}
	
	// Update is called once per frame
	void Update () {

		var canJump = inputState.GetButtonValue (inputButtons [0]);
		var holdTime = inputState.GetButtonHoldTime (inputButtons [0]);

		if (collisionState.standing) {
			
			jumpsRemaining = 1;

			if (canJump && holdTime < .1f) { 
				//We don't use 0 because it takes a small amount of time to test between when the button is pressed
				//and when the Jump script is actually executed.

				OnJump ();
			} 

			//Code for jumping in air.	
		} else {
			if (canJump && holdTime < .1f && Time.time - lastJumpTime > jumpDelay) { 
				
				if (jumpsRemaining > 0) {
					//PlayerManager.ChangeAnimationState(3);
					OnJump ();
					jumpsRemaining--;
				}
			}
			
		}
	}

	//Make it protected virtual so you can extend and override class to make extentions
	//And variations on it later

	protected virtual void OnJump(){

		var vel = body2d.velocity;
		
		//Delta is time between one frame and the next, usually returned in milliseconds
		lastJumpTime = Time.time;

		body2d.velocity = new Vector2 (vel.x, jumpSpeed);

	}
}
