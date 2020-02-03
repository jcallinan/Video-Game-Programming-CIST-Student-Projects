using UnityEngine;
using System.Collections;

public class PlayerManager : MonoBehaviour {

	//Reference to inputState and Walk behaviors
	private InputState inputState;
	private Walk walkBehavior;
	private Animator animator;
	private CollisionState collisionState;

	void Awake(){
		//Set two properties

		inputState = GetComponent<InputState> ();
		walkBehavior = GetComponent<Walk> ();
		animator = GetComponent<Animator> ();
		collisionState = GetComponent<CollisionState> ();


	}

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		if (collisionState.standing) {
			ChangeAnimationState (0);
		}

		if (inputState.absVelX > 0) {
			ChangeAnimationState (1);

		}
		
		if (inputState.absVelY > 0) {
			ChangeAnimationState (2);
			
		}

		
		
		/*if (.velocity.y < 0) {
			ChangeAnimationState (3);
			
		}*/

		//Double animation speed if running
		animator.speed = walkBehavior.running ? walkBehavior.runMultiplier : 1;
		//Note: since we're updating speed outside of where we're calulcating if the character is moving,
		//it may impact other animations.  If Run his held during other actions, it will speed them up too.
	
	}
	
	//Changes animation based on a value fed into it
	void ChangeAnimationState(int value){
		animator.SetInteger ("AnimState", value);
		
	}
}
