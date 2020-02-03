using UnityEngine;
using System.Collections;

public class LevelSelect : MonoBehaviour {

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {		
		if (Input.GetKey ("1")) {
			Application.LoadLevel ("betabeach");
			
		}		
		if (Input.GetKey ("2")) {
			Application.LoadLevel ("protogriffin");
			
		}		
		if (Input.GetKey ("3")) {
			Application.LoadLevel ("betajungle");
			
		}		
		if (Input.GetKey ("4")) {
			Application.LoadLevel ("protoplant");
			
		}		
		if (Input.GetKey ("5")) {
			Application.LoadLevel ("betavolcano");
			
		}		
		if (Input.GetKey ("6")) {
			Application.LoadLevel ("protogolem");
			
		}		
		if (Input.GetKey ("7")) {
			Application.LoadLevel ("betacastle");
			
		}		
		if (Input.GetKey ("8")) {
			Application.LoadLevel ("protofinalboss");
			
		}	
		if (Input.GetKey ("9")) {
			Application.LoadLevel ("intro");
			
		}
	
	}
}
