using UnityEngine;
using System.Collections;

public class RestartLevel : MonoBehaviour {

	public GameObject CK;
	public float minPos;
	public string scene;	
	public float restartDelay;

	// Use this for initialization
	void Start () {

		

	
	}
	
	// Update is called once per frame
	void Update () {
		if (CK && CK.transform.position.y < minPos) {
			Destroy (CK);
			Debug.Log ("Eeeek!");

			
			DelayedRestart (restartDelay);
		}
	
	}

	public void DelayedRestart(float restartDelay){
		//Invoke the Restart() method in delay seconds
		Invoke ("Restart", restartDelay);
	}
	
	public void Restart(){
		//Reload _Scene_0 to restart the game
		Application.LoadLevel (scene);
	}


}
