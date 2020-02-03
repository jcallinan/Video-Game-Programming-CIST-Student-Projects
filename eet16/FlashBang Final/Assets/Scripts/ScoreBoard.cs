using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class ScoreBoard : MonoBehaviour
{
	public static int score;        // The player's score.
//	public int newHighscore;
	
	Text text;                      // Reference to the Text component.
	
	
	void Awake ()
	{
		// Set up the reference.
		text = GetComponent <Text> ();
		
		// Reset the score.
		score = 0;
//	
//		newHighscore = score;
	}
	
	
	void Update ()
	{
		// Set the displayed text to be the word "Score" followed by the score value.
		text.text = "Score: " + score;
//		newHighscore = score;
//		StoreHighscore (score);
	}
//	private void StoreHighscore(int newHighscore)
//	{
//		int oldHighscore = PlayerPrefs.GetInt("highscore", 0);    
//		if(newHighscore > oldHighscore)
//			PlayerPrefs.SetInt("highscore", newHighscore);
//	}
}