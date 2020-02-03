using UnityEngine;
using System.Collections;

public class Meragidd : MonoBehaviour {
	public GameObject blackOpal;

	public bool isAlive;

	// Use this for initialization
	void Start () {

		isAlive = true;
	
	}
	
	// Update is called once per frame
	void Update () {

		
		if (transform.position.y < -10000f) {
			blackOpal.SetActive (true);
			Destroy(this.gameObject);
	
	}
}
}
