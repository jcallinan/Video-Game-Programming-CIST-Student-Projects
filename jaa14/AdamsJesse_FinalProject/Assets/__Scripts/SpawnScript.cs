using UnityEngine;
using System.Collections;

public class SpawnScript : MonoBehaviour {
	public GameObject Obstacle;
	public GameObject TimeCapsule;
	public GameObject TimeToxin;
	public GameObject FenceLow;
	public GameObject FenceHigh;
	
	float timeElapsed = 0;
	float spawnCycle = 0.4f;
//	bool spawnPowerup = true;
	
	void Update () {
		timeElapsed += Time.deltaTime;

		System.Random rnd = new System.Random ();
		int spawnobject = rnd.Next (1, 6);

		if(timeElapsed > spawnCycle)
		{
			GameObject temp;

			if (spawnobject == 1) {
				
				temp = (GameObject)Instantiate(TimeCapsule);
				Vector3 pos = temp.transform.position;
				temp.transform.position = new Vector3(Random.Range(-3, 4), pos.y, pos.z);
				
			} else if (spawnobject == 2) {
				
				temp = (GameObject)Instantiate(Obstacle);
				Vector3 pos = temp.transform.position;
				temp.transform.position = new Vector3(Random.Range(-3, 4), pos.y, pos.z);
				
			} else if (spawnobject == 3) {
				
				temp = (GameObject)Instantiate(TimeToxin);
				Vector3 pos = temp.transform.position;
				temp.transform.position = new Vector3(Random.Range(-3, 4), pos.y, pos.z);
				
			} else if (spawnobject == 4) {
				
				temp = (GameObject)Instantiate(FenceLow);
				Vector3 pos = temp.transform.position;
				temp.transform.position = new Vector3(Random.Range(-3, 4), pos.y, pos.z);
				
			} else if (spawnobject == 5) {
				
				temp = (GameObject)Instantiate(FenceHigh);
				Vector3 pos = temp.transform.position;
				temp.transform.position = new Vector3(Random.Range(-3, 4), pos.y, pos.z);
				
			}

			timeElapsed -= spawnCycle;
		}
	}
}
