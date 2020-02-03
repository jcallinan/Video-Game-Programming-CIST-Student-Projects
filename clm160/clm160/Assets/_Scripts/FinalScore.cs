using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class FinalScore : MonoBehaviour {

	public int beachScore, jungleScore, volcanoScore, castleScore, totalScore;
	public Text finalText;
	//public GUIText finalText;

	// Use this for initialization
	void Start () {

		beachScore = PlayerPrefs.GetInt("beach");
		jungleScore = PlayerPrefs.GetInt("jungle");
		volcanoScore = PlayerPrefs.GetInt("volcano");
		castleScore = PlayerPrefs.GetInt("castle");
		totalScore = beachScore + jungleScore + volcanoScore + castleScore;


		print ("Beach Treasures: " + beachScore + "/6");
		print ("Jungle Treasures: " + jungleScore + "/6");
		print ("Volcano Treasures: " + volcanoScore + "/6");
		print ("Castle Treasures: " + castleScore + "/6");
		print ("Total Treasures: " + totalScore + "/24");

		print ("Game By Codie Martin");
		print ("Music by Kevin MacCleod");
		print ("Thank you for playing!");

		finalText.text = "Beach Treasures: " + beachScore + "/6\n" +
			"Jungle Treasures: " + jungleScore + "/6\n" +
			"Volcano Treasures: " + volcanoScore + "/6\n" + 
			"Castle Treasures: " + castleScore + "/6\n" +
			"Total Treasures: " + totalScore + "/24\n" +
			"\n" +
			"Game By: Codie Martin\n" +
			"Music By: Kevin MacLeod\n" +
				"\n" +
			"Thank you for playing!";

	
	}


	
	// Update is called once per frame
	void Update () {
	
	}
}
