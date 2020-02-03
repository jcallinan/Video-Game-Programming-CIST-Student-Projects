using UnityEngine;
using System.Collections;

public class CameraFollow : MonoBehaviour {
	public Transform player;	
	private Vector3 velocity = Vector3.zero;


	public float dampTime = 0.15f;
	void start (){
		GameObject player = GameObject.Find ("Player");
	}

	void FixedUpdate () 
	{
		Vector3 cameraposition = player.position;
		cameraposition.z = cameraposition.z = -10;

		transform.position = cameraposition; // Camera follows the player 

			
	}


}