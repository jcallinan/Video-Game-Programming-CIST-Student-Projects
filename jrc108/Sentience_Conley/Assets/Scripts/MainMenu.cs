using UnityEngine;
using System.Collections;

public class MainMenu : MonoBehaviour {
	

	public void Test() {
		Application.LoadLevelAsync (1);
	}
	public void Quit() {
		Application.Quit ();
	}
	public void Info() {
		Application.LoadLevelAsync (2);
	}
	public void Back (){
		Application.LoadLevelAsync (0);
	}
	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
