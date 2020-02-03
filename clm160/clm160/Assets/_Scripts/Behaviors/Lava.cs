using UnityEngine;
using System.Collections;

public class Lava : AbstractBehavior {
	
	public float burnSpeed = 700f;
	public float enemyBounce;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}	

	void OnTriggerEnter2D (Collider2D col1)	{
		//Find out what hit this basket
		GameObject collidedWith = col1.gameObject;
		if(collidedWith.tag.Equals("Lava")){
			Debug.Log("Ouch!");
			
			var vel = body2d.velocity;
			
			body2d.velocity = new Vector2 (vel.x, burnSpeed);
		} else if(collidedWith.tag.Equals("WeakPoint")){
			Debug.Log("Smash!");
			
			var vel = body2d.velocity;
			
			body2d.velocity = new Vector2 (vel.x, enemyBounce);
		}
	}
}
