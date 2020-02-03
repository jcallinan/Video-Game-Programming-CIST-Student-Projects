using UnityEngine;
using System.Collections;

public class CK : MonoBehaviour {
	private int score;
	public int health;
	public int displayScore;

	public string level;
	public int levelScore, beachScore, jungleScore, volcanoScore, castleScore;

	void Awake(){
	}
	// Update is called once per frame
	void Update () {

	}

	void OnTriggerEnter2D (Collider2D col1)	{
		//Find out what hit this basket
		GameObject collidedWith = col1.gameObject;
		/*if (collidedWith.tag == "Trasure") {*/
		if (collidedWith.tag.Equals ("Treasure")) {
			//Debug.Log("Get treasure!");
			Destroy (collidedWith);	
			score++;
			//Save the Current Score
			PlayerPrefs.SetInt("CurrentScore",score);
			Debug.Log ("Score: "+ score);
		} else if (collidedWith.tag.Equals ("BossWarp")) {
			//Debug.Log("Get treasure!");

			//levelScore = PlayerPrefs.GetInt ("CurrentScore");
			Debug.Log (levelScore);

			//Load the Current Score into a score dedicated to that level
			levelScore = PlayerPrefs.GetInt("CurrentScore");
			PlayerPrefs.SetInt (level, levelScore);
			displayScore = PlayerPrefs.GetInt (level);
			beachScore = PlayerPrefs.GetInt ("beach");
			jungleScore = PlayerPrefs.GetInt ("jungle");
			volcanoScore = PlayerPrefs.GetInt ("volcano");
			castleScore = PlayerPrefs.GetInt ("castle");

			Debug.Log (displayScore);
			Debug.Log (beachScore);
			Debug.Log (jungleScore);
			Debug.Log (volcanoScore);
			Debug.Log (castleScore);

			//Destroy (collidedWith);	
			//score += 2000;
			//Debug.Log ("Score: "+ score);
		}  else if (collidedWith.tag.Equals ("Lava")) {
			//Debug.Log("Get treasure!");
			health--;
		}else if (collidedWith.tag.Equals ("Gem")) {
			//Debug.Log("Get treasure!");
			Destroy (collidedWith);
		}
	}
}
