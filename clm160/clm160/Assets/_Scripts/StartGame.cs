using UnityEngine;
using System.Collections;

public class StartGame : MonoBehaviour {

	public string startLevel;

	void Awake(){
		
		PlayerPrefs.SetInt ("beach", 0);
		PlayerPrefs.SetInt ("jungle", 0);
		PlayerPrefs.SetInt ("volcano", 0);
		PlayerPrefs.SetInt ("castle", 0);
	}

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {

		if (Input.GetKey ("space")) {
			Application.LoadLevel (startLevel);

		}
		
		if (Input.GetKey ("d") && Input.GetKey ("b")) {
			Application.LoadLevel ("levelselect");
			
		}
	
	}
}
