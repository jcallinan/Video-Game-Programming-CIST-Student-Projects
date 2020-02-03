using UnityEngine;
using System.Collections;

public class Respawn : MonoBehaviour {

	public GameObject CK;
	public float minPos;
	public string scene;	
	public float restartDelay;
	public Vector3 respawnCK;

	void Awake(){
	}
	
	// Use this for initialization
	void Start () {
		
		Vector3 respawnCK = new Vector3 (-1000, -100, 0);
		
		
	}
	
	// Update is called once per frame
	void Update () {
		if (CK && CK.transform.position.y < minPos) {
			Debug.Log ("Eeeek!");
			//CK.SetActive (false);

			
			CK.transform.position = respawnCK;
		}
		
	}

	/*IEnumerator RespawnDelay(){
		yield return new WaitForSeconds(restartDelay);
	}*/
}