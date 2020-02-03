using UnityEngine;
using System.Collections;

public class FenceLow : MonoBehaviour {
	public float objectSpeed = -0.2f;
	
	void Update () {
		if(Time.timeScale==1){
			transform.Translate(0, 0, objectSpeed);
		}
		if (gameObject.transform.position.z <= -10) Destroy(this.gameObject);
	}
}
