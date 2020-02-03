using UnityEngine;
using System.Collections;

public class Treasures : MonoBehaviour {

	public GUIText scoreGT;

	// Use this for initialization
	void Start () {
		/*GameObject scoreGO = GameObject.Find ("Score");

		scoreGT = scoreGO.gameObject.GetComponent<GUIText> ();

		scoreGT.text = "0";*/
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	void OnCollisionEnter(Collision coll){
		GameObject collidedWith = coll.gameObject;
		if (collidedWith.tag == "CK") {
			Destroy (this);
			int score = int.Parse (scoreGT.text);
			score += 100;
			scoreGT.text = score.ToString ();
		}
		
		

	}
}
