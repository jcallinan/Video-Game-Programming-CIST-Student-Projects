using UnityEngine;
using System.Collections;

public class Warp : MonoBehaviour {

	public GameObject CK;
	public Vector3 warpDestination;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}
	
	void OnTriggerEnter2D(Collider2D warpCK){
		GameObject collidedWith = CK.gameObject;
		if (collidedWith.tag == "CK") {
			CK.transform.position = warpDestination;
		}
}
}
