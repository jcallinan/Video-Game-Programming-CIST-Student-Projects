using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class hiboshi : MonoBehaviour {

	public float timer;

	public GameObject Hiboshi;
	//public Vector3 newPosition = hiboshi.transform.position;
	//public Vector3 hiboshiPosition;



	// Use this for initialization
	void Start () {
		timer = 0;
	}
	
	// Update is called once per frame
	void Update () {
		timer += Time.deltaTime;
		Debug.Log (timer);


		if (timer > 3.0f) {
			/*int caseSwitch = Random.Range (1, 3);
			switch (caseSwitch) {
			case 1:
				newPosition.x = 0f;
				hiboshiPosition = newPosition;
				break;
			case 2:
				newPosition.x = -1000f;
				hiboshiPosition = newPosition;
				break;
			case 3:
				newPosition.x = 1000f;
				hiboshiPosition = newPosition;
				break;*/
			timer = 0;
		}
	
	}
}
