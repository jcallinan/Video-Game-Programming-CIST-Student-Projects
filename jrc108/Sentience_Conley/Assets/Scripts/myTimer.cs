using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class myTimer : MonoBehaviour {
	static float mytimer =	360f;
	public Text text_box;

	// Use this for initialization
	void Start () {
		if (mytimer <= 0) {
			mytimer = 360f;
		}
	}
	
	// Update is called once per frame
	void Update () {

		if (mytimer > 0) {
			mytimer -= Time.deltaTime;	

		}
		else if(mytimer<=0){
			Application.LoadLevel(3);
		}
		int minutes;
		int seconds;
		minutes = (int) ((Mathf.Round(mytimer))) / 60;
		seconds = (int) (Mathf.Round(mytimer)) - (minutes * 60);

		text_box.text = minutes.ToString() + " minutes, " + seconds.ToString() + " seconds.";
}
}