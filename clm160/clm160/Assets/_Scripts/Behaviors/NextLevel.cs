using UnityEngine;
using System.Collections;

public class NextLevel : MonoBehaviour {

	public GameObject CK;
	public float endLevel;
	public string nextLevel;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {

		if (CK.transform.position.x > endLevel) {
			
			Application.LoadLevel (nextLevel);

		}



	
	}
}
