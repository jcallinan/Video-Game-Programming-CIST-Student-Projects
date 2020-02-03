using UnityEngine;
using System.Collections;

public class MainMenuScript : MonoBehaviour 
{
	public GUISkin myskin;  //custom GUIskin reference
	public string gameLevel;
	public string optionsLevel;
	
	private void OnGUI()
	{
		GUI.skin=myskin;   //use the custom GUISkin
		
		GUI.Box(new Rect(Screen.width/4, Screen.height/4, Screen.width/2, Screen.height/2), "Time Scooter");
		
		if (GUI.Button(new Rect(Screen.width/4+10, Screen.height/4+Screen.height/10+10, Screen.width/2-20, Screen.height/10), "PLAY")){
			Application.LoadLevel(1);
		}
		
		if (GUI.Button(new Rect(Screen.width/4+10, Screen.height/4+3*Screen.height/10+10, Screen.width/2-20, Screen.height/10), "EXIT")){
			//Application.Quit();
			System.Diagnostics.Process.GetCurrentProcess().Kill();
		}
	}
}
