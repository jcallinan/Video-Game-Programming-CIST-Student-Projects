using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class ButtonState{
	public bool value;
	public float holdTime = 0; //How long has a button been held down
}

public enum Directions{
	Right = 1,
	Left = -1
}

public class InputState : MonoBehaviour {

	//Assumes every item starts facing right
	public Directions direction = Directions.Right;

	//What's going on with the Rigidbody?
	public float absVelX = 0f; //X and Y properties
	public float absVelY = 0f;
	private Rigidbody2D body2d;

	//Dictionary<Key, Value>
	private Dictionary<Buttons, ButtonState> buttonStates = new Dictionary<Buttons, ButtonState>();

	//Reference to body2d component
	void Awake(){
		body2d = GetComponent<Rigidbody2D> ();
	}

	//Calculate X and Y position from Rigidbody velocity

	void FixedUpdate(){
		//Doesn't tell you which way the body is moving, just that the body is in motion
		absVelX = Mathf.Abs (body2d.velocity.x);
		absVelY = Mathf.Abs (body2d.velocity.y);
	}

	public void SetButtonValue(Buttons key, bool value){
		if(!buttonStates.ContainsKey (key))
			buttonStates.Add (key, new ButtonState());

		var state = buttonStates [key];

		//If value is fallse, we know the button has been released
		if (state.value && !value) {
			state.holdTime = 0;
		} else if (state.value && value) { //The button is still being pressed
			state.holdTime += Time.deltaTime;
		}

		state.value = value;

	}
	//Passing in the Buttons key enum
	public bool GetButtonValue(Buttons key){
		if (buttonStates.ContainsKey (key))
			return(buttonStates [key].value);
		else
			return false;


	}



	public float GetButtonHoldTime(Buttons key){
		if (buttonStates.ContainsKey (key))
			return(buttonStates [key].holdTime);
		else
			return 0;
		
		
	}
}
