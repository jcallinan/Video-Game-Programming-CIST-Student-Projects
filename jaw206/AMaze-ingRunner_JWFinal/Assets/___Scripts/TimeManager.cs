using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class TimeManager : MonoBehaviour {

    public static float startingTime;
    public static float countingTime;
    public static GameObject characterPrefab;
    private Text theText;

	// Use this for initialization
	void Start () {
        theText = GetComponent<Text>();
        characterPrefab = GetComponent<GameObject>();
        startingTime = 25f;
        countingTime = startingTime;


	}

    // Update is called once per frame
    void Update()
    {

        if (Goal.goalMet)
        {
            return;
        }
        countingTime -= Time.deltaTime;
        theText.text = ":" + Mathf.Round(countingTime);
        if (TimeManager.countingTime <= 0)
        {
            Application.LoadLevel(0);
        }

    }
}
