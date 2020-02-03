using UnityEngine;
using System.Collections;

public class CollisionState : MonoBehaviour {

	public LayerMask collisionLayer;
	public bool standing;
	public Vector2 bottomPosition = Vector2.zero;
	public float collisionRadius = 10f;
	public float collisionX = 10f;
	public float collisionXL = 10f;
	public float collisionXR = 10f;
	public float collisionY = 10f;
	public Color debugCollisionColor = Color.red;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	void FixedUpdate(){

		var pos = bottomPosition;

		pos.x += transform.position.x;
		pos.y += transform.position.y;

		//Asks Physics2D engine to overlap the circle/pos and the collisionRadius 
		//and see if it's within the collisionLayer. If it is, it's true.
		standing = Physics2D.OverlapCircle (pos, collisionRadius, collisionLayer);


	}

	void OnDrawGizmos(){
		Gizmos.color = debugCollisionColor;

		
		var pos = bottomPosition;
		
		pos.x += transform.position.x;
		pos.y += transform.position.y;

		Gizmos.DrawWireSphere (pos, collisionRadius);

	}
}
