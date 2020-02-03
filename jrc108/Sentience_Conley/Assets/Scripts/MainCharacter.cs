using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class MainCharacter: MonoBehaviour {

	public Text		scoreGT;

	void OnTriggerEnter ( Collider other ) {
			if (other.gameObject.CompareTag ("Brain")) {
			other.gameObject.SetActive(false);
		}
		int score = int.Parse (scoreGT.text);
		score += 10;
		scoreGT.text = score.ToString ();
		}


	// Use this for initialization
	void Start () {
		GameObject scoreGO = GameObject.Find ("ScoreCounter");
		scoreGT = scoreGO.GetComponent<Text> ();
		scoreGT.text = "0";
	}
	
	// Update is called once per frame
	void Update () {
		int score = int.Parse (scoreGT.text);
		scoreGT.text = score.ToString ();
		if (score == 70) {
			Application.LoadLevel(4);
		}
	}
}
