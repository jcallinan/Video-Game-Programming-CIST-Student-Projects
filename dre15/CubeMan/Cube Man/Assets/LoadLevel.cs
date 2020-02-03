using UnityEngine;
using System.Collections;

public class LoadLevel : MonoBehaviour {

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		if (Input.GetKey (KeyCode.Space)) {
			Application.LoadLevel ("Scene_1");
			
			
		}

	}
	public void ChangetoScene (int SceneToChangeTo) {

		Application.LoadLevel ("Scene_1");

	
	
	}

}


