using UnityEngine;
using System.Collections;

public class BossTrigger : MonoBehaviour {

	public string boss;
	public GameObject CK;



	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}	

	void OnTriggerEnter2D(Collider2D warpCK){
		GameObject collidedWith = CK.gameObject;
		if (collidedWith.tag == "CK") {
			//Save current score to PlayerPrefs
 

			PlayerPrefs.Save ();

			Application.LoadLevel (boss);
		}
	}
}
