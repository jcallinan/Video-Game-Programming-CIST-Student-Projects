using UnityEngine;
using System.Collections;

public class AdvanceCutscene : MonoBehaviour {

	public string nextLevel;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		
		if (Input.GetKey ("space")) {
			Application.LoadLevel (nextLevel);
			
		}

		
		if (Input.GetKey ("return")) {
			Application.LoadLevel ("levelselect");
			
		}
	
	}
}
