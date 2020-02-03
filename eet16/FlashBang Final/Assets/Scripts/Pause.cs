using UnityEngine;
using System.Collections;

public class Pause : MonoBehaviour {
	public GUISkin Pausemenu;
	public string levelToLoad;
	public bool paused = false;
	// Use this for initialization
	void Start () {
		Time.timeScale = 1; 
	}
	
	// Update is called once per frame
	void Update () {
		if (Input.GetKeyDown (KeyCode.Escape)) {
		
			if(paused)
				paused =false;
			else
				paused=true;
		}

		if (paused) {
			AudioListener.pause = true;
			Time.timeScale = 0;

		} else {
			AudioListener.pause = false;
			Time.timeScale = 1;
		}

	}
	private void OnGUI() {
	
		GUI.skin = Pausemenu;

		if (paused) {
		
			GUI.Box (new Rect(Screen.width/4, Screen.height/4, Screen.width/2, Screen.height/2), "Paused");

			if(GUI.Button(new Rect(Screen.width/4+10,Screen.height/4+Screen.height/10+10,Screen.width/2-20,Screen.height/10), "Restart")){
				Application.LoadLevel(Application.loadedLevel);
			}

			if(GUI.Button(new Rect(Screen.width/4+10,Screen.height/4+2*Screen.height/10+10,Screen.width/2-20,Screen.height/10), "Resume")){
				paused = false;
			}
			if(GUI.Button(new Rect(Screen.width/4+10,Screen.height/4+3*Screen.height/10+10,Screen.width/2-20,Screen.height/10), "Quit")){
				System.Diagnostics.Process.GetCurrentProcess().Kill();
			}
		}
	}
}

