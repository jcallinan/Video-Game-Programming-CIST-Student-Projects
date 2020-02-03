using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class Victory : MonoBehaviour {

    public static float score;

    public static float victoryScoreTime;
    public static Text scoreText;


    // Use this for initialization
    void Start () {
        scoreText = GetComponent<Text>();
        victoryScoreTime = 0;

    }
	
	// Update is called once per frame
	void Update () {
        if (Goal.goalMet)
        {
            return;
        }
        victoryScoreTime = TimeManager.countingTime;
        scoreText.text = "" + Mathf.Round(victoryScoreTime);

    }
}

