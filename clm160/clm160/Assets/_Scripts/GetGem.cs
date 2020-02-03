using UnityEngine;
using System.Collections;

public class GetGem : MonoBehaviour {

	public string nextLevel;
	public int bounce;
	public GameObject gem;

	// Use this for initialization
	void Start () {
	

	}

	void Update(){
		if (gem && gem.transform.position.y < -850) {
			Application.LoadLevel ("badEnd");
			//Destroy (gem);
		}
	}
	
	// Update is called once per frame
	void OnTriggerEnter2D (Collider2D colgem){
		GameObject collidedWith = colgem.gameObject;


		if (collidedWith.tag.Equals ("CK")) {
			
			Application.LoadLevel (nextLevel);
	
	}
}
}
