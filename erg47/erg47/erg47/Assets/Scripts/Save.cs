using UnityEngine;
using System.Collections;

public class Save : MonoBehaviour {


	public float saveTimer = 0.0f;
	
	
	void Update(){
		saveTimer += 1.0f * Time.deltaTime;
		if(saveTimer > 30.0f){
			saveTimer = 0.0f;
			SaveGame();
		}
	}
	
	
	void SaveGame()
	{
		GetComponent<Click>().gold = PlayerPrefs.GetFloat("gold");
		GetComponent<Click>().goldperclick = PlayerPrefs.GetFloat("goldperclick");
		GetComponent<ItemManager>().cost = PlayerPrefs.GetFloat("cost");
		GetComponent<UpgradeManager>().cost = PlayerPrefs.GetFloat("cost");
	}






}
