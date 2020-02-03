using UnityEngine;
using System.Collections;

//Abstract means it cannot be instantiated directly. Every behavior inherits its logic?
public abstract class AbstractBehavior : MonoBehaviour {

	public Buttons[] inputButtons;

	//protected means private, but available to other classes that extend it
	protected InputState inputState;
	protected Rigidbody2D body2d;
	protected CollisionState collisionState;

	protected virtual void Awake(){
		inputState = GetComponent<InputState> ();
		body2d = GetComponent<Rigidbody2D> ();
		collisionState = GetComponent<CollisionState> ();

	}

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
